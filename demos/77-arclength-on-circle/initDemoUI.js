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
      fold.add(appContext.config, "startAngleDeg").min(-180.0).max(180.0).title("The sector length in units/pixels.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "sectorLength").min(1.0).max(512.0).title("The sector length in units/pixels.").onChange(function () { appContext.pb.redraw(); }); // prettier-ignore

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
