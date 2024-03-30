import type p5 from 'p5'

class FlatBrushMark {
  private vector: p5.Vector
  private w: number
  radius: number
  brushPoints: FlatBrushPoint[]

  constructor(
    private p5: p5 | p5.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    private rotation = 0
  ) {
    this.vector = p5.createVector(x, y)
    this.w = w
    this.radius = h / 2
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
  constructor(
    private p5: p5 | p5.Graphics,
    public vector: p5.Vector,
    public radius: number
  ) { }

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

