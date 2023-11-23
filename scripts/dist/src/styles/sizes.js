"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sketchSizes = exports.domSizes = void 0;
var constants_1 = require("../p5/helpers/vector/constants");
var size_1 = __importDefault(require("../utils/helpers/size"));
var sizeUtils_1 = require("../utils/sizeUtils");
var fonts_1 = require("./fonts");
var homeIconBaseSize = [43, constants_1.X_HEIGHT];
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
var appWidth = size_1.default.subFromFullWidth(sidebarPaddingLeft);
var workSidebarPaddingRight = (0, sizeUtils_1.getSize)({ l: 10, xxl: 20 });
var footerPaddingTop = (0, sizeUtils_1.getSize)({ l: 20, xxl: 42.4, xxlSm: 33.5 });
var headerHeight = homeIconPaddingVert.mult(2)
    .add(homeIconSizes[1]).sub(sidebarBorderGap);
var footerHeight = footerPaddingTop.mult(2)
    .add(fonts_1.fontSizes.desktop.footer.link).sub(sidebarBorderGap);
var mobileMainMargin = (0, sizeUtils_1.getSize)({ s: 16, l: 32 });
var mobileSketchScale = (0, sizeUtils_1.getSize)({ s: 1.15, l: 2.8 });
var mobileSketchTop = (0, sizeUtils_1.getSize)({ s: 25, l: 100 });
var mobileSketchCenterPadding = (0, sizeUtils_1.getSize)({ s: 35, l: 105 });
var mobileSketchLeading = (0, sizeUtils_1.getSize)({ s: 32, l: 80 });
var mobileSketchLowerWeight = (0, sizeUtils_1.getSize)({ s: 5, l: 12.5 });
var mobileNavLinkPadding = fonts_1.fontSizes.mobile.nav.mono;
var mobileNavLinkHeight = fonts_1.fontSizes.mobile.nav.mono;
var mobileNavHeight = mobileNavLinkPadding.mult(2)
    .add(mobileNavLinkHeight);
var mobileNavMarginBottom = (0, sizeUtils_1.getSize)({ s: 12, l: 24 });
var mobileGyroPaddingTop = (0, sizeUtils_1.getSize)({ s: 56, l: 120 });
var mobileGyroMarginBottom = (0, sizeUtils_1.getSize)({ s: 28, l: 28 });
var mobileGyroTop = mobileSketchTop
    .add(mobileGyroPaddingTop)
    .add(mobileSketchScale.mult(constants_1.X_HEIGHT * 4))
    .add(mobileSketchLeading.mult(2))
    .add(mobileSketchCenterPadding)
    .add(mobileSketchLowerWeight)
    .add(mobileNavHeight)
    .sub((0, sizeUtils_1.getSize)({ s: 4, l: 4 }));
var mobileGyroBorder = (0, sizeUtils_1.getSize)({ s: 1.5, l: 3.5 });
var mobileGyroPadding = fonts_1.fontSizes.mobile.main.button.mult(0.5);
var mobileGyroHeight = fonts_1.fontSizes.mobile.main.button.mult(1.2);
var mobileGyroBoxHeight = mobileGyroBorder.mult(2)
    .add(mobileGyroPadding.mult(2))
    .add(mobileGyroHeight);
