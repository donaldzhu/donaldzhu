import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { loopObject } from '../utils/commonUtils'
import { P5Event } from '../utils/p5Utils'
import { validateRef } from '../utils/typeUtils'
import type p5 from 'p5'
import type { Device } from '../utils/queryUtil'
import type {
  GlobalCanvasStates,
  p5Callback,
  SketchEventHandlers,
  TypedCanvasStates
} from '../components/common/canvas/canvasTypes'

const useCanvas = <T extends Device>(
  createSketch: () => SketchEventHandlers<T> & {
    cleanup?: (canvasStates: TypedCanvasStates<T>) => void
  },
  config?: GlobalCanvasStates<T>
) => {
  const [setupDone, setSetupDone] = useState(false)
  const outletContext = useOutletContext<GlobalCanvasStates<T>>()
  const { canvasRef, canvasStates } = _.defaults(config ?? {}, outletContext)

  if (!validateRef(canvasRef))
    throw new Error('No canvasRef is passed to canvas.')

  const { setup, draw, cleanup, ...callbacks } = useMemo(createSketch, [])

  const registeredCallbacks: (() => void)[] = []
  const registerCallback = (eventName: P5Event, callback: p5Callback) => {
    canvasRef.current[eventName].push(callback)
    registeredCallbacks.push(() => { _.pull(canvasRef.current[eventName], callback) })
  }

  const unregisterCallbacks = () => registeredCallbacks.forEach(unregister => unregister())

  useEffect(() => {
    const setupOnce = _.once(setup ?? _.noop)
    const drawFunction = (p5: p5) => {
      setupOnce(p5, canvasStates ?? {})
      if (draw) draw(p5, canvasStates ?? {})
      setSetupDone(true)
    }

    registerCallback(P5Event.draw, drawFunction)
    loopObject(callbacks, (eventName, callback) =>
      registerCallback(eventName, (p5: p5) => {
        if (callback) callback(p5, canvasStates ?? {})
      }))

    return () => {
      unregisterCallbacks()
      if (cleanup) cleanup(canvasStates ?? {})
    }
  }, [])

  return setupDone
}

export default useCanvas