/**
 * An equivalent of lodash.array_fill(...).
 *
 * @author Ikaros Kappler
 * @date 2020-10-23
 * @version 1.0.0
 **/
export const arrayFill = (count, initialValue) => {
    const arr = Array(count);
    for (var i = 0; i < count; i++)
        arr[i] = initialValue;
    return arr;
};
//# sourceMappingURL=arrayFill.js.map