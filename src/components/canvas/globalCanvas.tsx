import _ from 'lodash'
import p5 from 'p5'
import styled from 'styled-components'
import { Engine } from 'matter-js'
import mixins from '../../styles/mixins'
import { mapObject } from '../../utils/commonUtils'
import { mousePosition, P5Event, wrapDrawingContext } from '../../utils/p5Utils'
import { getVh, getVw } from '../../utils/sizeUtils'
import { Device } from '../../utils/queryUtil'
import Canvas from './canvas'
import { GlobalCanvasStates, p5EventCallback } from './canvasTypes'

const GlobalCanvas = <T extends Device>({
  canvasRef,
  canvasStates = {}
}: GlobalCanvasStates<T>) => {
  const setup = (p5: p5, canvasParent: HTMLDivElement) =>
    p5.createCanvas(getVw(), getVh()).parent(canvasParent)

  const draw = (p5: p5) => {
    p5.clear(0, 0, 0, 0)
    if ('engine' in canvasStates && canvasStates.engine)
      Engine.update(canvasStates.engine)
    handleEvent(p5, P5Event.draw)
  }

  const mouseMoved = (p5: p5) => {
    if ('mousePositionRef' in canvasStates && canvasStates.mousePositionRef)
      canvasStates.mousePositionRef.current = mousePosition(p5)
    handleEvent(p5, P5Event.mouseMoved)
  }

  const windowResized = (p5: p5) => {
    p5.resizeCanvas(getVw(), getVh())
    handleEvent(p5, P5Event.windowResized)
  }

  const handleEvent = (p5: p5, eventName: P5Event) => {
    const handlers = canvasRef.current[eventName]
    if (handlers.length) handlers.forEach(handler =>
      wrapDrawingContext(p5, () => handler(p5))
    )
  }

  const handlers = mapObject<Record<P5Event, string>, p5EventCallback>(
    P5Event, eventName => (p5: p5) => { handleEvent(p5, eventName) })
  const otherHandlers = _.omit(handlers, [P5Event.draw, P5Event.mouseMoved, P5Event.windowResized])

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
  ${mixins
    .chain()
    .highZIndex(1)
    .fixed()}
  pointer-events: none;
  mix-blend-mode: multiply;
`

export default GlobalCanvas