/**
 * Resize a given array to a desired number of elements by adding or removing some.
 *
 * @author  Ikaros Kappler
 * @date    2024-02-07
 * @version 1.0.0
 */
export const arrayResize = (arr, desiredSize, factoryFn) => {
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
//# sourceMappingURL=arrayResize.js.map