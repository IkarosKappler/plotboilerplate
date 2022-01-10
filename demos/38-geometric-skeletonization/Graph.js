/**
 * Constructs a simple graph with vertices and edges.
 *
 * @author  Ikaros Kappler
 * @date    2022-01-10
 * @version 1.0.0
 */

var Graph = function (vertices, edges, computeEdgeWeight) {
  this.vertices = vertices;
  this.edges = edges;
  // If no weight function is specified then just use the discrete weight function.
  this.computeEdgeWeight =
    computeEdgeWeight ||
    function (i, j) {
      return i === j ? 0 : 1;
    };
};

Graph.prototype.getEdgeWeight = function (i, j) {
  return this.computeEdgeWeight(this, i, j);
};
