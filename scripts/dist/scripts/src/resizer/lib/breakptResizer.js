"use strict";
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
var path_1 = __importDefault(require("path"));
var lodash_1 = __importDefault(require("lodash"));
var glob_1 = require("glob");
var resizerTypes_1 = require("./resizerTypes");
var utils_1 = require("../../utils");
var constants_1 = require("./constants");
var BreakpointResizer = (function () {
    function BreakpointResizer(source, config, _a) {
        var _this = this;
        var destination = _a.destination, mediaOptions = _a.mediaOptions, removeFilesAtDest = _a.removeFilesAtDest, exportPoster = _a.exportPoster, exportTypes = _a.exportTypes;
        this.source = source;
        this.config = config;
        this.destination = (0, utils_1.joinPaths)(destination, this.config.breakpt);
        this.breakptTypes = lodash_1.default.uniq(config.sizes
            .map(function (size) { return size[0]; })
            .map(function (fileEntry) {
            var fileNames = (0, glob_1.globSync)(_this.joinDestPath(fileEntry), { nodir: true });
            return fileNames.map(utils_1.parseMediaType);
        })
            .flat());
        this.mediaOptions = mediaOptions;
        this.removeFilesAtDest = removeFilesAtDest;
        this.exportPoster = exportPoster;
        this.exportTypes = exportTypes;
        this.debugOnly = config.debugOnly;
    }
    BreakpointResizer.prototype.init = function () {
        if (this.debugOnly)
            return;
        this.createDestDir();
        this.createDestPosterDir();
    };
    BreakpointResizer.prototype.resizeImg = function (imgObj, _a) {
        var metadata = _a.metadata, fileName = _a.fileName, fileEntry = _a.fileEntry, isPoster = _a.isPoster;
        return __awaiter(this, void 0, void 0, function () {
            var width, resizeWidth, imgObjClone, outFile, fileType;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        width = metadata.width;
                        resizeWidth = this.getResizeWidth(fileEntry, metadata);
                        if (!resizeWidth ||
                            !(isPoster ?
                                this.shouldExportPoster :
                                this.shouldExport("image")))
                            return [2];
                        imgObjClone = imgObj.clone();
                        if (width > resizeWidth)
                            imgObjClone.resize({ width: resizeWidth });
                        if (this.config.blur)
                            imgObjClone.blur(this.config.blur);
                        if (isPoster)
                            fileName = this.getPosterPath(fileName);
                        outFile = this.joinDestPath(fileName);
                        this.prepareDest(outFile);
                        fileType = (0, utils_1.getExtension)(fileName);
                        if (fileType === resizerTypes_1.ImgExtension.Gif)
                            imgObjClone.gif(this.mediaOptions.gif);
                        else if (fileType === resizerTypes_1.ImgExtension.Webp)
                            imgObjClone.webp(this.mediaOptions.webp);
                        return [4, imgObjClone.toFile(outFile)];
                    case 1: return [2, _b.sent()];
                }
            });
        });
    };
    BreakpointResizer.prototype.resizeVideo = function (vidObj, _a) {
        var metadata = _a.metadata, fileName = _a.fileName, fileEntry = _a.fileEntry;
        return __awaiter(this, void 0, void 0, function () {
            var width, resizeWidth, outFile;
            return __generator(this, function (_b) {
                width = metadata.width;
                resizeWidth = this.getResizeWidth(fileEntry, metadata);
                if (!resizeWidth ||
                    !this.shouldExport("video"))
                    return [2];
                if (width > resizeWidth)
                    vidObj.size("".concat(resizeWidth, "x?"));
                outFile = this.joinDestPath(fileName);
                this.prepareDest(outFile);
                vidObj.output(outFile);
                return [2];
            });
        });
    };
    BreakpointResizer.prototype.joinDestPath = function () {
        var subpaths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subpaths[_i] = arguments[_i];
        }
        return utils_1.joinPaths.apply(void 0, __spreadArray([this.destination], subpaths, false));
    };
    BreakpointResizer.prototype.createDestDir = function () {
        var subpaths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subpaths[_i] = arguments[_i];
        }
        (0, utils_1.mkdir)(this.joinDestPath.apply(this, subpaths), !this.exportTypes.length &&
            this.removeFilesAtDest);
    };
    BreakpointResizer.prototype.createDestPosterDir = function () {
        if (this.shouldExportPoster && this.hasVid)
            this.createDestDir(constants_1.POSTER_SUBFOLDER);
    };
    BreakpointResizer.prototype.prepareDest = function (fileName) {
        (0, utils_1.removeFile)(fileName);
        (0, utils_1.mkdirIfNone)(path_1.default.dirname(fileName));
    };
    BreakpointResizer.prototype.getSizePercentage = function (fileName) {
        var size = this.config.sizes.find(function (size) { return size[0] === fileName; });
        return size ? size[1] : undefined;
    };
    BreakpointResizer.prototype.getResizeWidth = function (fileName, size) {
        var _a = this.config, breakptWidth = _a.breakptWidth, maxDimension = _a.maxDimension, noResize = _a.noResize;
        var width = size.width, height = size.height;
        var maxWidth = maxDimension ? Math.round(Math.sqrt(maxDimension * width / height)) : width;
        if (noResize || !breakptWidth)
            return Math.min(width, maxWidth);
        var sizePercentage = this.getSizePercentage(fileName);
        if (!sizePercentage)
            return;
        var resizedWidth = Math.round(sizePercentage * breakptWidth);
        return Math.min(resizedWidth, maxWidth);
    };
    BreakpointResizer.prototype.getPosterPath = function (fileName) {
        var regex = new RegExp("(".concat(resizerTypes_1.vidExtensionRegex, ")$"));
        return (0, utils_1.joinPaths)(constants_1.POSTER_SUBFOLDER, fileName.replace(regex, resizerTypes_1.ImgExtension.Webp));
    };
    BreakpointResizer.prototype._shouldExportType = function (type) {
        return !this.debugOnly && (this.exportTypes.length === 0 ||
            this.exportTypes.includes(type));
    };
    BreakpointResizer.prototype.shouldExport = function (type) {
        var _a;
        return this._shouldExportType(type) &&
            !((_a = this.config.exclude) === null || _a === void 0 ? void 0 : _a.includes(type));
    };
    Object.defineProperty(BreakpointResizer.prototype, "shouldExportPoster", {
        get: function () {
            return this.exportPoster &&
                this._shouldExportType("poster");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BreakpointResizer.prototype, "hasVid", {
        get: function () {
            return this.breakptTypes.includes("video");
        },
        enumerable: false,
        configurable: true
    });
    return BreakpointResizer;
}());
exports.default = BreakpointResizer;
