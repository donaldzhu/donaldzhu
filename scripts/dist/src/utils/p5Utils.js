"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePhysicsConfig = exports.wrapDrawingContext = exports.mousePosition = exports.intersectTwoCircles = exports.styleDashedRect = exports.parseVector = exports.P5Event = void 0;
var colors_1 = __importDefault(require("../styles/colors"));
var sizes_1 = require("../styles/sizes");
var commonUtils_1 = require("./commonUtils");
var size_1 = __importDefault(require("./helpers/size"));
var P5Event;
(function (P5Event) {
    P5Event["draw"] = "draw";
    P5Event["windowResized"] = "windowResized";
    P5Event["mouseClicked"] = "mouseClicked";
    P5Event["doubleClicked"] = "doubleClicked";
    P5Event["mouseMoved"] = "mouseMoved";
    P5Event["mousePressed"] = "mousePressed";
    P5Event["mouseWheel"] = "mouseWheel";
    P5Event["mouseDragged"] = "mouseDragged";
    P5Event["mouseReleased"] = "mouseReleased";
    P5Event["keyPressed"] = "keyPressed";
    P5Event["keyReleased"] = "keyReleased";
    P5Event["keyTyped"] = "keyTyped";
    P5Event["touchStarted"] = "touchStarted";
    P5Event["touchMoved"] = "touchMoved";
    P5Event["touchEnded"] = "touchEnded";
    P5Event["deviceMoved"] = "deviceMoved";
    P5Event["deviceTurned"] = "deviceTurned";
    P5Event["deviceShaken"] = "deviceShaken";
})(P5Event || (exports.P5Event = P5Event = {}));
var parseVector = function (vector) { return [vector.x, vector.y]; };
exports.parseVector = parseVector;
var styleDashedRect = function (p5) {
    p5.drawingContext.setLineDash((0, commonUtils_1.repeat)(2, sizes_1.sketchSizes.line.dash.value));
    p5.noFill();
    p5.stroke(colors_1.default.dashLine);
    p5.strokeWeight(sizes_1.sketchSizes.line.weight.value);
};
exports.styleDashedRect = styleDashedRect;
var intersectTwoCircles = function (center1, r1, center2, r2) {
    var x1 = center1.x, y1 = center1.y;
    var x2 = center2.x, y2 = center2.y;
    var R = center1.dist(center2);
    if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2))
        return [];
    var R2 = Math.pow(R, 2);
    var R4 = Math.pow(R, 4);
    var a = (Math.pow(r1, 2) - Math.pow(r2, 2)) / (2 * R2);
    var rSqrDiff = (Math.pow(r1, 2) - Math.pow(r2, 2));
    var c = Math.sqrt(2 * (Math.pow(r1, 2) + Math.pow(r2, 2)) / R2 -
        (Math.pow(rSqrDiff, 2)) / R4 - 1);
    var fx = (x1 + x2) / 2 + a * (x2 - x1);
    var gx = c * (y2 - y1) / 2;
    var ix1 = fx + gx;
    var ix2 = fx - gx;
    var fy = (y1 + y2) / 2 + a * (y2 - y1);
    var gy = c * (x1 - x2) / 2;
    var iy1 = fy + gy;
    var iy2 = fy - gy;
    return [[ix1, iy1], [ix2, iy2]];
};
exports.intersectTwoCircles = intersectTwoCircles;
var mousePosition = function (p5) { return [p5.mouseX, p5.mouseY]; };
exports.mousePosition = mousePosition;
var wrapDrawingContext = function (p5, callback) {
    p5.push();
    callback();
    p5.pop();
};
exports.wrapDrawingContext = wrapDrawingContext;
var parsePhysicsConfig = function (config) {
    return (0, commonUtils_1.mapObject)(config, function (_, sizeLike) {
        return sizeLike instanceof size_1.default ? sizeLike.value : sizeLike;
    });
};
exports.parsePhysicsConfig = parsePhysicsConfig;
