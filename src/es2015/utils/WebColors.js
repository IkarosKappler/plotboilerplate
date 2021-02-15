"use strict";
/**
 * @author   Ikaros Kappler
 * @version  1.0.1
 * @date     2018-11-10
 * @modified 2020-10-23 Ported to Typescript.
 * @modified 2020-10-30 Exporting each color under its name globally.
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleWebColors = exports.WebColors = exports.LightGreen = exports.Green = exports.Teal = exports.Cyan = exports.LightBlue = exports.Blue = exports.Indigo = exports.DeepPurple = exports.Purple = exports.Pink = exports.Red = void 0;
const Color_1 = require("./datastructures/Color");
exports.Red = Color_1.Color.makeRGB(255, 67, 55);
exports.Pink = Color_1.Color.makeRGB(232, 31, 100);
exports.Purple = Color_1.Color.makeRGB(156, 39, 175);
exports.DeepPurple = Color_1.Color.makeRGB(103, 59, 184);
exports.Indigo = Color_1.Color.makeRGB(64, 81, 181);
exports.Blue = Color_1.Color.makeRGB(35, 151, 245);
exports.LightBlue = Color_1.Color.makeRGB(6, 170, 245);
exports.Cyan = Color_1.Color.makeRGB(3, 189, 214);
exports.Teal = Color_1.Color.makeRGB(1, 150, 137);
exports.Green = Color_1.Color.makeRGB(77, 175, 82);
exports.LightGreen = Color_1.Color.makeRGB(141, 195, 67);
/**
 * A set of beautiful web colors (I know, beauty is in the eye of the beholder).
 *
 * I found this color chart with 11 colors and think it is somewhat nice
 *    https://www.pinterest.com/pin/229965124706497134/
 *
 * @requires Color
 *
 */
exports.WebColors = [
    exports.Red,
    exports.Pink,
    exports.Purple,
    exports.DeepPurple,
    exports.Indigo,
    exports.Blue,
    exports.LightBlue,
    exports.Cyan,
    exports.Teal,
    exports.Green,
    exports.LightGreen
];
/**
 * A helper function to shuffle the colors into a new order.
 */
const shuffleWebColors = (order) => {
    const result = Array(order.length);
    for (var i = 0; i < order.length; i++) {
        result[i] = exports.WebColors[order[i] % exports.WebColors.length];
    }
    return result;
};
exports.shuffleWebColors = shuffleWebColors;
//# sourceMappingURL=WebColors.js.map