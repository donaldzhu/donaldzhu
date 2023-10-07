"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const lodash_1 = __importDefault(require("lodash"));
const resizer_1 = __importDefault(require("../resizer"));
const utils_1 = require("../utils");
const constants_1 = require("./constants");
const createBreakptMap = (mapObj, callback) => {
    const map = {
        ["desktopFallback"]: undefined,
        ["l"]: undefined,
        ["xl"]: undefined,
        ["xxl"]: undefined
    };
    (0, utils_1.mapObject)(mapObj, (breakpt, mapValue) => {
        map[breakpt] = callback(breakpt, mapValue);
    });
    return map;
};
const getNoSizesError = (sizes, sizeType) => new Error(`Breakpoint size has no ${sizeType} sizes: ${sizes[sizeType]}`);
const getBreakptConfig = (breakpt, sizes, debugOnly) => ({
    breakpt,
    breakptWidth: constants_1.BREAKPT_WIDTHS[breakpt],
    sizes,
    blur: breakpt === "desktopFallback" ? constants_1.BLUR : undefined,
    exclude: breakpt === "desktopFallback" ? ["video"] : undefined,
    debugOnly
});
const getResizeCallback = (array, rootPath) => (fileName, size) => array
    .push([
    fileName.replace(new RegExp(`^${rootPath}/`), ''),
    [size.width, size.height]
]);
const sizesFolder = (0, utils_1.joinPaths)(constants_1.ROOT_PATH, constants_1.SIZE_FOLDER);
const workFolder = constants_1.SRC_WORK_PATH;
const destination = (0, utils_1.joinPaths)(constants_1.ROOT_PATH, constants_1.DESTINATION_ROOT);
const resize = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const { resizeThumbnails, resizeWork, includePages, includeBreakpts } = Object.assign(Object.assign({}, constants_1.DEFAULT_CONFIG), config);
    const breakptWidths = includeBreakpts.length ? lodash_1.default.pick(constants_1.BREAKPT_WIDTHS, includeBreakpts) : constants_1.BREAKPT_WIDTHS;
    const allBreakptSizes = createBreakptMap(breakptWidths, breakpt => (0, utils_1.readJsonSync)((0, utils_1.joinPaths)(sizesFolder, `${breakpt}.json`)));
    const pageSizes = {};
    (0, utils_1.mapObject)(allBreakptSizes, (breakpt, allSizes) => {
        const { work } = allSizes;
        if (!work || Array.isArray(work))
            throw getNoSizesError(allSizes, 'work');
        (0, utils_1.mapObject)(work, (pageId, sizes) => (pageSizes[pageId] || (pageSizes[pageId] = {}))[breakpt] = sizes);
    });
    const nativeDimensions = {};
    const thumbnailConfigs = createBreakptMap(allBreakptSizes, (breakpt, sizes) => {
        const { thumbnails } = sizes;
        if (!thumbnails || !Array.isArray(thumbnails))
            throw getNoSizesError(sizes, 'thumbnails');
        return getBreakptConfig(breakpt, [thumbnails[0]], !resizeThumbnails);
    });
    const thumbnails = [];
    yield new resizer_1.default(constants_1.SRC_THUMBNAIL_PATH, Object.values(thumbnailConfigs), {
        destination: (0, utils_1.joinPaths)(destination, constants_1.THUMBNAIL_FOLDER),
        callback: getResizeCallback(thumbnails, constants_1.SRC_THUMBNAIL_PATH)
    }).init();
    nativeDimensions.thumbnails = thumbnails;
    const work = {};
    yield (0, utils_1.mapObjectPromises)(pageSizes, (pageId, breakptSizes) => __awaiter(void 0, void 0, void 0, function* () {
        const includePage = !includePages.length || includePages.includes(pageId);
        const debugOnly = !resizeWork || !includePage;
        const pageConfigs = createBreakptMap(breakptSizes, (breakpt, sizes) => getBreakptConfig(breakpt, sizes, debugOnly));
        const maxConfig = {
            breakpt: constants_1.MAX_FOLDER,
            sizes: pageConfigs.xxl.sizes,
            noResize: true,
            maxDimension: 2500 * 3000,
            exclude: ["poster"],
            debugOnly
        };
        const workPage = [];
        yield new resizer_1.default((0, utils_1.joinPaths)(workFolder, pageId), [...Object.values(pageConfigs), maxConfig], {
            destination: (0, utils_1.joinPaths)(destination, constants_1.WORK_FOLDER, pageId),
            callback: getResizeCallback(workPage, (0, utils_1.joinPaths)(constants_1.SRC_WORK_PATH, pageId))
        }).init();
        work[pageId] = workPage;
    }));
    nativeDimensions.work = work;
    fs_1.default.writeFileSync(constants_1.NATIVE_DIMENSIONS_PATH, JSON.stringify(nativeDimensions));
});
exports.default = resize;
