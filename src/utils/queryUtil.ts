import breakpts from '../data/breakpoints'
import { Breakpt, Device } from './breakptTypes'
import { mapObject, toPairs } from './commonUtils'

const createQueries = (sizePrefix: 'max' | 'min') =>
  mapObject(breakpts, (_, breakpt) =>
    `only screen and (${sizePrefix}-width: ${breakpt + (sizePrefix === 'min' ? 1 : 0)}px)`)

export const minQueries = createQueries('min')
export const maxQueries = createQueries('max')
export const desktopQuery = minQueries.l
export const mobileQuery = maxQueries.l

const getScreenWidth = () => Math.round(window.screen.width * window.devicePixelRatio)

export const getBreakptKey = (device: Device) => {
  const screenWidth = getScreenWidth()
  let breakpt: Breakpt

  if (screenWidth >= breakpts.xxl)
    breakpt = Breakpt.Xxl
  else if (screenWidth < breakpts.s)
    breakpt = Breakpt.S
  else {
    const breakptPairs = toPairs(breakpts).sort((a, b) => a[1] - b[1])
    const breakptPair = breakptPairs
      .find(([_, breakptWidth]) => breakptWidth >= screenWidth)
    if (!breakptPair) breakpt = breakptPairs[0][0]
    else breakpt = breakptPair[0]
  }

  if ([Breakpt.Xl, Breakpt.Xxl].includes(breakpt) &&
    device === Device.Mobile)
    breakpt = Breakpt.L
  else if ([Breakpt.S, Breakpt.M].includes(breakpt) &&
    device === Device.Desktop)
    breakpt = Breakpt.L

  return breakpt
}

export const getIsMobile = () => getScreenWidth() <= breakpts.l
