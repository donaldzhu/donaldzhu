import { wrapDrawingContext } from '../../utils/p5Utils'
import colors from '../../styles/colors'
import p5 from 'p5'
import { CanvasState } from '../../components/canvas/canvasTypes'
import { sketchSizes } from '../../styles/sizes'
import { repeat } from '../../utils/commonUtils'

const drawCursor = () => {
  const draw = (p5: p5, { mousePositionRef, hideCursorRef }: CanvasState) => {
    if (!mousePositionRef.current || hideCursorRef.current) return

    wrapDrawingContext(p5, () => {
      p5.rectMode(p5.CENTER)
      p5.noFill()
      p5.drawingContext.setLineDash(repeat(2, sketchSizes.line.dash.value))
      p5.stroke(colors.dashLine)
      p5.strokeWeight(sketchSizes.line.weight.value)
      p5.rect(p5.mouseX, p5.mouseY, sketchSizes.cursor.value, sketchSizes.cursor.value)
    })
  }

  return { draw }
}

export default drawCursor