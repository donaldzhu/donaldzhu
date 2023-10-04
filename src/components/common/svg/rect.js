import _ from 'lodash'
import colorConfig from '../../../styles/colors'
import { isOdd, repeatMap, keysToObject } from '../../../utils/generalUtils'

// RECT
class Rect {
  constructor({ x = 0, y = 0, w, h }) {
    this._x1 = x
    this._y1 = y
    this.w = w
    this.h = h
    this.stroke = 5

    this.defaultDashLength = 12

    this.xDashLength = this.adjustDashLength(this.polyX2 - this.polyX1)
    this.yDashLength = this.adjustDashLength(this.polyY2 - this.polyY1)

    this.polyLineStyle = {
      fill: 'none',
      stroke: colorConfig.dashLine,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: this.stroke
    }
    this.lineStyles = [
      { ...this.polyLineStyle, strokeDasharray: [this.xDashLength, this.xDashLength] },
      { ...this.polyLineStyle, strokeDasharray: [this.yDashLength, this.yDashLength] },
    ]
  }

  adjustDashLength(size) {
    let segmentCount = Math.trunc(size / this.defaultDashLength)
    segmentCount += isOdd(segmentCount) ? 0 : 1
    return _.round(size / segmentCount, 3)
  }

  getLine() {
    const keys = ['x1', 'y1', 'x2', 'y2']
    const { line } = this
    const xCoors = [this.x1, this.x2]
    const yCoors = [this.y1, this.y2]

    return repeatMap(4, i =>
      !Math.floor(i / 2) ?
        [line.x1, yCoors[i % 2], line.x2, yCoors[i % 2]] :
        [xCoors[i % 2], line.y1, xCoors[i % 2], line.y2])
      .map(points => keysToObject(keys, (_, __, i) => points[i]))
  }

  getPolyline() {
    const { poly } = this
    return [
      [this.x2, poly.y2, this.x2, this.y2, poly.x2, this.y2],
      [poly.x1, this.y2, this.x1, this.y2, this.x1, poly.y2],
      [this.x1, poly.y1, this.x1, this.y1, poly.x1, this.y1],
      [poly.x2, this.y1, this.x2, this.y1, this.x2, poly.y1]
    ].map(poly => poly.join(' '))
  }

  get _x2() {
    return this._x1 + this.w
  }

  get _y2() {
    return this._y1 + this.h
  }

  get halfStroke() {
    return this.stroke / 2
  }

  get halfDash() {
    return this.defaultDashLength / 2
  }

  get paddedW() {
    return this.w + this.stroke
  }

  get paddedH() {
    return this.h + this.stroke
  }

  get x1() {
    return this._x1 + this.halfStroke
  }

  get y1() {
    return this._y1 + this.halfStroke
  }

  get x2() {
    return this._x2 + this.halfStroke
  }

  get y2() {
    return this._y2 + this.halfStroke
  }

  get polyX1() {
    return this.x1 + this.halfDash
  }

  get polyY1() {
    return this.y1 + this.halfDash
  }

  get polyX2() {
    return this.x2 - this.halfDash
  }

  get polyY2() {
    return this.y2 - this.halfDash
  }

  get poly() {
    return {
      x1: this.polyX1,
      y1: this.polyY1,
      x2: this.polyX2,
      y2: this.polyY2,
    }
  }

  get lineX1() {
    return this.polyX1 + this.xDashLength
  }

  get lineY1() {
    return this.polyY1 + this.yDashLength
  }

  get lineX2() {
    return this.polyX2 - this.xDashLength
  }

  get lineY2() {
    return this.polyY2 - this.yDashLength
  }

  get line() {
    return {
      x1: this.lineX1,
      y1: this.lineY1,
      x2: this.lineX2,
      y2: this.lineY2,
    }
  }
}

export default Rect