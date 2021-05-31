/**
 * A demo about rendering SVG path data with PlotBoilerplate.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
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

  window.addEventListener("load", function () {
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
          backgroundColor: "#ffffff",
          enableMouse: true,
          enableTouch: true,
          enableKeys: true,
          enableSVGExport: true
        },
        GUP
      )
    );

    // +---------------------------------------------------------------------------------
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function () {
      return new Vertex(
        Math.random() * pb.canvasSize.width * 0.5 - (pb.canvasSize.width / 2) * 0.5,
        Math.random() * pb.canvasSize.height * 0.5 - (pb.canvasSize.height / 2) * 0.5
      );
    };

    var path = null;
    var init = function () {
      var curves = [];
      curves.push(new CubicBezierCurve(randomVertex(), randomVertex(), randomVertex(), randomVertex()));
      path = BezierPath.fromArray(curves);
      pb.add(path);
    };

    var postDraw = function (draw, fill) {
      for (var i in path.bezierCurves) {
        var curve = path.bezierCurves[i];
        var p = curve.getPointAt(config.t);
        draw.point(p, "rgba(0,0,0,1)");
        // // var curvature = getCurvatureAt(curve, config.t);
        // var p0 = curve.getPointAt(config.t - config.t * 0.1);
        // var p1 = curve.getPointAt(config.t + config.t * 0.1);
        // var triangle = new Triangle(p0, p, p1);
        // var circle = triangle.getCircumcircle();
        var circle = getCircleAt(curve, config.t);
        pb.draw.circle(circle.center, circle.radius, "blue", 1);

        for (var j = 1; j <= 100; j++) {
          var t = j / 100;
          var p = curve.getPointAt(t);
          var circle = getCircleAt(curve, t);
          draw.line(p, circle.center, "green", 1);
        }
      }
    };

    var getCircleAt = function (curve, t) {
      var p = curve.getPointAt(t);
      var p0 = curve.getPointAt(t - t * 0.1);
      var p1 = curve.getPointAt(t + t * 0.1);
      var triangle = new Triangle(p0, p, p1);
      var circle = triangle.getCircumcircle();
      return circle;
    };

    var getCurvatureAt = function (curve, t) {
      // https://stackoverflow.com/questions/46762955/computing-the-radius-of-curvature-of-a-bezier-curve-given-control-points
      //       As such, for a Quadratic Bezier curve with controls P₁, P₂, and P₃, the first and second derivatives use the following control points:
      // B(t)': P₁' = 2(P₂ - P₁), and P₂' = 2(P₃ - P₂)
      // B(t)": P₁" = (P'₂ - P'₁)

      var c = {
        p0: curve.startPoint,
        p1: curve.startControlPoint,
        p2: curve.endControlPoint,
        p3: curve.endPoint
      };
      var d1 = {
        p0: c.p1.clone().sub(c.p0).multiplyScalar(3),
        p1: c.p2.clone().sub(c.p1).multiplyScalar(3),
        p2: c.p3.clone().sub(c.p2).multiplyScalar(3)
      };
      var d2 = {
        p0: d1.p1.clone().sub(d1.p0).multiplyScalar(3),
        p1: d1.p2.clone().sub(d1.p1).multiplyScalar(3)
      };

      // ax = P[1].x - P[0].x;               //  a = P1 - P0
      // ay = P[1].y - P[0].y;
      // bx = P[2].x - P[1].x - ax;          //  b = P2 - P1 - a
      // by = P[2].y - P[1].y - ay;
      // cx = P[3].x - P[2].x - bx*2 - ax;   //  c = P3 - P2 - 2b - a
      // cy = P[3].y - P[2].y - by*2 - ay;
      // bc = bx*cy - cx*by;
      // ac = ax*cy - cx*ay;
      // ab = ax*by - bx*ay;
      // r = ab + ac*t + bc*t*t;
      // P0 = start
      // P1 = startControl
      // P2 = endControl
      // P3 = end
      /* var ax = curve.startControlPoint.x - curve.startPoint.x; //  a = P1 - P0
      var ay = curve.startControlPoint.y - curve.startPoint.y;
      var bx = curve.endControlPoint.x - curve.startControlPoint.x - ax; //  b = P2 - P1 - a
      var by = curve.endControlPoint.y - curve.startControlPoint.y - ay;
      var cx = curve.endPoint.x - curve.endControlPoint.x - bx * 2 - ax; //  c = P3 - P2 - 2b - a
      var cy = curve.endPoint.y - curve.endControlPoint.y - by * 2 - ay;
      var bc = bx * cy - cx * by;
      var ac = ax * cy - cx * ay;
      var ab = ax * by - bx * ay;
      var r = ab + ac * t + bc * t * t;
      console.log(r);
      return r; */
      // curvature: function (t, d1, d2, _3d, kOnly) {
      //   let num,
      //     dnm,
      //     adk,
      //     dk,
      //     k = 0,
      //     r = 0;
      var num, adk, dk, k, r;
      //   //
      //   // We're using the following formula for curvature:
      //   //
      //   //              x'y" - y'x"
      //   //   k(t) = ------------------
      //   //           (x'² + y'²)^(3/2)
      //   //
      //   // from https://en.wikipedia.org/wiki/Radius_of_curvature#Definition
      //   //
      //   const d = utils.compute(t, d1);
      //   const dd = utils.compute(t, d2);
      //   const qdsum = d.x * d.x + d.y * d.y;
      // var d = {
      //   start : curve.startPoint,
      //   control : curve.endControlPoint.clone().sub(curve.startControlPoint).multiplyScalar(3))
      // }
      // var dd = utils.compute(t, d2);
      // var qdsum = d.x * d.x + d.y * d.y;
      //   if (_3d) {
      //     num = sqrt(
      //       pow(d.y * dd.z - dd.y * d.z, 2) +
      //         pow(d.z * dd.x - dd.z * d.x, 2) +
      //         pow(d.x * dd.y - dd.x * d.y, 2)
      //     );
      //     dnm = pow(qdsum + d.z * d.z, 3 / 2);
      //   } else {
      //     num = d.x * dd.y - d.y * dd.x;
      //     dnm = pow(qdsum, 3 / 2);
      //   }
      //   if (num === 0 || dnm === 0) {
      //     return { k: 0, r: 0 };
      //   }
      //   k = num / dnm;
      //   r = dnm / num;
      //   // We're also computing the derivative of kappa, because
      //   // there is value in knowing the rate of change for the
      //   // curvature along the curve. And we're just going to
      //   // ballpark it based on an epsilon.
      //   if (!kOnly) {
      //     // compute k'(t) based on the interval before, and after it,
      //     // to at least try to not introduce forward/backward pass bias.
      //     const pk = utils.curvature(t - 0.001, d1, d2, _3d, true).k;
      //     const nk = utils.curvature(t + 0.001, d1, d2, _3d, true).k;
      //     dk = (nk - k + (k - pk)) / 2;
      //     adk = (abs(nk - k) + abs(k - pk)) / 2;
      //   }
      //   return { k: k, r: r, dk: dk, adk: adk };
      // },
    };

    // var derive = function (points) {
    //   const dpoints = [];
    //   for (let p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
    //     const list = [];
    //     for (let j = 0, dpt; j < c; j++) {
    //       dpt = {
    //         x: c * (p[j + 1].x - p[j].x),
    //         y: c * (p[j + 1].y - p[j].y),
    //       };
    //       if (_3d) {
    //         dpt.z = c * (p[j + 1].z - p[j].z);
    //       }
    //       list.push(dpt);
    //     }
    //     dpoints.push(list);
    //     p = list;
    //   }
    //   return dpoints;
    // },

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        t: 0.5
        // sampleCount: 8,
        // drawLinear: true,
        // lineWidth: 2.0,
        // drawLagrangeBasis: true,
        // drawLagrangeSum: true,
        // drawSampleLines: true,
        // drawNewton: false,
        // drawFourierTransform: true
      },
      GUP
    );

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
      var f0 = gui.addFolder("Path draw settings");

      // prettier-ignore
      f0.add(config, "t").min(0.0).max(1.0).title("The offset t.").onChange(function () { pb.redraw(); });

      // // prettier-ignore
      // f0.add(config, "sampleCount").min(3).max(16).step(1).title("The number of samples to use.").onChange(function () { updateSampleCount(); });
      // // prettier-ignore
      // f0.add(config, "lineWidth").min(1).max(20).title("The line with to use.").onChange(function () { pb.redraw(); });
      // // prettier-ignore
      // f0.add(config, "drawLinear").title("Draw linear interpolation?").onChange(function () { pb.redraw(); });
      // // prettier-ignore
      // f0.add(config, "drawLagrangeBasis").title("Draw Lagrange basis?").onChange(function () { pb.redraw(); });
      // // prettier-ignore
      // f0.add(config, "drawLagrangeSum").title("Draw Lagrange sum?").onChange(function () { pb.redraw(); });
      // // prettier-ignore
      // f0.add(config, "drawSampleLines").title("Draw sample lines?").onChange(function () { pb.redraw(); });
      // // prettier-ignore
      // f0.add(config, "drawNewton").title("Draw Newton polynom?").onChange(function () { pb.redraw(); });
      // // prettier-ignore
      // f0.add(config, "drawFourierTransform").title("Draw Fourier transform?").onChange(function () { pb.redraw(); });
      f0.open();

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    init();
    pb.config.postDraw = postDraw;
    // Will stop after first draw if config.animate==false
    if (config.animate) {
      startAnimation();
    } else {
      // setView(viewRangeX, viewRangeY);
      pb.redraw();
    }
  });
})(window);
