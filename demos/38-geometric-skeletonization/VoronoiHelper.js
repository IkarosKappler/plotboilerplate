/**
 * A helper to do the Deulaunay and Voroni stuff for us.
 * Keep the main code tiny and clean.
 *
 * @author  Ikaros Kappler
 * @date    2021-12-14
 * @version 1.0.0
 */

globalThis.VoronoiHelper = (function () {
  var VH = function (polygon) {
    this.polygon = polygon;
    this.triangles = null;
    this.voronoiDiagram = null;
  };

  /**
   * Make the triangulation (Delaunay).
   */
  VH.prototype.triangulate = function () {
    var delau = new Delaunay(this.polygon.vertices, {});
    this.triangles = delau.triangulate();
  };

  /**
   * Convert the triangle set to the Voronoi diagram.
   */
  VH.prototype.makeVoronoiDiagram = function () {
    if (this.triangles === null) {
      throw Error("Triangulate the vertex first before make the voronoi diagram.");
    }
    var voronoiBuilder = new delaunay2voronoi(this.polygon.vertices, this.triangles);
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

  return VH;
})();
