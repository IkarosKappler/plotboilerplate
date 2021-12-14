/**
 * Optimize a polygon: turn the shape into evenly spaced points.
 *
 * @author  Ikaros Kappler
 * @date    2021-12-14
 * @version 1.0.0
 */

globalThis.evenlyPolygon = (function () {
  /**
   * The main function.
   *
   * @param {Polygon} polygon
   * @param {number} pointCount - Must not be negative.
   */
  var ep = function (polygon, pointCount) {
    if (pointCount <= 0) {
      throw new Error("pointCount must be larger than zero; is " + pointCount + ".");
    }
    var result = new Polygon([], polygon.isOpen);
    if (polygon.vertices.length === 0) {
      return result;
    }
    var perimeter = polygon.perimeter();
    var stepSize = perimeter / pointCount;
    var curLength = 0;
    var curIndex = 0;
    var segmentLength = 0;
    var polygonPoint = polygon.vertices[curIndex];
    var resultPoint = new Vertex(polygonPoint);
    result.vertices.push(resultPoint);
    while (curLength < perimeter && result.vertices.length < pointCount && curIndex < polygon.vertices.length) {
      polygonPoint = polygon.vertices[curIndex];
      var nextPolygonPoint = polygon.vertices[(curIndex + 1) % polygon.vertices.length];
      var remainder = segmentLength;
      segmentLength += polygonPoint.distance(nextPolygonPoint);
      var segmentDifference = polygonPoint.difference(nextPolygonPoint);
      var maxSubstepCount = Math.ceil(segmentLength / stepSize);
      var i = 1;
      var ratio = { x: segmentDifference.x / segmentLength, y: segmentDifference.y / segmentLength };
      while (segmentLength >= stepSize && i <= maxSubstepCount) {
        // Interpolate to next point
        resultPoint = new Vertex(
          polygonPoint.x + ratio.x * (stepSize - remainder) * i,
          polygonPoint.y + ratio.y * (stepSize - remainder) * i
        );
        result.vertices.push(resultPoint);
        segmentLength -= stepSize;
        remainder = 0;
        i++;
      }
      curIndex++;
    }

    return result;
  };

  return ep;
})();
