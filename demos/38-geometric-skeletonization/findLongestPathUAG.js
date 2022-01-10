"use strict";
/**
 * Find a longest path in any Undirected-Acyclic-Graph.
 *
 * Note that the passed graph in this implementation can be a directed one, but
 * it will be handled as undirected. If edge(a,b) exists, then edge(b,a) is handled
 * as existing, too.
 *
 * @requires GraphPath
 *
 * @requires arrayFill - See ./src/cjs/utils/algorithms/arrayFill.js
 * @requires matrixFill - See ./src/cjs/utils/algorithms/matrixFill.js
 *
 * @author  Ikaros Kappler
 * @date    2022-01-04
 * @version 1.0.0
 */

globalThis.findLongestPathUAG = (function () {
  /**
   * type Edge = { i: number, j: number }
   * type Graph = { vertices : Array<Vertex>, edges: Array<Edge> }
   *
   * @param {Graph} graph - The graph with `vertices` and `edges`.
   * @param {number[]} outerVertexIndices - The indices of vertices that are on the outer graph bounds.
   */
  function findLongestPathUAG(graph, outerVertexIndices) {
    // Build a matrix Array[a][b], with a = b = graph.vertices.length
    // Into each field store the distance between these two vertices.

    if (graph.edges.length === 0) {
      // return [];
      return new GraphPath(); // empty
    }

    var n = graph.vertices.length;
    var matrix = matrixFill(n, n, null);
    // var longestPath = [];
    var longestPath = new GraphPath();
    for (var i = 0; i < outerVertexIndices.length; i++) {
      var visitedVertices = arrayFill(n, false);
      for (var j = i + 1; j < outerVertexIndices.length; j++) {
        if (j === i) {
          continue;
        }
        var path = findPath(matrix, graph, visitedVertices, outerVertexIndices[i], outerVertexIndices[j]);
        // console.log("path", path);
        // TODO: here are a LOT of duplicates!
        // if (path.length > longestPath.length) {
        //   longestPath = path;
        // }
        if (path.totalWeight > longestPath.totalWeight) {
          longestPath = path;
        }
      }
    }

    // console.log("longestPath", longestPath);
    return longestPath;
  }

  // Filter out all edges that have vertices outside a previously computed vertex sub set.
  // var filterEdges = function (edges, vertexSubSet) {
  //   return edges.filter(function (edge) {
  //     return vertexSubSet.includes(edge.i) && vertexSubSet.includes(edge.j);
  //   });
  // };

  var findPath = function (matrix, graph, visitedVertices, vertIndexI, vertIndexJ) {
    visitedVertices[vertIndexI] = true;
    if (vertIndexI === vertIndexJ) {
      // return [vertIndexJ];
      var result = new GraphPath([vertIndexJ], 0);
      // result.vertexIndices = [vertIndexJ];
      // result.totalWeight = 0;
      return result;
    }
    if (matrix[vertIndexI][vertIndexJ] !== null) {
      return matrix[vertIndexI][vertIndexJ];
    }
    var adjacentVertices = findAdjacentVertices(graph.edges, visitedVertices, vertIndexI);
    // var longestSubPath = [];
    var longestSubPath = new GraphPath();
    for (var e = 0; e < adjacentVertices.length; e++) {
      var vertexIndex = adjacentVertices[e];
      var tmpPath = findPath(matrix, graph, visitedVertices, vertexIndex, vertIndexJ);
      // if (tmpPath.length > longestSubPath.length) {
      // console.log("tmpPath", tmpPath);
      if (
        tmpPath.totalWeight > longestSubPath.totalWeight ||
        (longestSubPath.totalWeight === 0 && tmpPath.vertexIndices.length > 0)
      ) {
        longestSubPath = tmpPath;
      }
    }
    // visitedVertices[vertIndexI] = false;
    // var resultPath = [vertIndexI].concat(longestSubPath);
    var resultPath = new GraphPath();
    resultPath.vertexIndices = [vertIndexI].concat(longestSubPath.vertexIndices);
    // console.log("longestSubPath", longestSubPath);
    if (longestSubPath.vertexIndices.length > 0) {
      // console.log("len");
      resultPath.totalWeight = longestSubPath.totalWeight + graph.getEdgeWeight(vertIndexI, longestSubPath.vertexIndices[0]);
    }
    // TODO: here's an error. Why?
    matrix[vertIndexI][vertIndexJ] = resultPath;
    // matrix[vertIndexJ][vertIndexI] = resultPath.slice().reverse();
    return resultPath;
  };

  var findAdjacentVertices = function (edges, visitedVertices, vertIndex) {
    const adjacentVertices = [];
    for (var e = 0; e < edges.length; e++) {
      var edge = edges[e];
      if (edge.i === vertIndex && !visitedVertices[edge.j]) {
        adjacentVertices.push(edge.j);
      }
      if (edge.j === vertIndex && !visitedVertices[edge.i]) {
        adjacentVertices.push(edge.i);
      }
    }
    return adjacentVertices;
  };

  return findLongestPathUAG;
})();
