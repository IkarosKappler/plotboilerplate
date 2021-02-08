"use strict";
/**
 * @author Original from Martin Sojka. Ported to TypesScript by Ikaros Kappler
 * @date   2020-11-10
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContrastColor = void 0;
const Color_1 = require("../datastructures/Color");
const BLACK = Color_1.Color.makeRGB(0, 0, 0);
const WHITE = Color_1.Color.makeRGB(255, 255, 255);
/**
 * Contrast color algorithm by Martin Sojka's.
 * Found at
 *    https://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y/38542#38542
 *
 * @requires Color
 */
const getContrastColor = (color) => {
    // r,g,b in [0..1]
    const gamma = 2.2;
    const L = 0.2126 * Math.pow(color.r, gamma)
        + 0.7152 * Math.pow(color.g, gamma)
        + 0.0722 * Math.pow(color.b, gamma);
    const use_black = (L > Math.pow(0.5, gamma));
    // console.log( 'use_black', use_black );
    return use_black ? BLACK : WHITE;
};
exports.getContrastColor = getContrastColor;
//# sourceMappingURL=getContrastColor.js.map