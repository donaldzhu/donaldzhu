"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var commonUtils_1 = require("../utils/commonUtils");
var p5Utils_1 = require("../utils/p5Utils");
var useGlobalCanvas = function () {
    var entries = (0, commonUtils_1.typedKeys)(p5Utils_1.P5Event);
    var mappedEntries = entries.map(function (e) { return [e, []]; });
    var canvas = Object.fromEntries(mappedEntries);
    return (0, react_1.useRef)(canvas);
};
exports.default = useGlobalCanvas;
