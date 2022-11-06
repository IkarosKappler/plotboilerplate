/**
 * Randomize a given array in-place.
 *
 * @author Ikaros Kappler
 * @date 2022-10-09
 * @version 1.0.0
 **/
export const arrayShuffle = (arr) => {
    arr.sort(() => Math.random() - 0.5);
};
//# sourceMappingURL=arrayShuffle.js.map