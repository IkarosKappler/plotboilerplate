/**
 * A script for demonstrating the basic usage of the Circle class.
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

    // Create center vertex and radius (a non-negative number)
    var center = new Vertex(10, 10);
    var radius = 150;

    // Create the circle
    var circle = new Circle(center, radius);

    // Now add the circle to your canvas
    pb.add(circle);

    // Note: the center point is draggable now :)

    // Install a circle helper: change radius via a second control point.
    var radiusPoint = circle.vertAt(Math.PI * 1.75);
    pb.add(radiusPoint);
    new CircleHelper(circle, radiusPoint, pb);
  });
})(window);
