import { wrapDrawingContext } from '../../../utils/p5Utils'

class Brush {
  constructor(setting, p5, drawingContext) {
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

  _updateDrawingState(x, y) {
    if (!this.mouseIsPressed)
      return this.stopDrawing()
    if (!this.isDrawing) this._startDrawing(x, y)
  }

  stopDrawing() {
    this.modifiedX = this.modifiedY = 0
    this.isDrawing = false
  }

  _startDrawing(x, y) {
    this.isDrawing = true
    this.prevX = this.x = x
    this.prevY = this.y = y
  }

  draw(x, y, context = this.drawingContext) {
    this._updateDrawingState(x, y)
    if (!this.isDrawing) return

    const { fill, splitNum, spring, friction, sizeReductionFactor, maxSize, minSize } = this.setting
    wrapDrawingContext(context, () => {
      context.stroke(fill)
      context.fill(fill)
      this.prevSize = this.size
      this.modifiedX += (x - this.x) * spring
      this.modifiedY += (y - this.y) * spring
      this.modifiedX *= friction
      this.modifiedY *= friction

      this.size = Math.max(
        maxSize() - Math.sqrt(this.modifiedX ** 2 + this.modifiedY ** 2) * sizeReductionFactor,
        minSize())

      for (let i = 0; i < splitNum; ++i) {
        this.prevX = this.x
        this.prevY = this.y
        this.x += this.modifiedX / splitNum
        this.y += this.modifiedY / splitNum
        this.prevSize += (this.size - this.prevSize) / splitNum
        this._doDraw(context)
      }
    })
  }

  _doDraw(context) {
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