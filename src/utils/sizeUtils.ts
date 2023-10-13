import { BreakptSizer, breakptSizesType } from './helpers/breakptSizer'

export const enum Unit {
  Vw = 'vw',
  Vh = 'vh',
  Px = 'px',
  '%' = '%',
  Em = 'em',
  Rem = 'rem'
}

const createSuffixFunction = (suffix: Unit) =>
  (quantity: number) => `${quantity}${suffix}`

export const px = createSuffixFunction(Unit.Px)
export const vw = createSuffixFunction(Unit.Vw)
export const vh = createSuffixFunction(Unit.Vh)
export const percent = createSuffixFunction(Unit['%'])
export const em = createSuffixFunction(Unit.Em)
export const rem = createSuffixFunction(Unit.Rem)

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


