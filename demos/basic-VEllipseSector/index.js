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

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        approximateBezier: false,
        bezierSegments: 4,
        bezierThreshold: 0.666
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
    var ellipseSector = new VEllipseSector(ellipse, startAngle, endAngle);

    // We want to change the ellipse's radii and rotation by dragging points around
    var startControlPoint = ellipse.vertAt(startAngle);
    var endControlPoint = ellipse.vertAt(endAngle);
    var rotationControlPoint = ellipse.vertAt(rotation).scale(1.2, ellipse.center);

    // Now add the sector to your canvas
    pb.add(ellipse);
    pb.add([startControlPoint, endControlPoint]);
    pb.add(rotationControlPoint);

    // +---------------------------------------------------------------------
    // | Define some lines to read angles from.
    // +-------------------------------------------
    var startControlLine = new Line(ellipse.center, startControlPoint);
    var endControlLine = new Line(ellipse.center, endControlPoint);
    var rotationControlLine = new Line(ellipse.center, rotationControlPoint);

    // +---------------------------------------------------------------------
    // | Listen for the center to be moved.
    // +-------------------------------------------
    ellipseSector.ellipse.center.listeners.addDragListener(function (event) {
      startControlPoint.add(event.params.dragAmount);
      endControlPoint.add(event.params.dragAmount);
      rotationControlPoint.add(event.params.dragAmount);
    });

    // +---------------------------------------------------------------------
    // | Listen for rotation changes.
    // +-------------------------------------------
    rotationControlPoint.listeners.addDragListener(function (event) {
      var newRotation = rotationControlLine.angle();
      var rDiff = newRotation - ellipse.rotation;
      ellipse.rotation = newRotation;
      ellipseSector.ellipse.axis.rotate(rDiff, ellipseSector.ellipse.center);
      startControlPoint.rotate(rDiff, ellipseSector.ellipse.center);
      endControlPoint.rotate(rDiff, ellipseSector.ellipse.center);
    });

    // +---------------------------------------------------------------------
    // | Listen for start angle changes.
    // +-------------------------------------------
    startControlPoint.listeners.addDragListener(function (event) {
      ellipseSector.startAngle = startControlLine.angle() - ellipse.rotation;
    });

    // +---------------------------------------------------------------------
    // | Listen for end angle changes.
    // +-------------------------------------------
    endControlPoint.listeners.addDragListener(function (event) {
      ellipseSector.endAngle = endControlLine.angle() - ellipse.rotation;
    });

    // +---------------------------------------------------------------------
    // | Draw additional lines to visualize what's happening.
    // +-------------------------------------------
    pb.config.postDraw = function () {
      pb.draw.line(startControlLine.a, startControlLine.b, "rgba(192,128,128,0.5)", 1.0);
      pb.draw.line(endControlLine.a, endControlLine.b, "rgba(192,128,128,0.5)", 1.0);
      pb.draw.line(rotationControlLine.a, rotationControlLine.b, "rgba(64,192,128,0.333)", 1.0);

      // Draw the arc
      var pathData = VEllipseSector.ellipseSectorUtils.describeSVGArc(
        ellipseSector.ellipse.center.x,
        ellipseSector.ellipse.center.y,
        ellipseSector.ellipse.radiusH(),
        ellipseSector.ellipse.radiusV(),
        ellipseSector.startAngle,
        ellipseSector.endAngle,
        ellipseSector.ellipse.rotation,
        { moveToStart: true }
      );
      pb.draw.path(pathData, "rgba(255,0,0,0.5)", 2);

      // Draw intersection point and labels (start/end)
      var newStartPoint = ellipse.vertAt(ellipseSector.startAngle);
      var newEndPoint = ellipse.vertAt(ellipseSector.endAngle);
      pb.draw.diamondHandle(newStartPoint, 7, "rgba(128,64,128,0.5)");
      pb.draw.diamondHandle(newEndPoint, 7, "rgba(128,64,128,0.5)");
      pb.fill.text("start", newStartPoint.x, newStartPoint.y);
      pb.fill.text("end", newEndPoint.x, newEndPoint.y);

      drawCircle(startAngle, endAngle);
      drawNormal();
      // drawTangent();
      // normalAt( ellipse, ellipseSector.startAngle + ellipseSector.ellipse.rotation );
      drawFoci();
      if (config.approximateBezier) {
        drawBezier();
        drawEquidistantVertices();
      }
    };

    /**
     * For comparison draw a circle inside the ellipse.
     */
    var drawCircle = function (newStartAngle, newEndAngle) {
      var a = _circle.vertAt(ellipseSector.startAngle + ellipse.rotation);
      var b = _circle.vertAt(ellipseSector.endAngle + ellipse.rotation);
      pb.draw.diamondHandle(a, 7, "rgba(128,64,128,0.5)");
      pb.draw.diamondHandle(b, 7, "rgba(128,64,128,0.5)");

      var sector = CircleSector.circleSectorUtils.describeSVGArc(
        _circle.center.x,
        _circle.center.y,
        _circle.radius,
        ellipseSector.startAngle + ellipseSector.ellipse.rotation,
        ellipseSector.endAngle + ellipseSector.ellipse.rotation
      );
      pb.draw.path(sector, "rgba(255,0,0,0.25)", 2);
    };
    var _circle = new Circle(center, ((radiusH + radiusV) / 2) * 0.5);
    pb.add(_circle);

    function drawFoci() {
      var foci = ellipse.getFoci();
      pb.fill.circleHandle(foci[0], 3, "orange");
      pb.fill.circleHandle(foci[1], 3, "orange");
    }

    function drawNormal() {
      //var normal = normalAt( ellipseSector.startAngle ); // + ellipseSector.ellipse.rotation );
      var normal = ellipse.normalAt(ellipseSector.startAngle, 50);
      pb.draw.line(normal.a, normal.b, "red", 1);

      // var tangent = ellipse.tangentAt( ellipseSector.startAngle, 50 );
      // pb.draw.line( tangent.a, tangent.b, 'orange', 1 );

      var foci = ellipse.getFoci();
      pb.draw.line(normal.a, foci[0], "rgba(192,192,0,0.5)", 1);
      pb.draw.line(normal.a, foci[1], "rgba(192,192,0,0.5)", 1);
    }

    /* function normalAt(angle) {
      var r2d = 180 / Math.PI;
      var point = ellipse.vertAt(angle);
      var foci = ellipse.getFoci();
      // Calculate the angle between [point,focusA] and [point,focusB]
      var angleA = new Line(point, foci[0]).angle();
      var angleB = new Line(point, foci[1]).angle();
      // var angleA = geomutils.wrapMinMax(angleA, -Math.PI, Math.PI);
      // var angleB = geomutils.wrapMinMax(angleB, -Math.PI, Math.PI);
      //var angleA = geomutils.wrapMinMax(angleA, 0, Math.PI*2);
      //var angleB = geomutils.wrapMinMax(angleB, 0, Math.PI*2)
      var angle = angleA + (angleB - angleA) / 2.0;
      //var angle = Math.min(angleA,angleB) + Math.abs(angleB-angleA)/2.0;
      //var angle = geomutils.wrapMinMax( angle, 0, Math.PI*2 );
      console.log(angleA * r2d, angleB * r2d, angle * r2d);

      pb.draw.line(point, foci[0], "rgba(192,192,0,0.5)", 1);
      pb.draw.line(point, foci[1], "rgba(192,192,0,0.5)", 1);

      var endPointA = point.clone().addX(50).clone().rotate(angle, point);
      var endPointB = point
        .clone()
        .addX(50)
        .clone()
        .rotate(Math.PI + angle, point);
      if (ellipse.center.distance(endPointA) < ellipse.center.distance(endPointB)) {
        return new Vector(point, endPointB);
      } else {
        return new Vector(point, endPointA);
      }
      // pb.draw.line( point, endPoint, 'red', 1 );
    } */

    /* function _normalAt(angle) {
      var point = ellipse.vertAt(angle);
      var slope = (ellipse.radiusH() * Math.sin(angle)) / (ellipse.radiusV() * Math.cos(angle));
      console.log("slope", slope);

      var len = 200;
      var end = new Vertex(point.x + len, point.y + len * slope);
      // if(
      pb.draw.line(point, end);
    } */

    function drawBezier() {
      var bezierCurves = ellipseSector.ellipse.toCubicBezier(
        config.bezierSegments,
        config.bezierThreshold,
        ellipseSector.startAngle,
        ellipseSector.endAngle
      );
      for (var i = 0; i < bezierCurves.length; i++) {
        var curve = bezierCurves[i];
        pb.draw.cubicBezier(curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint, "grey", 2);
        pb.draw.diamondHandle(curve.startControlPoint, 3, "blue");
        pb.draw.diamondHandle(curve.endControlPoint, 3, "blue");
      }
    }

    function drawEquidistantVertices() {
      // https://math.stackexchange.com/questions/172766/calculating-equidistant-points-around-an-ellipse-arc

      var pointCount = config.bezierSegments;
      var a = ellipseSector.ellipse.radiusH();
      var b = ellipseSector.ellipse.radiusV();
      var startAngle = ellipseSector.startAngle;
      var endAngle = ellipseSector.endAngle;
      var fullAngle = Math.PI * 2;
      // var fullAngle = endAngle - startAngle; // Math.PI*2
      // if (fullAngle < 0) {
      //   fullAngle = Math.PI * 2 + fullAngle;
      // }

      var vertices = [];
      for (var i = 0; i < pointCount; i++) {
        var phi = Math.PI / 2.0 + startAngle + (fullAngle / pointCount) * i;

        var tanPhi = Math.tan(phi);
        var tanPhi2 = tanPhi * tanPhi;

        var theta = -Math.PI / 2 + phi + Math.atan(((a - b) * tanPhi) / (b + a * tanPhi2));

        vertices[i] = ellipseSector.ellipse.vertAt(theta);
        pb.draw.circleHandle(vertices[i], 5, "orange");
        pb.draw.line(ellipseSector.ellipse.center, vertices[i], "grey", 1);
      }
    }

    // function _drawBezier() {
    //   var segmentCount = config.bezierSegments; // 2; // At least one
    //   var threshold = config.bezierThreshold; // 0.666;

    //   var sector = ellipseSector; // new VEllipseSector(ell, ellipseSector.startAngle, ellipseSector.endAngle);
    //   var startPoint = sector.ellipse.vertAt(sector.startAngle);
    //   var fullAngle = sector.endAngle - sector.startAngle;
    //   if (fullAngle < 0) fullAngle = Math.PI * 2 + fullAngle;
    //   // console.log(fullAngle, sector.startAngle, sector.endAngle);

    //   var curAngle = sector.startAngle;
    //   var startPoint = sector.ellipse.vertAt(curAngle);
    //   var curves = [];
    //   var lastIntersection;
    //   for (var i = 0; i < segmentCount; i++) {
    //     var nextAngle = sector.startAngle + (fullAngle / segmentCount) * (i + 1);
    //     var endPoint = sector.ellipse.vertAt(nextAngle);

    //     var startTangent = sector.ellipse.tangentAt(curAngle);
    //     var endTangent = sector.ellipse.tangentAt(nextAngle);

    //     // Find intersection
    //     var intersection = startTangent.intersection(endTangent);
    //     pb.draw.circleHandle(intersection, 5, "orange");
    //     if (lastIntersection) pb.draw.line(lastIntersection, intersection, "grey", 1);

    //     var startDiff = startPoint.difference(intersection);
    //     var endDiff = endPoint.difference(intersection);
    //     var curve = new CubicBezierCurve(
    //       startPoint.clone(),
    //       endPoint.clone(),
    //       startPoint.clone().add(startDiff.scale(threshold)),
    //       endPoint.clone().add(endDiff.scale(threshold))
    //     );
    //     //rotateUnconnectedCurve(curve, -ellipse.rotation, ellipse.center);
    //     curves.push(curve);
    //     pb.draw.cubicBezier(curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint, "grey", 2);
    //     pb.draw.diamondHandle(curve.startControlPoint, 3, "blue");
    //     pb.draw.diamondHandle(curve.endControlPoint, 3, "blue");

    //     startPoint = endPoint;
    //     curAngle = nextAngle;
    //     // startSlope = endSlope;
    //     lastIntersection = intersection;
    //   }
    // }

    // function rotateUnconnectedCurve(curve, angle, center) {
    //   curve.startPoint.rotate(angle, center);
    //   curve.endPoint.rotate(angle, center);
    //   curve.startControlPoint.rotate(angle, center);
    //   curve.endControlPoint.rotate(angle, center);
    // }

    //   var getSlope = function (elli, angle) {
    //     return (elli.radiusH() * Math.sin(angle)) / (elli.radiusV() * Math.cos(angle));
    //   };

    // Create a gui for testing with scale
    var gui = pb.createGUI();
    var fold0 = gui.addFolder("Bézier Approximation");
    fold0
      .add(config, "approximateBezier")
      .name("Approximate Bézier")
      .onChange(function () {
        pb.redraw();
      });
    fold0
      .add(config, "bezierSegments")
      .name("Bézier Segments")
      .min(2)
      .max(16)
      .step(1)
      .onChange(function () {
        pb.redraw();
      });
    fold0
      .add(config, "bezierThreshold")
      .name("Threshold")
      .min(0.0)
      .max(1.0)
      .onChange(function () {
        pb.redraw();
      });
    fold0.open();

    pb.redraw();
  });
})(window);
