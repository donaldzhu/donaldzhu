"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var resizeMobile_1 = __importDefault(require("./resizeMobile"));
var config = {
    resizeThumbnails: true,
    resizeWork: true,
    includePages: [],
    includeBreakpts: [],
};
(0, resizeMobile_1.default)(config);
