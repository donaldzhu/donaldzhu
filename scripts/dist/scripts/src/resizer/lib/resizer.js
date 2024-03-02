"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var fs_1 = __importStar(require("fs"));
var path_1 = __importDefault(require("path"));
var child_process_1 = require("child_process");
var lodash_1 = __importDefault(require("lodash"));
var sharp_1 = __importDefault(require("sharp"));
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var glob_1 = require("glob");
var chalk_1 = __importDefault(require("chalk"));
var breakptResizer_1 = __importDefault(require("./breakptResizer"));
var resizerTypes_1 = require("./resizerTypes");
var utils_1 = require("../../utils");
var constants_1 = require("./constants");
var resizeUtils_1 = require("../resizeUtils");
var Resizer = (function () {
    function Resizer(source, breakptConfigs, _a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, destination = _b.destination, _c = _b.mediaOptions, mediaOptions = _c === void 0 ? {} : _c, _d = _b.removeFilesAtDest, removeFilesAtDest = _d === void 0 ? true : _d, _e = _b.exportPoster, exportPoster = _e === void 0 ? true : _e, _f = _b.exportTypes, exportTypes = _f === void 0 ? [] : _f, _g = _b.callback, callback = _g === void 0 ? lodash_1.default.noop : _g;
        this.source = source;
        this.breakptConfigs = breakptConfigs;
        this.destination = destination || source;
        this.breakptResizers = breakptConfigs.map(function (config) { return new breakptResizer_1.default(source, config, {
            destination: _this.destination,
            mediaOptions: mediaOptions,
            removeFilesAtDest: removeFilesAtDest,
            exportPoster: exportPoster,
            exportTypes: exportTypes
        }); });
        this.allFileEntries = lodash_1.default.union.apply(lodash_1.default, this.breakptConfigs.map(function (config) {
            return config.sizes.map(function (size) { return size[0]; });
        }));
        this.mediaOptions = mediaOptions;
        this.removeFilesAtDest = removeFilesAtDest;
        this.exportPoster = exportPoster;
        this.exportTypes = exportTypes;
        this.debugOnly = !lodash_1.default.some(this.breakptConfigs, { debugOnly: false });
        this.callback = callback;
    }
    Resizer.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mapAllEntries;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.shouldExport("poster"))
                            this.createSrcPosterDir();
                        if (this.shouldExport("dash"))
                            this.createDestDashDir();
                        this.mapBreakpts(function (resizer) { return resizer.init(); });
                        mapAllEntries = function (fileEntry) { return __awaiter(_this, void 0, void 0, function () {
                            var fileNames;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fileNames = (0, glob_1.globSync)(this.joinSrcPath(fileEntry), { nodir: true }).sort(utils_1.sortFileNames);
                                        return [4, (0, utils_1.mapPromises)(fileNames, function (fileName) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, this.resizeMedia(this.extractSrcSubpath(fileName), fileEntry)];
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
    Resizer.prototype.createSrcPosterDir = function () {
        if (this.hasVid && this.exportPoster)
            (0, utils_1.mkdir)(this.joinSrcPath(constants_1.POSTER_SUBFOLDER), this.removeFilesAtDest);
    };
    Resizer.prototype.createDestDashDir = function () {
        var _this = this;
        if (this.hasVid) {
            (0, utils_1.mkdir)((0, utils_1.joinPaths)(this.destination, constants_1.DASH_SUBFOLDER), this.removeFilesAtDest);
            resizerTypes_1.vidExportTypes.forEach(function (type) { return (0, utils_1.mkdir)((0, utils_1.joinPaths)(_this.destination, constants_1.DASH_SUBFOLDER, type), _this.removeFilesAtDest); });
        }
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
            var imgPath, isAnimated, imgObj, size, _a, _b, isPoster, shouldExport;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        imgPath = posterConfig ? fileName : this.joinSrcPath(fileName);
                        isAnimated = (0, utils_1.getExtension)(imgPath) === resizerTypes_1.ImgExtension.Gif;
                        imgObj = (0, sharp_1.default)(imgPath, { animated: isAnimated });
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
                        isPoster = !!posterConfig;
                        shouldExport = isPoster || this.shouldExport("image");
                        if (!shouldExport) return [3, 5];
                        return [4, this.mapBreakpts(function (resizer) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, resizer.resizeImg(imgObj, {
                                                metadata: size,
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
                        _c.label = 5;
                    case 5:
                        this.log(imgPath, isPoster ? "poster" : "image", shouldExport);
                        if (!posterConfig)
                            this.callback(imgPath, size);
                        return [2];
                }
            });
        });
    };
    Resizer.prototype.resizeVid = function (fileName, fileEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var vidPath, vidObj, metadata, width, height, pngPosterPath, webpPosterPath, _a, dir, name_1, ext, tempPath, shouldResizeOriginal;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vidPath = this.joinSrcPath(fileName);
                        vidObj = this.createFfmpeg(vidPath);
                        return [4, new Promise(function (resolve) {
                                vidObj.ffprobe(function (_, metadata) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2, resolve(this.throwNoWidth(metadata.streams[0], fileName))];
                                }); }); });
                            })];
                    case 1:
                        metadata = _b.sent();
                        width = metadata.width, height = metadata.height;
                        pngPosterPath = this.getScreenshotPath(vidPath);
                        webpPosterPath = this.getPosterPath(pngPosterPath);
                        if (!(this.exportPoster && this.shouldExport("poster"))) return [3, 3];
                        return [4, new Promise(function (resolve) {
                                (0, utils_1.removeFile)(pngPosterPath);
                                (0, utils_1.removeFile)(webpPosterPath);
                                (0, fluent_ffmpeg_1.default)(vidPath).screenshots({
                                    filename: path_1.default.basename(pngPosterPath),
                                    timestamps: [0],
                                    folder: _this.joinSrcPath(constants_1.POSTER_SUBFOLDER)
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
                        _b.sent();
                        this.resizeImg(webpPosterPath, fileEntry, {
                            vidSize: metadata, vidFileName: fileName
                        });
                        _b.label = 3;
                    case 3:
                        if (!this.shouldExport("video")) return [3, 8];
                        _a = path_1.default.parse(vidPath), dir = _a.dir, name_1 = _a.name, ext = _a.ext;
                        tempPath = "".concat(dir, "/").concat(name_1, "_temp").concat(ext);
                        shouldResizeOriginal = (0, resizeUtils_1.isOdd)(width) || (0, resizeUtils_1.isOdd)(height);
                        if (!shouldResizeOriginal) return [3, 5];
                        vidObj
                            .size("".concat((0, resizeUtils_1.roundEven)(width), "x?"))
                            .output(tempPath);
                        return [4, this.runFfmpeg(vidObj)];
                    case 4:
                        _b.sent();
                        (0, fs_1.unlinkSync)(vidPath);
                        (0, fs_1.renameSync)(tempPath, vidPath);
                        vidObj = this.createFfmpeg(vidPath);
                        _b.label = 5;
                    case 5: return [4, this.mapBreakpts(function (resizer) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, resizer
                                            .resizeVideo(vidObj, { metadata: metadata, fileName: fileName, fileEntry: fileEntry })];
                                    case 1: return [2, _a.sent()];
                                }
                            });
                        }); })];
                    case 6:
                        _b.sent();
                        return [4, this.runFfmpeg(vidObj)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        this.log(vidPath, "video", this.shouldExport("video"));
                        if (this.shouldExport("dash"))
                            this.generateDash(fileName, metadata, this.shouldExport("dash"));
                        this.log(vidPath, "dash", this.shouldExport("dash"));
                        this.callback(vidPath, metadata);
                        return [2];
                }
            });
        });
    };
    Resizer.prototype.generateDash = function (fileName, metadata, shouldExport) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, ext, width, height, srcPath, shouldCreateMp4, vidObj, getEvenWidth, qualityMap, qualityFilters, gopSize, destFolderPath, command;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = path_1.default.parse(fileName), name = _a.name, ext = _a.ext;
                        width = metadata.width, height = metadata.height;
                        srcPath = this.joinSrcPath(fileName);
                        shouldCreateMp4 = ext !== '.mp4' && shouldExport;
                        if (!shouldCreateMp4) return [3, 2];
                        vidObj = this.createFfmpeg(srcPath);
                        srcPath = srcPath.replace(/\.webm$/, '_temp.mp4');
                        vidObj.output(srcPath);
                        return [4, this.runFfmpeg(vidObj)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        getEvenWidth = function (resizedHeight) { return 2 * Math.round(width / height * resizedHeight / 2); };
                        qualityMap = constants_1.DASH_CONFIGS
                            .map(function (_a, i) {
                            var _b;
                            var size = _a.size, bitrate = _a.bitrate, frameRate = _a.frameRate;
                            if (size > height)
                                return;
                            frameRate = Math.min(frameRate, (_b = metadata.frameRate) !== null && _b !== void 0 ? _b : Infinity);
                            return "-map v:0 -s:".concat(i, " ").concat(getEvenWidth(size), "x").concat(size, " -b:v:").concat(i, " ").concat(bitrate, " -r:").concat(i, " ").concat(frameRate);
                        });
                        qualityFilters = (0, utils_1.filterFalsy)(qualityMap).join(' ');
                        gopSize = 100;
                        destFolderPath = (0, utils_1.joinPaths)(this.destination, constants_1.DASH_SUBFOLDER, name);
                        command = "\n    nice -n 10 ffmpeg -i ".concat(srcPath, " -y \\\n    -c:v libx264 -preset veryslow -sc_threshold 0 \\\n    -keyint_min ").concat(gopSize, " -g ").concat(gopSize, " -hide_banner -loglevel warning \\\n    ").concat(qualityFilters, " \\\n    -use_template 1 -use_timeline 1 -seg_duration 4 \\\n    -adaptation_sets \"id=0,streams=v\" \\\n    -f dash ").concat(destFolderPath, "/dash.mpd\n    ");
                        (0, utils_1.mkdir)(destFolderPath, this.removeFilesAtDest);
                        (0, child_process_1.execSync)(command);
                        console.log(command);
                        if (shouldCreateMp4)
                            (0, fs_1.unlinkSync)(srcPath);
                        return [2];
                }
            });
        });
    };
    Resizer.prototype.createFfmpeg = function (source) {
        return (0, fluent_ffmpeg_1.default)({ source: source, priority: 10 }).noAudio();
    };
    Resizer.prototype.runFfmpeg = function (ffmpegCommand) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Promise(function (resolve) { return ffmpegCommand
                            .on('end', function () { return resolve(null); })
                            .on('error', function (err) { return console.log(err); })
                            .run(); })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Resizer.prototype.joinSrcPath = function () {
        var subpaths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            subpaths[_i] = arguments[_i];
        }
        return utils_1.joinPaths.apply(void 0, __spreadArray([this.source], subpaths, false));
    };
    Resizer.prototype.extractSrcSubpath = function (fullPath) {
        var sourceRegex = new RegExp("".concat(this.source, "/?"));
        return fullPath.replace(sourceRegex, '');
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
    Resizer.prototype.log = function (fileName, type, isExport) {
        var _a;
        var colors = (_a = {},
            _a["image"] = 'green',
            _a["video"] = 'cyan',
            _a["poster"] = 'yellow',
            _a["dash"] = 'magenta',
            _a);
        var color = colors[type];
        console.log("".concat(chalk_1.default[isExport ? 'white' : 'gray']("".concat(isExport ?
            'Resized' : 'Debugged', " [ ").concat(type, " ]: "))).concat(chalk_1.default[color](fileName)));
    };
    Resizer.prototype.getScreenshotPath = function (filename) {
        return (0, utils_1.joinPaths)(path_1.default.dirname(filename), constants_1.POSTER_SUBFOLDER, path_1.default.basename((0, resizeUtils_1.replaceExt)(filename, resizerTypes_1.ImgExtension.Png)));
    };
    Resizer.prototype.getPosterPath = function (filename) {
        return filename.replace(resizerTypes_1.ImgExtension.Png, resizerTypes_1.ImgExtension.Webp);
    };
    Resizer.prototype.throwNoWidth = function (metadata, fileName) {
        var width = metadata.width, height = metadata.height, pageHeight = metadata.pageHeight, frameRate = metadata.frameRate;
        if (!width || !height)
            throw new Error("Cannot read dimensions of ".concat(fileName, "."));
        return { width: width, height: pageHeight !== null && pageHeight !== void 0 ? pageHeight : height, frameRate: frameRate !== null && frameRate !== void 0 ? frameRate : 24 };
    };
    Resizer.prototype.shouldExport = function (type) {
        return !this.debugOnly && (this.exportTypes.length === 0 || this.exportTypes.includes(type));
    };
    Object.defineProperty(Resizer.prototype, "hasVid", {
        get: function () {
            return !!this.allFileEntries.find(function (fileName) {
                return (0, utils_1.parseMediaType)(fileName) === "video";
            });
        },
        enumerable: false,
        configurable: true
    });
    return Resizer;
}());
exports.default = Resizer;
