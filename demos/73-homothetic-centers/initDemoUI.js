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
      var fold = gui.addFolder("Homothetic Centers");

      // prettier-ignore
      fold.addColor(appContext.config, "colorCenterConnectLine").title("The color of the center-connect-line.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.addColor(appContext.config, "colorRadiusConnectLine").title("The color of the radius-connect-line.").onChange(function () { appContext.pb.redraw(); });
      // prettier-ignore
      fold.add(appContext.config, "isTwoCircles").title("Show homothetic centers of two or three circles?").onChange(function () { appContext.onTwoCircleSettingChanged(); });

      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
