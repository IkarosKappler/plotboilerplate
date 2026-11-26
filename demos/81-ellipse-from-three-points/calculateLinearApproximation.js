/**
 * @date 2026-11-26
 */

(function (_context) {
  // +---------------------------------------------------------------------------------
  // | Try to calculate the linear approximation (no good results but looks fancy).
  // +-------------------------------
  _context.calculateLinearApproximation = function (draw, fill, ellipseApproximation, maxIterations, focalAngleRad) {
    var ellipse = null;

    var bisector = ellipseApproximation.lineAB.perpBisector();
    var colinearLine = bisector.getColinear(ellipseApproximation.pointC);
    var stepNo = 0;
    var stepSize = (Math.PI / maxIterations) * 2.0;
    var currentFocalControlAngle = focalAngleRad;
    var maxStep = 100;
    var recentIntersectionDists = null;
    var stop = false;
    var finalEllipse;
    var lastEllipse;
    var finalFocalControlAngle = 0;
    while (stepNo++ < maxStep && !stop) {
      ellipse = ellipseApproximation.calculateEllipseFromFocalAngle(currentFocalControlAngle);
      // Find intersection of colinear line and ellipse
      var intersections = ellipse.lineIntersections(colinearLine);
      draw.crosshair(intersections[0], 6, "red");
      draw.crosshair(intersections[1], 6, "red");

      // Direction?
      var direction = 1; // right (1) or left (-1)
      var distAlpha = ellipseApproximation.pointC.distance(intersections[0]);
      var distBeta = ellipseApproximation.pointC.distance(intersections[1]);
      currentFocalControlAngle += direction * stepSize;
      draw.ellipse(
        ellipse.center,
        ellipse.radiusH(), // radiusX: number,
        ellipse.radiusV(), // radiusY: number,
        "rgba(128,192,0,0.2)",
        1.0,
        ellipse.rotation,
        { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
      );

      if (distAlpha < 1.0 || distBeta < 1.0) {
        stop = true;
        finalEllipse = ellipse;
        finalFocalControlAngle = currentFocalControlAngle; // currentFocalControlAngleDeg;
      }
      if (recentIntersectionDists && (recentIntersectionDists[0] < distAlpha || recentIntersectionDists[1] < distBeta)) {
        // stop = true;
        stepSize * 0.9;
        direction *= -1;
      }
      //   console.log(
      //     "[stepNo=" + stepNo + "] currentFocalControlAngle",
      //     currentFocalControlAngle,
      //     "stepSize",
      //     stepSize,
      //     "distAlpha",
      //     distAlpha,
      //     "distBeta",
      //     distBeta
      //   );

      recentIntersectionDists = [distAlpha, distBeta];
      lastEllipse = ellipse;
    } // END while

    return finalEllipse;
  };
})(globalThis);
