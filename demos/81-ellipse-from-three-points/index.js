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
      approxFirstCorrectAngle: params.getBoolean("approxFirstCorrectAngle", true),
      approxSecondCorrectAngle: params.getBoolean("approxSecondCorrectAngle", false),
      showLinearApproximation: params.getBoolean("showLinearApproximation", false),
      drawCachedEllipsed: params.getBoolean("drawCachedEllipsed", false),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobileDevice();
    appContext.handleApproximationSettingsChanged = function () {
      approximate();
      appContext.pb.redraw();
    };
    appContext.clearCachedIterations = function () {
      firstCachedEllipses = [];
      secondCachedEllipses = [];
    };
    var findCorrectAngle = function (beginAngleRad, endAngleRad, cachedEllipses) {
      cachedEllipses.splice(); // Empty buffer
      var newFocalControlAngleDeg = ellipseApproximation.findCorrectAngleRecursive(
        beginAngleRad,
        endAngleRad,
        appContext.config.numMaxIterations,
        cachedEllipses
      );
      return newFocalControlAngleDeg;
    };

    // +---------------------------------------------------------------------------------
    // | Re-calculat the first and/or the second ellipse – if requested by config.
    // +-------------------------------
    var approximate = function () {
      if (appContext.config.approxFirstCorrectAngle) {
        firstResultFocalAngle = findCorrectAngle(0.0, Math.PI / 2.0, firstCachedEllipses);
      }
      if (appContext.config.approxSecondCorrectAngle) {
        secondResultFocalAngle = findCorrectAngle(0.0, -Math.PI / 2.0, secondCachedEllipses);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var inputPointA = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointB = pb.viewport().randomPoint(0.333, 0.333);
    var inputPointC = pb.viewport().randomPoint(0.333, 0.333);

    // Array<{ellipse,focalAngle}>
    var firstCachedEllipses = [];
    var secondCachedEllipses = [];
    var firstResultFocalAngle = 0;
    var secondResultFocalAngle = 0;

    // +---------------------------------------------------------------------------------
    // | This helper class will to the approximation for us.
    // +-------------------------------
    var ellipseApproximation = new EllipseFromThreePointsApproximation(inputPointA, inputPointB, inputPointC);
    ellipseApproximation.focalControlPoint.attr.draggable = false;
    pb.add([inputPointA, inputPointB, inputPointC, ellipseApproximation.focalControlPoint]);

    var handlePointMoved = function () {
      appContext.clearCachedIterations();
      ellipseApproximation.arrangeInputPoints();
      ellipseApproximation.updateHelperCircle();
      ellipseApproximation.updateFocalControlPoint(appContext.config.focalControlAngleDeg * DEG_TO_RAD);
      approximate();
      appContext.pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Install listeners
    // +-------------------------------
    inputPointA.listeners.addDragListener(handlePointMoved);
    inputPointB.listeners.addDragListener(handlePointMoved);
    inputPointC.listeners.addDragListener(handlePointMoved);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(pb.config.backgroundColor).cssRGB();

      draw.line(ellipseApproximation.pointA, ellipseApproximation.pointB, "orange", 2.0);
      var bisector = ellipseApproximation.lineAB.perpBisector();
      draw.line(bisector.a, bisector.b, "orange", 1.0);

      drawEllipseFromFocalAngle(draw, fill, appContext.config.focalControlAngleDeg * DEG_TO_RAD, "rgba(192,128,0,0.5)");

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
        "Start: " + (ellipseApproximation.circleSector.startAngle * RAD_TO_DEG).toFixed(1),
        circleArcStartPoint.x,
        circleArcStartPoint.y,
        {
          color: "orange"
        }
      );
      fill.text(
        "End: " + (ellipseApproximation.circleSector.endAngle * RAD_TO_DEG).toFixed(1),
        circleArcEndPoint.x,
        circleArcEndPoint.y,
        {
          color: "orange"
        }
      );

      draw.line(ellipseApproximation.pointA, ellipseApproximation.focalControlPoint, "rgba(0,192,192,0.5)", 2.0);
      draw.line(ellipseApproximation.pointB, ellipseApproximation.focalControlPoint, "rgba(0,192,192,0.5)", 2.0);

      // drawEllipseFromFocalAngle(draw, fill, firstResultFocalAngle);
      // drawEllipseFromFocalAngle(draw, fill, secondResultFocalAngle);

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

      // Draw?
      if (appContext.config.approxFirstCorrectAngle) {
        drawCachedEllipses(draw, fill, firstCachedEllipses);
        drawEllipseFromFocalAngle(draw, fill, firstResultFocalAngle, "rgba(192,128,0,1.0)");
      }
      if (appContext.config.approxSecondCorrectAngle) {
        drawCachedEllipses(draw, fill, secondCachedEllipses);
        drawEllipseFromFocalAngle(draw, fill, secondResultFocalAngle, "rgba(192,128,0,1.0)");
      }
    };

    var drawEllipseFromFocalAngle = function (draw, fill, focalAngle, color) {
      var configuredEllipse = ellipseApproximation.calculateNextStep(focalAngle); // appContext.config.focalControlAngleDeg * DEG_TO_RAD);
      draw.ellipse(
        configuredEllipse.center,
        configuredEllipse.radiusH(),
        configuredEllipse.radiusV(),
        color,
        1.0,
        configuredEllipse.rotation,
        { dashArray: [5, 5] } // StrokeOptions
      );
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
    var drawCachedEllipses = function (draw, fill, cachedEllipses) {
      if (!appContext.config.drawCachedEllipsed) {
        return;
      }
      // console.log("cachedEllipses", cachedEllipses);
      var startColor = Color.parse("violet");
      var endColor = Color.parse("cyan");
      // console.log("startColor", startColor, "endColor", endColor);
      for (var i = 0; i < cachedEllipses.length; i++) {
        var isFinalEllipse = i + 1 >= cachedEllipses.length;
        var curColor = startColor.clone().interpolate(endColor, i / (cachedEllipses.length - 1));
        var colorStr = curColor.setAlpha(0.25).cssRGBA();
        // console.log("colorStr", colorStr);
        var ellipse = cachedEllipses[i].ellipse;
        var focalAngle = cachedEllipses[i].focalAngle;
        draw.ellipse(
          ellipse.center,
          ellipse.radiusH(), // radiusX
          ellipse.radiusV(), // radiusY
          isFinalEllipse ? "orange" : colorStr,
          isFinalEllipse ? 2.0 : 1.0,
          ellipse.rotation,
          { dashArray: [2, 2] } // strokeOptions?: StrokeOptions
        );
        var tmpFocalAnglePoint = ellipseApproximation.circleSector.vertAt(focalAngle);
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

    handlePointMoved();
    humane.log("Move the three vertices around.");
  });
})(globalThis);
