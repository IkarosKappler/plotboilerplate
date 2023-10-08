/**
 * A script for demonstrating the basic usage of the Bézier trim method.
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

  _context.addEventListener("load", function () {
    var isDarkmode = detectDarkMode(GUP);

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );

    // Create two Bézier curves, one for trimming at the end, one for trimming at the end.
    var bezierA = new CubicBezierCurve(
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1)
    );
    var bezierB = new CubicBezierCurve(
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1)
    );

    // Add curves to the canvas (only paths can be added)
    pb.add([BezierPath.fromCurve(bezierA), BezierPath.fromCurve(bezierB)]);
    pb.drawConfig.bezier.color = "rgba(255,128,0,0.5)";
    pb.drawConfig.bezier.lineWidth = 5;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      amountPct: 75
    };

    var preDraw = function (_draw, _fill) {
      // NOOP in this demo
    };

    var postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      fill.text("Start A", bezierA.startPoint.x, bezierA.startPoint.y, {
        color: contrastColor
      });
      fill.text("End A", bezierA.endPoint.x, bezierA.endPoint.y, {
        color: contrastColor
      });
      fill.text("Start B", bezierB.startPoint.x, bezierB.startPoint.y, {
        color: contrastColor
      });
      fill.text("End B", bezierB.endPoint.x, bezierB.endPoint.y, {
        color: contrastColor
      });
      const trimmedCurveEnd = bezierA.clone().trimEndAt(config.amountPct / 100.0);
      draw.cubicBezier(
        trimmedCurveEnd.startPoint,
        trimmedCurveEnd.endPoint,
        trimmedCurveEnd.startControlPoint,
        trimmedCurveEnd.endControlPoint,
        "rgb(0,255,255)",
        1
      );
      const trimmedCurveStart = bezierB.clone().trimStartAt(config.amountPct / 100.0);
      draw.cubicBezier(
        trimmedCurveStart.startPoint,
        trimmedCurveStart.endPoint,
        trimmedCurveStart.startControlPoint,
        trimmedCurveStart.endControlPoint,
        "rgb(0,255,255)",
        1
      );
    };

    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "amountPct").min(0).max(100).step(1)
        .onChange(function () {
          pb.redraw();
        });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
