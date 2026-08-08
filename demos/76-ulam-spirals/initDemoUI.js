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
      fold.add(appContext.config, "angleStepDeg").min(0.0).max(23.0).title("The angle iteration step.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "radiusStep").min(0.0).max(10).title("How much increase the radius in each step?").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "iterations").min(0).max(10000).title("The numer of steps.").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
