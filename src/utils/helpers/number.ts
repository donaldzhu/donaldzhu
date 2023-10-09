type toCompareType = (newValue: number, currValue: number) => number

class ExtremeNumber {
  value: number
  toCompare: toCompareType
  constructor(extremum: number, toCompare: toCompareType) {
    this.value = extremum
    this.toCompare = toCompare
  }

  compare(newValue: number) {
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
