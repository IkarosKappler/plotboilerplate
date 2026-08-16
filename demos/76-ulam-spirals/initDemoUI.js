/**
 * An experimental function to create demo-guis.
 *
 * @author  Ikaros Kappler
 * @date    2026-04-15
 * @version 1.0.0
 */

(function (_context) {
  _context.initDemoUI = function (appContext, SPIRAL_TYPES) {
    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = appContext.pb.createGUI();
      var fold = gui.addFolder("Power Centers and Power Circle");

      // prettier-ignore
      fold.add(appContext.config, "startingNumber").title("The natural number to start the spiral with :)").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      fold.add(appContext.config, "circleRadius").min(0.0).max(23.0).title("The radius of each prime circle.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "stepInUnits").min(1.0).max(120.0).title("Each step on the spiral in units/pixels.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "angleStepDeg").min(0.0).max(23.0).title("The angle iteration step.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "radiusStep").min(0.0).max(32.0).title("How much increase the radius in each step?").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "iterations").min(0).max(100000).title("The numer of steps.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "arcThreshold").min(0).max(1.0).title("The threshold for cubic arc segments.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "showSpiralTangents").title("Draw the spiral tangents.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "spiralType", SPIRAL_TYPES).title("Which spiral type to draw?").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.addColor(appContext.config, "lineColorSpiral").title("The line color of the spiral.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.addColor(appContext.config, "lineColorPrimeMarker").title("The line color of the prime number marker.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "showPrimeLabel").title("Draw the prime numbers as labels?").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "showSpiralPath").title("Draw the spiral path?.").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      fold.add(appContext.config, "lineWidthSpiral").min(1.0).max(16.0).title("The spiral's line with.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "lineWidthPrimeMarker").min(1.0).max(16.0).title("The prime markers' line width.").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
