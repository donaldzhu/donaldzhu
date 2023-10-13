import { BreakptSizer, breakptSizesType } from './helpers/breakptSizer'

export const enum unitEnums {
  vw = 'vw',
  vh = 'vh',
  px = 'px',
  '%' = '%',
  em = 'em',
  rem = 'rem'
}

const createSuffixFunction = (suffix: unitEnums) =>
  (quantity: number) => `${quantity}${suffix}`

export const px = createSuffixFunction(unitEnums.px)
export const vw = createSuffixFunction(unitEnums.vw)
export const vh = createSuffixFunction(unitEnums.vh)
export const percent = createSuffixFunction(unitEnums['%'])
export const em = createSuffixFunction(unitEnums.em)
export const rem = createSuffixFunction(unitEnums.rem)

export const getVw = (percentage = 100) => window.innerWidth / 100 * percentage
export const getVh = (percentage = 100) => window.innerHeight / 100 * percentage
export const getRem = (multiplier = 1) => parseFloat(getComputedStyle(
  document.documentElement).fontSize) * multiplier

export const getNativeResolution = () => [
  window.screen.width * window.devicePixelRatio,
  window.screen.height * window.devicePixelRatio,
]

export const toPercent = (decimal: number) => percent(decimal * 100)

export const getSize = (breakptSizes: breakptSizesType) =>
  new BreakptSizer(breakptSizes).getSize(false)

export const getRemSize = (breakptSizes: breakptSizesType) =>
  new BreakptSizer(breakptSizes).getSize(true)


