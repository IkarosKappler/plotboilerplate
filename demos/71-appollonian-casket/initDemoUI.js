/**
 * An experimental function to create demo-guis.
 *
 * @author  Ikaros Kappler
 * @date    2026-04-15
 * @version 1.0.0
 */

(function (_context) {
  _context.initDemoUI = function (appContext, POINT_SET_TYPES) {
    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = appContext.pb.createGUI();
      var foldApoll = gui.addFolder("Apollonian Circles");
      // prettier-ignore
      foldApoll.add(appContext.config, "circleRadius").min(10).max(1000).step(1).title("The radius of the third circle.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldApoll.add(appContext.config, "iterations").min(0).max(10).step(1).title("The number of iterations").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
