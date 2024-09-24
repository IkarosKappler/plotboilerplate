/**
 * A script for construction infinite patterns based on a square tiling.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2020-09-24
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
    // Let's set up some colors.
    pb.drawConfig.polygon.color = "red";
    pb.drawConfig.polygon.lineWidth = 2;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      amountPct: 75
    };

    // Create base polygon to start with: a square
    var viewport = pb.viewport();
    // Find a nice size for the initial polygon: like one third of the screen size
    var size = Math.min(viewport.width, viewport.height) / 3.0;
    // Construct a square. This will be our initial plane-filling tile.
    var cellBounds = new Bounds(new Vertex(-size, -size), new Vertex(size, size));
    var rectCellPolygon = cellBounds.toPolygon();
    // Keep a shallow copy of the original square vertices. We will ue these to calculate offets
    // for space filling drawing.
    var rectCellBaseVertices = rectCellPolygon.vertices.slice(0, rectCellPolygon.vertices.length); // Shallow array copy
    var originalRectCellPolygon = rectCellPolygon.clone();

    // Must have 4 vertices
    var vertA = rectCellPolygon.getVertexAt(0);
    var vertB = rectCellPolygon.getVertexAt(1);
    var vertC = rectCellPolygon.getVertexAt(2);
    var vertD = rectCellPolygon.getVertexAt(3);

    var editableCellPolygon = new EditableCellPolygon(pb, rectCellPolygon, {});
    pb.add(editableCellPolygon.polygon);

    var preDraw = function (_draw, _fill) {
      // NOOP in this demo
    };

    var postDraw = function (draw, fill) {
      // ...
      if (editableCellPolygon.mouseOverLine) {
        console.log("Mouse over line");
        pb.draw.line(editableCellPolygon.mouseOverLine.a, editableCellPolygon.mouseOverLine.b, "rgba(0,192,192,0.5)", 5.0);
      }
      fillPattern(draw);
      drawPolygonIndices(editableCellPolygon.polygon, fill, { color: "orange", fontFamily: "Arial", fontSize: 9 });

      // Highlight main vertices of the square grid
      draw.circle(vertA, 7, "orange", 1);
      draw.circle(vertB, 7, "orange", 1);
      draw.circle(vertC, 7, "orange", 1);
      draw.circle(vertD, 7, "orange", 1);
    };

    // +---------------------------------------------------------------------------------
    // | Fills a pattern based on the configured polygon and settings.
    // +-------------------------------
    var fillPattern = function (draw) {
      var tempPolyA = editableCellPolygon.polygon.clone();
      var differenceAFromOriginal = originalRectCellPolygon.getVertexAt(0).difference(rectCellBaseVertices[0]).inv();
      var differenceBFromOriginal = originalRectCellPolygon.getVertexAt(1).difference(rectCellBaseVertices[1]).inv();
      var differenceCFromOriginal = originalRectCellPolygon.getVertexAt(2).difference(rectCellBaseVertices[2]).inv();

      // Draw the center spur
      fillVerticalPattern(draw, 10, tempPolyA, differenceAFromOriginal, differenceCFromOriginal);

      // Fill the left area
      for (var x = 0; x < 10; x++) {
        tempPolyA.move({ x: cellBounds.width, y: 0 });
        tempPolyA.move({ x: 0, y: differenceAFromOriginal.y - differenceBFromOriginal.y });
        draw.polygon(tempPolyA, "grey", 1);
        fillVerticalPattern(draw, 10, tempPolyA, differenceAFromOriginal, differenceCFromOriginal);
      }
      // Fill the right area
      tempPolyA = editableCellPolygon.polygon.clone();
      for (var x = 0; x < 10; x++) {
        tempPolyA.move({ x: -cellBounds.width, y: 0 });
        tempPolyA.move({ x: 0, y: -differenceAFromOriginal.y + differenceBFromOriginal.y });
        draw.polygon(tempPolyA, "grey", 1);
        fillVerticalPattern(draw, 10, tempPolyA, differenceAFromOriginal, differenceCFromOriginal);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a vertical section with n elements to the upper and n elements to
    // | the lower direction.
    // +-------------------------------
    var fillVerticalPattern = function (draw, n, tempPolyA, differenceAFromOriginal, differenceCFromOriginal) {
      var tempPolyB = tempPolyA.clone();
      // Generate row up
      for (var y = 0; y < n; y++) {
        tempPolyB.move({ x: 0, y: cellBounds.height });
        tempPolyB.move({ x: differenceAFromOriginal.x - differenceCFromOriginal.x, y: 0 });
        draw.polygon(tempPolyB, "grey", 1);
      }
      tempPolyB = tempPolyA.clone();
      // Generate row down
      for (var y = 0; y < n; y++) {
        tempPolyB.move({ x: 0, y: -cellBounds.height });
        tempPolyB.move({ x: -differenceAFromOriginal.x + differenceCFromOriginal.x, y: 0 });
        draw.polygon(tempPolyB, "grey", 1);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      // prettier-ignore
      var _gui = pb.createGUI();
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
