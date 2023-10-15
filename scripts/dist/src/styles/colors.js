"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonUtils_1 = require("../utils/commonUtils");
var COLOR_PRESET = 0;
var red = '#ED1C24';
var blue = '#155FB3';
var black = 'black';
var white = 'white';
var swatches = [
    [red, blue, white, black]
];
var colorPalette = {
    background: 2,
    defaultText: 1,
    defaultTextSelectColor: 2,
    defaultTextSelectBg: 1,
    popUpColor: 0,
    autoPlayPopUpBg: 2,
    homeSketch: 0,
    homeIcon: 1,
    border: 0,
    footer: 1,
    activeElem: 0,
    dashLine: 0,
    toolTipColor: 0,
    toolTipBg: 2,
    workIndex: 1,
    mediaPlayButton: 0,
    strokePrimary: 1,
    strokeSecondary: 0,
    strokePanto: 3,
    strokeCaption: 0,
    strokeClear: 1,
    vectorStringSketch: 3
};
var colors = (0, commonUtils_1.mapObject)(colorPalette, function (_, colorIndex) { return swatches[COLOR_PRESET][colorIndex]; });
exports.default = colors;
