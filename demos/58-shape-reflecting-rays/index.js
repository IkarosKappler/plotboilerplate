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
    var ellipseHelper;
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
      if (shape instanceof Polygon || shape instanceof Circle || shape instanceof VEllipse) {
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
        // } else if (shape instanceof Circle) {
        // } else if (shape instanceof VEllipse) {
        //   // var ellipseIntersections = findEllipseIntersections(shape, ray);
        //   var ellipseIntersections = shape.lineIntersections(ray, true);
        //   for (var i = 0; i < ellipseIntersections.length; i++) {
        //     pb.draw.circleHandle(ellipseIntersections[i], 6, "red");
        //   }
      } else {
        // ERR! (unrecognized shape)
        // In the end all shapes should have the same methods!
      }

      return reflectedRay;
    };

    // Todo: move to VEllipse class!
    function findEllipseIntersections(_ellipse, _ray, inVectorBoundsOnly) {
      // Question: what happens to extreme versions when ellipse is a line (width or height is zero)?
      //           This would result in a Division_by_Zero exception!

      // Step A: create clones for operations (keep originals unchanged)
      var ellipse = _ellipse.clone(); // VEllipse
      var ray = _ray.clone(); // Vector

      // Step B: move both so ellipse's center is located at (0,0)
      var moveAmount = ellipse.center.clone().inv();
      ellipse.move(moveAmount);
      ray.add(moveAmount);

      // Step C: rotate eclipse backwards it's rotation, so that rotation is zero (0.0).
      //         Rotate together with ray!
      var rotationAmount = -ellipse.rotation;
      ellipse.rotate(rotationAmount); // Rotation around (0,0) = center of translated ellipse
      ray.a.rotate(rotationAmount, ellipse.center);
      ray.b.rotate(rotationAmount, ellipse.center);

      // Step D: find x/y factors to use for scaling to transform the ellipse to a circle.
      //         Scale together with vector ray.
      var radiusH = ellipse.radiusH();
      var radiusV = ellipse.radiusV();
      var scalingFactors = radiusH > radiusV ? { x: radiusV / radiusH, y: 1.0 } : { x: 1.0, y: radiusH / radiusV };

      // Step E: scale ellipse AND ray by calculated factors.
      ellipse.axis.scaleXY(scalingFactors);
      ray.a.scaleXY(scalingFactors);
      ray.b.scaleXY(scalingFactors);

      // Intermediate result: now the ellipse is transformed to a circle and we can calculate intersections :)
      // Step F: calculate circle+line intersecions
      var tmpCircle = new Circle(new Vertex(), ellipse.radiusH()); // radiusH() === radiusV()
      var intersections = tmpCircle.lineIntersections(ray, inVectorBoundsOnly);

      // Step G: transform intersecions back to original configuration
      intersections.forEach(function (intersectionPoint) {
        //
        intersectionPoint.scaleXY({ x: 1 / scalingFactors.x, y: 1 / scalingFactors.y }, ellipse.center);
        intersectionPoint.rotate(-rotationAmount, ellipse.center);
        intersectionPoint.sub(moveAmount);
      });

      return intersections; // [];
    }

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

      var circle = new Circle(new Vertex(-25, -15), 90.0);
      var ellipse = new VEllipse(new Vertex(25, 15), new Vertex(150, 200), -Math.PI * 0.3);

      // We want to change the ellipse's radii and rotation by dragging points around
      var ellipseRotationControlPoint = ellipse.vertAt(0.0).scale(1.2, ellipse.center);
      if (ellipseHelper) {
        ellipseHelper.destroy();
      }
      ellipseHelper = new VEllipseHelper(ellipse, ellipseRotationControlPoint);
      // pb.add([circle, ellipse, ellipseRotationControlPoint], false);

      shapes = [polygon, circle, ellipse, ellipseRotationControlPoint];
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
