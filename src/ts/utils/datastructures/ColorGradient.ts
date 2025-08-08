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

export interface ColorGradientItem {
  color: Color;
  ratio: number; // A percentage value in [0.0 .. 1.0]
}

export class ColorGradient {
  values: Array<ColorGradientItem>;
  angle: number;

  /**
   *
   * @param values
   */
  constructor(values: Array<ColorGradientItem>, angleInRadians?: number) {
    this.values = values;
    this.angle = angleInRadians ?? 0.0;
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
    const buffer: Array<string | undefined> = [`linear-gradient( ${RAD_TO_DEG * this.angle}deg, `];
    for (var i = 0; i < this.values.length; i++) {
      if (i > 0) {
        buffer.push(",");
      }
      const colorValue: string = this.values[i] ? this.values[i].color.cssRGBA() : null;
      buffer.push(colorValue);
      const percentage = this.values[i].ratio;
      buffer.push(`${percentage * 100}%`);
    }
    buffer.push(")");

    return buffer.join(" ");
  }

  /**
   * Clone this linear color gradient. Returns a deep clone.
   *
   * @returns {ColorGradient}
   */
  public clone(): ColorGradient {
    return new ColorGradient(
      this.values.map((item: ColorGradientItem) => {
        return { color: item.color, ratio: item.ratio };
      }),
      this.angle
    );
  }
}
