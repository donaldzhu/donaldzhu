import Brush from './brush'
import FlatBrushMark from './flatBrushMark'
import { repeatMap, shuffleTo } from '../../../utils/commonUtils.ts'

// TODO: responsive value
class FlatBrush extends Brush {
  constructor(setting, p5, drawingContext) {
    super(setting, p5, drawingContext)
    this.brushW = 30
    this.brushH = 8
  }

  _doDraw(context) {
    context.rectMode(context.CENTER)
    context.ellipseMode(context.CENTER)
    const { x, y, prevX, prevY, brushH } = this
    if (prevX === x && prevY === y) return

    const brushMarks = [
      new FlatBrushMark(context, prevX, prevY, this.prevSize, brushH, this.setting.rotation),
      new FlatBrushMark(context, x, y, this.prevSize, brushH, this.setting.rotation)
    ]

    this._fillInShape(
      context,
      this._getOrderedBrushPoints(brushMarks)
    )
  }

  _fillInShape(context, points) {
    context.beginShape()
    points.forEach((_, i) => {
      const shufledPoints = shuffleTo(points, i)
      const vectors = shufledPoints.map(point => point.vector)

      const placement = this._getStrokePlacement(vectors)
      const strokeNormalVector = vectors[1].copy().sub(vectors[0])
      strokeNormalVector.setHeading(strokeNormalVector.heading() + Math.PI / 2 * placement)

      repeatMap(2, i => {
        strokeNormalVector.setMag(shufledPoints[i].r)
        const strokeShiftedVector = vectors[i].copy().add(strokeNormalVector)
        context.vertex(strokeShiftedVector.x, strokeShiftedVector.y)
      })

      shufledPoints[0].draw()
    })
    context.endShape(context.CLOSE)
  }

  _getOrderedBrushPoints(marks) {
    return [
      marks[0].brushPoints[0],
      marks[1].brushPoints[0],
      marks[1].brushPoints[1],
      marks[0].brushPoints[1],
    ]
  }

  _getStrokePlacement(vectors) {
    const shorten = vector => vector.copy().sub(vectors[1])
    const angleArm1Short = shorten(vectors[0])
    const angleArm2Short = shorten(vectors[2])
    const angle = angleArm1Short.angleBetween(angleArm2Short)
    return angle >= 0 ? 1 : -1
  }
}

export default FlatBrush

