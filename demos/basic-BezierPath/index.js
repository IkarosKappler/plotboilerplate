/**
 * A script for demonstrating the basic usage of the BezierPath class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2020-05-12
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys({ canvas: document.getElementById("my-canvas"), fullSize: true }, GUP)
    );

    var pathPoints = [
      [new Vertex(-300, 0), new Vertex(0, 0), new Vertex(-200, -200), new Vertex(-100, -200)],
      [new Vertex(0, 0), new Vertex(300, 0), new Vertex(100, 200), new Vertex(200, 200)]
    ];
    var path = BezierPath.fromArray(pathPoints);

    // Useful hint: if you want to keep your bezier paths smooth
    //              then you should set their point attributes to bezierAutoAdjust=true
    path.bezierCurves[1].startPoint.attr.bezierAutoAdjust = true;

    pb.add(path);
  });
})(window);
