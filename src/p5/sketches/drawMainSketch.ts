import p5 from 'p5'
import { DesktopCanvasStates } from '../../components/canvas/canvasTypes'
import colors from '../../styles/colors'
import { sketchSizes } from '../../styles/sizes'
import { repeat, repeatMap } from '../../utils/commonUtils'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { wrapDrawingContext } from '../../utils/p5Utils'
import { validateRef } from '../../utils/typeUtils'
import { coorTuple } from '../../utils/utilTypes'
import configs from '../configs/vector'
import Text from '../helpers/vector/text'
import { PlaceholderProp } from './sketchTypes'

const drawMainSketch = ({ placeholderRef }: PlaceholderProp) => {
  let placeholder: ElemRect<HTMLDivElement>
  let upperText: Text, lowerText: Text
  let mouseOrigin: coorTuple | [] = []

  const createVectors = (p5: p5) => {
    const [x, y] = placeholder.center
    const centerPadding = sketchSizes.desktop.main.centerPadding.value

    upperText = new Text(p5, 'WORK IN\nPROGRESS', {
      ...configs.MAIN_UPPER, x, y
    })

    const { h: upperH } = upperText.bounds
    upperText.setTransform({ y: y - (upperH + centerPadding) / 2 })

    lowerText = new Text(p5, 'DONALD\nZHU', {
      ...configs.MAIN_LOWER, x, y
    })

    const { h: lowerH } = lowerText.bounds
    lowerText.setTransform({ y: y + (lowerH + centerPadding) / 2 })

    mouseOrigin = placeholder.center
    upperText.setMouseOrigin(mouseOrigin)
    lowerText.setMouseOrigin(mouseOrigin)
  }

  const setup = (p5: p5) => {
    if (!validateRef(placeholderRef))
      throw new Error('Main sketch has no placeholder ref.')
    placeholder = new ElemRect(placeholderRef, -sketchSizes.desktop.main.anchor.offset.value)
    createVectors(p5)
  }

  const draw = (p5: p5, { mousePositionRef }: DesktopCanvasStates) => {
    const { CENTER, ROUND, mouseX, mouseY } = p5
    const halfCursorSize = sketchSizes.desktop.cursor.value / 2

    upperText.write()
    lowerText.write()

    if (!mousePositionRef?.current) return
    const anchorSize = sketchSizes.desktop.main.anchor.size.value
    const { x1, y1, x2, y2 } = placeholder

    const getCoors = (xCoors: coorTuple, yCoors: coorTuple) =>
      repeatMap(4, i => {
        const result: coorTuple = [xCoors[Math.floor(i / 2)], yCoors[i % 2]]
        return result
      })
    const anchors = getCoors([x1, x2], [y1, y2])
    const cursorCoors = getCoors(
      [mouseX - halfCursorSize, mouseX + halfCursorSize],
      [mouseY - halfCursorSize, mouseY + halfCursorSize]
    )

    wrapDrawingContext(p5, () => {
      p5.noStroke()
      p5.fill(colors.homeSketch)
      p5.ellipseMode(CENTER)

      anchors.forEach(anchor =>
        p5.ellipse(...anchor, anchorSize, anchorSize))

      p5.drawingContext.setLineDash(repeat(2, sketchSizes.desktop.line.dash.value))
      p5.stroke(colors.dashLine)
      p5.strokeCap(ROUND)
      p5.strokeWeight(sketchSizes.desktop.line.weight.value)

      anchors.forEach((anchor, i) =>
        p5.line(...anchor, ...cursorCoors[i]))
    })
  }

  const windowResized = createVectors

  return { setup, draw, windowResized }
}


export default drawMainSketch