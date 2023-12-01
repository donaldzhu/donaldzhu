import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { mapObject } from '../utils/commonUtils'
import type p5 from 'p5'
import type {
  GlobalCanvasStates,
  SketchEventHandlers
} from '../components/common/canvas/canvasTypes'
import type { Device } from '../utils/breakptTypes'

const useLocalCanvas = <T extends Device>(
  createSketch: () => SketchEventHandlers<T>,
  config?: GlobalCanvasStates<T>
) => {
  const [setupDone, setSetupDone] = useState(false)
  const outletContext = useOutletContext<GlobalCanvasStates<T>>()
  const { canvasStates } = _.defaults(config ?? {}, outletContext)

  return {
    canvasHandlers: useMemo(() => mapObject(createSketch(),
      (event, callback) => callback ?
        (p5: p5) => {
          callback(p5, canvasStates)
          if (event === 'setup') setSetupDone(true)
        } : () => { setSetupDone(true) }
    ), []),
    setupDone
  }
}

export default useLocalCanvas