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
exports.filterFalsy = exports.forEachFile = exports.sortFileNames = exports.readJsonSync = exports.mapObjectPromises = exports.mapPromises = exports.mapObject = exports.typedKeys = exports.loopObject = exports.getExtension = exports.parseMediaType = exports.removeFile = exports.joinPaths = exports.emptyDir = exports.mkdir = exports.mkdirIfNone = void 0;
var fs_1 = __importDefault(require("fs"));
var resizerTypes_1 = require("./resizer/lib/resizerTypes");
var path_1 = __importDefault(require("path"));
var mkdirIfNone = function (folderPath) {
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
var mkdir = function (folderPath, removeExisting) {
    if (removeExisting)
        (0, exports.emptyDir)(folderPath);
    else
        (0, exports.mkdirIfNone)(folderPath);
};
exports.mkdir = mkdir;
var emptyDir = function (folderPath) {
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
var joinPaths = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return paths.filter(function (p) { return p; }).join('/');
};
exports.joinPaths = joinPaths;
var removeFile = function (path) {
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
var parseMediaType = function (fileName) {
    var imgRegex = new RegExp(".(".concat(resizerTypes_1.imgExtensionRegex, ")$"), 'i');
    var vidRegex = new RegExp(".(".concat(resizerTypes_1.vidExtensionRegex, ")$"), 'i');
    if (fileName.match(imgRegex) || fileName.match(/\*$/))
        return "image";
    if (fileName.match(vidRegex))
        return "video";
    throw new Error("".concat(fileName, " is neither an image nor a video."));
};
exports.parseMediaType = parseMediaType;
var getExtension = function (fileName) { return path_1.default.extname(fileName).slice(1); };
exports.getExtension = getExtension;
var loopObject = function (object, callback) {
    var keys = typedKeys(object);
    keys.forEach(function (key) {
        var value = object[key];
        callback(key, value, object);
    });
    return object;
};
exports.loopObject = loopObject;
function typedKeys(object) {
    return Object.keys(object);
}
exports.typedKeys = typedKeys;
var mapObject = function (object, callback) {
    var newObject = {};
    var keys = typedKeys(object);
    keys.forEach(function (key) {
        var value = object[key];
        newObject[key] = callback(key, value);
    });
    return newObject;
};
exports.mapObject = mapObject;
var mapPromises = function (array, callback) { var _a, array_1, array_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var results, i, value, _b, _c, e_1_1;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                results = [];
                i = 0;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 7, 8, 13]);
                _a = true, array_1 = __asyncValues(array);
                _g.label = 2;
            case 2: return [4, array_1.next()];
            case 3:
                if (!(array_1_1 = _g.sent(), _d = array_1_1.done, !_d)) return [3, 6];
                _f = array_1_1.value;
                _a = false;
                value = _f;
                _c = (_b = results).push;
                return [4, callback(value, i, array)];
            case 4:
                _c.apply(_b, [_g.sent()]);
                i++;
                _g.label = 5;
            case 5:
                _a = true;
                return [3, 2];
            case 6: return [3, 13];
            case 7:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3, 13];
            case 8:
                _g.trys.push([8, , 11, 12]);
                if (!(!_a && !_d && (_e = array_1.return))) return [3, 10];
                return [4, _e.call(array_1)];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10: return [3, 12];
            case 11:
                if (e_1) throw e_1.error;
                return [7];
            case 12: return [7];
            case 13: return [2, results];
        }
    });
}); };
exports.mapPromises = mapPromises;
var mapObjectPromises = function (object, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var keys, _a, keys_1, keys_1_1, key, value, e_2_1;
    var _b, e_2, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                keys = Object.keys(object);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, 8, 13]);
                _a = true, keys_1 = __asyncValues(keys);
                _e.label = 2;
            case 2: return [4, keys_1.next()];
            case 3:
                if (!(keys_1_1 = _e.sent(), _b = keys_1_1.done, !_b)) return [3, 6];
                _d = keys_1_1.value;
                _a = false;
                key = _d;
                value = object[key];
                return [4, callback(key, value, object)];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5:
                _a = true;
                return [3, 2];
            case 6: return [3, 13];
            case 7:
                e_2_1 = _e.sent();
                e_2 = { error: e_2_1 };
                return [3, 13];
            case 8:
                _e.trys.push([8, , 11, 12]);
                if (!(!_a && !_b && (_c = keys_1.return))) return [3, 10];
                return [4, _c.call(keys_1)];
            case 9:
                _e.sent();
                _e.label = 10;
            case 10: return [3, 12];
            case 11:
                if (e_2) throw e_2.error;
                return [7];
            case 12: return [7];
            case 13: return [2, object];
        }
    });
}); };
exports.mapObjectPromises = mapObjectPromises;
var readJsonSync = function (filePath) { return JSON.parse(fs_1.default.readFileSync(filePath, 'utf8')); };
exports.readJsonSync = readJsonSync;
var sortFileNames = function (fileA, fileB) {
    var collator = new Intl.Collator('us-EN');
    var returnDefault = function () { return collator.compare(fileA, fileB); };
    if (path_1.default.dirname(fileA) !== path_1.default.dirname(fileB) ||
        path_1.default.extname(fileA) !== path_1.default.extname(fileB) ||
        !path_1.default.extname(fileA))
        return returnDefault();
    var fileNameA = path_1.default.parse(fileA).name;
    var fileNameB = path_1.default.parse(fileB).name;
    var getSuffix = function (fileName) { return fileName.match(/[0-9].*$/); };
    var suffixAMatch = getSuffix(fileNameA);
    var suffixBMatch = getSuffix(fileNameB);
    if (!suffixAMatch || !suffixBMatch)
        return returnDefault();
    var suffixA = suffixAMatch[0];
    var suffixB = suffixBMatch[0];
    var getPrefix = function (fileName, suffix) { return fileName.replace(suffix, ''); };
    var prefixA = getPrefix(fileNameA, suffixA);
    var prefixB = getPrefix(fileNameB, suffixB);
    if (prefixA !== prefixB ||
        Number.isNaN(+suffixA) ||
        Number.isNaN(+suffixB))
        return returnDefault();
    return Number(suffixA) - Number(suffixB);
};
exports.sortFileNames = sortFileNames;
var forEachFile = function (path, callback) { return __awaiter(void 0, void 0, void 0, function () {
    var files, i, fileName, fileData;
    return __generator(this, function (_a) {
        files = fs_1.default.readdirSync(path);
        for (i = 0; i < files.length; i++) {
            fileName = files[i];
            fileData = fs_1.default.readFileSync("".concat(path, "/").concat(fileName), 'utf8');
            callback(fileName, fileData, files);
        }
        return [2];
    });
}); };
exports.forEachFile = forEachFile;
var filterFalsy = function (array) {
    return array.filter(function (elem) { return elem; });
};
exports.filterFalsy = filterFalsy;
