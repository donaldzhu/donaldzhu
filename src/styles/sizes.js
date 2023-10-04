import { em, responsiveValue, vwWithVhCss, responsiveSize } from '../utils/styleUtils'
import { fontSizes } from './fonts'

const sidebarPaddingLeft = responsiveSize({ l: 20, xxl: 40 })
const sidebarWidth = responsiveSize({ l: 375, xxl: 700 })
const sidebarPaddingRight = responsiveSize({ l: 30, xxl: 60 })
const workSidebarRightMargin = responsiveSize({ l: 10, xxl: 20 })

const leftContainerVhValue = 2.25

const homeIconPaddingSizes = { l: 30, xxl: 40 }
const footerPaddingTop = vwWithVhCss(0.6, leftContainerVhValue)
const sidebarPaddingVertical = responsiveSize({ l: 17.5, xxl: 32 })

const sizes = {
  appWidth: `calc(100vw - ${sidebarPaddingLeft})`,
  textInnerMargin: responsiveSize({ l: 16, xxl: 30 }),

  homeIconPadding: responsiveSize(homeIconPaddingSizes),
  homeIconPaddingTop: vwWithVhCss(0.6, leftContainerVhValue / 2, -0.3),

  sidebarWidth,
  sidebarPaddingLeft,
  sidebarPaddingRight,
  sidebarPaddingVertical,

  footerPaddingTop,
  footerLinkPadding: em(0.5),

  mainContainerMargin: responsiveSize({ l: 25, xxl: 50 }),
  autoPlayWidth: responsiveSize({ l: 330, xxl: 560 }),
  autoPlayBorder: responsiveSize({ l: 1, xxl: 2 }),
  autoPlayBorderRadius: responsiveSize({ l: 9, xxl: 13 }),

  workIndexInnerMargin: 'calc(0.25em + 0.5vh)',
  workThumbnailGap: responsiveSize({ l: 8, xxl: 20 }),

  workDescriptionMaxWidth: `calc(${sidebarWidth} - ${sidebarPaddingRight} - ${workSidebarRightMargin})`,
  workPageGridGap: responsiveSize({ l: 15, xxl: 22 }),
  imgZoomPercentage: 0.95,
  mediaBorderRadius: responsiveSize({ l: 3, xxl: 4 }),
  toolTipBorder: responsiveSize({ l: 3, xxl: 4 }),
  popUpPositions: {
    bottom: `calc(
      ${fontSizes.footerLink} +
      ${footerPaddingTop} * 2 +
      ${sidebarPaddingVertical} 
    )`,
    left: sidebarPaddingLeft
  },

  contactQrTop: vwWithVhCss(1.5, 2, -0.5),

  pageStrokeButtonBorder: responsiveSize({ l: 2, xxl: 4 }),
  pageStrokeButtonBorderRadius: responsiveSize({ l: 6, xxl: 9 }),

  mainSketchCenterPadding: () => responsiveValue({ l: 50, xxl: 150 }),
  mainSketchAnchorSize: () => responsiveValue({ l: 37.5, xxl: 50 }),
  mainSketchAnchorOffset: () => responsiveValue({ l: 55, xxl: 70 }),
  vertBorderGap: () => responsiveValue({ l: 20, xxl: 35 }),
  workIndexRectPadding: () => responsiveValue({ l: 6, xxl: 8 }),
  workThumbnailRectPadding: () => responsiveValue({ l: 10, xxl: 15 }),
  contactShowQrRetPadding: () => responsiveValue({ l: 2, xxl: 3 }),
  contactQrRetPadding: () => responsiveValue({ l: 8, xxl: 12.5 }),
  toolTipPadding: () => responsiveValue({ l: 2, xxl: 3 }),
  pantoHoverPadding: () => responsiveValue({ l: 15, xxl: 20 }),
  pantoPointSize: () => responsiveValue({ l: 12, xxl: 36 }),
  pantoLineWeight: () => responsiveValue({ l: 6, xxl: 14 }),
  homeIconPaddingValue: () => responsiveValue(homeIconPaddingSizes),
}

export default sizes