import { styled } from 'styled-components'
import _ from 'lodash'
import Canvas from './canvas'
import { mousePosition, P5_EVENTS, wrapDrawingContext } from '../../utils/p5Utils'
import { getVh, getVw } from '../../utils/commonUtils.ts'
import mixins from '../../styles/mixins'

const GlobalCanvas = ({ canvasRef, canvasStateRefs, zIndex = 1 }) => {
  const setup = (p5, canvasParentRef) =>
    p5.createCanvas(getVw(), getVh()).parent(canvasParentRef)

  const draw = p5 => {
    p5.clear()
    handleEvent(p5, P5_EVENTS.draw)
  }

  const mouseMoved = p5 => {
    const { mousePositionRef } = canvasStateRefs
    mousePositionRef.current = mousePosition(p5)
    handleEvent(p5, P5_EVENTS.mouseMoved)
  }

  const windowResized = p5 => {
    p5.resizeCanvas(getVw(), getVh())
    handleEvent(p5, P5_EVENTS.windowResized)
  }

  const handleEvent = (p5, eventName) => {
    const handlers = canvasRef.current[eventName]
    if (handlers.length) handlers.forEach(handler =>
      wrapDrawingContext(p5, () => handler(p5))
    )
  }

  const otherHandlers = _.without(P5_EVENTS.keys, P5_EVENTS.draw, P5_EVENTS.mouseMoved, P5_EVENTS.windowResized)
    .reduce((allHandlers, eventName) => {
      allHandlers[eventName] = p5 => { handleEvent(p5, eventName) }
      return allHandlers
    }, {})

  return (
    <CanvasStyled
      setup={setup}
      draw={draw}
      mouseMoved={mouseMoved}
      windowResized={windowResized}
      $zIndex={zIndex}
      {...otherHandlers} />
  )
}

const CanvasStyled = styled(Canvas)`
  ${mixins.fixed()}
  z-index: ${({ $zIndex }) => $zIndex};
  pointer-events: none;
  mix-blend-mode: multiply;
`

export default GlobalCanvas