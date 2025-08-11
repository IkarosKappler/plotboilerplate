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
     * Creates a new ColorGradient with the given values. Please be sure that the values appear in the correct
     * order regarding the `ratio` information. This will not be validated.
     *
     * @param {Array<ColorGradientItem>} values - The values to use.
     * @param {number?} angleInRadians - (optional) An optional angle for the gradient; if no specified `PI/2.0` will be used (vertical from left to right).
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
     * Get the color at the specific relative position.
     *
     * @param {number} ratio - Any value between 0.0 and 1.0.
     */
    ColorGradient.prototype.getColorAt = function (ratio) {
        // Locate interval first
        var intervalLocation = this.locateClosestSliderValue(ratio);
        var leftItem = this.values[intervalLocation[0]];
        var rightItem = this.values[intervalLocation[0] + 1];
        var relativeInnerIntervalPosition = (ratio - leftItem.ratio) / (rightItem.ratio - leftItem.ratio);
        return leftItem.color.clone().interpolate(rightItem.color, relativeInnerIntervalPosition);
    };
    /**
     * Find that gradient record (index) that's value is closest to the given relative value. The function will return
     * the closest value and the left index, indicating the containing interval index.
     *
     * @param {number} ratio - The value to look for.
     * @returns {[number,number]} A pair of left interval boundary index and closest value.
     */
    ColorGradient.prototype.locateClosestSliderValue = function (ratio) {
        if (this.values.length === 0) {
            console.warn("[Warn] All slider values array is empty. This should not happen, cannot proceed.");
            return [NaN, null]; // This should not happen: at least two values must be present in a gradient
        }
        // console.log("__locateClosestSliderValue", "allSliderValues", allSliderValues);
        var leftSliderIndex = 0;
        var closestSliderValue = this.values[leftSliderIndex];
        for (var i = 1; i < this.values.length; i++) {
            var curVal = this.values[i];
            if (Math.abs(curVal.ratio - ratio) < Math.abs(closestSliderValue.ratio - ratio)) {
                closestSliderValue = curVal;
                if (curVal.ratio > ratio) {
                    leftSliderIndex = i - 1;
                }
                else {
                    leftSliderIndex = i;
                }
            }
        }
        return [leftSliderIndex, closestSliderValue];
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
    /**
     * Create a basic color gradient from only two colors.
     *
     * @param {Color} startColor - The leftmost color.
     * @param {Color} endColor - The rightmost color.
     * @param {number?} angleInRadians - (optional) An optional angle for the gradient; if no specified `PI/2.0` will be used (vertical from left to right).
     * @returns
     */
    ColorGradient.createFrom = function (startColor, endColor, angleInRadians) {
        return new ColorGradient([
            { ratio: 0.0, color: startColor },
            { ratio: 1.0, color: endColor }
        ], angleInRadians);
    };
    return ColorGradient;
}());
exports.ColorGradient = ColorGradient;
//# sourceMappingURL=ColorGradient.js.map