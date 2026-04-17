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
      var foldChladni = gui.addFolder("Chladni settings");
      // prettier-ignore
      foldChladni.add(appContext.config, "verticalOffset").min(0.0).max(360.0).title("The vertical function offset.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      foldChladni.add(appContext.config, "horizontalOffset").min(0.0).max(360.0).title("The horizontal function offset.").onChange(function () { appContext.pb.redraw(); });
    }
  };
})(globalThis);
