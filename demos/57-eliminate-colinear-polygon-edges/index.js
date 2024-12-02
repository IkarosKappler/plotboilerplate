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
      pointCount: params.getNumber("pointCount", 4),
      eliminationTolerance: params.getNumber("eliminationTolerance", 1.0),
      drawVertexNumbers: params.getBoolean("drawVertexNumbers", false),
      useCustomMethod: params.getBoolean("useCustomMethod", true)
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

    // Adds one vertex to the middle of each edge
    var addColinearEdgesToPolygon = function (polygon) {
      var verts = [];
      for (var i = 0; i < polygon.vertices.length; i++) {
        var edge = polygon.getLineAt(i);
        var middle = edge.vertAt(0.5);
        verts.push(edge.a);
        verts.push(middle);
      }
      return new Polygon(verts, false);
    };

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var viewport = pb.viewport();
    // Must be in clockwise order!
    var polygon = null;

    var preDraw = function (draw, fill) {
      // ...
    };

    var postDraw = function (draw, fill) {
      var nonColinearPoly = config.useCustomMethod
        ? elimitateColinearEdges(polygon, config.eliminationTolerance)
        : polygon.elimitateColinearEdges(config.eliminationTolerance);

      // console.log("nonColinearPoly", nonColinearPoly.vertices.length);
      for (var i = 0; i < nonColinearPoly.vertices.length; i++) {
        var vert = nonColinearPoly.vertices[i];
        draw.circle(vert, 8, "orange", 1.0);
      }
      if (config.drawVertexNumbers) {
        // console.log("drawVertexNumbers", config.drawVertexNumbers);
        drawPolygonIndices(polygon, fill, { color: "orange", fontFamily: "Arial", fontSize: 9, yOffset: 20 });
      }

      // Draw denomitators indicating the colinearity
      for (var i = 0; i < polygon.vertices.length + 1; i++) {
        var lineA = polygon.getLineAt(i);
        var lineB = polygon.getLineAt(i + 1);
        var denom = lineA.denominator(lineB);
        pb.fill.text("denominator=" + denom, lineA.b.x, lineA.b.y, {
          color: "orange",
          fontFamily: "Arial",
          fontSize: 9,
          yOffset: 20
        });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Just rebuilds the pattern on changes.
    // +-------------------------------
    var rebuildPolygon = function () {
      // Create a new randomized polygon.
      polygon = buildRandomizedPolygon(config.pointCount);
      polygon = addColinearEdgesToPolygon(polygon);

      // Re-add the new polygon to trigger redraw.
      pb.removeAll(false, false); // Don't trigger redraw
      pb.add(polygon, true); // trigger redraw
    };

    // +---------------------------------------------------------------------------------
    // | Eliminat co-linear edges.
    // | Please note: this is implemented in the Polygon.eliminateColinearEdges method!
    // +-------------------------------
    var elimitateColinearEdges = function (polygon, epsilon) {
      var verts = cloneVertexArray(polygon.vertices); // .slice(); // Creates a shallow copy
      // console.log("elimitateColinearEdges verts shallow copy", verts);
      let i = 0;
      var lineA = new Line(new Vertex(), new Vertex());
      var lineB = new Line(new Vertex(), new Vertex());
      while (i + 1 < verts.length && verts.length > 2) {
        const vertA = verts[i];
        const vertB = verts[(i + 1) % verts.length];
        lineA.a = vertA;
        lineA.b = vertB;
        lineB.a = vertB;
        var areColinear = false;
        let j = i + 2;
        do {
          let vertC = verts[j % verts.length];
          lineB.b = vertC;
          areColinear = lineA.colinear(lineB, epsilon);
          // console.log("are colinear?", i, i + 1, j, areColinear);
          if (areColinear) {
            j++;
          }
        } while (areColinear);
        // Now j points to the first vertex that's NOT colinear to the current lineA
        // -> delete all vertices in between
        if (j - i > 2) {
          // Means: there have been 'colinear vertices' in between
          // console.log("Splice", "i", i, "j", j, i + 1, j - i - 1);
          verts.splice(i + 1, j - i - 2);
        }
        i++;
      }
      // console.log("elimitateColinearEdges", verts);
      return new Polygon(verts, polygon.isOpen);
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
      gui.add(config, "eliminationTolerance").min(0.0).max(10000.0).step(0.25).name("eliminationTolerance").title("The epsilon to use.")
      .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "drawVertexNumbers").name("drawVertexNumbers").title("Check to toggle vertex number on/off")
      .onChange( function() { pb.redraw() });
      // prettier-ignore
      gui.add(config, "useCustomMethod").name("useCustomMethod").title("Use the custom method or the built-in one?")
      .onChange( function() { pb.redraw() });
    }

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    rebuildPolygon();
  });
})(globalThis);
