/**
 * A script for generating power center and power circle of three given circles.
 *
 * @author   Ikaros Kappler
 * @date     2026-07-31
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
      startAngleDeg: params.getNumber("startAngleDeg", 0.0),
      sectorLength: params.getNumber("sectorLength", 60.0),
      // radiusep: params.getNumber("radiusStep", 5.0),
      // radiusStep: params.getNumber("radiusStep", 5.0),
      // circleRadius: params.getNumber("circleRadius", 8.0),
      // iterations: params.getNumber("iterations", 100),
      // arcThreshold: params.getNumber("arcThreshold", 0.666),
      // showSpiralTangents: params.getBoolean("showSpiralTangents", false),
      // spiralType: params.getString("spiralType", SPIRAL_TYPES[1]),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // +---------------------------------------------------------------------------------
    // | Creates a random circle that fits nicely into the viewport.
    // +-------------------------------
    var center = new Vertex(0, 0);
    var radiusPoint = pb.viewport().randomPoint(0.25, 0.25); // Keep 25% safe-area on the margins free
    var circle = new Circle(center, center.distance(radiusPoint));
    new CircleHelper(circle, radiusPoint, pb);
    pb.add([circle, center, radiusPoint]);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var startAngleRad = appContext.config.startAngleDeg * DEG_TO_RAD;
      var angle = Circle.circleUtils.sectorAngleByArcLength(appContext.config.sectorLength, circle.radius);
      // console.log("angle", angle);
      draw.circleArc(
        circle.center,
        circle.radius,
        startAngleRad, // startAngle: number,
        startAngleRad + angle, // endAngle: number,
        "orange", // color?: string,
        3.0 // lineWidth?: number,
        // options?: { asSegment?: boolean } & StrokeOptions
      );

      var startPoint = circle.vertAt(startAngleRad);
      var endPoint = circle.vertAt(startAngleRad + angle);
      draw.diamondHandle(startPoint, 5, "cyan");
      draw.diamondHandle(endPoint, 5, "cyan");
      draw.line(center, startPoint, 1.0, "cyan", { dashArray: [5, 5] });
      draw.line(center, endPoint, 1.0, "cyan", { dashArray: [5, 5] });
      draw.diamondHandle(radiusPoint, 9, "magenta");
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      // draw.circle(circleA.center, circleA.radius, "rgba(0,192,192,1.0)", 3.0);
      // draw.circle(circleB.center, circleB.radius, "rgba(0,192,192,1.0)", 3.0);
      // draw.circle(circleC.center, circleC.radius, "rgba(0,192,192,1.0)", 3.0);
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
    humane.log("Chose from different sytles of Ulam spirals.");
  });
})(globalThis);
