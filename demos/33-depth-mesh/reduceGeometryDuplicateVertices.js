/**
 * Detect and remove duplicate or too-close vertices in a geometry.
 *
 * If two vertices are too close together then they will be merged into one; the edge
 * information will be updated respectively.
 *
 * This function creates a new geomtry, the old one is not modified.
 *
 * @author Ikaros Kappler
 * @date 2021-04-21
 * @version 0.0.1
 */

/**
 *
 * @param {Geometry} geometry { vertices:Vert3[], edges:Array<[number,number]>}
 * @param {number} epsilon (default is 0.0001)
 * @returns
 */
var reduceGeometryDuplicateVertices = function (geometry, epsilon) {
  if (typeof epsilon === "undefined" || epsilon < 0) {
    epsilon = 0.0001;
  }
  // index -> index
  var vertexMap = new Array(geometry.vertices.length);
  for (var i = 0; i < geometry.vertices.length; i++) {
    vertexMap[i] = i;
  }

  // Remove duplicates and keep track of removed ones
  var newVertices = [];
  for (var i = 0; i < geometry.vertices.length; i++) {
    var vertA = geometry.vertices[i];
    if (vertexMap[i] != i) {
      // vertA was already marked as duplicate
      continue;
    }
    var newIndexA = newVertices.length;
    newVertices.push(vertA);
    vertexMap[i] = newIndexA;
    for (var j = i + 1; j < geometry.vertices.length; j++) {
      if (vertexMap[j] != j) {
        // vertB was already marked as duplicate
        continue;
      }
      var vertB = geometry.vertices[j];
      var distance = Math.sqrt(Math.pow(vertB.x - vertA.x, 2) + Math.pow(vertB.y - vertA.y, 2) + Math.pow(vertB.z - vertA.z, 2));
      if (distance < epsilon) {
        vertexMap[j] = vertexMap[i];
      }
    }
  }

  // New mapping is ready -> build up the new edge array
  var newEdges = [];
  for (var e = 0; e < geometry.edges.length; e++) {
    var edge = geometry.edges[e];
    newEdges.push([vertexMap[edge[0]], vertexMap[edge[1]]]);
  }

  return { vertices: newVertices, edges: newEdges };
};
