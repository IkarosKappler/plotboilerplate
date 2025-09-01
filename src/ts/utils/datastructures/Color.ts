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

  set(color: Color): Color {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
    this.h = color.h;
    this.s = color.s;
    this.l = color.l;
    return this;
  }

  setRed(r: number) {
    this.r = r;
    return this;
  }

  setBlue(b: number) {
    this.b = b;
    Color.Converter.RGBToHSL(this);
    return this;
  }

  setAlpha(a: number) {
    this.a = a;
    Color.Converter.RGBToHSL(this);
    return this;
  }

  setGreen(g: number) {
    this.g = g;
    Color.Converter.RGBToHSL(this);
    return this;
  }

  setHue(h: number) {
    this.h = h;
    Color.Converter.HSLToRGB(this);
    return this;
  }

  setSaturation(s: number) {
    this.s = s;
    Color.Converter.HSLToRGB(this);
    return this;
  }

  setLuminance(l: number) {
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
    // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
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
    // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
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
    // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
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
    // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
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
    // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
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
    // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) {
    if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
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
    // if ("string" == typeof v && v.indexOf("%") > -1 && (v = parseInt(v)) != NaN) this.h += v / 100;
    if ("string" == typeof v && v.indexOf("%") > -1 && !Number.isNaN((v = parseInt(v)))) {
      this.h += v / 100;
    } else if ("number" == typeof v) {
      // range 360
      this.h += v / 360;
    } else {
      throw new Error("error: bad modifier format (percent or number)");
    }
    if (this.h > 1) this.h = 1;
    else if (this.h < 0) this.h = 0;
    Color.Converter.HSLToRGB(this);
    return this;
  }

  static makeRGB(...args: any[]): Color {
    const c: Color = new Color();
    let sanitized: Array<number>;
    if (args.length < 3 || args.length > 4) {
      throw new Error("error: 3 or 4 arguments");
    }
    sanitized = Color.Sanitizer.RGB(args[0], args[1], args[2]);
    c.r = sanitized[0];
    c.g = sanitized[1];
    c.b = sanitized[2];
    if (args.length == 4) {
      c.a = args[3];
    } else {
      c.a = 1.0;
    }
    Color.Converter.RGBToHSL(c);
    return c;
  }

  static makeHSL(...args: Array<number | string>): Color {
    const c: Color = new Color();
    let sanitized: Array<number>;
    if (args.length < 3 || args.length > 4) {
      throw new Error("error: 3 or 4 arguments");
    }
    sanitized = Color.Sanitizer.HSL(args[0], args[1], args[2]);
    c.h = sanitized[0];
    c.s = sanitized[1];
    c.l = sanitized[2];
    if (args.length == 4) {
      c.a = typeof args[3] === "string" ? Number.parseFloat(args[3]) : args[3];
    } else {
      c.a = 1.0;
    }
    Color.Converter.HSLToRGB(c);
    return c;
  }

  static makeHEX(value: string): Color {
    var c = new Color(),
      sanitized;
    // Edit Ika 2018-0308
    // Allow leading '#'
    if (value && value.startsWith("#")) {
      value = value.substr(1);
    }
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
    } else {
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
  static parse(str: string): Color | null {
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
      } else {
        return Color.makeRGB(parts[1], parts[2], parts[3], Number(parts[4]));
      }
    }

    // Try to locate by CSS color name
    const keys: string[] = Object.keys(Color.CSS_COLORS);
    const cssColorKey: string = keys.reduce((prevKey: string, curKey: string) => {
      if (curKey && curKey.toLowerCase() === str.toLowerCase()) {
        return curKey;
      }
      return prevKey;
    }, null);
    if (cssColorKey) {
      const cssColor: Color = Color.CSS_COLORS[cssColorKey];
      // console.log("cssColor?", cssColor, str, cssColorKey);
      if (cssColor) {
        // console.log("CONSTRUCTOR?", cssColor.constructor);
        return cssColor.clone();
      }
    }
    throw "Unrecognized color format (1): " + str;
  }

  private static Sanitizer = {
    RGB: (...args: any[]) => {
      var o: number[] = [];
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
          if (c < 0 || c > 100) throw new Error("Bad format");
          o[i] = c / 100;
        } else {
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
          else throw new Error("Bad format (" + c + ")");
        }
      }
      return o;
    },

    HSL: function (...args: Array<string | number>): Array<number> {
      if (args.length < 3 || args.length > 4) {
        throw new Error("3 or 4 arguments required");
      }
      var h = args[0],
        s = args[1],
        l = args[2];
      // if ("string" == typeof h && (h = parseFloat(h)) == NaN) throw new Error("Bad format for hue");
      if ("string" == typeof h && Number.isNaN((h = parseFloat(h)))) {
        throw new Error("Bad format for hue");
      }
      if (h < 0 || h > 360) throw new Error("Hue out of range (0..360)");
      else if ((("" + h).indexOf(".") > -1 && h > 1) || ("" + h).indexOf(".") == -1) h /= 360;
      if ("string" == typeof s && s.indexOf("%") > -1) {
        // if ((s = parseInt(s)) == NaN) throw new Error("Bad format for saturation");
        if (Number.isNaN((s = parseInt(s)))) {
          throw new Error("Bad format for saturation");
        }
        if (s < 0 || s > 100) {
          throw new Error("Bad format for saturation");
        }
        s /= 100;
      } else {
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
      } else {
        l = typeof l === "string" ? Number.parseFloat(l) : l;
        if (l < 0 || l > 1) {
          throw new Error("Bad format for lightness");
        }
      }
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
  interpolate(c: Color, t: number): Color {
    this.r += (c.r - this.r) * t;
    this.g += (c.g - this.g) * t;
    this.b += (c.b - this.b) * t;
    this.a += (c.a - this.a) * t;
    return this;
  }

  // Source
  //    https://en.wikipedia.org/wiki/Web_colors

  // Pink colors
  static MediumVioletRed: Color = Color.makeRGB(199, 21, 133);
  static DeepPink: Color = Color.makeRGB(255, 20, 147);
  static PaleVioletRed: Color = Color.makeRGB(219, 112, 147);
  static HotPink: Color = Color.makeRGB(255, 105, 180);
  static LightPink: Color = Color.makeRGB(255, 182, 193);
  static Pink: Color = Color.makeRGB(255, 192, 203);

  // Red colors
  static DarkRed: Color = Color.makeRGB(139, 0, 0);
  static Red: Color = Color.makeRGB(255, 0, 0);
  static Firebrick: Color = Color.makeRGB(178, 34, 34);
  static Crimson: Color = Color.makeRGB(220, 20, 60);
  static IndianRed: Color = Color.makeRGB(205, 92, 92);
  static LightCoral: Color = Color.makeRGB(240, 128, 128);
  static Salmon: Color = Color.makeRGB(250, 128, 114);
  static DarkSalmon: Color = Color.makeRGB(233, 150, 122);
  static LightSalmon: Color = Color.makeRGB(255, 160, 122);

  // Orange colors
  static OrangeRed: Color = Color.makeRGB(255, 69, 0);
  static Tomato: Color = Color.makeRGB(255, 99, 71);
  static DarkOrange: Color = Color.makeRGB(255, 140, 0);
  static Coral: Color = Color.makeRGB(255, 127, 80);
  static Orange: Color = Color.makeRGB(255, 165, 0);

  // Yellow colors
  static DarkKhaki: Color = Color.makeRGB(189, 183, 107);
  static Gold: Color = Color.makeRGB(255, 215, 0);
  static Khaki: Color = Color.makeRGB(240, 230, 140);
  static PeachPuff: Color = Color.makeRGB(255, 218, 185);
  static Yellow: Color = Color.makeRGB(255, 255, 0);
  static PaleGoldenrod: Color = Color.makeRGB(238, 232, 170);
  static Moccasin: Color = Color.makeRGB(255, 228, 181);
  static PapayaWhip: Color = Color.makeRGB(255, 239, 213);
  static LightGoldenrodYellow: Color = Color.makeRGB(250, 250, 210);
  static LemonChiffon: Color = Color.makeRGB(255, 250, 205);
  static LightYellow: Color = Color.makeRGB(255, 255, 224);

  // Brown colors
  static Maroon: Color = Color.makeRGB(128, 0, 0);
  static Brown: Color = Color.makeRGB(165, 42, 42);
  static SaddleBrown: Color = Color.makeRGB(139, 69, 19);
  static Sienna: Color = Color.makeRGB(160, 82, 45);
  static Chocolate: Color = Color.makeRGB(210, 105, 30);
  static DarkGoldenrod: Color = Color.makeRGB(184, 134, 11);
  static Peru: Color = Color.makeRGB(205, 133, 63);
  static RosyBrown: Color = Color.makeRGB(188, 143, 143);
  static Goldenrod: Color = Color.makeRGB(218, 165, 32);
  static SandyBrown: Color = Color.makeRGB(244, 164, 96);
  static Tan: Color = Color.makeRGB(210, 180, 140);
  static Burlywood: Color = Color.makeRGB(222, 184, 135);
  static Wheat: Color = Color.makeRGB(245, 222, 179);
  static NavajoWhite: Color = Color.makeRGB(255, 222, 173);
  static Bisque: Color = Color.makeRGB(255, 228, 196);
  static BlanchedAlmond: Color = Color.makeRGB(255, 235, 205);
  static Cornsilk: Color = Color.makeRGB(255, 248, 220);

  // Purple, violet, and magenta colors
  static Indigo: Color = Color.makeRGB(75, 0, 130);
  static Purple: Color = Color.makeRGB(128, 0, 128);
  static DarkMagenta: Color = Color.makeRGB(139, 0, 139);
  static DarkViolet: Color = Color.makeRGB(148, 0, 211);
  static DarkSlateBlue: Color = Color.makeRGB(72, 61, 139);
  static BlueViolet: Color = Color.makeRGB(138, 43, 226);
  static DarkOrchid: Color = Color.makeRGB(153, 50, 204);
  static Fuchsia: Color = Color.makeRGB(255, 0, 255);
  static Magenta: Color = Color.makeRGB(255, 0, 255);
  static SlateBlue: Color = Color.makeRGB(106, 90, 205);
  static MediumSlateBlue: Color = Color.makeRGB(123, 104, 238);
  static MediumOrchid: Color = Color.makeRGB(186, 85, 211);
  static MediumPurple: Color = Color.makeRGB(147, 112, 219);
  static Orchid: Color = Color.makeRGB(218, 112, 214);
  static Violet: Color = Color.makeRGB(238, 130, 238);
  static Plum: Color = Color.makeRGB(221, 160, 221);
  static Thistle: Color = Color.makeRGB(216, 191, 216);
  static Lavender: Color = Color.makeRGB(230, 230, 250);

  // Blue colors
  static MidnightBlue: Color = Color.makeRGB(25, 25, 112);
  static Navy: Color = Color.makeRGB(0, 0, 128);
  static DarkBlue: Color = Color.makeRGB(0, 0, 139);
  static MediumBlue: Color = Color.makeRGB(0, 0, 205);
  static Blue: Color = Color.makeRGB(0, 0, 255);
  static RoyalBlue: Color = Color.makeRGB(65, 105, 225);
  static SteelBlue: Color = Color.makeRGB(70, 130, 180);
  static DodgerBlue: Color = Color.makeRGB(30, 144, 255);
  static DeepSkyBlue: Color = Color.makeRGB(0, 191, 255);
  static CornflowerBlue: Color = Color.makeRGB(100, 149, 237);
  static SkyBlue: Color = Color.makeRGB(135, 206, 235);
  static LightSkyBlue: Color = Color.makeRGB(135, 206, 250);
  static LightSteelBlue: Color = Color.makeRGB(176, 196, 222);
  static LightBlue: Color = Color.makeRGB(173, 216, 230);
  static PowderBlue: Color = Color.makeRGB(176, 224, 230);

  // Cyan colors
  static Teal: Color = Color.makeRGB(0, 128, 128);
  static DarkCyan: Color = Color.makeRGB(0, 139, 139);
  static LightSeaGreen: Color = Color.makeRGB(32, 178, 170);
  static CadetBlue: Color = Color.makeRGB(95, 158, 160);
  static DarkTurquoise: Color = Color.makeRGB(0, 206, 209);
  static MediumTurquoise: Color = Color.makeRGB(72, 209, 204);
  static Turquoise: Color = Color.makeRGB(64, 224, 208);
  static Aqua: Color = Color.makeRGB(0, 255, 255);
  static Cyan: Color = Color.makeRGB(0, 255, 255);
  static Aquamarine: Color = Color.makeRGB(127, 255, 212);
  static PaleTurquoise: Color = Color.makeRGB(175, 238, 238);
  static LightCyan: Color = Color.makeRGB(224, 255, 255);

  // Green colors
  static DarkGreen: Color = Color.makeRGB(0, 100, 0);
  static Green: Color = Color.makeRGB(0, 128, 0);
  static DarkOliveGreen: Color = Color.makeRGB(85, 107, 47);
  static ForestGreen: Color = Color.makeRGB(34, 139, 34);
  static SeaGreen: Color = Color.makeRGB(46, 139, 87);
  static Olive: Color = Color.makeRGB(128, 128, 0);
  static OliveDrab: Color = Color.makeRGB(107, 142, 35);
  static MediumSeaGreen: Color = Color.makeRGB(60, 179, 113);
  static LimeGreen: Color = Color.makeRGB(50, 205, 50);
  static Lime: Color = Color.makeRGB(0, 255, 0);
  static SpringGreen: Color = Color.makeRGB(0, 255, 127);
  static MediumSpringGreen: Color = Color.makeRGB(0, 250, 154);
  static DarkSeaGreen: Color = Color.makeRGB(143, 188, 143);
  static MediumAquamarine: Color = Color.makeRGB(102, 205, 170);
  static YellowGreen: Color = Color.makeRGB(154, 205, 50);
  static LawnGreen: Color = Color.makeRGB(124, 252, 0);
  static Chartreuse: Color = Color.makeRGB(127, 255, 0);
  static LightGreen: Color = Color.makeRGB(144, 238, 144);
  static GreenYellow: Color = Color.makeRGB(173, 255, 47);
  static PaleGreen: Color = Color.makeRGB(152, 251, 152);

  // White colors
  static MistyRose: Color = Color.makeRGB(255, 228, 225);
  static AntiqueWhite: Color = Color.makeRGB(250, 235, 215);
  static Linen: Color = Color.makeRGB(250, 240, 230);
  static Beige: Color = Color.makeRGB(245, 245, 220);
  static WhiteSmoke: Color = Color.makeRGB(245, 245, 245);
  static LavenderBlush: Color = Color.makeRGB(255, 240, 245);
  static OldLace: Color = Color.makeRGB(253, 245, 230);
  static AliceBlue: Color = Color.makeRGB(240, 248, 255);
  static Seashell: Color = Color.makeRGB(255, 245, 238);
  static GhostWhite: Color = Color.makeRGB(248, 248, 255);
  static Honeydew: Color = Color.makeRGB(240, 255, 240);
  static FloralWhite: Color = Color.makeRGB(255, 250, 240);
  static Azure: Color = Color.makeRGB(240, 255, 255);
  static MintCream: Color = Color.makeRGB(245, 255, 250);
  static Snow: Color = Color.makeRGB(255, 250, 250);
  static Ivory: Color = Color.makeRGB(255, 255, 240);
  static White: Color = Color.makeRGB(255, 255, 255);

  // Gray and black colors
  static Black: Color = Color.makeRGB(0, 0, 0);
  static DarkSlateGray: Color = Color.makeRGB(47, 79, 79);
  static DimGray: Color = Color.makeRGB(105, 105, 105);
  static SlateGray: Color = Color.makeRGB(112, 128, 144);
  static Gray: Color = Color.makeRGB(128, 128, 128);
  static LightSlateGray: Color = Color.makeRGB(119, 136, 153);
  static DarkGray: Color = Color.makeRGB(169, 169, 169);
  static Silver: Color = Color.makeRGB(192, 192, 192);
  static LightGray: Color = Color.makeRGB(211, 211, 211);
  static Gainsboro: Color = Color.makeRGB(220, 220, 220);

  static CSS_COLORS: Record<string, Color> = {
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
} // END class
