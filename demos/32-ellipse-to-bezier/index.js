/**
 * A script for demonstrating the basic usage of the VEllipseSector class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2021-02-24
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys({ canvas: document.getElementById("my-canvas"), fullSize: true }, GUP)
    );
    pb.drawConfig.circle.lineWidth = 1;
    // pb.drawConfig.ellipse.color = "rgba(192,192,192,0.75)";

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        drawFoci: true,
        drawNormal: true,
        fullApproximateBezier: false,
        fullBezierQuarterSegments: 4,
        fullBezierThreshold: 0.666,
        sectorApproximateBezier: false,
        sectorBezierQuarterSegments: 4,
        sectorBezierThreshold: 0.666,
        sectorBezierDrawIntervals: false,
        sectorBezierDrawHandles: false
      },
      GUP
    );

    // First create an ellipse to start with:
    //  center vertex, radius (a non-negative number) and rotation.
    var center = new Vertex(10, 10);
    var radiusH = 150.0;
    var radiusV = 200.0;
    var rotation = 0.0;

    // Create the ellipse
    var ellipse = new VEllipse(center, new Vertex(center.x + radiusH, center.y + radiusV), rotation);

    // Now create a sector from the circle
    var startAngle = (12 / 180) * Math.PI;
    var endAngle = (89 / 180) * Math.PI;
    var sector = new VEllipseSector(ellipse, startAngle, endAngle);

    // We want to change the ellipse's radii and rotation by dragging points around
    var startControlPoint = ellipse.vertAt(startAngle);
    var endControlPoint = ellipse.vertAt(endAngle);
    var rotationControlPoint = ellipse.vertAt(rotation).scale(1.2, ellipse.center);

    new VEllipseSectorHelper(sector, startControlPoint, endControlPoint, rotationControlPoint);

    // +---------------------------------------------------------------------
    // | Draw additional lines to visualize what's happening.
    // +-------------------------------------------
    pb.config.postDraw = function () {
      // Draw the basic ellipse first
      // (... there is a proper draw.ellipse function in the making ...)
      var data = VEllipseSector.ellipseSectorUtils.describeSVGArc(
        sector.ellipse.center.x,
        sector.ellipse.center.y,
        sector.ellipse.radiusH(),
        sector.ellipse.radiusV(),
        sector.startAngle,
        sector.endAngle,
        sector.ellipse.rotation,
        { moveToStart: true }
      );
      pb.draw.path(data, "rgba(192,192,192,0.75)", 1.0);

      pb.draw.line(sector.ellipse.center, startControlPoint, "rgba(192,128,128,0.5)", 1.0);
      pb.draw.line(sector.ellipse.center, endControlPoint, "rgba(192,128,128,0.5)", 1.0);
      pb.draw.line(sector.ellipse.center, rotationControlPoint, "rgba(64,192,128,0.333)", 1.0);

      // Draw intersection points and labels (start/end)
      var pointA = sector.ellipse.vertAt(sector.startAngle);
      var pointB = sector.ellipse.vertAt(sector.endAngle);
      pb.draw.diamondHandle(pointA, 7, "rgba(128,64,128,0.5)");
      pb.draw.diamondHandle(pointB, 7, "rgba(128,64,128,0.5)");
      pb.fill.text("start", pointA.x, pointA.y);
      pb.fill.text("end", pointB.x, pointB.y);

      // Draw radii (axis helper)
      pb.draw.line(
        sector.ellipse.center
          .clone()
          .add(0, sector.ellipse.signedRadiusV())
          .rotate(sector.ellipse.rotation, sector.ellipse.center),
        sector.ellipse.axis,
        "rgba(192,192,192,0.5)"
      );
      pb.draw.line(
        sector.ellipse.center
          .clone()
          .add(sector.ellipse.signedRadiusH(), 0)
          .rotate(sector.ellipse.rotation, sector.ellipse.center),
        sector.ellipse.axis,
        "rgba(192,192,192,0.5)"
      );

      drawCircle(sector.startAngle, sector.endAngle);
      if (config.drawNormal) {
        drawNormal();
      }
      if (config.drawFoci) {
        drawFoci();
      }
      if (config.fullApproximateBezier) {
        drawFullBezier();
        drawFullEquidistantVertices();
      }
      if (config.sectorApproximateBezier) {
        drawSectorBezier();
      }
    };

    /**
     * For comparison draw a circle inside the ellipse.
     */
    var drawCircle = function (newStartAngle, newEndAngle) {
      var a = _circle.vertAt(sector.startAngle + ellipse.rotation);
      var b = _circle.vertAt(sector.endAngle + ellipse.rotation);
      pb.draw.diamondHandle(a, 7, "rgba(128,64,128,0.5)");
      pb.draw.diamondHandle(b, 7, "rgba(128,64,128,0.5)");

      var csec = CircleSector.circleSectorUtils.describeSVGArc(
        _circle.center.x,
        _circle.center.y,
        _circle.radius,
        sector.startAngle + sector.ellipse.rotation,
        sector.endAngle + sector.ellipse.rotation
      );
      pb.draw.path(csec, "rgba(255,0,0,0.25)", 2);
    };
    var _circle = new Circle(center, ((radiusH + radiusV) / 2) * 0.5);

    //---drawFoci-----------------------------------------------------
    var drawFoci = function () {
      var foci = sector.ellipse.getFoci();
      pb.fill.circleHandle(foci[0], 3, "orange");
      pb.fill.circleHandle(foci[1], 3, "orange");
      var point = sector.ellipse.vertAt(sector.startAngle);
      pb.draw.line(point, foci[0], "rgba(192,192,0,0.5)", 1);
      pb.draw.line(point, foci[1], "rgba(192,192,0,0.5)", 1);
    };

    //---drawNormal-----------------------------------------------------
    var drawNormal = function () {
      var normal = ellipse.normalAt(sector.startAngle, 50);
      pb.draw.line(normal.a, normal.b, "red", 1);
    };

    //---drawFullBezier-----------------------------------------------------
    var drawFullBezier = function () {
      var bezierCurves = sector.ellipse
        .clone()
        .scale(1.05)
        .toCubicBezier(config.fullBezierQuarterSegments, config.fullBezierThreshold);
      for (var i = 0; i < bezierCurves.length; i++) {
        var curve = bezierCurves[i];
        pb.draw.cubicBezier(
          curve.startPoint,
          curve.endPoint,
          curve.startControlPoint,
          curve.endControlPoint,
          "rgb(255,128,0)",
          2
        );
      }
    };

    //---drawFullEquidistantVertices-----------------------------------------------------
    var drawFullEquidistantVertices = function () {
      var vertices = sector.ellipse.getEquidistantVertices(config.QuarterSegments);
      for (var i = 0; i < vertices.length; i++) {
        pb.draw.circleHandle(vertices[i], 5, "orange");
        pb.draw.line(sector.ellipse.center, vertices[i], "grey", 1);
      }
    };

    //---drawSectorBezier-----------------------------------------------------
    var drawSectorBezier = function () {
      var bezierCurves = new VEllipseSector(sector.ellipse.clone().scale(0.95), sector.startAngle, sector.endAngle).toCubicBezier(
        config.sectorBezierQuarterSegments,
        config.sectorBezierThreshold
      );
      for (var i = 0; i < bezierCurves.length; i++) {
        var curve = bezierCurves[i];
        if (config.sectorBezierDrawIntervals) {
          pb.draw.circleHandle(curve.startPoint.clone().scale(1.1, sector.ellipse.center), 5, "orange");
          pb.draw.text("" + i, curve.startPoint.x, curve.startPoint.y, 0, "black");
        }
        if (i + 1 == bezierCurves.length) {
          pb.draw.circleHandle(curve.endPoint.clone().scale(1.1, sector.ellipse.center), 5, "orange");
          if (config.sectorBezierDrawIntervals) {
            pb.draw.text("" + (i + 1), curve.endPoint.x, curve.endPoint.y, 0, "green");
          }
        }
        if (config.sectorBezierDrawIntervals) {
          pb.draw.line(sector.ellipse.center, curve.startPoint, "grey", 1);
        }
        pb.draw.cubicBezier(curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint, "teal", 2);
        if (config.sectorBezierDrawHandles) {
          pb.draw.diamondHandle(curve.startControlPoint, 3, "blue");
          pb.draw.diamondHandle(curve.endControlPoint, 3, "blue");
        }
      }
    };

    // Now add the sector to your canvas
    // pb.add(ellipse);
    pb.add(sector);
    pb.add([startControlPoint, endControlPoint, rotationControlPoint]);
    pb.add(_circle);

    // Create a gui for testing with scale
    var gui = pb.createGUI();
    // prettier-ignore
    gui.add(config, "drawFoci").name("Draw foci").onChange(function () { pb.redraw(); });
    // prettier-ignore
    gui.add(config, "drawNormal").name("Draw normal").onChange(function () { pb.redraw(); });
    var fold0 = gui.addFolder("Full Bézier Approximation");
    // prettier-ignore
    fold0.add(config, "fullApproximateBezier").name("Approximate Bézier").onChange(function () { pb.redraw(); });
    // prettier-ignore
    fold0.add(config, "fullBezierQuarterSegments").name("Bézier Segments").min(1).max(8).step(1).onChange(function () {pb.redraw();});
    // prettier-ignore
    fold0.add(config, "fullBezierThreshold").name("Threshold").min(0.0).max(1.0).onChange(function () { pb.redraw();});
    fold0.open();
    var fold1 = gui.addFolder("Sector Bézier Approximation");
    // prettier-ignore
    fold1.add(config, "sectorApproximateBezier").name("Approximate Bézier").onChange(function () { pb.redraw(); });
    // prettier-ignore
    fold1.add(config, "sectorBezierQuarterSegments").name("Bézier Segments").min(1).max(8).step(1).onChange(function () { pb.redraw();});
    // prettier-ignore
    fold1.add(config, "sectorBezierThreshold").name("Threshold").min(0.0).max(1.0).onChange(function () { pb.redraw(); });
    // prettier-ignore
    fold1.add(config, "sectorBezierDrawIntervals").name("Draw intervals").onChange(function () { pb.redraw(); });
    // prettier-ignore
    fold1.add(config, "sectorBezierDrawHandles").name("Draw handles").onChange(function () { pb.redraw(); });
    fold1.open();

    pb.redraw();
  });
})(window);
