import { repeatMap, shuffleTo } from '../../../utils/commonUtils'
import Size from '../../../utils/helpers/size'
import Brush from './brush'
import FlatBrushMark from './flatBrushMark'
import type { FlatBrushPoint } from './flatBrushMark'
import type p5 from 'p5'
import type { BrushSetting } from '../../sketches/sketchTypes'


class FlatBrush extends Brush {
  private rotation: number
  private radius: Size
  constructor(setting: BrushSetting, p5: p5, drawingContext: p5.Graphics) {
    super(setting, p5, drawingContext)
    this.rotation = Math.PI / 4
    this.radius = setting.radius ?? new Size(4)
  }

  doDraw(context: p5.Graphics) {
    context.rectMode(context.CENTER)
    context.ellipseMode(context.CENTER)
    const { x, y, prevX, prevY } = this
    if (prevX === x && prevY === y) return

    const brushMarks = [
      new FlatBrushMark(context, prevX, prevY, this.prevSize, this.radius.value, this.rotation),
      new FlatBrushMark(context, x, y, this.prevSize, this.radius.value, this.rotation)
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
        strokeNormalVector.setMag(shufledPoints[i].radius)
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

