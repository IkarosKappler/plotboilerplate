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

export class ColorGradient {
  private values: Array<ColorGradientItem>;

  constructor(values: Array<ColorGradientItem>) {
    this.values = values;
  }

  /**
   * Get a color gradient CSS value string from these gradient settings.
   *
   * @instance
   * @memberof ColorGradientPicker
   * @returns {string}
   */
  public toColorGradientString(): string {
    // Example:
    //    linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 38%, rgba(161, 210, 108, 1) 68%, rgba(237, 221, 83, 1) 100%)
    const buffer: Array<string | undefined> = ["linear-gradient( 90deg, "];
    for (var i = 0; i < this.values.length; i++) {
      if (i > 0) {
        buffer.push(",");
      }
      const colorValue: string = this.values[i] ? this.values[i].color.cssRGBA() : null;
      buffer.push(colorValue);
      const percentage = this.values[i].percentage;
      buffer.push(`${percentage * 100}%`);
    }
    buffer.push(")");

    return buffer.join(" ");
  }

  public static parse(inputString: string): ColorGradient {
    // TODO: parse color gradient string
    return null;
  }
}
