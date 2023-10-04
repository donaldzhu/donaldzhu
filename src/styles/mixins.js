import { mapObject } from '../utils/commonUtils'
import { getHighZIdex } from '../utils/styleUtils'
import colors from './colors'
import { fontParams } from './fonts'
import sizes from './sizes'

export const recursiveCenterText = () => `
  position: relative;
  top: 0.125em;
`

const parsePositions = (positions, unitName1, unitName2) => {
  const { [unitName1]: unit1, [unitName2]: unit2 } = positions
  return `${!unit1 && !unit2 ? `${unitName1}: 0` :
    unit1 ? `${unitName1}: ${unit1}` :
      `${unitName2}: ${unit2}`};`
}

export const fixed = (positions = {}) => `
  position: fixed;
  ${parsePositions(positions, 'top', 'bottom')};
  ${parsePositions(positions, 'left', 'right')};
`

export const fullscreen = () => `
  width: 100vw;
  height: 100vh;
`

export const flex = (
  alignItems = 'initial',
  justifyContent = 'initial',
  isInLine = false
) => `
  display: ${isInLine ? 'inline-' : ''}flex;
  justify-content: ${justifyContent};
  align-items: ${alignItems};
`

export const squared = size => `
  width: ${size};
  height: ${size};
`

export const innerMargin = (margin, direction = 'top') => `
  >:not(:first-child) {     
    margin-${direction}: ${margin};
  }
`

export const highZIndex = level => `z-index: ${getHighZIdex(level)};`
export const noSelect = () => 'user-select: none;'

export const fontVar = config => {
  config = {
    MONO: 0,
    CASL: 0,
    slnt: 0,
    CRSV: 0.5,
    ...config
  }
  return `font-variation-settings: ${Object.entries(config).map(([key, value]) => `"${key}" ${value}`).join(',')};`
}

export const slant = () => fontVar({ slnt: -5, CRSV: 1, MONO: fontParams.monoVariable })
export const underline = () => `
  text-decoration: underline; 
  text-underline-offset: 0.125em;
`

export const hoverActive = () => `
  &:hover {
    color:${colors.activeElem}; 
  }
`

export const media = ({ $aspectRatio, $hasLoaded }) => `
  aspect-ratio: ${$aspectRatio};
  background-color: ${$hasLoaded ? '' : 'rgb(240,240,240)'};
  border-radius: ${sizes.mediaBorderRadius};
`

const mixins = {
  recursiveCenterText,
  fixed,
  fullscreen,
  flex,
  squared,
  innerMargin,
  highZIndex,
  noSelect,
  fontVar,
  slant,
  underline,
  hoverActive,
  media,
  chain: function () {
    const chainedObject = {
      ...mixins,
      _accumulator: ''
    }
    mapObject(chainedObject, (mixinName, originalMixin) => {
      chainedObject[mixinName] = function (...args) {
        this._accumulator += originalMixin(...args)
        const returnFunction = () => this._accumulator
        return Object.assign(returnFunction, this)
      }
    })
    return chainedObject
  }
}

export default mixins