import _ from 'lodash'
import p5 from 'p5'
import { DependencyList, useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  GlobalCanvasStates,
  p5Callback,
  sketchEventCallback,
  SketchEventHandler
} from '../components/canvas/canvasTypes'
import { loopObject } from '../utils/commonUtils'
import { P5Event } from '../utils/p5Utils'
import { validateRef } from '../utils/typeUtils'


const useCanvas = (
  createSketch: () => Partial<SketchEventHandler> & {
    draw: sketchEventCallback
  },
  config: Partial<GlobalCanvasStates> = {},
  dependencies: DependencyList = []
) => {
  const [setupDone, setSetupDone] = useState(false)
  const outletContext = useOutletContext()
  const { canvasRef, canvasStateRefs } = _.defaults(config, outletContext)

  if (!validateRef(canvasRef) || !canvasStateRefs)
    throw new Error('No canvasRef or canvasStateRefs is passed to canvas.')

  const { setup, draw, cleanup, ...callbacks } = useMemo(createSketch, dependencies)

  const registeredCallbacks: (() => void)[] = []
  const registerCallback = (eventName: P5Event, callback: p5Callback) => {
    canvasRef.current[eventName].push(callback)
    registeredCallbacks.push(() => { _.pull(canvasRef.current[eventName], callback) })
  }

  const unregisterCallbacks = () => registeredCallbacks.forEach(unregister => unregister())

  useEffect(() => {
    const setupOnce = _.once(setup ?? _.noop)
    const drawFunction = (p5: p5) => {
      setupOnce(p5, canvasStateRefs)
      draw(p5, canvasStateRefs)
      setSetupDone(true)
    }

    registerCallback(P5Event.draw, drawFunction)
    loopObject(callbacks, (eventName, callback) =>
      registerCallback(eventName, (p5: p5) => {
        if (callback) callback(p5, canvasStateRefs)
      }))

    return () => {
      unregisterCallbacks()
      if (cleanup) cleanup(canvasStateRefs)
    }
  }, dependencies)

  return setupDone
}

export default useCanvas