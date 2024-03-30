import { Bodies, Body, Composite, Constraint } from 'matter-js'

import bearingsData from '../../../data/vector/spacings.json'
import RollingFilter from '../../../utils/helpers/rollingFilter'
import { parseVector, wrapDrawingContext } from '../../../utils/p5Utils'
import { validateRef } from '../../../utils/typeUtils'
import { createMobilePhysicsSettings } from './constants'
import Vector from './vector'

import type p5 from 'p5'
import type Matter from 'matter-js'
import type { Engine } from 'matter-js'
import type { VectorSetting } from './vectorTypes'
import type { MobileCanvasStates } from '../../../components/common/canvas/canvasTypes'


class Glyph {
  private nativeBearings: number[]
  private engine: Engine | undefined

  private bodies: {
    active: Matter.Body,
    constraint: Constraint,
  } | undefined
  private minFrictionAir: number
  private rollingAccelFilter: RollingFilter
  private _mouseVector: p5.Vector
  private _rotationVector: p5.Vector
  private _accelVector: p5.Vector

  still: Vector
  active: Vector
  constructor(
    private p5: p5 | p5.Graphics,
    private name: keyof typeof bearingsData, // TODO: remove when mobile dev is finished
    public setting: VectorSetting,
    private canvasStates?: MobileCanvasStates
  ) {
    this.still = new Vector(p5, name, setting)
    this.active = new Vector(p5, name, setting)
    this.nativeBearings = bearingsData[name]

    this.engine = canvasStates?.engine
    this.bodies = undefined
    this.minFrictionAir = Infinity
    this.rollingAccelFilter = new RollingFilter(p5.frameRate())
    this._mouseVector = p5.createVector()
    this._rotationVector = p5.createVector()
    this._accelVector = p5.createVector()

    this.addBodies()
  }

  addBodies() {
    if (!this.engine) return
    if (this.bodies) this.cleanup()

    const { x, y } = this.still

    const setting = createMobilePhysicsSettings()
    const active = Bodies.circle(x, y, 10, setting.active)
    const constraint = Constraint.create({
      ...setting.constraint,
      pointA: this.still.position,
      bodyB: active
    })
    this.bodies = {
      active,
      constraint,
    }
    this.minFrictionAir = active.frictionAir

    Composite.add(this.engine.world, Object.values(this.bodies))
  }

  cleanup() {
    if (this.engine && this.bodies)
      Composite.remove(this.engine.world, Object.values(this.bodies))
    this.bodies = undefined
  }

  draw() {
    const { drawingSequence } = this.setting

    if (!this.setting.noMap)
      if (this.setting.isMobile)
        this.mapMobile()
      else this.mapDesktop()

    this.still.draw()
    this.active.draw()

    wrapDrawingContext(this.p5, () =>
      drawingSequence.forEach(methodName => this[methodName]()))
  }

  private mapMobile() {
    if (!this.bodies || !this.engine) throw new Error('No Matter.js bodies or engines was found.')
    this.rollingAccelFilter.size = this.p5.frameRate()
    this.active.setTransform(this.setting.mapMotionFunction.call(
      this.setting,
      this.rotationVector,
      this.accelVector,
      this.rollingAccelFilter,
      this.bodies,
      this.engine,
      this.minFrictionAir,
      {
        p5: this.p5,
        name: this.name,
        enabled: true
      }
    ))
  }

  private mapDesktop() {
    this.active.setTransform(this.setting.mapFunction.call(
      this.setting,
      this.still.position,
      this.mouseVector
    ))
  }

  drawLinks() {
    const { p5, setting } = this
    const { linkColor, linkWeight } = setting
    p5.strokeWeight(linkWeight.value)
    p5.stroke(`${linkColor}`)
    this.loopVectors(({ stillPoint, activePoint }) =>
      p5.line(...parseVector(stillPoint), ...parseVector(activePoint)))
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

  repositionBodies(shouldRepositionActive?: boolean) {
    if (!this.bodies) return
    Object.assign(this.bodies.constraint.pointA, this.still.position)
    if (shouldRepositionActive)
      Body.setPosition(this.bodies.active, this.active.position)
  }

  private loopVectors(callback: (vectorData: {
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
    this._mouseVector.x = p5.mouseX
    this._mouseVector.y = p5.mouseY
    return this._mouseVector
  }

  get accelVector() {
    const { p5 } = this
    if (this.canvasStates?.gyroStatesRef?.current?.isEnabled) {
      this._accelVector.x = p5.accelerationX
      this._accelVector.y = p5.accelerationY
      this._accelVector.z = p5.accelerationZ
    }
    return this._accelVector
  }

  get rotationVector() {
    let newRotationVector = { x: 0, y: 0, z: 0 }
    if (
      this.canvasStates &&
      validateRef(this.canvasStates.motionSettingsRef) &&
      validateRef(this.canvasStates.gimbalRef) &&
      this.canvasStates.gyroStatesRef.current?.isEnabled
    ) newRotationVector = this.canvasStates.gimbalRef.current.euler
    else newRotationVector.y = 25

    Object.assign(this._rotationVector, newRotationVector)
    return this._rotationVector
  }
}

export default Glyph