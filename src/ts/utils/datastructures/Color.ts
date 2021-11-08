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
 * @version 0.0.10
 **/

/**
 * @classdesc A color class, inspired by neolitec's Javascript class.
 *    Original found at
 *      https://gist.github.com/neolitec/1344610
 *    Thanks to neolitec
 */
export class Color {
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
  cssRGB(): string {
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
  cssRGBA(): string {
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
  red(): number {
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
  green(): number {
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
  blue(): number {
    return this.b;
  }

  setRed(r: number) {
    this.r = r;
    return this;
  }

  setBlue(b: number) {
    this.b = b;
    return this;
  }

  setAlpha(a: number) {
    this.a = a;
    return this;
  }

  setGreen(g: number) {
    this.g = g;
    return this;
  }

  setHue(h: number) {
    this.h = h;
    return this;
  }

  setSaturation(s: number) {
    this.s = s;
    return this;
  }

  setLuminance(l: number) {
    this.l = l;
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
  cssHSL(): string {
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
  cssHSLA(): string {
    return (
      "hsla(" +
      Math.round(360 * this.h) +
      "," +
      Math.round(100 * this.s) +
      "%," +
      Math.round(100 * this.l) +
      "%," +
      Math.round(this.a) +
      ")"
    );
  }

  /**
   * Get the hue component of this HSL(A) color. This method just returns the `h` color attribute.
   *
   * @method hue
   * @instance
   * @memberof Color
   * @return {number} A value between 0.0 and 1.0.
   */
  hue(): number {
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
  saturation(): number {
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
  lightness(): number {
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
  cssHEX(): string {
    return (
      "#" +
      (255 * this.r < 16 ? "0" : "") +
      Math.round(255 * this.r).toString(16) +
      (255 * this.g < 16 ? "0" : "") +
      Math.round(255 * this.g).toString(16) +
      (255 * this.b < 16 ? "0" : "") +
      Math.round(255 * this.b).toString(16)
    );
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
  alpha(): number {
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
  saturate(v: string | number): Color {
    if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
      this.s += (1 - this.s) * (v / 100);
    } else if ("number" == typeof v) {
      if (v >= -0.0 && v <= 1.0) {
        // range 255
        this.s += (1 - this.s) * v;
      } else {
        // range 0-1
        this.s += (1 - this.s) * (v / 255);
      }
    } else {
      throw new Error("error: bad modifier format (percent or number)");
    }
    if (this.s > 1) this.s = 1;
    else if (this.s < 0) this.s = 0;
    Color.Converter.HSLToRGB(this);
    return this;
  }
  desaturate(v: string | number): Color {
    if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
      this.s -= v / 100;
    } else if ("number" == typeof v) {
      if (v >= 0.0 && v <= 1.0) {
        // range 255
        this.s -= this.s * v;
      } else {
        // range 0-1
        this.s -= this.s * (v / 255);
      }
    } else {
      throw new Error("error: bad modifier format (percent or number)");
    }
    if (this.s > 1) this.s = 1;
    else if (this.s < 0) this.s = 0;
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
  lighten(v: string | number): Color {
    if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
      this.l += (1 - this.l) * (v / 100);
    } else if ("number" == typeof v) {
      if (v >= 0.0 && v <= 1.0) {
        // range 0.0...1.0
        this.l += (1 - this.l) * v;
      } else {
        // range 255
        this.l += (1 - this.l) * (v / 255);
      }
    } else {
      throw new Error("error: bad modifier format (percent or number)");
    }
    if (this.l > 1) this.l = 1;
    else if (this.l < 0) this.l = 0;
    Color.Converter.HSLToRGB(this);
    return this;
  }
  darken(v: string | number): Color {
    if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
      this.l -= this.l * (v / 100);
    } else if ("number" == typeof v) {
      if (v >= 0.0 && v <= 1.0) {
        // range 0.0...1.0
        this.l -= this.l * v;
      } else {
        // range 255
        this.l -= this.l * (v / 255);
      }
    } else {
      throw new Error("error: bad modifier format (percent or number)");
    }
    if (this.l > 1) this.l = 1;
    else if (this.l < 0) this.l = 0;
    Color.Converter.HSLToRGB(this);
    return this;
  }
  fadein(v: string | number): Color {
    if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
      this.a += (1 - this.a) * (v / 100);
    } else if ("number" == typeof v) {
      if (v >= 0.0 && v <= 1.0) {
        // range 0-1
        this.a += (1 - this.a) * v;
      } else {
        // range 255
        this.a += (1 - this.a) * (v / 255);
      }
    } else {
      throw new Error("error: bad modifier format (percent or number)");
    }
    console.log("New alpha", this.a);
    if (this.a > 1) this.a = 1;
    else if (this.a < 0) this.a = 0;
    Color.Converter.HSLToRGB(this);
    return this;
  }
  fadeout(v: string | number): Color {
    if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
      this.a -= v / 100;
    } else if ("number" == typeof v) {
      if (v >= 0.0 && v <= 1.0) {
        // range 0-1
        this.a -= v;
      } else {
        // range 255
        this.a -= v / 255;
      }
    } else {
      throw new Error("error: bad modifier format (percent or number)");
    }
    if (this.a > 1) this.a = 1;
    else if (this.a < 0) this.a = 0;
    Color.Converter.HSLToRGB(this);
    return this;
  }
  spin(v: string | number): Color {
    if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) this.h += v / 100;
    else if ("number" == typeof v)
      // range 360
      this.h += v / 360;
    else throw new Error("error: bad modifier format (percent or number)");
    if (this.h > 1) this.h = 1;
    else if (this.h < 0) this.h = 0;
    Color.Converter.HSLToRGB(this);
    return this;
  }

  static makeRGB(...args: any[]): Color {
    const c: Color = new Color();
    let sanitized: Array<number>;
    if (arguments.length < 3 || arguments.length > 4) throw new Error("error: 3 or 4 arguments");
    sanitized = Color.Sanitizer.RGB(arguments[0], arguments[1], arguments[2]);
    c.r = sanitized[0];
    c.g = sanitized[1];
    c.b = sanitized[2];
    if (arguments.length == 4) {
      c.a = arguments[3];
    } else {
      c.a = 1.0;
    }
    Color.Converter.RGBToHSL(c);
    return c;
  }

  static makeHSL(...args: Array<number | string>): Color {
    const c: Color = new Color();
    let sanitized: Array<number>;
    if (arguments.length < 3 || arguments.length > 4) throw new Error("error: 3 or 4 arguments");
    sanitized = Color.Sanitizer.HSL(arguments[0], arguments[1], arguments[2]);
    c.h = sanitized[0];
    c.s = sanitized[1];
    c.l = sanitized[2];
    if (arguments.length == 4) c.a = arguments[3];
    else c.a = 1.0;
    Color.Converter.HSLToRGB(c);
    return c;
  }

  static makeHEX(value: string): Color {
    var c = new Color(),
      sanitized;
    // Edit Ika 2018-0308
    // Allow leading '#'
    if (value && value.startsWith("#")) value = value.substr(1);
    Color.Validator.checkHEX(value);
    if (value.length == 3) {
      sanitized = Color.Sanitizer.RGB(
        parseInt(value.substr(0, 1) + value.substr(0, 1), 16),
        parseInt(value.substr(1, 1) + value.substr(1, 1), 16),
        parseInt(value.substr(2, 1) + value.substr(2, 1), 16)
      );
    } else if (value.length == 6) {
      sanitized = Color.Sanitizer.RGB(
        parseInt(value.substr(0, 2), 16),
        parseInt(value.substr(2, 2), 16),
        parseInt(value.substr(4, 2), 16)
      );
    } else throw new Error("error: 3 or 6 arguments");
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
  static parse(str: string): Color {
    if (typeof str == "undefined") return null;
    if ((str = str.trim().toLowerCase()).length == 0) return null;
    if (str.startsWith("#")) return Color.makeHEX(str.substring(1, str.length));
    if (str.startsWith("rgb")) {
      var parts = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(\d*(?:\.\d+\s*)?)\)$/);
      if (!parts) {
        throw "Unrecognized color format (2): " + str;
      }
      // [ str, r, g, b, a|undefined ]
      //   console.log("parts", parts);
      if (parts.length <= 4 || typeof parts[4] == "undefined" || parts[4] == "") {
        return Color.makeRGB(parts[1], parts[2], parts[3]);
      } else {
        return Color.makeRGB(parts[1], parts[2], parts[3], Number(parts[4]));
      }
    } else {
      throw "Unrecognized color format (1): " + str;
    }
  }

  private static Sanitizer = {
    RGB: function (...args: any[]) {
      var o = [];
      if (arguments.length == 0) {
        return [];
      }
      // const allAreFrac = Color.testFrac( arguments );
      for (var i = 0; i < arguments.length; i++) {
        var c = arguments[i];
        if ("string" == typeof c && c.indexOf("%") > -1) {
          if ((c = parseInt(c)) == NaN) throw new Error("Bad format");
          if (c < 0 || c > 100) throw new Error("Bad format");
          o[i] = c / 100;
        } else {
          if ("string" == typeof c && (c = parseInt(c)) == NaN) {
            throw new Error("Bad format");
          }
          if (c < 0) {
            throw new Error("Bad format");
          }
          //else if( allAreFrac ) o[i] = c; // c >= 0 && c <= 1 (all)
          else if (c >= 0 && c < 1) {
            o[i] = c;
          }
          // else if(c >= 0.0 && c <= 1.0) o[i] = c;
          else if (c >= 1 && c < 256) {
            o[i] = c / 255;
          }
          // ???
          // else if(c >= 0 && c < 256) o[i] = c/255;
          else throw new Error("Bad format (" + c + ")");
        }
      }
      return o;
    },

    HSL: function (...args: Array<string | number>): Array<number> {
      if (arguments.length < 3 || arguments.length > 4) throw new Error("3 or 4 arguments required");
      var h = arguments[0],
        s = arguments[1],
        l = arguments[2];
      if ("string" == typeof h && (h = parseFloat(h)) == NaN) throw new Error("Bad format for hue");
      if (h < 0 || h > 360) throw new Error("Hue out of range (0..360)");
      else if ((("" + h).indexOf(".") > -1 && h > 1) || ("" + h).indexOf(".") == -1) h /= 360;
      if ("string" == typeof s && s.indexOf("%") > -1) {
        if ((s = parseInt(s)) == NaN) throw new Error("Bad format for saturation");
        if (s < 0 || s > 100) throw new Error("Bad format for saturation");
        s /= 100;
      } else if (s < 0 || s > 1) throw new Error("Bad format for saturation");
      if ("string" == typeof l && l.indexOf("%") > -1) {
        if ((l = parseInt(l)) == NaN) throw new Error("Bad format for lightness");
        if (l < 0 || l > 100) throw new Error("Bad format for lightness");
        l /= 100;
      } else if (l < 0 || l > 1) throw new Error("Bad format for lightness");
      return [h, s, l];
    }
  }; // ENd sanitizer

  private static Validator = {
    /**
     * Check a hexa color (without #)
     */
    checkHEX: (value: string) => {
      if (value.length != 6 && value.length != 3) throw new Error("Hexa color: bad length (" + value.length + ")," + value);
      value = value.toLowerCase();
      //for( var i in value ) {
      for (var i = 0; i < value.length; i++) {
        var c: number = value.charCodeAt(i);
        if (!((c >= 48 && c <= 57) || (c >= 97 && c <= 102)))
          throw new Error(`Hexa color: out of range for "${value}" at position ${i}.`);
      }
    }
  };

  private static Converter = {
    /**
     * Calculates HSL Color.
     * RGB must be normalized.
     * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
     */
    RGBToHSL: (color: Color) => {
      var r: number = color.r;
      var g: number = color.g;
      var b: number = color.b;
      var max: number = Math.max(r, g, b);
      var min: number = Math.min(r, g, b);
      color.l = (max + min) / 2;
      if (max == min) {
        color.h = color.s = 0; // achromatic
      } else {
        var d: number = max - min;
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
    HSLToRGB: (color: Color) => {
      var h: number = color.h;
      var s: number = color.s;
      var l: number = color.l;
      if (s == 0) {
        color.r = color.g = color.b = l; // achromatic
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        color.r = Color.Converter.hue2rgb(p, q, h + 1 / 3);
        color.g = Color.Converter.hue2rgb(p, q, h);
        color.b = Color.Converter.hue2rgb(p, q, h - 1 / 3);
      }
    },

    hue2rgb: (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
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
  clone(): Color {
    return Color.makeRGB(this.r, this.g, this.b, this.a);
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
  interpolate(c: Color, t: number): Color {
    this.r += (c.r - c.r) * t;
    this.g += (c.g - c.g) * t;
    this.b += (c.b - c.b) * t;
    this.a += (c.a - c.a) * t;
    return this;
  }
} // END class
