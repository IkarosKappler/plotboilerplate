/**
 * A script for showing the centroid of any polygon.
 *
 * @author   Ikaros Kappler
 * @date     2026-09-15
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  _context.addEventListener("load", function () {
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);
    var isMobile = isMobileDevice();

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("my-canvas"),
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          fullSize: true
        },
        GUP
      )
    );

    // Create a config: we want to have control about the arrow head size in this demo
    // `AppContext`: this is an experimental approach to make future event handling easier.
    var appContext = new AppContext(pb, {
      // colorCenterConnectLine: params.getString("colorCenterConnectLine", "#0048e0"),
      // colorRadiusConnectLine: params.getString("colorRadiusConnectLine", "#00e048"),
      isClockwise: params.getBoolean("isClockwise", false),
      pointCount: params.getNumber("pointCount", 8),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;
    appContext.rebuild = function () {
      pb.remove(polygon, false, true, false);
      polygon = randomPolygon(pb.viewport(), appContext.config.pointCount, appContext.config.isClockwise);
      pb.add(polygon);
      appContext.pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var polygon = randomPolygon(pb.viewport(), appContext.config.pointCount, appContext.config.isClockwise);
    pb.add(polygon);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      var centroid = polygon.getCentroid();
      draw.crosshair(centroid, 7, "red", 1.0);
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      // ...
    }; // END preDraw

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // | See `initDemoUI` for details.
    // +-------------------------------
    initDemoUI(appContext);

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    // var contentList = new PBContentList(pb);

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;

    pb.redraw();
    humane.log("Move the polygon's vertices around.");
  });
})(globalThis);
