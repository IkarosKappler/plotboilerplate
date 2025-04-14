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
  const DEG_TO_RAD = Math.PI / 180.0;
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
    // Disable automatically added handle lines
    pb.drawConfig.drawHandleLines = false;
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
    pb.drawConfig.bezier.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.bezier.lineWidth = 2;
    // pb.drawConfig.drawHandleLines = false;

    // Array<Polygon | Circle | Ellipse>
    var shapes = [];
    var mainRay = new Vector(new Vertex(), new Vertex(250, 250).rotate(Math.random() * Math.PI));
    // Array<Vector>
    var rays = [];
    var ellipseHelper;
    var cicleSectorHelper;
    var ellipseSectorHelper;
    var bezierHelper;
    // rays.push(mainRay);

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      animate: params.getBoolean("animate", false),
      rayThickness: 5.0,
      iterations: 3
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();

    var postDraw = function (draw, fill) {
      var initialRays = getRayCollection(mainRay);
      drawRays(draw, fill, initialRays);
      var numIter = Math.max(0, config.iterations); // Safeguard to avoid infinite loop
      for (var i = 0; i < numIter; i++) {
        var raysByShapes = getRayIteration(initialRays);
        // console.log("next ray iteration", raysByShapes);
        raysByShapes.forEach(function (rays) {
          drawRays(draw, fill, rays);
        });
      }
      ellipseHelper.drawHandleLines(draw, fill);
      cicleSectorHelper.drawHandleLines(draw, fill);
      ellipseSectorHelper.drawHandleLines(draw, fill);
      bezierHelper.drawHandleLines();
    };

    var drawRays = function (draw, fill, rays) {
      rays.forEach(function (ray) {
        draw.arrow(ray.a, ray.b, "orange", config.rayThickness);
      });
    };

    var getRayIteration = function (currentRays) {
      var reflectedRaysByShapes = calculateAllReflections(currentRays);
      return reflectedRaysByShapes;
    };

    /**
     * @return {Array<Vector[]>} An two-dimensional array of vectors; each array for one of the base shapes.
     */
    var calculateAllReflections = function (rays) {
      // var rays = getRayCollection(mainRay);
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
      var reflectedRay = null;

      // Find intersection with min distance
      if (
        shape instanceof Polygon ||
        shape instanceof Circle ||
        shape instanceof VEllipse ||
        shape instanceof CircleSector ||
        shape instanceof VEllipseSector ||
        shape instanceof BezierPath ||
        // Note: this is not a direct drawable and cannot be directly added to the canvas,
        // but let's also handle this case
        shape instanceof CubicBezierCurve
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
          var angleBetween = closestIntersectionTangent.angle(ray);
          // rotateVector(closestIntersectionTangent, angleBetween);
          closestIntersectionTangent.rotate(angleBetween);
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

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildShape = function () {
      pb.removeAll(false, false); // Don't trigger redraw

      // Create a new randomized polygon.
      var polygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
      polygon.scale(0.3, polygon.getCentroid());

      // Create circle and ellpise
      var circle = new Circle(new Vertex(-25, -15), 90.0);
      var ellipse = new VEllipse(new Vertex(25, 15), new Vertex(150, 200), -Math.PI * 0.3);
      var circleSector = randomCircleSector(viewport);
      var ellipseSector = randomEllipseSector(viewport);

      // Create a new randomized Bézier curve.
      var tmpPolygon = createRandomizedPolygon(4, viewport, true); // createClockwise=true
      tmpPolygon.scale(0.3, polygon.getCentroid());
      var bezierPath = BezierPath.fromCurve(
        new CubicBezierCurve(tmpPolygon.vertices[0], tmpPolygon.vertices[1], tmpPolygon.vertices[2], tmpPolygon.vertices[3])
      );
      bezierHelper = new BezierPathInteractionHelper(pb, [bezierPath]);

      shapes = [polygon, circle, ellipse, circleSector, ellipseSector, bezierPath];
      // Align all shapes on a circle :)
      var alignCircle = new Circle(new Vertex(), viewport.getMinDimension() * 0.333);
      shapes.forEach(function (shape, i) {
        var newPosition = alignCircle.vertAt((i * Math.PI * 2) / shapes.length);
        // console.log("shape ", i, typeof shape);
        shape.move(newPosition);
      });

      // We want to change the ellipse's radii and rotation by dragging points around
      var ellipseRotationControlPoint = ellipse.vertAt(0.0).scale(1.2, ellipse.center);
      if (ellipseHelper) {
        ellipseHelper.destroy();
      }
      ellipseHelper = new VEllipseHelper(ellipse, ellipseRotationControlPoint);

      // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
      var controlPointA = circleSector.circle.vertAt(circleSector.startAngle);
      var controlPointB = circleSector.circle.vertAt(circleSector.endAngle);
      if (cicleSectorHelper) {
        cicleSectorHelper.destroy();
      }
      cicleSectorHelper = new CircleSectorHelper(circleSector, controlPointA, controlPointB, pb);

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

      pb.add(shapes, false);
      pb.add(
        [ellipseRotationControlPoint, controlPointA, controlPointB, startControlPoint, endControlPoint, rotationControlPoint],
        false
      );
      // pb.add(rays, true); // trigger redraw
      pb.add([mainRay], true); // trigger redraw
    };

    var getRayCollection = function (baseRay) {
      var numRays = 10;
      var rangeAngle = 35.0 * DEG_TO_RAD;
      var rays = [];
      for (var i = 0; i < numRays; i++) {
        rays.push(baseRay.clone().rotate(-rangeAngle / 2.0 + rangeAngle * (i / numRays)));
      }
      // console.log("ray collection", rays);
      return rays;
    };

    // +---------------------------------------------------------------------------------
    // | Render next animation step.
    // +-------------------------------
    function animateStep(time) {
      var animationCircle = new Circle(new Vertex(), viewport.getMinDimension() * 0.5);
      mainRay.b.set(animationCircle.vertAt(time / 5000));
      pb.redraw();
      if (isAnimationRunning) {
        globalThis.requestAnimationFrame(animateStep);
      }
    }

    // +---------------------------------------------------------------------------------
    // | Toggle animation of main ray.
    // +-------------------------------
    var isAnimationRunning = false;
    function toggleAnimation() {
      if (config.animate) {
        if (!isAnimationRunning) {
          isAnimationRunning = true;
          animateStep(0);
        }
      } else {
        if (isAnimationRunning) {
          isAnimationRunning = false;
        }
      }
    }

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "animate").name("animate").title("Animate the ray?")
        .onChange( function() { toggleAnimation(); });
      // prettier-ignore
      gui.add(config, "rayThickness").name("rayThickness").title("Line thickness of rays.")
        .onChange( function() { pb.redraw() });
    }

    pb.config.postDraw = postDraw;
    rebuildShape();
    toggleAnimation();
  });
})(globalThis);
