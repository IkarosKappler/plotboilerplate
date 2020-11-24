/**
 * Contrast color algorithm by Martin Sojka's.
 * Found at
 *    https://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y/38542#38542
 *
 * Ported to TypesScript by Ikaros Kappler
 * @date 2020-11-10
 */
import { Color } from "../datastructures/Color";
export declare const getContrastColor: (color: Color) => Color;
