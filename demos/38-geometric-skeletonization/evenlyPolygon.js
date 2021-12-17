/**
 * Optimize a polygon: turn the shape into evenly spaced points.
 *
 * @deprecation DEPRECATED: use Polygon.getEvenDistributionPolygon() instead.
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

    // Fetch and add the start point from the source polygon
    var polygonPoint = new Vertex(polygon.vertices[0]);
    result.vertices.push(polygonPoint);
    if (polygon.vertices.length === 1) {
      return result;
    }

    var perimeter = polygon.perimeter();
    var stepSize = perimeter / pointCount;
    var n = polygon.vertices.length;

    var polygonIndex = 1;
    var nextPolygonPoint = new Vertex(polygon.vertices[1]);
    var segmentLength = polygonPoint.distance(nextPolygonPoint);
    var loopMax = polygon.isOpen ? n : n + 1;
    var curSegmentU = stepSize;
    var i = 1;
    while (i < pointCount && polygonIndex < loopMax) {
      // Check if next eq point is inside this segment
      if (curSegmentU < segmentLength) {
        var newPoint = polygonPoint.clone().lerpAbs(nextPolygonPoint, curSegmentU);
        result.vertices.push(newPoint);
        curSegmentU += stepSize;
        i++;
      } else {
        polygonIndex++;
        polygonPoint = nextPolygonPoint;
        nextPolygonPoint = new Vertex(polygon.vertices[polygonIndex % n]);
        curSegmentU = curSegmentU - segmentLength;
        segmentLength = polygonPoint.distance(nextPolygonPoint);
      }
    }
    return result;
  };

  // var lerpAbs = function (vert, u, target) {
  //   var dist = vert.distance(target);
  //   var diff = vert.difference(target);
  //   var step = { x: diff.x / dist, y: diff.y / dist };
  //   // var t = u / dist;
  //   return new Vertex(vert.x + step.x * u, vert.y + step.y * u);
  // };

  return ep;
})();
