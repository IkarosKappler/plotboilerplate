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

  // See hexagon properties https://en.wikipedia.org/wiki/Hexagon
  var HEXAGON_RATIO = 1.1547005;

  // Fetch the GET params
  let GUP = gup();
  _context.addEventListener("load", function () {
    var params = new Params(GUP);
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

    var BASE_SHAPE_OPTIONS = { p4m: "p4m", p6m: "p6m" };
    // var BASE_SHAPE_OPTIONS = ["p4m", "p6m"];
    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      verticalCount: 10,
      horizontalCount: 10,
      baseShape: params.getString("baseShape", BASE_SHAPE_OPTIONS.p4m) // p6m: "hexagon" | p4m: "square" (default)
    };
    console.log("config", config);

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var cellBounds = null; // Bounds
    var rectCellBaseVertices = null; // [ Vertex, Vertex, Vertex, Vertex]
    var originalRectCellPolygon = null; // Polygon
    // Must have 4 vertices
    var vertA = null; // Vertex
    var vertB = null; // Vertex
    var vertC = null; // Vertex
    var vertD = null; // Vertex
    var vertE = null; // Vertex (Hexagon only)
    var vertF = null; // Vertex (Hexagon only)
    var editableCellPolygon = null; // EditableCellPolygon

    var viewport = pb.viewport();

    // +---------------------------------------------------------------------------------
    // | Init the SQUARE pattern.
    // +-------------------------------
    var initiSquarePattern = function () {
      // Create base polygon to start with: a square
      // var viewport = pb.viewport();
      // Find a nice size for the initial polygon: like one third of the screen size
      var size = Math.min(viewport.width, viewport.height) / 3.0;
      // Construct a square. This will be our initial plane-filling tile.
      cellBounds = new Bounds(new Vertex(-size, -size), new Vertex(size, size));
      // This – by nature – creates a square.
      var rectCellPolygon = cellBounds.toPolygon();
      // Keep a shallow copy of the original square vertices. We will ue these to calculate offets
      // for space filling drawing.
      rectCellBaseVertices = rectCellPolygon.vertices.slice(0, rectCellPolygon.vertices.length); // Shallow array copy
      originalRectCellPolygon = rectCellPolygon.clone();
      // Must have 4 vertices
      vertA = rectCellPolygon.getVertexAt(0);
      vertB = rectCellPolygon.getVertexAt(1);
      vertC = rectCellPolygon.getVertexAt(2);
      vertD = rectCellPolygon.getVertexAt(3);
      vertE = null; // Square has only four vertices
      vertF = null; // Square has only four vertices
      // Create the cell polygon
      if (editableCellPolygon != null) {
        editableCellPolygon.destroy();
      }
      editableCellPolygon = new EditableCellPolygon(pb, rectCellPolygon, {});
      pb.removeAll();
      pb.add(editableCellPolygon.polygon);
    };

    // +---------------------------------------------------------------------------------
    // | Init the HEX pattern.
    // +-------------------------------
    var initiHexPattern = function () {
      // Create base polygon to start with: a square
      // var viewport = pb.viewport();
      // Find a nice size for the initial polygon: like one third of the screen size
      var size = Math.min(viewport.width, viewport.height) / 3.0;
      var width = size;
      var height = size * HEXAGON_RATIO;
      // Construct a square. This will be our initial plane-filling tile.
      // cellBounds = new Bounds(new Vertex(-width, -height), new Vertex(width, height));
      // Create a hexagon
      var hexVertices = [new Vertex(0, -size)];
      for (var i = 1; i < 6; i++) {
        var tmpVert = hexVertices[0].clone();
        tmpVert.rotate(i * (Math.PI / 3.0), new Vertex(0, 0));
        hexVertices.push(tmpVert);
      }
      var rectCellPolygon = new Polygon(hexVertices);
      cellBounds = rectCellPolygon.getBounds();
      // Keep a shallow copy of the original square vertices. We will ue these to calculate offets
      // for space filling drawing.
      rectCellBaseVertices = rectCellPolygon.vertices.slice(0, rectCellPolygon.vertices.length); // Shallow array copy
      originalRectCellPolygon = rectCellPolygon.clone();
      // Must have 4 vertices
      vertA = rectCellPolygon.getVertexAt(0);
      vertB = rectCellPolygon.getVertexAt(1);
      vertC = rectCellPolygon.getVertexAt(2);
      vertD = rectCellPolygon.getVertexAt(3);
      vertE = rectCellPolygon.getVertexAt(4);
      vertF = rectCellPolygon.getVertexAt(5);
      // Create the cell polygon
      if (editableCellPolygon != null) {
        editableCellPolygon.destroy();
      }
      editableCellPolygon = new EditableCellPolygon(pb, rectCellPolygon, {});
      pb.removeAll();
      pb.add(editableCellPolygon.polygon);
    };

    var initPattern = function () {
      if (config.baseShape == "p6m") {
        initiHexPattern();
      } else {
        // "p4m"
        initiSquarePattern();
      }
    };
    initPattern();

    var preDraw = function (_draw, _fill) {
      // NOOP in this demo
    };

    var postDraw = function (draw, fill) {
      if (editableCellPolygon.mouseOverLine) {
        pb.draw.line(editableCellPolygon.mouseOverLine.a, editableCellPolygon.mouseOverLine.b, "rgba(0,192,192,0.5)", 5.0);
      }
      if (editableCellPolygon.mouseOverOppositeLine) {
        pb.draw.line(
          editableCellPolygon.mouseOverOppositeLine.a,
          editableCellPolygon.mouseOverOppositeLine.b,
          "rgba(0,192,192,0.5)",
          5.0
        );
      }
      if (config.baseShape == "p6m") {
        fillHexPattern(draw);
      } else {
        fillSquarePattern(draw);
      }
      drawPolygonIndices(editableCellPolygon.polygon, fill, { color: "orange", fontFamily: "Arial", fontSize: 9 });

      // Highlight main vertices of the square grid
      draw.circle(vertA, 7 / draw.scale.x, "orange", 1);
      draw.circle(vertB, 7 / draw.scale.x, "orange", 1);
      draw.circle(vertC, 7 / draw.scale.x, "orange", 1);
      draw.circle(vertD, 7 / draw.scale.x, "orange", 1);
      if (vertE != null) {
        draw.circle(vertE, 7 / draw.scale.x, "orange", 1);
      }
      if (vertF != null) {
        draw.circle(vertF, 7 / draw.scale.x, "orange", 1);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a pattern based on the configured polygon and settings.
    // +-------------------------------
    var fillSquarePattern = function (draw) {
      var tempPolyA = editableCellPolygon.polygon.clone();
      var differenceAFromOriginal = originalRectCellPolygon.getVertexAt(0).difference(rectCellBaseVertices[0]).inv();
      var differenceBFromOriginal = originalRectCellPolygon.getVertexAt(1).difference(rectCellBaseVertices[1]).inv();
      var differenceCFromOriginal = originalRectCellPolygon.getVertexAt(2).difference(rectCellBaseVertices[2]).inv();

      // Draw the center spur
      fillVerticalSquarePattern(draw, tempPolyA, differenceAFromOriginal, differenceCFromOriginal);

      // Fill the left area
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        tempPolyA.move({ x: cellBounds.width, y: 0 });
        tempPolyA.move({ x: 0, y: differenceAFromOriginal.y - differenceBFromOriginal.y });
        draw.polygon(tempPolyA, "grey", 1);
        fillVerticalSquarePattern(draw, tempPolyA, differenceAFromOriginal, differenceCFromOriginal);
      }
      // Fill the right area
      tempPolyA = editableCellPolygon.polygon.clone();
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        tempPolyA.move({ x: -cellBounds.width, y: 0 });
        tempPolyA.move({ x: 0, y: -differenceAFromOriginal.y + differenceBFromOriginal.y });
        draw.polygon(tempPolyA, "grey", 1);
        fillVerticalSquarePattern(draw, tempPolyA, differenceAFromOriginal, differenceCFromOriginal);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a vertical section with n elements to the upper and n elements to
    // | the lower direction.
    // +-------------------------------
    var fillVerticalSquarePattern = function (draw, tempPolyA, differenceAFromOriginal, differenceCFromOriginal) {
      var tempPolyB = tempPolyA.clone();
      // Generate row up
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        tempPolyB.move({ x: 0, y: cellBounds.height });
        tempPolyB.move({ x: differenceAFromOriginal.x - differenceCFromOriginal.x, y: 0 });
        draw.polygon(tempPolyB, "grey", 1);
      }
      tempPolyB = tempPolyA.clone();
      // Generate row down
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        tempPolyB.move({ x: 0, y: -cellBounds.height });
        tempPolyB.move({ x: -differenceAFromOriginal.x + differenceCFromOriginal.x, y: 0 });
        draw.polygon(tempPolyB, "grey", 1);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a vertical section with n elements to both diagonal hex directions.
    // +-------------------------------
    var fillDiagonalHexPattern = function (draw, tempHexPolyA) {
      var diff = rectCellBaseVertices[0].difference(rectCellBaseVertices[4]);
      var tempHexPolyB = tempHexPolyA.clone();
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        tempHexPolyB.move({ x: diff.x, y: diff.y });
        draw.polygon(tempHexPolyB, "grey", 1);
      }
      tempHexPolyB = tempHexPolyA.clone();
      // Generate row down
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        tempHexPolyB.move({ x: -diff.x, y: -diff.y });
        draw.polygon(tempHexPolyB, "grey", 1);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a pattern based on the configured polygon and settings.
    // +-------------------------------
    var fillHexPattern = function (draw) {
      var tempHexPolyA = editableCellPolygon.polygon.clone();
      fillDiagonalHexPattern(draw, tempHexPolyA); // , differenceAFromOriginal, differenceCFromOriginal);

      var diff = rectCellBaseVertices[0].difference(rectCellBaseVertices[2]);
      // Fill the left area
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        // tempPolyA.move({ x: cellBounds.width, y: 0 });
        tempHexPolyA.move({ x: diff.x, y: diff.y });
        draw.polygon(tempHexPolyA, "grey", 1);
        fillDiagonalHexPattern(draw, tempHexPolyA); // , differenceAFromOriginal, differenceCFromOriginal);
      }
      tempHexPolyA = editableCellPolygon.polygon.clone();
      // Fill the left area
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        // tempPolyA.move({ x: cellBounds.width, y: 0 });
        tempHexPolyA.move({ x: -diff.x, y: -diff.y });
        draw.polygon(tempHexPolyA, "grey", 1);
        fillDiagonalHexPattern(draw, tempHexPolyA); // , differenceAFromOriginal, differenceCFromOriginal);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuild = function () {
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "verticalCount").min(1).max(100).step(1).name("verticalCount").title("The vertical number of cells.")
      .onChange( function() { rebuild(); });
      // prettier-ignore
      gui.add(config, "horizontalCount").min(1).max(100).step(1).name("horizontalCount").title("The horizontal number of cells.")
      .onChange( function() { rebuild(); });
      // prettier-ignore
      gui.add(config, "baseShape", BASE_SHAPE_OPTIONS).name("baseShape").title("The pattern type (square/p4m or hexagonal/p6m).")
      .onChange( function() { initPattern(); rebuild(); });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();
  });
})(globalThis);
