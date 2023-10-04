import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import _ from 'lodash'
import { mapObject } from '../utils/commonUtils'
import { P5_EVENTS } from '../utils/p5Utils'

const useCanvas = (createSketch, config = {}, deps = []) => {
  const [setupDone, setSetupDone] = useState(false)
  const outletContext = useOutletContext()
  let {
    callbackRefs,
    canvasIndex = 0,
    canvasStateRefs
  } = config
  callbackRefs ??= outletContext.allCanvasCallbackRefs[canvasIndex]
  canvasStateRefs ??= outletContext.canvasStateRefs

  const { setup = _.noop, draw, cleanup = _.noop, ...callbacks } = useMemo(createSketch, deps)

  const registeredCallbacks = []
  const registerCallback = (eventName, callback) => {
    callbackRefs.current[eventName].push(callback)
    registeredCallbacks.push(() => _.pull(callbackRefs.current[eventName], callback))
  }

  const unregisterCallbacks = () => registeredCallbacks.forEach(unregister => unregister())

  useEffect(() => {
    const setupOnce = _.once(setup)
    const drawFunction = p5 => {
      setupOnce(p5, canvasStateRefs)
      draw(p5, canvasStateRefs)
      setSetupDone(true)
    }

    registerCallback(P5_EVENTS.draw, drawFunction)
    mapObject(callbacks, (eventName, callback) =>
      registerCallback(eventName, p5 => callback(p5, canvasStateRefs)))

    return () => {
      unregisterCallbacks()
      cleanup(canvasStateRefs)
    }
  }, deps)

  return setupDone
}

export default useCanvas