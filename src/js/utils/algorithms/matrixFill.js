"use strict";
/**
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrixFill = void 0;
const arrayFill_1 = require("./arrayFill");
/**
 * A matrix-fill helper function. Equivalent of lodash.array_fill(...).
 */
const matrixFill = (countA, countB, initialValue) => {
    const arr = Array(countA);
    for (var i = 0; i < countA; i++) {
        arr[i] = arrayFill_1.arrayFill(countB, initialValue);
    }
    return arr;
};
exports.matrixFill = matrixFill;
//# sourceMappingURL=matrixFill.js.map