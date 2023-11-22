import _ from 'lodash'
import vectorsData from '../../../data/vector/glyphs.json'
import { MaxNumber } from '../../../utils/helpers/number'
import Size from '../../../utils/helpers/size'
import { parseVector, wrapDrawingContext } from '../../../utils/p5Utils'
import { Mode } from './constants'
import type p5 from 'p5'
import type { SetTransformProps, VectorSetting } from './vectorTypes'

class Vector {
  private setting: VectorSetting
  private p5: p5 | p5.Graphics
  private rawData: number[][][]
  private mode: Mode
  private nativeDimension: {
    w: number,
    h: number
  }

  vectors: p5.Vector[][]
  position: p5.Vector
  scale: Size

  constructor(p5: p5 | p5.Graphics, name: keyof typeof vectorsData, setting: VectorSetting) {
    const { x, y, scale, mode = Mode.Corner } = setting
    this.setting = setting
    this.p5 = p5

    this.rawData = vectorsData[name]
    this.vectors = this.rawData.map(path =>
      path.map(point => p5.createVector(...point)))

    this.position = this.p5.createVector(0, 0)
    this.scale = new Size(1)
    this.mode = mode

    this.nativeDimension = (() => {
      const maxX2 = new MaxNumber()
      const maxY2 = new MaxNumber()
      this.loopPoints(({ x, y }) => {
        maxX2.compare(x)
        maxY2.compare(y)
      })
      return { w: maxX2.value, h: maxY2.value }
    })()

    this.setTransform({ x, y, scale })
  }

  draw() {
    const { p5, setting } = this
    const { glyphColor } = setting
    const glyphWeight = setting.glyphWeight.value

    wrapDrawingContext(p5, () => {
      p5.strokeWeight(glyphWeight)
      p5.stroke(`${glyphColor}`)
      this.loopPoints((point, line, pointIndex) => {
        const nextPoint = line[pointIndex + 1]
        if (nextPoint) p5.line(
          ...parseVector(point),
          ...parseVector(nextPoint)
        )
      })
    })
  }

  loopPoints(callback: (point: p5.Vector, path: p5.Vector[], ii: number, i: number) => void) {
    this.vectors.forEach((path, i) =>
      path.forEach((point, ii) =>
        callback(point, path, ii, i)))
  }

  setTransform(newTransform: SetTransformProps) {
    const newSetting = _.defaults(newTransform, this)
    let { x, y } = newSetting
    const { scale } = newSetting

    const scaleFactor = scale.value / this.scale.value
    if (this.mode === Mode.Center) {
      x -= this.w * scaleFactor / 2
      y -= this.h * scaleFactor / 2
    }

    this.performTransform(x, y, scaleFactor)
    Object.assign(this, { x, y, scale })
  }

  private performTransform(dx: number, dy: number, scaleFactor: number) {
    this.loopPoints(point =>
      this.unsetTransform(point)
        .mult(scaleFactor)
        .add(dx, dy))
  }

  private unsetTransform(point: p5.Vector) {
    return point.sub(this.x, this.y)
  }

  get x() {
    return this.position.x
  }

  set x(newX) {
    this.position.x = newX
  }

  get y() {
    return this.position.y
  }

  set y(newY) {
    this.position.y = newY
  }

  get w() {
    return this.nativeDimension.w * this.scale.value
  }

  get h() {
    return this.nativeDimension.h * this.scale.value
  }
}

export default Vector