import { MutableRefObject } from 'react'
import { coorTuple } from '../../utilTypes'
import { validateRef } from '../../typeUtils'
import Rect from './rect'

class ElemRect<T extends Element> extends Rect {
  private ref: MutableRefObject<T>
  private isRelative?: boolean

  constructor(ref: MutableRefObject<T>, padding?: number | coorTuple, isRelative?: boolean) {
    super({ padding })
    this.ref = ref
    this.isRelative = isRelative
  }

  get elem() {
    return this.ref.current
  }

  get elemBounds() {
    return this.elem ? this.elem.getBoundingClientRect() : undefined
  }

  get x() {
    return this.elemBounds ? (this.isRelative ? 0 : this.elemBounds.x) - this.padding.x : NaN
  }

  get y() {
    return this.elemBounds ? (this.isRelative ? 0 : this.elemBounds.y) - this.padding.y : NaN
  }

  get w() {
    return this.elemBounds ? this.elemBounds.width + this.padding.x * 2 : NaN
  }

  get h() {
    return this.elemBounds ? this.elemBounds.height + this.padding.y * 2 : NaN
  }

  static createUpdated<T extends Element>(
    elemRect: ElemRect<T> | undefined,
    ref: MutableRefObject<T | null>,
    padding?: number | coorTuple,
    isRelative?: boolean
  ) {
    if (!validateRef(ref)) return
    if (!elemRect || (elemRect.ref.current !== ref.current))
      return new ElemRect(ref, padding, isRelative)
    else return elemRect
  }
}

export default ElemRect