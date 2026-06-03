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
  _context.addEventListener("load", function () {
    let GUP = gup();
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
      bezierA.endPoint, // pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1),
      pb.viewport().randomPoint(0.1, 0.1)
    );

    var bezierPath = BezierPath.fromArray([bezierA, bezierB]);
    var handleUpdate = function () {
      pb.redraw();
    };
    var helper = new BezierResizeHelper(pb, bezierPath, handleUpdate);
    // Set helper points invisible. We want triangles to be rendered.
    helper.topResizeHandle.attr.visible = false;
    helper.leftResizeHandle.attr.visible = false;
    helper.bottomResizeHandle.attr.visible = false;
    helper.rightResizeHandle.attr.visible = false;

    // Add curves to the canvas (only paths can be added)
    pb.add([bezierPath, helper.topResizeHandle, helper.leftResizeHandle, helper.bottomResizeHandle, helper.rightResizeHandle]);
    pb.drawConfig.bezier.color = "rgba(255,128,0,0.5)";
    pb.drawConfig.bezier.lineWidth = 5;

    // On manual changes the handle vertices should be updated, too.
    var updateHandler = function () {
      helper.updateResizeHandles();
    };
    bezierPath.bezierCurves[0].startPoint.listeners.addDragEndListener(updateHandler);
    bezierPath.bezierCurves.forEach(function (curve) {
      // curve.startPoint.listeners.addDagEndListener(updateHandler);
      curve.startControlPoint.listeners.addDragEndListener(updateHandler);
      curve.endControlPoint.listeners.addDragEndListener(updateHandler);
      curve.endPoint.listeners.addDragEndListener(updateHandler);
    });

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      showLeft: true,
      showRight: true,
      showTop: true,
      showBottom: true
    };

    var preDraw = function (draw, fill) {
      var bounds = bezierPath.getBounds();
      // console.log("Bounds", bounds.toString());
      draw.bounds(bounds, "rgba(128,128,128,0.5)", 1.0);

      helper.drawHandleLines(draw, fill, "grey");
      // helper.drawTriangles(draw, fill, "green");
      if (config.showTop && !helper.topResizeHandle.attr.visible) {
        helper.drawTopTriangle(draw, fill, "rgba(0,192,192,1.0)");
      }
      if (config.showLeft && !helper.leftResizeHandle.attr.visible) {
        helper.drawLeftTriangle(draw, fill, "rgba(0,192,192,1.0)");
      }
      if (config.showBottom && !helper.bottomResizeHandle.attr.visible) {
        helper.drawBottomTriangle(draw, fill, "rgba(0,192,192,1.0)");
      }
      if (config.showRight && !helper.rightResizeHandle.attr.visible) {
        helper.drawRightTriangle(draw, fill, "rgba(0,192,192,1.0)");
      }
    };

    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "showLeft").onChange(function () { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "showRight").onChange(function () { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "showTop").onChange(function () { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "showBottom").onChange(function () { pb.redraw(); });
    }

    pb.config.preDraw = preDraw;
    pb.redraw();
  });
})(globalThis);
