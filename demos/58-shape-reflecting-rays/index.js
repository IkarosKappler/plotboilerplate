/**
 * A script for calculating ray reflections on any shape.
 *
 * @requires PlotBoilerplate, gup, dat.gui, randomCircleSector
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
    pb.drawConfig.polygon.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.polygon.lineWidth = 2;
    pb.drawConfig.ellipse.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.ellipse.lineWidth = 2;
    pb.drawConfig.circle.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.circle.lineWidth = 2;
    pb.drawConfig.ellipseSector.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.ellipseSector.lineWidth = 2;
    pb.drawConfig.circleSector.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.circleSector.lineWidth = 2;

    // Array<Polygon | Circle | Ellipse>
    var shapes = [];
    // Array<Vector>
    var rays = [];
    var ellipseHelper;
    var cicleSectorHelper;
    var ellipseSectorHelper;
    rays.push(new Vector(new Vertex(), new Vertex(250, 250).rotate(Math.random() * Math.PI)));

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
      var reflectedRaysByShapes = calculateAllReflections();
      reflectedRaysByShapes.forEach(function (reflectedRays) {
        reflectedRays.forEach(function (ray) {
          draw.arrow(ray.a, ray.b, "orange", 5.0);
        });
      });
      ellipseHelper.drawHandleLines(draw, fill);
      cicleSectorHelper.drawHandleLines(draw, fill);
      ellipseSectorHelper.drawHandleLines(draw, fill);

      // Draw barycenter of polygon?
      // shapes.forEach(function (shape) {
      //   if (shape instanceof Polygon) {
      //     console.log("centroid", shape.getCentroid());
      //     draw.diamondHandle(shape.getCentroid(), 5, "orange");
      //   }
      // });
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
          if (reflectedRay != null) {
            reflectedRays.push(reflectedRay);
          }
        });
        resultVectors.push(reflectedRays);
      });
      return resultVectors;
    };

    /**
     * TODO: also allow circle sectors, elliptic sectors, bezier curves??
     * @param {Polygon | Circle | Ellipse} shape
     * @param {Vector} ray
     * @returns
     */
    var findReflectedRay = function (shape, ray) {
      var reflectedRay = null; // ray.perp().moveTo(ray.b);

      // Find intersection with min distance
      if (
        shape instanceof Polygon ||
        shape instanceof Circle ||
        shape instanceof VEllipse ||
        shape instanceof CircleSector ||
        shape instanceof VEllipseSector
      ) {
        // Array<Vector>
        var intersectionTangents = shape.lineIntersectionTangents(ray, true);
        // Find closest intersection vector
        var closestIntersectionTangent = intersectionTangents.reduce(function (accu, curVal) {
          if (accu === null || curVal.a.distance(ray.a) < accu.a.distance(ray.a)) {
            accu = curVal;
          }
          return accu;
        }, null);
        if (closestIntersectionTangent) {
          // pb.draw.arrow(closestIntersectionTangent.a, closestIntersectionTangent.b, "green");
          var angleBetween = closestIntersectionTangent.angle(ray);
          rotateVector(closestIntersectionTangent, angleBetween);
          reflectedRay = closestIntersectionTangent;
        } else {
          reflectedRay = null;
        }
      } else {
        // ERR! (unrecognized shape)
        // In the end all shapes should have the same methods!
      }

      return reflectedRay;
    };

    /**
     * TODO: MOVE TO VECTOR CLASS.
     *
     * Rotate  vector by the given angle.
     * @param angle
     */
    function rotateVector(vector, angle) {
      vector.b.rotate(angle, vector.a);
    }

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildShape = function () {
      // Create a new randomized polygon.
      polygon = createRandomizedPolygon(config.pointCount, viewport, true); // createClockwise=true

      // Re-add the new polygon to trigger redraw.
      pb.removeAll(false, false); // Don't trigger redraw

      // Create circle and ellpise
      var circle = new Circle(new Vertex(-25, -15), 90.0);
      var ellipse = new VEllipse(new Vertex(25, 15), new Vertex(150, 200), -Math.PI * 0.3);

      // We want to change the ellipse's radii and rotation by dragging points around
      var ellipseRotationControlPoint = ellipse.vertAt(0.0).scale(1.2, ellipse.center);
      if (ellipseHelper) {
        ellipseHelper.destroy();
      }
      ellipseHelper = new VEllipseHelper(ellipse, ellipseRotationControlPoint);

      // Create circle sector
      var circleSector = randomCircleSector(viewport);
      // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
      var controlPointA = circleSector.circle.vertAt(circleSector.startAngle);
      var controlPointB = circleSector.circle.vertAt(circleSector.endAngle);
      if (cicleSectorHelper) {
        cicleSectorHelper.destroy();
      }
      cicleSectorHelper = new CircleSectorHelper(circleSector, controlPointA, controlPointB, pb);

      // Create an ellipse helper
      var ellipseSector = randomEllipseSector(viewport);
      // We want to change the ellipse's radii and rotation by dragging points around
      var startControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.startAngle);
      var endControlPoint = ellipseSector.ellipse.vertAt(ellipseSector.endAngle);
      var rotationControlPoint = ellipseSector.ellipse
        .vertAt(0) // ellipseSector.ellipse.rotation)
        .scale(1.2, ellipseSector.ellipse.center);
      if (ellipseSectorHelper) {
        ellipseSectorHelper.destroy();
      }
      ellipseSectorHelper = new VEllipseSectorHelper(ellipseSector, startControlPoint, endControlPoint, rotationControlPoint);

      shapes = [
        polygon,
        circle,
        ellipse,
        ellipseRotationControlPoint,
        circleSector,
        controlPointA,
        controlPointB,
        ellipseSector,
        startControlPoint,
        endControlPoint,
        rotationControlPoint
      ];
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
