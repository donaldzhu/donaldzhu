import { sketchSizes } from '../../styles/sizes'
import { styleDashedRect, wrapDrawingContext } from '../../utils/p5Utils'
import { validateRef } from '../../utils/typeUtils'
import type p5 from 'p5'
import type { DesktopCanvasStates } from '../../components/common/canvas/canvasTypes'

const drawCursor = () => {
  const draw = (p5: p5, { mousePositionRef, hideCursorRef }: DesktopCanvasStates) => {
    if (!validateRef(mousePositionRef) || !!hideCursorRef?.current) return

    wrapDrawingContext(p5, () => {
      styleDashedRect(p5)
      p5.rectMode(p5.CENTER)
      p5.rect(
        p5.mouseX,
        p5.mouseY,
        sketchSizes.desktop.cursor.value,
        sketchSizes.desktop.cursor.value
      )
    })
  }

  return { draw }
}

export default drawCursor