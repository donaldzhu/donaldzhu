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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var lodash_1 = __importDefault(require("lodash"));
var sharp_1 = __importDefault(require("sharp"));
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var glob_1 = require("glob");
var chalk_1 = __importDefault(require("chalk"));
var breakptResizer_1 = __importDefault(require("./breakptResizer"));
var resizerTypes_1 = require("./resizerTypes");
var utils_1 = require("../../utils");
var constants_1 = require("./constants");
var Resizer = (function () {
    function Resizer(source, breakptConfigs, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, destination = _b.destination, _c = _b.mediaOptions, mediaOptions = _c === void 0 ? {} : _c, _d = _b.toParentFolder, toParentFolder = _d === void 0 ? true : _d, _e = _b.removeFilesAtDest, removeFilesAtDest = _e === void 0 ? true : _e, _f = _b.exportPoster, exportPoster = _f === void 0 ? true : _f, _g = _b.callback, callback = _g === void 0 ? lodash_1.default.noop : _g;
        this.source = source;
        this.breakptConfigs = breakptConfigs;
        var parentFolder = path_1.default.dirname(source);
        this.destination = destination || (toParentFolder ? parentFolder : source);
        this.breakptResizers = breakptConfigs.map(function (config) { return new breakptResizer_1.default(source, config, {
            destination: _this.destination,
            mediaOptions: mediaOptions,
            removeFilesAtDest: removeFilesAtDest,
            exportPoster: exportPoster
        }); });
        this.allFileEntries = lodash_1.default.union.apply(lodash_1.default, this.breakptConfigs.map(function (config) {
            return config.sizes.map(function (size) { return size[0]; });
        }));
        this.mediaOptions = mediaOptions;
        this.removeFilesAtDest = removeFilesAtDest;
        this.exportPoster = exportPoster;
        this.callback = callback;
    }
    Resizer.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mapAllEntries;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.createPosterFolder();
                        this.mapBreakpts(function (resizer) { return resizer.init(); });
                        mapAllEntries = function (fileEntry) { return __awaiter(_this, void 0, void 0, function () {
                            var fileNames;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fileNames = (0, glob_1.globSync)(this.getSubpath(fileEntry), { nodir: true }).sort(utils_1.sortFileNames);
                                        return [4, (0, utils_1.mapPromises)(fileNames, function (fileName) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, this.resizeMedia(this.removeSubpath(fileName), fileEntry)];
                                                    case 1: return [2, _a.sent()];
                                                }
                                            }); }); })];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); };
                        return [4, (0, utils_1.mapPromises)(this.allFileEntries, function (fileEntry) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, mapAllEntries(fileEntry)];
                                    case 1: return [2, _a.sent()];
                                }
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Resizer.prototype.createPosterFolder = function () {
        var hasVid = !!this.allFileEntries.find(function (fileName) {
            return (0, utils_1.parseMediaType)(fileName) === "video";
        });
        if (hasVid && this.exportPoster)
            this.createFolder(constants_1.POSTER_SUBFOLDER);
    };
    Resizer.prototype.resizeMedia = function (fileName, fileEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = (0, utils_1.parseMediaType)(fileName);
                        if (!(type === "image")) return [3, 2];
                        return [4, this.resizeImg(fileName, fileEntry)];
                    case 1:
                        _a.sent();
                        return [3, 5];
                    case 2:
                        if (!(type === "video")) return [3, 4];
                        return [4, this.resizeVid(fileName, fileEntry)];
                    case 3:
                        _a.sent();
                        return [3, 5];
                    case 4: throw new Error("".concat(fileName, " is not an approved file type."));
                    case 5: return [2];
                }
            });
        });
    };
    Resizer.prototype.resizeImg = function (fileName, fileEntry, posterConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var imgPath, animated, imgObj, size, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        imgPath = posterConfig ? fileName : this.getSubpath(fileName);
                        animated = (0, utils_1.getExtension)(imgPath) === resizerTypes_1.ImgExtension.Gif;
                        imgObj = (0, sharp_1.default)(imgPath, { animated: animated });
                        if (!posterConfig) return [3, 1];
                        _a = posterConfig.vidSize;
                        return [3, 3];
                    case 1:
                        _b = this.throwNoWidth;
                        return [4, imgObj.metadata()];
                    case 2:
                        _a = _b.apply(this, [_c.sent(), fileName]);
                        _c.label = 3;
                    case 3:
                        size = _a;
                        return [4, this.mapBreakpts(function (resizer) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, resizer.resizeImg(imgObj, {
                                                size: size,
                                                fileName: posterConfig ? posterConfig.vidFileName : fileName,
                                                fileEntry: fileEntry,
                                                isPoster: !!posterConfig
                                            })];
                                        case 1: return [2, _a.sent()];
                                    }
                                });
                            }); })];
                    case 4:
                        _c.sent();
                        this.log(imgPath);
                        if (!posterConfig)
                            this.callback(imgPath, size);
                        return [2];
                }
            });
        });
    };
    Resizer.prototype.resizeVid = function (fileName, fileEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var vidPath, vidObj, size, pngPosterPath, webpPosterPath, hasOutputs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vidPath = this.getSubpath(fileName);
                        vidObj = (0, fluent_ffmpeg_1.default)({ source: vidPath, priority: 10 }).noAudio();
                        return [4, new Promise(function (resolve) {
                                vidObj.ffprobe(function (_, _a) {
                                    var streams = _a.streams;
                                    return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_b) {
                                        return [2, resolve(this.throwNoWidth(streams[0], fileName))];
                                    }); });
                                });
                            })];
                    case 1:
                        size = _a.sent();
                        pngPosterPath = this.getScreenshotPath(vidPath);
                        webpPosterPath = this.getPosterPath(pngPosterPath);
                        if (!this.exportPoster) return [3, 3];
                        return [4, new Promise(function (resolve) {
                                (0, utils_1.removeFile)(pngPosterPath);
                                (0, utils_1.removeFile)(webpPosterPath);
                                (0, fluent_ffmpeg_1.default)(vidPath).screenshots({
                                    filename: path_1.default.basename(pngPosterPath),
                                    timestamps: [0],
                                    folder: _this.getSubpath(constants_1.POSTER_SUBFOLDER)
                                }).on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, (0, sharp_1.default)(pngPosterPath)
                                                    .webp(this.mediaOptions.webp)
                                                    .toFile(webpPosterPath)];
                                            case 1:
                                                _a.sent();
                                                fs_1.default.rmSync(pngPosterPath);
                                                resolve(null);
                                                return [2];
                                        }
                                    });
                                }); });
                            })];
                    case 2:
                        _a.sent();
                        this.resizeImg(webpPosterPath, fileEntry, {
                            vidSize: size, vidFileName: fileName
                        });
                        _a.label = 3;
                    case 3: return [4, this.mapBreakpts(function (resizer) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, resizer
                                            .resizeVideo(vidObj, { size: size, fileName: fileName, fileEntry: fileEntry })];
                                    case 1: return [2, _a.sent()];
                                }
                            });
                        }); })];
                    case 4:
                        _a.sent();
                        hasOutputs = lodash_1.default.some(this.breakptConfigs, { debugOnly: false });
                        if (!hasOutputs) return [3, 6];
                        return [4, new Promise(function (resolve) {
                                return vidObj.on('end', function () { return resolve(null); }).run();
                            })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        this.log(vidPath);
                        this.callback(vidPath, size);
                        return [2];
                }
            });
        });
    };
    Resizer.prototype.getSubpath = function () {
        var subpaths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subpaths[_i] = arguments[_i];
        }
        return utils_1.joinPaths.apply(void 0, __spreadArray([this.source], subpaths, false));
    };
    Resizer.prototype.removeSubpath = function (fullPath) {
        var sourceRegex = new RegExp("".concat(this.source, "/?"));
        return fullPath.replace(sourceRegex, '');
    };
    Resizer.prototype.createFolder = function () {
        var subpaths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subpaths[_i] = arguments[_i];
        }
        var filePath = this.getSubpath.apply(this, subpaths);
        if (this.removeFilesAtDest)
            (0, utils_1.emptyDir)(filePath);
        else
            (0, utils_1.mkdirIfNone)(filePath);
    };
    Resizer.prototype.mapBreakpts = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, (0, utils_1.mapPromises)(this.breakptResizers, function (resizer) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, callback(resizer)];
                                case 1: return [2, _a.sent()];
                            }
                        }); }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Resizer.prototype.log = function (fileName) {
        var color = (0, utils_1.parseMediaType)(fileName) === "image" ? 'green' : 'cyan';
        console.log("".concat(chalk_1.default.gray('Resized: ')).concat(chalk_1.default[color](fileName)));
    };
    Resizer.prototype.getScreenshotPath = function (filename) {
        var regex = new RegExp("(".concat(resizerTypes_1.vidExtensionRegex, ")$"));
        return (0, utils_1.joinPaths)(path_1.default.dirname(filename), constants_1.POSTER_SUBFOLDER, path_1.default.basename(filename).replace(regex, resizerTypes_1.ImgExtension.Png));
    };
    Resizer.prototype.getPosterPath = function (filename) {
        return filename.replace(resizerTypes_1.ImgExtension.Png, resizerTypes_1.ImgExtension.Webp);
    };
    Resizer.prototype.throwNoWidth = function (metadata, fileName) {
        var width = metadata.width, height = metadata.height, pageHeight = metadata.pageHeight;
        if (!width || !height)
            throw new Error("Cannot read dimensions of ".concat(fileName, "."));
        return { width: width, height: pageHeight !== null && pageHeight !== void 0 ? pageHeight : height };
    };
    return Resizer;
}());
exports.default = Resizer;
