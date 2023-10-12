import Size from '../../utils/helpers/size'

export interface BrushSetting {
  splitNum: number
  spring: number
  friction: number
  fill: number | string
  sizeReductionFactor: number
  maxSize: Size
  minSize: Size
}