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
 * @modified 2021-11-05 Fixing the regex to parse rgba-strings.
 * @modified 2021-11-05 Added return value `this` to all modifier functions (for chaining).
 * @modified 2021-11-07 Changed the behavior of `darken` and `lighten`: the passed value is handled relative now which makes values much easier predictable and makes the change feel more 'natural'.
 * @modified 2021-11-07 Did the same with `saturate` and `desaturate`.
 * @modified 2021-11-07 Did the same with the `fadein` and `fadeout` functions.
 * @modified 2021-11-07 Added setRed, setGreen, setBlue, setHue, setSaturation, setLiminance functions.
 * @modified 2022-05-11 Modified the `clone` function by just copying the numeric calues, not re-calculating the whole color.
 * @modified 2022-05-11 Fixed the `interpolate` function.
 * @modified 2023-01-23 Added `Color.set(Color)` function to set all values (r,g,b,h,s,l,a) simultanoeusly.
 * @modified 2024-03-10 Fixed some NaN type check for Typescript 5 compatibility.
 * @modified 2025-08-08 Fixed an issue in the static `fromRGB` method: values in [0..1] are now correctly reconized (1.0 was excluded).
 * @modified 2025-08-08 Added static color instances (singletons): Color.RED, Color.GOLD, Color.YELLOW, Color.GREEN, Color.LIME_GREEN, Color.BLUE, Color.MEDIUM_BLUE, Color.PURPLE.
 * @modified 2025-09-01 Adding all standard web colors. Source: https://en.wikipedia.org/wiki/Web_colors
 * @modified 2025-09-01 Modifying the Sanitizer.RGB helper method: recognoizing 0 to 255 as valid values (not only 1 to 255).
 * @version 0.0.14
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
    set(color: Color): Color;
    setRed(r: number): this;
    setBlue(b: number): this;
    setAlpha(a: number): this;
    setGreen(g: number): this;
    setHue(h: number): this;
    setSaturation(s: number): this;
    setLuminance(l: number): this;
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
    saturate(v: string | number): Color;
    desaturate(v: string | number): Color;
    lighten(v: string | number): Color;
    darken(v: string | number): Color;
    fadein(v: string | number): Color;
    fadeout(v: string | number): Color;
    spin(v: string | number): Color;
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
    static parse(str: string): Color | null;
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
    static MediumVioletRed: Color;
    static DeepPink: Color;
    static PaleVioletRed: Color;
    static HotPink: Color;
    static LightPink: Color;
    static Pink: Color;
    static DarkRed: Color;
    static Red: Color;
    static Firebrick: Color;
    static Crimson: Color;
    static IndianRed: Color;
    static LightCoral: Color;
    static Salmon: Color;
    static DarkSalmon: Color;
    static LightSalmon: Color;
    static OrangeRed: Color;
    static Tomato: Color;
    static DarkOrange: Color;
    static Coral: Color;
    static Orange: Color;
    static DarkKhaki: Color;
    static Gold: Color;
    static Khaki: Color;
    static PeachPuff: Color;
    static Yellow: Color;
    static PaleGoldenrod: Color;
    static Moccasin: Color;
    static PapayaWhip: Color;
    static LightGoldenrodYellow: Color;
    static LemonChiffon: Color;
    static LightYellow: Color;
    static Maroon: Color;
    static Brown: Color;
    static SaddleBrown: Color;
    static Sienna: Color;
    static Chocolate: Color;
    static DarkGoldenrod: Color;
    static Peru: Color;
    static RosyBrown: Color;
    static Goldenrod: Color;
    static SandyBrown: Color;
    static Tan: Color;
    static Burlywood: Color;
    static Wheat: Color;
    static NavajoWhite: Color;
    static Bisque: Color;
    static BlanchedAlmond: Color;
    static Cornsilk: Color;
    static Indigo: Color;
    static Purple: Color;
    static DarkMagenta: Color;
    static DarkViolet: Color;
    static DarkSlateBlue: Color;
    static BlueViolet: Color;
    static DarkOrchid: Color;
    static Fuchsia: Color;
    static Magenta: Color;
    static SlateBlue: Color;
    static MediumSlateBlue: Color;
    static MediumOrchid: Color;
    static MediumPurple: Color;
    static Orchid: Color;
    static Violet: Color;
    static Plum: Color;
    static Thistle: Color;
    static Lavender: Color;
    static MidnightBlue: Color;
    static Navy: Color;
    static DarkBlue: Color;
    static MediumBlue: Color;
    static Blue: Color;
    static RoyalBlue: Color;
    static SteelBlue: Color;
    static DodgerBlue: Color;
    static DeepSkyBlue: Color;
    static CornflowerBlue: Color;
    static SkyBlue: Color;
    static LightSkyBlue: Color;
    static LightSteelBlue: Color;
    static LightBlue: Color;
    static PowderBlue: Color;
    static Teal: Color;
    static DarkCyan: Color;
    static LightSeaGreen: Color;
    static CadetBlue: Color;
    static DarkTurquoise: Color;
    static MediumTurquoise: Color;
    static Turquoise: Color;
    static Aqua: Color;
    static Cyan: Color;
    static Aquamarine: Color;
    static PaleTurquoise: Color;
    static LightCyan: Color;
    static DarkGreen: Color;
    static Green: Color;
    static DarkOliveGreen: Color;
    static ForestGreen: Color;
    static SeaGreen: Color;
    static Olive: Color;
    static OliveDrab: Color;
    static MediumSeaGreen: Color;
    static LimeGreen: Color;
    static Lime: Color;
    static SpringGreen: Color;
    static MediumSpringGreen: Color;
    static DarkSeaGreen: Color;
    static MediumAquamarine: Color;
    static YellowGreen: Color;
    static LawnGreen: Color;
    static Chartreuse: Color;
    static LightGreen: Color;
    static GreenYellow: Color;
    static PaleGreen: Color;
    static MistyRose: Color;
    static AntiqueWhite: Color;
    static Linen: Color;
    static Beige: Color;
    static WhiteSmoke: Color;
    static LavenderBlush: Color;
    static OldLace: Color;
    static AliceBlue: Color;
    static Seashell: Color;
    static GhostWhite: Color;
    static Honeydew: Color;
    static FloralWhite: Color;
    static Azure: Color;
    static MintCream: Color;
    static Snow: Color;
    static Ivory: Color;
    static White: Color;
    static Black: Color;
    static DarkSlateGray: Color;
    static DimGray: Color;
    static SlateGray: Color;
    static Gray: Color;
    static LightSlateGray: Color;
    static DarkGray: Color;
    static Silver: Color;
    static LightGray: Color;
    static Gainsboro: Color;
    static CSS_COLORS: Record<string, Color>;
}
