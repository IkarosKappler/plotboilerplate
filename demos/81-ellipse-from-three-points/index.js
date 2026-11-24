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
  var RAD_TO_DEG = 180.0 / Math.PI;

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
      // Must be in -PI/2 ... +PI/2
      focalControlAngleDeg: params.getNumber("focalControlAngleDeg", 0.0), // In Degrees!
      numMaxIterations: params.getNumber("numMaxIterations", 100),
      findCorrectAngle: function () {
        appContext.findCorrectAngle();
      },
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobileDevice();
    appContext.updateFocalControlPoint = function () {
      focalControlPoint.set(
        circle.vertAt(circleSector.startAngle + Math.PI / 2.0 - appContext.config.focalControlAngleDeg * DEG_TO_RAD)
      );
      pb.redraw();
    };
    appContext.updateHelperCircle = function () {
      circle.center.set(lineAB.vertAt(0.5));
      circle.radius = lineAB.length() / 2.0;
      // cirleSector = new CircleSector(circle, lineAB.angle(), lineAB.angle() + Math.PI);
      circleSector.startAngle = lineAB.angle();
      circleSector.endAngle = lineAB.angle() + Math.PI;
    };
    appContext.updatePoints = function () {
      // We define folliwing two conditions to the three points:
      //  (a) The line A→B must be the longest one from the triangle.
      //  (b) The trinangle (A,B,C) must be in clockwise winding order.
      var lengthAB = inputPointA.distance(inputPointB);
      var lengthBC = inputPointB.distance(inputPointC);
      var lengthCA = inputPointC.distance(inputPointA);
      if (lengthAB >= lengthBC && lengthAB >= lengthCA) {
        pointA.set(inputPointA);
        pointB.set(inputPointB);
        pointC.set(inputPointC);
      } else if (lengthBC >= lengthCA && lengthBC >= lengthAB) {
        pointA.set(inputPointB);
        pointB.set(inputPointC);
        pointC.set(inputPointA);
      } else {
        // CA is the longest edge
        pointA.set(inputPointC);
        pointB.set(inputPointA);
        pointC.set(inputPointB);
      }

      // Triangle must be clockwise.
      if (!Triangle.utils.isClockwise(pointA, pointB, pointC)) {
        // Swap A and B
        var tmp = pointA.clone();
        pointA.set(pointB);
        pointB.set(tmp);
      }
    };
    appContext.findCorrectAngle = function () {
      var beginAngleRad = 0.0; // Math.PI / 2.0;
      var endAngleRad = Math.PI / 2.0; // 0.0;
      tempEllipses = [];
      var newFocalControlAngleDeg = findCorrectAngleRecursive(beginAngleRad, endAngleRad, appContext.config.numMaxIterations);
      appContext.config.focalControlAngleDeg = newFocalControlAngleDeg * RAD_TO_DEG; // lineAFocal.angle() * RAD_TO_DEG;
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
      pb.redraw();
    };
    appContext.clearCachedIterations = function () {
      tempEllipses = [];
    };

    // +---------------------------------------------------------------------------------
    // | Find angle recursively.
    // +-------------------------------
    var findCorrectAngleRecursive = function (beginAngleRad, endAngleRad, iterCount) {
      // var newFocalControlAngleDeg = Math.PI / 4.0;
      // Bisect the begin- and end-angle
      var newFocalControlAngleDeg = beginAngleRad + (endAngleRad - beginAngleRad) / 2.0;
      if (iterCount <= 0) {
        return newFocalControlAngleDeg;
      }
      var focalAngle = newFocalControlAngleDeg * RAD_TO_DEG;
      var nextEllipse = calculateNextStep(newFocalControlAngleDeg * RAD_TO_DEG);
      tempEllipses.push({ ellipse: nextEllipse, focalAngle: focalAngle });
      // Why is this not working
      if (nextEllipse.containsPoint(pointC)) {
        // ...
        return findCorrectAngleRecursive(newFocalControlAngleDeg, endAngleRad, iterCount - 1);
      } else {
        return findCorrectAngleRecursive(beginAngleRad, newFocalControlAngleDeg, iterCount - 1);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var inputPointA = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointB = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointC = pb.viewport().randomPoint(0.333, 0.333);
    var focalControlPoint = new Vertex(0.0);
    focalControlPoint.attr.draggable = false;
    var circle = new Circle(new Vertex(0.0), 100.0);
    var circleSector = new CircleSector(circle, -Math.PI / 2.0, Math.PI / 2.0);
    pb.add([inputPointA, inputPointB, inputPointC, focalControlPoint]);

    // For the algorithm we need the line A-B to be the longest one from the triangle.
    var pointA = inputPointA.clone();
    var pointB = inputPointB.clone();
    var pointC = inputPointC.clone();
    var lineAB = new Line(pointA, pointB);

    // Array<{ellipse,focalAngle}>
    var tempEllipses = [];

    // var finalEllipse = null;

    // +---------------------------------------------------------------------------------
    // | Install listeners
    // +-------------------------------
    inputPointA.listeners.addDragListener(function () {
      appContext.clearCachedIterations();
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
    });
    inputPointB.listeners.addDragListener(function () {
      appContext.clearCachedIterations();
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
    });
    inputPointC.listeners.addDragListener(function () {
      appContext.clearCachedIterations();
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
    });

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      draw.line(pointA, pointB, "orange", 2.0);
      var bisector = lineAB.perpBisector();
      draw.line(bisector.a, bisector.b, "orange", 1.0);

      var viewport = pb.viewport();
      var extendedBisectorLine = viewport.expandLine(bisector);
      // console.log("extendedLine", extendedLine);
      if (extendedBisectorLine) {
        // If the line moved out of the viewport there will be no extended line.
        draw.line(extendedBisectorLine.a, extendedBisectorLine.b, "grey", 1.0);
      }

      testDrawExpandedIntersection(draw, fill);

      // Draw the helper circle arc
      var circleArcStartPoint = circleSector.getStartPoint();
      var circleArcEndPoint = circleSector.getEndPoint();
      draw.circleArc(circle.center, circle.radius, circleSector.startAngle, circleSector.endAngle, "orange", 1.0);
      fill.text("Start: " + circleSector.startAngle * RAD_TO_DEG.toFixed(1), circleArcStartPoint.x, circleArcStartPoint.y, {
        color: "orange"
      });
      fill.text("End: " + circleSector.endAngle * RAD_TO_DEG.toFixed(1), circleArcEndPoint.x, circleArcEndPoint.y, {
        color: "orange"
      });

      draw.line(pointA, focalControlPoint, "rgba(0,192,192,0.5)", 2.0);
      draw.line(pointB, focalControlPoint, "rgba(0,192,192,0.5)", 2.0);

      // Create ellipse
      var axis1 = new Line(pointA, focalControlPoint);
      var axis2 = new Line(pointB, focalControlPoint);
      // var axisControlPoint = new Vertex(focalControlPoint.x - pointA.x, focalControlPoint.y - pointA.y);
      var axisControlPoint = focalControlPoint.clone().scale(-1.0, circle.center);

      // var ellipse = new VEllipse(focalControlPoint, axisControlPoint, axis1.angle());
      var ellipse = calculateNextStep(bisector, appContext.config.focalControlAngleDeg);
      draw.ellipse(
        ellipse.center,
        ellipse.radiusH(), // radiusX: number,
        ellipse.radiusV(), // radiusY: number,
        "yellow",
        1.0,
        ellipse.rotation,
        { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
      );

      // Find intersection of line through C and the current ellipse
      var colinearLine = bisector.getColinear(pointC);
      var extendedcolinearLine = viewport.expandLine(colinearLine);
      if (extendedcolinearLine) {
        // If the line moved out of the viewport there will be no extended line.
        draw.line(extendedcolinearLine.a, extendedcolinearLine.b, "grey", 1.0, { dashArray: [5, 5] });
      }

      var finalEllipse = calculateApproximation(draw, fill);

      // Draw final ellipse
      if (finalEllipse) {
        draw.ellipse(
          finalEllipse.center,
          finalEllipse.radiusH(), // radiusX: number,
          finalEllipse.radiusV(), // radiusY: number,
          "orange",
          1.0,
          finalEllipse.rotation,
          { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
        );
      }

      drawTempEllipses(draw, fill);
    };

    // +---------------------------------------------------------------------------------
    // |Just a helper draw function.
    // +-------------------------------
    var drawTempEllipses = function (draw, fill) {
      console.log("tempEllipses", tempEllipses);
      var startColor = Color.parse("violet");
      var endColor = Color.parse("cyan");
      console.log("startColor", startColor, "endColor", endColor);
      for (var i = 0; i < tempEllipses.length; i++) {
        var curColor = startColor.clone().interpolate(endColor, i / (tempEllipses.length - 1));
        var colorStr = curColor.setAlpha(0.25).cssRGBA();
        console.log("colorStr", colorStr);
        var ellipse = tempEllipses[i].ellipse;
        var focalAngle = tempEllipses[i].focalAngle;
        draw.ellipse(
          ellipse.center,
          ellipse.radiusH(), // radiusX: number,
          ellipse.radiusV(), // radiusY: number,
          colorStr, // "violet",
          1.0,
          ellipse.rotation,
          { dashArray: [2, 2] } // strokeOptions?: StrokeOptions
        );
        var tmpFocalAnglePoint = circleSector.vertAt(focalAngle);
        // console.log("tmpFocalAnglePoint", tmpFocalAnglePoint);
        draw.polyline([pointA, tmpFocalAnglePoint, pointB], true, colorStr, 1.0);
        fill.text("" + i, tmpFocalAnglePoint.x, tmpFocalAnglePoint.y, { color: colorStr });
      }
    };

    var calculateApproximation = function (draw, fill) {
      var ellipse = null;

      var bisector = lineAB.perpBisector();
      var viewport = pb.viewport();
      // var extendedBisectorLine = viewport.expandLine(bisector);
      var colinearLine = bisector.getColinear(pointC);
      // var extendedcolinearLine = viewport.expandLine(colinearLine);
      var stepNo = 0;
      var stepSize = Math.PI / 2.0;
      var currentFocalControlAngle = appContext.config.focalControlAngleDeg;
      var maxStep = 100;
      var recentIntersectionDists = null;
      var stop = false;
      var finalEllipse;
      var lastEllipse;
      var finalFocalControlAngle = 0;
      while (stepNo++ < maxStep && !stop) {
        ellipse = calculateNextStep(currentFocalControlAngle);
        // Find intersection of colinear line and ellipse
        var intersections = ellipse.lineIntersections(colinearLine);
        draw.crosshair(intersections[0], 6, "red");
        draw.crosshair(intersections[1], 6, "red");

        // Direction?
        var direction = 1; // right (1) or left (-1)
        var distAlpha = pointC.distance(intersections[0]);
        var distBeta = pointC.distance(intersections[1]);
        currentFocalControlAngle += direction * stepSize;
        // stepSize /= 2.0;

        // ellipse = calculateNextStep(extendedBisectorLine, currentFocalControlAngle);
        draw.ellipse(
          ellipse.center,
          ellipse.radiusH(), // radiusX: number,
          ellipse.radiusV(), // radiusY: number,
          "rgba(128,192,0,0.2)",
          1.0,
          ellipse.rotation,
          { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
        );

        // if (Math.abs(distAlpha, distBeta) < 1.0) {
        //   stop = true;
        // }
        if (distAlpha < 1.0 || distBeta < 1.0) {
          stop = true;
          finalEllipse = ellipse;
          finalFocalControlAngle = currentFocalControlAngle;
        }
        if (recentIntersectionDists && (recentIntersectionDists[0] < distAlpha || recentIntersectionDists[1] < distBeta)) {
          // stop = true;
          stepSize * 0.9;
          direction *= -1;
        }
        console.log(
          "[stepNo=" + stepNo + "] currentFocalControlAngle",
          currentFocalControlAngle,
          "stepSize",
          stepSize,
          "distAlpha",
          distAlpha,
          "distBeta",
          distBeta
        );

        recentIntersectionDists = [distAlpha, distBeta];
        lastEllipse = ellipse;
      } // END while

      console.log("finalFocalControlAngle", finalFocalControlAngle);
      // appContext.config.focalControlAngleDeg = finalFocalControlAngle;
      return finalEllipse;
    };

    var calculateNextStep = function (focalControlAngleDeg) {
      // Create ellipse
      var localFocalControlPoint = circle.vertAt(circleSector.startAngle + Math.PI / 2.0 - focalControlAngleDeg * DEG_TO_RAD);
      var axis1 = new Line(pointA, localFocalControlPoint);
      var axis2 = new Line(pointB, localFocalControlPoint);
      // var axisControlPoint = new Vertex(focalControlPoint.x - pointA.x, focalControlPoint.y - pointA.y);
      var axisControlPoint = localFocalControlPoint.clone().scale(-1.0, circle.center);

      var ellipse = new VEllipse(localFocalControlPoint, axisControlPoint, axis1.angle());
      //  draw.ellipse(
      //    ellipse.center,
      //    ellipse.radiusH(), // radiusX: number,
      //    ellipse.radiusV(), // radiusY: number,
      //    "yellow",
      //    1.0,
      //    ellipse.rotation,
      //    { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
      //  );

      return ellipse;
    };

    var testDrawExpandedIntersection = function (draw, fill) {
      var bisector = new Line(inputPointA, inputPointB).perpBisector();
      var viewport = pb.viewport();
      var north = viewport.getNorthBound();
      var east = viewport.getEastBound();
      var west = viewport.getWestBound();
      var south = viewport.getSouthBound();
      draw.line(north.a, north.b, "rgba(0,255,0,0.5)", 5);
      draw.line(east.a, east.b, "rgba(0,255,0,0.5)", 5);
      draw.line(west.a, west.b, "rgba(0,255,0,0.5)", 5);
      draw.line(south.a, south.b, "rgba(0,255,0,0.5)", 5);
      var intersections = [
        north.intersection(bisector, true),
        east.intersection(bisector, true),
        south.intersection(bisector, true),
        west.intersection(bisector, true)
      ];

      if (intersections[0]) {
        draw.crosshair(intersections[0], 6, "red");
      }
      if (intersections[1]) {
        draw.crosshair(intersections[1], 6, "red");
      }
      if (intersections[2]) {
        draw.crosshair(intersections[2], 6, "red");
      }
      if (intersections[3]) {
        draw.crosshair(intersections[3], 6, "red");
      }
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

    appContext.updatePoints();
    appContext.updateHelperCircle();
    appContext.updateFocalControlPoint();
    // pb.redraw();
    humane.log("Move the three vertices around.");
  });
})(globalThis);
