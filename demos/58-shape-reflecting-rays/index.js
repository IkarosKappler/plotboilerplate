/**
 * A script for calculating ray reflections on any shape.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2025-03-24
 * @version  1.0.0
 **/

// Todo: eliminate co-linear edges.

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  const RAD_TO_DEG = 180.0 / Math.PI;
  _context.addEventListener("load", function () {
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );
    // Let's set up some colors.
    pb.drawConfig.polygon.color = "rgba(255,192,0,0.75)";
    pb.drawConfig.polygon.lineWidth = 2;

    // Array<Polygon | Circle | Ellipse>
    var shapes = [];
    // Array<Vector>
    var rays = [];
    rays.push(new Vector(new Vertex(), new Vertex(100, 100)));

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      pointCount: params.getNumber("pointCount", 4)
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();
    // Must be in clockwise order!
    var polygon = null;

    var postDraw = function (draw, fill) {
      // draw.circle({ x: 0, y: 0 }, 50.0, "red", 1.0);
      var reflectedRays = calculateAllReflections();
      reflectedRays.forEach(function (rays) {
        rays.forEach(function (ray) {
          draw.arrow(ray.a, ray.b, "orange");
        });
      });
    };

    /**
     * @return {Array<Vector[]>} An two-dimensional array of vectors; each array for one of the base shapes.
     */
    var calculateAllReflections = function () {
      // Array<Vector[]>
      var resultVectors = [];
      shapes.forEach(function (shape) {
        const reflectedRays = [];
        rays.forEach(function (ray) {
          var reflectedRay = findReflectedRay(shape, ray);
          reflectedRays.push(reflectedRay);
        });
        resultVectors.push(reflectedRays);
      });
      return resultVectors;
    };

    var findReflectedRay = function (shape, ray) {
      var reflectedRay = ray.perp().moveTo(ray.b);

      return reflectedRay;
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildShape = function () {
      // Create a new randomized polygon.
      polygon = createRandomizedPolygon(config.pointCount, viewport, true); // createClockwise=true

      // Re-add the new polygon to trigger redraw.
      pb.removeAll(false, false); // Don't trigger redraw

      var circle = new Circle(new Vertex(), 90.0);
      shapes = [polygon, circle];
      pb.add(shapes, false);
      pb.add(rays, true); // trigger redraw
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "pointCount").min(3).max(32).step(1).name("pointCount").title("Number of polygon vertices")
      .onChange( function() { rebuildShape(); });
    }

    pb.config.postDraw = postDraw;
    rebuildShape();
  });
})(globalThis);
