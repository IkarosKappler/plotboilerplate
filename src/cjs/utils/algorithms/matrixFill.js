"use strict";
/**
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrixFill = void 0;
var arrayFill_1 = require("./arrayFill");
/**
 * A matrix-fill helper function. Equivalent of lodash.array_fill(...).
 */
var matrixFill = function (countA, countB, initialValue) {
    var arr = Array(countA);
    for (var i = 0; i < countA; i++) {
        arr[i] = (0, arrayFill_1.arrayFill)(countB, initialValue);
    }
    return arr;
};
exports.matrixFill = matrixFill;
//# sourceMappingURL=matrixFill.js.map