/**
 * Inspired by https://github.com/rowanwins/smallest-enclosing-circle.
 *
 * @param {*} points
 * @returns
 */
import { Circle } from "../../Circle";
import { XYCoords } from "../../interfaces";
/**
 * Calculate the minimal containing circle from a set of points.
 *
 * The number of points must be at least 2. Otherwise the function returns null.
 *
 * @param {XYCoords[]} points
 * @returns {Circle | null} The minimal containing circle or null if the point count is lower than 2.
 */
export declare const pointsMinimalContainingCircle: (points: XYCoords[]) => Circle | null;
