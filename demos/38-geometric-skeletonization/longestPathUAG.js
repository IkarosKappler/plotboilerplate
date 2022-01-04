/**
 * Find a longest path in any Undirected-Acyclic-Graph.
 *
 * @author  Ikaros Kappler
 * @date    2022-01-04
 * @version 1.0.0
 */

function fillArray(length, startNodeIndex) {
  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = { path: [startNodeIndex], value: 0 };
  }
  return arr;
}

/**
 * type Edge = { i: number, j: number }
 * type Graph = { vertices : Array<Vertex>, edges: Array<Edge> }
 * @param {Graph} graph
 */
function longestPathUAG(graph) {
  // Build a matrix Array[a][b], with a = b = graph.vertices.length
  // Into each field store the distance between these two vertices.
  var n = graph.vertices.length;
  var matrix = new Array(n);
  for (var i = 0; i < n; i++) {
    matrix[i] = fillArray(n, i);
  }

  var edgeQueue = [];

  // Fill matrix for direct edges
  //   for (var e = 0; e < graph.edges.length; e++) {
  //     var edge = graph.edges[e];
  //     // matrix[edge.i][edge.j].value = 1;
  //     // matrix[edge.j][edge.i].value = 1;
  //     // matrix[edge.i][edge.j].path.push(edge.j);
  //     // matrix[edge.j][edge.i].path.push(edge.i);
  //     edgeQueue.push(edge);
  //   }

  // Collect all distances
  for (var i = 0; i < n; i++) {
    for (var j = i; j < n; j++) {
      findDistance(graph, matrix, i, j);
    }
  }

  return matrix;
}

function findDistance(graph, matrix, i, j) {
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
