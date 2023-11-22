import type p5 from 'p5'

class FlatBrushMark {
  private p5: p5 | p5.Graphics
  private vector: p5.Vector
  private w: number
  private rotation: number
  radius: number
  brushPoints: FlatBrushPoint[]

  constructor(p5: p5 | p5.Graphics, x: number, y: number, w: number, h: number, rotation = 0) {
    this.p5 = p5
    this.vector = p5.createVector(x, y)
    this.w = w
    this.radius = h / 2
    this.rotation = rotation
    this.brushPoints = [
      this.p5.createVector(-this.halfMarkW, 0),
      this.p5.createVector(this.halfMarkW, 0)
    ].map(vector => new FlatBrushPoint(
      p5,
      vector.rotate(this.rotation).add(this.vector),
      this.radius
    ))
  }

  get markW() {
    return this.w + this.radius + 2
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
  private p5: p5 | p5.Graphics
  vector: p5.Vector
  radius: number
  constructor(p5: p5 | p5.Graphics, vector: p5.Vector, r: number) {
    this.p5 = p5
    this.vector = vector
    this.radius = r
  }

  draw() {
    this.p5.ellipse(this.x, this.y, this.radius * 2)
  }

  get x() {
    return this.vector.x
  }

  get y() {
    return this.vector.y
  }
}

export default FlatBrushMark

