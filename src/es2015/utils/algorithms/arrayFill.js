"use strict";
/**
 * An equivalent of lodash.array_fill(...).
 *
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFill = void 0;
const arrayFill = (count, initialValue) => {
    const arr = Array(count);
    for (var i = 0; i < count; i++)
        arr[i] = initialValue;
    return arr;
};
exports.arrayFill = arrayFill;
//# sourceMappingURL=arrayFill.js.map