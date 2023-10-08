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
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const glob_1 = require("glob");
const utils_1 = require("../../utils");
const constants_1 = require("../constants");
class BreakpointResizer {
    constructor(source, config, { destination, mediaOptions, removeFilesAtDest, exportPoster }) {
        this.source = source;
        this.config = config;
        this.destination = (0, utils_1.joinPaths)(destination, this.config.breakpt);
        this.breakptTypes = lodash_1.default.uniq(config.sizes
            .map(size => size[0])
            .map(fileEntry => {
            const fileNames = (0, glob_1.globSync)(this.getSubpath(fileEntry), { nodir: true });
            return fileNames.map(utils_1.parseMediaType);
        })
            .flat());
        this.mediaOptions = mediaOptions;
        this.removeFilesAtDest = removeFilesAtDest;
        this.exportPoster = exportPoster;
    }
    init() {
        this.createFolder();
        this.createPosterFolder();
    }
    resizeImg(imgObj, { size, fileName, fileEntry, isPoster }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { width } = size;
            const resizeWidth = this.getResizeWidth(fileEntry, size);
            if (!resizeWidth ||
                !this.shouldExport("image") ||
                (isPoster && !this.shouldExport("poster")) ||
                this.config.debugOnly)
                return;
            const imgObjClone = imgObj.clone();
            if (width > resizeWidth)
                imgObjClone.resize({ width: resizeWidth });
            if (this.config.blur)
                imgObjClone.blur(this.config.blur);
            if (isPoster)
                fileName = this.getPosterPath(fileName);
            const outFile = this.getSubpath(fileName);
            this.prepareDest(outFile);
            const fileType = (0, utils_1.getExtension)(fileName);
            if (fileType === "gif")
                imgObjClone.gif(this.mediaOptions.gif);
            else if (fileType === "webp")
                imgObjClone.webp(this.mediaOptions.webp);
            return yield imgObjClone.toFile(outFile);
        });
    }
    resizeVideo(vidObj, { size, fileName, fileEntry }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { width } = size;
            const resizeWidth = this.getResizeWidth(fileEntry, size);
            if (!resizeWidth ||
                !this.shouldExport("video") ||
                this.config.debugOnly)
                return;
            if (width > resizeWidth)
                vidObj.size(`${resizeWidth}x?`);
            const outFile = this.getSubpath(fileName);
            this.prepareDest(outFile);
            vidObj.output(outFile);
        });
    }
    getSubpath(...subpaths) {
        return (0, utils_1.joinPaths)(this.destination, ...subpaths);
    }
    createFolder(...subpaths) {
        if (this.config.debugOnly)
            return;
        const filePath = this.getSubpath(...subpaths);
        if (this.removeFilesAtDest)
            (0, utils_1.emptyDir)(filePath);
        else
            (0, utils_1.mkdirIfNone)(filePath);
    }
    createPosterFolder() {
        if (this.hasVid &&
            this.exportPoster &&
            this.shouldExport("video") &&
            this.shouldExport("poster") &&
            !this.config.debugOnly)
            this.createFolder(constants_1.POSTER_SUBFOLDER);
    }
    prepareDest(fileName) {
        (0, utils_1.removeFile)(fileName);
        (0, utils_1.mkdirIfNone)(path_1.default.dirname(fileName));
    }
    getSizePercentage(fileName) {
        const size = this.config.sizes.find(size => size[0] === fileName);
        return size ? size[1] : undefined;
    }
    getResizeWidth(fileName, size) {
        const { breakptWidth, maxDimension, noResize } = this.config;
        const { width, height } = size;
        const maxWidth = maxDimension ? Math.round(Math.sqrt(maxDimension * width / height)) : width;
        if (noResize || !breakptWidth)
            return Math.min(width, maxWidth);
        const sizePercentage = this.getSizePercentage(fileName);
        if (!sizePercentage)
            return;
        const resizedWidth = Math.round(sizePercentage * breakptWidth);
        return Math.min(resizedWidth, maxWidth);
    }
    getPosterPath(fileName) {
        return (0, utils_1.joinPaths)(constants_1.POSTER_SUBFOLDER, fileName.replace("webm", "webp"));
    }
    shouldExport(type) {
        var _a;
        return !((_a = this.config.exclude) === null || _a === void 0 ? void 0 : _a.includes(type));
    }
    get hasVid() {
        return this.breakptTypes.includes("video");
    }
}
exports.default = BreakpointResizer;
