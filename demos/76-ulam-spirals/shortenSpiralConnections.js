/**
 * Helper functions to shorten different spiral segments if required.
 *
 * @date    2026-09-11
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
  _context.shortenLinearConnection = function (line, isTrimStart, isTrimEnd, appContext, pb) {
    if (isTrimStart) {
      line.trimStart(appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x);
    }
    if (isTrimEnd) {
      line.trimEnd(appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x);
    }
  };

  _context.shortenBezierConnection = function (bezierCurve, isTrimStart, isTrimEnd, appContext, pb) {
    var cutOffAmount = appContext.config.circleRadius + appContext.config.lineWidthPrimeMarker / 2 / pb.draw.scale.x;
    if (isTrimStart && !isTrimEnd) {
      bezierCurve.trimStart(cutOffAmount);
    } else if (!isTrimStart && isTrimEnd) {
      bezierCurve.trimEnd(bezierCurve.arcLength - cutOffAmount);
    } else if (isTrimStart && isTrimEnd) {
      bezierCurve.trimStartEnd(cutOffAmount, bezierCurve.arcLength - cutOffAmount);
    }
  };
})(globalThis);
