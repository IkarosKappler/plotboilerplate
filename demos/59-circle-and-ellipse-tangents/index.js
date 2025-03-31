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

    // Circle
    var circle = new Circle(new Vertex(), 90.0);
    var ellipse = new VEllipse(new Vertex(), new Vertex(200, 150), Math.PI / 3.0);
    // ellipse.axis.attr.visible = false;
    // ellipse.axis.attr.draggable = false;

    // We want to change the ellipse's radii and rotation by dragging points around
    var ellipseRotationControlPoint = ellipse.vertAt(0.0).scale(1.2, ellipse.center);

    var ellipseHelper = new VEllipseHelper(ellipse, ellipseRotationControlPoint);
    pb.add([circle, ellipse, ellipseRotationControlPoint], false);

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      angle: params.getNumber("angle", Math.round(ellipse.rotation * RAD_TO_DEG))
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // var viewport = pb.viewport();

    var postDraw = function (draw, fill) {
      var circleTangent = circle.tangentAt(config.angle * DEG_TO_RAD);
      draw.arrow(circleTangent.a, circleTangent.b, "orange", 2.0);
      var ellipseTangent = ellipse.tangentAt(config.angle * DEG_TO_RAD);
      draw.arrow(ellipseTangent.a, ellipseTangent.b, "green", 2.0);
      ellipseHelper.drawHandleLines(draw, fill);
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
    pb.redraw();
  });
})(globalThis);
