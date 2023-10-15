"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeIconScales = void 0;
var colors_1 = __importDefault(require("../../styles/colors"));
var sizeUtils_1 = require("../../utils/sizeUtils");
var constants_1 = require("../helpers/vector/constants");
var vectorTypes_1 = require("../helpers/vector/vectorTypes");
var mainSketchConfigs = {
    scale: (0, sizeUtils_1.getSize)({ l: 1.15, xxl: 2.5 }),
    tracking: 4,
    leading: 70,
    easing: "easeOutQuad",
    maxStretch: 18.5,
    glyphColor: colors_1.default.homeSketch,
    linkColor: colors_1.default.homeSketch,
};
var lowerWeight = (0, sizeUtils_1.getSize)({ l: 6, xxl: 10 });
exports.homeIconScales = { l: 0.75, xxl: 1.15 };
var homeIconWeight = (0, sizeUtils_1.getSize)({ l: 4, xxl: 6 });
var configs = {
    MAIN_UPPER: __assign(__assign({}, mainSketchConfigs), { glyphWeight: (0, sizeUtils_1.getSize)({ l: 4, xxl: 7 }), linkWeight: (0, sizeUtils_1.getSize)({ l: 3, xxl: 5 }), pointSize: (0, sizeUtils_1.getSize)({ l: 8, xxl: 16 }), pointColor: colors_1.default.homeSketch, pointFill: colors_1.default.homeSketch, drawingSequence: [vectorTypes_1.VectorDrawMethod.DrawLinks, vectorTypes_1.VectorDrawMethod.DrawPoints] }),
    MAIN_LOWER: __assign(__assign({}, mainSketchConfigs), { glyphWeight: lowerWeight, linkWeight: lowerWeight, volumeColor: colors_1.default.homeSketch, drawingSequence: [vectorTypes_1.VectorDrawMethod.DrawLinks, vectorTypes_1.VectorDrawMethod.DrawVolume] }),
    HOME_ICON: {
        scale: (0, sizeUtils_1.getSize)(exports.homeIconScales),
        position: [0, 0],
        glyphWeight: homeIconWeight,
        linkWeight: homeIconWeight,
        glyphColor: colors_1.default.homeIcon,
        linkColor: colors_1.default.homeIcon,
        volumeColor: colors_1.default.homeIcon,
        easing: "easeOutCubic",
        drawingSequence: [vectorTypes_1.VectorDrawMethod.DrawLinks, vectorTypes_1.VectorDrawMethod.DrawVolume],
        maxStretch: 8,
    },
    VECTOR_STRING_TRANSLATE: {
        glyphWeight: (0, sizeUtils_1.getSize)({ l: 2, xxl: 3 }),
        linkWeight: (0, sizeUtils_1.getSize)({ l: 2, xxl: 3 }),
        pointSize: (0, sizeUtils_1.getSize)({ l: 7, xxl: 10 }),
        pointColor: colors_1.default.vectorStringSketch,
        pointFill: colors_1.default.vectorStringSketch,
        glyphColor: colors_1.default.vectorStringSketch,
        linkColor: colors_1.default.vectorStringSketch,
        drawingSequence: [vectorTypes_1.VectorDrawMethod.DrawLinks, vectorTypes_1.VectorDrawMethod.DrawPoints],
        mapFunction: function (stillVector, mouseVector) {
            var _a, _b;
            var distVector = mouseVector.sub((_a = this.mouseOrigin) !== null && _a !== void 0 ? _a : stillVector);
            var segmentation = 20;
            var segmentSize = Math.PI * 2 / segmentation;
            var segmentedHeading = Math.floor(distVector.heading() / segmentSize) * segmentSize;
            distVector
                .setHeading(segmentedHeading)
                .setMag((_b = this.maxStretch) !== null && _b !== void 0 ? _b : constants_1.DEFAULT_SETTING.maxStretch)
                .add(stillVector);
            return distVector;
        }
    }
};
exports.default = configs;
