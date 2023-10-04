import _ from 'lodash'
import Brush from '../helpers/brush/brush'
import FlatBrush from '../helpers/brush/flatBrush'
import { getVw, mapObject } from '../../utils/commonUtils'
import { intersectTwoCircles, parsePoints, wrapDrawingContext } from '../../utils/p5Utils'
import ElemRect from '../../utils/helpers/elemRect'
import colors from '../../styles/colors'
import sizes from '../../styles/sizes'
import config from '../configs/stroke'

const drawPanto = ({ isClearingRef, placeholderRef }) => {
  const vectors = {
    anchor: undefined,
    primary: undefined,
    secondary: undefined,

    topRight: undefined,
    rightMid: undefined,
    leftBot: undefined,
    leftMid: undefined
  }

  const placeholder = new ElemRect(placeholderRef)
  const paddedPlaceholder = new ElemRect(placeholderRef, sizes.pantoHoverPadding())

  let brushes = []
  let graphic
  let armLength

  let isHovering = false
  let isHoveringStrict = false
  let lastHoverTimeStamp

  const setup = p5 => {
    p5.background(255)
    p5.ellipseMode(p5.CENTER)
    p5.noFill()
    createPanto(p5)
  }

  const draw = (p5, { hideCursorRef }) => {
    const isClearing = isClearingRef.current
    if (isClearing) clear()

    const debounce = 100
    isHoveringStrict = placeholder.mouseIsOver(p5.mouseX, p5.mouseY)
    const isOver = paddedPlaceholder.mouseIsOver(p5.mouseX, p5.mouseY)

    isHovering = true
    if (isOver) lastHoverTimeStamp = Date.now()
    else if (!lastHoverTimeStamp || Date.now() - lastHoverTimeStamp >= debounce) {
      isHovering = false
      lastHoverTimeStamp = undefined
    }

    updateVector(p5)
    const shouldDrawMarks = p5.mouseIsPressed && isHovering && !isClearing
    drawVectors(p5, hideCursorRef, shouldDrawMarks)
  }

  const cleanup = ({ hideCursorRef }) => {
    hideCursorRef.current = false
    graphic && graphic.canvas.remove()
  }

  const createPanto = p5 => {
    const { w, h } = placeholder
    armLength = w / 1.985
    if (graphic) graphic.canvas.remove()
    graphic = p5.createGraphics(w, h)
    brushes = [
      new Brush(config.PRIMARY_BRUSH, p5, graphic),
      new FlatBrush(config.SECONDARY_BRUSH, p5, graphic),
    ]
  }

  const windowResized = createPanto

  const clear = () => {
    graphic.clear()
    isClearingRef.current = false
  }

  const updateVector = p5 => {
    const [x1, y1, x2, y2] = placeholder.sides
    const halfHeight = (y2 - y1) / 2
    vectors.anchor = p5.createVector(...placeholder.toScreenCoors(0, halfHeight))

    if (!vectors.primary)
      vectors.primary = p5.createVector(
        ...placeholder.toScreenCoors(armLength * 1.9, halfHeight))

    const x = _.clamp(p5.mouseX, x1, x2)
    const y = _.clamp(p5.mouseY, y1, y2)

    vectors.primary = p5.createVector(x, y)
    const intersections = updatePivot(p5)
    vectors.topRight = intersections[0]
    vectors.leftBot = intersections[1]

    const { anchor, primary, topRight } = vectors

    const HALF_ARM_LENGTH = armLength / 2
    const verticalArm = primary.copy().sub(topRight)
    const horizontalArm = topRight.copy().sub(anchor)

    const armMid = verticalArm.copy().setMag(HALF_ARM_LENGTH)
    vectors.leftMid = anchor.copy().add(armMid)
    vectors.rightMid = topRight.copy().add(armMid)

    vectors.secondary = vectors.leftMid.copy().add(
      horizontalArm.setMag(HALF_ARM_LENGTH)
    )
  }

  const updatePivot = p5 => {
    const { anchor, primary } = vectors
    let intersections = intersectTwoCircles(
      anchor,
      armLength,
      primary,
      armLength
    )

    if (!intersections.length) {
      const newPrimary = primary.copy().sub(anchor)
      vectors.primary = anchor.copy().add(newPrimary.setMag(armLength * 2))
      const pivot = anchor.copy().add(newPrimary.setMag(armLength))
      return [pivot, pivot.copy()]
    }

    const pivotIndex = intersections.findIndex(intersection => {
      const intersectionVec = p5.createVector(...intersection)
      const arm1 = anchor.copy().sub(intersectionVec)
      const arm2 = intersectionVec.copy().sub(vectors.primary)
      const angle = arm1.angleBetween(arm2)
      return _.inRange(angle, Math.PI)
    })

    return [pivotIndex, pivotIndex ^ 1].map(index => p5.createVector(...intersections[index]))
  }

  const drawVectors = (p5, hideCursorRef, shouldDrawMarks) => {
    wrapDrawingContext(p5, () => {
      p5.stroke(0)

      const { primary, secondary } = vectors

      hideCursorRef.current = isHoveringStrict
      if (shouldDrawMarks)
        brushes.forEach((brush, i) =>
          brush.draw(...placeholder.toRectCoors(!i ? primary : secondary)))
      else brushes.forEach(brush => brush.stopDrawing())

      const pgPosition = placeholder.toScreenCoors(0, 0)
      p5.image(graphic, ...pgPosition)

      if (isHovering) drawPanto(p5)
    })
  }

  const drawPanto = p5 => {
    const { anchor, primary, topRight, leftBot, leftMid, rightMid } = vectors
    p5.stroke(colors.strokePanto)
    p5.strokeWeight(sizes.pantoLineWeight())
    wrapDrawingContext(p5, () => {
      p5.line(...parsePoints(anchor, leftBot))
      p5.line(...parsePoints(leftMid, rightMid))
      p5.line(...parsePoints(topRight, primary))
      p5.line(...parsePoints(anchor, topRight))
    })

    p5.strokeWeight(getVw(0.35))
    p5.fill(255)
    mapObject(vectors,
      (vectorKey, { x, y }) => {
        const drawingVectors = ['primary', 'secondary']
        if (drawingVectors.includes(vectorKey)) {
          p5.stroke(brushes[drawingVectors.indexOf(vectorKey)].setting.fill)
          p5.fill(255)
        } else {
          p5.stroke(colors.strokePanto)
          p5.fill(0)
        }
        p5.ellipse(x, y, sizes.pantoPointSize())
      })
  }

  return { setup, draw, windowResized, cleanup }
}

export default drawPanto
