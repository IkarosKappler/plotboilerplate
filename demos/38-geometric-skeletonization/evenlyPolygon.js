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
    var perimeter = polygon.perimeter();
    var stepSize = perimeter / pointCount;
    var segmentLength = 0;

    // Fetch and add the start point from the source polygon
    var polygonPoint = new Vertex(polygon.vertices[0]);
    result.vertices.push(polygonPoint);
    var remainder = 0;
    var polygonIndex = 1;
    var loopMax = polygon.isOpen ? polygon.vertices.length : polygon.vertices.length + 1;
    for (var i = 0; i < pointCount && polygonIndex < loopMax; i++) {
      // Fetch next segment
      var nextPolygonPoint = polygon.vertices[polygonIndex % polygon.vertices.length];
      var segmentLength = polygonPoint.distance(nextPolygonPoint);
      var segmentDiff = polygonPoint.difference(nextPolygonPoint);
      var stepRatio = { x: segmentDiff.x / segmentLength, y: segmentDiff.y / segmentLength };
      var j = 1;
      while (segmentLength >= stepSize) {
        // Get next point on local segment
        var localStepSize = stepSize - (j === 1 ? remainder : 0);
        var point = new Vertex(
          polygonPoint.x + j * localStepSize * stepRatio.x - (j === 1 ? 0 : remainder) * stepRatio.x,
          polygonPoint.y + j * localStepSize * stepRatio.y - (j === 1 ? 0 : remainder) * stepRatio.y
        );
        // Don't add if we did a full turn here.
        segmentLength -= localStepSize;
        j++;
        if (this.isOpen || polygonIndex + 1 < loopMax || segmentLength >= stepSize) {
          result.vertices.push(point);
        }
      }
      polygonPoint = nextPolygonPoint;
      remainder = segmentLength;
      polygonIndex++;
    }

    return result;
  };

  return ep;
})();
