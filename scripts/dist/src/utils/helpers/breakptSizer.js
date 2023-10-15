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
exports.BreakptSizer = void 0;
var lodash_1 = __importDefault(require("lodash"));
var breakpoints_1 = __importDefault(require("../../data/breakpoints"));
var commonUtils_1 = require("../commonUtils");
var queryUtil_1 = require("../queryUtil");
var sizeUtils_1 = require("../sizeUtils");
var size_1 = __importDefault(require("./size"));
var lHeight = 620;
var xxlHeight = 1200;
var xxlSmHeight = 800;
var BreakptSizer = (function () {
    function BreakptSizer(breakptSizes) {
        var _a;
        this.breakptSizes = !(queryUtil_1.Breakpt.xxl in breakptSizes) ? breakptSizes : __assign(__assign({}, breakptSizes), { xxlSm: (_a = breakptSizes.xxlSm) !== null && _a !== void 0 ? _a : breakptSizes.xxl });
        var _b = (0, commonUtils_1.sortLike)((0, commonUtils_1.typedKeys)(lodash_1.default.omit(this.breakptSizes, 'xxlSm')), (0, commonUtils_1.typedKeys)(queryUtil_1.Breakpt)), lowerBreakpt = _b[0], upperBreakpt = _b[1];
        this.lowerBreakpt = lowerBreakpt;
        this.upperBreakpt = upperBreakpt;
    }
    BreakptSizer.prototype.getSlope = function (lowerSize, upperSize) {
        var upperSizeWidthComponent = upperSize - this.vh * xxlHeight;
        var lowerSizeWidthComponent = lowerSize - this.vh * lHeight;
        var vw = (upperSizeWidthComponent - lowerSizeWidthComponent) /
            (this.upperBreakptWidth - this.lowerBreakptWidth);
        var px = upperSizeWidthComponent - (vw * this.upperBreakptWidth);
        return { vw: lodash_1.default.round(vw * 100, 3), rem: lodash_1.default.round(px / (0, sizeUtils_1.getRem)(), 3) };
    };
    BreakptSizer.prototype.getSize = function (useRem) {
        var remFactor = useRem ? (0, sizeUtils_1.getRem)() : 1;
        var lowerSize = this.lowerSize * remFactor;
        var upperSize = this.upperSize * remFactor;
        var _a = this.getSlope(lowerSize, upperSize), vw = _a.vw, rem = _a.rem;
        return new size_1.default({ vw: vw, vh: this.vh * 100, rem: lodash_1.default.round(rem, 3) });
    };
    Object.defineProperty(BreakptSizer.prototype, "lowerSize", {
        get: function () {
            var size = this.breakptSizes[this.lowerBreakpt];
            if (!size)
                throw new Error("Breaktpoint (".concat(this.lowerBreakpt, "px) does not exist in setting."));
            return size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BreakptSizer.prototype, "upperSize", {
        get: function () {
            var size = this.breakptSizes[this.upperBreakpt];
            if (!size)
                throw new Error("Breaktpoint (".concat(this.upperBreakpt, "px) does not exist in setting."));
            return size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BreakptSizer.prototype, "lowerBreakptWidth", {
        get: function () {
            return breakpoints_1.default[this.lowerBreakpt];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BreakptSizer.prototype, "upperBreakptWidth", {
        get: function () {
            return breakpoints_1.default[this.upperBreakpt];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BreakptSizer.prototype, "vh", {
        get: function () {
            return queryUtil_1.Breakpt.xxl in this.breakptSizes && this.breakptSizes.xxl && this.breakptSizes.xxlSm ?
                (this.breakptSizes.xxl - this.breakptSizes.xxlSm) / (xxlHeight - xxlSmHeight) : 0;
        },
        enumerable: false,
        configurable: true
    });
    return BreakptSizer;
}());
exports.BreakptSizer = BreakptSizer;
