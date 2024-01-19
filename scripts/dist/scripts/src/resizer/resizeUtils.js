"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOdd = exports.roundEven = exports.replaceExt = exports.getPaths = exports.getResizeCallback = exports.getNoSizesError = void 0;
var path_1 = __importDefault(require("path"));
var utils_1 = require("../utils");
var constants_1 = require("./constants");
var getNoSizesError = function (sizes, sizeType) {
    return new Error("Breakpoint size has no ".concat(sizeType, " sizes: ").concat(sizes[sizeType]));
};
exports.getNoSizesError = getNoSizesError;
var getResizeCallback = function (array, rootPath) {
    return function (fileName, size) { return array.push([
        fileName.replace(new RegExp("^".concat(rootPath, "/")), ''),
        [size.width, size.height]
    ]); };
};
exports.getResizeCallback = getResizeCallback;
var getPaths = function (device) {
    var SRC_ROOT = 'public/assets-original';
    var DESTINATION_ROOT = 'public/assets';
    var SIZE_ROOT = 'scripts/src/resizer/sizes';
    var NATIVE_DIMENSIONS_ROOT = 'src/data/media/nativeDimensions';
    var SRC_PATH = (0, utils_1.joinPaths)(SRC_ROOT, device);
    var DESTINATION_PATH = (0, utils_1.joinPaths)(DESTINATION_ROOT, device);
    return {
        SRC_THUMBNAIL_PATH: (0, utils_1.joinPaths)(SRC_PATH, constants_1.THUMBNAIL_FOLDER),
        SRC_WORK_PATH: (0, utils_1.joinPaths)(SRC_PATH, constants_1.WORK_FOLDER),
        DESTINATION_THUMBNAIL_PATH: (0, utils_1.joinPaths)(DESTINATION_PATH, constants_1.THUMBNAIL_FOLDER),
        DESTINATION_WORK_PATH: (0, utils_1.joinPaths)(DESTINATION_PATH, constants_1.WORK_FOLDER),
        SIZE_PATH: (0, utils_1.joinPaths)(SIZE_ROOT, device),
        NATIVE_DIMENSIONS_PATH: (0, utils_1.joinPaths)(NATIVE_DIMENSIONS_ROOT, "".concat(device, ".json"))
    };
};
exports.getPaths = getPaths;
var replaceExt = function (fileName, newExt) {
    var ext = path_1.default.extname(fileName);
    var regex = new RegExp("".concat(ext, "$"));
    return fileName.replace(regex, '.' + newExt);
};
exports.replaceExt = replaceExt;
var roundEven = function (number) { return 2 * Math.round(number / 2); };
exports.roundEven = roundEven;
var isOdd = function (number) { return !!(number % 2); };
exports.isOdd = isOdd;
