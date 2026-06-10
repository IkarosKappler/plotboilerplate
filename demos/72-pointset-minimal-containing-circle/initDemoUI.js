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
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
