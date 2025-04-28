/**
 * A script for demonstrating the basic usage of the VEllipseSector class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2021-02-24
 * @modified 2025-04-15 Adding VEllipseSectorHelper and use its drawHandleLines method instead custom draw routine.
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
    pb.drawConfig.circle.lineWidth = 1;

    // First create an ellipse to start with:
    //  center vertex, radius (a non-negative number) and rotation.
    var center = new Vertex(10, 10);
    var radiusH = 150.0;
    var radiusV = 200.0;
    var rotation = 0.0;

    // Create the ellipse
    var ellipse = new VEllipse(center, new Vertex(center.x + radiusH, center.y + radiusV), rotation);

    // Now create a sector from the circle
    var startAngle = (12 / 180) * Math.PI;
    var endAngle = (89 / 180) * Math.PI;
    var sector = new VEllipseSector(ellipse, startAngle, endAngle);

    // We want to change the ellipse's radii and rotation by dragging points around
    var startControlPoint = ellipse.vertAt(startAngle);
    var endControlPoint = ellipse.vertAt(endAngle);
    var rotationControlPoint = ellipse.vertAt(rotation).scale(1.2, ellipse.center);

    var ellipseSectorHelper = new VEllipseSectorHelper(sector, startControlPoint, endControlPoint, rotationControlPoint);

    // +---------------------------------------------------------------------
    // | Draw additional lines to visualize what's happening.
    // +-------------------------------------------
    pb.config.postDraw = function (draw, fill) {
      ellipseSectorHelper.drawHandleLines(draw, fill);
    };

    // Now add the sector to your canvas
    pb.add(sector);
    pb.add([startControlPoint, endControlPoint, rotationControlPoint]);
  });
})(window);
