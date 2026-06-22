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

    var getCircleCenters = function (circles) {
      return circles.map(function (circle) {
        return circle.center;
      });
    };

    // Create a config: we want to have control about the arrow head size in this demo
    // `AppContext`: this is an experimental approach to make future event handling easier.
    var appContext = new AppContext(pb, {
      numPoints: params.getNumber("numPoints", 8),
      useCircles: params.getBoolean("useCircles", false),
      drawBasicExtendedLines: params.getBoolean("drawBasicExtendedLines", false),
      drawTriangleExtendedLines: params.getBoolean("drawTriangleExtendedLines", false),
      drawAppolonianCircle: params.getBoolean("drawAppolonianCircle", false),

      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.handleNumPointsChanged = function () {
      appContext.pb.remove(getCircleCenters(circles), false, true); // redraw=false, removeWithVertices=false
      circles = makeRandomCircles();
      appContext.pb.add(getCircleCenters(circles));
    };
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Helper function to generate a set of random circles within
    // | specific viewport bounds.
    // +-------------------------------
    var makeRandomCircles = function () {
      var box = appContext.pb.viewport().getScaled(0.5);
      var arr = [];
      for (var i = 0; i < appContext.config.numPoints; i++) {
        var center = box.randomPoint();
        var radius = (0.1 + Math.random()) * (box.getMinDimension() * 0.1 + box.getMinDimension() * 0.2);
        arr.push(new Circle(center, radius));
      }
      return arr;
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var circles = makeRandomCircles(10);
    appContext.pb.add(getCircleCenters(circles));

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      if (appContext.config.useCircles) {
        drawCirclesMinContainingCircle(draw, fill);
      } else {
        var circle = minimalContainingCircleFromPoints(getCircleCenters(circles));
        if (circle) {
          draw.circle(circle.center, circle.radius, "orange", 2.0);
        }
      }

      if (appContext.config.drawAppolonianCircle) {
        var apollCircle = solveApollonius3(circles[0], circles[1], circles[2], 1, 1, 1);
        draw.circle(apollCircle.center, Math.abs(apollCircle.radius), "teal", 4.0);
      }
    };

    var drawCirclesMinContainingCircle = function (draw, fill) {
      // Also draw basic extended lines?
      if (appContext.config.drawBasicExtendedLines) {
        drawHelperLines(draw, fill, enclosingCircleApprox.basicExtendedLines, "orange");
      }

      // Draw extended triangles lines?
      var enclosingCircleApprox = CirclesCircumCircle.approximateEnclosingCircle(circles);
      if (appContext.config.drawTriangleExtendedLines) {
        drawHelperLines(draw, fill, enclosingCircleApprox.extendedTrianglesLines, "red");
      }

      // var ccircle = minimalContainingCircleFromPoints(allExtendedPoints);
      if (enclosingCircleApprox.enclosingCircle) {
        draw.circle(enclosingCircleApprox.enclosingCircle.center, enclosingCircleApprox.enclosingCircle.radius, "green", 2.0);
      }
    };

    var drawHelperLines = function (draw, fill, lines, color) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).setAlpha(0.25).cssRGBA();
      // console.log("contrastColor", contrastColor);
      for (var t = 0; t < lines.length; t++) {
        pb.draw.line(lines[t].a, lines[t].b, color, 1.0, { dashArray: [15, 10] });
        draw.diamondHandle(lines[t].b, 8, contrastColor);
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();
      for (var i = 0; i < circles.length; i++) {
        if (appContext.config.useCircles) {
          draw.circle(circles[i].center, circles[i].radius, rgba(255, 0, 255, 0.5), 2.0);
        }
        fill.text("" + i, circles[i].center.x + 5, circles[i].center.y, { color: contrastColor });
      }
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

    window.addEventListener("resize", function () {
      // updateCurrentBounds();
    });

    humane.log("Move the points/circles around.");
  });
})(globalThis);
