import type { MutableRefObject } from 'react'
import type Size from '../../utils/helpers/size'

export interface BrushSetting {
  splitNum: number
  spring: number
  friction: number
  fill: number | string
  sizeReductionFactor: number
  maxSize: Size
  minSize: Size
  radius?: Size
}

export interface PlaceholderProp<T extends Element = HTMLDivElement> {
  placeholderRef: MutableRefObject<T | null>
}