/**
 * A script for generating power center and power circle of three given circles.
 *
 * @author   Ikaros Kappler
 * @date     2026-08-26
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  _context.addEventListener("load", function () {
    var DEG_TO_RAD = Math.PI / 180.0;
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
    // var SPIRAL_TYPES = ["Ulam", "Round Equidistant"];
    var appContext = new AppContext(pb, {
      trimStart: params.getNumber("trimStart", 0.25),
      trimEnd: params.getNumber("trimEnd", 0.75),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    var randomPoint = function () {
      return pb.viewport().randomPoint(0.25, 0.25);
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var bCurve = new CubicBezierCurve(randomPoint(), randomPoint(), randomPoint(), randomPoint());
    var bPath = BezierPath.fromCurve(bCurve);
    var bHelper = new BezierPathInteractionHelper(pb, [bPath]);

    pb.add(bPath);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();

      // var cleanTrimStart = appContext.config.trimStart; // Math.min( Math.max(0.0, appContext.config.trimStart), 1.0);
      // var cleanTrimEnd = appContext.config.trimEnd; // Math.min( Math.max(0.0, appContext.config.trimEnd), cleanTrimStart);
      var cleanTrimStart = Math.min(Math.max(0.0, appContext.config.trimStart), 1.0);
      var cleanTrimEnd = Math.min(Math.max(cleanTrimStart, appContext.config.trimEnd), 1.0);

      var startPoint = bCurve.getPointAt(cleanTrimStart);
      var endPoint = bCurve.getPointAt(cleanTrimEnd);

      // bCurve.curveIntervals = 60;
      // bCurve.updateArcLengths();
      // var absoluteTrimStart = bCurve.arcLength * cleanTrimStart;
      // var bothTrimmed = bCurve.clone().trimStart(absoluteTrimStart);
      var bothTrimmed = bCurve.clone().trimStartAt(cleanTrimStart);

      // bothTrimmed.curveIntervals = 60;
      var relativeTrimEnd = (cleanTrimEnd - cleanTrimStart) / (1.0 - cleanTrimStart);

      // var absoluteTrimEnd = bCurve.arcLength * relativeTrimEnd;

      // console.log("relativeTrimEnd", relativeTrimEnd);

      var tmpEndPoint = bothTrimmed.getPointAt(relativeTrimEnd);
      draw.cross(tmpEndPoint, 5, "green", 1.0);

      // bothTrimmed.trimEnd(absoluteTrimEnd);
      bothTrimmed.trimEndAt(relativeTrimEnd);

      var finalCurve = bothTrimmed;

      fill.text("Start", bCurve.startPoint.x + 5, bCurve.startPoint.y, { color: contrastColor });
      fill.text("End", bCurve.endPoint.x + 5, bCurve.endPoint.y, { color: contrastColor });

      draw.cubicBezier(
        finalCurve.startPoint,
        finalCurve.endPoint,
        finalCurve.startControlPoint,
        finalCurve.endControlPoint,
        "rgba(255,0,255,0.5)",
        7.0
      );

      // Show expected end points on curve
      draw.cross(startPoint, 5, "orange", 1.0);
      draw.cross(endPoint, 5, "orange", 1.0);
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      bHelper.drawHandleLines(draw, fill);
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
    // updateHelperCircle();
    pb.redraw();
    humane.log("Trim the start and/or end from a Cubic Bézier Curve.");
  });
})(globalThis);
