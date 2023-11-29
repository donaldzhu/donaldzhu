import _ from 'lodash'
import breakpts from '../../data/breakpoints'
import { sortLike, typedKeys } from '../commonUtils'
import { Breakpt } from '../queryUtil'
import { getRem } from '../sizeUtils'
import Size from './size'

interface MobileBreakptSizesType { s: number, m: number }
interface TabletBreakptSizesType { m: number, l: number }
interface NonDesktopBreakptSizesType { s: number, l: number }
interface DesktopBreakptSizesType { l: number, xxl: number, xxlSm?: number }
export type BreakptSizesType =
  NonDesktopBreakptSizesType |
  MobileBreakptSizesType |
  TabletBreakptSizesType |
  DesktopBreakptSizesType

interface slopeType {
  vw: number,
  rem: number
}

const lHeight = 620
const xxlHeight = 1200
const xxlSmHeight = 800

export class BreakptSizer {
  private breakptSizes: Partial<Record<Breakpt | 'xxlSm', number>>
  private lowerBreakpt: Breakpt
  private upperBreakpt: Breakpt

  constructor(breakptSizes: MobileBreakptSizesType)
  constructor(breakptSizes: TabletBreakptSizesType)
  constructor(breakptSizes: NonDesktopBreakptSizesType)
  constructor(breakptSizes: DesktopBreakptSizesType)
  constructor(breakptSizes: BreakptSizesType)
  constructor(breakptSizes: Partial<Record<Breakpt | 'xxlSm', number>>) {
    this.breakptSizes = !(Breakpt.Xxl in breakptSizes) ? breakptSizes : {
      ...breakptSizes,
      xxlSm: breakptSizes.xxlSm ?? breakptSizes.xxl
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
    const size = this.breakptSizes[this.lowerBreakpt]
    if (!size) throw new Error(`Breaktpoint (${this.lowerBreakpt}px) does not exist in setting.`)
    return size
  }

  private get upperSize() {
    const size = this.breakptSizes[this.upperBreakpt]
    if (!size) throw new Error(`Breaktpoint (${this.upperBreakpt}px) does not exist in setting.`)
    return size
  }

  private get lowerBreakptWidth() {
    return breakpts[this.lowerBreakpt]
  }

  private get upperBreakptWidth() {
    return breakpts[this.upperBreakpt]
  }

  private get vh() {
    return Breakpt.Xxl in this.breakptSizes && this.breakptSizes.xxl && this.breakptSizes.xxlSm ?
      (this.breakptSizes.xxl - this.breakptSizes.xxlSm) / (xxlHeight - xxlSmHeight) : 0
  }
}

