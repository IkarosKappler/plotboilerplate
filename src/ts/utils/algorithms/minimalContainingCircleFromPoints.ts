/**
 * Calculate the minimal containing circle from a set of points.
 *
 * The number of points must be at least 2. Otherwise the function returns null.
 *
 * Inspired by https://github.com/rowanwins/smallest-enclosing-circle.
 *
 * @param {XYCoords[]} points
 * @returns
 */

import { Circle, ICircle } from "../../Circle";
import { Triangle } from "../../Triangle";
import { VertTuple } from "../../VertTuple";
import { Vertex } from "../../Vertex";
import { XYCoords } from "../../interfaces";

/**
 * Calculate the minimal containing circle from a set of points.
 *
 * The number of points must be at least 2. Otherwise the function returns null.
 *
 * @param {XYCoords[]} points
 * @returns {Circle | null} The minimal containing circle or null if the point count is lower than 2.
 */
export const minimalContainingCircleFromPoints = (points: XYCoords[]): Circle | null => {
  if (points.length <= 1) {
    return null;
  }
  const circleObject = wetzlsAlgorithm(points);
  return new Circle(new Vertex(circleObject.center.x, circleObject.center.y), circleObject.radius);
};

/**
 * This initiates the actual algorithm but return a shallow circle representation.
 *
 * @param points
 * @returns
 */
const wetzlsAlgorithm = (points: XYCoords[]): ICircle | null => {
  return minimumContainingCircle(points, points.length, [], 0);
};

/**
 * Pre: points.length >= 2
 * @param {Vertex[]} points
 * @param n
 * @param boundary
 * @param boundaryLength
 * @returns
 */
const minimumContainingCircle = (points: XYCoords[], n: number, boundary: XYCoords[], boundaryLength: number): ICircle => {
  if (boundaryLength === 3) {
    return Triangle.utils.calcCircumcircle(boundary[0], boundary[1], boundary[2]);
  } else if (n === 1 && boundaryLength === 0) {
    return { center: { x: points[0].x, y: points[0].y }, radius: 0 };
  } else if (n === 0 && boundaryLength === 2) {
    return VertTuple.vtutils.calcCircumcircle(boundary[0], boundary[1]);
  } else if (n === 1 && boundaryLength === 1) {
    return VertTuple.vtutils.calcCircumcircle(boundary[0], points[0]);
  } else {
    const localCircle: ICircle = minimumContainingCircle(points, n - 1, boundary, boundaryLength);
    if (!Circle.circleUtils.containsPoint(localCircle.center, localCircle.radius, points[n - 1])) {
      boundary[boundaryLength++] = points[n - 1];
      return minimumContainingCircle(points, n - 1, boundary, boundaryLength);
    }
    return localCircle;
  }
};
