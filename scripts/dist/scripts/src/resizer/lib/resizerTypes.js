"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vidExtensionRegex = exports.imgExtensionRegex = exports.vidExportTypes = exports.VidExtension = exports.ImgExtension = void 0;
var ImgExtension;
(function (ImgExtension) {
    ImgExtension["Gif"] = "gif";
    ImgExtension["Webp"] = "webp";
    ImgExtension["Png"] = "png";
})(ImgExtension || (exports.ImgExtension = ImgExtension = {}));
var VidExtension;
(function (VidExtension) {
    VidExtension["Webm"] = "webm";
    VidExtension["Mp4"] = "mp4";
})(VidExtension || (exports.VidExtension = VidExtension = {}));
exports.vidExportTypes = [VidExtension.Webm, VidExtension.Mp4];
exports.imgExtensionRegex = Object.values(ImgExtension).join('|');
exports.vidExtensionRegex = Object.values(VidExtension).join('|');
