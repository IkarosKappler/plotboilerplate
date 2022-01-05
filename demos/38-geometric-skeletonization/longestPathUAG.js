/**
 * Find a longest path in any Undirected-Acyclic-Graph.
 *
 * @author  Ikaros Kappler
 * @date    2022-01-04
 * @version 1.0.0
 */

function fillMatrixRow(length, startNodeIndex) {
  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = { path: [startNodeIndex], value: 0 };
  }
  return arr;
}

function fillArray(length, value) {
  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = value;
  }
  return arr;
}

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
  var matrix = new Array(n);
  for (var i = 0; i < n; i++) {
    matrix[i] = fillMatrixRow(n, i);
  }

  // Collect all distances
  // for (var i = 0; i < n; i++) {
  //   for (var j = i; j < n; j++) {
  //     findDistance(graph, matrix, i, j);
  //   }
  // }

  // var nodeQueue = [graph.edges[0].i];
  // while (nodeQueue.length > 0) {
  //   var node = nodeQueue.pop();
  //   var adjacentNodes = findAdjacentNonVisitedNodes(matrix, graph.edges, node);
  //   for (var j in adjacentNodes) {
  //     var neightbour = adjacentNodes[j];
  //     for (var i = 0; i < n; i++) {
  //       if (i === node) {
  //         continue;
  //       }
  //       // if (matrix[node][i].value !== 0) {
  //       matrix[node][neightbour].value = matrix[node][i].value + 1;
  //       // }
  //     }
  //   }
  //   nodeQueue = nodeQueue.concat(adjacentNodes);
  // }

  var pathList = [];
  var longestPath = [];
  for (var i = 0; i < outerVertexIndices.length; i++) {
    for (var j = i + 1; j < outerVertexIndices.length; j++) {
      if (j === i) {
        continue;
      }
      var visitedVertices = fillArray(n, false);
      var path = findPath(graph.edges, visitedVertices, outerVertexIndices[i], outerVertexIndices[j]);
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

var findPath = function (edges, visitedVertices, vertIndexI, vertIndexJ) {
  visitedVertices[vertIndexI] = true;
  if (vertIndexI === vertIndexJ) {
    return [vertIndexJ];
  }
  var adjacentEdges = findAdjacentEdges(edges, visitedVertices, vertIndexI);
  // var path = [vertIndexI];
  var longestSubPath = [];
  for (var e = 0; e < adjacentEdges.length; e++) {
    var edge = adjacentEdges[e];
    var tmpPath = findPath(edges, visitedVertices, edge.j, vertIndexJ);
    if (tmpPath.length > longestSubPath.length) {
      longestSubPath = tmpPath;
    }
  }
  visitedVertices[vertIndexI] = false;
  return [vertIndexI].concat(longestSubPath);
};

var findAdjacentEdges = function (edges, visitedVertices, vertIndex) {
  const adjacentEdges = [];
  for (var e = 0; e < edges.length; e++) {
    var edge = edges[e];
    if (edge.i === vertIndex && !visitedVertices[edge.j]) {
      adjacentEdges.push(edge);
      // visitedVertices[edge.j] = true;
    }
    if (edge.j === vertIndex && !visitedVertices[edge.i]) {
      adjacentEdges.push({ i: edge.j, j: edge.i });
      // visitedVertices[edge.i] = true;
    }
  }
  return adjacentEdges;
};

var findAdjacentNonVisitedNodes = function (matrix, edges, node) {
  var list = [];
  for (var e in edges) {
    var edge = edges[e];
    if (edge.i === node && edge.j !== node && matrix[node][edge.j].value === 0) {
      list.push(edge.j);
    }
    if (edge.j === node && edge.i !== node && matrix[node][edge.i].value === 0) {
      list.push(edge.i);
    }
  }
  return list;
};

// function findDistance(graph, matrix, i, j) {
//   if (i === j) {
//     matrix[i][j].value = 0;
//     return 0;
//   }
//   if (matrix[i][j].value !== 0) {
//     return matrix[i][j].value;
//   }
//   for (var e in graph.edges) {
//     var edge = graph.edges[e];

//   }
// }

function _findDistance(graph, matrix, i, j) {
  //   console.log("rec", i, j);
  // ...
  if (i === j || matrix[i][j].value !== 0) {
    return matrix[i][j].value;
  }
  for (var e in graph.edges) {
    var edge = graph.edges[e];
    if (edge.j === i) {
      //   matrix[i][j].value++;
      findDistance(graph, matrix, i, edge.i);
      findDistance(graph, matrix, edge.j, j);
      matrix[i][j].path = matrix[i][edge.i].path.concat(matrix[edge.j][j].path);
      matrix[i][j].value = matrix[i][edge.i].value + matrix[edge.j][j].value;
    } else if (edge.i === i) {
      //   matrix[i][j].value++;
      findDistance(graph, matrix, i, edge.j);
      findDistance(graph, matrix, edge.i, j);
      matrix[i][j].path = matrix[i][edge.j].path.concat(matrix[edge.i][j].path);
      matrix[i][j].value = matrix[i][edge.i].value + matrix[edge.i][j].value;
    }

    // if (edge.j === j) {
    //   //   matrix[i][j].value++;
    //   findDistance(graph, matrix, i, edge.i);
    //   findDistance(graph, matrix, edge.j, j);
    //   matrix[i][j].path = matrix[i][edge.i].path.concat(matrix[edge.j][j].path);
    //   matrix[i][j].value = matrix[i][edge.i].value + matrix[edge.j][j].value;
    // } else if (edge.i === j) {
    //   //   matrix[i][j].value++;
    //   findDistance(graph, matrix, i, edge.j);
    //   findDistance(graph, matrix, edge.i, j);
    //   matrix[i][j].path = matrix[i][edge.j].path.concat(matrix[edge.i][j].path);
    //   matrix[i][j].value = matrix[i][edge.j].value + matrix[edge.i][j].value;
    // }
  }
}
