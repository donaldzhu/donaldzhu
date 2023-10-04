import { wrapDrawingContext } from '../../utils/p5Utils'
import colors from '../../styles/colors'
import { dashLineConfigs } from '../configs/pageBorders'

const drawCursor = () => {
  const draw = (p5, { mousePositionRef, hideCursorRef }) => {
    if (!mousePositionRef.current || hideCursorRef.current)
      return

    wrapDrawingContext(p5, () => {
      p5.rectMode(p5.CENTER)
      p5.noFill()
      p5.drawingContext.setLineDash(dashLineConfigs.lineDash())
      p5.stroke(colors.dashLine)
      p5.strokeWeight(dashLineConfigs.lineWeight())

      const cursorSize = dashLineConfigs.cursorSize()
      p5.rect(p5.mouseX, p5.mouseY, cursorSize, cursorSize)
    })
  }

  return { draw }
}

export default drawCursor