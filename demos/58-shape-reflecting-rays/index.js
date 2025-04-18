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
    pb.drawConfig.line.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.line.lineWidth = 2;
    pb.drawConfig.triangle.color = "rgba(128,128,128,0.5)";
    pb.drawConfig.triangle.lineWidth = 2;
    // pb.drawConfig.drawHandleLines = false;

    // Array<Polygon | Circle | VEllipse | Line | CircleSector | VEllipseSector | BezierPath | Triangle>
    var shapes = [];
    var mainRay = new Vector(new Vertex(), new Vertex(250, 250).rotate(Math.random() * Math.PI));
    var ellipseHelper;
    var cicleSectorHelper;
    var ellipseSectorHelper;
    var bezierHelper;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      animate: params.getBoolean("animate", false),
      rayThickness: params.getNumber("rayThickness", 3.0),
      iterations: params.getNumber("iterations", 6),
      initialRayAngle: params.getNumber("initialRayAngle", 35.0),
      showBoundingBoxes: params.getBoolean("showBoundingBoxes", false)
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();

    var postDraw = function (draw, fill) {
      console.log("config.showBoundingBoxes", config.showBoundingBoxes);
      if (config.showBoundingBoxes) {
        drawBoundingBoxes(draw, fill);
      }

      var rayStepLength = mainRay.length();
      var rayCollection = getRayCollection(mainRay);
      var newRays = [];
      var numIter = Math.max(0, config.iterations); // Safeguard to avoid infinite loop
      for (var i = 0; i < numIter; i++) {
        // console.log("numIter", numIter, "i", i, "rayCollection.length", rayCollection.length, "newRays.length", newRays.length);

        // Set rays to normalized step
        for (var j = 0; j < rayCollection.length; j++) {
          rayCollection[j].setLength(rayStepLength);
        }

        drawLines(draw, fill, rayCollection, "rgba(192,192,192,0.25)");
        newRays = getRayIteration(rayCollection);
        // Crop original rays
        for (var j = 0; j < rayCollection.length; j++) {
          rayCollection[j].b.set(newRays[j].a);
        }
        if (i + 1 >= numIter) {
          drawRays(draw, fill, rayCollection, "rgba(255,192,0,0.5)");
        } else {
          drawLines(draw, fill, rayCollection, "rgba(255,192,0,0.5)");
        }
        rayCollection = newRays;
        // Move new rays one unit (pixel) into their new direction
        // (avoid to reflect multiple times inside one single point)
        for (var j = 0; j < rayCollection.length; j++) {
          rayCollection[j].a.set(rayCollection[j].clone().setLength(0.1).b);
        }
      }
      ellipseHelper.drawHandleLines(draw, fill);
      cicleSectorHelper.drawHandleLines(draw, fill);
      ellipseSectorHelper.drawHandleLines(draw, fill);
      bezierHelper.drawHandleLines();
    }; // END postDraw

    var drawBoundingBoxes = function (draw, fill) {
      shapes.forEach(function (shape) {
        if (typeof shape["getBounds"] !== "function") {
          return;
        }
        var bounds = shape.getBounds();
        draw.rect(
          bounds.min, // position: XYCoords,
          bounds.width, // : number,
          bounds.height, // : number,
          "black",
          1
        );

        if (shape instanceof BezierPath) {
          console.log("is bezier path");
          var bbox = findBB(shape.bezierCurves[0]);
          draw.rect(
            bbox.min, // position: XYCoords,
            bbox.width, // : number,
            bbox.height, // : number,
            "red",
            2
          );
        }
      });
    };

    var drawRays = function (draw, fill, rays, color) {
      rays.forEach(function (ray) {
        draw.arrow(ray.a, ray.b, color, config.rayThickness);
      });
    };

    var drawLines = function (draw, fill, rays, color) {
      rays.forEach(function (ray) {
        draw.line(ray.a, ray.b, color, config.rayThickness);
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
      // Array<Vector[]>
      var resultVectors = [];
      rays.forEach(function (ray) {
        const reflectedRays = [];
        shapes.forEach(function (shape) {
          var reflectedRay = findReflectedRay(shape, ray);
          if (reflectedRay != null) {
            // && reflectedRay.length() > 0.1) {
            reflectedRays.push(reflectedRay);
          }
        });
        if (reflectedRays.length > 0) {
          resultVectors.push(findClosestRay(ray, reflectedRays));
        } else {
          // Just expand input ray
          resultVectors.push(ray.clone().moveTo(ray.b));
        }
      });
      return resultVectors;
    };

    // Pre: rays.length > 0
    var findClosestRay = function (sourceRay, rays) {
      var dist = sourceRay.a.distance(rays[0].a);
      var resultIndex = 0;
      for (var i = 1; i < rays.length; i++) {
        if (sourceRay.a.distance(rays[i].a) < dist) {
          // && sourceRay.a.distance(rays[i].a) > 0.0001) {
          resultIndex = i;
        }
      }
      return rays[resultIndex];
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
        shape instanceof Line ||
        shape instanceof Circle ||
        shape instanceof VEllipse ||
        shape instanceof CircleSector ||
        shape instanceof VEllipseSector ||
        shape instanceof BezierPath ||
        // Note: this is not a direct drawable and cannot be directly added to the canvas,
        // but let's also handle this case
        shape instanceof CubicBezierCurve ||
        shape instanceof Triangle
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

      var line = new Line(viewport.randomPoint(), viewport.randomPoint());

      var triangle = new Triangle(viewport.randomPoint(), viewport.randomPoint(), viewport.randomPoint());

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

      shapes = [polygon, circle, ellipse, circleSector, ellipseSector, bezierPath, line, triangle];
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
      // var rangeAngle = 35.0 * DEG_TO_RAD;
      var rangeAngle = config.initialRayAngle * DEG_TO_RAD;

      var rays = [];
      for (var i = 0; i < numRays; i++) {
        rays.push(baseRay.clone().rotate(-rangeAngle / 2.0 + rangeAngle * (i / numRays)));
      }
      // console.log("ray collection", rays);
      return rays;
    };

    function findBB(bCurve) {
      var P = [
        { X: bCurve.startPoint.x, Y: bCurve.startPoint.y },
        { X: bCurve.startControlPoint.x, Y: bCurve.startControlPoint.y },
        { X: bCurve.endControlPoint.x, Y: bCurve.endControlPoint.y },
        { X: bCurve.endPoint.x, Y: bCurve.endPoint.y }
      ];
      var a, b, c, disc;
      // var a = 3 * P[3].X - 9 * P[2].X + 9 * P[1].X - 3 * P[0].X;
      // var b = 6 * P[0].X - 12 * P[1].X + 6 * P[2].X;
      // var c = 3 * P[1].X - 3 * P[0].X;
      // var polyX = cubicPoly(
      //   P[0].X, // bezierCurve.startPoint.x,
      //   P[1].X, // bezierCurve.startControlPoint.x,
      //   P[2].X, // bezierCurve.endControlPoint.x,
      //   P[3].X // bezierCurve.endPoint.x
      // );
      // var a = polyX.a;
      // var b = polyX.b;
      // var c = polyX.c;
      // //alert("a "+a+" "+b+" "+c);
      // // var disc = b * b - 4 * a * c;
      // // var disc = polyX.b * polyX.b - 4 * polyX.a * polyX.c;
      // var disc = polyX.b * polyX.b - 4 * polyX.a * polyX.c;
      // var xl = Math.min(bCurve.endPoint.x, bCurve.startPoint.x); // P[0].X;
      // var xh = Math.max(bCurve.endPoint.x, bCurve.startPoint.x); // P[0].X;
      // // if (P[3].X < xl) xl = P[3].X;
      // // if (P[3].X > xh) xh = P[3].X;
      // if (disc >= 0) {
      //   var t1 = (-b + Math.sqrt(disc)) / (2 * a);
      //   // alert("t1 " + t1);
      //   if (t1 > 0 && t1 < 1) {
      //     // var x1 = evalBez(PX, t1);
      //     var x1 = bCurve.getPointAt(t1).x;
      //     if (x1 < xl) xl = x1;
      //     if (x1 > xh) xh = x1;
      //   }

      //   var t2 = (-b - Math.sqrt(disc)) / (2 * a);
      //   // alert("t2 " + t2);
      //   if (t2 > 0 && t2 < 1) {
      //     // var x2 = evalBez(PX, t2);
      //     var x2 = bCurve.getPointAt(t2).x;
      //     if (x2 < xl) xl = x2;
      //     if (x2 > xh) xh = x2;
      //   }
      // }
      var xMinMax = cubicPolyMinMax(bCurve.startPoint.x, bCurve.startControlPoint.x, bCurve.endControlPoint.x, bCurve.endPoint.x);
      var xl = xMinMax.min;
      var xh = xMinMax.max;

      // a = 3 * P[3].Y - 9 * P[2].Y + 9 * P[1].Y - 3 * P[0].Y;
      // b = 6 * P[0].Y - 12 * P[1].Y + 6 * P[2].Y;
      // c = 3 * P[1].Y - 3 * P[0].Y;
      // disc = b * b - 4 * a * c;
      // var yl = P[0].Y;
      // var yh = P[0].Y;
      // if (P[3].Y < yl) yl = P[3].Y;
      // if (P[3].Y > yh) yh = P[3].Y;
      // if (disc >= 0) {
      //   var t1 = (-b + Math.sqrt(disc)) / (2 * a);
      //   // alert("t3 " + t1);

      //   if (t1 > 0 && t1 < 1) {
      //     // var y1 = evalBez(PY, t1);
      //     var y1 = bCurve.getPointAt(t1).y; // evalBez(PY, t1);
      //     if (y1 < yl) yl = y1;
      //     if (y1 > yh) yh = y1;
      //   }

      //   var t2 = (-b - Math.sqrt(disc)) / (2 * a);
      //   // alert("t4 " + t2);

      //   if (t2 > 0 && t2 < 1) {
      //     // var y2 = evalBez(PY, t2);
      //     var y2 = bCurve.getPointAt(t2).y;
      //     if (y2 < yl) yl = y2;
      //     if (y2 > yh) yh = y2;
      //   }
      // }
      var yMinMax = cubicPolyMinMax(bCurve.startPoint.y, bCurve.startControlPoint.y, bCurve.endControlPoint.y, bCurve.endPoint.y);
      var yl = yMinMax.min;
      var yh = yMinMax.max;

      // ctx.moveTo(xl, yl);
      // ctx.lineTo(xl, yh);
      // ctx.lineTo(xh, yh);
      // ctx.lineTo(xh, yl);
      // ctx.lineTo(xl, yl);

      return Bounds.computeFromVertices([
        { x: xl, y: yl },
        { x: xl, y: yh },
        { x: xh, y: yh },
        { x: xh, y: yl }
      ]);
    }

    var cubicPolyMinMax = function (p0, p1, p2, p3) {
      var polyX = cubicPoly(
        p0, // P[0].X, // bezierCurve.startPoint.x,
        p1, // P[1].X, // bezierCurve.startControlPoint.x,
        p2, // P[2].X, // bezierCurve.endControlPoint.x,
        p3 // P[3].X // bezierCurve.endPoint.x
      );
      var a = polyX.a;
      var b = polyX.b;
      var c = polyX.c;
      //alert("a "+a+" "+b+" "+c);
      // var disc = b * b - 4 * a * c;
      // var disc = polyX.b * polyX.b - 4 * polyX.a * polyX.c;
      var disc = polyX.b * polyX.b - 4 * polyX.a * polyX.c;
      // var xl = Math.min(bCurve.endPoint.x, bCurve.startPoint.x); // P[0].X;
      // var xh = Math.max(bCurve.endPoint.x, bCurve.startPoint.x); // P[0].X;
      var xl = Math.min(p3, p0); // P[0].X;
      var xh = Math.max(p3, p0); // P[0].X;
      // if (P[3].X < xl) xl = P[3].X;
      // if (P[3].X > xh) xh = P[3].X;
      if (disc >= 0) {
        var t1 = (-b + Math.sqrt(disc)) / (2 * a);
        // alert("t1 " + t1);
        if (t1 > 0 && t1 < 1) {
          // var x1 = evalBez(PX, t1);
          // var x1 = bCurve.getPointAt(t1).x;
          var x1 = CubicBezierCurve.utils.evaluateT(p0, p1, p2, p3, t1); // bCurve.getPointAt(t1).x;

          if (x1 < xl) xl = x1;
          if (x1 > xh) xh = x1;
        }

        var t2 = (-b - Math.sqrt(disc)) / (2 * a);
        // alert("t2 " + t2);
        if (t2 > 0 && t2 < 1) {
          // var x2 = evalBez(PX, t2);
          // var x2 = bCurve.getPointAt(t2).x;
          var x2 = CubicBezierCurve.utils.evaluateT(p0, p1, p2, p3, t2); //
          if (x2 < xl) xl = x2;
          if (x2 > xh) xh = x2;
        }
      }
      return { min: xl, max: xh };
    };

    var cubicPoly = function (p0, p1, p2, p3) {
      // var a = 3 * P[3].X - 9 * P[2].X + 9 * P[1].X - 3 * P[0].X;
      // var b = 6 * P[0].X - 12 * P[1].X + 6 * P[2].X;
      // var c = 3 * P[1].X - 3 * P[0].X;
      return {
        a: 3 * p3 - 9 * p2 + 9 * p1 - 3 * p0,
        b: 6 * p0 - 12 * p1 + 6 * p2,
        c: 3 * p1 - 3 * p0
      };
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
      gui.add(config, "rayThickness").min(1.0).max(10.0).step(0.5).name("rayThickness").title("Line thickness of rays.")
        .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "iterations").min(1).max(20).step(1).name("iterations").title("Number of iterations.")
        .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "initialRayAngle").min(1.0).max(360).step(1).name("initialRayAngle").title("Angle between all initial rays.")
      .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "showBoundingBoxes").name("showBoundingBoxes").title("Check to see shape's bounding boxes.")
      .onChange( function() { pb.redraw() });
    }

    pb.config.postDraw = postDraw;
    rebuildShape();
    toggleAnimation();
  });
})(globalThis);
