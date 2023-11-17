import { em, getRemSize } from '../utils/sizeUtils'

export const fontFamilies = {
  monoFont: '"Recursive", "Helvetica Neue", sans-serif;',
  sansFont: '"Manifont Grotesk", "Helvetica Neue", sans-serif;',
}

export const fontParams = {
  monoVariable: 0.525,
  semiLight: 375,
  demiBold: 450,
  semiBold: 575,
}

export const fontLineHeights = {
  text: em(1.3333),
  smallText: em(1.4),
  popUp: em(1.25)
}

const sansToMonoratio = 1.03
const monoFontSizeDesktop = getRemSize({ l: 1.3, xxl: 2.875 })
// const monoFontSizeMobile = getRemSize({ s: 1.3, l: 1.8 })
const monoFontSizeMobile = getRemSize({ s: 1.55, l: 1.55 })
const workIndexMonoFontSize = getRemSize({ l: 0.85, xxl: 1.7 })
const navMonoFontSizeMobile = getRemSize({ s: 1.15, l: 1.125 })

export const fontSizes = {
  desktop: {
    title: getRemSize({ l: 1.6, xxl: 2.3 }),
    text: {
      mono: monoFontSizeDesktop,
      sans: monoFontSizeDesktop.mult(sansToMonoratio)
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
      copy: monoFontSizeDesktop.mult(0.8)
    }
  },
  mobile: {
    text: {
      mono: monoFontSizeMobile,
      sans: monoFontSizeMobile.mult(sansToMonoratio)
    },
    smallText: getRemSize({ s: 1.05, l: 1.05 }),
    nav: {
      mono: navMonoFontSizeMobile,
      sans: navMonoFontSizeMobile.mult(sansToMonoratio)
    },
    main: {
      button: getRemSize({ s: 1.075, l: 2.5 })
    },
    workIndex: {
      title: getRemSize({ s: 0.9, l: 0.9 }), // TODO
      tags: getRemSize({ s: 0.85, l: 0.85 })
    }
  }
}