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

// Todo: eliminate co-linear edges.

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
      intersectionEpsilon: params.getNumber("intersectionEpsilon", 1.0), // square pixels
      drawVertexNumbers: params.getBoolean("drawVertexNumbers", false),
      drawPolygonInsetLines: params.getBoolean("drawPolygonInsetLines", true),
      drawUnfilteredSplitPolygons: params.getBoolean("drawUnfilteredSplitPolygons", false)
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

    var installPolygonListeners = function (polygon) {
      for (var i = 0; i < polygon.vertices.length; i++) {
        polygon.vertices[i].listeners.addDragListener(function () {
          rebuildPolygonInset();
        });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();
    // Must be in clockwise order!
    var polygon = null;
    // TODO: clear co-linear polygon edges-
    // var keepInsetPolygonLines = [];
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
      console.log("drawInsetPolygon");
      var polygonBounds = polygon.getBounds();
      var boundsAsRectPoly = polygonBounds.toPolygon();
      // var originalPolygonLines = polygon.getLines();
      draw.polygon(boundsAsRectPoly, "grey", 1);

      // var maxPolygonSplitDepth = config.pointCount; // This definitely return enough split polygons
      // polygonInset.computeOutputPolygons(config.innerPolygonOffset, maxPolygonSplitDepth, config.intersectionEpsilon);

      if (config.drawUnfilteredSplitPolygons) {
        for (var i = 0; i < polygonInset.splitPolygons.length; i++) {
          var split = polygonInset.splitPolygons[i];
          for (var j = 0; j < split.length; j++) {
            draw.crosshair(split[j], 10.0, "green", 1);
          }

          var nextColor = randomWebColor(i, "Mixed", 1.0);
          fill.polyline(split, false, nextColor);
        }
      } else {
        for (var i = 0; i < polygonInset.filteredSplitPolygons.length; i++) {
          var split = polygonInset.filteredSplitPolygons[i];
          for (var j = 0; j < split.length; j++) {
            draw.crosshair(split[j], 10.0, "green", 1);
          }

          var nextColor = randomWebColor(i, "Mixed", 1.0);
          fill.polyline(split, false, nextColor);
        }
      }

      // Step 1: draw collected inset lines.
      for (var i = 0; i < polygonInset.insetLines.length; i++) {
        var originalLine = polygonInset.originalPolygonLines[i];
        var insetLine = polygonInset.insetLines[i];
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
      // var insetPolygonLines = polygonInset.collectInsetPolygonLines(insetLines);
      if (config.drawPolygonInsetLines) {
        for (var i = 0; i < polygonInset.insetPolygonLines.length; i++) {
          var ipl = polygonInset.insetPolygonLines[i];
          // console.log("ipl", ipl);
          draw.line(ipl.a, ipl.b, "green", 4.0);
        }
      }

      for (var i = 0; i < polygonInset.insetRectanglePolygons.length; i++) {
        var rectPolygon = polygonInset.insetRectanglePolygons[i];
        fill.polygon(rectPolygon, "rgba(192,192,192,0.25)");
        // Draw rectangular cross inside
      }

      for (var i = 0; i <= polygonInset.insetPolygon.vertices.length; i++) {
        draw.line(polygonInset.insetPolygon.getVertexAt(i), polygonInset.insetPolygon.getVertexAt(i + 1), "rgba(255,0,0,0.5)", 4);
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

    // var mapAngleTo2PI = function (angle) {
    //   var new_angle = Math.asin(Math.sin(angle));
    //   if (Math.cos(angle) < 0) {
    //     new_angle = Math.PI - new_angle;
    //   } else if (new_angle < 0) {
    //     new_angle += 2 * Math.PI;
    //   }
    //   return new_angle;
    // };

    var rebuildPolygonInset = function () {
      // Create new polygon-inset instance.
      polygonInset = new PolygonInset(polygon);

      // Compute the polygon inset.
      var maxPolygonSplitDepth = config.pointCount; // This definitely return enough split polygons
      polygonInset.computeOutputPolygons(config.innerPolygonOffset, maxPolygonSplitDepth, config.intersectionEpsilon);

      // Update stats
      stats.numResultPolygons = polygonInset.filteredSplitPolygons.length;

      // And finally redraw
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildPolygon = function () {
      // Create a new randomized polygon.
      polygon = buildRandomizedPolygon(config.pointCount);
      // keepInsetPolygonLines = polygon.vertices.map(function () {
      //   return true;
      // });
      // Also create new polygon-inset instance.
      // polygonInset = new PolygonInset(polygon);

      // // Compute the polygon inset.
      // var maxPolygonSplitDepth = config.pointCount; // This definitely return enough split polygons
      // polygonInset.computeOutputPolygons(config.innerPolygonOffset, maxPolygonSplitDepth, config.intersectionEpsilon);

      // Update stats
      // stats.numResultPolygons = polygonInset.filteredSplitPolygons.length;

      // Re-add the new polygon to trigger redraw.
      pb.removeAll(false, false); // Don't trigger redraw
      pb.add(polygon, false); // Don't trigger redraw
      installPolygonListeners(polygon);

      // This will trigger redraw
      rebuildPolygonInset();
    };

    var stats = {
      numResultPolygons: 0
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
      gui.add(config, "innerPolygonOffset").min(-400).max(400).step(1).name("innerPolygonOffset").title("The line offset to use.")
      .onChange( function() { rebuildPolygonInset() });
      // prettier-ignore
      gui.add(config, "drawVertexNumbers").name("drawVertexNumbers").title("Check to toggle vertex number on/off")
      .onChange( function() { rebuildPolygonInset() });
      // prettier-ignore
      gui.add(config, "drawPolygonInsetLines").name("drawPolygonInsetLines").title("Draw polygon inset lines?")
      .onChange( function() { rebuildPolygonInset()});
      // prettier-ignore
      gui.add(config, "drawUnfilteredSplitPolygons").name("drawUnfilteredSplitPolygons").title("Draw all (unfiltered) split polygons?")
       .onChange( function() { rebuildPolygonInset() });
      // prettier-ignore
      gui.add(config, "intersectionEpsilon").min(0.0).max(100.0).step(1.0).name("intersectionEpsilon").title("Draw all (unfiltered) split polygons?")
      .onChange( function() { rebuildPolygonInset() });

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("numResultPolygons").suffix(" polygons");
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    rebuildPolygon();
  });
})(globalThis);
