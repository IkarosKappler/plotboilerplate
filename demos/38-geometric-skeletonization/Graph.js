/**
 * Constructs a simple graph with vertices and edges.
 *
 * @author  Ikaros Kappler
 * @date    2022-01-10
 * @version 1.0.0
 */

var Graph = function (vertices, edges) {
  this.vertices = vertices;
  this.edges = edges;
};

Graph.prototype.getEdgeWeight = function (i, j) {
  return this.vertices[i].distance(j);
};
