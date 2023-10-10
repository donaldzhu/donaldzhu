import { homeIconSizes } from '../p5/configs/vector'
import { getRem, getVh, getVw } from '../utils/commonUtils'
import { em, responsiveValue, vwWithVhCss, responsiveCssSize } from '../utils/styleUtils'
import { fontSizes } from './fonts'

const sidebarWidthSizes = { l: 375, xxl: 700 }
const borderWeightSizes = { l: 3, xxl: 6 }

const sidebarPaddingLeft = responsiveCssSize({ l: 20, xxl: 40 })
const sidebarWidth = responsiveCssSize(sidebarWidthSizes)
const sidebarPaddingRight = responsiveCssSize({ l: 30, xxl: 60 })
const workSidebarRightMargin = responsiveCssSize({ l: 10, xxl: 20 })

const leftContainerVhValue = 2.25

const homeIconBaseSize = [43, 44]
const homeIconPaddingSizes = { l: 30, xxl: 40 }
const homeIconPadding = responsiveCssSize(homeIconPaddingSizes)
// TODO
const homeIconPaddingTopSizes = { vw: 0.6, vh: leftContainerVhValue / 2, rem: -0.3 }
const homeIconPaddingTopValue = () => getVw(0.6) + getVh(leftContainerVhValue / 2) + getRem(-0.3)
const footerPaddingTop = vwWithVhCss(0.6, leftContainerVhValue)
const sidebarPaddingVertical = responsiveCssSize({ l: 17.5, xxl: 32 })

const sizes = {
  appWidth: `calc(100vw - ${sidebarPaddingLeft})`,
  textInnerMargin: responsiveCssSize({ l: 16, xxl: 30 }),

  homeIconBaseSize: [43, 44],
  homeIconPadding,
  homeIconPaddingTopValue,
  homeIconPaddingTop: vwWithVhCss(0.6, leftContainerVhValue / 2, -0.3),
  homeIconWidth: `calc(${homeIconBaseSize[0]} * ${responsiveCssSize(homeIconSizes)} + ${homeIconPadding})`,
  homeIconHeight: `calc(${homeIconBaseSize[1]} * ${responsiveCssSize(homeIconSizes)} + ${homeIconPadding})`,
  homeIconHeightValue: () => homeIconBaseSize[1] * responsiveValue(homeIconBaseSize) + responsiveValue(homeIconPaddingSizes),

  sidebarWidthValue: responsiveValue(sidebarWidthSizes),
  sidebarWidth,
  sidebarPaddingLeft,
  sidebarPaddingRight,
  sidebarPaddingVertical,

  footerPaddingTop,
  footerLinkPadding: em(0.25),

  mainContainerMargin: responsiveCssSize({ l: 25, xxl: 50 }),
  autoPlayWidth: responsiveCssSize({ l: 330, xxl: 560 }),
  autoPlayBorder: responsiveCssSize({ l: 1, xxl: 2 }),
  autoPlayBorderRadius: responsiveCssSize({ l: 9, xxl: 13 }),

  workIndexInnerMargin: 'calc(0.25em + 0.5vh)',
  workThumbnailGap: responsiveCssSize({ l: 8, xxl: 20 }),

  workDescriptionMaxWidth: `calc(${sidebarWidth} - ${sidebarPaddingRight} - ${workSidebarRightMargin})`,
  workPageGridGap: responsiveCssSize({ l: 15, xxl: 22 }),
  imgZoomPercentage: 0.95,
  mediaBorderRadius: responsiveCssSize({ l: 3, xxl: 4 }),
  toolTipBorder: responsiveCssSize({ l: 3, xxl: 4 }),
  popUpPositions: {
    bottom: `calc(
      ${fontSizes.footerLink} +
      ${footerPaddingTop} * 2 +
      ${sidebarPaddingVertical} 
    )`,
    left: sidebarPaddingLeft
  },

  contactQrTop: vwWithVhCss(1.5, 2, -0.5),

  pageStrokeButtonBorder: responsiveCssSize({ l: 2, xxl: 4 }),
  pageStrokeButtonBorderRadius: responsiveCssSize({ l: 6, xxl: 9 }),

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

  borderWeightValue: () => responsiveValue(borderWeightSizes),
  borderWeight: responsiveCssSize(borderWeightSizes),
}

export default sizes