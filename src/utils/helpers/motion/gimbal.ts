
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'
import { TO_DEG } from '../../commonUtils'

type gimbalAxes = 'xy' | 'z'

class Gimbal {
  private quatOrigin: Record<gimbalAxes, THREE.Quaternion>
  private data: {
    beta: number,
    gamma: number,
    alpha: number
  }
  private needsUpdate: boolean
  private recalRequested: boolean
  private eulerOrigin: THREE.Euler

  rotation: Record<gimbalAxes, THREE.Object3D<THREE.Object3DEventMap>>
  quaternion: Record<gimbalAxes, THREE.Quaternion>

  constructor() {
    this.quaternion = this.createSeparate(() => new THREE.Quaternion())
    this.quatOrigin = this.createSeparate(() => new THREE.Quaternion())
    this.rotation = this.createSeparate(() => new THREE.Object3D())

    this.data = {
      beta: 0,
      gamma: 0,
      alpha: 0
    }

    this.needsUpdate = false
    this.recalRequested = false

    this.eulerOrigin = new THREE.Euler(
      degToRad(90),
      degToRad(180),
      degToRad(180 + screen?.orientation?.angle ?? 0)
    )
  }

  private performRecalibration(axes: gimbalAxes) {
    const rotation = this.rotation[axes]
    const quatOrigin = this.quatOrigin[axes]

    rotation.setRotationFromEuler(this.eulerOrigin)

    this.rotate(axes)

    quatOrigin.copy(rotation.quaternion)
    quatOrigin.invert()
  }

  onSensorMove(event: DeviceOrientationEvent) {
    this.data.beta = event.beta ?? 0 // x axis [-180, 180]
    this.data.gamma = event.gamma ?? 0 // y axis [-90, 90]
    this.data.alpha = event.alpha ?? 0 // z axis [0, 360]
    this.needsUpdate = true

    if (!this.recalRequested) return
    this.performRecalibration('xy')
    this.performRecalibration('z')
    this.recalRequested = false

  }

  recalibrate() {
    this.recalRequested = true
  }

  update() {
    if (!this.needsUpdate) return
    this.updateAxes('xy')
    this.updateAxes('z')
    this.needsUpdate = false
  }

  private updateAxes(axes: gimbalAxes) {
    const rotation = this.rotation[axes]
    const quatOrigin = this.quatOrigin[axes]
    const quaternion = this.quaternion[axes]

    rotation.setRotationFromEuler(this.eulerOrigin)
    rotation.applyQuaternion(quatOrigin)

    this.rotate(axes)

    quaternion.copy(rotation.quaternion)
    quaternion.invert()
  }

  private rotate(axes: gimbalAxes) {
    const rotation = this.rotation[axes]
    if (axes === 'xy') {
      rotation.rotateX(degToRad(this.data.beta))
      rotation.rotateY(degToRad(this.data.gamma))
    } else {
      // have to rotate two axes to avoid gimbal lock, it seems
      rotation.rotateY(degToRad(this.data.gamma))
      rotation.rotateZ(degToRad(this.data.alpha))
    }

  }

  private createSeparate<T>(callback: () => T) {
    return {
      xy: callback(),
      z: callback()
    }
  }

  get euler() {
    const xyEuler = new THREE.Euler().setFromQuaternion(this.quaternion.xy, 'XZY')
    const zEuler = new THREE.Euler().setFromQuaternion(this.quaternion.z, 'ZYX')
    // remapped
    return {
      x: xyEuler.z * TO_DEG,
      y: -(xyEuler.x - Math.PI / 2) * TO_DEG,
      z: zEuler.z * TO_DEG
    }
  }
}

export default Gimbal