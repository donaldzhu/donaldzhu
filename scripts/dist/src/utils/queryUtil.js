"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreloadBreakpt = exports.getIsMobile = exports.getBreakptKey = exports.mobileQuery = exports.desktopQuery = exports.maxQueries = exports.minQueries = exports.Device = exports.Breakpt = void 0;
var breakpoints_1 = __importDefault(require("../data/breakpoints"));
var commonUtils_1 = require("./commonUtils");
var Breakpt;
(function (Breakpt) {
    Breakpt["s"] = "s";
    Breakpt["m"] = "m";
    Breakpt["l"] = "l";
    Breakpt["xl"] = "xl";
    Breakpt["xxl"] = "xxl";
})(Breakpt || (exports.Breakpt = Breakpt = {}));
var Device;
(function (Device) {
    Device["mobile"] = "mobile";
    Device["desktop"] = "desktop";
})(Device || (exports.Device = Device = {}));
var createQueries = function (sizePrefix) {
    return (0, commonUtils_1.mapObject)(breakpoints_1.default, function (_, breakpt) {
        return "only screen and (".concat(sizePrefix, "-width: ").concat(breakpt + (sizePrefix === 'min' ? 1 : 0), "px)");
    });
};
exports.minQueries = createQueries('min');
exports.maxQueries = createQueries('max');
exports.desktopQuery = exports.minQueries.l;
exports.mobileQuery = exports.maxQueries.l;
var getBreakptKey = function () {
    if (window.screen.width >= breakpoints_1.default.xxl)
        return Breakpt.xxl;
    if (window.screen.width < breakpoints_1.default.s)
        return Breakpt.s;
    var breakptPairs = (0, commonUtils_1.toPairs)(breakpoints_1.default)
        .sort(function (a, b) { return a[1] - b[1]; });
    var breakptPair = breakptPairs
        .find(function (_a) {
        var _ = _a[0], breakptWidth = _a[1];
        return breakptWidth >= window.screen.width;
    });
    if (!breakptPair)
        return breakptPairs[0][0];
    return breakptPair[0];
};
exports.getBreakptKey = getBreakptKey;
var getIsMobile = function () { return window.screen.width <= breakpoints_1.default.l; };
exports.getIsMobile = getIsMobile;
var getPreloadBreakpt = function () {
    var breakpt = (0, exports.getBreakptKey)();
    return breakpt === Breakpt.m || breakpt === Breakpt.s ?
        Breakpt.l : breakpt;
};
exports.getPreloadBreakpt = getPreloadBreakpt;
