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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var react_1 = require("react");
var reactUtils_1 = require("../utils/reactUtils");
var gimbal_1 = __importDefault(require("../utils/helpers/motion/gimbal"));
var hasDeviceEvent = ('DeviceOrientationEvent' in window && 'DeviceMotionEvent' in window);
var useMotion = function () {
    var getInitialState = function () {
        if (!hasDeviceEvent)
            return {
                isUsable: false,
                needsPermission: false
            };
        if ('requestPermission' in DeviceMotionEvent &&
            typeof DeviceMotionEvent.requestPermission === 'function' &&
            'requestPermission' in DeviceOrientationEvent &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            return {
                isUsable: undefined,
                needsPermission: true
            };
        }
        return {
            isUsable: undefined,
            needsPermission: false
        };
    };
    var _a = (0, react_1.useState)(getInitialState()), motionSettings = _a[0], setMotionSettings = _a[1];
    var gimbalRef = (0, react_1.useRef)(null);
    var getPermission = motionSettings.isUsable !== false ?
        (motionSettings.needsPermission ?
            function () {
                var promise = DeviceMotionEvent.requestPermission();
                promise.then(function (value) {
                    setMotionSettings({
                        isUsable: value === 'granted',
                        needsPermission: false
                    });
                });
                return promise;
            } : function () { return 'granted'; }) : null;
    (0, react_1.useEffect)(function () {
        var setUsable = lodash_1.default.once(function () { return setMotionSettings(function (prev) { return (__assign(__assign({}, prev), { isUsable: true })); }); });
        var gimbal = gimbalRef.current = new gimbal_1.default();
        return (0, reactUtils_1.addEventListener)(window, 'deviceorientation', function (e) {
            gimbal.onSensorMove(e);
            setUsable();
        }, false);
    }, []);
    return {
        motionSettings: motionSettings,
        gimbalRef: gimbalRef,
        getPermission: getPermission
    };
};
exports.default = useMotion;
