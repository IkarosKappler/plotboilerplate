/**
 * A script for drawing pattern gradients.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2019-05-25
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);
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
          backgroundColor: isDarkmode ? "#000000" : "#e0e0e0",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,

          enableSVGExport: false
        },
        GUP
      )
    );

    var DEG_TO_RAD = Math.PI / 180.0;

    // var circleRadiusPct = 0.025;
    var drawAll = function () {
      // Bounds: { ..., width, height }
      var viewport = pb.viewport();
      var circleRadius = viewport.width * (config.cellRadiusPct / 100.0);
      var circleDiameter = circleRadius * 2.0;
      var circlePointCount = config.starPointCount * 2;
      // This would be the outscribing circle radius for the plane-fitting hexagon.
      var outerHexagonRadius = Math.sqrt((4.0 * circleRadius * circleRadius) / 3.0);
      // Get the start- and end-positions to use for the plane.
      var startXY = pb.transformMousePosition(circleRadius, circleRadius);
      var endXY = pb.transformMousePosition(viewport.width - circleRadius, viewport.height - circleRadius);

      var viewWidth = endXY.x - startXY.x;
      var viewHeight = endXY.y - startXY.y;
      // For plane-filling circles/hexagon we need some offsets for even/odd rows.
      var circleOffset = {
        // Row-filling circle-diameters
        x: circleDiameter,
        // Column-filling hexagonal offsets
        y: Math.sqrt(3 * circleRadius * circleRadius)
      };

      var yOdd = false;
      for (var y = startXY.y; y < endXY.y; y += circleOffset.y) {
        var yPct = 0.5 - y / viewHeight;
        for (var x = startXY.x + (yOdd ? 0 : circleOffset.x / 2.0); x < endXY.x; x += circleOffset.x) {
          var xPct = 0.5 - x / viewWidth;
          var circle = new Circle(new Vertex(x, y), circleRadius);
          // Make Bézier path (array of points)
          var angle = DEG_TO_RAD * config.startAngle;
          angle += xPct * config.xAngle * DEG_TO_RAD;
          angle += yPct * config.yAngle * DEG_TO_RAD;
          // [p, c, c, p, c, c, p ..., c, c, p, c]
          var bPathPoints = circle2bezier(circle, circlePointCount, angle, function (tangentVector, i) {
            if (i % 2) {
              tangentVector.a.scale(config.xOffset - xPct * yPct, circle.center);
              tangentVector.b.scale(config.yOffset + xPct * yPct, circle.center);
            }
          });
          // Make a hexagon that outscribes the circle?
          // var outerNGonPoints = makeNGon( circle.center, outerHexagonRadius, 6, Math.PI/6.0 );
          // pb.fill.polyline( outerNGonPoints, false, 'rgba(128,128,128,0.5)', 1 );

          if (config.fillShape) pb.fill.cubicBezierPath(bPathPoints, "rgb(0,128,192)", 2);
          else pb.draw.cubicBezierPath(bPathPoints, "rgb(0,128,192)", 2);
        }
        yOdd = !yOdd;
      }
    };

    var makeNGon = function (center, radius, pointCount, startAngle) {
      var points = [];
      var p;
      var angleStep = (Math.PI * 2) / pointCount;
      for (var i = 0; i < pointCount; i++) {
        p = center.clone().addX(radius);
        p.rotate(startAngle + i * angleStep, center);
        points.push(p);
      }
      return points;
    };

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "convexhull-demo").move(function (e) {
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      var cx = document.getElementById("cx");
      var cy = document.getElementById("cy");
      if (cx) cx.innerHTML = relPos.x.toFixed(2);
      if (cy) cy.innerHTML = relPos.y.toFixed(2);
    });

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        pointCount: 6,
        startAngle: 45.0, // Math.PI/2.0,
        cellRadiusPct: 2.5, // %
        xOffset: 1.0,
        yOffset: 1.0,
        xAngle: 0.0,
        yAngle: 0.0,
        starPointCount: 6, // will be doubled
        fillShape: true
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      gui
        .add(config, "startAngle")
        .min(0)
        .max(360)
        .step(1.0)
        .onChange(function () {
          pb.redraw();
        })
        .name("Start angle")
        .title("The circle patterns' start angle.");
      gui
        .add(config, "cellRadiusPct")
        .min(0.5)
        .max(10)
        .step(0.1)
        .onChange(function () {
          pb.redraw();
        })
        .name("Cell size %")
        .title("The cell radis");
      gui
        .add(config, "xOffset")
        .min(-2.0)
        .max(2.0)
        .step(0.01)
        .onChange(function () {
          pb.redraw();
        })
        .name("X offset")
        .title("The x-axis offset.");
      gui
        .add(config, "yOffset")
        .min(-2.0)
        .max(2.0)
        .step(0.01)
        .onChange(function () {
          pb.redraw();
        })
        .name("Y offset")
        .title("The y-axis offset.");
      gui
        .add(config, "xAngle")
        .min(0.0)
        .max(360)
        .step(1.0)
        .onChange(function () {
          pb.redraw();
        })
        .name("X angle")
        .title("The x-angle.");
      gui
        .add(config, "yAngle")
        .min(0.0)
        .max(360)
        .step(1.0)
        .onChange(function () {
          pb.redraw();
        })
        .name("Y angle")
        .title("The y-axis angle.");
      gui
        .add(config, "starPointCount")
        .min(3)
        .max(24)
        .step(1)
        .onChange(function () {
          pb.redraw();
        })
        .name("Point count")
        .title("The star's point count.");
      gui
        .add(config, "fillShape")
        .onChange(function () {
          pb.redraw();
        })
        .name("Fill shape")
        .title("Fill the shape or draw the outline only?");
    }

    pb.config.postDraw = drawAll;
    pb.redraw();
  };

  if (!window.pbPreventAutoLoad) window.addEventListener("load", window.initializePB);
})(window);
