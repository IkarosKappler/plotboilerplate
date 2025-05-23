/**
 * A demo about rendering SVG path data with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
 * @requires draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-05-26
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  window.addEventListener("load", function () {
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
          drawBezierHandleLines: true,
          drawBezierHandlePoints: true,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: true
        },
        GUP
      )
    );
    pb.drawConfig.polygon.lineWidth = 3.0;
    pb.drawConfig.vector.color = "#ff8800";

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        insideVectorBoundsOnly: false
      },
      GUP
    );

    // Build the polygon
    const polygon = pb.viewport().toPolygon().getInterpolationPolygon(1);
    polygon.vertices.map(function (vertex, index) {
      // We added one point to each edge; scale them a bit up to get a nice
      // convex polygon.
      if (index % 2 === 1) {
        vertex.scale(1.3, pb.viewport().getCenter());
      }
      return vertex;
    });
    // Now scale down to fit nicely into the current viewport.
    polygon.scale(0.5, pb.viewport().getCenter());
    pb.add(polygon);

    // Add two points for a long vector (start and end)
    var vectorStart = pb.viewport().getCenter().clone();
    var vectorEnd = vectorStart
      .clone()
      .addXY(Math.random() * pb.viewport().width * 0.45, Math.random() * pb.viewport().height * 0.45);
    var vec = new Vector(vectorStart, vectorEnd);
    pb.add(vec);

    // +---------------------------------------------------------------------------------
    // | This is called after each draw cycle.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      // Find closest intersection point between vector and polygon
      // var intersections = polygon.lineIntersections(vec, config.insideVectorBoundsOnly);
      var intersections = polygon.lineIntersections(vec, config.insideVectorBoundsOnly);

      for (var i = 0; i < intersections.length; i++) {
        draw.circle(intersections[i], 5, "orange", 2.0);
      }

      const closestIntersection = polygon.closestLineIntersection(vec, config.insideVectorBoundsOnly);
      if (closestIntersection) {
        draw.circle(closestIntersection, 5, "green", 2.0);
      } else {
        // No closest intersection found.
      }
    };

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "drawsvg-demo").move(function (e) {
      // Display the mouse position
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;
    });

    var stats = {
      mouseX: 0,
      mouseY: 0
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'insideVectorBoundsOnly').listen().onChange(function() { pb.redraw(); }).name("insideVectorBoundsOnly").title("insideVectorBoundsOnly");
    }

    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(window);
