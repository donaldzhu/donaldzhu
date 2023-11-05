import { X_HEIGHT } from '../p5/helpers/vector/constants'
import Size from '../utils/helpers/size'
import { getSize } from '../utils/sizeUtils'
import { fontSizes } from './fonts'

const homeIconBaseSize = [43, X_HEIGHT]
const homeIconInnerPadding = getSize({ l: 30, xxl: 40 })
const homeIconScales = { l: 0.75, xxl: 1.15 }
const homeIconSizes = homeIconBaseSize.map(baseSize =>
  getSize(homeIconScales).mult(baseSize).add(homeIconInnerPadding))
const homeIconPaddingVert = getSize({ l: 8.125, xxl: 24, xxlSm: 19.5 })

const sidebarWidth = getSize({ l: 375, xxl: 700 })
const sidebarPaddingLeft = getSize({ l: 20, xxl: 40 })
const sidebarPaddingRight = getSize({ l: 30, xxl: 60 })
const sidebarPaddingVert = getSize({ l: 17.5, xxl: 32 })
const sidebarBorderGap = getSize({ l: 20, xxl: 35 })

const workSidebarPaddingRight = getSize({ l: 10, xxl: 20 })
const footerPaddingTop = getSize({ l: 20, xxl: 42.4, xxlSm: 33.5 })

const headerHeight = homeIconPaddingVert.mult(2)
  .add(homeIconSizes[1]).sub(sidebarBorderGap)
const footerHeight = footerPaddingTop.mult(2)
  .add(fontSizes.desktop.footer.link).sub(sidebarBorderGap)

const mobileSketchScale = getSize({ s: 1.15, l: 2.75 })
const mobileSketchTop = getSize({ s: 56, l: 120 })
const mobileSketchCenterPadding = getSize({ s: 35, l: 84 })
const mobileSketchLeading = getSize({ s: 32, l: 80 })
const mobileSketchLowerWeight = getSize({ s: 5, l: 12 })

export const domSizes = {
  desktop: {
    app: {
      width: Size.subFromFullWidth(sidebarPaddingLeft)
    },
    text: {
      innerMargin: getSize({ l: 16, xxl: 30 })
    },
    sidebar: {
      width: sidebarWidth,
      padding: {
        left: sidebarPaddingLeft,
        right: sidebarPaddingRight,
        vert: sidebarPaddingVert
      },
      border: getSize({ l: 2, xxl: 4 }),
      borderHeights: {
        header: headerHeight,
        main: Size.subFromFullHeight(headerHeight)
          .sub(footerHeight)
          .sub(sidebarBorderGap.mult(4)),
        footer: footerHeight,
      }
    },
    footer: {
      link: {
        padding: getSize({ l: 4.5, xxl: 8 })
      },
      padding: {
        top: footerPaddingTop
      }
    },
    homeIcon: {
      width: homeIconSizes[0],
      height: homeIconSizes[1],
      padding: {
        vert: homeIconPaddingVert,
        left: getSize({ l: 30, xxl: 40 })
      }
    },
    mainContainer: {
      margin: getSize({ l: 25, xxl: 50 })
    },

    autoPlay: {
      width: getSize({ l: 330, xxl: 560 }),
      border: getSize({ l: 1, xxl: 2 }),
      borderRadius: getSize({ l: 9, xxl: 13 })
    },
    workIndex: {
      thumbnail: {
        gap: getSize({ l: 8, xxl: 20 })
      },
      innerMargin: getSize({ l: 6.5, xxl: 12.75, xxlSm: 10.75 })
    },
    workPage: {
      media: {
        gap: getSize({ l: 15, xxl: 22 })
      },
      sidebar: {
        description: {
          maxWidth: sidebarWidth.sub(sidebarPaddingRight).sub(workSidebarPaddingRight),
        },
        margin: {
          right: workSidebarPaddingRight
        }
      }
    },
    workPageStroke: {
      button: {
        border: getSize({ l: 2, xxl: 4 }),
        borderRadius: getSize({ l: 6, xxl: 9 })
      }
    },
    media: {
      borderRadius: getSize({ l: 3, xxl: 4 }),
      zoomPercentage: 0.95
    },
    toolTip: {
      border: getSize({ l: 3, xxl: 4 }),
      bottom: fontSizes.desktop.footer.link.add(
        footerPaddingTop.mult(2)).add(sidebarPaddingVert),
      left: sidebarPaddingLeft
    },
    contact: {
      qr: {
        top: getSize({ l: 20, xxl: 55, xxlSm: 46.5 }),
        size: getSize({ l: 120, xxl: 200 })
      }
    }
  },
  mobile: {
    home: {
      button: {
        top: mobileSketchTop.mult(2)
          .add(mobileSketchScale.mult(X_HEIGHT * 4))
          .add(mobileSketchLeading.mult(2))
          .add(mobileSketchCenterPadding)
          .add(mobileSketchLowerWeight)
          .sub(getSize({ s: 4, l: -1 })),
        border: getSize({ s: 1.5, l: 3.5 }),
        borderRadius: getSize({ s: 6, l: 12 })
      }
    },
  },
}

