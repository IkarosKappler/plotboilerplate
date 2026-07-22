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
      colorCenterConnectLine: params.getString("colorCenterConnectLine", "#0048e0"),
      colorRadiusConnectLine: params.getString("colorRadiusConnectLine", "#00e048"),
      isTwoCircles: params.getBoolean("isTwoCircles", true),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;
    appContext.onTwoCircleSettingChanged = function () {
      //
      circleC.center.attr.visible = !appContext.config.isTwoCircles;
      radiusPointC.attr.visible = !appContext.config.isTwoCircles;
      appContext.pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var circleA = null;
    var circleB = null;
    var circleC = null;
    var angle = 0.0;
    var anglePointA = null;

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

      var radiusPointsA = drawAngleLines(draw, fill, circleA);
      var radiusPointsB = drawAngleLines(draw, fill, circleB);
      var radiusPointsC = appContext.config.isTwoCircles ? null : drawAngleLines(draw, fill, circleC);

      var hometheticCentersAB = drawHomotheticCenters(draw, fill, circleA, circleB, radiusPointsA, radiusPointsB);
      var hometheticCentersBC = appContext.config.isTwoCircles
        ? null
        : drawHomotheticCenters(draw, fill, circleB, circleC, radiusPointsB, radiusPointsC);
      var hometheticCentersCA = appContext.config.isTwoCircles
        ? null
        : drawHomotheticCenters(draw, fill, circleC, circleA, radiusPointsC, radiusPointsA);

      // Extend lines that are outside the connecting lines
      drawExtendedLines(draw, fill, circleA, circleB, radiusPointsA, radiusPointsB, hometheticCentersAB);
      if (!appContext.config.isTwoCircles) {
        drawExtendedLines(draw, fill, circleB, circleC, radiusPointsB, radiusPointsC, hometheticCentersBC);
        drawExtendedLines(draw, fill, circleC, circleA, radiusPointsC, radiusPointsA, hometheticCentersCA);
      }

      // Visualize the angle control point to make it more prominent.

      draw.diamondHandle(anglePointA, 13, "magenta");
      draw.diamondHandle(radiusPointA, 13, "cyan");
      draw.diamondHandle(radiusPointB, 13, "cyan");
      if (!appContext.config.isTwoCircles) {
        draw.diamondHandle(radiusPointC, 13, "cyan");
      }

      var pointA = hometheticCentersAB[1];
      var pointB = appContext.config.isTwoCircles ? null : hometheticCentersBC[1];
      var pointC = appContext.config.isTwoCircles ? null : hometheticCentersCA[0];
      // var resultCircle = Triangle.utils.calcCircumcircle(pointA, pointB, pointC);
      // var resultCircle = new Triangle(pointA, pointB, pointC).getCircumcircle();
      // var resultCircle = new Triangle(pointA, pointB, pointC).getMinimumEnclosingCircle();

      pb.draw.circleHandle(pointA, 5, "violet");
      if (!appContext.config.isTwoCircles) {
        pb.draw.circleHandle(pointB, 5, "violet");
        pb.draw.circleHandle(pointC, 5, "violet");
      }
      // this.center = new Vertex(tmpCircle.center.x, tmpCircle.center.y);
      // this.radius = tmpCircle.radius;
      // this.radius_squared = tmpCircle.radius_squared;
      // draw.circle(resultCircle.center, resultCircle.radius, "rgba(0,192,192,0.5)", 1.0);
    };

    // +---------------------------------------------------------------------------------
    // | Draw extented lines from the homothetic centers. The centers might
    // | be located beyond both points (not between them), so extend the
    // | circle connect line and radius connect line.
    // +-------------------------------
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
      // Draw the extended lines for the first homothetic center ...
      if (hometheticCenters[0]) {
        drawExtendedHomotherticCenterLine(
          draw,
          fill,
          circleConnectLine,
          firstRadiusPoints,
          secondRadiusPoints,
          hometheticCenters[0]
        );
      }
      // ... and also for the second one.
      if (hometheticCenters[1]) {
        drawExtendedHomotherticCenterLine(
          draw,
          fill,
          circleConnectLine,
          firstRadiusPoints,
          secondRadiusPoints,
          hometheticCenters[1]
        );
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw extented lines from one homothetic center. The center might
    // | be located beyond both points (not between them), so extend the
    // | circle connect line and radius connect line.
    // +-------------------------------
    var drawExtendedHomotherticCenterLine = function (
      draw,
      fill,
      circleCentersConnectLine,
      firstRadiusPoints,
      secondRadiusPoints,
      hometheticCenter
    ) {
      var closestT_first = circleCentersConnectLine.getClosestT(hometheticCenter);
      if (closestT_first < 0.0) {
        draw.line(firstRadiusPoints[0], hometheticCenter, appContext.config.colorRadiusConnectLine, 2.0, {
          dashArray: [10, 5]
        });
        draw.line(circleCentersConnectLine.a, hometheticCenter, appContext.config.colorCenterConnectLine, 2.0, {
          dashArray: [10, 5]
        });
      }
      if (closestT_first > 1.0) {
        draw.line(secondRadiusPoints[0], hometheticCenter, appContext.config.colorRadiusConnectLine, 2.0, {
          dashArray: [10, 5]
        });
        draw.line(circleCentersConnectLine.b, hometheticCenter, appContext.config.colorCenterConnectLine, 2.0, {
          dashArray: [10, 5]
        });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Calculate and draw the homothetic centers of two crircles and their radius points.
    // | The function will return a 2-element array with the two calculated points.
    // +-------------------------------
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

    // +---------------------------------------------------------------------------------
    // | This method just draw radius lines to visualize the
    // | currently configured angle in the given circle.
    // | Also the method will return both radius end points.
    // +-------------------------------
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
      if (!appContext.config.isTwoCircles) {
        draw.circle(circleC.center, circleC.radius, "rgba(0,192,192)", 3.0);
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
    updateAnglePointA();
    // pb.redraw();
    appContext.onTwoCircleSettingChanged(); // This will trigger a redraw
    humane.log("Move the circles around.");
  });
})(globalThis);
