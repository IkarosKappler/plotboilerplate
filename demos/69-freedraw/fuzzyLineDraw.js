/**
 * A proof-of-concept for a fuzzy line drawing library.
 *
 * @author  Ikaros Kappler
 * @date    2026-04-04
 * @version 0.0.1
 */

(function (_context) {
  /**
   * @constructor
   * @param {number} samplePointDistance – The average sample point distance along the path.
   * @param {number} amplitudeFactor – A factor that's applied to the sub curve amplitude.
   */
  var FuzzyLineDraw = function (samplePointDistance, amplitudeFactor) {
    this.samplePointDistance = samplePointDistance;
    this.amplitudeFactor = amplitudeFactor;
  };

  /**
   * Calculate one randomized path along the given path.
   *
   * @param {BezierPath} bezierPath
   * @returns {BezierPath}
   */
  FuzzyLineDraw.prototype.variationFromBezierPath = function (bezierPath) {
    if (!bezierPath || bezierPath.bezierCurves.length == 0) {
      return null;
    }
    var totalPathLength = bezierPath.getLength();
    // var uStepSize = samplePointDistance / totalPathLength;
    // var maxAmplitude = Math.sqrt(Math.pow(this.samplePointDistance / 2, 2) - this.samplePointDistance);
    // console.log(
    //   "totalPathLength",
    //   totalPathLength,
    //   "samplePointDistance",
    //   this.samplePointDistance,
    //   "amplitudeFactor",
    //   this.amplitudeFactor
    // );
    var uPos = 0.0;
    var safetyLimit = 1000;
    var i = 0;
    var resultCurves = [];
    var startPoint = bezierPath.bezierCurves[0].startPoint.clone();
    var startControlPoint, endControlPoint, endPoint;
    var uCurrent;
    while (totalPathLength > 0 && uPos < totalPathLength && i < safetyLimit) {
      uCurrent = Math.min(totalPathLength, uPos + Math.max(0.1, Math.random()) * this.samplePointDistance);
      // Do not just pick sample points exactly on the input curve: instead add some variation.
      var perpendicularVertex = bezierPath.getPerpendicular(uCurrent);
      var curvePoint = bezierPath.getPoint(uCurrent);
      var perpendicularLine = new Line(curvePoint, perpendicularVertex).setLength(this.samplePointDistance);
      // Now pick a random point in a [-1,+1] range, but limit to triangular coordinates.
      endPoint = perpendicularLine.vertAt((1.0 - Math.random() * 2.0) * this.amplitudeFactor * 0.333);
      //   endPoint = bezierPath.getPoint(uCurrent);

      // Draw two circles around the two points and find intersection(s)
      var circleStartPoint = new Circle(startPoint, startPoint.distance(endPoint));
      var circleEndPoint = new Circle(endPoint, startPoint.distance(endPoint));
      var intersectionLine = circleStartPoint.circleIntersection(circleEndPoint);
      // Instead of picking the actual intersection points bring in more randomness
      // by picking two random points in the critical line.
      startControlPoint = intersectionLine.vertAt(0.5 - Math.random() * 0.5 * this.amplitudeFactor);
      endControlPoint = intersectionLine.vertAt(0.5 + Math.random() * 0.5 * this.amplitudeFactor);

      resultCurves.push(new CubicBezierCurve(startPoint, endPoint, startControlPoint, endControlPoint));

      startPoint = endPoint.clone();
      uPos += this.samplePointDistance;
      i++;
    }
    return BezierPath.fromArray(resultCurves);
  };

  _context.FuzzyLineDraw = FuzzyLineDraw;
})(globalThis);
