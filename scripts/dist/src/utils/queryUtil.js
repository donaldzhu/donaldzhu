"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBreakptKey = exports.queries = exports.Breakpt = void 0;
var breakpoints_1 = __importDefault(require("../data/breakpoints"));
var commonUtils_1 = require("./commonUtils");
var sizeUtils_1 = require("./sizeUtils");
var Breakpt;
(function (Breakpt) {
    Breakpt["s"] = "s";
    Breakpt["m"] = "m";
    Breakpt["l"] = "l";
    Breakpt["xl"] = "xl";
    Breakpt["xxl"] = "xxl";
})(Breakpt || (exports.Breakpt = Breakpt = {}));
exports.queries = (0, commonUtils_1.mapObject)(breakpoints_1.default, function (_, breakpt) {
    return "only screen and (min-width: ".concat(breakpt, "px)");
});
var getBreakptKey = function () {
    var width = (0, sizeUtils_1.getNativeResolution)()[0];
    var breakptPairs = (0, commonUtils_1.toPairs)(breakpoints_1.default)
        .sort(function (a, b) { return a[1] - b[1]; });
    var breakptPair = breakptPairs
        .find(function (_a) {
        var _ = _a[0], breakptWidth = _a[1];
        return breakptWidth >= width;
    });
    if (!breakptPair)
        return breakptPairs[0][0];
    return breakptPair[0];
};
exports.getBreakptKey = getBreakptKey;
