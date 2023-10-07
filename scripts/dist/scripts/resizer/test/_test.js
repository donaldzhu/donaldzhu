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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const generatePromiseFn = (ms) => () => {
    return new Promise(resolve => setTimeout(() => resolve(ms), ms));
};
const promiseFn1 = generatePromiseFn(100);
const promiseFn2 = generatePromiseFn(500);
const promiseFn3 = generatePromiseFn(200);
const promiseFns = [promiseFn1, promiseFn2, promiseFn3];
const mapPromises = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    const promisify = (promiseLike) => Promise.resolve(promiseLike);
    return yield new Promise(resolve => {
        const run = (i) => {
            const promise = promisify(callback(array[i], i, array));
            promise.then(awaitedValue => {
                results.push(awaitedValue);
                if (!array[i + 1])
                    return resolve(results);
                run(i + 1);
            });
        };
        run(0);
    });
});
const mapPromises2 = (array, callback) => { var _a, array_1, array_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var _b, e_1, _c, _d;
    const results = [];
    let i = 0;
    try {
        for (_a = true, array_1 = __asyncValues(array); array_1_1 = yield array_1.next(), _b = array_1_1.done, !_b; _a = true) {
            _d = array_1_1.value;
            _a = false;
            const value = _d;
            results.push(yield callback(value, i, array));
            i++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_a && !_b && (_c = array_1.return)) yield _c.call(array_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return results;
}); };
mapPromises2(promiseFns, (fn) => __awaiter(void 0, void 0, void 0, function* () { return console.log(yield fn()); }));
