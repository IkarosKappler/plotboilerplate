/**
 * Helper functions to draw prime circles/labels.
 *
 * @date    2026-09-11
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
  _context.drawPrimeMarker = function (draw, fill, position, primeNumber, appContext) {
    // var circleRadius = appContext.config.circleRadius;
    draw.circle(
      position,
      appContext.config.circleRadius,
      appContext.config.lineColorPrimeMarker,
      appContext.config.lineWidthPrimeMarker
    );
    if (appContext.config.showPrimeLabel) {
      fill.text("" + primeNumber, position.x, position.y, {
        // options
        color: appContext.config.lineColorPrimeMarker,
        // fontFamily?: string;
        fontSize: 7, // number;
        // fontStyle?: FontStyle;
        // fontWeight?: FontWeight;
        lineHeight: 4, // number;
        textAlign: "center" // CanvasRenderingContext2D["textAlign"];
        // rotation?: number;
      });
    }
  };
})(globalThis);
