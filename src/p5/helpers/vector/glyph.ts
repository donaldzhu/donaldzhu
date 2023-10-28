import p5 from 'p5'
import * as THREE from 'three'
import Matter, { Bodies, Body, Composite, Constraint, Engine } from 'matter-js'
import bearingsData from '../../../data/vector/spacings.json'
import { parseVector, wrapDrawingContext } from '../../../utils/p5Utils'
import { validateRef } from '../../../utils/typeUtils'
import { sketchSizes } from '../../../styles/sizes'
import Vector from './vector'
import { MotionSettings, VectorSetting } from './vectorTypes'
import { mobilePhysicsSettings } from './constants'


class Glyph {
  private p5: p5 | p5.Graphics
  private nativeBearings: number[]
  setting: VectorSetting
  still: Vector
  active: Vector

  private motionSettings: MotionSettings | undefined
  private engine: Engine | undefined
  bodies: {
    active: Matter.Body,
    constraint: Constraint
  } | undefined

  private name: string // TODO: remove when mobile dev is finished
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

    this.name = name
    this.motionSettings = motionSettings

    this.engine = motionSettings?.engine
    this.bodies = undefined
    this.addBodies()
  }

  addBodies() {
    if (!this.engine) return
    if (this.bodies) this.cleanup()

    const { x, y } = this.bodyCoors

    const active = Bodies.circle(x, y, 10, mobilePhysicsSettings.active)
    const constraint = Constraint.create({
      ...mobilePhysicsSettings.constraint,
      pointA: { x, y },
      bodyB: active
    })
    this.bodies = { active, constraint }

    Composite.add(this.engine.world, Object.values(this.bodies))
  }

  cleanup() {
    if (this.engine && this.bodies)
      Composite.remove(this.engine.world, Object.values(this.bodies))
    this.bodies = undefined
  }

  draw() {
    const { drawingSequence, mapFunction, mapMotionFunction } = this.setting

    const motionData = this.motionData

    if (this.setting.isMobile && motionData && this.bodies) {
      this.active.setTransform(mapMotionFunction.call(
        this.setting,
        this.still.position,
        motionData,
        this.bodies,
        {
          p5: this.p5,
          name: this.name,
          enabled: true
        }
      ))
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

  get bodyCoors() {
    return {
      x: this.still.x + this.still.w / 2,
      y: this.still.y +
        sketchSizes.vector.xHeight *
        this.still.scale.value / 2
    }
  }

  repositionBodies(shouldRepositionBody?: boolean) {
    if (!this.bodies) return
    const newCoors = this.bodyCoors
    Object.assign(this.bodies.constraint.pointA, newCoors)
    if (shouldRepositionBody)
      Body.setPosition(this.bodies.active, newCoors)
  }

  get w() {
    return this.still.w
  }

  get mouseVector() {
    const { p5 } = this
    return p5.createVector(p5.mouseX, p5.mouseY)
  }

  get motionData() {
    const { p5 } = this
    if (
      !this.motionSettings ||
      !validateRef(this.motionSettings.motionSettingsRef) ||
      !validateRef(this.motionSettings.gimbalRef) ||
      !this.motionSettings.motionSettingsRef.current.isUsable
    ) return undefined

    const { gimbalRef } = this.motionSettings

    const gimbal = gimbalRef.current
    const { x, z } = new THREE.Euler().setFromQuaternion(gimbal.quaternion, 'XZY')
    return p5.createVector(z, -(x - Math.PI / 2))
      .mult(180 / Math.PI)

  }
}

export default Glyph