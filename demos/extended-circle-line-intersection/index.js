/**
 * A script for demonstrating the basic usage of the Vertex class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2022-09-10
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  var isDarkmode = detectDarkMode(GUP);

  _context.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );

    var initialViewport = pb.viewport();
    var circleRadius = Math.min(initialViewport.width, initialViewport.height) / 3;
    var circle = new Circle(new Vertex(0, 0), circleRadius);
    pb.add(circle);

    var line = new Line(
      new Vertex(
        Math.random() * initialViewport.width - initialViewport.width / 2,
        Math.random() * initialViewport.height - initialViewport.height / 2
      ),
      new Vertex(
        Math.random() * initialViewport.width - initialViewport.width / 2,
        Math.random() * initialViewport.height - initialViewport.height / 2
      )
    );
    pb.add(line);

    pb.config.postDraw = function (draw, fill) {
      // console.log("circle.center", circle.center);
      var intersection = circle.lineIntersection(line.a, line.b);
      if (intersection) {
        draw.circle(intersection.a, 5, "grey", 1);
        draw.circle(intersection.b, 5, "grey", 1);
      }
    };

    pb.redraw();
  });
})(globalThis);
