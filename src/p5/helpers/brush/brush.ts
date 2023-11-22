import { wrapDrawingContext } from '../../../utils/p5Utils'
import type p5 from 'p5'
import type { BrushSetting } from '../../sketches/sketchTypes'

class Brush {
  setting: BrushSetting
  private p5: p5
  private drawingContext: p5.Graphics
  x: number
  y: number
  prevX: number
  prevY: number
  modifiedX: number
  modifiedY: number
  size: number
  prevSize: number
  isDrawing: boolean
  constructor(setting: BrushSetting, p5: p5, drawingContext: p5.Graphics) {
    this.setting = setting

    this.p5 = p5
    this.drawingContext = drawingContext

    this.x = 0
    this.y = 0
    this.prevX = 0
    this.prevY = 0

    this.modifiedX = 0
    this.modifiedY = 0
    this.size = 0
    this.prevSize = 0
    this.isDrawing = false
  }

  private updateDrawingState(x: number, y: number) {
    if (!this.mouseIsPressed)
      return this.stopDrawing()
    if (!this.isDrawing) this.startDrawing(x, y)
  }

  stopDrawing() {
    this.modifiedX = this.modifiedY = 0
    this.isDrawing = false
  }

  private startDrawing(x: number, y: number) {
    this.isDrawing = true
    this.prevX = this.x = x
    this.prevY = this.y = y
  }

  draw(x: number, y: number, context = this.drawingContext) {
    this.updateDrawingState(x, y)
    if (!this.isDrawing) return

    const { fill, splitNum, spring, friction, sizeReductionFactor, maxSize, minSize } = this.setting
    wrapDrawingContext(context, () => {
      context.stroke(`${fill}`)
      context.fill(`${fill}`)
      this.prevSize = this.size
      this.modifiedX += (x - this.x) * spring
      this.modifiedY += (y - this.y) * spring
      this.modifiedX *= friction
      this.modifiedY *= friction

      this.size = Math.max(
        maxSize.value - Math.sqrt(this.modifiedX ** 2 + this.modifiedY ** 2) * sizeReductionFactor,
        minSize.value)

      for (let i = 0; i < splitNum; ++i) {
        this.prevX = this.x
        this.prevY = this.y
        this.x += this.modifiedX / splitNum
        this.y += this.modifiedY / splitNum
        this.prevSize += (this.size - this.prevSize) / splitNum
        this.doDraw(context)
      }
    })
  }

  doDraw(context: p5.Graphics) {
    if (!this.mouseMoved) {
      context.noStroke()
      context.ellipse(this.x, this.y, this.prevSize)
    }
    else {
      context.strokeWeight(this.prevSize)
      context.line(this.x, this.y, this.prevX, this.prevY)
    }
  }

  get mouseIsPressed() {
    return this.p5.mouseIsPressed
  }

  get mouseX() {
    return this.p5.mouseX
  }

  get mouseY() {
    return this.p5.mouseY
  }

  get mouseMoved() {
    return this.x !== this.prevX && this.y !== this.prevY
  }
}

export default Brush