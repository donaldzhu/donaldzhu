import { getRem, getVw, sortLike } from './commonUtils'
import { BREAKPOINT_ENUM } from './queryUtil'
import breakpoints from '../data/breakpoints.json'
import _ from 'lodash'

// units
const createSuffixFunction = suffix => quantity => `${quantity}${suffix}`
export const px = createSuffixFunction('px')
export const vw = createSuffixFunction('vw')
export const vh = createSuffixFunction('vh')
export const percent = createSuffixFunction('%')
export const em = createSuffixFunction('em')
export const rem = createSuffixFunction('rem')

// query
export const vwWithVhCss = (vwPerecntage, vhPercentage, remSize) =>
  `calc(${vwPerecntage}vw + ${vhPercentage}vh${remSize ? ` + ${remSize}rem` : ''})`

const getSlope = (lowerVal, upperVal, lowerBreakpoint, upperBreakpoint) => {
  const m = (upperVal - lowerVal) / (upperBreakpoint - lowerBreakpoint)
  const b = upperVal - (m * upperBreakpoint)
  return { m: _.round(m * 100, 3), b: _.round(b, 3) }
}

const getSlopeRem = (lowerVal, upperVal, lowerBreakpoint, upperBreakpoint) => {
  const rem = getRem()
  const { m, b } = getSlope(lowerVal * rem, upperVal * rem, lowerBreakpoint, upperBreakpoint)
  return { m: _.round(m, 3), b: _.round(b / rem, 3) }
}

const vwSlopedCss = (vwPercentage, remSize, useRem = true) =>
  `calc(${vwPercentage}vw + ${remSize}${useRem ? 'rem' : 'px'})`
const vwSlopedValue = (vwPercentage, intercept) => getVw(vwPercentage) + intercept

const sortQueryKeys = sizes => {
  const { keys } = BREAKPOINT_ENUM
  const [lowerBreakpoint, upperBreakpoint] = sortLike(Object.keys(sizes), keys)
  return { lowerBreakpoint, upperBreakpoint }
}

const getResponsiveSlope = (sizes, useRem) => {
  const { lowerBreakpoint, upperBreakpoint } = sortQueryKeys(sizes)
  const slopeFunction = useRem ? getSlopeRem : getSlope
  return slopeFunction(
    sizes[lowerBreakpoint],
    sizes[upperBreakpoint],
    breakpoints[lowerBreakpoint],
    breakpoints[upperBreakpoint]
  )
}
const getReponsive = (sizes, { useRem, returnCss }) => {
  const { m, b } = getResponsiveSlope(sizes, useRem)
  return returnCss ? vwSlopedCss(m, b, useRem) : vwSlopedValue(m, b)
}

export const responsiveSize = sizes => getReponsive(sizes, { useRem: false, returnCss: true })
export const responsiveRem = sizes => getReponsive(sizes, { useRem: true, returnCss: true })
export const responsiveValue = sizes => getReponsive(sizes, { useRem: false, returnCss: false })

// general
export const getHighZIdex = level => '9'.repeat(level)
export const toPercent = decimal => percent(decimal * 100)