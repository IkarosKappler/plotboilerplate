/**
 * Detect and remove duplicate edges in an array.
 *
 * This function creates a new array, the old one is not modified.
 *
 * @author Ikaros Kappler
 * @date 2021-04-21
 * @version 0.0.1
 */

/**
 *
 * @param {Array<[number,number]} edges
 * @returns
 */
var reduceGeometryDuplicateEdges = function (edges) {
  var newEdges = [];
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    // Note that edges work in both directions, so [a,b]==[b,a] is true
    if (
      newEdges.findIndex(function (checkEdge) {
        return (checkEdge[0] == edge[0] && checkEdge[1] == edge[1]) || (checkEdge[0] == edge[1] && checkEdge[1] == edge[0]);
      }) === -1
    ) {
      newEdges.push(edges[i]);
    }
  }
  return newEdges;
};
