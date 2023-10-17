"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreloadBreakpt = exports.getBreakptKey = exports.queries = exports.Breakpt = void 0;
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
exports.queries = (0, commonUtils_1.mapObject)(breakpoints_1.default, function (_, breakpt) {
    return "only screen and (min-width: ".concat(breakpt + 1, "px)");
});
var getBreakptKey = function () {
    if (window.screen.width >= breakpoints_1.default.xxl)
        return Breakpt.xxl;
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
var getPreloadBreakpt = function () {
    var breakpt = (0, exports.getBreakptKey)();
    return breakpt === Breakpt.m || breakpt === Breakpt.s ?
        Breakpt.l : breakpt;
};
exports.getPreloadBreakpt = getPreloadBreakpt;
