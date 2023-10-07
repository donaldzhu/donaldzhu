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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const sharp_1 = __importDefault(require("sharp"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const glob_1 = require("glob");
const chalk_1 = __importDefault(require("chalk"));
const breakptResizer_1 = __importDefault(require("./breakptResizer"));
const utils_1 = require("../../utils");
const config_1 = require("./config");
class Resizer {
    constructor(source, breakptConfigs, { destination, mediaOptions = {}, toParentFolder = true, removeFilesAtDest = true, exportPoster = true, callback = lodash_1.default.noop } = {}) {
        this.source = source;
        this.breakptConfigs = breakptConfigs;
        const parentFolder = path_1.default.dirname(source);
        this.destination = destination || (toParentFolder ? parentFolder : source);
        this.breakptResizers = breakptConfigs.map(config => new breakptResizer_1.default(source, config, {
            destination: this.destination,
            mediaOptions,
            removeFilesAtDest,
            exportPoster
        }));
        this.allFileEntries = lodash_1.default.union(...this.breakptConfigs.map(config => config.sizes.map(size => size[0])));
        this.mediaOptions = mediaOptions;
        this.removeFilesAtDest = removeFilesAtDest;
        this.exportPoster = exportPoster;
        this.callback = callback;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.createPosterFolder();
            this.mapBreakpts(resizer => resizer.init());
            const mapAllEntries = (fileEntry) => __awaiter(this, void 0, void 0, function* () {
                const fileNames = (0, glob_1.globSync)(this.getSubpath(fileEntry), { nodir: true }).sort(utils_1.sortFileNames);
                yield (0, utils_1.mapPromises)(fileNames, (fileName) => __awaiter(this, void 0, void 0, function* () { return yield this.resizeMedia(this.removeSubpath(fileName), fileEntry); }));
            });
            yield (0, utils_1.mapPromises)(this.allFileEntries, (fileEntry) => __awaiter(this, void 0, void 0, function* () { return yield mapAllEntries(fileEntry); }));
        });
    }
    createPosterFolder() {
        const hasVid = !!this.allFileEntries.find(fileName => (0, utils_1.parseMediaType)(fileName) === "video");
        if (hasVid && this.exportPoster)
            this.createFolder(config_1.POSTER_SUBFOLDER);
    }
    resizeMedia(fileName, fileEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = (0, utils_1.parseMediaType)(fileName);
            if (type === "image")
                yield this.resizeImg(fileName, fileEntry);
            else if (type === "video")
                yield this.resizeVid(fileName, fileEntry);
            else
                throw new Error(`${fileName} is not an approved file type.`);
        });
    }
    resizeImg(fileName, fileEntry, posterConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const imgPath = posterConfig ? fileName : this.getSubpath(fileName);
            const animated = (0, utils_1.getExtension)(imgPath) === "gif";
            const imgObj = (0, sharp_1.default)(imgPath, { animated });
            const size = posterConfig ? posterConfig.vidSize :
                this.throwNoWidth(yield imgObj.metadata(), fileName);
            yield this.mapBreakpts(resizer => resizer.resizeImg(imgObj, {
                size,
                fileName: posterConfig ? posterConfig.vidFileName : fileName,
                fileEntry,
                isPoster: !!posterConfig
            }));
            this.log(imgPath);
            if (!posterConfig)
                this.callback(imgPath, size);
        });
    }
    resizeVid(fileName, fileEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            const vidPath = this.getSubpath(fileName);
            const vidObj = (0, fluent_ffmpeg_1.default)(vidPath).noAudio();
            const size = yield new Promise(resolve => {
                vidObj.ffprobe((_, { streams }) => __awaiter(this, void 0, void 0, function* () { return resolve(this.throwNoWidth(streams[0], fileName)); }));
            });
            const pngPosterPath = this.getScreenshotPath(vidPath);
            const webpPosterPath = this.getPosterPath(pngPosterPath);
            if (this.exportPoster) {
                yield new Promise(resolve => {
                    (0, utils_1.removeFile)(pngPosterPath);
                    (0, utils_1.removeFile)(webpPosterPath);
                    (0, fluent_ffmpeg_1.default)(vidPath).screenshots({
                        filename: path_1.default.basename(pngPosterPath),
                        timestamps: [0],
                        folder: this.getSubpath(config_1.POSTER_SUBFOLDER)
                    }).on('end', () => __awaiter(this, void 0, void 0, function* () {
                        yield (0, sharp_1.default)(pngPosterPath)
                            .webp(this.mediaOptions.webp)
                            .toFile(webpPosterPath);
                        fs_1.default.rmSync(pngPosterPath);
                        resolve(null);
                    }));
                });
                this.resizeImg(webpPosterPath, fileEntry, {
                    vidSize: size, vidFileName: fileName
                });
            }
            this.mapBreakpts(resizer => resizer
                .resizeVideo(vidObj, { size, fileName, fileEntry }));
            const hasOutputs = lodash_1.default.some(this.breakptConfigs, { debugOnly: false });
            if (hasOutputs)
                yield new Promise(resolve => vidObj.on('end', () => resolve(null)).run());
            this.log(vidPath);
            this.callback(vidPath, size);
        });
    }
    getSubpath(...subpaths) {
        return (0, utils_1.joinPaths)(this.source, ...subpaths);
    }
    removeSubpath(fullPath) {
        const sourceRegex = new RegExp(`${this.source}/?`);
        return fullPath.replace(sourceRegex, '');
    }
    createFolder(...subpaths) {
        const filePath = this.getSubpath(...subpaths);
        if (this.removeFilesAtDest)
            (0, utils_1.emptyDir)(filePath);
        else
            (0, utils_1.mkdirIfNone)(filePath);
    }
    mapBreakpts(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, utils_1.mapPromises)(this.breakptResizers, (resizer) => __awaiter(this, void 0, void 0, function* () { return yield callback(resizer); }));
        });
    }
    log(fileName) {
        const color = (0, utils_1.parseMediaType)(fileName) === "image" ? 'green' : 'cyan';
        console.log(`${chalk_1.default.gray('Resized: ')}${chalk_1.default[color](fileName)}`);
    }
    getScreenshotPath(filename) {
        return (0, utils_1.joinPaths)(path_1.default.dirname(filename), config_1.POSTER_SUBFOLDER, path_1.default.basename(filename).replace("webm", "png"));
    }
    getPosterPath(filename) {
        return filename.replace("png", "webp");
    }
    throwNoWidth(metadata, fileName) {
        const { width, height } = metadata;
        if (!width || !height)
            throw new Error(`Cannot read dimensions of ${fileName}.`);
        return { width, height };
    }
}
exports.default = Resizer;
