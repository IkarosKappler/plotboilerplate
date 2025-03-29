/**
 * A script how to calculate circle tangents.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2025-03-29
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
    // Let's set up some colors.
    pb.drawConfig.polygon.color = "rgba(255,192,0,0.75)";
    pb.drawConfig.polygon.lineWidth = 2;

    // Circle
    var circle = null;
    var ray = new Vector(new Vertex(), new Vertex(100, 100));

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      angle: params.getNumber("angle", 0.0)
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();
    // Must be in clockwise order!
    var polygon = null;

    var postDraw = function (draw, fill) {
      var tangent = circle.tangentAt(config.angle * DEG_TO_RAD);
      draw.arrow(tangent.a, tangent.b, "orange");
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildShape = function () {
      // Re-add the new polygon to trigger redraw.
      pb.removeAll(false, false); // Don't trigger redraw

      circle = new Circle(new Vertex(), 90.0);
      pb.add(circle, true);
      // pb.add(ray, true);
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "angle").min(-360).max(360).step(1).name("angle").title("The angle to calculate the tangent for.")
      .onChange( function() { pb.redraw(); });
    }

    pb.config.postDraw = postDraw;
    rebuildShape();
  });
})(globalThis);
