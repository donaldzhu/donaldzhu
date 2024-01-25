import _ from 'lodash'
import styled from 'styled-components'
import { Engine } from 'matter-js'
import mixins from '../../../styles/mixins'
import { mapObject } from '../../../utils/commonUtils'
import { mousePosition, P5Event, wrapDrawingContext } from '../../../utils/p5Utils'
import Canvas from './canvas'
import type p5 from 'p5'
import type { Device } from '../../../utils/breakptTypes'
import type { p5EventCallback, PartialGlobalCanvasStates } from './canvasTypes'

const GlobalCanvas = <T extends Device>({
  canvasRef,
  canvasStates,
  className,
}: PartialGlobalCanvasStates<T> & {
  className?: string
}) => {
  const draw = (p5: p5) => {
    if ('engine' in canvasStates)
      Engine.update(canvasStates.engine)
    handleEvent(p5, P5Event.draw)
  }

  const mouseMoved = (p5: p5) => {
    if ('mousePositionRef' in canvasStates)
      canvasStates.mousePositionRef.current = mousePosition(p5)
    handleEvent(p5, P5Event.mouseMoved)
  }

  const handleEvent = (p5: p5, eventName: P5Event) => {
    const handlers = canvasRef.current[eventName]
    if (handlers.length) handlers.forEach(handler =>
      wrapDrawingContext(p5, () => handler(p5))
    )
  }

  const handlers = mapObject<Record<P5Event, string>, p5EventCallback>(
    P5Event, eventName => (p5: p5) => { handleEvent(p5, eventName) })
  const otherHandlers = _.omit(handlers, [P5Event.draw, P5Event.mouseMoved])

  return (
    <StyledCanvas
      draw={draw}
      mouseMoved={mouseMoved}
      className={className}
      {...otherHandlers} />
  )
}

const StyledCanvas = styled(Canvas)`
  ${mixins
    .chain()
    .fixed()
    .highZIndex(1)}
  width: 100dvw;
  height: 100dvh;
  pointer-events: none;
  mix-blend-mode: multiply;
`

export default GlobalCanvas