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
export interface ColorGradientItem {
    color: Color;
    ratio: number;
}
export declare class ColorGradient {
    values: Array<ColorGradientItem>;
    angle: number;
    /**
     * Creates a new ColorGradient with the given values. Please be sure that the values appear in the correct
     * order regarding the `ratio` information. This will not be validated.
     *
     * @param {Array<ColorGradientItem>} values - The values to use.
     * @param {number?} angleInRadians - (optional) An optional angle for the gradient; if no specified `PI/2.0` will be used (vertical from left to right).
     */
    constructor(values: Array<ColorGradientItem>, angleInRadians?: number);
    /**
     * Get a color gradient CSS value string from these gradient settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
    toColorGradientString(): string;
    /**
     * Get the color at the specific relative position.
     *
     * @param {number} ratio - Any value between 0.0 and 1.0.
     */
    getColorAt(ratio: number): Color;
    /**
     * Find that gradient record (index) that's value is closest to the given relative value. The function will return
     * the closest value and the left index, indicating the containing interval index.
     *
     * @param {number} ratio - The value to look for.
     * @returns {[number,number]} A pair of left interval boundary index and closest value.
     */
    locateClosestRatio(ratio: number): [number, ColorGradientItem];
    /**
     * Clone this linear color gradient. Returns a deep clone.
     *
     * @returns {ColorGradient}
     */
    clone(): ColorGradient;
    /**
     * Create a default color gradient with six color: red, orange, yellow, green, blue, purple.
     * @returns
     */
    static createDefault(): ColorGradient;
    /**
     * Create a basic color gradient from only two colors.
     *
     * @param {Color} startColor - The leftmost color.
     * @param {Color} endColor - The rightmost color.
     * @param {number?} angleInRadians - (optional) An optional angle for the gradient; if no specified `PI/2.0` will be used (vertical from left to right).
     * @returns
     */
    static createFrom(startColor: Color, endColor: Color, angleInRadians?: number): ColorGradient;
}
