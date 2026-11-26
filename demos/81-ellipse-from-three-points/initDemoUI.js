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

      // prettier-ignore
      fold.add(appContext.config, "focalControlAngleDeg").listen().min(-90).max(90).step(0.1).title("How titled should the control focal axis be?").onChange(function () { appContext.handleApproximationSettingsChanged(); });
      // prettier-ignore
      fold.add(appContext.config, "numMaxIterations").listen().min(1).max(100).step(1).title("How many maximal iterations to use for elliptic detection?").onChange(function () { appContext.handleApproximationSettingsChanged(); });
      // prettier-ignore
      gui.add(appContext.config, "approxFirstCorrectAngle").title("Find first correct angle.").onChange(function () { appContext.handleApproximationSettingsChanged(); } );
      // prettier-ignore
      gui.add(appContext.config, "approxSecondCorrectAngle").title("Find second correct angle.").onChange(function () { appContext.handleApproximationSettingsChanged(); } );
      // prettier-ignore
      gui.add(appContext.config, "showLinearApproximation").title("Draw a simple linear (unstable) approach to find a matching ellipse.").onChange( function() { appContext.pb.redraw(); } );
      // prettier-ignore
      gui.add(appContext.config, "drawCachedEllipsed").title("Draw the temp results from the iterations.").onChange( function() { appContext.pb.redraw(); } );

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
