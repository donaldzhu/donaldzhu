import _ from 'lodash'
import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { mapObject } from '../utils/commonUtils'
import type p5 from 'p5'
import type {
  GlobalCanvasStates,
  SketchEventHandlers
} from '../components/common/canvas/canvasTypes'
import type { Device } from '../utils/queryUtil'

const useLocalCanvas = <T extends Device>(
  createSketch: () => SketchEventHandlers<T>,
  config?: GlobalCanvasStates<T>
) => {
  const outletContext = useOutletContext<GlobalCanvasStates<T>>()
  const { canvasStates } = _.defaults(config ?? {}, outletContext)

  return useMemo(() => mapObject(createSketch(),
    (__, callback) => callback ?
      (p5: p5) => callback(p5, canvasStates) :
      _.noop
  ), [])
}

export default useLocalCanvas