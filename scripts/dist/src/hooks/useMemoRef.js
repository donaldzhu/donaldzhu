"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useMemoRef = function (factory, dependencies) {
    if (dependencies === void 0) { dependencies = []; }
    var ref = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        ref.current = factory();
    }, dependencies);
    return ref;
};
exports.default = useMemoRef;
