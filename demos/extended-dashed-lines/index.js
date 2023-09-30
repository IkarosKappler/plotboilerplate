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

    // Create a line for a linear arrow
    var line = new Line(pb.viewport().randomPoint(0.1, 0.1), pb.viewport().randomPoint(0.1, 0.1));

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

    // Add important control points to the canvas
    // pb.add(line);
    // pb.add(BezierPath.fromArray([bezier]));
    // pb.add(circle);
    // pb.add(ellipse);

    var arrow = new Line(pb.viewport().randomPoint(0.1, 0.1), pb.viewport().randomPoint(0.1, 0.1));
    pb.add(arrow.a, arrow.b);

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      size: 8
    };

    const preDraw = function (draw, _fill) {
      // Draw a straight line with an arrow at the end ("Vector")
      draw.setLineDash([5, 15]);
    };

    const postDraw = function (draw, fill) {
      console.log("post draw");
      // draw.setLineDash([5, 15]);
      // draw.setLineDash([]);
      draw.arrow(arrow.a, arrow.b, "red", 2, 8);
    };

    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "size").min(1).max(100).step(1) .listen()
        .onChange(function () {
          pb.redraw();
        });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
