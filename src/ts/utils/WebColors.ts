/**
 * A set of beautiful web colors (I know, beauty is in the eye of the beholder).
 *
 * I found this color chart with 11 colors and think it is somewhat nice
 *    https://www.pinterest.com/pin/229965124706497134/
 *
 * @requires Color
 *
 * @author   Ikaros Kappler
 * @version  1.0.0
 * @date     2018-11-10
 * @modified 2020-10-23 Ported to Typescript.
 **/

import { Color } from "./datastructures/Color";

// This is the original order (like in the image).
// But if you want to get clearly distinct 'random' colors in a web app, then
// the mix below is better.
export const WebColors : Array<Color> = [
    Color.makeRGB(255,67,55),  // Red
    Color.makeRGB(232,31,100), // Pink
    Color.makeRGB(156,39,175), // Purple
    Color.makeRGB(103,59,184), // Deep Purple
    Color.makeRGB(64,81,181),  // Indigo
    Color.makeRGB(35,151,245), // Blue
    Color.makeRGB(6,170,245),  // Light Blue
    Color.makeRGB(3,189,214),  // Cyan
    Color.makeRGB(1,150,137),  // Teal
    Color.makeRGB(77,175,82),  // Green
    Color.makeRGB(141,195,67)  // Light Green
];

/*
export const WebColors = [
    Color.makeRGB(1,150,137),  // Teal
    Color.makeRGB(255,67,55),  // Red
    Color.makeRGB(6,170,245),  // Light Blue
    Color.makeRGB(64,81,181),  // Indigo
    Color.makeRGB(232,31,100), // Pink
    Color.makeRGB(77,175,82),  // Green
    Color.makeRGB(156,39,175), // Purple
    Color.makeRGB(141,195,67), // Light Green
    Color.makeRGB(103,59,184), // Deep Purple
    Color.makeRGB(3,189,214),  // Cyan
    Color.makeRGB(35,151,245)  // Blue
];
*/

export const shuffleWebColors = ( order: Array<number> ) => {
    const result : Array<Color> = Array( order.length );
    for( var i = 0; i < order.length; i++ ) {
	result[i] = WebColors[ order[i] % WebColors.length ];
    }
    return result;
};
