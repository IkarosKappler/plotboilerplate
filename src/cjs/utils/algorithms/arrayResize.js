"use strict";
/**
 * Resize a given array to a desired number of elements by adding or removing some.
 *
 * @author  Ikaros Kappler
 * @date    2024-02-07
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayResize = void 0;
var arrayResize = function (arr, desiredSize, factoryFn) {
    if (arr.length === desiredSize) {
        // No change required
        return;
    }
    while (arr.length < desiredSize) {
        arr.push(factoryFn());
    }
    if (arr.length > desiredSize) {
        arr.splice(desiredSize);
    }
};
exports.arrayResize = arrayResize;
//# sourceMappingURL=arrayResize.js.map