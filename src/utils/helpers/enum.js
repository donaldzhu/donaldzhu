export class Enum {
  constructor(keys, startingIndex = 0) {
    this.keys = keys
    keys.forEach((key, i) => this[key] = i + startingIndex)
  }
}

export class StringEnum {
  constructor(keys) {
    this.keys = keys
    keys.forEach(key => this[key] = key)
    Object.defineProperty(this, 'keys', {
      enumerable: false
    })
  }
}