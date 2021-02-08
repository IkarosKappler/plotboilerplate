/**
 * @author Extended, bugfixed and ported to TypeScript by Ikaros Kappler.
 * @modified 2018-xx-xx Added a clone() function.
 * @modified 2018-xx-xx Allowing leading '#' in the makeHEX() function.
 * @modified 2018-11-28 Fixed the checkHEX() function to accept 000000.
 * @modified 2019-11-18 Added a generic parse(string) function that detects the format.
 * @modified 2020-01-09 Fixed a bug in the parse(string) function. Hex colors with only three elements were considered faulty.
 * @modified 2020-10-23 Ported to Typescript.
 * @modified 2021-02-08 Fixed a lot of es2015 compatibility issues.
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
    constructor();
    /** RGB */
    cssRGB(): string;
    cssRGBA(): string;
    red(): number;
    green(): number;
    blue(): number;
    /** HSL */
    cssHSL(): string;
    cssHSLA(): string;
    hue(): number;
    saturation(): number;
    lightness(): number;
    /** HEX */
    cssHEX(): string;
    /** Transparency */
    alpha(): number;
    /** Modifiers */
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
