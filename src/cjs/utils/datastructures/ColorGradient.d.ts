/**
 * A simple color gradient implementation.
 *
 * A color gradient is just an array of color objects paired with position values on the gradient.
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2025-08-05
 */
import { Color } from "./Color";
export interface ColorGradientItem {
    color: Color;
    percentage: number;
}
export declare class ColorGradient {
    private values;
    constructor(values: Array<ColorGradientItem>);
    /**
     * Get a color gradient CSS value string from these gradient settings.
     *
     * @instance
     * @memberof ColorGradientPicker
     * @returns {string}
     */
    toColorGradientString(): string;
}
