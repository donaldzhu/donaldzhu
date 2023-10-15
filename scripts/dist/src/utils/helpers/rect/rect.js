"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonUtils_1 = require("../../commonUtils");
var p5Utils_1 = require("../../p5Utils");
var Rect = (function () {
    function Rect(_a) {
        var _b = _a.x, x = _b === void 0 ? 0 : _b, _c = _a.y, y = _c === void 0 ? 0 : _c, _d = _a.w, w = _d === void 0 ? 0 : _d, _e = _a.h, h = _e === void 0 ? 0 : _e, _f = _a.padding, padding = _f === void 0 ? [0, 0] : _f;
        var _g;
        var paddingArray = (0, commonUtils_1.arrayify)(padding);
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
        this.padding = {
            x: paddingArray[0],
            y: (_g = paddingArray[1]) !== null && _g !== void 0 ? _g : paddingArray[0]
        };
    }
    Rect.prototype.rectAround = function (p5) {
        var _this = this;
        (0, p5Utils_1.wrapDrawingContext)(p5, function () {
            (0, p5Utils_1.styleDashedRect)(p5);
            p5.rectMode(p5.CORNERS);
            p5.rect.apply(p5, _this.sides);
        });
    };
    Rect.prototype.mouseIsOver = function () {
        var mousePosition = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mousePosition[_i] = arguments[_i];
        }
        var _a = mousePosition.length === 1 ? mousePosition[0] : mousePosition, x = _a[0], y = _a[1];
        var _b = this.sides, x1 = _b[0], y1 = _b[1], x2 = _b[2], y2 = _b[3];
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    };
    Rect.prototype.toScreenCoors = function () {
        var coors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            coors[_i] = arguments[_i];
        }
        var _a = this._parseCoors.apply(this, coors), x = _a[0], y = _a[1];
        return [x + this.x1, y + this.y1];
    };
    Rect.prototype.toRectCoors = function () {
        var coors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            coors[_i] = arguments[_i];
        }
        var _a = this._parseCoors.apply(this, coors), x = _a[0], y = _a[1];
        return [x - this.x1, y - this.y1];
    };
    Rect.prototype._parseCoors = function () {
        var coors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            coors[_i] = arguments[_i];
        }
        return coors.length === 1 ? [coors[0].x, coors[0].y] : coors;
    };
    Object.defineProperty(Rect.prototype, "x", {
        get: function () {
            return this._x - this.padding.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "y", {
        get: function () {
            return this._y - this.padding.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "w", {
        get: function () {
            return this._w + this.padding.x * 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "h", {
        get: function () {
            return this._h + this.padding.y * 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "x1", {
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "y1", {
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "x2", {
        get: function () {
            return this.x1 + this.w;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "y2", {
        get: function () {
            return this.y1 + this.h;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "cx", {
        get: function () {
            return (this.x1 + this.x2) / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "cy", {
        get: function () {
            return (this.y1 + this.y2) / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "topLeft", {
        get: function () {
            return [this.x1, this.y1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "topRight", {
        get: function () {
            return [this.x2, this.y1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "botLeft", {
        get: function () {
            return [this.x1, this.y2];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "botRight", {
        get: function () {
            return [this.x2, this.y2];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "sides", {
        get: function () {
            return [
                this.x1,
                this.y1,
                this.x2,
                this.y2,
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "size", {
        get: function () {
            return [this.w, this.h];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "center", {
        get: function () {
            return [this.cx, this.cy];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "corners", {
        get: function () {
            return [
                this.topLeft,
                this.topRight,
                this.botRight,
                this.botLeft
            ];
        },
        enumerable: false,
        configurable: true
    });
    return Rect;
}());
exports.default = Rect;
