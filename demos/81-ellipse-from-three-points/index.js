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
      showLinearApproximation: params.getBoolean("showLinearApproximation", false),
      findFirstCorrectAngle: function () {
        appContext.findCorrectAngle(0.0, Math.PI / 2.0);
      },
      findSecondCorrectAngle: function () {
        appContext.findCorrectAngle(0.0, -Math.PI / 2.0);
      },
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobileDevice();
    appContext.updateFocalControlPoint = function () {
      ellipseApproximation.updateFocalControlPoint(appContext.config.focalControlAngleDeg * DEG_TO_RAD);
      pb.redraw();
    };
    appContext.updateHelperCircle = function () {
      ellipseApproximation.updateHelperCircle();
    };
    appContext.updatePoints = function () {
      // We define folliwing two conditions to the three points:
      //  (a) The line A→B must be the longest one from the triangle.
      //  (b) The trinangle (A,B,C) must be in clockwise winding order.
      ellipseApproximation.arrangeInputPoints();
    };
    appContext.findCorrectAngle = function (beginAngleRad, endAngleRad) {
      // var beginAngleRad = 0.0; // Math.PI / 2.0;
      // var endAngleRad = Math.PI / 2.0; // 0.0;
      cachedEllipses = [];
      var newFocalControlAngleDeg = findCorrectAngleRecursive(beginAngleRad, endAngleRad, appContext.config.numMaxIterations);
      appContext.config.focalControlAngleDeg = newFocalControlAngleDeg * RAD_TO_DEG; // lineAFocal.angle() * RAD_TO_DEG;
      appContext.updatePoints();
      appContext.updateHelperCircle();
      appContext.updateFocalControlPoint();
      pb.redraw();
    };
    appContext.clearCachedIterations = function () {
      cachedEllipses = [];
    };

    // +---------------------------------------------------------------------------------
    // | Find angle recursively.
    // +-------------------------------
    var findCorrectAngleRecursive = function (beginAngleRad, endAngleRad, iterCount) {
      // var newFocalControlAngleDeg = Math.PI / 4.0;
      // Bisect the begin- and end-angle
      var newFocalControlAngleRad = beginAngleRad + (endAngleRad - beginAngleRad) / 2.0;
      if (iterCount <= 0) {
        return newFocalControlAngleRad;
      }
      var nextEllipse = ellipseApproximation.calculateNextStep(newFocalControlAngleRad); // TODO TEST * RAD_TO_DEG);
      var focalAngleDeg = newFocalControlAngleRad * RAD_TO_DEG;
      cachedEllipses.push({ ellipse: nextEllipse, focalAngle: focalAngleDeg });
      // Why is this not working
      if (nextEllipse.containsPoint(ellipseApproximation.pointC)) {
        // ...
        return findCorrectAngleRecursive(newFocalControlAngleRad, endAngleRad, iterCount - 1);
      } else {
        return findCorrectAngleRecursive(beginAngleRad, newFocalControlAngleRad, iterCount - 1);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var inputPointA = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointB = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointC = pb.viewport().randomPoint(0.333, 0.333);

    // Array<{ellipse,focalAngle}>
    var cachedEllipses = [];

    var ellipseApproximation = new EllipseFromThreePointsApproximation(inputPointA, inputPointB, inputPointC);
    ellipseApproximation.focalControlPoint.attr.draggable = false;

    pb.add([inputPointA, inputPointB, inputPointC, ellipseApproximation.focalControlPoint]);

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

      draw.line(ellipseApproximation.pointA, ellipseApproximation.pointB, "orange", 2.0);
      var bisector = ellipseApproximation.lineAB.perpBisector();
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
      var circleArcStartPoint = ellipseApproximation.circleSector.getStartPoint();
      var circleArcEndPoint = ellipseApproximation.circleSector.getEndPoint();
      draw.circleArc(
        ellipseApproximation.circle.center,
        ellipseApproximation.circle.radius,
        ellipseApproximation.circleSector.startAngle,
        ellipseApproximation.circleSector.endAngle,
        "orange",
        1.0
      );
      fill.text(
        "Start: " + ellipseApproximation.circleSector.startAngle * RAD_TO_DEG.toFixed(1),
        circleArcStartPoint.x,
        circleArcStartPoint.y,
        {
          color: "orange"
        }
      );
      fill.text(
        "End: " + ellipseApproximation.circleSector.endAngle * RAD_TO_DEG.toFixed(1),
        circleArcEndPoint.x,
        circleArcEndPoint.y,
        {
          color: "orange"
        }
      );

      draw.line(ellipseApproximation.pointA, ellipseApproximation.focalControlPoint, "rgba(0,192,192,0.5)", 2.0);
      draw.line(ellipseApproximation.pointB, ellipseApproximation.focalControlPoint, "rgba(0,192,192,0.5)", 2.0);

      // Create ellipse
      // var ellipse = new VEllipse(focalControlPoint, axisControlPoint, axis1.angle());
      // var ellipse = ellipseApproximation.calculateNextStep(bisector, appContext.config.focalControlAngleDeg);
      var ellipse = ellipseApproximation.calculateNextStep(appContext.config.focalControlAngleDeg * DEG_TO_RAD);
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
      var colinearLine = bisector.getColinear(ellipseApproximation.pointC);
      var extendedcolinearLine = viewport.expandLine(colinearLine);
      if (extendedcolinearLine) {
        // If the line moved out of the viewport there will be no extended line.
        draw.line(extendedcolinearLine.a, extendedcolinearLine.b, "grey", 1.0, { dashArray: [5, 5] });
      }

      if (appContext.config.showLinearApproximation) {
        drawLinearApproximation(draw, fill);
      }

      drawCachedEllipses(draw, fill);
    };

    // +---------------------------------------------------------------------------------
    // |Just a helper draw function.
    // +-------------------------------
    var drawLinearApproximation = function (draw, fill) {
      var finalEllipse = calculateLinearApproximation(draw, fill);
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
    };

    // +---------------------------------------------------------------------------------
    // |Just a helper draw function.
    // +-------------------------------
    var drawCachedEllipses = function (draw, fill) {
      console.log("cachedEllipses", cachedEllipses);
      var startColor = Color.parse("violet");
      var endColor = Color.parse("cyan");
      console.log("startColor", startColor, "endColor", endColor);
      for (var i = 0; i < cachedEllipses.length; i++) {
        var isFinalEllipse = i + 1 >= cachedEllipses.length;
        var curColor = startColor.clone().interpolate(endColor, i / (cachedEllipses.length - 1));
        var colorStr = curColor.setAlpha(0.25).cssRGBA();
        // console.log("colorStr", colorStr);
        var ellipse = cachedEllipses[i].ellipse;
        var focalAngle = cachedEllipses[i].focalAngle;
        draw.ellipse(
          ellipse.center,
          ellipse.radiusH(), // radiusX: number,
          ellipse.radiusV(), // radiusY: number,
          isFinalEllipse ? "orange" : colorStr, // "violet",
          isFinalEllipse ? 2.0 : 1.0,
          ellipse.rotation,
          { dashArray: [2, 2] } // strokeOptions?: StrokeOptions
        );
        var tmpFocalAnglePoint = ellipseApproximation.circleSector.vertAt(focalAngle);
        // var tmpFocalAnglePoint = circleSector.vertAt(focalAngle - circleSector.startAngle);
        // console.log("tmpFocalAnglePoint", tmpFocalAnglePoint);
        draw.polyline([ellipseApproximation.pointA, tmpFocalAnglePoint, ellipseApproximation.pointB], true, colorStr, 1.0);
        fill.text("" + i, tmpFocalAnglePoint.x, tmpFocalAnglePoint.y, { color: colorStr });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Test calculate the linear approximation (no good results but looks fancy).
    // +-------------------------------
    var calculateLinearApproximation = function (draw, fill) {
      var ellipse = null;

      var bisector = ellipseApproximation.lineAB.perpBisector();
      var viewport = pb.viewport();
      // var extendedBisectorLine = viewport.expandLine(bisector);
      var colinearLine = bisector.getColinear(ellipseApproximation.pointC);
      // var extendedcolinearLine = viewport.expandLine(colinearLine);
      var stepNo = 0;
      var stepSize = Math.PI / 2.0;
      var currentFocalControlAngleDeg = appContext.config.focalControlAngleDeg;
      var maxStep = 100;
      var recentIntersectionDists = null;
      var stop = false;
      var finalEllipse;
      var lastEllipse;
      var finalFocalControlAngle = 0;
      while (stepNo++ < maxStep && !stop) {
        ellipse = ellipseApproximation.calculateNextStep(currentFocalControlAngleDeg * DEG_TO_RAD);
        // Find intersection of colinear line and ellipse
        var intersections = ellipse.lineIntersections(colinearLine);
        draw.crosshair(intersections[0], 6, "red");
        draw.crosshair(intersections[1], 6, "red");

        // Direction?
        var direction = 1; // right (1) or left (-1)
        var distAlpha = ellipseApproximation.pointC.distance(intersections[0]);
        var distBeta = ellipseApproximation.pointC.distance(intersections[1]);
        currentFocalControlAngleDeg += direction * stepSize;
        draw.ellipse(
          ellipse.center,
          ellipse.radiusH(), // radiusX: number,
          ellipse.radiusV(), // radiusY: number,
          "rgba(128,192,0,0.2)",
          1.0,
          ellipse.rotation,
          { dashArray: [5, 5] } // strokeOptions?: StrokeOptions
        );

        if (distAlpha < 1.0 || distBeta < 1.0) {
          stop = true;
          finalEllipse = ellipse;
          finalFocalControlAngle = currentFocalControlAngleDeg;
        }
        if (recentIntersectionDists && (recentIntersectionDists[0] < distAlpha || recentIntersectionDists[1] < distBeta)) {
          // stop = true;
          stepSize * 0.9;
          direction *= -1;
        }
        console.log(
          "[stepNo=" + stepNo + "] currentFocalControlAngle",
          currentFocalControlAngleDeg,
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

    // +---------------------------------------------------------------------------------
    // | Approach to find and draw the third point's perpendicular bisector.
    // +-------------------------------
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
