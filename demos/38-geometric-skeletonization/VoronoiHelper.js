"use strict";
/**
 * A helper to do the Deulaunay and Voroni stuff for us.
 * Keep the main code tiny and clean.
 *
 * @author  Ikaros Kappler
 * @date    2021-12-14
 * @version 1.0.0
 */

globalThis.VoronoiHelper = (function () {
  var VH = function (vertices) {
    this.vertices = vertices;
    this.triangles = null;
    this.voronoiDiagram = null;
  };

  /**
   * Make the triangulation (Delaunay).
   */
  VH.prototype.triangulate = function () {
    var delau = new Delaunay(this.vertices, {});
    this.triangles = delau.triangulate();
  };

  /**
   * Convert the triangle set to the Voronoi diagram.
   */
  VH.prototype.makeVoronoiDiagram = function () {
    if (this.triangles === null) {
      throw Error("Triangulate the vertex first before make the voronoi diagram.");
    }
    var voronoiBuilder = new delaunay2voronoi(this.vertices, this.triangles);
    this.voronoiDiagram = voronoiBuilder.build();
    // redraw(pb.draw, pb.fill);
    // Handle errors if vertices are too close and/or co-linear:
    if (voronoiBuilder.failedTriangleSets.length != 0) {
      console.log("The error report contains " + voronoiBuilder.failedTriangleSets.length + " unconnected set(s) of triangles:");
      return false;
    } else {
      return true;
    }
  };

  /**
   * Clip the whole voronoi diagram.
   * Note that some cell need to be reversed as only clockwise winding cells can be
   * clipped (with sutherland-hodgman, which is used here).
   * @param {Polygon} clipPolygon - Should be in clockwise winding order.
   */
  VH.prototype.clipVoronoiDiagram = function (clipPolygon) {
    // TODO: a similar clipping is also used in the 07-Voronoi-demo.
    //       -> use this new class there?
    return this.voronoiDiagram.map(function (cell) {
      var cellPolygon = cell.toPolygon();
      if (!cellPolygon.isClockwise()) {
        cellPolygon.vertices.reverse();
      }
      var clippedPolygonVertices = sutherlandHodgman(clipPolygon.vertices, cellPolygon.vertices);
      var clippedPolygon = new Polygon(cloneVertexArray(clippedPolygonVertices), false);
      return clippedPolygon;
    });
  };

  /**
   * Convert the calculated Voronoi cell into polygons.
   */
  VH.prototype.voronoiCellsToPolygons = function () {
    return this.voronoiDiagram.map(function (cell) {
      return cell.toPolygon();
    });
  };

  return VH;
})();
