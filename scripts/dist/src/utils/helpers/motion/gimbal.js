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
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var MathUtils_1 = require("three/src/math/MathUtils");
var commonUtils_1 = require("../../commonUtils");
var Gimbal = (function () {
    function Gimbal() {
        var _a, _b;
        this.quaternion = this.createSeparate(function () { return new THREE.Quaternion(); });
        this.quatOrigin = this.createSeparate(function () { return new THREE.Quaternion(); });
        this.rotation = this.createSeparate(function () { return new THREE.Object3D(); });
        this.data = {
            beta: 0,
            gamma: 0,
            alpha: 0
        };
        this.needsUpdate = false;
        this.recalRequested = false;
        this.eulerOrigin = new THREE.Euler((0, MathUtils_1.degToRad)(90), (0, MathUtils_1.degToRad)(180), (0, MathUtils_1.degToRad)((_b = 180 + ((_a = screen === null || screen === void 0 ? void 0 : screen.orientation) === null || _a === void 0 ? void 0 : _a.angle)) !== null && _b !== void 0 ? _b : 0));
    }
    Gimbal.prototype.performRecalibration = function (axes) {
        var rotation = this.rotation[axes];
        var quatOrigin = this.quatOrigin[axes];
        rotation.setRotationFromEuler(this.eulerOrigin);
        this.rotate(axes);
        quatOrigin.copy(rotation.quaternion);
        quatOrigin.invert();
    };
    Gimbal.prototype.onSensorMove = function (event) {
        var _a, _b, _c;
        this.data.beta = (_a = event.beta) !== null && _a !== void 0 ? _a : 0;
        this.data.gamma = (_b = event.gamma) !== null && _b !== void 0 ? _b : 0;
        this.data.alpha = (_c = event.alpha) !== null && _c !== void 0 ? _c : 0;
        this.needsUpdate = true;
        if (!this.recalRequested)
            return;
        this.performRecalibration('xy');
        this.performRecalibration('z');
        this.recalRequested = false;
    };
    Gimbal.prototype.recalibrate = function () {
        this.recalRequested = true;
    };
    Gimbal.prototype.update = function () {
        if (!this.needsUpdate)
            return;
        this.updateAxes('xy');
        this.updateAxes('z');
        this.needsUpdate = false;
    };
    Gimbal.prototype.updateAxes = function (axes) {
        var rotation = this.rotation[axes];
        var quatOrigin = this.quatOrigin[axes];
        var quaternion = this.quaternion[axes];
        rotation.setRotationFromEuler(this.eulerOrigin);
        rotation.applyQuaternion(quatOrigin);
        this.rotate(axes);
        quaternion.copy(rotation.quaternion);
        quaternion.invert();
    };
    Gimbal.prototype.rotate = function (axes) {
        var rotation = this.rotation[axes];
        if (axes === 'xy') {
            rotation.rotateX((0, MathUtils_1.degToRad)(this.data.beta));
            rotation.rotateY((0, MathUtils_1.degToRad)(this.data.gamma));
        }
        else {
            rotation.rotateY((0, MathUtils_1.degToRad)(this.data.gamma));
            rotation.rotateZ((0, MathUtils_1.degToRad)(this.data.alpha));
        }
    };
    Gimbal.prototype.createSeparate = function (callback) {
        return {
            xy: callback(),
            z: callback()
        };
    };
    Object.defineProperty(Gimbal.prototype, "euler", {
        get: function () {
            var xyEuler = new THREE.Euler().setFromQuaternion(this.quaternion.xy, 'XZY');
            var zEuler = new THREE.Euler().setFromQuaternion(this.quaternion.z, 'ZYX');
            return {
                x: xyEuler.z * commonUtils_1.TO_DEG,
                y: -(xyEuler.x - Math.PI / 2) * commonUtils_1.TO_DEG,
                z: zEuler.z * commonUtils_1.TO_DEG
            };
        },
        enumerable: false,
        configurable: true
    });
    return Gimbal;
}());
exports.default = Gimbal;
