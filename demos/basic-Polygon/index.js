/**
 * A script for demonstrating the basic usage of the Polygon class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2021-03-30
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

    // Create n new vertices
    // prettier-ignore
    var vertices = [
		new Vertex(-100,-50),
		new Vertex(   0,-25),
		new Vertex( 100,-50),
		new Vertex( 100, 50),
		new Vertex(   0, 25),
		new Vertex(-100, 50)
	];

    // Create the polygon from that vetices
    var polygon = new Polygon(vertices);

    // Now add it to your canvas
    pb.add(polygon);

    // Note: the polygon's points are draggable now :)
  });
})(window);
