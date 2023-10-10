import _ from 'lodash'
import { getNativeResolution, mapObject } from './commonUtils'
import { createStringEnum } from './helpers/enum'
import breakpts from '../data/breakpoints'

export const BREAKPOINT_ENUM = createStringEnum(['l', 'xl', 'xxl'])
const queries = mapObject(breakpts, (_, breakpt) =>
  `only screen and (min-width: ${breakpt}px)`)

export default queries

export const getBreakptKey = () => {
  const [width] = getNativeResolution()
  const breakptPairs = _.toPairs(breakpts)
    .sort((a, b) => a[1] - b[1])
  const breakptPair = breakptPairs
    .find(([_, breakptWidth]) => breakptWidth >= width)
  if (!breakptPair) return breakptPairs[0][0]
  return breakptPair[0]
}