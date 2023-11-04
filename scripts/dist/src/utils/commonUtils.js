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
exports.getIsMobile = exports.TO_DEG = exports.isBrowser = exports.getBlankCoors = exports.filterFalsy = exports.getToolTipPoints = exports.appendQuery = exports.toPairs = exports.keysToObject = exports.mapObject = exports.typedKeys = exports.loopObject = exports.partition = exports.sortLike = exports.shuffleTo = exports.arrayify = exports.repeat = exports.repeatMap = exports.map = exports.validateString = exports.joinPaths = exports.capitalize = void 0;
var breakpoints_1 = __importDefault(require("../data/breakpoints"));
var capitalize = function (string) { return string.charAt(0)
    .toUpperCase() + string.slice(1); };
exports.capitalize = capitalize;
var joinPaths = function () {
    var paths = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        paths[_i] = arguments[_i];
    }
    return paths.filter(function (p) { return p; }).join('/');
};
exports.joinPaths = joinPaths;
function validateString(validatorOrString, string) {
    if (!string)
        return validatorOrString || '';
    return validatorOrString ? string : '';
}
exports.validateString = validateString;
var map = function (value, inMin, inMax, outMin, outMax) {
    if (outMin === void 0) { outMin = 0; }
    if (outMax === void 0) { outMax = 1; }
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
exports.map = map;
var repeatMap = function (repetition, callback) {
    var accumulatedReturns = [];
    for (var i = 0; i < repetition; i++)
        accumulatedReturns.push(callback(i));
    return accumulatedReturns;
};
exports.repeatMap = repeatMap;
var repeat = function (repetition, value) { return Array(repetition).fill(value); };
exports.repeat = repeat;
var arrayify = function (possibleArray) {
    return Array.isArray(possibleArray) ? possibleArray : [possibleArray];
};
exports.arrayify = arrayify;
var shuffleTo = function (array, index) {
    array = __spreadArray([], array, true);
    return __spreadArray(__spreadArray([], array.splice(index), true), array, true);
};
exports.shuffleTo = shuffleTo;
var sortLike = function (array, modelArray) {
    return array.sort(function (a, b) {
        return modelArray.indexOf(a) - modelArray.indexOf(b);
    });
};
exports.sortLike = sortLike;
var partition = function (array, filterCallback) {
    var filterTrue = function (elem) { return filterCallback(elem); };
    var filterFalse = function (elem) { return !filterCallback(elem); };
    var trueArray = array.filter(filterTrue);
    var falseArray = array.filter(filterFalse);
    return [trueArray, falseArray];
};
exports.partition = partition;
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
var keysToObject = function (array, callback) { return array.reduce(function (obj, key, i) {
    var _a;
    return (__assign(__assign({}, obj), (_a = {}, _a[key] = callback(key, obj, i), _a)));
}, {}); };
exports.keysToObject = keysToObject;
var toPairs = function (object) {
    var keys = typedKeys(object);
    return keys.map(function (key) { return [key, object[key]]; });
};
exports.toPairs = toPairs;
var appendQuery = function () {
    var queries = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        queries[_i] = arguments[_i];
    }
    return queries.reduce(function (string, _a, i) {
        var queryKey = _a[0], queryValue = _a[1];
        return string += i ? '&' : '' + "".concat(queryKey, "=").concat(queryValue);
    }, '?');
};
exports.appendQuery = appendQuery;
var getToolTipPoints = function (toolTip, popUp) {
    if (popUp.y2 >= toolTip.y2 && popUp.y1 <= toolTip.y1)
        return [popUp.topRight, toolTip.topRight, toolTip.botRight, popUp.botRight];
    if (popUp.y2 <= toolTip.y2)
        return [popUp.topRight, toolTip.topRight, toolTip.botLeft, popUp.botLeft];
    return [popUp.topLeft, toolTip.topLeft, toolTip.botRight, popUp.botRight];
};
exports.getToolTipPoints = getToolTipPoints;
var filterFalsy = function (array) {
    return array.filter(function (elem) { return elem; });
};
exports.filterFalsy = filterFalsy;
function getBlankCoors(withZ) {
    if (withZ === void 0) { withZ = false; }
    var withoutZ = { x: 0, y: 0 };
    return withZ ? __assign(__assign({}, withoutZ), { z: 0 }) : withoutZ;
}
exports.getBlankCoors = getBlankCoors;
function isBrowser(browserToMatch) {
    return (0, exports.arrayify)(browserToMatch).some(function (browser) { return navigator.userAgent.includes(browser); });
}
exports.isBrowser = isBrowser;
exports.TO_DEG = 180 / Math.PI;
var getIsMobile = function () { return window.innerWidth <= breakpoints_1.default.l; };
exports.getIsMobile = getIsMobile;
