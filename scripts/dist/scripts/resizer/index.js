"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var resize_1 = __importDefault(require("./resize"));
var config = {
    resizeThumbnails: true,
    resizeWork: true,
    includePages: [],
    includeBreakpts: [],
};
(0, resize_1.default)(config);
