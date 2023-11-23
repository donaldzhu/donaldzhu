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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMobilePhysicsSettings = exports.DEFAULT_SETTING = exports.SPACE_DELIMITER = exports.VectorDrawMethod = exports.X_HEIGHT = void 0;
var easing = __importStar(require("easing-utils"));
var lodash_1 = __importDefault(require("lodash"));
var commonUtils_1 = require("../../../utils/commonUtils");
var size_1 = __importDefault(require("../../../utils/helpers/size"));
var sizeUtils_1 = require("../../../utils/sizeUtils");
var sizes_1 = require("../../../styles/sizes");
var p5Utils_1 = require("../../../utils/p5Utils");
var Axes;
(function (Axes) {
    Axes["x"] = "x";
    Axes["y"] = "y";
})(Axes || (Axes = {}));
exports.X_HEIGHT = 44;
var VectorDrawMethod;
(function (VectorDrawMethod) {
    VectorDrawMethod["DrawLinks"] = "drawLinks";
    VectorDrawMethod["DrawPoints"] = "drawPoints";
    VectorDrawMethod["DrawVolume"] = "drawVolume";
})(VectorDrawMethod || (exports.VectorDrawMethod = VectorDrawMethod = {}));
exports.SPACE_DELIMITER = ' ';
exports.DEFAULT_SETTING = {
    x: 0,
    y: 0,
    w: undefined,
    scale: new size_1.default(1),
    position: [1, 1],
    align: 1,
    isMobile: false,
    spaceWidth: new size_1.default(25),
    tracking: new size_1.default(3),
    leading: new size_1.default(85),
    drawingSequence: [],
    maxStretch: 4,
    glyphWeight: new size_1.default(1),
    glyphColor: 0,
    linkWeight: new size_1.default(1),
    linkColor: 0,
    pointWeight: new size_1.default(1),
    pointSize: new size_1.default(5),
    pointFill: 0,
    pointColor: 0,
    volumeWeight: new size_1.default(1),
    volumeColor: 0,
    correctVolumeStroke: false,
    easing: "linear",
    noMap: false,
    squareMap: true,
    mapFunction: function (stillVector, mouseVector) {
        var _this = this;
        var results = (0, commonUtils_1.getBlankCoors)(false);
        var distVector = mouseVector.sub(('mouseOrigin' in this && this.mouseOrigin) ?
            this.mouseOrigin : stillVector);
        var ranges = {
            x: [0, (0, sizeUtils_1.getVw)()],
            y: [0, this.squareMap ? (0, sizeUtils_1.getVw)() : (0, sizeUtils_1.getVh)()],
        };
        (0, commonUtils_1.loopObject)(Axes, function (axis) {
            var dist = distVector[axis];
            var _a = ranges[axis], min = _a[0], max = _a[1];
            var eased = easing[_this.easing](Math.abs(dist) / (max - min));
            var maxStretch = typeof _this.maxStretch === 'object' ? _this.maxStretch[axis] : _this.maxStretch;
            results[axis] = stillVector[axis] +
                (0, commonUtils_1.map)(eased, 0, 1, 0, maxStretch * _this.scale.value) * Math.sign(dist);
        });
        return results;
    },
    mapMotionFunction: function (rotationVector, accelVector, rollingAccelFilter, bodies, engine, minFrictionAir, debug) {
        var _this = this;
        var _a;
        var x = rotationVector.x, y = rotationVector.y;
        var unmappedValues = {
            x: x,
            y: (90 - Math.abs(Math.abs((y % 180)) - 90)) *
                (y < 0 || y > 180 ? -1 : 1)
        };
        var dist = Math.hypot(bodies.constraint.pointA.x - bodies.active.position.x, bodies.constraint.pointA.y - bodies.active.position.y);
        var positionMax = 5;
        var positionFriction = (0, commonUtils_1.map)(Math.min(dist, positionMax), positionMax, 0, 0, 0.6);
        var accelMax = 10;
        var accelFriction = (0, commonUtils_1.map)(Math.min((_a = rollingAccelFilter.mean) !== null && _a !== void 0 ? _a : 0, accelMax), 0, accelMax, 0, 0.25);
        rollingAccelFilter.add(Math.max(Math.abs(accelVector.x), Math.abs(accelVector.y)));
        Object.assign(engine.gravity, (0, commonUtils_1.mapObject)(unmappedValues, function (axis, unmapped) {
            var unfiltered = unmapped / 90;
            var eased = easing[_this.easing](Math.abs(unfiltered));
            var acceleration = (0, commonUtils_1.map)(Math.abs(unmapped), 90, 0) * accelVector[axis];
            bodies.active.frictionAir = accelFriction + positionFriction + minFrictionAir;
            return acceleration * (axis === 'y' ? -1 : 1) * 0.675 +
                eased * Math.sign(unfiltered) * sizes_1.sketchSizes.mobile.main.physics.gravity.value;
        }));
        if (debug === null || debug === void 0 ? void 0 : debug.enabled) {
            var p5_1 = debug.p5, enabled = debug.enabled;
            if (p5_1 && enabled)
                (0, p5Utils_1.wrapDrawingContext)(p5_1, function () {
                    if (debug.name === 'W') {
                    }
                });
        }
        return bodies.active.position;
    }
};
var createMobilePhysicsSettings = function () { return ({
    active: {
        density: 5,
        frictionAir: lodash_1.default.random(0.0125, 0.03, true),
        collisionFilter: { group: -1 }
    },
    constraint: {
        length: 0.01,
        damping: lodash_1.default.random(0.0125, 0.175, true),
        stiffness: lodash_1.default.random(0.01, 0.0125, true),
    }
}); };
exports.createMobilePhysicsSettings = createMobilePhysicsSettings;
