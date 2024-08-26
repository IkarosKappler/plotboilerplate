/**
 * A script for demonstrating the basic usage of the Vector class.
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

    // Create two new vertices
    var start = new Vertex(50, 50);
    var end = new Vertex(-50, -50);

    // Create the vector from start to end point
    var vector = new Vector(start, end);

    // Now add it to your canvas
    pb.add(vector);

    // Note: the vector's start and end points are draggable now :)
  });
})(window);
