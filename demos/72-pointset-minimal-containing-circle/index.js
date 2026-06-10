/**
 * A script for generating Chladni like sand patterns.
 *
 * @author   Ikaros Kappler
 * @date     2026-04-15
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
      numPoints: params.getNumber("numPoints", 8),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.handleNumPointsChanged = function () {
      appContext.pb.remove(points, true, false);
      points = makeRandomPoints();
      appContext.pb.add(points);
    };
    appContext.isMobile = isMobile;

    var makeRandomPoints = function () {
      var box = appContext.pb.viewport().getScaled(0.5);
      var points = [];
      for (var i = 0; i < appContext.config.numPoints; i++) {
        points.push(box.randomPoint());
      }
      return points;
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var points = makeRandomPoints(10);
    pb.add(points);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      // var circle = wetzls(points);
      // console.log("circle", circle);
      // var circle = new Circle(new Vertex(circle.x, circle.y), circle.r);

      var circle = pointsMinimalContainingCircle(points);
      if (circle) {
        draw.circle(circle.center, circle.radius, "orange", 2.0);
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {}; // END preDraw

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

    window.addEventListener("resize", function () {
      // updateCurrentBounds();
    });

    humane.log("Move the circles around.");
  });
})(globalThis);
