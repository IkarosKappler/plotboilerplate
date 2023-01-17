/**
 * A script for demonstrating the basic usage of the Vertex class.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2022-09-10
 * @modified 2023-01-17 Tweaking the demo: adding large-arc-flag and sweep-flag.
 * @version  1.0.1
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);
  var DEG_TO_RAD = Math.PI / 180;

  _context.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );
    var initialViewport = pb.viewport();
    var startPoint = new Vertex(
      Math.random() * initialViewport.width + initialViewport.min.x,
      Math.random() * initialViewport.width + initialViewport.min.x
    );
    var endPoint = new Vertex(
      Math.random() * initialViewport.width + initialViewport.min.x,
      Math.random() * initialViewport.width + initialViewport.min.x
    );

    var config = {
      radiusX: Math.abs(endPoint.x - startPoint.x),
      radiusY: Math.abs(endPoint.y - startPoint.y),
      rotation: 0, // Here: degrees
      largeArcFlag: true,
      sweepFlag: true
    };

    pb.add(startPoint);
    pb.add(endPoint);

    pb.config.postDraw = function (draw, fill) {
      // ...
      // TODO: respect relative/absolute here
      var ellipseSector = VEllipseSector.ellipseSectorUtils.endpointToCenterParameters(
        startPoint.x, // x1
        startPoint.y, // y1
        config.radiusX, // rx
        config.radiusY, // ry
        config.rotation * DEG_TO_RAD, // phi: number,
        config.largeArcFlag, // fa: boolean,
        config.sweepFlag, // fs: boolean,
        endPoint.x, // x2: number,
        endPoint.y // y2: number
      );
      var ellipse = ellipseSector.ellipse;
      draw.ellipse(ellipse.center, ellipse.radiusH(), ellipse.radiusV(), "green", 2, config.rotation * DEG_TO_RAD);

      // Draw partial arc
      var arcCurves = ellipseSector.toCubicBezier(4);
      for (var i = 0; i < arcCurves.length; i++) {
        draw.cubicBezier(
          arcCurves[i].startPoint,
          arcCurves[i].endPoint,
          arcCurves[i].startControlPoint,
          arcCurves[i].endControlPoint,
          "rgba(192,192,0,0.5)",
          6
        );
      }
    };

    pb.redraw();

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'radiusX').min(0).max(initialViewport.width/2).listen().onChange(function() { pb.redraw() }).name("radiusX").title("radiusX");
      // prettier-ignore
      gui.add(config, 'radiusY').min(0).max(initialViewport.height/2).listen().onChange(function() { pb.redraw() }).name("radiusY").title("radiusY");
      // prettier-ignore
      gui.add(config, 'rotation').min(0).max(180).listen().onChange(function() { pb.redraw() }).name("rotation").title("rotation");
      // prettier-ignore
      gui.add(config, 'largeArcFlag').listen().onChange(function() { pb.redraw() }).name("largeArcFlag").title("largeArcFlag");
      // prettier-ignore
      gui.add(config, 'sweepFlag').listen().onChange(function() { pb.redraw() }).name("sweepFlag").title("sweepFlag");
    }
  });
})(globalThis);
