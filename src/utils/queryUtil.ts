import breakpts from '../data/breakpoints'
import { mapObject, toPairs } from './commonUtils'
import { getNativeResolution } from './sizeUtils'

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
  const [width] = getNativeResolution()
  const breakptPairs = toPairs(breakpts)
    .sort((a, b) => a[1] - b[1])
  const breakptPair = breakptPairs
    .find(([_, breakptWidth]) => breakptWidth >= width)
  if (!breakptPair) return breakptPairs[0][0]
  return breakptPair[0]
}

