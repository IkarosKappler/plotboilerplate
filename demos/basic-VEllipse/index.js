/**
 * A script for demonstrating the basic usage of the VEllipse class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2020-05-18
 * @modified 2025-04-15 Removing custom handle lines and add VEllipseHelper.
 * @version  1.1.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  window.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys({ canvas: document.getElementById("my-canvas"), fullSize: true }, GUP)
    );
    pb.drawConfig.drawHandleLines = false; // We want the helper to draw the helper lines

    // Create center
    var center = new Vertex(10, 10);

    // Create two radii (a non-negative numbers) and store them in a vertex
    var radius_x = 150.0;
    var radius_y = 100.0;
    var rotation = 0.0;
    var radii = new Vertex(radius_x, radius_y);

    // Create the (vertex-based) ellipse
    var ellipse = new VEllipse(center, radii, rotation);

    // Add a rotation control
    var ellipseRotationControlPoint = ellipse.vertAt(0.0).scale(1.2, ellipse.center);
    var ellipseHelper = new VEllipseHelper(ellipse, ellipseRotationControlPoint);

    // Now add the ellipse and rotation point to your canvas
    pb.add([ellipse, ellipseRotationControlPoint]);

    // Note: the center point and radii are draggable now :)

    pb.config.preDraw = function (draw, fill) {
      ellipseHelper.drawHandleLines(draw, fill);
    };
    pb.redraw();
  });
})(window);
