import { arrayify } from '../../commonUtils.ts'
import { styleDashedRect, wrapDrawingContext } from '../../p5Utils.js'

class Rect {
  #_x
  #_y
  #_w
  #_h

  constructor({ x = 0, y = 0, w = 0, h = 0, padding = [0, 0] }) {
    padding = arrayify(padding)
    this.#_x = x
    this.#_y = y
    this.#_w = w
    this.#_h = h
    this.padding = {
      x: padding[0],
      y: padding[1] === undefined ? padding[0] : padding[1]
    }

    this.padding[0] = this.padding.x
    this.padding[1] = this.padding.y
  }

  // TODO: replace with svg
  rectAround(p5) {
    wrapDrawingContext(p5, () => {
      styleDashedRect(p5)
      p5.rectMode(p5.CORNERS)
      p5.rect(...this.sides)
    })
  }

  mouseIsOver(...mousePosition) {
    if (mousePosition.length === 1 && Array.isArray(mousePosition[0]))
      mousePosition = mousePosition[0]
    const [x, y] = mousePosition
    const [x1, y1, x2, y2] = this.sides
    return x >= x1 && x <= x2 && y >= y1 && y <= y2
  }

  toScreenCoors(...coors) {
    const [x, y] = this._parseCoors(...coors)
    return [x + this.x1, y + this.y1]
  }

  toRectCoors(...coors) {
    const [x, y] = this._parseCoors(...coors)
    return [x - this.x1, y - this.y1]
  }

  _parseCoors(...coors) {
    return typeof coors[0] === 'object' ?
      [coors[0].x, coors[0].y] : coors
  }

  get x() {
    return this.#_x - this.padding.x
  }

  get y() {
    return this.#_y - this.padding.y
  }

  get w() {
    return this.#_w + this.padding.x * 2
  }

  get h() {
    return this.#_h + this.padding.y * 2
  }

  get x1() {
    return this.x
  }

  get y1() {
    return this.y
  }

  get x2() {
    return this.x1 + this.w
  }

  get y2() {
    return this.y1 + this.h
  }

  get cx() {
    return (this.x1 + this.x2) / 2
  }

  get cy() {
    return (this.y1 + this.y2) / 2
  }

  get topLeft() {
    return [this.x1, this.y1]
  }

  get topRight() {
    return [this.x2, this.y1]
  }

  get botLeft() {
    return [this.x1, this.y2]
  }

  get botRight() {
    return [this.x2, this.y2]
  }

  get sides() {
    return [
      this.x1,
      this.y1,
      this.x2,
      this.y2,
    ]
  }

  get size() {
    return [this.w, this.h]
  }

  get center() {
    return [this.cx, this.cy]
  }

  get corners() {
    return [
      this.topLeft,
      this.topRight,
      this.botRight,
      this.botLeft
    ]
  }
}

export default Rect