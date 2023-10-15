import _ from 'lodash'
import breakpts from '../../data/breakpoints'
import { sortLike, typedKeys } from '../commonUtils'
import { Breakpt } from '../queryUtil'
import { getRem } from '../sizeUtils'
import Size from './size'

type MobileBreakptSizesType = { s: number, m: number }
type TabletBreakptSizesType = { m: number, l: number }
type DesktopBreakptSizesType = { l: number, xxl: number, xxlSm?: number }
export type BreakptSizesType = MobileBreakptSizesType | TabletBreakptSizesType | DesktopBreakptSizesType
export type RequiredBreakptSizesType = MobileBreakptSizesType | TabletBreakptSizesType | Required<DesktopBreakptSizesType>

type slopeType = {
  vw: number,
  rem: number
}

const lHeight = 620
const xxlHeight = 1200
const xxlSmHeight = 800

export class BreakptSizer {
  breakptSizes: MobileBreakptSizesType | TabletBreakptSizesType | Required<DesktopBreakptSizesType>
  lowerBreakpt: Breakpt
  upperBreakpt: Breakpt

  constructor(breakptSizes: BreakptSizesType) {
    this.breakptSizes = !(Breakpt.xxl in breakptSizes) ? breakptSizes : {
      ...breakptSizes,
      xxlSm: breakptSizes.xxlSm !== undefined ? breakptSizes.xxlSm : breakptSizes.xxl
    }

    const [lowerBreakpt, upperBreakpt] = sortLike(
      typedKeys(_.omit(this.breakptSizes, 'xxlSm')),
      typedKeys<Breakpt>(Breakpt)
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
    // theoretically could be done without typecast
    // but would be significantly more complex
    return this.breakptSizes[this.lowerBreakpt as keyof typeof this.breakptSizes] as number
  }

  private get upperSize() {
    return this.breakptSizes[this.upperBreakpt as keyof typeof this.breakptSizes] as number
  }

  private get lowerBreakptWidth() {
    return breakpts[this.lowerBreakpt]
  }

  private get upperBreakptWidth() {
    return breakpts[this.upperBreakpt]
  }

  private get vh() {
    return !(Breakpt.xxl in this.breakptSizes) ? 0 :
      (this.breakptSizes.xxl - this.breakptSizes.xxlSm) / (xxlHeight - xxlSmHeight)
  }
}

