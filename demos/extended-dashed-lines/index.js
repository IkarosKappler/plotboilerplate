/**
 * A script for demonstrating the basic usage of the Vertex class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2020-05-18
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  _context.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );

    // Create a Bézier curve for curved arrow
    var pathPoints = [
      pb.viewport().randomPoint(0.1, 0.1), // s
      pb.viewport().randomPoint(0.1, 0.1), // sc
      pb.viewport().randomPoint(0.1, 0.1), // ec
      pb.viewport().randomPoint(0.1, 0.1), // e & s
      pb.viewport().randomPoint(0.1, 0.1), // sc
      pb.viewport().randomPoint(0.1, 0.1), // ec
      pb.viewport().randomPoint(0.1, 0.1) // e & s
    ];

    // Create a Bézier curve for curved arrow
    var bezier = new CubicBezierCurve(
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1)
    );

    // Add a circle
    var circle = new Circle(pb.viewport().randomPoint(0.1, 0.1), 150);

    // TODO: add ellipse
    const ellipse = new VEllipse(pb.viewport().randomPoint(0.1, 0.1), new Vertex(150, 75));

    const bPath = BezierPath.fromArray([bezier]);

    var arrow = new Line(pb.viewport().randomPoint(0.1, 0.1), pb.viewport().randomPoint(0.1, 0.1));

    // Add important control points to the canvas
    pb.add([arrow.a, arrow.b]);
    pb.add([bezier.startPoint, bezier.endPoint, bezier.startControlPoint, bezier.endControlPoint]);
    pb.add([circle.center]);
    pb.add([ellipse.center, ellipse.axis]);

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      size: 8,
      enableDash: true,
      dashArray1: 5,
      dashArray2: 15,
      dashOffset: 0
    };

    const getStrokeOptions = () => {
      return config.enableDash ? { dashOffset: config.dashOffset, dashArray: [config.dashArray1, config.dashArray2] } : null;
    };

    const preDraw = function (draw, _fill) {
      // Draw a straight line with an arrow at the end ("Vector")
    };

    const postDraw = function (draw, fill) {
      console.log("post draw");
      draw.arrow(arrow.a, arrow.b, "red", 2, config.size, getStrokeOptions());
      draw.cubicBezierArrow(
        bezier.startPoint,
        bezier.endPoint,
        bezier.startControlPoint,
        bezier.endControlPoint,
        "orange",
        2,
        config.size,
        getStrokeOptions()
      );
      draw.circle(circle.center, circle.radius, "green", 2, getStrokeOptions());
      draw.ellipse(
        ellipse.center,
        Math.abs(ellipse.axis.x - ellipse.center.x),
        Math.abs(ellipse.axis.y - ellipse.center.y),
        "lightgreen",
        2,
        ellipse.rotation,
        getStrokeOptions()
      );
      draw.cubicBezierPath(pathPoints, "yellow", 2, getStrokeOptions());
    };

    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "size").min(1).max(100).step(1)
        .onChange(function () {
          pb.redraw();
        });

      // prettier-ignore
      gui.add(config, "enableDash")
        .onChange(function () {
          pb.redraw();
        });

      // prettier-ignore
      gui.add(config, "dashArray1").min(0).max(50).step(1)
        .onChange(function () {
          pb.redraw();
        });

      // prettier-ignore
      gui.add(config, "dashArray2").min(0).max(50).step(1)
        .onChange(function () {
          pb.redraw();
        });

      // prettier-ignore
      gui.add(config, "dashOffset").min(0).max(100).step(1)
      .onChange(function () {
        pb.redraw();
      });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
