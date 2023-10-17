import breakpts from '../data/breakpoints'
import { mapObject, toPairs } from './commonUtils'

export enum Breakpt {
  s = 's',
  m = 'm',
  l = 'l',
  xl = 'xl',
  xxl = 'xxl'
}

export const queries = mapObject(breakpts, (_, breakpt) =>
  `only screen and (min-width: ${breakpt}px)`)

export const getBreakptKey = () => {
  if (window.screen.width >= breakpts.xxl)
    return Breakpt.xxl
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