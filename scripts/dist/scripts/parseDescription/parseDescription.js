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
const promises_1 = __importDefault(require("fs/promises"));
const utils_1 = require("../utils");
const chalk_1 = __importDefault(require("chalk"));
const workDataPath = 'src/data/work';
const results = {};
let stringifiedResults;
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, utils_1.forEachFile)(workDataPath + '/descriptions', (fileName, fileData) => {
        results[fileName.replace('.html', '')] = fileData;
    });
    stringifiedResults = JSON.stringify(results);
    yield promises_1.default.writeFile(workDataPath + '/workDescriptions.json', stringifiedResults);
    console.log(chalk_1.default.cyan('[parseDescription] Descriptions parsed!'));
});
run();
