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
    pb.drawConfig.polygon.color = "red";
    pb.drawConfig.polygon.lineWidth = 2;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      amountPct: 75
    };

    // Create base polygon to start with: a square
    var viewport = pb.viewport();
    var size = Math.min(viewport.width, viewport.height) / 3.0;
    var cellBounds = new Bounds(new Vertex(-size, -size), new Vertex(size, size));
    var rectCellPolygon = cellBounds.toPolygon();
    var rectCellBaseVertices = rectCellPolygon.vertices.slice(0, rectCellPolygon.vertices.length); // Shallow array copy
    var originalRectCellPolygon = rectCellPolygon.clone();

    // Must have 4 vertices
    var vertA = rectCellPolygon.getVertexAt(0);
    var vertB = rectCellPolygon.getVertexAt(1);
    var vertC = rectCellPolygon.getVertexAt(2);
    var vertD = rectCellPolygon.getVertexAt(3);

    var linkRectPolygonVertices = function () {
      vertA.listeners.addDragListener(function (event) {
        vertB.add({ x: event.params.dragAmount.x, y: 0 });
        vertD.add({ x: 0, y: event.params.dragAmount.y });
      });
      vertB.listeners.addDragListener(function (event) {
        vertA.add({ x: event.params.dragAmount.x, y: 0 });
        vertC.add({ x: 0, y: event.params.dragAmount.y });
      });
      vertC.listeners.addDragListener(function (event) {
        vertD.add({ x: event.params.dragAmount.x, y: 0 });
        vertB.add({ x: 0, y: event.params.dragAmount.y });
      });
      vertD.listeners.addDragListener(function (event) {
        vertC.add({ x: event.params.dragAmount.x, y: 0 });
        vertA.add({ x: 0, y: event.params.dragAmount.y });
      });
    };

    linkRectPolygonVertices(rectCellPolygon);
    // pb.add(cellBounds.toPolygon());

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

    var fillPattern = function (draw) {
      var tempPolyA = editableCellPolygon.polygon.clone();
      var differenceAFromOriginal = originalRectCellPolygon.getVertexAt(0).difference(rectCellBaseVertices[0]).inv();
      var differenceBFromOriginal = originalRectCellPolygon.getVertexAt(1).difference(rectCellBaseVertices[1]).inv();
      var differenceCFromOriginal = originalRectCellPolygon.getVertexAt(2).difference(rectCellBaseVertices[2]).inv();

      // console.log("differenceFromOriginal", differenceAFromOriginal);

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
      for (var y = 0; y < n; y++) {
        tempPolyB.move({ x: 0, y: cellBounds.height });
        tempPolyB.move({ x: differenceAFromOriginal.x - differenceCFromOriginal.x, y: 0 });
        draw.polygon(tempPolyB, "grey", 1);
      }
      tempPolyB = tempPolyA.clone();
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