exports.domSizes = {
    desktop: {
        app: {
            width: appWidth
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
            left: sidebarWidth.add(sidebarPaddingLeft),
            width: appWidth.sub(sidebarWidth),
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
            bottom: fonts_1.fontSizes.desktop.footer.link.add(footerPaddingTop.mult(2)).add(sidebarPaddingVert),
            left: sidebarPaddingLeft
        },
        contact: {
            qr: {
                top: (0, sizeUtils_1.getSize)({ l: 20, xxl: 55, xxlSm: 46.5 }),
                size: (0, sizeUtils_1.getSize)({ l: 120, xxl: 200 })
            }
        }
    },
    mobile: {
        app: {
            top: mobileNavHeight.add(mobileNavMarginBottom),
            margin: mobileMainMargin,
            padding: {
                top: (0, sizeUtils_1.getSize)({ s: 8, l: 40 }),
                bottom: (0, sizeUtils_1.getSize)({ s: 28, l: 56 }),
            },
            width: new size_1.default({ vw: 100 }).sub(mobileMainMargin.mult(2))
        },
        header: {
            height: mobileNavHeight,
            link: {
                padding: mobileNavLinkPadding,
                height: mobileNavLinkHeight
            }
        },
        main: {
            button: {
                top: mobileGyroTop,
                height: mobileGyroHeight,
                padding: {
                    vert: mobileGyroPadding
                },
                margin: {
                    bottom: (0, sizeUtils_1.getSize)({ s: 28, l: 40 })
                },
                border: mobileGyroBorder,
                borderRadius: (0, sizeUtils_1.getSize)({ s: 6, l: 12 })
            },
            toolTip: {
                top: mobileGyroBoxHeight
            },
        },
        home: {
            blocker: {
                border: (0, sizeUtils_1.getSize)({ s: 2.5, l: 3.5 }),
                top: mobileGyroTop
                    .add(mobileGyroBoxHeight)
                    .add(mobileGyroMarginBottom)
            }
        },
        contact: {
            linkList: {
                padding: {
                    top: (0, sizeUtils_1.getSize)({ s: 12, l: 36 })
                }
            }
        },
        menu: {
            innerMargin: (0, sizeUtils_1.getSize)({ s: 28, l: 56 })
        },
        workIndex: {
            thumbnail: {
                margin: (0, sizeUtils_1.getSize)({ s: 24, l: 42 }),
                width: (0, sizeUtils_1.getSize)({ s: 210, l: 500 })
            },
            tags: {
                padding: {
                    top: (0, sizeUtils_1.getSize)({ s: 3.25, l: 5.5 })
                }
            },
            gap: (0, sizeUtils_1.getSize)({ s: 20, l: 50 })
        },
        workPage: {
            title: {
                margin: (0, sizeUtils_1.getSize)({ s: 12, l: 28 })
            },
            media: {
                gap: mobileMainMargin.div(2)
            },
            details: {
                margin: (0, sizeUtils_1.getSize)({ s: 16, l: 36 })
            }
        }
    },
};
exports.sketchSizes = {
    desktop: {
        vector: {
            xHeight: constants_1.X_HEIGHT
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
            leading: (0, sizeUtils_1.getSize)({ l: 67.5, xxl: 67.5 }),
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
        },
    },
    mobile: {
        main: {
            top: mobileSketchTop,
            centerPadding: mobileSketchCenterPadding,
            scale: mobileSketchScale,
            weight: {
                lower: mobileSketchLowerWeight,
                glyph: (0, sizeUtils_1.getSize)({ s: 3, l: 9 }),
                link: (0, sizeUtils_1.getSize)({ s: 1.5, l: 4.5 })
            },
            pointSize: (0, sizeUtils_1.getSize)({ s: 7.75, l: 20 }),
            leading: mobileSketchLeading,
            tracking: {
                workIn: new size_1.default(2.75),
                process: new size_1.default(0.75),
                lower: new size_1.default(1.75)
            },
            spaceWidth: new size_1.default(10),
            physics: {
                gravity: (0, sizeUtils_1.getSize)({ s: 5.75, l: 12.5 })
            }
        },
        line: {
            weight: (0, sizeUtils_1.getSize)({ s: 2, l: 4.5 }),
            dash: (0, sizeUtils_1.getSize)({ s: 5, l: 10 })
        },
        string: {
            weight: {
                glyph: (0, sizeUtils_1.getSize)({ s: 2, l: 4.5 }),
                link: (0, sizeUtils_1.getSize)({ s: 1.5, l: 4 }),
            },
            pointSize: (0, sizeUtils_1.getSize)({ s: 6, l: 15 }),
        },
        struct: {
            padding: (0, sizeUtils_1.getSize)({ s: 1.5, l: 2.5 })
        }
    }
};
