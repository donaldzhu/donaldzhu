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
    semiBold: 575,
};
exports.fontLineHeights = {
    text: (0, sizeUtils_1.em)(1.3333),
    smallText: (0, sizeUtils_1.em)(1.4),
    popUp: (0, sizeUtils_1.em)(1.25)
};
var sansToMonoratio = 1.03;
var monoFontSize = (0, sizeUtils_1.getRemSize)({ l: 1.3, xxl: 2.875 });
var workIndexMonoFontSize = (0, sizeUtils_1.getRemSize)({ l: 0.85, xxl: 1.7 });
exports.fontSizes = {
    desktop: {
        title: (0, sizeUtils_1.getRemSize)({ l: 1.6, xxl: 2.3 }),
        text: {
            mono: monoFontSize,
            sans: monoFontSize.mult(sansToMonoratio)
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
            copy: monoFontSize.mult(0.8)
        }
    },
    mobile: {
        home: {
            button: (0, sizeUtils_1.getRemSize)({ s: 1.075, l: 1.075 })
        }
    }
};
