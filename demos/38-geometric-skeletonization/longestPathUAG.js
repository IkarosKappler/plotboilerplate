/**
 * Find a longest path in any Undirected-Acyclic-Graph.
 *
 * @author  Ikaros Kappler
 * @date    2022-01-04
 * @version 1.0.0
 */

globalThis.longestPathUAG = (function () {
  /**
   * type Edge = { i: number, j: number }
   * type Graph = { vertices : Array<Vertex>, edges: Array<Edge> }
   *
   * @param {Graph} graph - The graph with `vertices` and `edges`.
   * @param {number[]} outerVertexIndices - The indices of vertices that are on the outer graph bounds.
   */
  function longestPathUAG(graph, outerVertexIndices) {
    // Build a matrix Array[a][b], with a = b = graph.vertices.length
    // Into each field store the distance between these two vertices.

    if (graph.edges.length === 0) {
      return [];
    }

    var n = graph.vertices.length;

    var matrix = matrixFill(n, n, null);

    var longestPath = [];
    for (var i = 0; i < outerVertexIndices.length; i++) {
      for (var j = i + 1; j < outerVertexIndices.length; j++) {
        if (j === i) {
          continue;
        }
        // var visitedVertices = fillArray(n, false);
        var visitedVertices = arrayFill(n, false);
        var path = findPath(matrix, graph.edges, visitedVertices, outerVertexIndices[i], outerVertexIndices[j]);
        // pathList.push( )
        // console.log("path", path);
        // TODO: here are a LOT of duplicates!
        if (path.length > longestPath.length) {
          longestPath = path;
        }
      }
    }

    return longestPath;
  }

  var findPath = function (matrix, edges, visitedVertices, vertIndexI, vertIndexJ) {
    visitedVertices[vertIndexI] = true;
    if (vertIndexI === vertIndexJ) {
      return [vertIndexJ];
    }
    if (matrix[vertIndexI][vertIndexJ] !== null) {
      return matrix[vertIndexI][vertIndexJ];
    }
    var adjacentEdges = findAdjacentEdges(edges, visitedVertices, vertIndexI);
    // var path = [vertIndexI];
    var longestSubPath = [];
    for (var e = 0; e < adjacentEdges.length; e++) {
      var edge = adjacentEdges[e];
      var tmpPath = findPath(matrix, edges, visitedVertices, edge.j, vertIndexJ);
      if (tmpPath.length > longestSubPath.length) {
        longestSubPath = tmpPath;
      }
    }
    var resultPath = [vertIndexI].concat(longestSubPath);
    visitedVertices[vertIndexI] = false;
    // TODO: here's an error. Why?
    // matrix[vertIndexI][vertIndexJ] = resultPath;
    return resultPath;
  };

  var findAdjacentEdges = function (edges, visitedVertices, vertIndex) {
    const adjacentEdges = [];
    for (var e = 0; e < edges.length; e++) {
      var edge = edges[e];
      if (edge.i === vertIndex && !visitedVertices[edge.j]) {
        adjacentEdges.push(edge);
      }
      if (edge.j === vertIndex && !visitedVertices[edge.i]) {
        adjacentEdges.push({ i: edge.j, j: edge.i });
      }
    }
    return adjacentEdges;
  };

  return longestPathUAG;
})();
