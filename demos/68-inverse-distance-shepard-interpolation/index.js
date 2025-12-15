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
  const GRADIENT_RADIUS = 64.0;
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
      pow: params.getNumber("pow", 2.0)
    };

    var viewport = null; // Bounds
    var points = []; // Array<Vertex>
    var gradientPoints = null; // Array<Vertex>

    var reinit = function () {
      viewport = pb.viewport();
      points = [
        viewport.randomPoint(),
        viewport.randomPoint(),
        viewport.randomPoint(),
        viewport.randomPoint(),
        viewport.randomPoint(),
        viewport.randomPoint()
      ].sort(function (a, b) {
        return a.x - b.x;
      });
      gradientPoints = points.map(function (point) {
        return point.clone().addX(GRADIENT_RADIUS);
      });
      // Add config checkboxes
      for (var k = 0; k < points.length; k++) {
        config[`show_${k}`] = k == 3;
      }
      pb.removeAll();
      pb.add(points);
      pb.add(gradientPoints);

      // Init math lib
      pm68 = new PolyMath68(viewport, config, points);
      // Install listeners

      points.forEach(function (p, i) {
        (function (index) {
          p.listeners.addDragListener(function (dragEvent) {
            gradientPoints[index].move(dragEvent.params.dragAmount);
          });
        })(i);
      });
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var pm68 = null;

    var preDraw = function (draw, fill) {
      // ...
      // draw.circle({ x: 0, y: 0 }, 100, "red", 1);
      points.forEach(function (p, index) {
        draw.circle(p, GRADIENT_RADIUS, "rgba(192,192,192,0.25", 2, {
          dashOffset: 0.0,
          dashArray: [2.0, 3.0]
        });
      });
    };

    var postDraw = function (draw, fill) {
      // ...
      // draw.circle({ x: 0, y: 0 }, 100, "red", 1);
      points.forEach(function (p, index) {
        draw.circle(p, 5, "red", 1);
        fill.text(`[${index}] ${p.x.toFixed(2)}, ${p.y.toFixed(2)}`, p.x, p.y + 16, { color: "orange" });
      });

      for (var i = 1; i < points.length; i++) {
        draw.line(points[i - 1], points[i], "green", 1.0);
      }

      drawInterpolation(draw, fill, pm68.sin(viewport), { color: Color.CSS_COLORS.Purple, lineWidth: 1.0 });
      // drawInterpolation(draw, fill, orthonormal0, { color: Color.CSS_COLORS.Green, lineWidth: 1.0 });
      for (var k = 0; k < points.length; k++) {
        if (config[`show_${k}`]) {
          drawInterpolation(draw, fill, pm68.scaleY(points[k].y, pm68.lagrange(k)), {
            color: WebColors[k % WebColors.length],
            lineWidth: 2.0
          });
        }
      }
      var activeK = 3;
      drawInterpolation(draw, fill, pm68.scaleY(points[activeK].y, pm68.distanceWeight(activeK, pm68.lagrange(activeK))), {
        color: WebColors[activeK % WebColors.length],
        lineWidth: 2.0
      });
      //     dashOffset?: number;
      //     dashArray?: Array<number>;
    }; // END postDraw

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
      // console.log(viewport);
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
    const polynomialControllers = [];
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "pow").min(0).max(10).step(0.1).title("The power.").onChange(function () { pb.redraw(); });
    }
    var updateGUI = function () {
      // Add polynomials checkboxes (and keep controllers)
      // But destroy old controllers first.
      polynomialControllers.forEach(function (ctrlr) {
        ctrlr.destroy();
      });
      for (var k = 0; k < points.length; k++) {
        // prettier-ignore
        var cntrllr = gui.add(config, `show_${k}`).name("Show Lagrange Polynomial "+k).title("Show Lagrange Polynomial "+k)
          .onChange( function() { pb.redraw() });
        polynomialControllers.push(cntrllr);
      }
    };

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    // Filter shapes; keep only those of interest here
    // pb.addContentChangeListener(function (_shapesAdded, _shapesRemoved) {
    //   // Drop everything we cannot handle with reflections
    //   polygon = pb.drawables.find(function (drwbl) {
    //     return drwbl instanceof Polygon;
    //   });

    //   mainRay.vector = pb.drawables.find(function (drwbl) {
    //     return drwbl instanceof Vector;
    //   });
    // });

    reinit();
    updateGUI();
    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
