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
      fold.add(appContext.config, "showRadicalAxes").title("Draw the three radical axes'.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "showRadicalCenter").title("Draw the radical center at the intersection of the three axes.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "showRadicalCircle").title("Draw the radical circle (orthogonal to all other three circles).").onChange(function () { appContext.pb.redraw(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
