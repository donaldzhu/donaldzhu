import { em, responsiveRem } from '../utils/styleUtils'

export const fontFamilies = {
  monoFont: '"Recursive", "Helvetica Neue", sans-serif;',
  sansFont: '"Manifont Grotesk", "Helvetica Neue", sans-serif;',
}

export const fontParams = {
  monoVariable: 0.525,
  semiLight: 375,
  semiBold: 575,
}

const sansToMonoratio = 1.03
const sidebarText = responsiveRem({ l: 1.325, xxl: 2.925 })
const workIndex = responsiveRem({ l: 0.85, xxl: 1.7 })
export const fontSizes = {
  autoPlayMessage: responsiveRem({ l: 1.5, xxl: 2.75 }),
  autoPlayInstrucution: responsiveRem({ l: 0.8, xxl: 1.35 }),

  sidebarText,
  sidebarTextSans: `calc(${sidebarText} * ${sansToMonoratio})`,
  title: responsiveRem({ l: 1.6, xxl: 2.3 }),
  footerLink: responsiveRem({ l: 1.15, xxl: 2 }),

  workIndex,
  workIndexSans: `calc(${workIndex} * ${sansToMonoratio})`,


  workDescription: responsiveRem({ l: 1, xxl: 1.8 }),
  workDetails: responsiveRem({ l: 0.7, xxl: 1.25 }),

  toolTip: responsiveRem({ l: 1.5, xxl: 2.5 }),
  toolTipPopUp: responsiveRem({ l: 1, xxl: 1.75 }),

  canvasCaption: responsiveRem({ l: 0.7, xxl: 1.35 }),

  contactCopy: `calc(${sidebarText} * 0.8)`,

  smallTextLineHeight: em(1.4),
  textLineHeight: em(1.3333),
  popUpLineHeight: em(1.25)
}

