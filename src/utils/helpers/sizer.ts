import _ from 'lodash'
import breakpts from '../../data/breakpoints'
import { getRem } from '../commonUtils'

type breakptSizesType = Partial<Record<keyof typeof breakpts, number>>

type slopeType = {
  m: number,
  b: number
}

type slopeFuntionType = (
  lowerVal: number,
  upperVal: number,
  lowerBreakpt: number,
  upperBreakpt: number
) => slopeType

interface SizerInterface {
  breakptSizes: breakptSizesType
}

class Sizer implements SizerInterface {
  breakptSizes: breakptSizesType

  constructor(breakptSizes: breakptSizesType) {
    this.breakptSizes = breakptSizes
  }

  private getSlope(lowerVal: number, upperVal: number, lowerBreakpt: number, upperBreakpt: number): slopeType {
    const m = (upperVal - lowerVal) / (upperBreakpt - lowerBreakpt)
    const b = upperVal - (m * upperBreakpt)
    return { m: _.round(m * 100, 3), b: _.round(b, 3) }
  }

  private getSlopeRem(lowerVal: number, upperVal: number, lowerBreakpt: number, upperBreakpt: number): slopeType {
    const rem = getRem()
    const { m, b } = this.getSlope(lowerVal * rem, upperVal * rem, lowerBreakpt, upperBreakpt)
    return { m: _.round(m, 3), b: _.round(b / rem, 3) }
  }
}

export default Sizer