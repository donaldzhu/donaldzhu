import p5 from 'p5'
import bearingsData from '../../../data/vector/spacings.json'
import { parseVector, wrapDrawingContext } from '../../../utils/p5Utils'
import { validateRef } from '../../../utils/typeUtils'
import Vector from './vector'
import { MotionSettings, VectorSetting } from './vectorTypes'

class Glyph {
  private p5: p5 | p5.Graphics
  private nativeBearings: number[]
  setting: VectorSetting
  still: Vector
  active: Vector

  motionSettings: MotionSettings | undefined
  velocity: p5.Vector
  lastTimeStamp: number | undefined

  name: string
  constructor(
    p5: p5 | p5.Graphics,
    name: keyof typeof bearingsData,
    setting: VectorSetting,
    motionSettings?: MotionSettings
  ) {
    this.p5 = p5
    this.setting = setting
    this.still = new Vector(p5, name, setting)
    this.active = new Vector(p5, name, setting)
    this.nativeBearings = bearingsData[name]

    // mobile motion
    this.motionSettings = motionSettings
    this.velocity = p5.createVector(0, 0)
    this.lastTimeStamp = undefined

    this.name = name
  }

  draw() {
    const { drawingSequence, mapFunction, mapMotionFunction } = this.setting

    const motionVector = this.motionVector
    if (this.setting.isMobile && motionVector) {
      this.active.setTransform(mapMotionFunction.call(
        this.setting,
        this.still.position,
        this.velocity,
        motionVector,
        this.lastTimeStamp ?? Date.now(),
        { p5: this.p5, name: this.name }
      ))
      this.lastTimeStamp = Date.now()
    }
    else this.active.setTransform(mapFunction.call(
      this.setting,
      this.still.position,
      this.mouseVector
    ))

    this.still.draw()
    this.active.draw()

    wrapDrawingContext(this.p5, () =>
      drawingSequence.forEach(methodName => this[methodName]()))
  }

  drawLinks() {
    const { p5, setting } = this
    const { linkColor, linkWeight } = setting
    p5.strokeWeight(linkWeight.value)
    p5.stroke(`${linkColor}`)
    this.loopVectors(({ stillPoint, activePoint }) =>
      p5.line(...parseVector(stillPoint), ...parseVector(activePoint))
    )
  }

  drawPoints() {
    const { p5, setting } = this
    const { pointColor, pointWeight, pointFill } = setting
    const pointSize = setting.pointSize.value

    p5.strokeWeight(pointWeight.value)
    p5.stroke(`${pointColor}`)
    if (pointFill === null) p5.noFill()
    else p5.fill(`${pointFill}`)
    p5.ellipseMode(p5.CENTER)
    this.loopVectors(({ stillPoint, activePoint }) => {
      p5.ellipse(...parseVector(stillPoint), pointSize)
      p5.ellipse(...parseVector(activePoint), pointSize)
    })
  }

  drawVolume() {
    const { p5, setting } = this
    const { volumeColor, volumeWeight, correctVolumeStroke } = setting
    const color = `${volumeColor}`

    p5.fill(color)
    this.loopVectors(({ stillPoint, activePoint, nextStillPoint, nextActivePoint }) => {
      if (!nextStillPoint) return

      if (correctVolumeStroke) p5.noStroke()
      else {
        p5.stroke(color)
        p5.strokeWeight(volumeWeight.value)
      }

      p5.quad(
        ...parseVector(stillPoint),
        ...parseVector(nextStillPoint),
        ...parseVector(nextActivePoint),
        ...parseVector(activePoint)
      )

      if (correctVolumeStroke) {
        p5.stroke(color)
        p5.strokeWeight(volumeWeight.value)
        p5.line(...parseVector(stillPoint), ...parseVector(activePoint))
      }
    })
  }

  getBearings() {
    return this.nativeBearings.map(bearing =>
      (bearing + this.setting.tracking.value) * this.still.scale.value)
  }

  loopVectors(callback: (vectorData: {
    stillPoint: p5.Vector,
    activePoint: p5.Vector,
    nextStillPoint: p5.Vector,
    nextActivePoint: p5.Vector,
    stillLine: p5.Vector[],
    activeLine: p5.Vector[],
    pointIndex: number,
    lineIndex: number
  }) => void) {
    this.still.loopPoints((stillPoint, stillLine, pointIndex, lineIndex) => {
      const activeLine = this.active.vectors[lineIndex]
      const activePoint = activeLine[pointIndex]
      const nextActivePoint = activeLine[pointIndex + 1]
      const nextStillPoint = stillLine[pointIndex + 1]
      callback({
        stillPoint,
        activePoint,
        nextStillPoint,
        nextActivePoint,
        stillLine,
        activeLine,
        pointIndex,
        lineIndex
      })
    })
  }

  get w() {
    return this.still.w
  }

  get mouseVector() {
    const { p5 } = this
    return p5.createVector(p5.mouseX, p5.mouseY)
  }

  get motionVector() {
    const { p5 } = this
    if (
      !this.motionSettings ||
      !validateRef(this.motionSettings.motionSettingsRef) ||
      !validateRef(this.motionSettings.motionRef) ||
      !this.motionSettings.motionSettingsRef.current.isUsable
    ) return p5.createVector(0, 0)
    const { motionRef } = this.motionSettings
    return p5.createVector(motionRef.current.y, motionRef.current.x,)
  }
}

export default Glyph