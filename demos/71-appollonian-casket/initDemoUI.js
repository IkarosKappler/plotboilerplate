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
      foldApoll.add(appContext.config, "circleRadius").step(1).title("The radius of the third circle.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "verticalScale").min(0.01).max(2.0).step(0.01).title("The vertical scale offset.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "horizontalOffset").min(0.0).max(3600.0).title("The horizontal function offset.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "horizontalScale").min(0.01).max(2.0).step(0.01).title("The horizontal scale offset.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "numPoints").min(1).max(100000).step(1).title("The number of points.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "distanceWeight").min(1.0).max(128.0).title("The exponent for the distance weighting.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "sampleScale").min(1).max(32).step(1).title("The scale factor for sample points/circles.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "horizontalFnTerm").title("The horizontal base function termin, parameters are `x` and `y`, `x0` and `y0`.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, "verticalFnTerm").title("The vertical base function termin, parameters are `x` and `y`, `x0` and `y0`.").onChange(function () { appContext.pb.redraw(); });
      // // prettier-ignore
      // foldSand.add(appContext.config, 'pointSetType',POINT_SET_TYPES).listen().onChange(function() { appContext.pb.redraw() }).name("pointSetType").title("pointSetType");

      // prettier-ignore
      // gui.add(appContext.config, "randomizeInputPoints").title("Randomize the input points.");
      // prettier-ignore
      gui.add(appContext.config, "readme").title("Show the readme.");
    }
  };
})(globalThis);
