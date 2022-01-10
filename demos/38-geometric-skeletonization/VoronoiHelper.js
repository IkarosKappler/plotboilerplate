"use strict";
/**
 * A helper to do the Deulaunay and Voroni stuff for us.
 * Keep the main code tiny and clean.
 *
 * This implementation can use two clipping methods:
 *  - Sutherland-Hodgman (if the clip polygon is strictly convex!)
 *  - Greiner-Horman (clip polygon may be non-convex; but is not self-intersecting!)
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
   *
   * Note that some cell need to be reversed as only clockwise winding cells can be
   * clipped (with sutherland-hodgman, which is used here).
   * @param {Polygon} clipPolygon - Should be in clockwise winding order.
   * @param {boolean} isConvex - Indicates if the polygon is convex; convex polygon will be clipped using Sutherland-Hodgman, others will be clipped using Greiner-Horman.
   * @return {Array<Polygon>}
   */
  VH.prototype.clipVoronoiDiagram = function (clipPolygon, isConvex) {
    if (isConvex) {
      return clipVoronoiDiagram_convex(this.voronoiDiagram, clipPolygon);
    } else {
      return clipVoronoiDiagram_nonconvex(this.voronoiDiagram, clipPolygon);
    }
  };

  /**
   * Convert the calculated Voronoi cell into polygons.
   */
  VH.prototype.voronoiCellsToPolygons = function () {
    return this.voronoiDiagram.map(function (cell) {
      return cell.toPolygon();
    });
  };

  /**
   * Clip the whole voronoi diagram using the Sutherland-Hodgman method.
   *
   * Note that some cell need to be reversed as only clockwise winding cells can be
   * clipped (with sutherland-hodgman, which is used here).
   * @param {Polygon} clipPolygon - Should be in clockwise winding order.
   * @return {Array<Polygon>}
   */
  var clipVoronoiDiagram_convex = function (voronoiDiagram, clipPolygon) {
    // TODO: a similar clipping is also used in the 07-Voronoi-demo.
    //       -> use this new class there?
    return voronoiDiagram.map(function (cell) {
      var cellPolygon = cell.toPolygon();
      if (!cellPolygon.isClockwise()) {
        cellPolygon.vertices.reverse();
      }
      // Note: Sutherland-Hodgman only works with _convex_ clipping polygons.
      var clippedPolygonVertices = sutherlandHodgman(clipPolygon.vertices, cellPolygon.vertices);
      var clippedPolygon = new Polygon(cloneVertexArray(clippedPolygonVertices), false);
      return clippedPolygon;
    });
  };

  /**
   * Clip the whole voronoi diagram.
   * Note that some cell need to be reversed as only clockwise winding cells can be
   * clipped (with sutherland-hodgman, which is used here).
   * @param {Polygon} clipPolygon - Should be in clockwise winding order.
   * @return {Array<Polygon>}
   */
  var clipVoronoiDiagram_nonconvex = function (voronoiDiagram, clipPolygon) {
    // TODO: a similar clipping is also used in the 07-Voronoi-demo.
    //       -> use this new class there?

    // Array<Polygon>
    var resultPolygons = [];
    voronoiDiagram.forEach(function (cell) {
      var cellPolygon = cell.toPolygon();
      if (!cellPolygon.isClockwise()) {
        cellPolygon.vertices.reverse();
      }
      // Note: Greiner-Horman can be used for non-convex polygons, too.
      var intersection = greinerHormann.intersection(cellPolygon.vertices, clipPolygon.vertices);
      if (intersection) {
        if (typeof intersection[0][0] === "number") {
          // single linear ring
          resultPolygons.push(new Polygon(cloneVertexArray(intersection)));
        } else {
          for (var i = 0, len = intersection.length; i < len; i++) {
            // Warning intersection polygons may have duplicate vertices (beginning and end).
            // Remove duplicate vertices from the intersection polygons.
            // These may also occur if two vertices of the clipping and the source polygon are congruent.
            var intrsctn = intersection[i];
            resultPolygons.push(new Polygon(cloneVertexArray(intrsctn)));
          }
        }
      } else {
        // Empty clip result.
      }
    });
    return resultPolygons;
  };

  return VH;
})();
