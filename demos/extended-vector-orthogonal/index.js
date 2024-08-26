/**
 * A script for demonstrating the basic usage of orthogonal vectors.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2022-10-25
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
        {
          canvas: document.getElementById("my-canvas"),
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          fullSize: true
        },
        GUP
      )
    );
    pb.drawConfig.origin.color = isDarkmode ? "#ffffff" : "#000000";

    var config = {
      t: 0.5
    };

    var initialViewport = pb.viewport();

    // Create a random reference line inside the current viewport
    var line = new Line(
      new Vertex(
        Math.random() * initialViewport.width * 0.75 - initialViewport.width * 0.5,
        Math.random() * initialViewport.height * 0.75 - initialViewport.height * 0.5
      ),
      new Vertex(
        Math.random() * initialViewport.width * 0.75 - initialViewport.width * 0.5,
        Math.random() * initialViewport.height * 0.75 - initialViewport.height * 0.5
      )
    );
    pb.add(line);

    // On redrawing determine the orthogonal vector at the given position
    pb.config.postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      fill.text("Start (a)", line.a.x + 3, line.a.y, { color: contrastColor });
      fill.text("End (b)", line.b.x + 3, line.b.y, { color: contrastColor });
      var linePoint = line.vertAt(config.t);
      draw.circle(linePoint, 5, "grey", 1);
      fill.text("vertAt(t)", linePoint.x + 3, linePoint.y, { color: contrastColor });

      // Always keep the vector the same length as (a,b)
      var vector = new Vector(linePoint, line.b.clone().add(line.a.difference(linePoint)));
      var ortho = vector.getOrthogonal();
      draw.line(ortho.a, ortho.b, "orange", 2);
      draw.circle(ortho.b, 5, "green", 1);
      fill.text("ortho", ortho.b.x + 3, ortho.b.y, { color: contrastColor });
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 't').min(-2.0).max(2.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("t").title("The relative value on the line (relative to the distance between start and end point).");
    }

    pb.redraw();
  });
})(globalThis);
