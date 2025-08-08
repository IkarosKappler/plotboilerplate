"use strict";
/**
 * A simple linear color gradient implementation.
 *
 * A color gradient is just an array of color objects paired with position values on the gradient.
 *
 * TODO: add `angle`
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2025-08-05
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradient = void 0;
var Color_1 = require("./Color");
var RAD_TO_DEG = 180.0 / Math.PI;
var DEFAULT_COLORSET = [
    { color: Color_1.Color.RED, ratio: 0.0 },
    { color: Color_1.Color.GOLD, ratio: 0.2 },
    { color: Color_1.Color.YELLOW, ratio: 0.4 },
    { color: Color_1.Color.LIME_GREEN, ratio: 0.6 },
    { color: Color_1.Color.MEDIUM_BLUE, ratio: 0.8 },
    { color: Color_1.Color.PURPLE, ratio: 1.0 }
];
var ColorGradient = /** @class */ (function () {
    /**
     *
     * @param values
     */
    function ColorGradient(values, angleInRadians) {
        this.values = values;
        // Default: left to right
        this.angle = typeof angleInRadians === "undefined" ? Math.PI / 2.0 : angleInRadians;
    }
    /**
     * Get a color gradient CSS value string from these gradient settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
    ColorGradient.prototype.toColorGradientString = function () {
        // Example:
        //    linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 38%, rgba(161, 210, 108, 1) 68%, rgba(237, 221, 83, 1) 100%)
        var buffer = ["linear-gradient( ".concat(RAD_TO_DEG * this.angle, "deg, ")];
        for (var i = 0; i < this.values.length; i++) {
            if (i > 0) {
                buffer.push(",");
            }
            var colorValue = this.values[i] ? this.values[i].color.cssRGBA() : null;
            buffer.push(colorValue);
            var percentage = this.values[i].ratio;
            buffer.push("".concat(percentage * 100, "%"));
        }
        buffer.push(")");
        return buffer.join(" ");
    };
    /**
     * Clone this linear color gradient. Returns a deep clone.
     *
     * @returns {ColorGradient}
     */
    ColorGradient.prototype.clone = function () {
        return new ColorGradient(this.values.map(function (item) {
            return { color: item.color, ratio: item.ratio };
        }), this.angle);
    };
    /**
     * Create a default color gradient with six color: red, orange, yellow, green, blue, purple.
     * @returns
     */
    ColorGradient.createDefault = function () {
        return new ColorGradient(DEFAULT_COLORSET.map(function (item) { return ({ color: item.color, ratio: item.ratio }); }));
    };
    return ColorGradient;
}());
exports.ColorGradient = ColorGradient;
//# sourceMappingURL=ColorGradient.js.map