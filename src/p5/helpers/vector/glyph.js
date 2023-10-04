import Vector from './vector'
import { parsePoints, wrapDrawingContext } from '../../../utils/p5Utils'
import { callFunctionLike } from '../../../utils/commonUtils'
import bearingsData from '../../../data/vector/spacings'

class Glyph {
  constructor(p5, name, setting) {
    this.p5 = p5
    this.setting = setting
    this.still = new Vector(p5, name, setting)
    this.active = new Vector(p5, name, setting)
    this.nativeBearings = bearingsData[name]
  }

  draw() {
    let { drawingSequence, mapFunction } = this.setting
    this.active.setTransform(mapFunction.call(
      this.setting,
      this.still.position,
      this.mouseVector
    ))

    this.still.draw()
    this.active.draw()

    wrapDrawingContext(this.p5, () =>
      drawingSequence.forEach(methodName => this[methodName]()))
  }

  drawLinks() {
    const { p5, setting } = this
    const { linkColor } = setting
    const linkWeight = callFunctionLike(setting.linkWeight)
    p5.strokeWeight(linkWeight)
    p5.stroke(linkColor)
    this.loopVectors(({ stillPoint, activePoint }) =>
      p5.line(...parsePoints(stillPoint, activePoint))
    )
  }

  drawPoints() {
    const { p5, setting } = this
    const { pointColor, pointWeight, pointFill } = setting
    const pointSize = callFunctionLike(setting.pointSize)

    p5.strokeWeight(pointWeight)
    p5.stroke(pointColor)
    if (pointFill === null) p5.noFill()
    else p5.fill(pointFill)
    p5.ellipseMode(p5.CENTER)
    this.loopVectors(({ stillPoint, activePoint }) => {
      p5.ellipse(...parsePoints(stillPoint), pointSize)
      p5.ellipse(...parsePoints(activePoint), pointSize)
    })
  }

  drawVolume() {
    const { p5, setting } = this
    const { volumeColor, correctVolumeStroke } = setting
    const volumeWeight = callFunctionLike(setting.volumeWeight)

    p5.fill(volumeColor)
    this.loopVectors(({ stillPoint, activePoint, nextStillPoint, nextActivePoint }) => {
      if (!nextStillPoint) return

      if (correctVolumeStroke) p5.noStroke()
      else {
        p5.stroke(volumeColor)
        p5.strokeWeight(volumeWeight)
      }

      p5.quad(...parsePoints(stillPoint, nextStillPoint, nextActivePoint, activePoint))

      if (correctVolumeStroke) {
        p5.stroke(volumeColor)
        p5.strokeWeight(volumeWeight)
        p5.line(...parsePoints(stillPoint, activePoint))
      }
    })
  }

  getBearings() {
    return this.nativeBearings.map(bearing => (bearing + this.setting.tracking) * this.still.scale)
  }

  loopVectors(callback) {
    this.still.loopPoints((stillPoint, stillLine, pointIndex, lineIndex) => {
      const activeLine = this.active.vectors[lineIndex]
      const activePoint = activeLine[pointIndex]
      const nextActivePoint = activeLine[pointIndex + 1]
      const nextStillPoint = stillLine[pointIndex + 1]
      callback({
        stillPoint,
        activePoint,
        nextStillPoint,
        nextActivePoint,
        stillLine,
        activeLine,
        pointIndex,
        lineIndex
      })
    })
  }

  get w() {
    return this.still.w
  }

  get mouseVector() {
    const { p5 } = this
    return p5.createVector(p5.mouseX, p5.mouseY)
  }
}

export default Glyph