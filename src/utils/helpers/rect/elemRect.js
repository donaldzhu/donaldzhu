import Rect from './rect'

class ElemRect extends Rect {
  constructor(ref, padding, isRelative) {
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
    return (this.isRelative ? 0 : this.elemBounds.x) - this.padding.x
  }

  get y() {
    return (this.isRelative ? 0 : this.elemBounds.y) - this.padding.y
  }

  get w() {
    return this.elemBounds.width + this.padding.x * 2
  }

  get h() {
    return this.elemBounds.height + this.padding.y * 2
  }
}

export default ElemRect