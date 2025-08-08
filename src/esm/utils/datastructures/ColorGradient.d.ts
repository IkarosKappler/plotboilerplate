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
     *
     * @param values
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
}
