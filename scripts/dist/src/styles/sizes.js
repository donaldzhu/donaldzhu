"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sketchSizes = exports.domSizes = void 0;
var size_1 = __importDefault(require("../utils/helpers/size"));
var sizeUtils_1 = require("../utils/sizeUtils");
var fonts_1 = require("./fonts");
var vectorXHeight = 44;
var homeIconBaseSize = [43, vectorXHeight];
var homeIconInnerPadding = (0, sizeUtils_1.getSize)({ l: 30, xxl: 40 });
var homeIconScales = { l: 0.75, xxl: 1.15 };
var homeIconSizes = homeIconBaseSize.map(function (baseSize) {
    return (0, sizeUtils_1.getSize)(homeIconScales).mult(baseSize).add(homeIconInnerPadding);
});
var homeIconPaddingVert = (0, sizeUtils_1.getSize)({ l: 8.125, xxl: 24, xxlSm: 19.5 });
var sidebarWidth = (0, sizeUtils_1.getSize)({ l: 375, xxl: 700 });
var sidebarPaddingLeft = (0, sizeUtils_1.getSize)({ l: 20, xxl: 40 });
var sidebarPaddingRight = (0, sizeUtils_1.getSize)({ l: 30, xxl: 60 });
var sidebarPaddingVert = (0, sizeUtils_1.getSize)({ l: 17.5, xxl: 32 });
var sidebarBorderGap = (0, sizeUtils_1.getSize)({ l: 20, xxl: 35 });
var workSidebarPaddingRight = (0, sizeUtils_1.getSize)({ l: 10, xxl: 20 });
var footerPaddingTop = (0, sizeUtils_1.getSize)({ l: 20, xxl: 42.4, xxlSm: 33.5 });
var headerHeight = homeIconPaddingVert.mult(2).add(homeIconSizes[1]).sub(sidebarBorderGap);
var footerHeight = footerPaddingTop.mult(2).add(fonts_1.fontSizes.footer.link).sub(sidebarBorderGap);
exports.domSizes = {
    app: {
        width: size_1.default.subFromFullWidth(sidebarPaddingLeft)
    },
    text: {
        innerMargin: (0, sizeUtils_1.getSize)({ l: 16, xxl: 30 })
    },
    sidebar: {
        width: sidebarWidth,
        padding: {
            left: sidebarPaddingLeft,
            right: sidebarPaddingRight,
            vert: sidebarPaddingVert
        },
        border: (0, sizeUtils_1.getSize)({ l: 2, xxl: 4 }),
        borderHeights: {
            header: headerHeight,
            main: size_1.default.subFromFullHeight(headerHeight)
                .sub(footerHeight)
                .sub(sidebarBorderGap.mult(4)),
            footer: footerHeight,
        }
    },
    footer: {
        link: {
            padding: (0, sizeUtils_1.getSize)({ l: 4.5, xxl: 8 })
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
            left: (0, sizeUtils_1.getSize)({ l: 30, xxl: 40 })
        }
    },
    mainContainer: {
        margin: (0, sizeUtils_1.getSize)({ l: 25, xxl: 50 })
    },
    autoPlay: {
        width: (0, sizeUtils_1.getSize)({ l: 330, xxl: 560 }),
        border: (0, sizeUtils_1.getSize)({ l: 1, xxl: 2 }),
        borderRadius: (0, sizeUtils_1.getSize)({ l: 9, xxl: 13 })
    },
    workIndex: {
        thumbnail: {
            gap: (0, sizeUtils_1.getSize)({ l: 8, xxl: 20 })
        },
        innerMargin: (0, sizeUtils_1.getSize)({ l: 6.5, xxl: 12.75, xxlSm: 10.75 })
    },
    workPage: {
        media: {
            gap: (0, sizeUtils_1.getSize)({ l: 15, xxl: 22 })
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
            border: (0, sizeUtils_1.getSize)({ l: 2, xxl: 4 }),
            borderRadius: (0, sizeUtils_1.getSize)({ l: 6, xxl: 9 })
        }
    },
    media: {
        borderRadius: (0, sizeUtils_1.getSize)({ l: 3, xxl: 4 }),
        zoomPercentage: 0.95
    },
    toolTip: {
        border: (0, sizeUtils_1.getSize)({ l: 3, xxl: 4 }),
        bottom: fonts_1.fontSizes.footer.link.add(footerPaddingTop.mult(2)).add(sidebarPaddingVert),
        left: sidebarPaddingLeft
    },
    contact: {
        qr: {
            top: (0, sizeUtils_1.getSize)({ l: 20, xxl: 55, xxlSm: 46.5 }),
            size: (0, sizeUtils_1.getSize)({ l: 120, xxl: 200 })
        }
    }
};
exports.sketchSizes = {
    vector: {
        xHeight: vectorXHeight
    },
    main: {
        centerPadding: (0, sizeUtils_1.getSize)({ l: 50, xxl: 130 }),
        anchor: {
            size: (0, sizeUtils_1.getSize)({ l: 37.5, xxl: 50 }),
            offset: (0, sizeUtils_1.getSize)({ l: 55, xxl: 70 })
        },
        scale: (0, sizeUtils_1.getSize)({ l: 1.5, xxl: 2.75 }),
        weight: {
            lower: (0, sizeUtils_1.getSize)({ l: 6, xxl: 10 }),
            glyph: (0, sizeUtils_1.getSize)({ l: 4, xxl: 8 }),
            link: (0, sizeUtils_1.getSize)({ l: 3, xxl: 5 })
        },
        pointSize: (0, sizeUtils_1.getSize)({ l: 8, xxl: 18 }),
        tracking: (0, sizeUtils_1.getSize)({ l: 4, xxl: 4 }),
        leading: (0, sizeUtils_1.getSize)({ l: 67.5, xxl: 67.5 })
    },
    mobile: {
        top: (0, sizeUtils_1.getSize)({ s: 56, l: 120 }),
        centerPadding: (0, sizeUtils_1.getSize)({ s: 35, l: 70 }),
        scale: (0, sizeUtils_1.getSize)({ s: 1.15, l: 2.75 }),
        weight: {
            lower: (0, sizeUtils_1.getSize)({ s: 5, l: 12 }),
            glyph: (0, sizeUtils_1.getSize)({ s: 3, l: 8 }),
            link: (0, sizeUtils_1.getSize)({ s: 1.5, l: 4.5 })
        },
        pointSize: (0, sizeUtils_1.getSize)({ s: 7.75, l: 19.5 }),
        leading: (0, sizeUtils_1.getSize)({ s: 32, l: 72 }),
        tracking: {
            workIn: new size_1.default(2.75),
            process: new size_1.default(0.75),
            lower: new size_1.default(1.75)
        },
        spaceWidth: new size_1.default(10),
        physics: {
            gravity: (0, sizeUtils_1.getSize)({ s: 5.5, l: 12.5 })
        }
    },
    cursor: (0, sizeUtils_1.getSize)({ l: 40, xxl: 65 }),
    line: {
        weight: (0, sizeUtils_1.getSize)({ l: 2, xxl: 4 }),
        dash: (0, sizeUtils_1.getSize)({ l: 5, xxl: 8 })
    },
    homeIcon: {
        height: (0, sizeUtils_1.getSize)(homeIconScales).mult(homeIconBaseSize[1]).add(homeIconInnerPadding),
        weight: (0, sizeUtils_1.getSize)({ l: 4, xxl: 6 }),
        scale: (0, sizeUtils_1.getSize)(homeIconScales),
    },
    workIndex: {
        listPadding: (0, sizeUtils_1.getSize)({ l: 6, xxl: 8 }),
        thumbnailPadding: (0, sizeUtils_1.getSize)({ l: 10, xxl: 15 })
    },
    string: {
        weight: {
            glyph: (0, sizeUtils_1.getSize)({ l: 2, xxl: 3 }),
            link: (0, sizeUtils_1.getSize)({ l: 2, xxl: 3 }),
        },
        pointSize: (0, sizeUtils_1.getSize)({ l: 7, xxl: 10 }),
    },
    panto: {
        hoverPadding: (0, sizeUtils_1.getSize)({ l: 15, xxl: 20 }),
        pointSize: (0, sizeUtils_1.getSize)({ l: 12, xxl: 36 }),
        lineWeight: (0, sizeUtils_1.getSize)({ l: 6, xxl: 14 }),
        brush: {
            primary: {
                max: (0, sizeUtils_1.getSize)({ l: 4, xxl: 7 }),
                min: (0, sizeUtils_1.getSize)({ l: 3, xxl: 5 })
            },
            secondary: {
                max: (0, sizeUtils_1.getSize)({ l: 10, xxl: 28 }),
                min: (0, sizeUtils_1.getSize)({ l: 4, xxl: 8 }),
                radius: (0, sizeUtils_1.getSize)({ l: 4, xxl: 8 })
            }
        }
    },
    toolTip: {
        padding: (0, sizeUtils_1.getSize)({ l: 2, xxl: 3 })
    },
    contactQr: {
        toolTipPadding: (0, sizeUtils_1.getSize)({ l: 2, xxl: 3 }),
        popUpPadding: (0, sizeUtils_1.getSize)({ l: 8, xxl: 12.5 }),
    }
};
