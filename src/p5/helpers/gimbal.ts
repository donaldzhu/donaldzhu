
import * as THREE from 'three'
import { degToRad } from 'three/src/math/MathUtils'

class Gimbal {
  private quatOrigin: THREE.Quaternion
  private data: {
    beta: number,
    gamma: number,
  }
  private needsUpdate: boolean
  private recalRequested: boolean
  private eulerOrigin: THREE.Euler

  sensorRotations: THREE.Object3D<THREE.Object3DEventMap>
  quaternion: THREE.Quaternion

  constructor() {
    this.quaternion = new THREE.Quaternion()
    this.quatOrigin = new THREE.Quaternion()
    this.sensorRotations = new THREE.Object3D()
    this.data = {
      beta: 0,
      gamma: 0
    }

    this.needsUpdate = false
    this.recalRequested = false

    this.eulerOrigin = new THREE.Euler(
      degToRad(90),
      degToRad(180),
      degToRad(180 + screen.orientation.angle)
    )
  }

  private performRecalibration() {
    this.sensorRotations.setRotationFromEuler(this.eulerOrigin)

    this.sensorRotations.rotateX(degToRad(this.data.beta))
    this.sensorRotations.rotateY(degToRad(this.data.gamma))
    this.quatOrigin.copy(this.sensorRotations.quaternion)
    this.quatOrigin.invert()

    this.recalRequested = false
  }

  onSensorMove(event: DeviceOrientationEvent) {
    this.data.beta = event.beta ?? 0 // x axis [-180 , 180]
    this.data.gamma = event.gamma ?? 0 // y axis [-90 , 90]
    this.needsUpdate = true

    if (this.recalRequested) this.performRecalibration()
  }

  recalibrate() {
    this.recalRequested = true
  }

  update() {
    if (this.needsUpdate === false) return

    this.sensorRotations.setRotationFromEuler(this.eulerOrigin)
    this.sensorRotations.applyQuaternion(this.quatOrigin)
    this.sensorRotations.rotateX(degToRad(this.data.beta))
    this.sensorRotations.rotateY(degToRad(this.data.gamma))
    this.quaternion.copy(this.sensorRotations.quaternion)
    this.quaternion.invert()

    this.needsUpdate = false
  }
}

export default Gimbal