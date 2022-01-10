/**
 * From a clipped Voronoi graph (clipped by polygon) this function
 * removes the outer grapgh edges (those that are congruent with the clip
 * polygon).
 *
 * This function is operating in-place in the graph, thus after the operation
 * the graph's edges will differ.
 *
 * Additionally the function returns the indices of those vertices that have
 * become end points in the graph where closed cells have been before.
 *
 * Note that the vertex array is not changed; after this operation it may
 * contain vertices that are no longer connected with edges.
 *
 * @requires findInVertexArray - See ./src/cjs/utils/findInVertexArray.js
 *
 * @param {Graph} graph - The clipped graph (created from a clipped Voronoi cell set).
 * @param {Polygon} clipPolygon - The actual clip polygon that was used beforehand. The polygon's edges
 *                                will be used to find outer graph edges as those are locally congruent.
 * @returns {Array<number>} The indices of detected outer graph vertices.
 */

var stripOuterClipGraphEdges = function (graph, clipPolygon, epsilon) {
  var edgeComparator = function (edgeA, edgeB) {
    return (edgeA.i === edgeB.i && edgeA.j === edgeB.j) || (edgeA.i === edgeB.j && edgeA.j === edgeB.i);
  };
  var edgeAsLine = new Line(new Vertex(), new Vertex());
  var newEdges = new ArraySet(edgeComparator);
  var outerVertices = new ArraySet();
  for (var e = 0; e < graph.edges.length; e++) {
    var edge = graph.edges[e];
    var vertA = graph.vertices[edge.i];
    var vertB = graph.vertices[edge.j];
    edgeAsLine.a.set(vertA);
    edgeAsLine.b.set(vertB);
    var keepEdge = true;
    for (var i = 0; i < clipPolygon.vertices.length; i++) {
      var polygonPoint = clipPolygon.vertices[i];
      if (edgeAsLine.hasPoint(polygonPoint, true)) {
        // Strip this edge from the result (will not be re-added).
        keepEdge = false;
        if (findInVertexArray(clipPolygon.vertices, edgeAsLine.a, epsilon) === -1) {
          outerVertices.add(edge.i);
        }
        if (findInVertexArray(clipPolygon.vertices, edgeAsLine.b, epsilon) === -1) {
          outerVertices.add(edge.j);
        }
      }
    }
    if (keepEdge) {
      newEdges.add(edge);
    }
  }
  graph.edges = newEdges;
  return outerVertices;
};
