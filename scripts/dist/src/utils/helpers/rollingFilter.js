"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var RollingFilter = (function () {
    function RollingFilter(size) {
        this.values = [];
        this._size = size;
    }
    RollingFilter.prototype.add = function (newValue) {
        this.values.push(newValue);
        this.trim();
    };
    RollingFilter.prototype.trim = function () {
        while (this.values.length > this._size)
            this.values.shift();
    };
    Object.defineProperty(RollingFilter.prototype, "sum", {
        get: function () {
            return lodash_1.default.sum(this.values);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollingFilter.prototype, "mean", {
        get: function () {
            return !this.values.length ? undefined : (this.sum / this.values.length);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollingFilter.prototype, "max", {
        get: function () {
            return lodash_1.default.max(this.values);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollingFilter.prototype, "min", {
        get: function () {
            return lodash_1.default.min(this.values);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollingFilter.prototype, "size", {
        get: function () {
            return this.size;
        },
        set: function (newSize) {
            this._size = newSize;
            this.trim();
        },
        enumerable: false,
        configurable: true
    });
    return RollingFilter;
}());
exports.default = RollingFilter;
