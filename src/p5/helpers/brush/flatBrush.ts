import Brush from './brush'
import FlatBrushMark, { FlatBrushPoint } from './flatBrushMark'
import { repeatMap, shuffleTo } from '../../../utils/commonUtils'
import { BrushSetting } from '../../sketches/sketchTypes'
import p5 from 'p5'
import { sketchSizes } from '../../../styles/sizes'


class FlatBrush extends Brush {
  rotation: number
  radius: number
  constructor(setting: BrushSetting, p5: p5, drawingContext: p5.Graphics) {
    super(setting, p5, drawingContext)
    this.rotation = Math.PI / 4
    this.radius = 4
  }

  doDraw(context: p5.Graphics) {
    context.rectMode(context.CENTER)
    context.ellipseMode(context.CENTER)
    const { x, y, prevX, prevY } = this
    const { radius } = sketchSizes.panto.brush.secondary
    if (prevX === x && prevY === y) return

    const brushMarks = [
      new FlatBrushMark(context, prevX, prevY, this.prevSize, radius.value, this.rotation),
      new FlatBrushMark(context, x, y, this.prevSize, radius.value, this.rotation)
    ]

    this.fillInShape(
      context,
      this.getOrderedBrushPoints(brushMarks)
    )
  }

  private fillInShape(context: p5.Graphics, points: FlatBrushPoint[]) {
    context.beginShape()
    points.forEach((_, i) => {
      const shufledPoints = shuffleTo(points, i)
      const vectors = shufledPoints.map(point => point.vector)

      const placement = this.getStrokePlacement(vectors)
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

  private getOrderedBrushPoints(marks: FlatBrushMark[]) {
    return [
      marks[0].brushPoints[0],
      marks[1].brushPoints[0],
      marks[1].brushPoints[1],
      marks[0].brushPoints[1],
    ]
  }

  private getStrokePlacement(vectors: p5.Vector[]) {
    const shorten = (vector: p5.Vector) => vector.copy().sub(vectors[1])
    const angleArm1Short = shorten(vectors[0])
    const angleArm2Short = shorten(vectors[2])
    const angle = angleArm1Short.angleBetween(angleArm2Short)
    return angle >= 0 ? 1 : -1
  }
}

export default FlatBrush

