import breakpts from '../data/breakpoints'
import { mapObject, toPairs } from './commonUtils'

export enum Breakpt {
  s = 's',
  m = 'm',
  l = 'l',
  xl = 'xl',
  xxl = 'xxl'
}

export enum Device {
  mobile = 'mobile',
  desktop = 'desktop'
}

export const queries = mapObject(breakpts, (_, breakpt) =>
  `only screen and (min-width: ${breakpt + 1}px)`)

export const getBreakptKey = () => {
  if (window.screen.width >= breakpts.xxl)
    return Breakpt.xxl
  if (window.screen.width < breakpts.s)
    return Breakpt.s
  const breakptPairs = toPairs(breakpts)
    .sort((a, b) => a[1] - b[1])
  const breakptPair = breakptPairs
    .find(([_, breakptWidth]) => breakptWidth >= window.screen.width)
  if (!breakptPair) return breakptPairs[0][0]
  return breakptPair[0]
}

// TODO
export const getPreloadBreakpt = () => {
  const breakpt = getBreakptKey()
  return breakpt === Breakpt.m || breakpt === Breakpt.s ?
    Breakpt.l : breakpt
}