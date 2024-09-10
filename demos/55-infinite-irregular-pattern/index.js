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

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      amountPct: 75
    };

    // Create base polygon to start with: a square
    var viewport = pb.viewport();
    var size = Math.min(viewport.width, viewport.height) / 3.0;
    var cellBounds = new Bounds(new Vertex(-size, -size), new Vertex(size, size));
    // var cellPolygon = cellBounds.toPolygon();
    // pb.add(cellBounds.toPolygon());

    var editableCellPolygon = new EditableCellPolygon(pb, cellBounds.toPolygon(), {});
    pb.add(editableCellPolygon.polygon);

    var preDraw = function (_draw, _fill) {
      // NOOP in this demo
    };

    var postDraw = function (draw, fill) {
      // ...
      if (editableCellPolygon.mouseOverLine) {
        console.log("Mouse over line");
        pb.draw.line(editableCellPolygon.mouseOverLine.a, editableCellPolygon.mouseOverLine.b, "red", 5.0);
      }
      drawPolygonIndices(editableCellPolygon.polygon, fill, { color: "orange", fontFamily: "Arial", fontSize: 9 });
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var _gui = pb.createGUI();
      // prettier-ignore
      // gui.add(config, "amountPct").min(0).max(100).step(1)
      //   .onChange(function () {
      //     pb.redraw();
      //   });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
