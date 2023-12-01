import breakpts from '../data/breakpoints'
import { Breakpt } from './breakptTypes'
import { mapObject, toPairs } from './commonUtils'

const createQueries = (sizePrefix: 'max' | 'min') =>
  mapObject(breakpts, (_, breakpt) =>
    `only screen and (${sizePrefix}-width: ${breakpt + (sizePrefix === 'min' ? 1 : 0)}px)`)

export const minQueries = createQueries('min')
export const maxQueries = createQueries('max')
export const desktopQuery = minQueries.l
export const mobileQuery = maxQueries.l

const getScreenWidth = () => Math.round(window.screen.width * window.devicePixelRatio)

export const getBreakptKey = () => {
  const screenWidth = getScreenWidth()
  if (screenWidth >= breakpts.xxl)
    return Breakpt.Xxl
  if (screenWidth < breakpts.s)
    return Breakpt.S
  const breakptPairs = toPairs(breakpts)
    .sort((a, b) => a[1] - b[1])
  const breakptPair = breakptPairs
    .find(([_, breakptWidth]) => breakptWidth >= screenWidth)
  if (!breakptPair) return breakptPairs[0][0]
  return breakptPair[0]
}

export const getIsMobile = () => getScreenWidth() <= breakpts.l
