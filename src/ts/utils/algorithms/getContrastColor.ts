/**
 * @author Original from Martin Sojka. Ported to TypesScript by Ikaros Kappler
 * @date   2020-11-10
 */

import { Color } from "../datastructures/Color";


const BLACK = Color.makeRGB( 0, 0, 0 );
const WHITE = Color.makeRGB( 255, 255, 255 );


/**
 * Contrast color algorithm by Martin Sojka's.
 * Found at
 *    https://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y/38542#38542
 *
 * @requires Color
 */
export const getContrastColor = ( color:Color ) : Color => {
    // r,g,b in [0..1]
    const gamma:number = 2.2;
    const L:number =
	0.2126 * Math.pow( color.r, gamma )
	+ 0.7152 * Math.pow( color.g, gamma )
	+ 0.0722 * Math.pow( color.b, gamma );
    const use_black:boolean = ( L > Math.pow( 0.5, gamma ) );
    // console.log( 'use_black', use_black );
    return use_black ? BLACK : WHITE;
};
