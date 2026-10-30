/**
 * A script for showing the centroid of any polygon.
 *
 * @author   Ikaros Kappler
 * @date     2026-10-11
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";
  var DEG_TO_RAD = Math.PI / 180;

  // Fetch the GET params
  _context.addEventListener("load", function () {
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);

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
      focalControlAngle: params.getNumber("focalControlAngle", 0.0), // In Degrees!
      findCorrectAngle: function () {
        appContext.findCorrectAngle();
      },
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobileDevice();

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var ellipse = randomEllipse(pb.viewport());

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      // draw.line(pointA, pointB, "orange", 2.0);
      // var bisector = lineAB.perpBisector();
      // draw.line(bisector.a, bisector.b, "orange", 1.0);

      draw.ellipse(
        ellipse.center,
        ellipse.radiusH(), // radiusX: number,
        ellipse.radiusV(), // radiusY: number,
        "rgba(128,192,0,1.0)",
        2.0,
        ellipse.rotation,
        { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
      );

      // console.log("{ x: uiStats.mouseX, y: uiStats.mouseY }", { x: stats.mouseX, y: stats.mouseY });
      var point = { x: stats.mouseX, y: stats.mouseY };
      draw.crosshair(point, 12, ellipse.containsPoint(point) ? "red" : "green");
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
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "drawsvg-demo").move(function (e) {
      // Display the mouse position
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;

      pb.redraw();
    });

    var stats = {
      mouseX: 0,
      mouseY: 0
    };

    // Add stats
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseX");
    uiStats.add("mouseY");

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
    humane.log("Move the three vertices around.");
  });
})(globalThis);
