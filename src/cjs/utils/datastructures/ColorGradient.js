"use strict";
/**
 * A simple color gradient implementation.
 *
 * A color gradient is just an array of color objects paired with position values on the gradient.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2025-08-05
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorGradient = void 0;
var ColorGradient = /** @class */ (function () {
    function ColorGradient(values) {
        this.values = values;
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
        var buffer = ["linear-gradient( 90deg, "];
        for (var i = 0; i < this.values.length; i++) {
            if (i > 0) {
                buffer.push(",");
            }
            var colorValue = this.values[i] ? this.values[i].color.cssRGBA() : null;
            buffer.push(colorValue);
            var percentage = this.values[i].percentage;
            buffer.push("".concat(percentage * 100, "%"));
        }
        buffer.push(")");
        return buffer.join(" ");
    };
    return ColorGradient;
}());
exports.ColorGradient = ColorGradient;
//# sourceMappingURL=ColorGradient.js.map