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
      numPoints: params.getNumber("numPoints", 3),
      useCircles: params.getBoolean("useCircles", false),
      drawBasicExtendedLines: params.getBoolean("drawBasicExtendedLines", false),
      drawTriangleExtendedLines: params.getBoolean("drawTriangleExtendedLines", false),
      drawAppolonianCircle: params.getBoolean("drawAppolonianCircle", false),
      isAInsideApollolian3: params.getBoolean("isAInsideApollolian3", true),
      isBInsideApollolian3: params.getBoolean("isBInsideApollolian3", true),
      isCInsideApollolian3: params.getBoolean("isCInsideApollolian3", true),

      drawContainingCirclePairs: params.getBoolean("drawContainingCirclePairs", false),
      drawContainingCircleApproximation: params.getBoolean("drawContainingCircleApproximation", false),

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
      var iter = allTripleSubsetsIterator(arr);
      var item;
      while ((item = iter.next()) && item.value) {
        console.log(item.value);
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
        var circle = minimalEnclosingCircleFromPoints(getCircleCenters(circles));
        if (circle) {
          draw.circle(circle.center, circle.radius, "orange", 2.0);
        }
      }

      if (appContext.config.drawAppolonianCircle && circles.length >= 3) {
        var ic1 = appContext.config.isAInsideApollolian3; // ? 1 : -1;
        var ic2 = appContext.config.isBInsideApollolian3; // ? 1 : -1;
        var ic3 = appContext.config.isCInsideApollolian3; //  ? 1 : -1;
        var apollCircle = solveApollonius3(circles[0], circles[1], circles[2], ic1, ic2, ic3);
        draw.circle(apollCircle.center, Math.abs(apollCircle.radius), "teal", 4.0);
        fillCircularText(fill, "apollCircle", apollCircle, "teal", 12);
      }

      if (appContext.config.drawContainingCirclePairs) {
        drawContainingCirclePairs(draw, fill);
      }

      var enclosing23 = CirclesCircumCircle.findMinContainingCircle(circles);
      draw.circle(enclosing23.center, Math.abs(enclosing23.radius), "violet", 4.0);
      fillCircularText(fill, "enclosing23", enclosing23, "violet", 12);
    };

    var drawContainingCirclePairs = function (draw, fill) {
      for (var i = 0; i < circles.length; i++) {
        var circleA = circles[i];
        for (var j = i + 1; j < circles.length; j++) {
          var circleB = circles[j];
          var enclosingCircle2 = getContainingCircle2(circleA, circleB);
          draw.circle(enclosingCircle2.center, Math.abs(enclosingCircle2.radius), "teal", 1.0);

          var containsAll = circleContainsAllCircles(enclosingCircle2, circles);
          console.log("containsAll? ", i, j, containsAll);
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Simple approach to draw a text on a circular path.
    // +-------------------------------
    var fillCircularText = function (fill, text, circle, color, fontSizePx, startAngle) {
      startAngle = startAngle || -Math.PI / 2.0;
      var curAngle = startAngle;
      var textLen = text.length;
      var charatcterAngle = (Math.PI / 180.0 / (circle.radius / fontSizePx / 25)) * 2;
      // var totalAngle = charatcterAngle * textLen;

      for (var i = 0; i < textLen; i++) {
        var character = text.charAt(i);
        var pointOnCircle = circle.vertAt(curAngle);
        var angleOnCircle = curAngle + Math.PI / 2.0;
        fill.text(character, pointOnCircle.x, pointOnCircle.y, {
          color: color,
          fontFamily: "Monospace",
          fontSize: fontSizePx, // number;
          // fontStyle?: FontStyle;
          // fontWeight?: FontWeight;
          lineHeight: fontSizePx * 2.2,
          // textAlign?: CanvasRenderingContext2D["textAlign"];
          rotation: angleOnCircle
        });
        curAngle += charatcterAngle;
      }
    };

    var drawCirclesMinContainingCircle = function (draw, fill) {
      drawLinearApproximation(draw, fill);

      var circumCircles2 = CirclesCircumCircle.findMinCircleByTuples(circles);
      // console.log("circumCircles2", circumCircles2);
      // console.log("Color.Indigo.cssRGB()", Color.Indigo.cssRGB());
      if (circumCircles2) {
        draw.circle(circumCircles2.center, Math.abs(circumCircles2.radius), "red", 4.0);
        fillCircularText(fill, "circumCircles2", circumCircles2, "red", 12);
      }

      var circumCircles3 = CirclesCircumCircle.findMinCircleByTriples(circles);
      // console.log("circumCircles2", circumCircles2);
      // console.log("Color.Indigo.cssRGB()", Color.Indigo.cssRGB());
      if (circumCircles3) {
        console.log("circumCircles3", circumCircles3);
        draw.circle(circumCircles3.center, Math.abs(circumCircles3.radius), "grey", 4.0);
        fillCircularText(fill, "circumCircles3", circumCircles3, "grey", 12);
      } else {
        console.log("circumCircles3 is null.");
      }
    };

    var drawLinearApproximation = function (draw, fill) {
      if (appContext.config.drawContainingCircleApproximation) {
        var enclosingCircleApprox = CirclesCircumCircle.approximateMinimumEnclosingCircle(circles);
        // Also draw basic extended lines?
        if (appContext.config.drawBasicExtendedLines) {
          drawHelperLines(draw, fill, enclosingCircleApprox.basicExtendedLines, "orange");
        }

        // Draw extended triangles lines?
        if (appContext.config.drawTriangleExtendedLines) {
          drawHelperLines(draw, fill, enclosingCircleApprox.extendedTrianglesLines, "red");
        }

        // var ccircle = minimalContainingCircleFromPoints(allExtendedPoints);
        if (enclosingCircleApprox.enclosingCircle) {
          draw.circle(enclosingCircleApprox.enclosingCircle.center, enclosingCircleApprox.enclosingCircle.radius, "green", 2.0);
          fillCircularText(
            fill,
            "enclosingCircleApprox.enclosingCircle",
            enclosingCircleApprox.enclosingCircle,
            "green",
            12,
            -Math.PI
          );
        }
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
