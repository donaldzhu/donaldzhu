import _ from 'lodash'
import { getRem, getVw, sortLike, validateString } from './commonUtils'
import { breakptEnum } from './queryUtil.ts'
import breakpts from '../data/breakpoints.ts'

// units
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

// query
export const vwWithVhCss = (vwPerecntage: number, vhPercentage: number, remSize?: number) =>
  `calc(${vwPerecntage}vw + ${vhPercentage}vh${validateString(remSize, ` + ${remSize}rem`)})`

type slopeFuntionType = (
  lowerVal: number,
  upperVal: number,
  lowerBreakpt: number,
  upperBreakpt: number
) => {
  m: number,
  b: number
}

const getSlope: slopeFuntionType = (lowerVal, upperVal, lowerBreakpt, upperBreakpt) => {
  const m = (upperVal - lowerVal) / (upperBreakpt - lowerBreakpt)
  const b = upperVal - (m * upperBreakpt)
  return { m: _.round(m * 100, 3), b: _.round(b, 3) }
}

const getSlopeRem: slopeFuntionType = (lowerVal, upperVal, lowerBreakpt, upperBreakpt) => {
  const rem = getRem()
  const { m, b } = getSlope(lowerVal * rem, upperVal * rem, lowerBreakpt, upperBreakpt)
  return { m: _.round(m, 3), b: _.round(b / rem, 3) }
}

const vwSlopedCss = (vwPercentage: number, remSize: number, useRem = true) =>
  `calc(${vwPercentage}vw + ${remSize}${useRem ? 'rem' : 'px'})`
const vwSlopedValue = (vwPercentage: number, intercept: number) => getVw(vwPercentage) + intercept

const sortQueryKeys = sizes => {
  const [lowerBreakpt, upperBreakpt] = sortLike(Object.keys(sizes), Object.keys(breakptEnum))
  return { lowerBreakpt, upperBreakpt }
}

const getResponsiveSlope = (sizes, useRem: boolean) => {
  const { lowerBreakpt, upperBreakpt } = sortQueryKeys(sizes)
  const slopeFunction = useRem ? getSlopeRem : getSlope
  return slopeFunction(
    sizes[lowerBreakpt],
    sizes[upperBreakpt],
    breakpts[lowerBreakpt],
    breakpts[upperBreakpt]
  )
}
const getReponsive = (sizes, { useRem, returnCss }) => {
  const { m, b } = getResponsiveSlope(sizes, useRem)
  return returnCss ? vwSlopedCss(m, b, useRem) : vwSlopedValue(m, b)
}

export const responsiveCssSize = sizes => getReponsive(sizes, { useRem: false, returnCss: true })
export const responsiveRem = sizes => getReponsive(sizes, { useRem: true, returnCss: true })
export const responsiveValue = sizes => getReponsive(sizes, { useRem: false, returnCss: false })

// general
export const getHighZIdex = (level: number) => '9'.repeat(level)
export const toPercent = (decimal: number) => percent(decimal * 100)