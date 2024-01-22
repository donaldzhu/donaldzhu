import _ from 'lodash'
import { loopObject, validateString } from '../utils/commonUtils'
import { desktopQuery } from '../utils/queryUtil'
import { em } from '../utils/sizeUtils'
import { fontParams } from './fonts'
import { domSizes } from './sizes'
import type { FontVarConfigProps, MediaProps, PositionProps } from './styleTypes'

const recursiveCenterText = () => `
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

const fixed = (positions: PositionProps = {}) => `
  position: fixed;
  ${parsePositions(positions, 'top', 'bottom')};
  ${parsePositions(positions, 'left', 'right')};
`

const fullscreen = () => `
  width: 100dvw;
  height: 100dvh;
`

const flex = (
  alignItems = 'initial',
  justifyContent = 'initial',
  isInLine = false
) => `
  display: ${validateString(isInLine, 'inline-')}flex;
  justify-content: ${justifyContent};
  align-items: ${alignItems};
`

const squared = (size: string | number) => `
  width: ${size};
  height: ${size};
`

const innerMargin = (margin: string, direction = 'top') => `
  >:not(:first-child) {
    margin-${direction}: ${margin};
  }
`

const mobileBody = () => `
  width: ${domSizes.mobile.app.width.css};
  padding: 0 ${domSizes.mobile.app.margin.css};
`

const highZIndex = (level: number) => `z-index: ${'9'.repeat(level)};`
const noSelect = () => `
  user-select: none;
  -webkit-user-select: none;
`

const fontVar = (config: FontVarConfigProps) => {
  config = {
    MONO: 0,
    CASL: 0,
    slnt: 0,
    CRSV: 0.5,
    ...config
  }
  return `font-variation-settings: ${Object.entries(config).map(([key, value]) =>
    `"${key}" ${value}`).join(',')};`
}

const slant = () => fontVar({ slnt: -5, CRSV: 1, MONO: fontParams.monoVariable })
const underline = (thickness?: string, offset?: string) => `
  text-decoration: underline;
  text-decoration-thickness: ${thickness ?? 'inherit'};
  @media ${desktopQuery} {
    text-underline-offset: ${offset ?? em(0.125)};
  }
  text-underline-offset: ${offset ?? em(0.2)};
`
const textMono = () => fontVar({ MONO: fontParams.monoVariable })

const media = ({ $aspectRatio, $hasLoaded, $isZoomed }: MediaProps) => `
  ${validateString($aspectRatio, `aspect-ratio: ${$aspectRatio};`)}
  background-color: ${validateString(!$hasLoaded, $isZoomed ? 'white' : 'rgb(240,240,240)')};
  border-radius: ${domSizes.desktop.media.borderRadius.css};
`

interface MixinInterface {
  recursiveCenterText: typeof recursiveCenterText
  fixed: typeof fixed
  fullscreen: typeof fullscreen
  flex: typeof flex
  squared: typeof squared
  mobileBody: typeof mobileBody
  innerMargin: typeof innerMargin
  highZIndex: typeof highZIndex
  noSelect: typeof noSelect
  fontVar: typeof fontVar
  slant: typeof slant
  underline: typeof underline
  textMono: typeof textMono
  media: typeof media
}


type chainedMixinType<R extends boolean = false> = {
  [P in keyof MixinInterface]: (...args: Parameters<MixinInterface[P]>) => (() => string) &
    (R extends true ? Partial<chainedMixinType<R>> : chainedMixinType<R>)
}

const mixins: MixinInterface & { chain: () => chainedMixinType } = {
  recursiveCenterText,
  fixed,
  fullscreen,
  flex,
  squared,
  mobileBody,
  innerMargin,
  highZIndex,
  noSelect,
  fontVar,
  slant,
  underline,
  textMono,
  media,
  chain: function () {
    const chainedObject: Partial<chainedMixinType<true>> = {}
    let accumulatedReturn = ''
    loopObject(_.omit(mixins, 'chain'), (mixinName, originalMixin) => {
      chainedObject[mixinName] = function (...args: Parameters<typeof originalMixin>) {
        accumulatedReturn += (originalMixin as unknown as (...args: any) => () => string)(...args)
        const returnFunction = () => accumulatedReturn
        return Object.assign(returnFunction, this)
      }
    })
    return chainedObject as chainedMixinType<false>
  }
}

export default mixins