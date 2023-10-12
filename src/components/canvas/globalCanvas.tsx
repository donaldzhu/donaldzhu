import { styled } from 'styled-components'
import _ from 'lodash'
import p5 from 'p5'
import Canvas from './canvas'
import { mousePosition, P5Events, wrapDrawingContext } from '../../utils/p5Utils'
import { getVh, getVw, mapObject } from '../../utils/commonUtils'
import mixins from '../../styles/mixins'
import { GlobalCanvasStates, p5EventCallback } from './canvasTypes'

const GlobalCanvas = ({ canvasRef, canvasStateRefs }: GlobalCanvasStates) => {
  const setup = (p5: p5, canvasParent: HTMLDivElement) =>
    p5.createCanvas(getVw(), getVh()).parent(canvasParent)

  const draw = (p5: p5) => {
    p5.clear(0, 0, 0, 0)
    handleEvent(p5, P5Events.draw)
  }

  const mouseMoved = (p5: p5) => {
    const { mousePositionRef } = canvasStateRefs
    mousePositionRef.current = mousePosition(p5)
    handleEvent(p5, P5Events.mouseMoved)
  }

  const windowResized = (p5: p5) => {
    p5.resizeCanvas(getVw(), getVh())
    handleEvent(p5, P5Events.windowResized)
  }

  const handleEvent = (p5: p5, eventName: P5Events) => {
    const handlers = canvasRef.current[eventName]
    if (handlers.length) handlers.forEach(handler =>
      wrapDrawingContext(p5, () => handler(p5))
    )
  }

  const handlers = mapObject<Record<P5Events, string>, p5EventCallback>(P5Events, eventName => (p5: p5) => { handleEvent(p5, eventName) })
  const otherHandlers = _.omit(handlers, [P5Events.draw, P5Events.mouseMoved, P5Events.windowResized])

  return (
    <CanvasStyled
      setup={setup}
      draw={draw}
      mouseMoved={mouseMoved}
      windowResized={windowResized}
      {...otherHandlers} />
  )
}

const CanvasStyled = styled(Canvas)`
  ${mixins.fixed()}
  pointer-events: none;
  mix-blend-mode: multiply;
`

export default GlobalCanvas