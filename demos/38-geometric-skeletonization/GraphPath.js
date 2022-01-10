/**
 * A graph path is a sequence of vertices inside a graph (usually representing a sequence of
 * edges of the graph).
 *
 * Additionally to a simple array there is also an accumulated total weight (sum of all edge
 * weights in the path).
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-01-10
 */

var GraphPath = function (vertexIndices, totalWeight) {
  this.vertexIndices = vertexIndices || [];
  this.totalWeight = totalWeight || 0;
};
