"use strict";
/**
 * Randomize a given array in-place.
 *
 * @author Ikaros Kappler
 * @date 2022-10-09
 * @version 1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayShuffle = void 0;
var arrayShuffle = function (arr) {
    arr.sort(function () { return Math.random() - 0.5; });
};
exports.arrayShuffle = arrayShuffle;
//# sourceMappingURL=arrayShuffle.js.map