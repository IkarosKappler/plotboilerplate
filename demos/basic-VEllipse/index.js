/**
 * A script for demonstrating the basic usage of the VEllipse class.
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
  window.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys({ canvas: document.getElementById("my-canvas"), fullSize: true }, GUP)
    );

    // Create center
    var center = new Vertex(10, 10);

    // Create two radii (a non-negative numbers) and store them in a vertex
    var radius_x = 150.0;
    var radius_y = 100.0;
    var rotation = 0.0;
    var radii = new Vertex(radius_x, radius_y);

    // Create the (vertex-based) ellipse
    var ellipse = new VEllipse(center, radii, rotation);

    // Now add the ellipse to your canvas
    pb.add(ellipse);

    // Note: the center point and radii are draggable now :)

    // Add a rotation control
    // TODO: refactor this to an 'VEllipseRotationHelper'?
    (function () {
      var rotationControlPoint = ellipse.vertAt(rotation).scale(1.2, ellipse.center);
      var rotationLine = new Line(ellipse.center, rotationControlPoint);
      ellipse.center.listeners.addDragListener(function (event) {
        rotationControlPoint.add(event.params.dragAmount);
      });
      rotationControlPoint.listeners.addDragListener(function (event) {
        var newRotation = rotationLine.angle();
        var rDiff = newRotation - ellipse.rotation;
        ellipse.rotation = newRotation;
        ellipse.axis.rotate(rDiff, ellipse.center);
      });
      pb.add(rotationControlPoint);
      pb.config.postDraw = function () {
        pb.draw.line(ellipse.center, rotationControlPoint, "rgba(128,128,255,0.5)", 1);
      };

      pb.redraw();
    })();
  });
})(window);
