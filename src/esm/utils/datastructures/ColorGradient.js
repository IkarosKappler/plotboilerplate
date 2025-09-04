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
import { Color } from "./Color";
const RAD_TO_DEG = 180.0 / Math.PI;
const DEFAULT_COLORSET = [
    { color: Color.Red, ratio: 0.0 },
    { color: Color.Gold, ratio: 0.2 },
    { color: Color.Yellow, ratio: 0.4 },
    { color: Color.LimeGreen, ratio: 0.6 },
    { color: Color.MediumBlue, ratio: 0.8 },
    { color: Color.Purple, ratio: 1.0 }
];
export class ColorGradient {
    /**
     * Creates a new ColorGradient with the given values. Please be sure that the values appear in the correct
     * order regarding the `ratio` information. This will not be validated.
     *
     * @param {Array<ColorGradientItem>} values - The values to use.
     * @param {number?} angle - (optional) An optional angle for the gradient; if no specified `PI/2.0` will be used (vertical from left to right).
     */
    constructor(values, angle) {
        this.values = values;
        // Default: left to right
        this.angle = typeof angle === "undefined" ? Math.PI / 2.0 : angle;
    }
    /**
     * Get a color gradient CSS value string from these gradient settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
    toColorGradientString() {
        // Example:
        //    linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 38%, rgba(161, 210, 108, 1) 68%, rgba(237, 221, 83, 1) 100%)
        // const buffer: Array<string | undefined> = [`linear-gradient( ${RAD_TO_DEG * this.angle}deg, `];
        const buffer = [
            `linear-gradient( ${typeof this.angle === "number" ? `${this.angle * RAD_TO_DEG}deg` : this.angle}, `
        ];
        for (var i = 0; i < this.values.length; i++) {
            if (i > 0) {
                buffer.push(",");
            }
            const colorValue = this.values[i] ? this.values[i].color.cssRGBA() : null;
            buffer.push(colorValue);
            const percentage = this.values[i].ratio;
            buffer.push(`${typeof percentage === "number" ? `${percentage * 100}%` : percentage}`);
        }
        buffer.push(")");
        return buffer.join(" ");
    }
    /**
     * Get the color at the specific relative position.
     *
     * @param {number} ratio - Any value between 0.0 and 1.0.
     */
    getColorAt(ratio) {
        // Locate interval first
        const intervalLocation = this.locateClosestRatio(ratio);
        const leftItem = this.values[intervalLocation[0]];
        const rightItem = this.values[intervalLocation[0] + 1];
        const relativeInnerIntervalPosition = (ratio - leftItem.ratio) / (rightItem.ratio - leftItem.ratio);
        return leftItem.color.clone().interpolate(rightItem.color, relativeInnerIntervalPosition);
    }
    /**
     * Find that gradient record (index) that's value is closest to the given relative value. The function will return
     * the closest value and the left index, indicating the containing interval index.
     *
     * @param {number} ratio - The value to look for.
     * @returns {[number,number]} A pair of left interval boundary index and closest value.
     */
    locateClosestRatio(ratio) {
        if (this.values.length === 0) {
            console.warn("[Warn] All slider values array is empty. This should not happen, cannot proceed.");
            return [NaN, null]; // This should not happen: at least two values must be present in a gradient
        }
        // console.log("__locateClosestSliderValue", "allSliderValues", allSliderValues);
        let leftSliderIndex = 0;
        let closestSliderValue = this.values[leftSliderIndex];
        for (var i = 1; i < this.values.length; i++) {
            const curVal = this.values[i];
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
    }
    /**
     * Try to convert the given anonymous item (usually and object) to a ColorGradient. This method should be used
     * to restore items from JSON parse results to convert them into proper ColorGradient instances.
     *
     * @param {any} item
     * @returns {ColorGradient}
     */
    static fromObject(item) {
        if (typeof item !== "object") {
            throw new Error(`Cannot instantiate ColorGradient from item: must be an object. (${typeof item})`);
        }
        if (!item.hasOwnProperty("values")) {
            throw new Error("Cannot instantiate ColorGradient from object: missing property 'values'.");
        }
        const valuesObj = item.values;
        if (!Array.isArray(valuesObj)) {
            throw new Error("Cannot instantiate ColorGradient from object: property 'values' is not an array.");
        }
        const values = valuesObj.map((element, index) => {
            if (typeof element !== "object") {
                throw new Error(`Cannot instantiate ColorGradient from object: item at index ${index} is not an object.`);
            }
            if (!element.hasOwnProperty("color") || !element.hasOwnProperty("ratio")) {
                throw new Error(`Cannot instantiate ColorGradient from object: item at index ${index} is missing 'color' or 'ratio' property.`);
            }
            const tmpElement = element;
            return { color: Color.makeRGB(tmpElement.color.r, tmpElement.color.g, tmpElement.color.b), ratio: tmpElement.ratio };
        });
        // More checks possible here ...
        return new ColorGradient(values, item.angle);
    }
    /**
     * Clone this linear color gradient. Returns a deep clone.
     *
     * @returns {ColorGradient}
     */
    clone() {
        return new ColorGradient(this.values.map((item) => {
            return { color: item.color, ratio: item.ratio };
        }), this.angle);
    }
    /**
     * Create a default color gradient with six color: red, orange, yellow, green, blue, purple.
     * @returns
     */
    static createDefault() {
        return new ColorGradient(DEFAULT_COLORSET.map((item) => ({ color: item.color, ratio: item.ratio })));
    }
    /**
     * Create a basic color gradient from only two colors.
     *
     * @param {Color} startColor - The leftmost color.
     * @param {Color} endColor - The rightmost color.
     * @param {number?} angleInRadians - (optional) An optional angle for the gradient; if no specified `PI/2.0` will be used (vertical from left to right).
     * @returns
     */
    static createFrom(startColor, endColor, angleInRadians) {
        return new ColorGradient([
            { ratio: 0.0, color: startColor },
            { ratio: 1.0, color: endColor }
        ], angleInRadians);
    }
}
//# sourceMappingURL=ColorGradient.js.map