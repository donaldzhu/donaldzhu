import _ from 'lodash'
import { getNativeResolution, mapObject } from './commonUtils'
import breakpts from '../data/breakpoints'

export enum breakptEnum {
  l = 'l',
  xl = 'xl',
  xxl = 'xxl'
}

export const queries = mapObject(breakpts, (_, breakpt) =>
  `only screen and (min-width: ${breakpt}px)`)

export const getBreakptKey = () => {
  const [width] = getNativeResolution()
  const breakptPairs = _.toPairs(breakpts)
    .sort((a, b) => a[1] - b[1])
  const breakptPair = breakptPairs
    .find(([_, breakptWidth]) => breakptWidth >= width)
  if (!breakptPair) return breakptPairs[0][0]
  return breakptPair[0]
}

