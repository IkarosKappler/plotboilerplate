/**
 * A script for constructing infinite patterns based on a square or hexagonal tilings.
 *
 * @requires PlotBoilerplate, gup, dat.gui
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
    var AVAILABLE_COLOR_SETS = {};
    AVAILABLE_COLOR_SETS["Malachite" + (typeof WebColorsMalachite !== "undefined" ? "" : "(unavailable)")] = "Malachite";
    AVAILABLE_COLOR_SETS["Contrast" + (typeof WebColorsContrast !== "undefined" ? "" : "(unavailable)")] = "Mixed";
    AVAILABLE_COLOR_SETS["WebColors" + (typeof WebColors !== "undefined" ? "" : "(unavailable)")] = "WebColors";
    var POLYGON_FILL_TYPES = {
      "Linear": "linear",
      "Falloff 75%": "falloff0.75"
    };
    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // The arrow head size
      verticalCount: params.getNumber("verticalCount", 10),
      horizontalCount: params.getNumber("horizontalCount", 10),
      useInsetPolygonScaling: params.getBoolean("useInsetPolygonScaling", true),
      insetRemoveEars: params.getBoolean("insetRemoveEars", false),
      colinearityTolerance: params.getNumber("colinearityTolerance", 1000.0),
      // p6m: "hexagon" | p4m: "square" (default)
      baseShape: params.getString("baseShape", BASE_SHAPE_OPTIONS.p4m),
      fillRecursive: params.getBoolean("fillRecursive", true),
      fillIterationCount: params.getNumber("fillIterationCount", 10),
      fillType: params.getString("fillType", "linear"), // falloff0.75
      useColors: params.getBoolean("useColors", true),
      colorSet: "Malachite",
      drawPolygonNumbers: params.getBoolean("drawPolygonNumbers", false),
      drawOutline: params.getBoolean("drawOutline", true),
      drawInnerOutlines: params.getBoolean("drawInnerOutlines", false)
    };

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
    var cellInsetPolygons = []; // Array<Polygon[]>

    var viewport = pb.viewport();

    var rebuildInsetPolygons = function (polygon) {
      cellInsetPolygons = [];
      if (config.fillRecursive) {
        var n = config.fillIterationCount;
        // var tmpPoly = polygon.clone();
        for (var i = 0; i < n; i++) {
          var n = config.fillIterationCount;
          var poylgonDiameter = getPolygonDiameter(polygon);
          var polygonInset = new PolygonInset(polygon.elimitateColinearEdges(config.colinearityTolerance)); // 1000.0);
          var polygonInsetStep = poylgonDiameter / n;
          // Compute the polygon inset.
          // This value definitely returns enough split polygons
          var maxPolygonSplitDepth = config.pointCount;
          // console.log("polygonOffset", i * polygonInsetStep);
          // Array<Vertex[]>
          // var scalingFactor = config.fillType === "linear" ? i * polygonInsetStep : polygonInsetStep / Math.pow(0.75, i);
          var scalingFactor = (i * polygonInsetStep) / 2;
          var insetPolygons = polygonInset.computeOutputPolygons({
            innerPolygonOffset: scalingFactor,
            maxPolygonSplitDepth: maxPolygonSplitDepth,
            intersectionEpsilon: 1.0, // config.intersectionEpsilon
            removeEars: config.insetRemoveEars
          });
          cellInsetPolygons.push(insetPolygons);
        }
      } else {
        cellInsetPolygons.push([polygon.clone()]);
      }
      // console.log("cellInsetPolygons.length", cellInsetPolygons.length);
    };

    // +---------------------------------------------------------------------------------
    // | Init the SQUARE pattern.
    // +-------------------------------
    var initiSquarePattern = function () {
      // Create base polygon to start with: a square
      // var viewport = pb.viewport();
      // Find a nice size for the initial polygon: like one third of the screen size
      var size = viewport.getMinDimension() / 3.0;
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
      // Create the cell polygon (and destroy old one)
      if (editableCellPolygon != null) {
        editableCellPolygon.destroy();
      }
      editableCellPolygon = new EditableCellPolygon(pb, rectCellPolygon, handlePolygonChanged);
      pb.removeAll();
      pb.add(editableCellPolygon.polygon);
    };

    // +---------------------------------------------------------------------------------
    // | Called from the EditableCellPolygon whenever the polygon changes (in any way).
    // +-------------------------------
    var handlePolygonChanged = function () {
      rebuildInsetPolygons(editableCellPolygon.polygon);
    };

    // +---------------------------------------------------------------------------------
    // | Init the HEX pattern.
    // +-------------------------------
    var initiHexPattern = function () {
      // Create base polygon to start with: a square
      // var viewport = pb.viewport();
      // Find a nice size for the initial polygon: like one third of the screen size
      var size = viewport.getMinDimension() / 3.0;
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
      // Create the cell polygon (and destroy old one)
      if (editableCellPolygon != null) {
        editableCellPolygon.destroy();
      }
      editableCellPolygon = new EditableCellPolygon(pb, rectCellPolygon, handlePolygonChanged);
      rebuildInsetPolygons(editableCellPolygon.polygon);
      pb.removeAll();
      pb.add(editableCellPolygon.polygon, false); // Do not redraw yet
    };

    var initPattern = function () {
      if (config.baseShape == "p6m") {
        initiHexPattern();
      } else {
        // "p4m"
        initiSquarePattern();
      }
      // rebuildInsetPolygons(editableCellPolygon.polygon);
    };

    var preDraw = function (draw, fill) {
      if (config.baseShape == "p6m") {
        fillHexPattern(draw, fill);
      } else {
        fillSquarePattern(draw, fill);
      }
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
      if (config.drawPolygonNumbers) {
        drawPolygonIndices(editableCellPolygon.polygon, fill, { color: "orange", fontFamily: "Arial", fontSize: 9 });
      }

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

    // Due to Wolfram the 'polygons diameter is'
    //  "The diameter of a polygon is the largest distance between any pair of vertices"
    // https://mathworld.wolfram.com/PolygonDiameter.html
    var getPolygonDiameter = function (polygon) {
      var diameter = 0.0; // Number.MIN_VALUE;
      for (var i = 0; i < polygon.vertices.length; i++) {
        var vertA = polygon.vertices[i];
        for (var j = i + 1; j < polygon.vertices.length; j++) {
          var vertB = polygon.vertices[j];
          var dist = vertA.distance(vertB);
          diameter = Math.max(diameter, dist);
        }
      }
      return diameter;
    };

    // +---------------------------------------------------------------------------------
    // | Draws a single cell.
    // +-------------------------------
    var drawCell = function (draw, fill, polygon, offset) {
      if (config.useColors) {
        var color = randomWebColor(0, config.colorSet, 1.0);
        fill.polygon(polygon, color, 1);
      }
      var isSimpleScale = !config.useInsetPolygonScaling;
      if (config.drawOutline) {
        draw.polygon(polygon, "grey", 1);
      }
      if (config.fillRecursive) {
        var n = config.fillIterationCount;
        var tmpPoly = polygon.clone();
        for (var i = 0; i < n; i++) {
          var color = randomWebColor(i + 1, config.colorSet, 1.0);
          if (isSimpleScale) {
            fillSimpleScale(draw, fill, polygon, tmpPoly, i, color);
          } else {
            // This is done during cell construction for performance reasons.
            // fillInsetScale(draw, fill, polygon, tmpPoly, i, color);
          }
        }
        if (!isSimpleScale) {
          fillInsetScale(draw, fill, offset);
        }
      }
    };

    var fillSimpleScale = function (draw, fill, polygon, tmpPoly, i, color) {
      var n = config.fillIterationCount;
      var centerOfPolygon = vertexMedian(polygon.vertices);
      if (config.fillType === "linear") {
        tmpPoly = polygon.clone();
        tmpPoly.scale((n - i) / (n + 1), centerOfPolygon);
      } else {
        // "falloff 0.75"
        tmpPoly.scale(0.75, centerOfPolygon);
      }
      if (config.useColors) {
        fill.polygon(tmpPoly, color, 1);
      }
      if (config.drawInnerOutlines) {
        draw.polygon(tmpPoly, "grey", 1);
      }
    };

    /**
     *
     * @param {DrawLin} draw
     * @param {DrawLib} fill
     * @param {XYCoords} offset
     */
    var fillInsetScale = function (draw, fill, offset) {
      for (var i = 0; i < cellInsetPolygons.length; i++) {
        var color = randomWebColor(i + 1, config.colorSet, 1.0);
        var insetPolygons = cellInsetPolygons[i];
        for (var p = 0; p < insetPolygons.length; p++) {
          var polyVerts = insetPolygons[p];
          // Copy and move vertices by offset
          polyVerts = polyVerts.map(function (vert) {
            return vert.clone().add(offset);
          });
          if (config.useColors) {
            fill.polyline(polyVerts, false, color, 1);
          }
          if (config.drawInnerOutlines) {
            draw.polyline(polyVerts, false, "grey", 1);
          }
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a pattern based on the configured polygon and settings.
    // +-------------------------------
    var fillSquarePattern = function (draw, fill) {
      var tempPolyA = editableCellPolygon.polygon.clone();
      var differenceAFromOriginal = originalRectCellPolygon.getVertexAt(0).difference(rectCellBaseVertices[0]).inv();
      var differenceBFromOriginal = originalRectCellPolygon.getVertexAt(1).difference(rectCellBaseVertices[1]).inv();
      var differenceCFromOriginal = originalRectCellPolygon.getVertexAt(2).difference(rectCellBaseVertices[2]).inv();

      var offset = { x: 0, y: 0 };

      drawCell(draw, fill, tempPolyA, offset);

      // Draw the center spur
      fillVerticalSquarePattern(draw, fill, tempPolyA, differenceAFromOriginal, differenceCFromOriginal, offset);

      // Fill the left area
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        offset.x += cellBounds.width;
        offset.y += differenceAFromOriginal.y - differenceBFromOriginal.y;
        tempPolyA.move({ x: cellBounds.width, y: 0 });
        tempPolyA.move({ x: 0, y: differenceAFromOriginal.y - differenceBFromOriginal.y });
        // draw.polygon(tempPolyA, "grey", 1);
        drawCell(draw, fill, tempPolyA, offset);
        fillVerticalSquarePattern(draw, fill, tempPolyA, differenceAFromOriginal, differenceCFromOriginal, offset);
      }
      // Fill the right area
      offset = { x: 0, y: 0 };
      tempPolyA = editableCellPolygon.polygon.clone();
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        offset.x += -cellBounds.width;
        offset.y += -differenceAFromOriginal.y + differenceBFromOriginal.y;
        tempPolyA.move({ x: -cellBounds.width, y: 0 });
        tempPolyA.move({ x: 0, y: -differenceAFromOriginal.y + differenceBFromOriginal.y });
        // draw.polygon(tempPolyA, "grey", 1);
        drawCell(draw, fill, tempPolyA, offset);
        fillVerticalSquarePattern(draw, fill, tempPolyA, differenceAFromOriginal, differenceCFromOriginal, offset);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a vertical section with n elements to the upper and n elements to
    // | the lower direction.
    // +-------------------------------
    var fillVerticalSquarePattern = function (
      draw,
      fill,
      tempPolyA,
      differenceAFromOriginal,
      differenceCFromOriginal,
      verticalOffset
    ) {
      var offset = { x: verticalOffset.x, y: verticalOffset.y };
      var tempPolyB = tempPolyA.clone();
      // Generate row up
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        offset.x += differenceAFromOriginal.x - differenceCFromOriginal.x;
        offset.y += cellBounds.height;
        tempPolyB.move({ x: 0, y: cellBounds.height });
        tempPolyB.move({ x: differenceAFromOriginal.x - differenceCFromOriginal.x, y: 0 });
        // draw.polygon(tempPolyB, "grey", 1);
        drawCell(draw, fill, tempPolyB, offset);
      }
      offset = { x: verticalOffset.x, y: verticalOffset.y };
      tempPolyB = tempPolyA.clone();
      // Generate row down
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        offset.x += -differenceAFromOriginal.x + differenceCFromOriginal.x;
        offset.y += -cellBounds.height;
        tempPolyB.move({ x: 0, y: -cellBounds.height });
        tempPolyB.move({ x: -differenceAFromOriginal.x + differenceCFromOriginal.x, y: 0 });
        draw.polygon(tempPolyB, "grey", 1);
        drawCell(draw, fill, tempPolyB, offset);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a vertical section with n elements to both diagonal hex directions.
    // +-------------------------------
    var fillDiagonalHexPattern = function (draw, fill, tempHexPolyA, diagonalOffset) {
      var diff = rectCellBaseVertices[0].difference(rectCellBaseVertices[4]);

      var offset = { x: diagonalOffset.x, y: diagonalOffset.y };

      drawCell(draw, fill, tempHexPolyA, offset);

      var tempHexPolyB = tempHexPolyA.clone();
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        offset.x += diff.x;
        offset.y += diff.y;
        tempHexPolyB.move({ x: diff.x, y: diff.y });
        draw.polygon(tempHexPolyB, "grey", 1);
        drawCell(draw, fill, tempHexPolyB, offset);
      }

      offset = { x: diagonalOffset.x, y: diagonalOffset.y };
      tempHexPolyB = tempHexPolyA.clone();
      // Generate row down
      for (var y = 0; y < config.verticalCount / 2 - 1; y++) {
        offset.x += -diff.x;
        offset.y += -diff.y;
        tempHexPolyB.move({ x: -diff.x, y: -diff.y });
        draw.polygon(tempHexPolyB, "grey", 1);
        drawCell(draw, fill, tempHexPolyB, offset);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Fills a pattern based on the configured polygon and settings.
    // +-------------------------------
    var fillHexPattern = function (draw, fill) {
      var tempHexPolyA = editableCellPolygon.polygon.clone();

      var offset = { x: 0, y: 0 };
      fillDiagonalHexPattern(draw, fill, tempHexPolyA, offset);

      var diff = rectCellBaseVertices[0].difference(rectCellBaseVertices[2]);
      // Fill the left area
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        offset.x += diff.x;
        offset.y += diff.y;
        tempHexPolyA.move({ x: diff.x, y: diff.y });
        drawCell(draw, fill, tempHexPolyA, offset);

        fillDiagonalHexPattern(draw, fill, tempHexPolyA, offset);
      }
      offset = { x: 0, y: 0 };
      tempHexPolyA = editableCellPolygon.polygon.clone();
      // Fill the left area
      for (var x = 0; x < config.horizontalCount / 2 - 1; x++) {
        offset.x += -diff.x;
        offset.y += -diff.y;
        tempHexPolyA.move({ x: -diff.x, y: -diff.y });
        drawCell(draw, fill, tempHexPolyA, offset);
        fillDiagonalHexPattern(draw, fill, tempHexPolyA, offset);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuild = function () {
      rebuildInsetPolygons(editableCellPolygon.polygon);
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
      gui.add(config, "useInsetPolygonScaling").name("useInsetPolygonScaling").title("Use inset scaling (bad performance) or simple linear scaling (quick but ugly)")
      .onChange( function() { rebuild(); });
      // prettier-ignore
      gui.add(config, "insetRemoveEars").name("insetRemoveEars (experimental)").title("(Experimental feature) Remove excessive polygon ears before insetting.")
      .onChange( function() { rebuild(); });
      // prettier-ignore
      gui.add(config, "colinearityTolerance").min(0.0).max(10000.0).step(0.1).name("colinearityTolerance").title("The tolerance for deleting co-linear edges.")
      .onChange( function() { rebuild(); });
      // prettier-ignore
      gui.add(config, "baseShape", BASE_SHAPE_OPTIONS).name("baseShape").title("The pattern type (square/p4m or hexagonal/p6m).")
      .onChange( function() { initPattern(); rebuild(); });
      // prettier-ignore
      gui.add(config, "fillRecursive").name("fillRecursive").title("Draw inner patterns.")
      .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "fillIterationCount").min(1).max(16).step(1).name("fillIterationCount").title("How many polygons inside each cell (if `fillRecursive` is enabled).")
      .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "fillType", POLYGON_FILL_TYPES).name("fillType").title("How to fill polygons recursively.")
      .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "useColors").name("useColors").title("Colors, yes or no – how depressed are you?")
       .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "colorSet", AVAILABLE_COLOR_SETS).name("colorSet").title("The color set you want to use (if colors are enabled).")
      .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "drawPolygonNumbers").name("drawPolygonNumbers").title("Draw polygon numbers.")
      .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "drawOutline").name("drawOutline").title("Draw the main polygon's outline?")
      .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "drawInnerOutlines").name("drawInnerOutlines").title("Draw the outlines of inner cell polygons.")
      .onChange( function() { pb.redraw(); });
    }

    initPattern();
    pb.config.preDraw = preDraw;
    // pb.redraw();
    rebuild();
  });
})(globalThis);
