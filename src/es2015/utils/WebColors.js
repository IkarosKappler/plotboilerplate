/**
 * @author   Ikaros Kappler
 * @version  1.0.1
 * @date     2018-11-10
 * @modified 2020-10-23 Ported to Typescript.
 * @modified 2020-10-30 Exporting each color under its name globally.
 **/
import { Color } from "./datastructures/Color";
export const Red = Color.makeRGB(255, 67, 55);
export const Pink = Color.makeRGB(232, 31, 100);
export const Purple = Color.makeRGB(156, 39, 175);
export const DeepPurple = Color.makeRGB(103, 59, 184);
export const Indigo = Color.makeRGB(64, 81, 181);
export const Blue = Color.makeRGB(35, 151, 245);
export const LightBlue = Color.makeRGB(6, 170, 245);
export const Cyan = Color.makeRGB(3, 189, 214);
export const Teal = Color.makeRGB(1, 150, 137);
export const Green = Color.makeRGB(77, 175, 82);
export const LightGreen = Color.makeRGB(141, 195, 67);
/**
 * A set of beautiful web colors (I know, beauty is in the eye of the beholder).
 *
 * I found this color chart with 11 colors and think it is somewhat nice
 *    https://www.pinterest.com/pin/229965124706497134/
 *
 * @requires Color
 *
 */
export const WebColors = [
    Red,
    Pink,
    Purple,
    DeepPurple,
    Indigo,
    Blue,
    LightBlue,
    Cyan,
    Teal,
    Green,
    LightGreen
];
/**
 * A helper function to shuffle the colors into a new order.
 */
export const shuffleWebColors = (order) => {
    const result = Array(order.length);
    for (var i = 0; i < order.length; i++) {
        result[i] = WebColors[order[i] % WebColors.length];
    }
    return result;
};
//# sourceMappingURL=WebColors.js.map