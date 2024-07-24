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
  var isDarkmode = detectDarkMode(GUP);
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

    // Create a helper line for just drawing a single arrow head
    var arrowHeadLine = new Line(pb.viewport().randomPoint(0.1, 0.1), pb.viewport().randomPoint(0.1, 0.1));

    // Add important control points to the canvas
    pb.add([line.a, line.b]);
    pb.add([bezier.startPoint, bezier.endPoint, bezier.startControlPoint, bezier.endControlPoint]);
    pb.add([arrowHeadLine.a, arrowHeadLine.b]);

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      size: 8
    };

    const postDraw = function (draw, _fill) {
      // Draw a straight line with an arrow at the end ("Vector")
      draw.arrow(line.a, line.b, "orange", 3, config.size);

      // Draw a cubic Bézier curve (and handles) with an arrow at the end
      draw.line(bezier.startPoint, bezier.startControlPoint, "rgba(128,128,128,0.333)", 3);
      draw.line(bezier.endPoint, bezier.endControlPoint, "rgba(128,128,128,0.333)", 3);
      draw.cubicBezierArrow(
        bezier.startPoint,
        bezier.endPoint,
        bezier.startControlPoint,
        bezier.endControlPoint,
        "orange",
        3,
        config.size
      );

      // Just draw a plain arrow head
      pb.draw.arrowHead(arrowHeadLine.a, arrowHeadLine.b, "orange", 3, config.size);
    };

    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "size").min(1).max(100).step(1) .listen()
        .onChange(function () {
          pb.redraw();
        });
    }

    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
