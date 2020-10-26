/**
 *   Found at
 *    https://gist.github.com/neolitec/1344610
 * Thanks to neolitec
 *
 * @modified 2018-xx-xx Added a clone() function.
 * @modified 2018-xx-xx Allowing leading '#' in the makeHEX() function.
 * @modified 2018-11-28 Fixed the checkHEX() function to accept 000000.
 * @modified 2019-11-18 Added a generic parse(string) function that detects the format.
 * @modified 2020-01-09 Fixed a bug in the parse(string) function. Hex colors with only three elements were considered faulty.
 * @modified 2020-10-23 Ported to Typescript.
 **/
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
    /** Debug */
    static makeRGB(...args: any[]): Color;
    static makeHSL(...args: Array<number | string>): Color;
    static makeHEX(value: string): Color;
    static parse(str: string): Color;
    static Sanitizer: {
        RGB: (...args: any[]) => any[];
        HSL: (...args: (string | number)[]) => number[];
    };
    static Validator: {
        /**
         * Check a hexa color (without #)
         */
        checkHEX: (value: any) => void;
    };
    static Convertor: {
        /**
         * Calculates HSL Color
         * RGB must be normalized
         * Must be executed in a Color object context
         * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
         */
        RGBToHSL: () => void;
        /**
         * Calculates RGB color (nomalized)
         * HSL must be normalized
         * Must be executed in a Color object context
         * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
         */
        HSLToRGB: () => void;
    };
    clone(): Color;
    interpolate(c: Color, t: number): Color;
}
