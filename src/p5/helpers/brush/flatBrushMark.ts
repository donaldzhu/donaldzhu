import p5 from 'p5'

class FlatBrushMark {
  p5: p5 | p5.Graphics
  vector: p5.Vector
  w: number
  r: number
  rotation: number
  brushPoints: FlatBrushPoint[]

  constructor(p5: p5 | p5.Graphics, x: number, y: number, w: number, h: number, rotation = 0) {
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

export class FlatBrushPoint {
  p5: p5 | p5.Graphics
  vector: p5.Vector
  r: number
  constructor(p5: p5 | p5.Graphics, vector: p5.Vector, r: number) {
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

