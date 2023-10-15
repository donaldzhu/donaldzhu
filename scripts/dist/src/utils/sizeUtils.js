"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemSize = exports.getSize = exports.toPercent = exports.getNativeResolution = exports.getRem = exports.getVh = exports.getVw = exports.rem = exports.em = exports.percent = exports.vh = exports.vw = exports.px = void 0;
var breakptSizer_1 = require("./helpers/breakptSizer");
var createSuffixFunction = function (suffix) {
    return function (quantity) { return "".concat(quantity).concat(suffix); };
};
exports.px = createSuffixFunction("px");
exports.vw = createSuffixFunction("vw");
exports.vh = createSuffixFunction("vh");
exports.percent = createSuffixFunction("%");
exports.em = createSuffixFunction("em");
exports.rem = createSuffixFunction("rem");
var getVw = function (percentage) {
    if (percentage === void 0) { percentage = 100; }
    return window.innerWidth / 100 * percentage;
};
exports.getVw = getVw;
var getVh = function (percentage) {
    if (percentage === void 0) { percentage = 100; }
    return window.innerHeight / 100 * percentage;
};
exports.getVh = getVh;
var getRem = function (multiplier) {
    if (multiplier === void 0) { multiplier = 1; }
    return parseFloat(getComputedStyle(document.documentElement).fontSize) * multiplier;
};
exports.getRem = getRem;
var getNativeResolution = function () { return [
    window.screen.width * window.devicePixelRatio,
    window.screen.height * window.devicePixelRatio,
]; };
exports.getNativeResolution = getNativeResolution;
var toPercent = function (decimal) { return (0, exports.percent)(decimal * 100); };
exports.toPercent = toPercent;
var getSize = function (breakptSizes) {
    return new breakptSizer_1.BreakptSizer(breakptSizes).getSize(false);
};
exports.getSize = getSize;
var getRemSize = function (breakptSizes) {
    return new breakptSizer_1.BreakptSizer(breakptSizes).getSize(true);
};
exports.getRemSize = getRemSize;
