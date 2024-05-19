/**
 * A script to demonstrate how to construct irregular Reuleaux polygons with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires three.js
 *
 * @author   Ikaros Kappler
 * @date     2024-01-30
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

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
        cardinality: params.getNumber("cardinality", 2),
        // radius: params.getNumber("radius", 100),
        drawCircles: false,
        drawRadii: false,
        drawVertNumbers: false
      },
      GUP
    );

    var rebuildPolygon = function () {
      if (polygon != null) {
        // Remove old listeners before dropping the old polygon.
        // Let's be kind to the browser.
        for (var i = 0; i < polygon.vertices.length; i++) {
          polygon.vertices[i].listeners.removeDragListener(rebuild);
        }
      }
      var vp = pb.viewport();
      polygon = NGons.ngon(config.cardinality * 2 + 1, Math.min(vp.width, vp.height) / 2);

      polygon.vertices.forEach(function (vertex, index) {
        // The current polygon is very regular. Add some asymmetry.
        if (index % 2 === 1) {
          vertex.scale(1.3, pb.viewport().getCenter());
        }
        return vertex;
      });
      // Now scale down to fit nicely into the current viewport.
      polygon.scale(0.5, pb.viewport().getCenter());

      for (var i = 0; i < polygon.vertices.length; i++) {
        polygon.vertices[i].listeners.addDragListener(rebuild);
      }
    };

    var polygonCenter = new Vertex();
    // Build the polygon
    var polygon = null;
    var circleSectors = [];

    var rebuild = function () {
      circleSectors = [];

      pb.removeAll();
      pb.add([polygonCenter, polygon]);

      const n = polygon.vertices.length;
      for (var i = 0; i < n; i++) {
        var curVert = polygon.vertices[i];
        var nextVert = polygon.vertices[(i + 1) % n];
        var center = polygon.vertices[(i + Math.floor(n / 2)) % n];
        var distCur = curVert.distance(center);
        var distNext = nextVert.distance(center);
        var mediumDist = (distCur + distNext) / 2.0;

        // Fint orthogonal center on current polygon edge.
        // Use median value of both radii.
        var vector = new Vector(curVert.clone(), nextVert.clone());
        vector.moveTo(vector.vertAt(0.5));
        var perp = vector.perp().setLength(mediumDist);
        var medianCenter = perp.b;
        var circle = new Circle(medianCenter, medianCenter.distance(curVert));
        circle.center.attr.draggable = false;

        // Make circle and circle arc
        var startAngle = curVert.angle(medianCenter) + Math.PI;
        var endAngle = nextVert.angle(medianCenter) + Math.PI;
        circleSectors.push(new CircleSector(circle, startAngle, endAngle));
      }
      pb.add(circleSectors);
    };

    var init = function () {
      rebuild();
    };

    // Install move listeners
    polygonCenter.listeners.addDragListener(function (e) {
      polygon.move(e.params.dragAmount);
      rebuild();
    });

    var drawVertLabels = function (draw, fill) {
      for (var i = 0; i < polygon.vertices.length; i++) {
        const vert = polygon.vertices[i];
        fill.text("" + i, vert.x, vert.y, { color: "orange", fontFamily: "Arial", fontSize: 9 });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Redraw everything. This function will be called by PB on re-renders.
    // +-------------------------------
    var redraw = function (draw, fill) {
      if (polygon == null) {
        return;
      }

      // Draw circles before anything else is drawn
      if (config.drawCircles) {
        var n = circleSectors.length;
        for (var i = 0; i < n; i++) {
          var sector = circleSectors[i];
          draw.circle(sector.circle.center, sector.circle.radius, "rgba(0,192,0,0.25)", 1);
        }
      }

      if (config.drawRadii) {
        var n = circleSectors.length;
        for (var i = 0; i < n; i++) {
          var sector = circleSectors[i];
          draw.line(polygon.vertices[i], sector.circle.center, "rgba(128,128,128,0.25)", 1);
          draw.line(polygon.vertices[(i + 1) % n], sector.circle.center, "rgba(128,128,128,0.25)", 1);
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
      gui.add(config, "cardinality").min(1).max(10).step(1).onChange( function() { rebuildPolygon(); rebuild(); pb.redraw(); } ).name('cardinality').title("How many vertices on the polygon (measured in 2n+1).");
      // prettier-ignore
      gui.add(config, "drawCircles").onChange( function() { pb.redraw(); } ).name('drawCircles').title("Draw circles?");
      // prettier-ignore
      gui.add(config, "drawRadii").onChange( function() { pb.redraw(); } ).name('drawRadii').title("Draw Radii?");
      // prettier-ignore
      gui.add(config, "drawVertNumbers").onChange( function() { pb.redraw(); } ).name('drawVertNumbers').title("Draw vertex numbers?");
    }

    pb.config.preDraw = redraw;
    rebuildPolygon();
    init();
    pb.redraw();
  });
})(window);
