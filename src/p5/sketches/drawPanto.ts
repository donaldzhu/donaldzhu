import _ from 'lodash'
import p5 from 'p5'
import { MutableRefObject } from 'react'
import { CanvasState } from '../../components/canvas/canvasTypes'
import colors from '../../styles/colors'
import { sketchSizes } from '../../styles/sizes'
import { loopObject } from '../../utils/commonUtils'
import ElemRect from '../../utils/helpers/rect/elemRect'
import { intersectTwoCircles, parseVector, wrapDrawingContext } from '../../utils/p5Utils'
import { getVw } from '../../utils/sizeUtils'
import { validateRef } from '../../utils/typeUtils'
import config from '../configs/stroke'
import Brush from '../helpers/brush/brush'
import FlatBrush from '../helpers/brush/flatBrush'
import { PlaceholderProp } from './sketchTypes'

type DrawPantoProps = {
  isClearingRef: MutableRefObject<boolean>
} & PlaceholderProp

const drawPanto = ({ isClearingRef, placeholderRef }: DrawPantoProps) => {
  const vectors: {
    anchor: p5.Vector | undefined,
    primary: p5.Vector | undefined,
    secondary: p5.Vector | undefined,

    topRight: p5.Vector | undefined,
    rightMid: p5.Vector | undefined,
    leftBot: p5.Vector | undefined,
    leftMid: p5.Vector | undefined
  } = {
    anchor: undefined,
    primary: undefined,
    secondary: undefined,

    topRight: undefined,
    rightMid: undefined,
    leftBot: undefined,
    leftMid: undefined
  }

  let placeholder: ElemRect<HTMLDivElement>
  let paddedPlaceholder: ElemRect<HTMLDivElement>

  let brushes: [Brush, FlatBrush] | [] = []

  let graphic: p5.Graphics
  let armLength: number

  let isHovering = false
  let isHoveringStrict = false
  let lastHoverTimeStamp: number | undefined

  const setup = (p5: p5) => {
    if (!validateRef(placeholderRef))
      throw new Error('Pantograph sketch has no placeholder ref.')

    placeholder = new ElemRect(placeholderRef)
    paddedPlaceholder = new ElemRect(placeholderRef, sketchSizes.panto.hoverPadding.value)

    p5.background(255)
    p5.ellipseMode(p5.CENTER)
    p5.noFill()
    createPanto(p5)
  }

  const draw = (p5: p5, { hideCursorRef }: CanvasState) => {
    if (!hideCursorRef) throw new Error('hideCursorRef is undefined.')
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

  const cleanup = ({ hideCursorRef }: CanvasState) => {
    if (!hideCursorRef) throw new Error('hideCursorRef is undefined.')
    hideCursorRef.current = false
    // @ts-expect-error
    graphic && graphic.canvas.remove()
  }

  const createPanto = (p5: p5) => {
    const { w, h } = placeholder
    armLength = w / 1.985

    // @ts-expect-error
    if (graphic) graphic.canvas.remove()
    graphic = p5.createGraphics(w, h)
    brushes = [
      new Brush(config.PRIMARY_BRUSH, p5, graphic),
      new FlatBrush(config.SECONDARY_BRUSH, p5, graphic),
    ]
  }

  const windowResized = createPanto

  const clear = () => {
    graphic.clear(0, 0, 0, 0)
    isClearingRef.current = false
  }

  const updateVector = (p5: p5) => {
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

  const updatePivot = (p5: p5) => {
    const { anchor, primary } = vectors
    if (!anchor || !primary) throw new Error(`Incomplete vectors: ${vectors}`)
    const intersections = intersectTwoCircles(
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
      if (!vectors.primary) throw new Error(`Incomplete vectors: ${vectors}`)
      const intersectionVec = p5.createVector(...intersection)
      const arm1 = anchor.copy().sub(intersectionVec)
      const arm2 = intersectionVec.copy().sub(vectors.primary)
      const angle = arm1.angleBetween(arm2)
      return _.inRange(angle, Math.PI)
    })

    return [pivotIndex, pivotIndex ^ 1].map(index => p5.createVector(...intersections[index]))
  }

  const drawVectors = (
    p5: p5,
    hideCursorRef: MutableRefObject<boolean>,
    shouldDrawMarks: boolean
  ) => {
    wrapDrawingContext(p5, () => {
      p5.stroke(0)

      const { primary, secondary } = vectors

      if (!primary || !secondary) throw new Error(`Incomplete vectors: ${vectors}`)
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

  const drawPanto = (p5: p5) => {
    const validateVectors = function (vectorValidatee: typeof vectors):
      vectorValidatee is Record<keyof typeof vectors, p5.Vector> {
      return _.every(vectorValidatee, Boolean)
    }

    if (!validateVectors(vectors))
      throw new Error(`Incomplete vectors: ${vectors}`)

    const { anchor, primary, topRight, leftBot, leftMid, rightMid } = vectors
    p5.stroke(colors.strokePanto)
    p5.strokeWeight(sketchSizes.panto.lineWeight.value)
    wrapDrawingContext(p5, () => {
      p5.line(...parseVector(anchor), ...parseVector(leftBot))
      p5.line(...parseVector(leftMid), ...parseVector(rightMid))
      p5.line(...parseVector(topRight), ...parseVector(primary))
      p5.line(...parseVector(anchor), ...parseVector(topRight))
    })

    p5.strokeWeight(getVw(0.35))
    p5.fill(255)
    loopObject(vectors,
      (vectorKey, { x, y }) => {
        const drawingVectors = ['primary', 'secondary']
        if (drawingVectors.includes(vectorKey)) {
          p5.stroke(`${brushes[drawingVectors.indexOf(vectorKey)].setting.fill}`)
          p5.fill(255)
        } else {
          p5.stroke(colors.strokePanto)
          p5.fill(0)
        }
        p5.ellipse(x, y, sketchSizes.panto.pointSize.value)
      })
  }

  return { setup, draw, windowResized, cleanup }
}

export default drawPanto
