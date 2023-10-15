"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var commonUtils_1 = require("../commonUtils");
var sizeUtils_1 = require("../sizeUtils");
var Size = (function () {
    function Size(config) {
        var _a, _b, _c;
        var remFactor = (0, sizeUtils_1.getRem)();
        if (typeof config === 'number') {
            this.vw = 0;
            this.vh = 0;
            this.rem = config / remFactor;
        }
        else {
            this.vw = (_a = config.vw) !== null && _a !== void 0 ? _a : 0;
            this.vh = (_b = config.vh) !== null && _b !== void 0 ? _b : 0;
            this.rem = (_c = config.rem) !== null && _c !== void 0 ? _c : 0;
        }
    }
    Size.prototype.add = function (addend) {
        return this.calcWithSize(addend, function (a, b) { return a + b; });
    };
    Size.prototype.sub = function (subtrahend) {
        return this.calcWithSize(subtrahend, function (a, b) { return a - b; });
    };
    Size.prototype.mult = function (factor) {
        return this.calcWithNum(factor, function (a, b) { return a * b; });
    };
    Size.prototype.div = function (dividend) {
        return this.calcWithNum(dividend, function (a, b) { return a / b; });
    };
    Size.prototype.calcWithSize = function (targetSize, operation) {
        return new Size({
            vw: operation(this.vw, targetSize.vw),
            vh: operation(this.vh, targetSize.vh),
            rem: operation(this.rem, targetSize.rem)
        });
    };
    Size.prototype.calcWithNum = function (targetNumber, operation) {
        return new Size({
            vw: operation(this.vw, targetNumber),
            vh: operation(this.vh, targetNumber),
            rem: operation(this.rem, targetNumber)
        });
    };
    Object.defineProperty(Size.prototype, "css", {
        get: function () {
            var _this = this;
            var units = ["vw", "vh", "rem"];
            var addends = (0, commonUtils_1.filterFalsy)(units.map(function (unit) { return _this.returnUnit(unit); }));
            return "calc(".concat(addends.join(' + '), ")");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "value", {
        get: function () {
            return lodash_1.default.round((0, sizeUtils_1.getVw)(this.vw) + (0, sizeUtils_1.getVh)(this.vh) + (0, sizeUtils_1.getRem)(this.rem), 3);
        },
        enumerable: false,
        configurable: true
    });
    Size.prototype.returnUnit = function (unit) {
        return (0, commonUtils_1.validateString)(this[unit], this[unit] + unit);
    };
    Size.subFromFullWidth = function (subtrahend) {
        return new Size({ vw: 100 }).sub(subtrahend);
    };
    Size.subFromFullHeight = function (subtrahend) {
        return new Size({ vh: 100 }).sub(subtrahend);
    };
    return Size;
}());
exports.default = Size;
