import _ from 'lodash'

class RollingFilter {
  values: number[]
  private _size: number
  constructor(size: number) {
    this.values = []
    this._size = size
  }

  add(newValue: number) {
    this.values.push(newValue)
    this.trim()
  }

  private trim() {
    while (this.values.length > this._size)
      this.values.shift()
  }

  get sum() {
    return _.sum(this.values)
  }

  get mean() {
    return !this.values.length ? undefined : (this.sum / this.values.length)
  }

  get max() {
    return _.max(this.values)
  }

  get min() {
    return _.min(this.values)
  }

  get size() {
    return this.size
  }

  set size(newSize: number) {
    this._size = newSize
    this.trim()
  }
}

export default RollingFilter