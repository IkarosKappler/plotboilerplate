/**
 * A script for demonstrating the basic usage of the PBImage class.
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

    // Create a native image object
    var imageSource = new Image(50, 50);

    // Define the upper-left and lower-right corner handle points
    // (=location and size)
    var leftUpperCorner = new Vertex(-50, -50);
    var rightLowerCorner = new Vertex(50, 50);

    // Create a new PBImage with these settings
    var image = new PBImage(imageSource, leftUpperCorner, rightLowerCorner);
    pb.add(image);

    // You can load the source later
    imageSource.addEventListener("load", function () {
      pb.redraw();
    });
    // Note: Firefox does not scale SVGs properly at the moment, so better use pixel graphics
    imageSource.src = "../../example-image.png";

    // Note: the center and size points are draggable now :)
  });
})(window);
