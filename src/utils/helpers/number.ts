type toCompareType = (newValue: number, currValue: number) => number

abstract class ExtremeNumber {
  value: number
  constructor(extremum: number, private toCompare: toCompareType) {
    this.value = extremum
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
