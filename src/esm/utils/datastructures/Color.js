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
 * @modified 2025-08-08 Fixed an issue in the static `makeRGB` method: values in [0..1] are now correctly reconized (1.0 was excluded).
 * @modified 2025-08-08 Added static color instances (singletons): Color.Red, Color.Gold, Color.Yellow, Color.Green, Color.LimeGreen, Color.Blue, Color.MediumBlue, Color.Purple.
 * @modified 2025-09-01 Adding all standard web colors. Source: https://en.wikipedia.org/wiki/Web_colors
 * @modified 2025-09-01 Modifying the `Sanitizer.RGB` helper method: recognoizing 0 to 255 as valid values (not only 1 to 255).
 * @modified 2025-09-01 Modifying the `Color.parse` method: recognizing CSS color strings now.
 * @version 0.0.14
 **/
/**
 * @classdesc A color class, inspired by neolitec's Javascript class.
 *    Original found at
 *      https://gist.github.com/neolitec/1344610
 *    Thanks to neolitec
 */
export class Color {
    /**
     * Construct a new color with `r=0 g=0 b=0`.
     *
     * Consider using the `makeHex`, `makeRGB` or `makeHSL` functions.
     *
     * @constructor
     * @instance
     * @memberof Color
     */
    constructor() {
        this.r = this.g = this.b = 0;
        this.h = this.s = this.l = 0;
        this.a = 1;
    }
    // --- RGB ----------------------------------
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
    cssRGB() {
        return "rgb(" + Math.round(255 * this.r) + "," + Math.round(255 * this.g) + "," + Math.round(255 * this.b) + ")";
    }
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
    cssRGBA() {
        return `rgba(${Math.round(255 * this.r)},${Math.round(255 * this.g)},${Math.round(255 * this.b)},${this.a})`;
    }
    /**
     * Get the red component of this RGB(A)color. This method just returns the `r` color attribute.
     *
     * @method red
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    red() {
        return this.r;
    }
    /**
     * Get the green component of this RGB(A) color. This method just returns the `g` color attribute.
     *
     * @method green
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    green() {
        return this.g;
    }
    /**
     * Get the blue component of this RGB(A) color. This method just returns the `b` color attribute.
     *
     * @method blue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    blue() {
        return this.b;
    }
    set(color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
        this.h = color.h;
        this.s = color.s;
        this.l = color.l;
        return this;
    }
    setRed(r) {
        this.r = r;
        return this;
    }
    setBlue(b) {
        this.b = b;
        Color.Converter.RGBToHSL(this);
        return this;
    }
    setAlpha(a) {
        this.a = a;
        Color.Converter.RGBToHSL(this);
        return this;
    }
    setGreen(g) {
        this.g = g;
        Color.Converter.RGBToHSL(this);
        return this;
    }
    setHue(h) {
        this.h = h;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    setSaturation(s) {
        this.s = s;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    setLuminance(l) {
        this.l = l;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    // --- HSL ----------------------------------
    /**
     * Get this color as a CSS `hsl` string.
     *
     * @method cssHSL
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsl string.
     */
    cssHSL() {
        return "hsl(" + Math.round(360 * this.h) + "," + Math.round(100 * this.s) + "%," + Math.round(100 * this.l) + "%)";
    }
    /**
     * Get this color as a CSS `hsla` string.
     *
     * @method cssHSLA
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsla string.
     */
    cssHSLA() {
        return ("hsla(" +
            Math.round(360 * this.h) +
            "," +
            Math.round(100 * this.s) +
            "%," +
            Math.round(100 * this.l) +
            "%," +
            Math.round(this.a) +
            ")");
    }
    /**
     * Get the hue component of this HSL(A) color. This method just returns the `h` color attribute.
     *
     * @method hue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    hue() {
        return this.h;
    }
    /**
     * Get the saturation component of this HSL(A) color. This method just returns the `s` color attribute.
     *
     * @method saturation
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    saturation() {
        return this.s;
    }
    /**
     * Get the lightness component of this HSL(A) color. This method just returns the `l` color attribute.
     *
     * @method lightness
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    lightness() {
        return this.l;
    }
    // --- HEX ----------------------------------
    /**
     * Get this color as a CSS-HEX string (non-alpha): #rrggbb
     *
     * @method cssHEX
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS-HEX string.
     */
    cssHEX() {
        return ("#" +
            (255 * this.r < 16 ? "0" : "") +
            Math.round(255 * this.r).toString(16) +
            (255 * this.g < 16 ? "0" : "") +
            Math.round(255 * this.g).toString(16) +
            (255 * this.b < 16 ? "0" : "") +
            Math.round(255 * this.b).toString(16));
    }
    // --- Transparency ----------------------------------
    /**
     * Get the alpha channel (transparency) of this color.
     *
     * @method alpha
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    alpha() {
        return this.a;
    }
    // --- Modifiers ----------------------------------
    //   saturate(v: string | number): Color {
    //     if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    //       this.s += v / 100;
    //     } else if ("number" == typeof v) {
    //       // range 255
    //       this.s += v / 255;
    //     } else {
    //       throw new Error("error: bad modifier format (percent or number)");
    //     }
    //     if (this.s > 1) this.s = 1;
    //     else if (this.s < 0) this.s = 0;
    //     Color.Converter.HSLToRGB(this);
    //     return this;
    //   }
    saturate(v) {
        // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
        if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
            this.s += (1 - this.s) * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= -0.0 && v <= 1.0) {
                // range 255
                this.s += (1 - this.s) * v;
            }
            else {
                // range 0-1
                this.s += (1 - this.s) * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.s > 1)
            this.s = 1;
        else if (this.s < 0)
            this.s = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    desaturate(v) {
        // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
        if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
            this.s -= v / 100;
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 255
                this.s -= this.s * v;
            }
            else {
                // range 0-1
                this.s -= this.s * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.s > 1)
            this.s = 1;
        else if (this.s < 0)
            this.s = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    //   lighten(v: string | number): Color {
    //     if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    //       this.l += v / 100;
    //     } else if ("number" == typeof v) {
    //       if (v >= -1.0 && v <= 1.0) {
    //         // range 0.0...1.0
    //         this.l += v;
    //       } else {
    //         // range 255
    //         this.l += v / 255;
    //       }
    //     } else {
    //       throw new Error("error: bad modifier format (percent or number)");
    //     }
    //     if (this.l > 1) this.l = 1;
    //     else if (this.l < 0) this.l = 0;
    //     Color.Converter.HSLToRGB(this);
    //     return this;
    //   }
    lighten(v) {
        // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
        if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
            this.l += (1 - this.l) * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0.0...1.0
                this.l += (1 - this.l) * v;
            }
            else {
                // range 255
                this.l += (1 - this.l) * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.l > 1)
            this.l = 1;
        else if (this.l < 0)
            this.l = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    darken(v) {
        // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
        if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
            this.l -= this.l * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0.0...1.0
                this.l -= this.l * v;
            }
            else {
                // range 255
                this.l -= this.l * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.l > 1)
            this.l = 1;
        else if (this.l < 0)
            this.l = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    fadein(v) {
        // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
        if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
            this.a += (1 - this.a) * (v / 100);
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0-1
                this.a += (1 - this.a) * v;
            }
            else {
                // range 255
                this.a += (1 - this.a) * (v / 255);
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        console.log("New alpha", this.a);
        if (this.a > 1)
            this.a = 1;
        else if (this.a < 0)
            this.a = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    fadeout(v) {
        // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
        if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
            this.a -= v / 100;
        }
        else if ("number" == typeof v) {
            if (v >= 0.0 && v <= 1.0) {
                // range 0-1
                this.a -= v;
            }
            else {
                // range 255
                this.a -= v / 255;
            }
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.a > 1)
            this.a = 1;
        else if (this.a < 0)
            this.a = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    spin(v) {
        // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) this.h += v / 100;
        if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
            this.h += v / 100;
        }
        else if ("number" == typeof v) {
            // range 360
            this.h += v / 360;
        }
        else {
            throw new Error("error: bad modifier format (percent or number)");
        }
        if (this.h > 1)
            this.h = 1;
        else if (this.h < 0)
            this.h = 0;
        Color.Converter.HSLToRGB(this);
        return this;
    }
    static makeRGB(...args) {
        const c = new Color();
        let sanitized;
        if (args.length < 3 || args.length > 4) {
            throw new Error("error: 3 or 4 arguments");
        }
        sanitized = Color.Sanitizer.RGB(args[0], args[1], args[2]);
        c.r = sanitized[0];
        c.g = sanitized[1];
        c.b = sanitized[2];
        if (args.length == 4) {
            c.a = args[3];
        }
        else {
            c.a = 1.0;
        }
        Color.Converter.RGBToHSL(c);
        return c;
    }
    static makeHSL(...args) {
        const c = new Color();
        let sanitized;
        if (args.length < 3 || args.length > 4) {
            throw new Error("error: 3 or 4 arguments");
        }
        sanitized = Color.Sanitizer.HSL(args[0], args[1], args[2]);
        c.h = sanitized[0];
        c.s = sanitized[1];
        c.l = sanitized[2];
        if (args.length == 4) {
            c.a = typeof args[3] === "string" ? Number.parseFloat(args[3]) : args[3];
        }
        else {
            c.a = 1.0;
        }
        Color.Converter.HSLToRGB(c);
        return c;
    }
    static makeHEX(value) {
        var c = new Color(), sanitized;
        // Edit Ika 2018-0308
        // Allow leading '#'
        if (value && value.startsWith("#")) {
            value = value.substr(1);
        }
        Color.Validator.checkHEX(value);
        if (value.length == 3) {
            sanitized = Color.Sanitizer.RGB(parseInt(value.substr(0, 1) + value.substr(0, 1), 16), parseInt(value.substr(1, 1) + value.substr(1, 1), 16), parseInt(value.substr(2, 1) + value.substr(2, 1), 16));
        }
        else if (value.length == 6) {
            sanitized = Color.Sanitizer.RGB(parseInt(value.substr(0, 2), 16), parseInt(value.substr(2, 2), 16), parseInt(value.substr(4, 2), 16));
        }
        else {
            throw new Error("error: 3 or 6 arguments");
        }
        c.r = sanitized[0];
        c.g = sanitized[1];
        c.b = sanitized[2];
        c.a = 1.0; // TODO: Accept #xxxxxxxx (8 chars, too, for alpha)
        Color.Converter.RGBToHSL(c);
        return c;
    }
    /**
     * Parse the given color string. Currently only these formate are recognized: hex, rgb, rgba.
     *
     * @method parse
     * @static
     * @memberof Color
     * @param {string} str - The string representation to parse.
     * @return {Color} The color instance that's represented by the given string.
     */
    static parse(str) {
        if (typeof str == "undefined") {
            return null;
        }
        if ((str = str.trim().toLowerCase()).length == 0) {
            return null;
        }
        if (str.startsWith("#")) {
            return Color.makeHEX(str.substring(1, str.length));
        }
        if (str.startsWith("rgb")) {
            var parts = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d*(?:\.\d+\s*)?)\)$/);
            if (!parts) {
                throw "Unrecognized color format (2): " + str;
            }
            // [ str, r, g, b, a|undefined ]
            //   console.log("parts", parts);
            if (parts.length <= 4 || typeof parts[4] == "undefined" || parts[4] == "") {
                return Color.makeRGB(parts[1], parts[2], parts[3]);
            }
            else {
                return Color.makeRGB(parts[1], parts[2], parts[3], Number(parts[4]));
            }
        }
        // Try to locate by CSS color name
        const keys = Object.keys(Color.CSS_COLORS);
        const cssColorKey = keys.reduce((prevKey, curKey) => {
            if (curKey && curKey.toLowerCase() === str.toLowerCase()) {
                return curKey;
            }
            return prevKey;
        }, null);
        if (cssColorKey) {
            const cssColor = Color.CSS_COLORS[cssColorKey];
            // console.log("cssColor?", cssColor, str, cssColorKey);
            if (cssColor) {
                // console.log("CONSTRUCTOR?", cssColor.constructor);
                return cssColor.clone();
            }
        }
        throw "Unrecognized color format (1): " + str;
    }
    /**
     * Create a clone of this color (RGB).
     *
     * @method clone
     * @instance
     * @memberof Color
     * @return {Color} A clone of this color (in RGB mode).
     */
    clone() {
        // return Color.makeRGB(this.r, this.g, this.b, this.a);
        const col = new Color();
        col.r = this.r;
        col.g = this.g;
        col.b = this.b;
        col.a = this.a;
        col.h = this.h;
        col.s = this.s;
        col.l = this.l;
        return col;
    }
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
    interpolate(c, t) {
        this.r += (c.r - this.r) * t;
        this.g += (c.g - this.g) * t;
        this.b += (c.b - this.b) * t;
        this.a += (c.a - this.a) * t;
        return this;
    }
} // END class
Color.Sanitizer = {
    RGB: (...args) => {
        var o = [];
        if (args.length == 0) {
            return [];
        }
        // const allAreFrac = Color.testFrac( arguments );
        for (var i = 0; i < args.length; i++) {
            var c = args[i];
            if ("string" == typeof c && c.indexOf("%") > -1) {
                // if ((c = parseInt(c)) == NaN) throw new Error("Bad format");
                if (Number.isNaN((c = parseInt(c)))) {
                    throw new Error("Bad format");
                }
                if (c < 0 || c > 100)
                    throw new Error("Bad format");
                o[i] = c / 100;
            }
            else {
                // if ("string" == typeof c && (c = parseInt(c)) == NaN) {
                if ("string" == typeof c && Number.isNaN((c = parseInt(c)))) {
                    throw new Error("Bad format");
                }
                if (c < 0) {
                    throw new Error("Bad format");
                }
                //else if( allAreFrac ) o[i] = c; // c >= 0 && c <= 1 (all)
                else if (c >= 0 && c <= 1) {
                    o[i] = c;
                }
                // else if(c >= 0.0 && c <= 1.0) o[i] = c;
                else if (c >= 0 && c < 256) {
                    o[i] = c / 255;
                }
                // ???
                // else if(c >= 0 && c < 256) o[i] = c/255;
                else
                    throw new Error("Bad format (" + c + ")");
            }
        }
        return o;
    },
    HSL: function (...args) {
        if (args.length < 3 || args.length > 4) {
            throw new Error("3 or 4 arguments required");
        }
        var h = args[0], s = args[1], l = args[2];
        // if ("string" == typeof h && (h = parseFloat(h)) == NaN) throw new Error("Bad format for hue");
        if ("string" == typeof h && Number.isNaN((h = parseFloat(h)))) {
            throw new Error("Bad format for hue");
        }
        if (h < 0 || h > 360)
            throw new Error("Hue out of range (0..360)");
        else if ((("" + h).indexOf(".") > -1 && h > 1) || ("" + h).indexOf(".") == -1)
            h /= 360;
        if ("string" == typeof s && s.indexOf("%") > -1) {
            // if ((s = parseInt(s)) == NaN) throw new Error("Bad format for saturation");
            if (Number.isNaN((s = parseInt(s)))) {
                throw new Error("Bad format for saturation");
            }
            if (s < 0 || s > 100) {
                throw new Error("Bad format for saturation");
            }
            s /= 100;
        }
        else {
            s = typeof s === "string" ? Number.parseFloat(s) : s;
            if (s < 0 || s > 1) {
                throw new Error("Bad format for saturation");
            }
        }
        if ("string" == typeof l && l.indexOf("%") > -1) {
            // if ((l = parseInt(l)) == NaN) throw new Error("Bad format for lightness");
            if (Number.isNaN((l = parseInt(l)))) {
                throw new Error("Bad format for lightness");
            }
            if (l < 0 || l > 100) {
                throw new Error("Bad format for lightness");
            }
            l /= 100;
        }
        else {
            l = typeof l === "string" ? Number.parseFloat(l) : l;
            if (l < 0 || l > 1) {
                throw new Error("Bad format for lightness");
            }
        }
        return [h, s, l];
    }
}; // ENd sanitizer
Color.Validator = {
    /**
     * Check a hexa color (without #)
     */
    checkHEX: (value) => {
        if (value.length != 6 && value.length != 3)
            throw new Error("Hexa color: bad length (" + value.length + ")," + value);
        value = value.toLowerCase();
        //for( var i in value ) {
        for (var i = 0; i < value.length; i++) {
            var c = value.charCodeAt(i);
            if (!((c >= 48 && c <= 57) || (c >= 97 && c <= 102)))
                throw new Error(`Hexa color: out of range for "${value}" at position ${i}.`);
        }
    }
};
Color.Converter = {
    /**
     * Calculates HSL Color.
     * RGB must be normalized.
     * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
     */
    RGBToHSL: (color) => {
        var r = color.r;
        var g = color.g;
        var b = color.b;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        color.l = (max + min) / 2;
        if (max == min) {
            color.h = color.s = 0; // achromatic
        }
        else {
            var d = max - min;
            color.s = color.l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    color.h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    color.h = (b - r) / d + 2;
                    break;
                case b:
                    color.h = (r - g) / d + 4;
                    break;
            }
            color.h /= 6;
        }
    },
    /**
     * Calculates RGB color (nomalized).
     * HSL must be normalized.
     *
     * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
     */
    HSLToRGB: (color) => {
        var h = color.h;
        var s = color.s;
        var l = color.l;
        if (s == 0) {
            color.r = color.g = color.b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            color.r = Color.Converter.hue2rgb(p, q, h + 1 / 3);
            color.g = Color.Converter.hue2rgb(p, q, h);
            color.b = Color.Converter.hue2rgb(p, q, h - 1 / 3);
        }
    },
    hue2rgb: (p, q, t) => {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
};
// Source
//    https://en.wikipedia.org/wiki/Web_colors
// Pink colors
Color.MediumVioletRed = Color.makeRGB(199, 21, 133);
Color.DeepPink = Color.makeRGB(255, 20, 147);
Color.PaleVioletRed = Color.makeRGB(219, 112, 147);
Color.HotPink = Color.makeRGB(255, 105, 180);
Color.LightPink = Color.makeRGB(255, 182, 193);
Color.Pink = Color.makeRGB(255, 192, 203);
// Red colors
Color.DarkRed = Color.makeRGB(139, 0, 0);
Color.Red = Color.makeRGB(255, 0, 0);
Color.Firebrick = Color.makeRGB(178, 34, 34);
Color.Crimson = Color.makeRGB(220, 20, 60);
Color.IndianRed = Color.makeRGB(205, 92, 92);
Color.LightCoral = Color.makeRGB(240, 128, 128);
Color.Salmon = Color.makeRGB(250, 128, 114);
Color.DarkSalmon = Color.makeRGB(233, 150, 122);
Color.LightSalmon = Color.makeRGB(255, 160, 122);
// Orange colors
Color.OrangeRed = Color.makeRGB(255, 69, 0);
Color.Tomato = Color.makeRGB(255, 99, 71);
Color.DarkOrange = Color.makeRGB(255, 140, 0);
Color.Coral = Color.makeRGB(255, 127, 80);
Color.Orange = Color.makeRGB(255, 165, 0);
// Yellow colors
Color.DarkKhaki = Color.makeRGB(189, 183, 107);
Color.Gold = Color.makeRGB(255, 215, 0);
Color.Khaki = Color.makeRGB(240, 230, 140);
Color.PeachPuff = Color.makeRGB(255, 218, 185);
Color.Yellow = Color.makeRGB(255, 255, 0);
Color.PaleGoldenrod = Color.makeRGB(238, 232, 170);
Color.Moccasin = Color.makeRGB(255, 228, 181);
Color.PapayaWhip = Color.makeRGB(255, 239, 213);
Color.LightGoldenrodYellow = Color.makeRGB(250, 250, 210);
Color.LemonChiffon = Color.makeRGB(255, 250, 205);
Color.LightYellow = Color.makeRGB(255, 255, 224);
// Brown colors
Color.Maroon = Color.makeRGB(128, 0, 0);
Color.Brown = Color.makeRGB(165, 42, 42);
Color.SaddleBrown = Color.makeRGB(139, 69, 19);
Color.Sienna = Color.makeRGB(160, 82, 45);
Color.Chocolate = Color.makeRGB(210, 105, 30);
Color.DarkGoldenrod = Color.makeRGB(184, 134, 11);
Color.Peru = Color.makeRGB(205, 133, 63);
Color.RosyBrown = Color.makeRGB(188, 143, 143);
Color.Goldenrod = Color.makeRGB(218, 165, 32);
Color.SandyBrown = Color.makeRGB(244, 164, 96);
Color.Tan = Color.makeRGB(210, 180, 140);
Color.Burlywood = Color.makeRGB(222, 184, 135);
Color.Wheat = Color.makeRGB(245, 222, 179);
Color.NavajoWhite = Color.makeRGB(255, 222, 173);
Color.Bisque = Color.makeRGB(255, 228, 196);
Color.BlanchedAlmond = Color.makeRGB(255, 235, 205);
Color.Cornsilk = Color.makeRGB(255, 248, 220);
// Purple, violet, and magenta colors
Color.Indigo = Color.makeRGB(75, 0, 130);
Color.Purple = Color.makeRGB(128, 0, 128);
Color.DarkMagenta = Color.makeRGB(139, 0, 139);
Color.DarkViolet = Color.makeRGB(148, 0, 211);
Color.DarkSlateBlue = Color.makeRGB(72, 61, 139);
Color.BlueViolet = Color.makeRGB(138, 43, 226);
Color.DarkOrchid = Color.makeRGB(153, 50, 204);
Color.Fuchsia = Color.makeRGB(255, 0, 255);
Color.Magenta = Color.makeRGB(255, 0, 255);
Color.SlateBlue = Color.makeRGB(106, 90, 205);
Color.MediumSlateBlue = Color.makeRGB(123, 104, 238);
Color.MediumOrchid = Color.makeRGB(186, 85, 211);
Color.MediumPurple = Color.makeRGB(147, 112, 219);
Color.Orchid = Color.makeRGB(218, 112, 214);
Color.Violet = Color.makeRGB(238, 130, 238);
Color.Plum = Color.makeRGB(221, 160, 221);
Color.Thistle = Color.makeRGB(216, 191, 216);
Color.Lavender = Color.makeRGB(230, 230, 250);
// Blue colors
Color.MidnightBlue = Color.makeRGB(25, 25, 112);
Color.Navy = Color.makeRGB(0, 0, 128);
Color.DarkBlue = Color.makeRGB(0, 0, 139);
Color.MediumBlue = Color.makeRGB(0, 0, 205);
Color.Blue = Color.makeRGB(0, 0, 255);
Color.RoyalBlue = Color.makeRGB(65, 105, 225);
Color.SteelBlue = Color.makeRGB(70, 130, 180);
Color.DodgerBlue = Color.makeRGB(30, 144, 255);
Color.DeepSkyBlue = Color.makeRGB(0, 191, 255);
Color.CornflowerBlue = Color.makeRGB(100, 149, 237);
Color.SkyBlue = Color.makeRGB(135, 206, 235);
Color.LightSkyBlue = Color.makeRGB(135, 206, 250);
Color.LightSteelBlue = Color.makeRGB(176, 196, 222);
Color.LightBlue = Color.makeRGB(173, 216, 230);
Color.PowderBlue = Color.makeRGB(176, 224, 230);
// Cyan colors
Color.Teal = Color.makeRGB(0, 128, 128);
Color.DarkCyan = Color.makeRGB(0, 139, 139);
Color.LightSeaGreen = Color.makeRGB(32, 178, 170);
Color.CadetBlue = Color.makeRGB(95, 158, 160);
Color.DarkTurquoise = Color.makeRGB(0, 206, 209);
Color.MediumTurquoise = Color.makeRGB(72, 209, 204);
Color.Turquoise = Color.makeRGB(64, 224, 208);
Color.Aqua = Color.makeRGB(0, 255, 255);
Color.Cyan = Color.makeRGB(0, 255, 255);
Color.Aquamarine = Color.makeRGB(127, 255, 212);
Color.PaleTurquoise = Color.makeRGB(175, 238, 238);
Color.LightCyan = Color.makeRGB(224, 255, 255);
// Green colors
Color.DarkGreen = Color.makeRGB(0, 100, 0);
Color.Green = Color.makeRGB(0, 128, 0);
Color.DarkOliveGreen = Color.makeRGB(85, 107, 47);
Color.ForestGreen = Color.makeRGB(34, 139, 34);
Color.SeaGreen = Color.makeRGB(46, 139, 87);
Color.Olive = Color.makeRGB(128, 128, 0);
Color.OliveDrab = Color.makeRGB(107, 142, 35);
Color.MediumSeaGreen = Color.makeRGB(60, 179, 113);
Color.LimeGreen = Color.makeRGB(50, 205, 50);
Color.Lime = Color.makeRGB(0, 255, 0);
Color.SpringGreen = Color.makeRGB(0, 255, 127);
Color.MediumSpringGreen = Color.makeRGB(0, 250, 154);
Color.DarkSeaGreen = Color.makeRGB(143, 188, 143);
Color.MediumAquamarine = Color.makeRGB(102, 205, 170);
Color.YellowGreen = Color.makeRGB(154, 205, 50);
Color.LawnGreen = Color.makeRGB(124, 252, 0);
Color.Chartreuse = Color.makeRGB(127, 255, 0);
Color.LightGreen = Color.makeRGB(144, 238, 144);
Color.GreenYellow = Color.makeRGB(173, 255, 47);
Color.PaleGreen = Color.makeRGB(152, 251, 152);
// White colors
Color.MistyRose = Color.makeRGB(255, 228, 225);
Color.AntiqueWhite = Color.makeRGB(250, 235, 215);
Color.Linen = Color.makeRGB(250, 240, 230);
Color.Beige = Color.makeRGB(245, 245, 220);
Color.WhiteSmoke = Color.makeRGB(245, 245, 245);
Color.LavenderBlush = Color.makeRGB(255, 240, 245);
Color.OldLace = Color.makeRGB(253, 245, 230);
Color.AliceBlue = Color.makeRGB(240, 248, 255);
Color.Seashell = Color.makeRGB(255, 245, 238);
Color.GhostWhite = Color.makeRGB(248, 248, 255);
Color.Honeydew = Color.makeRGB(240, 255, 240);
Color.FloralWhite = Color.makeRGB(255, 250, 240);
Color.Azure = Color.makeRGB(240, 255, 255);
Color.MintCream = Color.makeRGB(245, 255, 250);
Color.Snow = Color.makeRGB(255, 250, 250);
Color.Ivory = Color.makeRGB(255, 255, 240);
Color.White = Color.makeRGB(255, 255, 255);
// Gray and black colors
Color.Black = Color.makeRGB(0, 0, 0);
Color.DarkSlateGray = Color.makeRGB(47, 79, 79);
Color.DimGray = Color.makeRGB(105, 105, 105);
Color.SlateGray = Color.makeRGB(112, 128, 144);
Color.Gray = Color.makeRGB(128, 128, 128);
Color.LightSlateGray = Color.makeRGB(119, 136, 153);
Color.DarkGray = Color.makeRGB(169, 169, 169);
Color.Silver = Color.makeRGB(192, 192, 192);
Color.LightGray = Color.makeRGB(211, 211, 211);
Color.Gainsboro = Color.makeRGB(220, 220, 220);
Color.CSS_COLORS = {
    // Pink Color.XYZ,lors
    MediumVioletRed: Color.MediumVioletRed,
    DeepPink: Color.DeepPink,
    PaleVioletRed: Color.PaleVioletRed,
    HotPink: Color.HotPink,
    LightPink: Color.LightPink,
    Pink: Color.Pink,
    // Red Color.XYZ,lors
    DarkRed: Color.DarkRed,
    Red: Color.Red,
    Firebrick: Color.Firebrick,
    Crimson: Color.Crimson,
    IndianRed: Color.IndianRed,
    LightCoral: Color.LightCoral,
    Salmon: Color.Salmon,
    DarkSalmon: Color.DarkSalmon,
    LightSalmon: Color.LightSalmon,
    // Orange Color.XYZ,lors
    OrangeRed: Color.OrangeRed,
    Tomato: Color.Tomato,
    DarkOrange: Color.DarkOrange,
    Coral: Color.Coral,
    Orange: Color.Orange,
    // Yellow Color.XYZ,lors
    DarkKhaki: Color.DarkKhaki,
    Gold: Color.Gold,
    Khaki: Color.Khaki,
    PeachPuff: Color.PeachPuff,
    Yellow: Color.Yellow,
    PaleGoldenrod: Color.PaleGoldenrod,
    Moccasin: Color.Moccasin,
    PapayaWhip: Color.PapayaWhip,
    LightGoldenrodYellow: Color.LightGoldenrodYellow,
    LemonChiffon: Color.LemonChiffon,
    LightYellow: Color.LightYellow,
    // Brown Color.XYZ,lors
    Maroon: Color.Maroon,
    Brown: Color.Brown,
    SaddleBrown: Color.SaddleBrown,
    Sienna: Color.Sienna,
    Chocolate: Color.Chocolate,
    DarkGoldenrod: Color.DarkGoldenrod,
    Peru: Color.Peru,
    RosyBrown: Color.RosyBrown,
    Goldenrod: Color.Goldenrod,
    SandyBrown: Color.SandyBrown,
    Tan: Color.Tan,
    Burlywood: Color.Burlywood,
    Wheat: Color.Wheat,
    NavajoWhite: Color.NavajoWhite,
    Bisque: Color.Bisque,
    BlanchedAlmond: Color.BlanchedAlmond,
    Cornsilk: Color.Cornsilk,
    // Purple, violet, and magenta Color.XYZ,lors
    Indigo: Color.Indigo,
    Purple: Color.Purple,
    DarkMagenta: Color.DarkMagenta,
    DarkViolet: Color.DarkViolet,
    DarkSlateBlue: Color.DarkSlateBlue,
    BlueViolet: Color.BlueViolet,
    DarkOrchid: Color.DarkOrchid,
    Fuchsia: Color.Fuchsia,
    Magenta: Color.Magenta,
    SlateBlue: Color.SlateBlue,
    MediumSlateBlue: Color.MediumSlateBlue,
    MediumOrchid: Color.MediumOrchid,
    MediumPurple: Color.MediumPurple,
    Orchid: Color.Orchid,
    Violet: Color.Violet,
    Plum: Color.Plum,
    Thistle: Color.Thistle,
    Lavender: Color.Lavender,
    // Blue Colors
    MidnightBlue: Color.MidnightBlue,
    Navy: Color.Navy,
    DarkBlue: Color.DarkBlue,
    MediumBlue: Color.MediumBlue,
    Blue: Color.Blue,
    RoyalBlue: Color.RoyalBlue,
    SteelBlue: Color.SteelBlue,
    DodgerBlue: Color.DodgerBlue,
    DeepSkyBlue: Color.DeepSkyBlue,
    CornflowerBlue: Color.CornflowerBlue,
    SkyBlue: Color.SkyBlue,
    LightSkyBlue: Color.LightSkyBlue,
    LightSteelBlue: Color.LightSteelBlue,
    LightBlue: Color.LightBlue,
    PowderBlue: Color.PowderBlue,
    // Coyan Colors
    Teal: Color.Teal,
    DarkCyan: Color.DarkCyan,
    LightSeaGreen: Color.LightSeaGreen,
    CadetBlue: Color.CadetBlue,
    DarkTurquoise: Color.DarkTurquoise,
    MediumTurquoise: Color.MediumTurquoise,
    Turquoise: Color.Turquoise,
    Aqua: Color.Aqua,
    Cyan: Color.Cyan,
    Aquamarine: Color.Aquamarine,
    PaleTurquoise: Color.PaleTurquoise,
    LightCyan: Color.LightCyan,
    // Green Colors
    DarkGreen: Color.DarkGreen,
    Green: Color.Green,
    DarkOliveGreen: Color.DarkOliveGreen,
    ForestGreen: Color.ForestGreen,
    SeaGreen: Color.SeaGreen,
    Olive: Color.Olive,
    OliveDrab: Color.OliveDrab,
    MediumSeaGreen: Color.MediumSeaGreen,
    LimeGreen: Color.LimeGreen,
    Lime: Color.Lime,
    SpringGreen: Color.SpringGreen,
    MediumSpringGreen: Color.MediumSpringGreen,
    DarkSeaGreen: Color.DarkSeaGreen,
    MediumAquamarine: Color.MediumAquamarine,
    YellowGreen: Color.YellowGreen,
    LawnGreen: Color.LawnGreen,
    Chartreuse: Color.Chartreuse,
    LightGreen: Color.LightGreen,
    GreenYellow: Color.GreenYellow,
    PaleGreen: Color.PaleGreen,
    // White Color.XYZ,lors
    MistyRose: Color.MistyRose,
    AntiqueWhite: Color.AntiqueWhite,
    Linen: Color.Linen,
    Beige: Color.Beige,
    WhiteSmoke: Color.WhiteSmoke,
    LavenderBlush: Color.LavenderBlush,
    OldLace: Color.OldLace,
    AliceBlue: Color.AliceBlue,
    Seashell: Color.Seashell,
    GhostWhite: Color.GhostWhite,
    Honeydew: Color.Honeydew,
    FloralWhite: Color.FloralWhite,
    Azure: Color.Azure,
    MintCream: Color.MintCream,
    Snow: Color.Snow,
    Ivory: Color.Ivory,
    White: Color.White,
    // Gray and black Color.XYZ,lors
    Black: Color.Black,
    DarkSlateGray: Color.DarkSlateGray,
    DimGray: Color.DimGray,
    SlateGray: Color.SlateGray,
    Gray: Color.Gray,
    LightSlateGray: Color.LightSlateGray,
    DarkGray: Color.DarkGray,
    Silver: Color.Silver,
    LightGray: Color.LightGray,
    Gainsboro: Color.Gainsboro
};
//# sourceMappingURL=Color.js.map