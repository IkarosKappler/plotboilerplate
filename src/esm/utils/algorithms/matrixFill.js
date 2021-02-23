/**
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/
import { arrayFill } from "./arrayFill";
/**
 * A matrix-fill helper function. Equivalent of lodash.array_fill(...).
 */
export const matrixFill = (countA, countB, initialValue) => {
    const arr = Array(countA);
    for (var i = 0; i < countA; i++) {
        arr[i] = arrayFill(countB, initialValue);
    }
    return arr;
};
//# sourceMappingURL=matrixFill.js.map