/**
 * @author Extended, bugfixed and ported to TypeScript by Ikaros Kappler.
 * @modified 2018-xx-xx Added a clone() function.
 * @modified 2018-xx-xx Allowing leading '#' in the makeHEX() function.
 * @modified 2018-11-28 Fixed the checkHEX() function to accept 000000.
 * @modified 2019-11-18 Added a generic parse(string) function that detects the format.
 * @modified 2020-01-09 Fixed a bug in the parse(string) function. Hex colors with only three elements were considered faulty.
 * @modified 2020-10-23 Ported to Typescript.
 * @modified 2021-02-08 Fixed a lot of es2015 compatibility issues.
 * @modified 2021-02-08 Added basic tsdoc/jsdoc comments.
 * @version 0.0.9
 **/
/**
 * @classdesc A color class, inspired by neolitec's Javascript class.
 *    Original found at
 *      https://gist.github.com/neolitec/1344610
 *    Thanks to neolitec
 */
export declare class Color {
    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    r: number;
    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    g: number;
    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    b: number;
    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    h: number;
    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    s: number;
    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    l: number;
    /**
     * @member {number}
     * @memberof Color
     * @instance
     */
    a: number;
    /**
     * Construct a new color with `r=0 g=0 b=0`.
     *
     * Consider using the `makeHex`, `makeRGB` or `makeHSL` functions.
     *
     * @constructor
     * @instance
     * @memberof Color
     */
    constructor();
    /**
     * Get this color as a CSS `rgb` string.
     *
     * Consult this for details: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     *
     * @method cssRGB
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS rgb string.
     */
    cssRGB(): string;
    /**
     * Get this color as a CSS `rgba` string.
     *
     * Consult this for details: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     *
     * @method cssRGBA
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS rgba string.
     */
    cssRGBA(): string;
    /**
     * Get the red component of this RGB(A)color. This method just returns the `r` color attribute.
     *
     * @method red
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    red(): number;
    /**
    * Get the green component of this RGB(A) color. This method just returns the `g` color attribute.
    *
    * @method green
    * @instance
    * @memberof Color
    * @return {number} A value between 0.0 and 1.0.
    */
    green(): number;
    /**
     * Get the blue component of this RGB(A) color. This method just returns the `b` color attribute.
     *
     * @method blue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    blue(): number;
    /**
     * Get this color as a CSS `hsl` string.
     *
     * @method cssHSL
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsl string.
     */
    cssHSL(): string;
    /**
     * Get this color as a CSS `hsla` string.
     *
     * @method cssHSLA
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsla string.
     */
    cssHSLA(): string;
    /**
     * Get the hue component of this HSL(A) color. This method just returns the `h` color attribute.
     *
     * @method hue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    hue(): number;
    /**
     * Get the saturation component of this HSL(A) color. This method just returns the `s` color attribute.
     *
     * @method saturation
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    saturation(): number;
    /**
     * Get the lightness component of this HSL(A) color. This method just returns the `l` color attribute.
     *
     * @method lightness
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    lightness(): number;
    /**
     * Get this color as a CSS-HEX string (non-alpha): #rrggbb
     *
     * @method cssHEX
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS-HEX string.
     */
    cssHEX(): string;
    /**
     * Get the alpha channel (transparency) of this color.
     *
     * @method alpha
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    alpha(): number;
    saturate(v: string | number): void;
    desaturate(v: string | number): void;
    lighten(v: string | number): void;
    darken(v: string | number): void;
    fadein(v: string | number): void;
    fadeout(v: string | number): void;
    spin(v: string | number): void;
    static makeRGB(...args: any[]): Color;
    static makeHSL(...args: Array<number | string>): Color;
    static makeHEX(value: string): Color;
    /**
     * Parse the given color string. Currently only these formate are recognized: hex, rgb, rgba.
     *
     * @method parse
     * @static
     * @memberof Color
     * @param {string} str - The string representation to parse.
     * @return {Color} The color instance that's represented by the given string.
     */
    static parse(str: string): Color;
    private static Sanitizer;
    private static Validator;
    private static Converter;
    /**
     * Create a clone of this color (RGB).
     *
     * @method clone
     * @instance
     * @memberof Color
     * @return {Color} A clone of this color (in RGB mode).
     */
    clone(): Color;
    /**
     * Interpolate this color on the RGB scale.
     *
     * @method interpolate
     * @instance
     * @memberof Color
     * @param {Color} c - The color to interpolate to.
     * @param {number} t - An interpolation value between 0.0 and 1.0.
     * @return {Color} A clone of this color (in RGB mode).
     */
    interpolate(c: Color, t: number): Color;
}
