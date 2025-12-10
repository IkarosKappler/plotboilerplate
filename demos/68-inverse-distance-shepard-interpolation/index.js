/**
 * A script for calculating Sheperd weighted polynomials.
 *
 * @author   Ikaros Kappler
 * @date     2025-12-09
 * @version  1.0.0
 **/

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

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // ...
    };

    var viewport = pb.viewport();
    var points = [
      viewport.randomPoint(),
      viewport.randomPoint(),
      viewport.randomPoint(),
      viewport.randomPoint(),
      viewport.randomPoint(),
      viewport.randomPoint()
    ].sort(function (a, b) {
      return a.x - b.x;
    });
    for (var k = 0; k < points.length; k++) {
      config[`show_${k}`] = k == 3;
    }
    pb.add(points);

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // NONE

    var postDraw = function (draw, fill) {
      // ...
      // draw.circle({ x: 0, y: 0 }, 100, "red", 1);
      points.forEach(function (p, index) {
        draw.circle(p, 5, "red", 1);
        fill.text(`[${index}] ${p.x.toFixed(2)}, ${p.y.toFixed(2)}`, p.x, p.y, { color: "orange" });
      });

      for (var i = 1; i < points.length; i++) {
        draw.line(points[i - 1], points[i], "green", 1.0);
      }

      drawInterpolation(draw, fill, sin(viewport), { color: Color.CSS_COLORS.Purple, lineWidth: 1.0 });
      // drawInterpolation(draw, fill, orthonormal0, { color: Color.CSS_COLORS.Green, lineWidth: 1.0 });
      for (var k = 0; k < points.length; k++) {
        if (config[`show_${k}`]) {
          drawInterpolation(draw, fill, scaleY(points[k].y, lagrange(k)), {
            color: WebColors[k % WebColors.length],
            lineWidth: 2.0
          });
        }
      }
      var activeK = 3;
      drawInterpolation(draw, fill, scaleY(points[activeK].y, distanceWeight(activeK, lagrange(activeK))), {
        color: WebColors[activeK % WebColors.length],
        lineWidth: 2.0
      });
      //     dashOffset?: number;
      //     dashArray?: Array<number>;
    }; // END postDraw

    var sin = function (box) {
      return function (x) {
        return (Math.sin((x / box.width) * Math.PI * 2) * box.height) / 2;
      };
    };

    var distanceWeight = function (k, func) {
      return function (x) {
        // var relX = (x - viewport.min.x) / viewport.width;
        // var relkX = (points[k].x - viewport.min.x) / viewport.width;
        // return (1 / (1 + Math.pow(relkX - relX, 2))) * func(x);
        var width = viewport.width / 2.0; // 20.0;
        return (width / (width + Math.pow(points[k].x - x, 2))) * func(x);
      };
    };

    // var orthonormal0 = function (x) {
    //   var result = 0.0;
    //   for (var j = 0; j < points.length; j++) {
    //     result += points[j].y * lagrange(j)(x);
    //   }
    //   return result;
    // };

    // var lagrange = function (j, x) {
    //   var result = 1.0;
    //   // var n = 3;
    //   for (var m = 0; m < points.length; m++) {
    //     if (m != j) {
    //       result *= (x - points[m].x) / (points[j].x - points[m].x);
    //     }
    //   }
    //   return result;
    // };

    var scaleY = function (yFactor, func) {
      return function (x) {
        return yFactor * func(x);
      };
    };

    var lagrange = function (j) {
      return function (x) {
        var result = 1.0;
        for (var m = 0; m < points.length; m++) {
          if (m != j) {
            result *= (x - points[m].x) / (points[j].x - points[m].x);
          }
        }
        return result;
      };
    };

    /**
     *
     * @param {*} draw
     * @param {*} fill
     * @param {*} func
     * @param {Color} options.color
     * @param {number} options.lineWidth
     */
    var drawInterpolation = function (draw, fill, func, options) {
      var stepSize = 5;
      console.log(viewport);
      var x = viewport.min.x;
      var maxStepCount = viewport.width / stepSize;
      var stepNumber = 0;
      var last = { x: x, y: 0 };
      var cur = { x: x, y: 0 };
      while (x < viewport.max.x && stepNumber < maxStepCount) {
        cur.x = x + stepSize;
        // cur.y = (func((cur.x / viewport.width) * Math.PI * 2) * viewport.height) / 2;
        cur.y = func(cur.x);

        draw.line(last, cur, options.color.cssRGB(), options.lineWidth);

        x += stepSize;
        last.x = cur.x;
        last.y = cur.y;

        stepNumber++;
      }
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // // prettier-ignore
      // gui.add(config, "animate").name("animate").title("Animate the ray?")
      //   .onChange( function() { toggleAnimation(); });
      // // prettier-ignore
      // gui.add(config, "numRays").min(1).max(64).step(1).name("numRays").title("Number of rays to use.")
      //  .onChange( function() { pb.redraw() });
      for (var k = 0; k < points.length; k++) {
        // prettier-ignore
        gui.add(config, `show_${k}`).name("Show Lagrange Polynomial "+k).title("Show Lagrange Polynomial "+k)
          .onChange( function() { pb.redraw() });
      }
    }
    pb.config.postDraw = postDraw;

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    // Filter shapes; keep only those of interest here
    pb.addContentChangeListener(function (_shapesAdded, _shapesRemoved) {
      // Drop everything we cannot handle with reflections
      polygon = pb.drawables.find(function (drwbl) {
        return drwbl instanceof Polygon;
      });

      mainRay.vector = pb.drawables.find(function (drwbl) {
        return drwbl instanceof Vector;
      });
    });

    pb.redraw();
  });
})(globalThis);
