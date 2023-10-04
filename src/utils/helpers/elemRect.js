import Rect from './rect'

class ElemRect extends Rect {
  constructor(ref, padding) {
    super({ padding })
    this.ref = ref
  }

  get elem() {
    return this.ref.current
  }

  get elemBounds() {
    return this.elem ? this.elem.getBoundingClientRect() : undefined
  }

  get x() {
    return this.elemBounds.x - this.padding
  }

  get y() {
    return this.elemBounds.y - this.padding
  }

  get w() {
    return this.elemBounds.width + this.padding * 2
  }

  get h() {
    return this.elemBounds.height + this.padding * 2
  }
}

export default ElemRect