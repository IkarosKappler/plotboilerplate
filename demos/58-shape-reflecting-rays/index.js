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

    // Array<Polygon | Circle | Ellipse>
    var shapes = [];
    var mainRay = new Vector(new Vertex(), new Vertex(250, 250).rotate(Math.random() * Math.PI));
    // Array<Vector>
    var rays = [];
    var ellipseHelper;
    var cicleSectorHelper;
    var ellipseSectorHelper;
    rays.push(mainRay);

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      animate: params.getBoolean("animate", false)
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();

    var postDraw = function (draw, fill) {
      var reflectedRaysByShapes = calculateAllReflections();
      reflectedRaysByShapes.forEach(function (reflectedRays) {
        reflectedRays.forEach(function (ray) {
          draw.arrow(ray.a, ray.b, "orange", 5.0);
        });
      });
      ellipseHelper.drawHandleLines(draw, fill);
      cicleSectorHelper.drawHandleLines(draw, fill);
      ellipseSectorHelper.drawHandleLines(draw, fill);
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
      var reflectedRay = null;

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
      } else if (shape instanceof BezierPath) {
        lineIntersections(shape.bezierCurves[0], mainRay, false);
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
      pb.add(rays, true); // trigger redraw
    };

    // lineIntersections(ray: VertTuple<Vector>, inVectorBoundsOnly: boolean = false): Array<Vertex> {
    var lineIntersections = function (bezierCurve, ray, inVectorBoundsOnly) {
      console.log("lineIntersections bezier");
      // First step: rotate ray and curve so ray is on x-axis and starts at (0,0)
      // var rotateAngle = -ray.angle();
      // var moveAmount = { x: 0, y: -ray.a.y };
      // var curveMod = bezierCurve.clone();
      // curveMod.startPoint.rotate(rotateAngle, ray.a);
      // curveMod.startControlPoint.rotate(rotateAngle, ray.a);
      // curveMod.endControlPoint.rotate(rotateAngle, ray.a);
      // curveMod.endPoint.rotate(rotateAngle, ray.a);

      // curveMod.startPoint.move(moveAmount);
      // curveMod.startControlPoint.move(moveAmount);
      // curveMod.endControlPoint.move(moveAmount);
      // curveMod.endPoint.move(moveAmount);

      // pb.draw.cubicBezier(
      //   curveMod.startPoint,
      //   curveMod.endPoint,
      //   curveMod.startControlPoint,
      //   curveMod.endControlPoint,
      //   "green",
      //   1
      // );

      // Now solve this equation?
      // 0 = (1-t)^3 * P0.y + 3(1-t)^2t * P1.y + 3(1-t)t^2 * P2.y + t^3 * P3.y

      var ts = bezierCurve.lineIntersectionTs(ray);

      ts.forEach(function (localT) {
        var point = bezierCurve.getPointAt(localT);
        pb.draw.circle(point, 4, "red", 2);
      });

      // var intersectionPoints = bezierCurve.lineIntersections(ray, inVectorBoundsOnly);
      // intersectionPoints.forEach(function (point) {
      //   pb.draw.circle(point, 2, "green", 1);
      // });

      // var intersections = computeIntersections(bezierCurve, ray);
      // intersections.forEach(function (point) {
      //   pb.draw.circle(point, 7, "blue", 2);
      // });
    };

    // /*based on http://mysite.verizon.net/res148h4j/javascript/script_exact_cubic.html#the%20source%20code*/
    // // Inspired by
    // //    https://www.particleincell.com/2013/cubic-line-intersection/
    // function cubicRoots(P) {
    //   var a = P[0];
    //   var b = P[1];
    //   var c = P[2];
    //   var d = P[3];

    //   var A = b / a;
    //   var B = c / a;
    //   var C = d / a;

    //   var Q, R, D, S, T, Im;

    //   var Q = (3 * B - Math.pow(A, 2)) / 9;
    //   var R = (9 * A * B - 27 * C - 2 * Math.pow(A, 3)) / 54;
    //   var D = Math.pow(Q, 3) + Math.pow(R, 2); // polynomial discriminant

    //   var t = Array();

    //   if (D >= 0) {
    //     // complex or duplicate roots
    //     var S = CubicBezierCurve.utils.sgn(R + Math.sqrt(D)) * Math.pow(Math.abs(R + Math.sqrt(D)), 1 / 3);
    //     var T = CubicBezierCurve.utils.sgn(R - Math.sqrt(D)) * Math.pow(Math.abs(R - Math.sqrt(D)), 1 / 3);

    //     t[0] = -A / 3 + (S + T); // real root
    //     t[1] = -A / 3 - (S + T) / 2; // real part of complex root
    //     t[2] = -A / 3 - (S + T) / 2; // real part of complex root
    //     Im = Math.abs((Math.sqrt(3) * (S - T)) / 2); // complex part of root pair

    //     /*discard complex roots*/
    //     if (Im != 0) {
    //       t[1] = -1;
    //       t[2] = -1;
    //     }
    //   } // distinct real roots
    //   else {
    //     var th = Math.acos(R / Math.sqrt(-Math.pow(Q, 3)));

    //     t[0] = 2 * Math.sqrt(-Q) * Math.cos(th / 3) - A / 3;
    //     t[1] = 2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI) / 3) - A / 3;
    //     t[2] = 2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI) / 3) - A / 3;
    //     Im = 0.0;
    //   }

    //   /*discard out of spec roots*/
    //   for (var i = 0; i < 3; i++) if (t[i] < 0 || t[i] > 1.0) t[i] = -1;

    //   /*sort but place -1 at the end*/
    //   t = sortSpecial(t);

    //   console.log(t[0] + " " + t[1] + " " + t[2]);
    //   return t;
    // }

    // function sortSpecial(a) {
    //   var flip;
    //   var temp;

    //   do {
    //     flip = false;
    //     for (var i = 0; i < a.length - 1; i++) {
    //       if ((a[i + 1] >= 0 && a[i] > a[i + 1]) || (a[i] < 0 && a[i + 1] >= 0)) {
    //         flip = true;
    //         temp = a[i];
    //         a[i] = a[i + 1];
    //         a[i + 1] = temp;
    //       }
    //     }
    //   } while (flip);
    //   return a;
    // }

    // function computeIntersections(bezier, line) {
    //   var px = [bezier.startPoint.x, bezier.startControlPoint.x, bezier.endControlPoint.x, bezier.endPoint.x];
    //   var py = [bezier.startPoint.y, bezier.startControlPoint.y, bezier.endControlPoint.y, bezier.endPoint.y];
    //   var lx = [line.a.x, line.b.x];
    //   var ly = [line.a.y, line.b.y];

    //   return _computeIntersections(bezier, line, px, py, lx, ly);
    // }

    /*computes intersection between a cubic spline and a line segment*/
    // px = [ x0, x1, x2, x3 ]
    // py = [ y0, y1, y2, y3 ]
    // lx = [ x0, x1 ]
    // ly = [ y0, y1 ]
    // function _computeIntersections(bezier, line) {
    //   // THIS IS NEW
    //   var I = new Array(new Vertex(NaN, NaN), new Vertex(NaN, NaN), new Vertex(NaN, NaN));
    //   var Y = Array();

    //   var X = Array();

    //   // var A = ly[1] - ly[0]; // A=y2-y1
    //   // var B = lx[0] - lx[1]; // B=x1-x2
    //   // var C = lx[0] * (ly[0] - ly[1]) + ly[0] * (lx[1] - lx[0]); //C=x1*(y1-y2)+y1*(x2-x1)
    //   var A = line.b.y - line.a.y; // A=y2-y1
    //   var B = line.a.x - line.b.x; // B=x1-x2
    //   var C = line.a.x * (line.a.y - line.b.y) + line.a.y * (line.b.x - line.a.x); //C=x1*(y1-y2)+y1*(x2-x1)

    //   // var bx = bezierCoeffs(px[0], px[1], px[2], px[3]);
    //   // var by = bezierCoeffs(py[0], py[1], py[2], py[3]);
    //   var bx = CubicBezierCurve.utils.bezierCoeffs(
    //     bezier.startPoint.x,
    //     bezier.startControlPoint.x,
    //     bezier.endControlPoint.x,
    //     bezier.endPoint.x
    //   );
    //   var by = CubicBezierCurve.utils.bezierCoeffs(
    //     bezier.startPoint.y,
    //     bezier.startControlPoint.y,
    //     bezier.endControlPoint.y,
    //     bezier.endPoint.y
    //   );

    //   var P = Array();
    //   P[0] = A * bx[0] + B * by[0]; /*t^3*/
    //   P[1] = A * bx[1] + B * by[1]; /*t^2*/
    //   P[2] = A * bx[2] + B * by[2]; /*t*/
    //   P[3] = A * bx[3] + B * by[3] + C; /*1*/

    //   var r = CubicBezierCurve.utils.cubicRoots(P);

    //   /*verify the roots are in bounds of the linear segment*/
    //   for (var i = 0; i < 3; i++) {
    //     // t = r[i];
    //     var t = r[i];

    //     X[0] = bx[0] * t * t * t + bx[1] * t * t + bx[2] * t + bx[3];
    //     X[1] = by[0] * t * t * t + by[1] * t * t + by[2] * t + by[3];

    //     //
    //     // above is intersection point assuming infinitely long line segment,
    //     //  make sure we are also in bounds of the line
    //     var s;
    //     // if (lx[1] - lx[0] != 0) {
    //     if (line.b.x - line.a.x != 0) {
    //       /*if not vertical line*/
    //       // s = (X[0] - lx[0]) / (lx[1] - lx[0]);
    //       s = (X[0] - line.a.x) / (line.b.x - line.a.x);
    //     } else {
    //       // s = (X[1] - ly[0]) / (ly[1] - ly[0]);
    //       s = (X[1] - line.a.y) / (line.b.y - line.a.y);
    //     }

    //     // in bounds?
    //     if (t < 0 || t > 1.0 || s < 0 || s > 1.0) {
    //       X[0] = -100; /*move off screen*/
    //       X[1] = -100;
    //     }

    //     // Store intersection point
    //     // I[i].setAttributeNS(null, "cx", X[0]);
    //     // I[i].setAttributeNS(null, "cy", X[1]);
    //     I[i].set(X[0], Y[0]);
    //   }

    //   console.log("r", r);

    //   r.forEach(function (localT) {
    //     var point = bezier.getPointAt(localT);
    //     pb.draw.circle(point, 4, "red", 2);
    //   });

    //   return I;
    // }

    // // sign of number
    // function sgn(x) {
    //   if (x < 0.0) return -1;
    //   return 1;
    // }

    // function bezierCoeffs(P0, P1, P2, P3) {
    //   var Z = Array();
    //   Z[0] = -P0 + 3 * P1 + -3 * P2 + P3;
    //   Z[1] = 3 * P0 - 6 * P1 + 3 * P2;
    //   Z[2] = -3 * P0 + 3 * P1;
    //   Z[3] = P0;
    //   return Z;
    // }

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
    }

    pb.config.postDraw = postDraw;
    rebuildShape();
    toggleAnimation();
  });
})(globalThis);
