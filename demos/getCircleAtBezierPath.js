/**
 * Calculate (very simple approximation) the tangent circle at the given path
 * and position. This is equivalent to the path's curvature.
 *
 * @author   Ikaros Kappler
 * @date     2019-04-11
 * @modified 2023-01-22 Put into this separated file (from 05-circumcircle-animation).
 * @version  1.0.0
 */

/**
 * @param {BezierPath} path - The Bézier path to get the curvature for.
 * @param {number} t - The position on the curve (a value between 0.0 and 1.0).
 */
var getCircleAtBezierPath = function (path, t) {
  var p = path.getPointAt(t);
  var p0 = path.getPointAt(Math.max(0, t - t * 0.1));
  var p1 = path.getPointAt(Math.min(t + (1 - t) * 0.1, path.totalArcLength));
  var triangle = new Triangle(p0, p, p1);
  var circle = triangle.getCircumcircle();
  return circle;
};
