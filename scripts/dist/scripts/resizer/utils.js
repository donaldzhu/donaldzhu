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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortFileNames = exports.readJsonSync = exports.mapObjectPromises = exports.mapPromises = exports.mapObject = exports.getExtension = exports.parseMediaType = exports.removeFile = exports.joinPaths = exports.emptyDir = exports.mkdirIfNone = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mkdirIfNone = (folderPath) => {
    try {
        if (!fs_1.default.existsSync(folderPath)) {
            fs_1.default.mkdirSync(folderPath, { recursive: true });
            return true;
        }
        else
            return false;
    }
    catch (err) {
        throw err;
    }
};
exports.mkdirIfNone = mkdirIfNone;
const emptyDir = (folderPath) => {
    try {
        fs_1.default.rmSync(folderPath, { recursive: true });
    }
    catch (err) {
        if (err.code !== 'ENOENT')
            throw err;
    }
    fs_1.default.mkdirSync(folderPath, { recursive: true });
};
exports.emptyDir = emptyDir;
const joinPaths = (...paths) => paths.filter(p => p).join('/');
exports.joinPaths = joinPaths;
const removeFile = (path) => {
    try {
        if (fs_1.default.existsSync(path)) {
            fs_1.default.rmSync(path);
            return true;
        }
        else
            return false;
    }
    catch (err) {
        throw err;
    }
};
exports.removeFile = removeFile;
const parseMediaType = (fileName) => {
    const imgRegex = new RegExp(`.(${"gif"}|${"webp"}|${"png"})$`, 'i');
    const vidRegex = new RegExp(`.${"webm"}$`, 'i');
    if (fileName.match(imgRegex) || fileName.match(/\*$/))
        return "image";
    if (fileName.match(vidRegex))
        return "video";
    throw new Error(`${fileName} is neither an image nor a video.`);
};
exports.parseMediaType = parseMediaType;
const getExtension = (fileName) => path_1.default.extname(fileName).slice(1);
exports.getExtension = getExtension;
const mapObject = (object, callback) => {
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = object[key];
        callback(key, value, object);
    }
    return object;
};
exports.mapObject = mapObject;
const mapPromises = (array, callback) => { var _a, array_1, array_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    const results = [];
    let i = 0;
    try {
        for (_a = true, array_1 = __asyncValues(array); array_1_1 = yield array_1.next(), _b = array_1_1.done, !_b; _a = true) {
            _d = array_1_1.value;
            _a = false;
            const value = _d;
            results.push(yield callback(value, i, array));
            i++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = array_1.return)) yield _c.call(array_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return results;
}); };
exports.mapPromises = mapPromises;
const mapObjectPromises = (object, callback) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    const keys = Object.keys(object);
    try {
        for (var _d = true, keys_1 = __asyncValues(keys), keys_1_1; keys_1_1 = yield keys_1.next(), _a = keys_1_1.done, !_a; _d = true) {
            _c = keys_1_1.value;
            _d = false;
            const key = _c;
            const value = object[key];
            yield callback(key, value, object);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = keys_1.return)) yield _b.call(keys_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return object;
});
exports.mapObjectPromises = mapObjectPromises;
const readJsonSync = (filePath) => JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
exports.readJsonSync = readJsonSync;
const sortFileNames = (fileA, fileB) => {
    const collator = new Intl.Collator('us-EN');
    const returnDefault = () => collator.compare(fileA, fileB);
    if (path_1.default.dirname(fileA) !== path_1.default.dirname(fileB) ||
        path_1.default.extname(fileA) !== path_1.default.extname(fileB) ||
        !path_1.default.extname(fileA))
        return returnDefault();
    const fileNameA = path_1.default.parse(fileA).name;
    const fileNameB = path_1.default.parse(fileB).name;
    const getSuffix = (fileName) => fileName.match(/[0-9].*$/);
    const suffixAMatch = getSuffix(fileNameA);
    const suffixBMatch = getSuffix(fileNameB);
    if (!suffixAMatch || !suffixBMatch)
        return returnDefault();
    const suffixA = suffixAMatch[0];
    const suffixB = suffixBMatch[0];
    const getPrefix = (fileName, suffix) => fileName.replace(suffix, '');
    const prefixA = getPrefix(fileNameA, suffixA);
    const prefixB = getPrefix(fileNameB, suffixB);
    if (prefixA !== prefixB ||
        Number.isNaN(+suffixA) ||
        Number.isNaN(+suffixB))
        return returnDefault();
    return Number(suffixA) - Number(suffixB);
};
exports.sortFileNames = sortFileNames;
