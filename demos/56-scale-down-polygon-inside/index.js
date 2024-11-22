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
  const RAD_TO_DEG = 180.0 / Math.PI;
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
      drawVertexNumbers: params.getBoolean("drawVertexNumbers", false),
      drawPolygonInsetLines: params.getBoolean("drawPolygonInsetLines", true)
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
    var polygonInset = null; // InsetPolygonInstance

    var preDraw = function (draw, fill) {
      // ...
    };

    var postDraw = function (draw, fill) {
      drawInsetPolygon(draw, fill, polygon);

      if (config.drawVertexNumbers) {
        drawPolygonIndices(polygon, fill, { color: "orange", fontFamily: "Arial", fontSize: 9, yOffset: 20 });
      }
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
      var insetLines = polygonInset.collectInsetLines(originalPolygonLines, config.innerPolygonOffset);
      // console.log("insetLines", insetLines);
      for (var i = 0; i < insetLines.length; i++) {
        var originalLine = originalPolygonLines[i];
        var insetLine = insetLines[i];
        draw.line(insetLine.a, insetLine.b, "rgba(192,192,192,0.25)", 3.0);
        draw.line(originalLine.a, insetLine.a, "grey", 1.0, { dashOffset: 0.0, dashArray: [3.0, 4.0] });
        draw.line(originalLine.b, insetLine.b, "grey", 1.0, { dashOffset: 0.0, dashArray: [3.0, 4.0] });
        // // Get whole line inside poly bounds.
        var lineInsidePolyBounds = polygonInset.expandLineToRectBounds(insetLine, boundsAsRectPoly);
        if (lineInsidePolyBounds) {
          // Some polygons produce inset lines that are completely OUTSIDE the original bounds!
          // Just ignore those.
          draw.line(lineInsidePolyBounds.a, lineInsidePolyBounds.b, "rgba(0,255,0,0.2)", 1.0);
        }
      }

      // Step 2: Transform inset line to resemble a polygon (expand or crop).
      var insetPolygonLines = polygonInset.collectInsetPolygonLines(insetLines);
      if (config.drawPolygonInsetLines) {
        for (var i = 0; i < insetPolygonLines.length; i++) {
          var ipl = insetPolygonLines[i];
          // console.log("ipl", ipl);
          draw.line(ipl.a, ipl.b, "green", 4.0);
        }
      }

      // Convert to rectangle polygons
      var insetRectanglePolygons = polygonInset.collectRectangularPolygonInsets(originalPolygonLines, insetLines);
      for (var i = 0; i < insetRectanglePolygons.length; i++) {
        var rectPolygon = insetRectanglePolygons[i];
        fill.polygon(rectPolygon, "rgba(192,192,192,0.25)");
        // Draw rectangular cross inside
      }

      //----------------------------- THIS MUST BE DISCUSSED -----------------------------
      // Step 3: identify polygon lines outside the desired bounds.
      // polygonInset.filterLines(insetPolygonLines, insetLines, insetRectanglePolygons, polygon, keepInsetPolygonLines);
      // for (var i = 0; i < keepInsetPolygonLines.length; i++) {
      //   if (keepInsetPolygonLines[i]) {
      //     draw.line(insetPolygonLines[i].a, insetPolygonLines[i].b, "rgba(0,0,255,0.5)", 6.0);
      //   }
      // }

      // var resultLines = polygonInset.clearPolygonByFilteredLines(
      //   insetPolygonLines,
      //   insetLines,
      //   insetRectanglePolygons,
      //   polygon,
      //   keepInsetPolygonLines
      // );
      // for (var i = 0; i < resultLines.length; i++) {
      //   draw.line(resultLines[i].a, resultLines[i].b, "rgba(255,0,128,1.0)", 2.0);
      // }
      //-END------------------------- THIS MUST BE DISCUSSED -----------------------------

      // Convert inset polygon lines back to polygon.
      // var insetPolygon = new Polygon([]);
      // insetPolygonLines.forEach(function (insetLine) {
      //   insetPolygon.vertices.push(insetLine.a);
      // });
      var insetPolygon = PolygonInset.convertToBasicInsetPolygon(insetPolygonLines);
      // Test draw inner polygon.
      for (var i = 0; i <= insetPolygon.vertices.length; i++) {
        draw.line(insetPolygon.getVertexAt(i), insetPolygon.getVertexAt(i + 1), "rgba(255,0,0,0.5)", 4);
      }
      // Array<Array<Vertex>>
      var maxSplitDepth = 10;
      var splitPolygons = splitPolygonToNonIntersecting(insetPolygon.vertices, maxSplitDepth, true); // insideBoundsOnly
      console.log("splitPolygons.length", splitPolygons.length);
      if (splitPolygons.length > 1) {
        console.log("splitPolygons", splitPolygons);
      }
      for (var i = 0; i < splitPolygons.length; i++) {
        var split = splitPolygons[i];
        for (var j = 0; j < split.length; j++) {
          draw.crosshair(split[j], 10.0, "green", 1);
        }

        var nextColor = randomWebColor(i, "Mixed", 1.0);
        fill.polyline(split, false, nextColor);
      }

      // Draw inner angles?
      for (var i = 0; i < polygonInset.polygon.vertices.length; i++) {
        var innerAngle = polygonInset.polygon.getInnerAngleAt(i);
        var tmpLine = new Line(polygonInset.polygon.vertices[i].clone(), polygonInset.polygon.getVertexAt(i + 1).clone());
        tmpLine.b.rotate(innerAngle / 2.0, tmpLine.a);
        draw.line(tmpLine.a, tmpLine.b, "orange", 2);
        fill.text((innerAngle * RAD_TO_DEG).toFixed(1) + "°", tmpLine.a.x, tmpLine.a.y, { color: "orange" });
        var isAcute = polygon.isAngleAcute(i);
        fill.text("isAcute=" + isAcute, tmpLine.a.x, tmpLine.a.y + 10, { color: "orange" });
      }

      // Draw line angles
      for (var i = 0; i < polygonInset.polygon.vertices.length; i++) {
        var line = polygonInset.polygon.getLineAt(i);
        var lineCenter = line.vertAt(0.5);
        var lineAngle = geomutils.mapAngleTo2PI(line.angle());
        fill.text((lineAngle * RAD_TO_DEG).toFixed(1) + "°", lineCenter.x - 5, lineCenter.y - 10, { color: "green" });
      }
    };

    var mapAngleTo2PI = function (angle) {
      var new_angle = Math.asin(Math.sin(angle));
      if (Math.cos(angle) < 0) {
        new_angle = Math.PI - new_angle;
      } else if (new_angle < 0) {
        new_angle += 2 * Math.PI;
      }
      return new_angle;
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildPolygon = function () {
      polygon = buildRandomizedPolygon(config.pointCount);
      keepInsetPolygonLines = polygon.vertices.map(function () {
        return true;
      });
      polygonInset = new PolygonInset(polygon);
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
      gui.add(config, "innerPolygonOffset").min(-100).max(400).step(1).name("innerPolygonOffset").title("The line offset to use.")
      .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "drawVertexNumbers").name("drawVertexNumbers").title("Check to toggle vertex number on/off")
      .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "drawPolygonInsetLines").name("drawPolygonInsetLines").title("Draw polygon inset lines")
      .onChange( function() { pb.redraw() });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    rebuildPolygon();
    // pb.redraw();
  });
})(globalThis);
