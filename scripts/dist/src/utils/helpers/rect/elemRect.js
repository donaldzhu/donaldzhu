"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeUtils_1 = require("../../typeUtils");
var rect_1 = __importDefault(require("./rect"));
var ElemRect = (function (_super) {
    __extends(ElemRect, _super);
    function ElemRect(ref, padding, isRelative) {
        var _this = _super.call(this, { padding: padding }) || this;
        _this.ref = ref;
        _this.isRelative = isRelative;
        return _this;
    }
    Object.defineProperty(ElemRect.prototype, "elem", {
        get: function () {
            return this.ref.current;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElemRect.prototype, "elemBounds", {
        get: function () {
            return this.elem ? this.elem.getBoundingClientRect() : undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElemRect.prototype, "x", {
        get: function () {
            return this.elemBounds ? (this.isRelative ? 0 : this.elemBounds.x) - this.padding.x : NaN;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElemRect.prototype, "y", {
        get: function () {
            return this.elemBounds ? (this.isRelative ? 0 : this.elemBounds.y) - this.padding.y : NaN;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElemRect.prototype, "w", {
        get: function () {
            return this.elemBounds ? this.elemBounds.width + this.padding.x * 2 : NaN;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElemRect.prototype, "h", {
        get: function () {
            return this.elemBounds ? this.elemBounds.height + this.padding.y * 2 : NaN;
        },
        enumerable: false,
        configurable: true
    });
    ElemRect.createUpdated = function (elemRect, ref, padding, isRelative) {
        if (!(0, typeUtils_1.validateRef)(ref))
            return;
        if (!elemRect || (elemRect.ref.current !== ref.current))
            return new ElemRect(ref, padding, isRelative);
        else
            return elemRect;
    };
    return ElemRect;
}(rect_1.default));
exports.default = ElemRect;
