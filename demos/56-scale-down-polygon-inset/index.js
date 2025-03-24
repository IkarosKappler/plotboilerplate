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
      removeEars: params.getBoolean("removeEars", false),
      drawVertexNumbers: params.getBoolean("drawVertexNumbers", false),
      drawPolygonInsetLines: params.getBoolean("drawPolygonInsetLines", true),
      drawUnfilteredSplitPolygons: params.getBoolean("drawUnfilteredSplitPolygons", false),
      drawInnerPolygonAngles: params.getBoolean("drawInnerPolygonAngles", false),
      fillResultPolygons: params.getBoolean("fillResultPolygons", true)
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

    var drawResultPolygons = function (draw, fill, resultPolygons) {
      for (var i = 0; i < resultPolygons.length; i++) {
        var split = resultPolygons[i];
        for (var j = 0; j < split.length; j++) {
          draw.crosshair(split[j], 10.0, "green", 1);
        }

        if (config.fillResultPolygons) {
          var nextColor = randomWebColor(i, "Mixed", 1.0);
          fill.polyline(split, false, nextColor);
        }
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
      draw.polygon(boundsAsRectPoly, "grey", 1);

      if (config.drawUnfilteredSplitPolygons) {
        drawResultPolygons(draw, fill, polygonInset.splitPolygons);
      } else {
        drawResultPolygons(draw, fill, polygonInset.filteredSplitPolygons);
      }

      // Step 1: draw collected inset lines.
      for (var i = 0; i < polygonInset.insetLines.length; i++) {
        var originalLine = polygonInset.originalPolygonLines[i];
        var insetLine = polygonInset.insetLines[i];
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
      if (config.drawPolygonInsetLines) {
        for (var i = 0; i < polygonInset.insetPolygonLines.length; i++) {
          var ipl = polygonInset.insetPolygonLines[i];
          // console.log("ipl", ipl);
          draw.line(ipl.a, ipl.b, "green", 4.0);
        }
      }

      // Draw rectangles.
      for (var i = 0; i < polygonInset.insetRectanglePolygons.length; i++) {
        var rectPolygon = polygonInset.insetRectanglePolygons[i];
        fill.polygon(rectPolygon, "rgba(192,192,192,0.25)");
      }

      // Draw the final result: the inset polygon!
      for (var i = 0; i <= polygonInset.insetPolygon.vertices.length; i++) {
        draw.line(polygonInset.insetPolygon.getVertexAt(i), polygonInset.insetPolygon.getVertexAt(i + 1), "rgba(255,0,0,0.5)", 4);
      }

      // Draw inner angles?
      if (config.drawInnerPolygonAngles) {
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
          var line = polygonInset.polygon.getEdgeAt(i);
          var lineCenter = line.vertAt(0.5);
          var lineAngle = geomutils.mapAngleTo2PI(line.angle());
          fill.text((lineAngle * RAD_TO_DEG).toFixed(1) + "°", lineCenter.x - 5, lineCenter.y - 10, { color: "green" });
        }
      }
    };

    /**
     * Question: what happens if line is completely out of bounds?
     * Answer: then the bounds were not correctly constructed!
     **/
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

    var rebuildPolygonInset = function () {
      // Create new polygon-inset instance.
      polygonInset = new PolygonInset(polygon);

      // Compute the polygon inset.
      var maxPolygonSplitDepth = config.pointCount; // This definitely return enough split polygons
      polygonInset.computeOutputPolygons({
        innerPolygonOffset: config.innerPolygonOffset,
        maxPolygonSplitDepth: maxPolygonSplitDepth,
        intersectionEpsilon: config.intersectionEpsilon,
        removeEars: config.removeEars
      });

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
      polygon = createRandomizedPolygon(config.pointCount, viewport, true); // createClockwise=true

      // Re-add the new polygon to trigger redraw.
      pb.removeAll(false, false); // Don't trigger redraw
      pb.add(polygon, false); // Don't trigger redraw
      installPolygonListeners(polygon);

      // This will trigger redraw
      rebuildPolygonInset();
    };

    var stats = {
      numResultPolygons: 0,
      mouseX: 0,
      mouseY: 0
    };

    // +---------------------------------------------------------------------------------
    // | Add a mouse listener to track the mouse position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "polygon-demo")
      .move(function (e) {
        var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
        // stats.positionInA = polygonA != null && relPos != null && polygonA.containsVert(relPos);
        // stats.positionInB = polygonB != null && relPos != null && polygonB.containsVert(relPos);
        stats.mouseX = relPos.x;
        stats.mouseY = relPos.y;
      })
      .drag(function (e) {
        // When vertices are moved, the convex hull might change
        if (config.useConvexHullA || config.useConvexHullB) adjustPolygons();
      });

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
      gui.add(config, "intersectionEpsilon").min(0.0).max(100.0).step(1.0).name("intersectionEpsilon").title("Draw all (unfiltered) split polygons?")
      .onChange( function() { rebuildPolygonInset() });
      // prettier-ignore
      gui.add(config, "removeEars").name("removeEars").title("Remove all ear edges from raw inset polygon?")
      .onChange( function() { rebuildPolygonInset() });
      // prettier-ignore
      gui.add(config, "drawVertexNumbers").name("drawVertexNumbers").title("Check to toggle vertex number on/off")
      .onChange( function() { rebuildPolygonInset() });
      // prettier-ignore
      gui.add(config, "drawPolygonInsetLines").name("drawPolygonInsetLines").title("Draw polygon inset lines?")
      .onChange( function() { rebuildPolygonInset()});
      // prettier-ignore
      gui.add(config, "drawUnfilteredSplitPolygons").name("drawUnfilteredSplitPolygons").title("Draw all (unfiltered) split polygons?")
       .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "drawInnerPolygonAngles").name("drawInnerPolygonAngles").title("Draw the inner polygon angles?")
      .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "fillResultPolygons").name("fillResultPolygons").title("Fill the final result polygons?")
      .onChange( function() { pb.redraw() });

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("numResultPolygons").suffix(" polygons");
      uiStats.add("mouseX").suffix("");
      uiStats.add("mouseY").suffix("");
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    rebuildPolygon();
  });
})(globalThis);
