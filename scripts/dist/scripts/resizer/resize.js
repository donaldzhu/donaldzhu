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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var lodash_1 = __importDefault(require("lodash"));
var resizer_1 = __importDefault(require("./lib/resizer"));
var utils_1 = require("../utils");
var constants_1 = require("./constants");
var createBreakptMap = function (mapObj, callback) {
    var _a;
    var map = (_a = {},
        _a["desktopFallback"] = undefined,
        _a["l"] = undefined,
        _a["xl"] = undefined,
        _a["xxl"] = undefined,
        _a);
    (0, utils_1.mapObject)(mapObj, function (breakpt, mapValue) {
        map[breakpt] = callback(breakpt, mapValue);
    });
    return map;
};
var getNoSizesError = function (sizes, sizeType) {
    return new Error("Breakpoint size has no ".concat(sizeType, " sizes: ").concat(sizes[sizeType]));
};
var getBreakptConfig = function (breakpt, sizes, debugOnly) {
    sizes.map(function (size) { return size[1] *= size[0].match(/^toolTips\//) ?
        constants_1.TOOL_TIP_PERCENTAGE : constants_1.MAIN_RESIZE_PERCENTAGE; });
    return {
        breakpt: breakpt,
        breakptWidth: constants_1.BREAKPT_WIDTHS[breakpt],
        sizes: sizes,
        blur: breakpt === "desktopFallback" ? constants_1.BLUR : undefined,
        exclude: breakpt === "desktopFallback" ? ["video"] : undefined,
        debugOnly: debugOnly
    };
};
var getResizeCallback = function (array, rootPath) {
    return function (fileName, size) { return array
        .push([
        fileName.replace(new RegExp("^".concat(rootPath, "/")), ''),
        [size.width, size.height]
    ]); };
};
var workFolder = constants_1.SRC_WORK_PATH;
var destination = (0, utils_1.joinPaths)(constants_1.ROOT_PATH, constants_1.DESTINATION_ROOT);
var resize = function (config) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, resizeThumbnails, resizeWork, includePages, includeBreakpts, breakptWidths, allBreakptSizes, pageSizes, nativeDimensions, thumbnailConfigs, thumbnails, work;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = __assign(__assign({}, constants_1.DEFAULT_CONFIG), config), resizeThumbnails = _a.resizeThumbnails, resizeWork = _a.resizeWork, includePages = _a.includePages, includeBreakpts = _a.includeBreakpts;
                breakptWidths = includeBreakpts.length ? lodash_1.default.pick(constants_1.BREAKPT_WIDTHS, includeBreakpts) : constants_1.BREAKPT_WIDTHS;
                allBreakptSizes = createBreakptMap(breakptWidths, function (breakpt) {
                    return (0, utils_1.readJsonSync)((0, utils_1.joinPaths)(constants_1.SIZE_PATH, "".concat(breakpt, ".json")));
                });
                pageSizes = {};
                (0, utils_1.mapObject)(allBreakptSizes, function (breakpt, allSizes) {
                    var work = allSizes.work;
                    if (!work || Array.isArray(work))
                        throw getNoSizesError(allSizes, 'work');
                    (0, utils_1.mapObject)(work, function (pageId, sizes) {
                        return (pageSizes[pageId] || (pageSizes[pageId] = {}))[breakpt] = sizes;
                    });
                });
                nativeDimensions = {};
                thumbnailConfigs = createBreakptMap(allBreakptSizes, function (breakpt, sizes) {
                    var thumbnails = sizes.thumbnails;
                    if (!thumbnails || !Array.isArray(thumbnails))
                        throw getNoSizesError(sizes, 'thumbnails');
                    return getBreakptConfig(breakpt, [thumbnails[0]], !resizeThumbnails);
                });
                thumbnails = [];
                return [4, new resizer_1.default(constants_1.SRC_THUMBNAIL_PATH, Object.values(thumbnailConfigs), {
                        destination: (0, utils_1.joinPaths)(destination, constants_1.THUMBNAIL_FOLDER),
                        callback: getResizeCallback(thumbnails, constants_1.SRC_THUMBNAIL_PATH)
                    }).init()];
            case 1:
                _b.sent();
                nativeDimensions.thumbnails = thumbnails;
                work = {};
                return [4, (0, utils_1.mapObjectPromises)(pageSizes, function (pageId, breakptSizes) { return __awaiter(void 0, void 0, void 0, function () {
                        var includePage, debugOnly, pageConfigs, maxConfig, workPage;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    includePage = !includePages.length || includePages.includes(pageId);
                                    debugOnly = !resizeWork || !includePage;
                                    pageConfigs = createBreakptMap(breakptSizes, function (breakpt, sizes) { return getBreakptConfig(breakpt, sizes, debugOnly); });
                                    maxConfig = {
                                        breakpt: constants_1.MAX_FOLDER,
                                        sizes: pageConfigs.xxl.sizes,
                                        noResize: true,
                                        maxDimension: 2500 * 3000,
                                        exclude: ["poster"],
                                        debugOnly: debugOnly
                                    };
                                    workPage = [];
                                    return [4, new resizer_1.default((0, utils_1.joinPaths)(workFolder, pageId), __spreadArray(__spreadArray([], Object.values(pageConfigs), true), [maxConfig], false), {
                                            destination: (0, utils_1.joinPaths)(destination, constants_1.WORK_FOLDER, pageId),
                                            callback: getResizeCallback(workPage, (0, utils_1.joinPaths)(constants_1.SRC_WORK_PATH, pageId))
                                        }).init()];
                                case 1:
                                    _a.sent();
                                    work[pageId] = workPage;
                                    return [2];
                            }
                        });
                    }); })];
            case 2:
                _b.sent();
                nativeDimensions.work = work;
                fs_1.default.writeFileSync(constants_1.NATIVE_DIMENSIONS_PATH, JSON.stringify(nativeDimensions));
                return [2];
        }
    });
}); };
exports.default = resize;
