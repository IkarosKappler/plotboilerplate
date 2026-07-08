/**
 * A script for generating homothetic centers.
 *
 * @author   Ikaros Kappler
 * @date     2026-07-08
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
      // circleRadius: params.getNumber("circleRadius", 100),
      // iterations: params.getNumber("iterations", 5),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var circleA = null;
    var circleB = null;
    var circleC = null;
    var angle = 0.0;
    var anglePointA = null;

    var updateCircleRadiusB = function () {
      // circleB.radius = Math.abs(circleB.center.distance(circleA.center) - circleA.radius);
    };

    var updateAngle = function () {
      angle = new Line(circleA.center, anglePointA).angle();
      // console.log("angle", angle);
    };

    var updateAnglePointA = function () {
      // console.log("angle", angle);
      anglePointA.set(
        circleA
          .clone()
          .setRadius(circleA.radius + 20)
          .vertAt(angle)
      );
    };

    var createRadiusPoint = function (circle) {
      return circle.vertAt(Math.PI / 4);
    };

    // +---------------------------------------------------------------------------------
    // | Creates a random circle that fits nicely into the viewport.
    // +-------------------------------
    circleA = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var radiusPointA = createRadiusPoint(circleA);
    new CircleHelper(circleA, radiusPointA, pb);

    anglePointA = radiusPointA.clone();
    circleB = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var radiusPointB = createRadiusPoint(circleB);
    new CircleHelper(circleB, radiusPointB, pb);

    circleA.center.listeners.addDragListener(function (event) {
      anglePointA.move(event.params.dragAmount);
    });
    radiusPointA.listeners.addDragListener(function () {
      updateAnglePointA();
    });
    anglePointA.listeners.addDragListener(function () {
      updateAngle();
    });
    anglePointA.listeners.addDragEndListener(function () {
      updateAnglePointA();
    });
    // updateCircleRadiusB();
    circleC = randomCircle(appContext.pb.viewport().getScaled(0.666));
    var radiusPointC = createRadiusPoint(circleC);
    new CircleHelper(circleC, radiusPointC, pb);

    pb.add([circleA.center, radiusPointA, anglePointA, circleB.center, radiusPointB, circleC.center, radiusPointC]);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      // draw.circle(containingCircle_clone.center, containingCircle_clone.radius, "rgba(128,128,128, 0.55)", 2.0, {
      //   dashArray: [10, 10]
      // });

      var radiusPointsA = drawAngleLines(draw, fill, circleA);
      var radiusPointsB = drawAngleLines(draw, fill, circleB);
      var radiusPointsC = drawAngleLines(draw, fill, circleC);

      var hometheticCentersAB = drawHomotheticCenters(draw, fill, circleA, circleB, radiusPointsA, radiusPointsB);
      var hometheticCentersBC = drawHomotheticCenters(draw, fill, circleB, circleC, radiusPointsB, radiusPointsC);
      var hometheticCentersCA = drawHomotheticCenters(draw, fill, circleC, circleA, radiusPointsC, radiusPointsA);

      // Extend lines that are outside the connecting lines
      drawExtendedLines(draw, fill, circleA, circleB, radiusPointsA, radiusPointsB, hometheticCentersAB);
      drawExtendedLines(draw, fill, circleB, circleC, radiusPointsB, radiusPointsC, hometheticCentersBC);
      drawExtendedLines(draw, fill, circleC, circleA, radiusPointsC, radiusPointsA, hometheticCentersCA);
    };

    var drawExtendedLines = function (
      draw,
      fill,
      firstCircle,
      secondCircle,
      firstRadiusPoints,
      secondRadiusPoints,
      hometheticCenters
    ) {
      var circleConnectLine = new Line(firstCircle.center, secondCircle.center);
      if (hometheticCenters[0]) {
        var closestT_first = circleConnectLine.getClosestT(hometheticCenters[0]);
        if (closestT_first < 0.0) {
          draw.line(firstRadiusPoints[0], hometheticCenters[0], "red", 3.0, {
            dashArray: [10, 10]
          });
          draw.line(firstCircle.center, hometheticCenters[0], "magenta", 3.0, {
            dashArray: [10, 10]
          });
        }
        if (closestT_first > 1.0) {
          draw.line(secondRadiusPoints[0], hometheticCenters[0], "cyan", 3.0, {
            dashArray: [10, 10]
          });
          draw.line(secondCircle.center, hometheticCenters[0], "rgba(128,128,128, 0.55)", 3.0, {
            dashArray: [10, 10]
          });
        }
      }
      if (hometheticCenters[1]) {
        var closestT_second = circleConnectLine.getClosestT(hometheticCenters[1]);
        if (closestT_second < 0.0) {
          draw.line(firstRadiusPoints[0], hometheticCenters[1], "orange", 3.0, {
            dashArray: [10, 10]
          });
          draw.line(firstCircle.center, hometheticCenters[1], "purple", 3.0, {
            dashArray: [10, 10]
          });
        }
        if (closestT_second > 1.0) {
          draw.line(secondRadiusPoints[0], hometheticCenters[1], "green", 3.0, {
            dashArray: [10, 10]
          });
          draw.line(secondCircle.center, hometheticCenters[1], "blue", 3.0, {
            dashArray: [10, 10]
          });
        }
      }
    };

    var drawHomotheticCenters = function (draw, fill, firstCircle, secondCircle, firstRadiusPoints, secondRadiusPoints) {
      var connectCentersAB = new Line(firstCircle.center, secondCircle.center);
      var connectLinesAB = [
        new Line(firstRadiusPoints[0], secondRadiusPoints[0]),
        new Line(firstRadiusPoints[1], secondRadiusPoints[0])
      ];

      draw.line(connectCentersAB.a, connectCentersAB.b, "blue", 1.0);
      draw.line(connectLinesAB[0].a, connectLinesAB[0].b, "green", 1.0);
      draw.line(connectLinesAB[1].a, connectLinesAB[1].b, "green", 1.0);

      // Find intersection points.
      // Intersections are null when parallel, Vertex else
      var firstIntersectionAB = connectCentersAB.intersection(connectLinesAB[0]);
      var secondIntersectionAB = connectCentersAB.intersection(connectLinesAB[1]);

      if (firstIntersectionAB) {
        pb.draw.circleHandle(firstIntersectionAB, 5, "red");
      }
      if (secondIntersectionAB) {
        pb.draw.circleHandle(secondIntersectionAB, 5, "orange");
      }

      return [firstIntersectionAB, secondIntersectionAB];
    }; // END postDraw

    var drawAngleLines = function (draw, fill, circle) {
      var angleEndPoint = circle.vertAt(angle);
      pb.draw.line(circle.center, angleEndPoint, "orange", 2.0);
      var angleEndPointOpposite = circle.vertAt(angle - Math.PI);
      pb.draw.line(circle.center, angleEndPointOpposite, "grey", 2.0);
      return [angleEndPoint, angleEndPointOpposite];
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      draw.circle(circleA.center, circleA.radius, "rgba(0,192,192)", 3.0);
      draw.circle(circleB.center, circleB.radius, "rgba(0,192,192)", 3.0);
      draw.circle(circleC.center, circleC.radius, "rgba(0,192,192)", 3.0);
      // draw.circle(circleB.center, circleB.radius, "rgba(0,192,192)", 3.0);
      // draw.circle(circleB.center, circleB.radius, "grey", 2.0, { dashArray: [10, 5] });
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
    updateAnglePointA();
    pb.redraw();

    window.addEventListener("resize", function () {
      // updateCurrentBounds();
    });

    humane.log("Move the circles around.");
  });
})(globalThis);
