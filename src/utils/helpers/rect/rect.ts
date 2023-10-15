import type p5 from 'p5'
import { arrayify } from '../../commonUtils'
import { styleDashedRect, wrapDrawingContext } from '../../p5Utils'
import { coorTuple } from '../../utilTypes'

type parseCoorsType = [{ x: number, y: number }] | coorTuple

class Rect {
  private _x: number
  private _y: number
  private _w: number
  private _h: number
  padding: {
    x: number,
    y: number
  }

  constructor({ x = 0, y = 0, w = 0, h = 0, padding = [0, 0] }: {
    x?: number,
    y?: number,
    w?: number,
    h?: number,
    padding?: number | coorTuple
  }) {
    const paddingArray = arrayify(padding)
    this._x = x
    this._y = y
    this._w = w
    this._h = h
    this.padding = {
      x: paddingArray[0],
      y: paddingArray[1] === undefined ? paddingArray[0] : paddingArray[1]
    }
  }

  rectAround(p5: p5) {
    wrapDrawingContext(p5, () => {
      styleDashedRect(p5)
      p5.rectMode(p5.CORNERS)
      p5.rect(...this.sides)
    })
  }

  mouseIsOver(...mousePosition: coorTuple | [coorTuple]) {
    const [x, y] = mousePosition.length === 1 ? mousePosition[0] : mousePosition
    const [x1, y1, x2, y2] = this.sides
    return x >= x1 && x <= x2 && y >= y1 && y <= y2
  }

  toScreenCoors(...coors: parseCoorsType): coorTuple {
    const [x, y] = this._parseCoors(...coors)
    return [x + this.x1, y + this.y1]
  }

  toRectCoors(...coors: parseCoorsType): coorTuple {
    const [x, y] = this._parseCoors(...coors)
    return [x - this.x1, y - this.y1]
  }

  _parseCoors(...coors: parseCoorsType): coorTuple {
    return coors.length === 1 ? [coors[0].x, coors[0].y] : coors
  }

  get x() {
    return this._x - this.padding.x
  }

  get y() {
    return this._y - this.padding.y
  }

  get w() {
    return this._w + this.padding.x * 2
  }

  get h() {
    return this._h + this.padding.y * 2
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

  get topLeft(): coorTuple {
    return [this.x1, this.y1]
  }

  get topRight(): coorTuple {
    return [this.x2, this.y1]
  }

  get botLeft(): coorTuple {
    return [this.x1, this.y2]
  }

  get botRight(): coorTuple {
    return [this.x2, this.y2]
  }

  get sides(): [number, number, number, number] {
    return [
      this.x1,
      this.y1,
      this.x2,
      this.y2,
    ]
  }

  get size(): coorTuple {
    return [this.w, this.h]
  }

  get center(): coorTuple {
    return [this.cx, this.cy]
  }

  get corners(): [coorTuple, coorTuple, coorTuple, coorTuple] {
    return [
      this.topLeft,
      this.topRight,
      this.botRight,
      this.botLeft
    ]
  }
}

export default Rect