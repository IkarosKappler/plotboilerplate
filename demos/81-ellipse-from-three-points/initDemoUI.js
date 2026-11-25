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
      var fold = gui.addFolder("Elliptic Detection");

      // // prettier-ignore
      // fold.add(appContext.config, "isCounterClockwise").title("Winding left or right?").onChange(function () { appContext.onClockwiseChanged(); });

      // prettier-ignore
      fold.add(appContext.config, "focalControlAngleDeg").listen().min(-90).max(90).step(0.1).title("How titled should the control focal axis be?").onChange(function () { appContext.updateFocalControlPoint(); });

      // prettier-ignore
      fold.add(appContext.config, "numMaxIterations").listen().min(1).max(100).step(1).title("How many maximal iterations to use for elliptic detection?").onChange(function () { appContext.updateFocalControlPoint(); });

      // prettier-ignore
      gui.add(appContext.config, "findFirstCorrectAngle").title("Find first correct angle.");
      // prettier-ignore
      gui.add(appContext.config, "findSecondCorrectAngle").title("Find second correct angle.");
      // prettier-ignore
      gui.add(appContext.config, "showLinearApproximation").title("Draw a simple linear (unstable) approach to find a matching ellipse.").onChange( function() { appContext.pb.redraw(); } );

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
