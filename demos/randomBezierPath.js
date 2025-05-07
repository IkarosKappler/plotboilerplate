/**
 * @requires createRandomizedPolygon
 *
 * @authot  Ikaros Kappler
 * @date    2025-05-07
 * @version 1.0.0
 */

function randomBezierPath(viewport) {
  // Create a new randomized Bézier curve.
  var tmpPolygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
  tmpPolygon.scale(0.3, tmpPolygon.getCentroid());
  var bezierPath = BezierPath.fromCurve(
    new CubicBezierCurve(tmpPolygon.vertices[0], tmpPolygon.vertices[1], tmpPolygon.vertices[2], tmpPolygon.vertices[3])
  );
  return bezierPath;
}
