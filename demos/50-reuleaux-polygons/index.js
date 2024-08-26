/**
 * A script to demonstrate how to construct Reuleaux polygons with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 * @requires three.js
 *
 * @author   Ikaros Kappler
 * @date     2024-01-29
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  window.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);
    var params = new Params(GUP);

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
    // globalThis.pb = pb;
    pb.drawConfig.circleSector.lineWidth = 3;
    pb.drawConfig.circleSector.color = "rgba(255,64,0,0.75)";

    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        cardinality: params.getNumber("cardinality", 1),
        radius: params.getNumber("radius", 100),
        drawCircles: false,
        drawVertNumbers: false
      },
      GUP
    );

    var ngonCenter = new Vertex();
    var ngon = null;
    var circleSectors = [];

    var rebuild = function () {
      circleSectors = [];
      ngon = new NGons.ngon(config.cardinality * 2 + 1, config.radius);
      ngon.move(ngonCenter);

      pb.removeAll();
      pb.add([ngonCenter, ngon]);

      const n = ngon.vertices.length;
      for (var i = 0; i < n; i++) {
        var curVert = ngon.vertices[i];
        var center = ngon.vertices[(i + Math.floor(n / 2)) % n];
        var dist = curVert.distance(center);

        // Make circle and circle arc
        var startAngle = curVert.angle(center);
        var endAngle = startAngle + Math.PI / n;
        var circle = new Circle(ngon.vertices[i], dist);
        circleSectors.push(new CircleSector(circle, startAngle, endAngle));
      }
      pb.add(circleSectors);
    };

    var init = function () {
      rebuild();
    };

    // Install move listeners
    ngonCenter.listeners.addDragListener(function (e) {
      ngon.move(e.params.dragAmount);
    });

    var drawVertLabels = function (draw, fill) {
      for (var i = 0; i < ngon.vertices.length; i++) {
        const vert = ngon.vertices[i];
        fill.text("" + i, vert.x, vert.y, { color: "orange", fontFamily: "Arial", fontSize: 9 });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      if (ngon == null) {
        return;
      }

      // Draw circles before anything else is drawn
      if (config.drawCircles) {
        for (var i = 0; i < circleSectors.length; i++) {
          var sector = circleSectors[i];
          draw.circle(sector.circle.center, sector.circle.radius, "rgba(0,192,0,0.25)", 3);
        }
      }

      if (config.drawVertNumbers) {
        drawVertLabels(draw, fill);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "cardinality").min(1).max(10).step(1).onChange( function() { rebuild(); pb.redraw(); } ).name('cardinality').title("How many vertices on the polygon (measured in 2n+1).");
      // prettier-ignore
      gui.add(config, "radius").min(0).max(200).step(1).onChange( function() { rebuild(); pb.redraw(); } ).name('radius').title("The radius of the polygon.");
      // prettier-ignore
      gui.add(config, "drawCircles").onChange( function() { pb.redraw(); } ).name('drawCircles').title("Draw circles?");

      // prettier-ignore
      gui.add(config, "drawVertNumbers").onChange( function() { pb.redraw(); } ).name('drawVertNumbers').title("Draw vertex numbers?");
    }

    pb.config.preDraw = redraw;
    init();
    pb.redraw();
  });
})(window);
