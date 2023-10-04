class FlatBrushMark {
  constructor(p5, x, y, w, h, rotation = 0) {
    this.p5 = p5
    this.vector = p5.createVector(x, y)
    this.w = w
    this.r = h / 2
    this.rotation = rotation
    this.brushPoints = [
      this.p5.createVector(-this.halfMarkW, 0),
      this.p5.createVector(this.halfMarkW, 0)
    ].map(vector => new FlatBrushPoint(
      p5,
      vector.rotate(this.rotation).add(this.vector),
      this.r
    ))
  }

  get markW() {
    return this.w + this.r + 2
  }

  get halfMarkW() {
    return this.markW / 2
  }

  get x() {
    return this.vector.x
  }

  get y() {
    return this.vector.y
  }
}

class FlatBrushPoint {
  constructor(p5, vector, r) {
    this.p5 = p5
    this.vector = vector
    this.r = r
  }

  draw() {
    this.p5.ellipse(this.x, this.y, this.r * 2)
  }

  get x() {
    return this.vector.x
  }

  get y() {
    return this.vector.y
  }
}

export default FlatBrushMark

