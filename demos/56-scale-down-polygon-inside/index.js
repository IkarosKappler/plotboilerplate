/**
 * A script for constructing polygon insets (perpendicular scaled down polygons).
 *
 * Invariant:
 *  - polygon must be clockwise!
 *  - no successive polygon lines must be co-linear!
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2020-10-12
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
    pb.drawConfig.polygon.color = "rgba(255,192,0,0.75)";
    pb.drawConfig.polygon.lineWidth = 2;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      pointCount: params.getNumber("pointCount", 8),
      innerPolygonOffset: params.getNumber("innerPolygonOffset", 45), // px
      drawVertexNumbers: params.getBoolean("drawVertexNumbers", false)
    };

    var buildRandomizedPolygon = function (numVertices) {
      var polygon = new Polygon();
      for (var i = 0; i < numVertices; i++) {
        var vert = new Vertex(Math.min(viewport.width, viewport.height) * 0.33, 0.0);
        vert.rotate(((Math.PI * 2) / numVertices) * i);
        vert.addXY(viewport.width * 0.1 * (1.0 - Math.random() * 2), viewport.height * 0.1 * (1.0 - Math.random() * 2));
        polygon.addVertex(vert);
      }

      if (!polygon.isClockwise()) {
        // Reverse
        polygon.vertices = polygon.vertices.reverse();
      }

      return polygon;
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();
    // Must be in clockwise order!
    var polygon = null;
    // TODO: clear co-linear polygon edges-
    var keepInsetPolygonLines = [];

    var preDraw = function (draw, fill) {
      // ...
    };

    // Question: what happens if line is completely out of bounds?
    var expandLineToRectBounds = function (line, boundsRectPolygon) {
      var boundsIntersections = boundsRectPolygon.lineIntersections(line, false);
      if (boundsIntersections.length != 2) {
        // This should not be te case by construction
        console.log(
          "If this happens then the given line is completely outside of the rectangular bounds. No intersections can be calculated. Check your code."
        );
        return null;
      }
      return new Line(boundsIntersections[0], boundsIntersections[1]);
    };

    var postDraw = function (draw, fill) {
      drawInsetPolygon(draw, fill, polygon);

      if (config.drawVertexNumbers) {
        drawPolygonIndices(polygon, fill, { color: "orange", fontFamily: "Arial", fontSize: 9 });
      }
    };

    /**
     * This method transforms each polygon line into a new line
     * by moving it to the inside direction of the polygon (by the given `insetAmount`).
     *
     * @param {Array<Line>} polygonLines
     * @param {number} insetAmount
     * @return {Array<Line>} The transformed lines. The result array has the same length and order as the input array.
     */
    var collectInsetLines = function (polygonLines, insetAmount) {
      var insetLines = []; // Array<Line>
      for (var i = 0; i < polygonLines.length; i++) {
        var line = polygonLines[i];
        var perp = new Vector(line.a, line.b).perp();
        var t = insetAmount / perp.length();
        var offsetOnPerp = perp.vertAt(t);
        var diff = line.a.difference(offsetOnPerp);
        // Polygon is is clockwise order.
        // Move line inside polygon
        var movedLine = line.clone();
        movedLine.a.add(diff);
        movedLine.b.add(diff);
        insetLines.push(movedLine);
      }
      return insetLines;
    };

    /**
     * For a sequence of inset polygon lines get the inset polygon by detecting
     * useful intersections (by cropping or extending them).
     *
     * The returned lines resemble a new polygon.
     *
     * Please note that the returned polygon can be self-intersecting!
     *
     * @param {Array<Line>} insetLines
     * @returns {Array<Line>} The cropped or exented inset polygon lines.
     */
    var collectInsetPolygonLines = function (insetLines) {
      if (insetLines.length <= 1) {
        return [];
      }
      var insetPolygonLines = []; // Array<Line>
      // Collect first intersection at beginning :)
      var lastInsetLine = insetLines[insetLines.length - 1];
      var firstInsetLine = insetLines[0];
      var lastIntersectionPoint = lastInsetLine.intersection(firstInsetLine); // Must not be null
      for (var i = 0; i < insetLines.length; i++) {
        var insetLine = insetLines[i];
        // // Get whole line inside poly bounds.
        // var lineInsidePolyBounds = expandLineToRectBounds(insetLine, boundsAsRectPoly);
        // draw.line(lineInsidePolyBounds.a, lineInsidePolyBounds.b, "rgba(0,255,0,0.2)", 1.0);

        var nextInsetLine = insetLines[(i + 1) % insetLines.length];
        // Find desired intersection
        var intersection = insetLine.intersection(nextInsetLine);
        if (intersection == null) {
          console.warn("[collectInsetPolygon] WARN intersection line must not be null", i, nextInsetLine);
        }
        // By construction they MUST have any non-null intersection!
        if (lastIntersectionPoint != null) {
          var resultLine = new Line(lastIntersectionPoint, intersection);
          insetPolygonLines.push(resultLine);
        }
        lastIntersectionPoint = intersection;
      }
      return insetPolygonLines;
    };

    var collectRectangularPolygonInsets = function (originalPolygonLines, insetLines) {
      // Convert to rectangle polygon
      var insetRectanglePolygons = originalPolygonLines.map(function (polygonLine, index) {
        var rectPolygon = new Polygon([], false);
        // Add in original order
        rectPolygon.vertices.push(polygonLine.a.clone());
        rectPolygon.vertices.push(polygonLine.b.clone());
        // Add in reverse order
        var insetLine = insetLines[index];
        rectPolygon.vertices.push(insetLine.b.clone());
        rectPolygon.vertices.push(insetLine.a.clone());
        return rectPolygon;
      });
      return insetRectanglePolygons;
    };

    /**
     *
     * @param {*} insetPolygonLines
     * @param {*} insetLines
     * @param {*} insetRectanglePolygons
     * @param {*} originalPolygon
     * @param {*} keepInsetPolygonLines
     * @returns void
     */
    var filterLines = function (insetPolygonLines, insetLines, insetRectanglePolygons, originalPolygon, keepInsetPolygonLines) {
      return insetPolygonLines.filter(function (insetPLine, pLineIndex) {
        // Does the center of the line lay inside an inset rectangle?
        var centerPoint = insetPLine.vertAt(0.5);
        var isInAnyRectangle = insetRectanglePolygons.some(function (rect, rectIndex) {
          return pLineIndex != rectIndex && rect.containsVert(centerPoint);
        });
        var isInsideSourcePolygon = originalPolygon.containsVert(centerPoint);
        // return !isInAnyRectangle && isInsideSourcePolygon;
        // return true; // true -> Keep
        keepInsetPolygonLines[pLineIndex] = !isInAnyRectangle && isInsideSourcePolygon;
      });
    };

    var clearPolygonByFilteredLines = function (
      insetPolygonLines,
      insetLines,
      insetRectanglePolygons,
      originalPolygon,
      keepInsetPolygonLines
    ) {
      // Clone array
      var resultLines = insetPolygonLines.map(function (line) {
        return new Line(line.a.clone(), line.b.clone());
      });
      var index = 0;
      // for (var i = 0; i < keepInsetPolygonLines.length; i++) {
      var i = 0;
      while (i < resultLines.length && resultLines.length > 2) {
        var keepLine = keepInsetPolygonLines[index++];
        if (keepLine) {
          i++;
          continue;
        }
        console.log("Remove", i);
        // Remove line and crop neighbours
        var leftIndex = (i + resultLines.length - 1) % resultLines.length;
        var rightIndex = (i + 1) % resultLines.length;
        console.log("leftIndex", leftIndex, "rightIndex", rightIndex);
        var leftLine = resultLines[leftIndex];
        var rightLine = resultLines[rightIndex];
        var intersection = leftLine.intersection(rightLine);
        if (intersection == null) {
          console.warn("[clearPolygonByFilteredLines] WARN intersection line must not be null", i, leftLine, rightLine);
        }
        leftLine.b = intersection;
        rightLine.a = intersection.clone();
        resultLines.splice(i, 1);
        // i++;
      }
      return resultLines;
    };

    /**
     * Draw the inset polygon.
     *
     * @param {*} draw
     * @param {*} fill
     * @param {*} polygon
     */
    var drawInsetPolygon = function (draw, fill, polygon) {
      var polygonBounds = polygon.getBounds();
      var boundsAsRectPoly = polygonBounds.toPolygon();
      var originalPolygonLines = polygon.getLines();
      draw.polygon(boundsAsRectPoly, "grey", 1);
      // Step 1: collect inset lines.
      var insetLines = collectInsetLines(originalPolygonLines, config.innerPolygonOffset);
      // console.log("insetLines", insetLines);
      for (var i = 0; i < insetLines.length; i++) {
        var originalLine = originalPolygonLines[i];
        var insetLine = insetLines[i];
        draw.line(insetLine.a, insetLine.b, "rgba(192,192,192,0.25)", 3.0);
        draw.line(originalLine.a, insetLine.a, "grey", 1.0, { dashOffset: 0.0, dashArray: [3.0, 4.0] });
        draw.line(originalLine.b, insetLine.b, "grey", 1.0, { dashOffset: 0.0, dashArray: [3.0, 4.0] });
        // // Get whole line inside poly bounds.
        var lineInsidePolyBounds = expandLineToRectBounds(insetLine, boundsAsRectPoly);
        if (lineInsidePolyBounds) {
          // Some polygons produce inset lines that are completely OUTSIDE the original bounds!
          // Just ignore those.
          draw.line(lineInsidePolyBounds.a, lineInsidePolyBounds.b, "rgba(0,255,0,0.2)", 1.0);
        }
      }

      // Step 2: Transform inset line to resemble a polygon (expand or crop).
      var insetPolygonLines = collectInsetPolygonLines(insetLines);
      for (var i = 0; i < insetPolygonLines.length; i++) {
        var ipl = insetPolygonLines[i];
        // console.log("ipl", ipl);
        draw.line(ipl.a, ipl.b, "green", 4.0);
      }

      // Convert to rectangle polygons
      var insetRectanglePolygons = collectRectangularPolygonInsets(originalPolygonLines, insetLines);
      for (var i = 0; i < insetRectanglePolygons.length; i++) {
        var rectPolygon = insetRectanglePolygons[i];
        fill.polygon(rectPolygon, "rgba(192,192,192,0.25)");
        // Draw rectangular cross inside
      }

      // Step 3: identify polygon lines outside the desired bounds.
      filterLines(insetPolygonLines, insetLines, insetRectanglePolygons, polygon, keepInsetPolygonLines);
      for (var i = 0; i < keepInsetPolygonLines.length; i++) {
        if (keepInsetPolygonLines[i]) {
          draw.line(insetPolygonLines[i].a, insetPolygonLines[i].b, "rgba(0,0,255,0.5)", 6.0);
        }
      }

      var resultLines = clearPolygonByFilteredLines(
        insetPolygonLines,
        insetLines,
        insetRectanglePolygons,
        polygon,
        keepInsetPolygonLines
      );
      for (var i = 0; i < resultLines.length; i++) {
        draw.line(resultLines[i].a, resultLines[i].b, "rgba(255,0,0,0.75)", 1.0);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildPolygon = function () {
      polygon = buildRandomizedPolygon(config.pointCount);
      keepInsetPolygonLines = polygon.vertices.map(function () {
        return true;
      });
      pb.removeAll();
      pb.add(polygon);
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, "pointCount").min(3).max(32).step(1).name("pointCount").title("Number of polygon vertices")
      .onChange( function() { rebuildPolygon(); });
      // prettier-ignore
      gui.add(config, "innerPolygonOffset").min(0).max(400).step(1).name("innerPolygonOffset").title("The line offset to use.")
      .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "drawVertexNumbers").name("drawVertexNumbers").title("Check to toggle vertex number on/off")
      .onChange( function() { pb.redraw() });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    rebuildPolygon();
    // pb.redraw();
  });
})(globalThis);
