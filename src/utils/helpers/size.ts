import _ from 'lodash'
import { filterFalsy, getRem, getVh, getVw, validateString } from '../commonUtils'
import { unitEnums } from '../styleUtils'

type sizeTypes = unitEnums.vw | unitEnums.vh | unitEnums.rem

class Size {
  vw: number
  vh: number
  rem: number
  constructor({ vw = 0, vh = 0, rem = 0 }) {
    this.vw = vw
    this.vh = vh
    this.rem = rem
  }

  add(addend: Size) {
    return this.calcWithSize(addend, (a: number, b: number) => a + b)
  }

  sub(subtrahend: Size) {
    return this.calcWithSize(subtrahend, (a: number, b: number) => a - b)
  }

  mult(factor: number) {
    return this.calcWithNum(factor, (a: number, b: number) => a * b)
  }

  div(dividend: number) {
    return this.calcWithNum(dividend, (a: number, b: number) => a / b)
  }

  private calcWithSize(targetSize: Size, operation: (thisUnit: number, targetUnit: number) => number) {
    return new Size({
      vw: operation(this.vw, targetSize.vw),
      vh: operation(this.vh, targetSize.vh),
      rem: operation(this.rem, targetSize.rem)
    })
  }

  private calcWithNum(targetNumber: number, operation: (thisUnit: number, targetUnit: number) => number) {
    return new Size({
      vw: operation(this.vw, targetNumber),
      vh: operation(this.vh, targetNumber),
      rem: operation(this.rem, targetNumber)
    })
  }

  get css() {
    const units: sizeTypes[] = [unitEnums.vw, unitEnums.vh, unitEnums.rem]
    const addends = units.map(unit => this.returnUnit(unit)).filter(filterFalsy)
    return `calc(${addends.join(' + ')})`
  }

  get value() {
    return _.round(getVw(this.vw) + getVh(this.vh) + getRem(this.rem), 3)
  }

  private returnUnit(unit: sizeTypes) {
    return validateString(this[unit], this[unit] + unit)
  }

  static subFromFullWidth(subtrahend: Size) {
    return new Size({ vw: 100 }).sub(subtrahend)
  }

  static subFromFullHeight(subtrahend: Size) {
    return new Size({ vh: 100 }).sub(subtrahend)
  }
}

export default Size