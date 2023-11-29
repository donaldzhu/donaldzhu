import breakpts from '../data/breakpoints'
import { mapObject, toPairs } from './commonUtils'

export enum Breakpt {
  S = 's',
  M = 'm',
  L = 'l',
  Xl = 'xl',
  Xxl = 'xxl'
}

export enum Device {
  mobile = 'mobile',
  desktop = 'desktop'
}

const createQueries = (sizePrefix: 'max' | 'min') =>
  mapObject(breakpts, (_, breakpt) =>
    `only screen and (${sizePrefix}-width: ${breakpt + (sizePrefix === 'min' ? 1 : 0)}px)`)

export const minQueries = createQueries('min')
export const maxQueries = createQueries('max')
export const desktopQuery = minQueries.l
export const mobileQuery = maxQueries.l

export const getBreakptKey = () => {
  if (window.screen.width >= breakpts.xxl)
    return Breakpt.Xxl
  if (window.screen.width < breakpts.s)
    return Breakpt.S
  const breakptPairs = toPairs(breakpts)
    .sort((a, b) => a[1] - b[1])
  const breakptPair = breakptPairs
    .find(([_, breakptWidth]) => breakptWidth >= window.screen.width)
  if (!breakptPair) return breakptPairs[0][0]
  return breakptPair[0]
}

export const getIsMobile = () => window.screen.width <= breakpts.l
