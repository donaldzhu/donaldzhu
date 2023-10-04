import _ from 'lodash'
import { callFunctionLike } from '../../../utils/commonUtils'
import { parsePoints, wrapDrawingContext } from '../../../utils/p5Utils'
import { MaxNumber } from '../../../utils/helpers/number'
import vectorsData from '../../../data/vector/glyphs'
import { MODES } from './constants'

class Vector {
  constructor(p5, name, setting) {
    const { x, y, scale, mode = MODES.CORNER } = setting
    this.setting = setting
    this.p5 = p5

    this.rawData = vectorsData[name]
    this.vectors = this.rawData.map(path =>
      path.map(point => p5.createVector(...point)))

    this.position = this.p5.createVector(0, 0)
    this.scale = 1
    this.mode = mode

    this._nativeDimension = (() => {
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
    const glyphWeight = callFunctionLike(setting.glyphWeight)

    wrapDrawingContext(p5, () => {
      p5.strokeWeight(glyphWeight)
      p5.stroke(glyphColor)
      this.loopPoints((point, line, pointIndex) => {
        const nextPoint = line[pointIndex + 1]
        if (nextPoint)
          p5.line(...parsePoints(point, nextPoint))
      })
    })
  }

  loopPoints(callback) {
    this.vectors.forEach((path, i) =>
      path.forEach((point, ii) =>
        callback(point, path, ii, i)))
  }

  setTransform(newTransform) {
    let { x, y, scale } = _.defaults(newTransform, this)

    const scaleFactor = scale / this.scale
    if (this.mode === MODES.CENTER) {
      x -= this.w * scaleFactor / 2
      y -= this.h * scaleFactor / 2
    }

    this._performTransform(x, y, scaleFactor)
    Object.assign(this, { x, y, scale })
  }

  _performTransform(dx, dy, scaleFactor) {
    this.loopPoints(point =>
      this._unsetTransform(point)
        .mult(scaleFactor)
        .add(dx, dy))
  }

  _unsetTransform(point) {
    return point.sub(this.x, this.y)
  }

  get x() {
    return this.position.x
  }

  get y() {
    return this.position.y
  }

  set x(newX) {
    this.position.x = newX
  }

  set y(newY) {
    this.position.y = newY
  }

  get w() {
    return this._nativeDimension.w * this.scale
  }

  get h() {
    return this._nativeDimension.h * this.scale
  }
}

export default Vector