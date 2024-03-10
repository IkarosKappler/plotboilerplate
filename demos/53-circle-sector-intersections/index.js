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
        drawCircles: params.getBoolean("drawCircles", true),
        drawCircleNumbers: params.getBoolean("drawCircleNumber", true)
      },
      GUP
    );

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
        // Add the sector to your canvas
        pb.add(circleSector);

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

    // +---------------------------------------------------------------------------------
    // | For drawing circle labels.
    // +-------------------------------
    var drawCircleLabels = function (draw, fill, contrastColor) {
      for (var i = 0; i < circleSectors.length; i++) {
        const vert = circleSectors[i].circle.center;
        // TODO: use contrast color here
        fill.text("" + i, vert.x, vert.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });
      }
    };

    // +---------------------------------------------------------------------------------
    // | For drawing circle labels.
    // +-------------------------------
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

    var drawAngleLabels = function (draw, fill, contrastColor) {
      for (var i in circleSectors) {
        var sector = circleSectors[i];
        draw.line(anglePoint, sector.circle.center, "rgba(192,192,192,0.5)", 1, { dashOffset: 0, dashArray: [5, 4] });
        var controlPointA = sector.circle.vertAt(sector.startAngle);
        var controlPointB = sector.circle.vertAt(sector.endAngle);
        draw.line(sector.circle.center, controlPointA, "rgba(128,128,128,0.5)", 2.0);
        draw.line(sector.circle.center, controlPointB, "rgba(128,128,128,0.5)", 2.0);
        // prettier-ignore
        fill.text("" + (sector.startAngle*RAD_TO_DEG).toFixed(1) + "°", controlPointA.x, controlPointA.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });
        // prettier-ignore
        fill.text("" + (sector.endAngle*RAD_TO_DEG).toFixed(1) + "°", controlPointB.x, controlPointB.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });
      }
    };

    var drawSectorIntersections = function (draw, fill) {
      for (var i = 0; i < circleSectors.length; i++) {
        var sector = circleSectors[i];
        for (var j = 0; j < circleSectors.length; j++) {
          if (i === j) {
            continue;
          }
          var intersection = sector.circleSectorIntersection(circleSectors[j]);
          if (intersection) {
            draw.circleArc(
              intersection.circle.center,
              intersection.circle.radius,
              intersection.startAngle,
              intersection.endAngle,
              "rgba(0,128,255,0.5)",
              7
            );
          }
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      fill.text("<Move me>", anglePoint.x, anglePoint.y, { color: contrastColor, fontFamily: "Arial", fontSize: 9 });

      if (config.drawCircleNumbers) {
        drawCircleLabels(draw, fill, contrastColor);
      }

      drawAngleLabels(draw, fill, contrastColor);
      drawAnglePointInfo(draw, fill);
      drawSectorIntersections(draw, fill);
    }; // END redraw

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "numCircles").min(1).max(10).step(1).onChange( function() { reinit(); pb.redraw(); } ).name('numCircles').title("Number of circles.");
      // prettier-ignore
      gui.add(config, "drawCircleNumbers").onChange( function() { pb.redraw(); } ).name('drawCircleNumbers').title("Draw circle numbers?");
    }

    pb.config.postDraw = redraw;
    init();
    pb.redraw();
  });
})(window);
