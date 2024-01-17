"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var resize_1 = __importDefault(require("./resize"));
var config = {
    resizeThumbnails: false,
    resizeWork: false,
    includePages: ['i-voted'],
    includeBreakpts: [],
};
(0, resize_1.default)(constants_1.Device.Desktop, config);
