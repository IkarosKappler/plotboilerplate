/**
 * An experimental function to create demo-guis.
 *
 * @author  Ikaros Kappler
 * @date    2026-04-15
 * @version 1.0.0
 */

(function (_context) {
  _context.initDemoUI = function (appContext) {
    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = appContext.pb.createGUI();
      var foldApoll = gui.addFolder("Minimum Containing Circle (MIC)");
      // prettier-ignore
      foldApoll.add(appContext.config, "numPoints").min(0).max(24).step(1).title("The radius of the third circle.").onChange(function () { appContext.handleNumPointsChanged(); appContext.pb.redraw(); });
      // prettier-ignore
      foldApoll.add(appContext.config, "useCircles").title("Use circles or points.").onChange(function () { appContext.toggleCircleControlPoints();});
      // prettier-ignore
      foldApoll.add(appContext.config, "drawBasicExtendedLines").title("Draw basic extended circle set lines.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldApoll.add(appContext.config, "drawTriangleExtendedLines").title("Draw triangles' extended circle set lines.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldApoll.add(appContext.config, "drawAppolonianCircle").title("Draw appolonian circle?").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      foldApoll.add(appContext.config, "isAInsideApollolian3").title("Draw the Apollonian circle inside or outside the first circle A?").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldApoll.add(appContext.config, "isBInsideApollolian3").title("Draw the Apollonian circle inside or outside the second circle B?").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldApoll.add(appContext.config, "isCInsideApollolian3").title("Draw the Apollonian circle inside or outside the third circle C?").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      foldApoll.add(appContext.config, "drawContainingCirclePairs").title("Draw pairs of circles and their containing circle.").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      foldApoll.add(appContext.config, "drawContainingCircleTriples").title("Draw triples of circles and their containing circle.").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      foldApoll.add(appContext.config, "drawContainingCircleApproximation").title("Draw a linear approximation of the minimum enclosing circle (bad performance!).").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
