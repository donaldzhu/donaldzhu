"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SETTING = exports.GLYPH_NAMES = exports.X_HEIGHT = exports.Axes = void 0;
var easing = __importStar(require("easing-utils"));
var spacings_json_1 = __importDefault(require("../../../data/vector/spacings.json"));
var commonUtils_1 = require("../../../utils/commonUtils");
var size_1 = __importDefault(require("../../../utils/helpers/size"));
var sizeUtils_1 = require("../../../utils/sizeUtils");
var Axes;
(function (Axes) {
    Axes["x"] = "x";
    Axes["y"] = "y";
})(Axes || (exports.Axes = Axes = {}));
exports.X_HEIGHT = 44;
exports.GLYPH_NAMES = (0, commonUtils_1.typedKeys)(spacings_json_1.default).filter(function (char) { return char.length === 1; });
exports.DEFAULT_SETTING = {
    x: 0,
    y: 0,
    scale: new size_1.default(1),
    position: [1, 1],
    align: 1,
    spaceDelimiter: ' ',
    spaceWidth: 25,
    tracking: 3,
    leading: 85,
    drawingSequence: [],
    maxStretch: 4,
    glyphWeight: new size_1.default(1),
    glyphColor: 0,
    linkWeight: new size_1.default(1),
    linkColor: 0,
    pointWeight: new size_1.default(1),
    pointSize: new size_1.default(5),
    pointFill: 0,
    pointColor: 0,
    volumeWeight: new size_1.default(1),
    volumeColor: 0,
    correctVolumeStroke: false,
    easing: "linear",
    squareMap: true,
    getRanges: function () {
        return {
            x: [0, (0, sizeUtils_1.getVw)()],
            y: [0, this.squareMap ? (0, sizeUtils_1.getVw)() : (0, sizeUtils_1.getVh)()],
        };
    },
    mapFunction: function (stillVector, mouseVector) {
        var _this = this;
        var results = { x: 0, y: 0 };
        var distVector = mouseVector.sub(('mouseOrigin' in this && this.mouseOrigin) ?
            this.mouseOrigin : stillVector);
        (0, commonUtils_1.loopObject)(Axes, function (axis) {
            var dist = distVector[axis];
            var _a = _this.getRanges()[axis], min = _a[0], max = _a[1];
            var eased = easing[_this.easing](Math.abs(dist) / (max - min));
            results[axis] = stillVector[axis] +
                (0, commonUtils_1.map)(eased, 0, 1, 0, _this.maxStretch * _this.scale.value) * Math.sign(dist);
        });
        return results;
    }
};
