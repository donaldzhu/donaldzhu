import { getNativeResolution, mapObject } from './commonUtils'
import { StringEnum } from './helpers/enum'
import breakpoints from '../data/breakpoints.json'

export const BREAKPOINT_ENUM = new StringEnum(['l', 'xl', 'xxl'])
const queries = mapObject({ ...breakpoints }, (key, breakpoint, breakpoints) =>
  breakpoints[key] = `only screen and (min-width: ${breakpoint}px)`)

export default queries

export const getBreakpointKey = () => {
  const [width] = getNativeResolution()
  const breakpointSizes = Object.values(breakpoints)
  let maxBreakpointIndex
  for (let i = 0; i < breakpointSizes.length; i++)
    if (breakpointSizes[i] <= width)
      maxBreakpointIndex = i
    else break
  return BREAKPOINT_ENUM.keys[maxBreakpointIndex]
}