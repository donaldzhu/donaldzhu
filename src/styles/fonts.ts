import { em, getRemSize } from '../utils/sizeUtils'

export const fontFamilies = {
  monoFont: '"Recursive", "Helvetica Neue", sans-serif;',
  sansFont: '"Manifont Grotesk", "Helvetica Neue", sans-serif;',
}

export const fontParams = {
  monoVariable: 0.525,
  semiLight: 375,
  semiBold: 575,
}

export const fontLineHeights = {
  text: em(1.3333),
  smallText: em(1.4),
  popUp: em(1.25)
}

const sansToMonoratio = 1.03
const monoFontSize = getRemSize({ l: 1.3, xxl: 2.875 })
const workIndexMonoFontSize = getRemSize({ l: 0.85, xxl: 1.7 })
export const fontSizes = {
  title: getRemSize({ l: 1.6, xxl: 2.3 }),
  text: {
    mono: monoFontSize,
    sans: monoFontSize.mult(sansToMonoratio)
  },
  footer: {
    link: getRemSize({ l: 1.15, xxl: 2 })
  },
  smallText: getRemSize({ l: 1, xxl: 1.8 }),
  autoPlay: {
    message: getRemSize({ l: 1.5, xxl: 2.75 }),
    instrucution: getRemSize({ l: 0.8, xxl: 1.35 })
  },
  workIndex: {
    mono: workIndexMonoFontSize,
    sans: workIndexMonoFontSize.mult(sansToMonoratio),
  },
  workPage: {
    details: getRemSize({ l: 0.7, xxl: 1.25 })
  },
  toolTip: {
    icon: getRemSize({ l: 1.5, xxl: 2.5 }),
    popUp: getRemSize({ l: 1, xxl: 1.75 })
  },
  workPageStroke: {
    caption: getRemSize({ l: 0.7, xxl: 1.35 })
  },
  contact: {
    copy: monoFontSize.mult(0.8)
  }
}