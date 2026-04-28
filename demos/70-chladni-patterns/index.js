/**
 * A script for generating Chladni patterns.
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
      horizontalOffset: params.getNumber("horizontalOffset", 0.0),
      horizontalScale: params.getNumber("horizontalScale", 1.0),
      verticalOffset: params.getNumber("verticalOffset", 0.0),
      verticalScale: params.getNumber("verticalScale", 1.0),
      numPoints: params.getNumber("numPoints", 1000),
      distanceWeight: params.getNumber("distanceWeight", 2.0)
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var leftBounds;
    var rightBounds;
    var bottomBounds;
    var vertFunc = null;
    var horiFunc = null;
    var horizontalValues = [];
    var verticalValues = [];

    var updateCurrentBounds = function () {
      // Split screen into three/four areas
      var viewport = pb.viewport();
      var paddingX = 10 / appContext.pb.config.scaleX;
      var paddingY = 10 / appContext.pb.config.scaleY;
      leftBounds = new Bounds(
        new Vertex(viewport.min).addXY(paddingX, paddingY),
        new Vertex(viewport.max).subXY(viewport.width * 0.666, viewport.height * 0.333).subXY(paddingX / 2, paddingY / 2)
      );
      rightBounds = new Bounds(
        new Vertex(viewport.min).addX(viewport.width * 0.333).addXY(paddingX / 2, paddingY),
        new Vertex(viewport.max).subY(viewport.height * 0.333).subXY(paddingX, paddingY / 2)
      );
      bottomBounds = new Bounds(
        new Vertex(viewport.min).addXY(viewport.width * 0.333, viewport.height * 0.666).addXY(paddingX / 2, paddingY / 2),
        new Vertex(viewport.max).subXY(paddingX, paddingY)
      );
    };

    var postDraw = function (draw, fill) {
      // TODO: this is only required on zoom in/out or on canvas resize
      updateCurrentBounds();

      draw.bounds(leftBounds, "grey", 1.0);
      draw.bounds(rightBounds, "grey", 1.0);
      draw.bounds(bottomBounds, "grey", 1.0);

      // Draw horizontal oscillation
      var bottomMath = new Math70(appContext.config);
      horiFunc = bottomMath.scale(appContext.config.horizontalScale, 1.0, bottomMath.sin(bottomBounds));
      // horiFunc = bottomMath.sin(bottomBounds);

      // Draw vertical oscillation
      var leftMath = new Math70(appContext.config);
      vertFunc = leftMath.scale(1.0, appContext.config.verticalScale, leftMath.sinVertical(leftBounds));

      horizontalValues = createBottomCurveValeus(horiFunc);
      verticalValues = createLeftCurveValues(vertFunc);

      draw.polyline(horizontalValues, true, "red", 1);
      draw.polyline(verticalValues, true, "red", 1);

      makeRandomPoints(draw, fill);
    }; // END postDraw

    var weightAt = 0.0;
    var rangeMin = -1.0;
    var rangeMax = +1.0;
    var makeRandomPoints = function (draw, fill) {
      for (var i = 0; i < appContext.config.numPoints; i++) {
        var randomPoint = rightBounds.randomPoint(0, 0); // horizontalSafeArea=0, verticalSafeArea=0

        var vertAbsVal = vertFunc(randomPoint.x, randomPoint.y); // in [bounds.min.y,bounds.max.x]
        var horiAbsVal = horiFunc(randomPoint.x, randomPoint.y); // in [bounds.min.y,bounds.max.x]

        var vertRelVal = (vertAbsVal - leftBounds.min.x) / leftBounds.width; // int [0.0,1.0]
        var horiRelVal = (horiAbsVal - bottomBounds.min.y) / bottomBounds.height; // int [0.0,1.0]

        var product = Math.abs(vertRelVal * horiRelVal);
        // var weight = Math.sqrt(Math.abs(1.0 - weightAt - product));
        var weight = Math.pow(Math.abs(product - 1.0), appContext.config.distanceWeight);
        // var weight = Math.pow(Math.abs(product) - 1.0, 2.0);

        if (i == 0) {
          console.log("vertRelVal", vertRelVal, "horiRelVal", horiRelVal, "weight", weight);
        }
        // if (i % 100 === 0) {
        //   console.log("i", i, "vertRelVal", vertRelVal, "horiRelVal", horiRelVal);

        // }
        var radius = Math.abs(weight * 10.0);
        draw.circle(randomPoint, radius, "orange", 1);
      }
    };

    var createBottomCurveValeus = function (horiFunc) {
      var points = [];
      var stepCount = 100;
      for (var xStep = 0; xStep <= stepCount; xStep++) {
        // var xVal = (xStep / stepCount) * Math.PI * 2;
        var xVal = bottomBounds.min.x + (xStep / stepCount) * bottomBounds.width;
        // if (xStep % 10 === 0) {
        //   console.log("xStep", xStep, "xVal", xVal);
        // }
        var yVal = horiFunc(xVal, 0);
        points.push({ x: xVal, y: yVal });
      }
      console.log(points);
      return points;
    };

    var createLeftCurveValues = function (vertFunc) {
      // var vertFunc = leftMath.sinVertical(leftBounds);
      var points = [];
      var stepCount = 100;
      for (var yStep = 0; yStep <= stepCount; yStep++) {
        // var xVal = (xStep / stepCount) * Math.PI * 2;
        var yVal = leftBounds.min.y + (yStep / stepCount) * leftBounds.height;
        // if (xStep % 10 === 0) {
        //   console.log("xStep", xStep, "xVal", xVal);
        // }
        var xVal = vertFunc(0, yVal);
        points.push({ x: xVal, y: yVal });
      }
      console.log(points);
      // draw.polyline(points, true, "red", 1);
      return points;
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {}; // END preDraw

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // | And to rotate the object.
    // +-------------------------------
    var stats = {
      mouseX: 0,
      mouseY: 0
    };
    // Add stats
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseX");
    uiStats.add("mouseY");
    new MouseHandler(pb.eventCatcher, "draw-demo").move(function (e) {
      // Display the mouse position
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;
    });

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

    // humane.log("Draw a line with your mouse / finger");
  });
})(globalThis);
