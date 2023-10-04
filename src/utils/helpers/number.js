class ExtremeNumber {
  constructor(extremum, toCompare) {
    this.value = extremum
    this.toCompare = toCompare
  }

  compare(newValue) {
    this.value = this.toCompare(newValue, this.value)
  }
}

export class MaxNumber extends ExtremeNumber {
  constructor() {
    super(-Infinity, Math.max)
  }
}

export class MinNumber extends ExtremeNumber {
  constructor() {
    super(Infinity, Math.min)
  }
}
