import _ from 'lodash'
import { loopObject } from '../utils/commonUtils'
import { getHighZIdex } from '../utils/styleUtils'
import { fontParams } from './fonts'
import { sizes } from './sizes'
import { fontVarConfigType, mediaPropsType, positionsType } from './types'

export const recursiveCenterText = () => `
  position: relative;
  top: 0.125em;
`

const parsePositions = <U1 extends string, U2 extends string>(
  positions: Partial<Record<U1 | U2, string | number>>,
  unitName1: U1,
  unitName2: U2
) => {
  const { [unitName1]: unit1, [unitName2]: unit2 } = positions
  return `${!unit1 && !unit2 ? `${unitName1}: 0` :
    unit1 ? `${unitName1}: ${unit1}` :
      `${unitName2}: ${unit2}`};`
}

export const fixed = (positions: positionsType = {}) => `
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

export const squared = (size: string) => `
  width: ${size};
  height: ${size};
`

export const innerMargin = (margin: string, direction = 'top') => `
  >:not(:first-child) {
    margin-${direction}: ${margin};
  }
`

export const highZIndex = (level: number) => `z-index: ${getHighZIdex(level)};`
export const noSelect = () => 'user-select: none;'

export const fontVar = (config: fontVarConfigType) => {
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

export const media = ({ $aspectRatio, $hasLoaded }: mediaPropsType) => `
  aspect-ratio: ${$aspectRatio};
  background-color: ${$hasLoaded ? '' : 'rgb(240,240,240)'};
  border-radius: ${sizes.media.borderRadius.css};
`

interface MixinInterface {
  recursiveCenterText: typeof recursiveCenterText
  fixed: typeof fixed
  fullscreen: typeof fullscreen
  flex: typeof flex
  squared: typeof squared
  innerMargin: typeof innerMargin
  highZIndex: typeof highZIndex
  noSelect: typeof noSelect
  fontVar: typeof fontVar
  slant: typeof slant
  underline: typeof underline
  media: typeof media
}


type chainedMixinType<T> = {
  [P in keyof MixinInterface]: (...args: Parameters<MixinInterface[P]>) => (() => string) &
    (T extends true ? Partial<chainedMixinType<T>> : chainedMixinType<T>)
}

const mixins: MixinInterface & { chain: () => chainedMixinType<false> } = {
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
  media,
  chain: function () {
    const chainedObject: Partial<chainedMixinType<true>> = {}
    let accumulatedReturn = ''
    loopObject(_.omit(mixins, 'chain'), (mixinName, originalMixin) => {
      chainedObject[mixinName] = function (...args: Parameters<typeof originalMixin>) {
        // @ts-ignore
        accumulatedReturn += originalMixin(...args)
        const returnFunction = () => accumulatedReturn
        return Object.assign(returnFunction, this)
      }
    })
    return chainedObject as chainedMixinType<false>
  }
}

export default mixins