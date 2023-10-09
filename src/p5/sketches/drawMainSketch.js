import Text from '../helpers/vector/text'
import { repeatMap } from '../../utils/commonUtils.ts'
import { wrapDrawingContext } from '../../utils/p5Utils'
import ElemRect from '../../utils/helpers/elemRect'
import colors from '../../styles/colors'
import sizes from '../../styles/sizes'
import { dashLineConfigs } from '../configs/pageBorders'
import configs from '../configs/vector'

const drawMainSketch = ({ placeholderRef }) => {
  const UPPER_TEXT_CONTENT = 'WORK IN\nPROGRESS'
  const LOWER_TEXT_CONTENT = 'DONALD\nZHU'

  const placeholder = new ElemRect(placeholderRef, -sizes.mainSketchAnchorOffset())
  let upperText, lowerText
  let mouseOrigin = []

  const createVectors = p5 => {
    const [x, y] = placeholder.center
    const centerPadding = sizes.mainSketchCenterPadding()

    upperText = new Text(p5, {
      ...configs.MAIN_UPPER, x, y
    })

    const { h: upperH } = upperText.getBounds(UPPER_TEXT_CONTENT)
    upperText.setTransform({ y: y - (upperH + centerPadding) / 2 })

    lowerText = new Text(p5, {
      ...configs.MAIN_LOWER, x, y
    })

    const { h: lowerH } = lowerText.getBounds(LOWER_TEXT_CONTENT)
    lowerText.setTransform({ y: y + (lowerH + centerPadding) / 2 })

    mouseOrigin = placeholder.center
    upperText.setMouseOrigin(mouseOrigin)
    lowerText.setMouseOrigin(mouseOrigin)
  }

  const setup = createVectors

  const draw = (p5, { mousePositionRef }) => {
    let { CENTER, ROUND, mouseX, mouseY } = p5
    const halfCursorSize = dashLineConfigs.cursorSize() / 2

    upperText.write(UPPER_TEXT_CONTENT)
    lowerText.write(LOWER_TEXT_CONTENT)

    if (!mousePositionRef.current) return
    const anchorSize = sizes.mainSketchAnchorSize()
    const { x1, y1, x2, y2 } = placeholder

    const getCoors = (xCoors, yCoors) => repeatMap(4, i => [xCoors[Math.floor(i / 2)], yCoors[i % 2]])
    const anchors = getCoors([x1, x2], [y1, y2])
    const cursorCoors = getCoors([mouseX - halfCursorSize, mouseX + halfCursorSize], [mouseY - halfCursorSize, mouseY + halfCursorSize])

    wrapDrawingContext(p5, () => {
      p5.noStroke()
      p5.fill(colors.homeSketch)
      p5.ellipseMode(CENTER)

      anchors.forEach(anchor =>
        p5.ellipse(...anchor, anchorSize, anchorSize))

      p5.drawingContext.setLineDash(dashLineConfigs.lineDash())
      p5.stroke(colors.dashLine)
      p5.strokeCap(ROUND)
      p5.strokeWeight(dashLineConfigs.lineWeight())

      anchors.forEach((anchor, i) =>
        p5.line(...anchor, ...cursorCoors[i]))
    })
  }

  const windowResized = createVectors

  return { setup, draw, windowResized }
}


export default drawMainSketch