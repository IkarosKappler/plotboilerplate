"use strict";
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
 * @version 0.0.14
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
/**
 * @classdesc A color class, inspired by neolitec's Javascript class.
 *    Original found at
 *      https://gist.github.com/neolitec/1344610
 *    Thanks to neolitec
 */
var Color = /** @class */ (function () {
    /**
     * Construct a new color with `r=0 g=0 b=0`.
     *
     * Consider using the `makeHex`, `makeRGB` or `makeHSL` functions.
     *
     * @constructor
     * @instance
     * @memberof Color
     */
    function Color() {
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
    Color.prototype.cssRGB = function () {
        return "rgb(" + Math.round(255 * this.r) + "," + Math.round(255 * this.g) + "," + Math.round(255 * this.b) + ")";
    };
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
    Color.prototype.cssRGBA = function () {
        return "rgba(".concat(Math.round(255 * this.r), ",").concat(Math.round(255 * this.g), ",").concat(Math.round(255 * this.b), ",").concat(this.a, ")");
    };
    /**
     * Get the red component of this RGB(A)color. This method just returns the `r` color attribute.
     *
     * @method red
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.red = function () {
        return this.r;
    };
    /**
     * Get the green component of this RGB(A) color. This method just returns the `g` color attribute.
     *
     * @method green
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.green = function () {
        return this.g;
    };
    /**
     * Get the blue component of this RGB(A) color. This method just returns the `b` color attribute.
     *
     * @method blue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.blue = function () {
        return this.b;
    };
    Color.prototype.set = function (color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
        this.h = color.h;
        this.s = color.s;
        this.l = color.l;
        return this;
    };
    Color.prototype.setRed = function (r) {
        this.r = r;
        return this;
    };
    Color.prototype.setBlue = function (b) {
        this.b = b;
        Color.Converter.RGBToHSL(this);
        return this;
    };
    Color.prototype.setAlpha = function (a) {
        this.a = a;
        Color.Converter.RGBToHSL(this);
        return this;
    };
    Color.prototype.setGreen = function (g) {
        this.g = g;
        Color.Converter.RGBToHSL(this);
        return this;
    };
    Color.prototype.setHue = function (h) {
        this.h = h;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.setSaturation = function (s) {
        this.s = s;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    Color.prototype.setLuminance = function (l) {
        this.l = l;
        Color.Converter.HSLToRGB(this);
        return this;
    };
    // --- HSL ----------------------------------
    /**
     * Get this color as a CSS `hsl` string.
     *
     * @method cssHSL
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsl string.
     */
    Color.prototype.cssHSL = function () {
        return "hsl(" + Math.round(360 * this.h) + "," + Math.round(100 * this.s) + "%," + Math.round(100 * this.l) + "%)";
    };
    /**
     * Get this color as a CSS `hsla` string.
     *
     * @method cssHSLA
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS hsla string.
     */
    Color.prototype.cssHSLA = function () {
        return ("hsla(" +
            Math.round(360 * this.h) +
            "," +
            Math.round(100 * this.s) +
            "%," +
            Math.round(100 * this.l) +
            "%," +
            Math.round(this.a) +
            ")");
    };
    /**
     * Get the hue component of this HSL(A) color. This method just returns the `h` color attribute.
     *
     * @method hue
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.hue = function () {
        return this.h;
    };
    /**
     * Get the saturation component of this HSL(A) color. This method just returns the `s` color attribute.
     *
     * @method saturation
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.saturation = function () {
        return this.s;
    };
    /**
     * Get the lightness component of this HSL(A) color. This method just returns the `l` color attribute.
     *
     * @method lightness
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.lightness = function () {
        return this.l;
    };
    // --- HEX ----------------------------------
    /**
     * Get this color as a CSS-HEX string (non-alpha): #rrggbb
     *
     * @method cssHEX
     * @instance
     * @memberof Color
     * @return {string} This color as a CSS-HEX string.
     */
    Color.prototype.cssHEX = function () {
        return ("#" +
            (255 * this.r < 16 ? "0" : "") +
            Math.round(255 * this.r).toString(16) +
            (255 * this.g < 16 ? "0" : "") +
            Math.round(255 * this.g).toString(16) +
            (255 * this.b < 16 ? "0" : "") +
            Math.round(255 * this.b).toString(16));
    };
    // --- Transparency ----------------------------------
    /**
     * Get the alpha channel (transparency) of this color.
     *
     * @method alpha
     * @instance
     * @memberof Color
     * @return {number} A value between 0.0 and 1.0.
     */
    Color.prototype.alpha = function () {
        return this.a;
    };
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
    Color.prototype.saturate = function (v) {
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
    };
    Color.prototype.desaturate = function (v) {
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
    };
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
    Color.prototype.lighten = function (v) {
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
    };
    Color.prototype.darken = function (v) {
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
    };
    Color.prototype.fadein = function (v) {
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
    };
    Color.prototype.fadeout = function (v) {
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
    };
    Color.prototype.spin = function (v) {
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
    };
    Color.makeRGB = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var c = new Color();
        var sanitized;
        if (arguments.length < 3 || arguments.length > 4) {
            throw new Error("error: 3 or 4 arguments");
        }
        sanitized = Color.Sanitizer.RGB(arguments[0], arguments[1], arguments[2]);
        c.r = sanitized[0];
        c.g = sanitized[1];
        c.b = sanitized[2];
        if (arguments.length == 4) {
            c.a = arguments[3];
        }
        else {
            c.a = 1.0;
        }
        Color.Converter.RGBToHSL(c);
        return c;
    };
    Color.makeHSL = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var c = new Color();
        var sanitized;
        if (arguments.length < 3 || arguments.length > 4) {
            throw new Error("error: 3 or 4 arguments");
        }
        sanitized = Color.Sanitizer.HSL(arguments[0], arguments[1], arguments[2]);
        c.h = sanitized[0];
        c.s = sanitized[1];
        c.l = sanitized[2];
        if (arguments.length == 4)
            c.a = arguments[3];
        else
            c.a = 1.0;
        Color.Converter.HSLToRGB(c);
        return c;
    };
    Color.makeHEX = function (value) {
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
    };
    /**
     * Parse the given color string. Currently only these formate are recognized: hex, rgb, rgba.
     *
     * @method parse
     * @static
     * @memberof Color
     * @param {string} str - The string representation to parse.
     * @return {Color} The color instance that's represented by the given string.
     */
    Color.parse = function (str) {
        if (typeof str == "undefined") {
            return null;
        }
        if ((str = str.trim().toLowerCase()).length == 0) {
            return null;
        }
        if (str.startsWith("#"))
            return Color.makeHEX(str.substring(1, str.length));
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
        else {
            throw "Unrecognized color format (1): " + str;
        }
    };
    /**
     * Create a clone of this color (RGB).
     *
     * @method clone
     * @instance
     * @memberof Color
     * @return {Color} A clone of this color (in RGB mode).
     */
    Color.prototype.clone = function () {
        // return Color.makeRGB(this.r, this.g, this.b, this.a);
        var col = new Color();
        col.r = this.r;
        col.g = this.g;
        col.b = this.b;
        col.a = this.a;
        col.h = this.h;
        col.s = this.s;
        col.l = this.l;
        return col;
    };
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
    Color.prototype.interpolate = function (c, t) {
        this.r += (c.r - this.r) * t;
        this.g += (c.g - this.g) * t;
        this.b += (c.b - this.b) * t;
        this.a += (c.a - this.a) * t;
        return this;
    };
    Color.Sanitizer = {
        RGB: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var o = [];
            if (arguments.length == 0) {
                return [];
            }
            // const allAreFrac = Color.testFrac( arguments );
            for (var i = 0; i < arguments.length; i++) {
                var c = arguments[i];
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
                    else if (c >= 1 && c < 256) {
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
        HSL: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (arguments.length < 3 || arguments.length > 4)
                throw new Error("3 or 4 arguments required");
            var h = arguments[0], s = arguments[1], l = arguments[2];
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
            else if (s < 0 || s > 1) {
                throw new Error("Bad format for saturation");
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
            else if (l < 0 || l > 1) {
                throw new Error("Bad format for lightness");
            }
            return [h, s, l];
        }
    }; // ENd sanitizer
    Color.Validator = {
        /**
         * Check a hexa color (without #)
         */
        checkHEX: function (value) {
            if (value.length != 6 && value.length != 3)
                throw new Error("Hexa color: bad length (" + value.length + ")," + value);
            value = value.toLowerCase();
            //for( var i in value ) {
            for (var i = 0; i < value.length; i++) {
                var c = value.charCodeAt(i);
                if (!((c >= 48 && c <= 57) || (c >= 97 && c <= 102)))
                    throw new Error("Hexa color: out of range for \"".concat(value, "\" at position ").concat(i, "."));
            }
        }
    };
    Color.Converter = {
        /**
         * Calculates HSL Color.
         * RGB must be normalized.
         * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
         */
        RGBToHSL: function (color) {
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
        HSLToRGB: function (color) {
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
        hue2rgb: function (p, q, t) {
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
    Color.RED = Color.makeRGB(1.0, 0.0, 0.0); // #FF0000
    Color.GOLD = Color.makeRGB(0.992156863, 0.439215686, 0.0); // #FD7000
    Color.YELLOW = Color.makeRGB(1.0, 1.0, 0.0); // #FFFF00
    Color.GREEN = Color.makeRGB(0.0, 0.501960784, 0.0); // #008000
    Color.LIME_GREEN = Color.makeRGB(0.196078431, 0.803921569, 0.196078431); // #32CD32
    Color.BLUE = Color.makeRGB(0.0, 0.0, 1.0); // #0000FF
    Color.MEDIUM_BLUE = Color.makeRGB(0.0, 0.0, 0.803921569); // #0000CD
    Color.PURPLE = Color.makeRGB(0.501960784, 0.0, 0.501960784); // # #800080
    return Color;
}()); // END class
exports.Color = Color;
//# sourceMappingURL=Color.js.map