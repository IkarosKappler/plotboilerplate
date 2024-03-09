/**
 * A script to demonstrate how to find circle sector intersections with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2024-03-08
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);
    var params = new Params(GUP);
    var RAD_TO_DEG = 180 / Math.PI;

    // All config params are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("my-canvas"),
          fullSize: true,
          fitToParent: true,
          scaleX: 1.0,
          scaleY: 1.0,
          rasterGrid: true,
          drawOrigin: false,
          rasterAdjustFactor: 2.0,
          redrawOnResize: true,
          defaultCanvasWidth: 1024,
          defaultCanvasHeight: 768,
          canvasWidthFactor: 1.0,
          canvasHeightFactor: 1.0,
          cssScaleX: 1.0,
          cssScaleY: 1.0,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,
          enableSVGExport: true
        },
        GUP
      )
    );
    pb.drawConfig.circle.lineWidth = 1;
    pb.drawConfig.circle.color = "rgba(32,192,192,0.5)";
    pb.drawConfig.circleSector.lineWidth = 3;
    pb.drawConfig.circleSector.color = "rgba(255,0,255,0.333)";

    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        numCircles: params.getNumber("numCircles", 2),
        metaRadiusAddon: params.getNumber("metaRadiusAddon", 40),
        drawCircles: params.getBoolean("drawCircles", true),
        drawCircleNumbers: params.getBoolean("drawCircleNumber", true),
        drawContainingCircles: params.getBoolean("drawContainingCircle", true),
        drawInverseCircles: params.getBoolean("drawInverseCircles", true),
        drawOuterHull: params.getBoolean("drawOuterHull", true)
      },
      GUP
    );

    // var inputCircles = [];
    var circleSectors = [];
    var circleSectorHelpers = [];
    var anglePoint = pb.viewport().randomPoint(0.35, 0.35);

    // +---------------------------------------------------------------------------------
    // | Generate a random circle.
    // +-------------------------------
    var getRandomCircleSector = function () {
      var vp = pb.viewport();
      var circle = new Circle(vp.randomPoint(0.35, 0.35), (Math.random() * Math.min(vp.width, vp.height)) / 5);
      var startAngle = Math.random() * Math.PI * 2;
      var endAngle = Math.random() * Math.PI * 2;
      return new CircleSector(circle, startAngle, endAngle);
    };

    var recalculateSectorIntersections = function () {
      //
    };

    var installCircleSectorHelpers = function () {
      // First: uninstall old listeners
      circleSectorHelpers.forEach(function (chelper) {
        chelper.destroy();
      });
      // Install a circle helper: change radius via a second control point.
      for (var i = 0; i < circleSectors.length; i++) {
        var circleSector = circleSectors[i];
        // Now create a sector from the circle
        // var startAngle = (34 / 180) * Math.PI; // in radians
        // var endAngle = (330 / 180) * Math.PI;
        // var circleSector = new CircleSector(circle, startAngle, endAngle);

        // Now add the sector to your canvas
        pb.add(circleSector);

        // Note: the center point is draggable now :)

        // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
        var controlPointA = circleSector.circle.vertAt(circleSector.startAngle);
        var controlPointB = circleSector.circle.vertAt(circleSector.endAngle);
        var csHelper = new CircleSectorHelper(circleSector, controlPointA, controlPointB, pb);
        circleSectorHelpers.push(csHelper);
        pb.add([controlPointA, controlPointB]);
      }
    };

    var reinit = function () {
      arrayResize(circleSectors, config.numCircles, getRandomCircleSector);
      recalculateSectorIntersections();
      // Install move listeners
      for (var i = 0; i < circleSectors.length; i++) {
        circleSectors[i].circle.center.listeners.addDragListener(function (e) {
          recalculateSectorIntersections();
        });
      }
      pb.removeAll();
      installCircleSectorHelpers();
      pb.add(anglePoint);
    };

    var init = function () {
      reinit();
    };

    // TODO: global function?
    var cloneCircle = function (circle) {
      return new Circle(circle.center.clone(), circle.radius);
    };

    // TODO: global function?
    var cloneCircleSector = function (circleSector) {
      return new CircleSector(cloneCircle(circleSector.circle), circleSector.startAngle, circleSector.endAngle);
    };

    var drawCircleLabels = function (draw, fill) {
      for (var i = 0; i < circleSectors.length; i++) {
        const vert = circleSectors[i].circle.center;
        // TODO: use contrast color here
        fill.text("" + i, vert.x, vert.y, { color: "white", fontFamily: "Arial", fontSize: 9 });
      }
    };

    var drawAnglePointInfo = function (draw, fill) {
      for (var i = 0; i < circleSectors.length; i++) {
        const sector = circleSectors[i];
        var angleInCircle = sector.circle.center.angle(anglePoint);
        var pointOnCircle = sector.circle.vertAt(angleInCircle);
        var color = sector.containsAngle(angleInCircle) ? "green" : "red";
        draw.line(sector.circle.center, pointOnCircle, color, 1);
        draw.diamondHandle(pointOnCircle, 7, color);
      }
    };

    var drawAngleLabels = function (draw, fill) {
      for (var i in circleSectors) {
        var circleSector = circleSectors[i];
        draw.line(anglePoint, circleSector.circle.center, "rgba(192,192,192,0.5)", 1, { dashOffset: 0, dashArray: [5, 4] });
        var controlPointA = circleSector.circle.vertAt(circleSector.startAngle);
        var controlPointB = circleSector.circle.vertAt(circleSector.endAngle);
        draw.line(circleSector.circle.center, controlPointA, "rgba(192,192,192,0.5)", 1.0);
        draw.line(circleSector.circle.center, controlPointB, "rgba(192,192,192,0.5)", 1.0);
        // prettier-ignore
        fill.text("" + (circleSector.startAngle*RAD_TO_DEG).toFixed(1) + "°", controlPointA.x, controlPointA.y, { color: "white", fontFamily: "Arial", fontSize: 9 });
        // prettier-ignore
        fill.text("" + (circleSector.endAngle*RAD_TO_DEG).toFixed(1) + "°", controlPointB.x, controlPointB.y, { color: "white", fontFamily: "Arial", fontSize: 9 });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      fill.text("<Move me>", anglePoint.x, anglePoint.y, { color: "white", fontFamily: "Arial", fontSize: 9 });

      if (config.drawCircleNumbers) {
        drawCircleLabels(draw, fill);
      }

      drawAngleLabels(draw, fill);
      drawAnglePointInfo(draw, fill);
    }; // END redraw

    // var drawInverseCircleArcs = function (draw, circlePair) {
    //   drawInvserseCircleArc(draw, circlePair.inverseCircleA, circlePair.circlePointsA[0], circlePair.circlePointsB[0]);
    //   drawInvserseCircleArc(draw, circlePair.inverseCircleB, circlePair.circlePointsB[1], circlePair.circlePointsA[1]);
    // };

    // var drawInvserseCircleArc = function (draw, outerCircle, intersectionPoint0, intersectionPoint1) {
    //   var angleDifference = -Math.PI;
    //   var intersectionAngleA0 = intersectionPoint0.angle(outerCircle.center) + angleDifference;
    //   var intersectionAngleB0 = intersectionPoint1.angle(outerCircle.center) + angleDifference;
    //   draw.circleArc(outerCircle.center, outerCircle.radius, intersectionAngleB0, intersectionAngleA0, "rgba(0,255,0,0.333)", 7);
    // };

    // ===ZZZ START

    // +---------------------------------------------------------------------------------
    // | This is kind of a hack to draw connected arc paths (which is currently not directly
    // | supported by the `draw` library).
    // |
    // | The function switches between canvas.ellipse draw or SVG path draw.
    // |
    // | @param {CircleSector[]} path
    // | @param {number} iteration
    // | @param {number} pathNumber
    // +-------------------------------
    // var drawConnectedPath = function (draw, fill, path, color, lineWidth) {
    //   // This might be optimized
    //   if (config.drawAsSVGArcs || draw instanceof drawutilssvg) drawConnectedPathAsSVGArcs(draw, fill, path, color, lineWidth);
    //   else drawConnectedPathAsEllipses(path, color, lineWidth, config.fillNestedCircles ? fill : draw);
    // };

    // +---------------------------------------------------------------------------------
    // | Draw the given path as ellipses (using canvs.ellipse function).
    // |
    // | @param {CircleSector[]} path
    // | @param {string} color
    // | @param {drawutils} draw
    // +-------------------------------
    // var drawConnectedPathAsEllipses = function (path, color, lineWidth, draw) {
    //   draw.ctx.save();
    //   draw.ctx.beginPath();
    //   for (var i = 0; i < path.length; i++) {
    //     var sector = path[i];
    //     draw.circleArc(sector.circle.center, sector.circle.radius, sector.startAngle, sector.endAngle, color, config.lineWidth, {
    //       asSegment: true
    //     });
    //   }
    //   draw.ctx.closePath();
    //   draw.ctx.lineWidth = lineWidth;
    //   draw.ctx.lineJoin = config.lineJoin;
    //   draw._fillOrDraw(color);
    // };

    // +---------------------------------------------------------------------------------
    // | Draw the given path as ellipses (using canvs.ellipse function).
    // |
    // | @param {CircleSector[]} path
    // | @param {string} color
    // | @param {drawutils} draw
    // +-------------------------------
    // var drawConnectedPathAsSVGArcs = function (draw, fill, path, color, lineWidth) {
    //   var svgData = pathToSVGData(path, { x: 0, y: 0 }, { x: 1, y: 1 });
    //   if (draw.ctx) draw.ctx.lineJoin = config.lineJoin;
    //   if (config.fillNestedCircles) {
    //     fill.path(svgData, color, lineWidth);
    //   } else {
    //     draw.path(svgData, color, lineWidth);
    //   }
    // };
    // ===ZZZ END

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "numCircles").min(1).max(10).step(1).onChange( function() { reinit(); rebuildMetaballs(); pb.redraw(); } ).name('numCircles').title("Number of circles.");
      // prettier-ignore
      gui.add(config, "drawCircleNumbers").onChange( function() { pb.redraw(); } ).name('drawCircleNumbers').title("Draw circle numbers?");
    }

    pb.config.postDraw = redraw;
    init();
    pb.redraw();
  });
})(window);
