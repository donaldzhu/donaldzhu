"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = exports.BREAKPT_WIDTHS = exports.Device = exports.MOBILE_MAX_SIZE = exports.DESKTOP_MAX_SIZE = exports.BLUR = exports.MAX_FOLDER = exports.WORK_FOLDER = exports.THUMBNAIL_FOLDER = void 0;
var breakpoints_1 = __importDefault(require("../../../src/data/breakpoints"));
exports.THUMBNAIL_FOLDER = 'thumbnails';
exports.WORK_FOLDER = 'work';
exports.MAX_FOLDER = 'max';
exports.BLUR = 4;
exports.DESKTOP_MAX_SIZE = 2500 * 3000;
exports.MOBILE_MAX_SIZE = 1500 * 2000;
var Device;
(function (Device) {
    Device["Mobile"] = "mobile";
    Device["Desktop"] = "desktop";
})(Device || (exports.Device = Device = {}));
exports.BREAKPT_WIDTHS = (_a = {},
    _a["desktopFallback"] = 600,
    _a["mobileFallback"] = 250,
    _a["s"] = breakpoints_1.default.s,
    _a["m"] = breakpoints_1.default.m,
    _a["l"] = breakpoints_1.default.l,
    _a["xl"] = breakpoints_1.default.xl,
    _a["xxl"] = breakpoints_1.default.xxl,
    _a);
exports.DEFAULT_CONFIG = {
    resizeThumbnails: true,
    resizeWork: true,
    includePages: [],
    includeBreakpts: []
};
