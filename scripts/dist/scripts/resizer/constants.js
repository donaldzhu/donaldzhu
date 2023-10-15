"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOL_TIP_PERCENTAGE = exports.MAIN_RESIZE_PERCENTAGE = exports.DEFAULT_CONFIG = exports.BREAKPT_WIDTHS = exports.BLUR = exports.MAX_FOLDER = exports.NATIVE_DIMENSIONS_PATH = exports.SIZE_PATH = exports.POSTER_SUBFOLDER = exports.SRC_WORK_PATH = exports.WORK_FOLDER = exports.SRC_THUMBNAIL_PATH = exports.THUMBNAIL_FOLDER = exports.SRC_PATH = exports.DESTINATION_ROOT = exports.ROOT_PATH = void 0;
var breakpoints_1 = __importDefault(require("../../src/data/breakpoints"));
var utils_1 = require("../utils");
exports.ROOT_PATH = '';
exports.DESTINATION_ROOT = 'public/assets';
exports.SRC_PATH = (0, utils_1.joinPaths)(exports.ROOT_PATH, 'asset-original');
exports.THUMBNAIL_FOLDER = 'thumbnails';
exports.SRC_THUMBNAIL_PATH = (0, utils_1.joinPaths)(exports.SRC_PATH, exports.THUMBNAIL_FOLDER);
exports.WORK_FOLDER = 'work';
exports.SRC_WORK_PATH = (0, utils_1.joinPaths)(exports.SRC_PATH, exports.WORK_FOLDER);
exports.POSTER_SUBFOLDER = 'posters';
exports.SIZE_PATH = 'scripts/resizer/sizes';
exports.NATIVE_DIMENSIONS_PATH = 'src/data/media/nativeDimensions.json';
exports.MAX_FOLDER = 'max';
exports.BLUR = 4;
exports.BREAKPT_WIDTHS = (_a = {},
    _a["desktopFallback"] = 600,
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
exports.MAIN_RESIZE_PERCENTAGE = 0.7;
exports.TOOL_TIP_PERCENTAGE = 0.5;
