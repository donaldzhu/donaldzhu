import _ from 'lodash'
import breakpts from '../../data/breakpoints'
import { getRem, sortLike, typedKeys } from '../commonUtils'
import { BreakptEnum } from '../queryUtil'
import Size from './size'

type mobileBreakptSizesType = { s: number, m: number }
type tabletBreakptSizesType = { m: number, l: number }
type desktopBreakptSizesType = { l: number, xxl: number, xxlSm?: number }
type breakptSizesType = mobileBreakptSizesType | tabletBreakptSizesType | desktopBreakptSizesType


type slopeType = {
  vw: number,
  rem: number
}

const lHeight = 620
const xxlHeight = 1200
const xxlSmHeight = 800

class Sizer {
  breakptSizes: Required<breakptSizesType>
  lowerBreakpt: string
  upperBreakpt: string

  constructor(breakptSizes: breakptSizesType) {
    this.breakptSizes = !(BreakptEnum.xxl in breakptSizes) ? breakptSizes : {
      ...breakptSizes,
      xxlSm: breakptSizes.xxlSm !== undefined ? breakptSizes.xxlSm : breakptSizes.xxl
    }
    const [lowerBreakpt, upperBreakpt] = sortLike(
      typedKeys(_.omit(this.breakptSizes, 'xxlSm')),
      typedKeys<BreakptEnum>(BreakptEnum)
    )

    this.lowerBreakpt = lowerBreakpt
    this.upperBreakpt = upperBreakpt
  }

  private getSlope(lowerSize: number, upperSize: number): slopeType {
    const upperSizeWidthComponent = upperSize - this.vh * xxlHeight
    const lowerSizeWidthComponent = lowerSize - this.vh * lHeight
    const vw = (upperSizeWidthComponent - lowerSizeWidthComponent) /
      (this.upperBreakptWidth - this.lowerBreakptWidth)
    const px = upperSizeWidthComponent - (vw * this.upperBreakptWidth)
    return { vw: _.round(vw * 100, 3), rem: _.round(px / getRem(), 3) }
  }

  getSize(useRem: boolean) {
    const remFactor = useRem ? getRem() : 1
    const lowerSize = this.lowerSize * remFactor
    const upperSize = this.upperSize * remFactor
    const { vw, rem } = this.getSlope(lowerSize, upperSize)
    return new Size({ vw, vh: this.vh * 100, rem: _.round(rem, 3) })
  }

  private get lowerSize() {
    return this.breakptSizes[this.lowerBreakpt]
  }

  private get upperSize() {
    return this.breakptSizes[this.upperBreakpt]
  }

  private get lowerBreakptWidth() {
    return breakpts[this.lowerBreakpt]
  }

  private get upperBreakptWidth() {
    return breakpts[this.upperBreakpt]
  }

  private get vh() {
    return !(BreakptEnum.xxl in this.breakptSizes) ? 0 :
      (this.breakptSizes.xxl - this.breakptSizes.xxlSm) / (xxlHeight - xxlSmHeight)
  }
}

export const getSize = (breakptSizes: breakptSizesType) =>
  new Sizer(breakptSizes).getSize(false)

export const getRemSize = (breakptSizes: breakptSizesType) =>
  new Sizer(breakptSizes).getSize(true)