export const sketchSizes = {
  desktop: {
    vector: {
      xHeight: X_HEIGHT
    },
    main: {
      centerPadding: getSize({ l: 50, xxl: 130 }),
      anchor: {
        size: getSize({ l: 37.5, xxl: 50 }),
        offset: getSize({ l: 55, xxl: 70 })
      },
      scale: getSize({ l: 1.5, xxl: 2.75 }),
      weight: {
        lower: getSize({ l: 6, xxl: 10 }),
        glyph: getSize({ l: 4, xxl: 8 }),
        link: getSize({ l: 3, xxl: 5 })
      },
      pointSize: getSize({ l: 8, xxl: 18 }),
      tracking: getSize({ l: 4, xxl: 4 }),
      leading: getSize({ l: 67.5, xxl: 67.5 }),
    },
    cursor: getSize({ l: 40, xxl: 65 }),
    line: {
      weight: getSize({ l: 2, xxl: 4 }),
      dash: getSize({ l: 5, xxl: 8 })
    },
    homeIcon: {
      height: getSize(homeIconScales).mult(homeIconBaseSize[1]).add(homeIconInnerPadding),
      weight: getSize({ l: 4, xxl: 6 }),
      scale: getSize(homeIconScales),
    },
    workIndex: {
      listPadding: getSize({ l: 6, xxl: 8 }),
      thumbnailPadding: getSize({ l: 10, xxl: 15 })
    },
    string: {
      weight: {
        glyph: getSize({ l: 2, xxl: 3 }),
        link: getSize({ l: 2, xxl: 3 }),
      },
      pointSize: getSize({ l: 7, xxl: 10 }),
    },
    panto: {
      hoverPadding: getSize({ l: 15, xxl: 20 }),
      pointSize: getSize({ l: 12, xxl: 36 }),
      lineWeight: getSize({ l: 6, xxl: 14 }),
      brush: {
        primary: {
          max: getSize({ l: 4, xxl: 7 }),
          min: getSize({ l: 3, xxl: 5 })
        },
        secondary: {
          max: getSize({ l: 10, xxl: 28 }),
          min: getSize({ l: 4, xxl: 8 }),
          radius: getSize({ l: 4, xxl: 8 })
        }
      }
    },
    toolTip: {
      padding: getSize({ l: 2, xxl: 3 })
    },
    contactQr: {
      toolTipPadding: getSize({ l: 2, xxl: 3 }),
      popUpPadding: getSize({ l: 8, xxl: 12.5 }),
    },
  },
  mobile: {
    main: {
      top: mobileSketchTop,
      centerPadding: mobileSketchCenterPadding,
      scale: mobileSketchScale,
      weight: {
        lower: mobileSketchLowerWeight,
        glyph: getSize({ s: 3, l: 8 }),
        link: getSize({ s: 1.5, l: 4.5 })
      },
      pointSize: getSize({ s: 7.75, l: 19.5 }),
      leading: mobileSketchLeading,
      tracking: {
        workIn: new Size(2.75),
        process: new Size(0.75),
        lower: new Size(1.75)
      },
      spaceWidth: new Size(10),
      physics: {
        gravity: getSize({ s: 5.75, l: 12.5 })
      }
    },
  }
}