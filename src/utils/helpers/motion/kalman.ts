export default class KalmanFilter {
  R: number
  Q: number
  A: number
  C: number
  B: number
  cov: number
  x: number

  constructor({ R = 1, Q = 1, A = 1, B = 0, C = 1 } = {}) {
    this.R = R
    this.Q = Q

    this.A = A
    this.C = C
    this.B = B
    this.cov = NaN
    this.x = NaN // estimated signal without noise
  }

  filter(z: number, u = 0) {
    if (isNaN(this.x)) {
      this.x = (1 / this.C) * z
      this.cov = (1 / this.C) * this.Q * (1 / this.C)
      return this.x
    }

    // compute prediction
    const predX = this.predict(u)
    const predCov = this.uncertainty()

    // kalman gain
    const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.Q))

    // correction
    this.x = predX + K * (z - (this.C * predX))
    this.cov = predCov - (K * this.C * predCov)
    return this.x
  }

  // predict next value
  predict(u = 0) {
    return (this.A * this.x) + (this.B * u)
  }

  // return uncertainty of filter
  uncertainty() {
    return ((this.A * this.cov) * this.A) + this.R
  }

  // return the last filtered measurement
  lastMeasurement() {
    return this.x
  }

  // set measurement noise Q
  setMeasurementNoise(noise: number) {
    this.Q = noise
  }

  // set the process noise R
  setProcessNoise(noise: number) {
    this.R = noise
  }
}