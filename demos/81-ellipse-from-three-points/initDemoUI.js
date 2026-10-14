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
      var fold = gui.addFolder("Polygon");

      // // prettier-ignore
      // fold.add(appContext.config, "isCounterClockwise").title("Winding left or right?").onChange(function () { appContext.onClockwiseChanged(); });

      // prettier-ignore
      fold.add(appContext.config, "focalControlAngle").min(-90).max(90).step(0.1).title("How titled should the control focal axis be?").onChange(function () { appContext.updateFocalControlPoint(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
