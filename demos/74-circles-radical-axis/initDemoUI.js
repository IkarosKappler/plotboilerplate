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
      var fold = gui.addFolder("Power Centers and Power Circle");

      // prettier-ignore
      fold.add(appContext.config, "showFinalTangents").title("Show the final tangents from the radical axis?").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "finalTangentsPosition").min(-1.0).max(2.0).step(0.01).title("Pick a posisition.").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
