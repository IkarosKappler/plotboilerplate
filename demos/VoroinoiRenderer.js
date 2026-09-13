/**
 * Refactored all Voronoi helper functions for drawing the diagram (demo 07) into this class.
 *
 * @author  Ikaros Kappler
 * @date    2026-09-13
 * @version 1.0.0
 */

(function (_context) {
  var VoronoiRenderer = function (appContext) {
    this.appContext = appContext;
  };

  /**
   * Draw the given triangle with the specified (CSS-) color.
   *
   * @name draw
   * @instance
   * @memberof VoronoiRenderer
   * @param {DrawLib} draw
   * @param {Triangle} t
   * @param {string} color
   * @return {void}
   */
  VoronoiRenderer.prototype.draw = function (draw, fill, voronoiDiagram, pointSet) {
    // Draw circumcircles
    if (this.appContext.config.drawCircumCircles) {
      VoronoiRenderer.drawCircumCircles(draw);
    }

    // An array of VoronoiCells.
    var clipBoxPolygon = Bounds.computeFromVertices(pointSet.points).toPolygon();
    if (this.appContext.config.drawClipBox) {
      draw.polygon(clipBoxPolygon, "rgba(192,192,192,0.25)");
    }

    for (var v in voronoiDiagram) {
      var cell = voronoiDiagram[v];
      var polygon = cell.toPolygon();
      polygon.scale(this.appContext.config.voronoiCellScale, cell.sharedVertex);

      // Draw large (unclipped) Voronoi cell
      if (
        this.appContext.config.drawVoronoiOutlines &&
        (!this.appContext.config.clipVoronoiCells || this.appContext.config.drawUnclippedVoronoiCells)
      ) {
        draw.polyline(
          polygon.vertices,
          false,
          this.appContext.config.clipVoronoiCells ? "rgba(128,128,128,0.333)" : this.appContext.config.voronoiOutlineColor
        );
      }

      // Apply clipping?
      if (this.appContext.config.clipVoronoiCells) {
        // Clone the array here: convert Array<XYCoords> to Array<Vertex>
        polygon = new Polygon(cloneVertexArray(sutherlandHodgman(polygon.vertices, clipBoxPolygon.vertices)), false);
      }

      if (this.appContext.config.drawVoronoiOutlines && this.appContext.config.clipVoronoiCells) {
        draw.polygon(polygon, this.appContext.config.voronoiOutlineColor);
      }

      if ((!cell.isOpen() || this.appContext.config.clipVoronoiCells) && cell.triangles.length >= 3) {
        if (this.appContext.config.drawCubicCurves) {
          var cbezier = polygon.toCubicBezierData(this.appContext.config.voronoiCubicThreshold);
          if (this.appContext.config.fillVoronoiCells) {
            fill.cubicBezierPath(cbezier, this.appContext.config.voronoiCellColor);
          } else {
            draw.cubicBezierPath(cbezier, this.appContext.config.voronoiCellColor);
          }
        }
        if (this.appContext.config.drawVoronoiIncircles) {
          var result = convexPolygonIncircle(polygon);
          var circle = result.circle;
          var triangle = result.triangle;
          // Here we should have found the best inlying circle (and the corresponding triangle)
          // inside the Voronoi cell.
          draw.circle(circle.center, circle.radius, "rgba(255,192,0,1.0)", 2);
        }
      } // END cell is not open
    }
  };

  /**
   * A function for drawing the triangles.
   *
   * @static
   */
  VoronoiRenderer.prototype.drawTriangles = function (draw, triangles) {
    for (var i in triangles) {
      var t = triangles[i];
      VoronoiRenderer.drawTriangle(draw, t, this.appContext.config.makeVoronoiDiagram ? "rgba(0,128,224,0.33)" : "#0088d8");
    }
  };

  /**
   * Draw the given triangle with the specified (CSS-) color.
   *
   * @static
   * @name drawTriangle
   * @memberof VoronoiRenderer
   * @param {DrawLib} draw
   * @param {Triangle} t
   * @param {string} color
   * @return {void}
   */
  VoronoiRenderer.drawTriangle = function (draw, t, color) {
    draw.line(t.a, t.b, color);
    draw.line(t.b, t.c, color);
    draw.line(t.c, t.a, color);
  };

  /**
   * Draw the circumcircles of all triangles.
   */
  VoronoiRenderer.drawCircumCircles = function (draw, triangles) {
    for (var t in triangles) {
      var cc = triangles[t].getCircumcircle();
      draw.circle(cc.center, cc.radius, "#e86800");
    }
  };

  _context.VoronoiRenderer = VoronoiRenderer;
})(globalThis);
