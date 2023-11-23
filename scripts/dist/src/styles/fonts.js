"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontSizes = exports.fontLineHeights = exports.fontParams = exports.fontFamilies = void 0;
var sizeUtils_1 = require("../utils/sizeUtils");
exports.fontFamilies = {
    monoFont: '"Recursive", "Helvetica Neue", sans-serif;',
    sansFont: '"Manifont Grotesk", "Helvetica Neue", sans-serif;',
};
exports.fontParams = {
    monoVariable: 0.525,
    semiLight: 375,
    demiBold: 450,
    semiBold: 575,
    bold: 625,
};
exports.fontLineHeights = {
    text: (0, sizeUtils_1.em)(1.3333),
    smallText: (0, sizeUtils_1.em)(1.4),
    popUp: (0, sizeUtils_1.em)(1.25)
};
var sansToMonoratio = 1.03;
var monoFontSizeDesktop = (0, sizeUtils_1.getRemSize)({ l: 1.3, xxl: 2.875 });
var monoFontSizeMobile = (0, sizeUtils_1.getRemSize)({ s: 1.75, l: 4.5 });
var workIndexMonoFontSize = (0, sizeUtils_1.getRemSize)({ l: 0.85, xxl: 1.7 });
var navMonoFontSizeMobile = (0, sizeUtils_1.getRemSize)({ s: 1.15, l: 2.5 });
exports.fontSizes = {
    desktop: {
        title: (0, sizeUtils_1.getRemSize)({ l: 1.6, xxl: 2.3 }),
        text: {
            mono: monoFontSizeDesktop,
            sans: monoFontSizeDesktop.mult(sansToMonoratio)
        },
        footer: {
            link: (0, sizeUtils_1.getRemSize)({ l: 1.15, xxl: 2 })
        },
        smallText: (0, sizeUtils_1.getRemSize)({ l: 1, xxl: 1.8 }),
        autoPlay: {
            message: (0, sizeUtils_1.getRemSize)({ l: 1.5, xxl: 2.75 }),
            instrucution: (0, sizeUtils_1.getRemSize)({ l: 0.8, xxl: 1.35 })
        },
        workIndex: {
            mono: workIndexMonoFontSize,
            sans: workIndexMonoFontSize.mult(sansToMonoratio),
        },
        workPage: {
            details: (0, sizeUtils_1.getRemSize)({ l: 0.7, xxl: 1.25 })
        },
        toolTip: {
            icon: (0, sizeUtils_1.getRemSize)({ l: 1.5, xxl: 2.5 }),
            popUp: (0, sizeUtils_1.getRemSize)({ l: 1, xxl: 1.75 })
        },
        workPageStroke: {
            caption: (0, sizeUtils_1.getRemSize)({ l: 0.7, xxl: 1.35 })
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
        smallText: (0, sizeUtils_1.getRemSize)({ s: 1.05, l: 2.55 }),
        nav: {
            mono: navMonoFontSizeMobile,
            sans: navMonoFontSizeMobile.mult(sansToMonoratio)
        },
        menu: {
            item: (0, sizeUtils_1.getRemSize)({ s: 2.3, l: 4.5 })
        },
        main: {
            button: (0, sizeUtils_1.getRemSize)({ s: 1.075, l: 2.5 })
        },
        workIndex: {
            title: (0, sizeUtils_1.getRemSize)({ s: 0.9, l: 2.125 }),
            tags: (0, sizeUtils_1.getRemSize)({ s: 0.85, l: 1.6 })
        },
        home: {
            blocker: (0, sizeUtils_1.getRemSize)({ s: 1.25, l: 2.25 })
        },
        workPage: {
            title: (0, sizeUtils_1.getRemSize)({ s: 1.45, l: 3 }),
            details: (0, sizeUtils_1.getRemSize)({ s: 0.85, l: 1.75 })
        }
    }
};
