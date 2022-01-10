"use strict";
/**
 * Create a graph from a Voronoi decomposition.
 *
 * Converts cells into edges.
 *
 * @requires Graph
 *
 * @author Ikaros Kappler
 * @date   2021-12-16
 * @version 1.0.0
 */

globalThis.voronoi2graph = (function () {
  /**
   *
   * @param {Polygon[]} vornoiCells - The Voronoi diagram's cells, as Polygons.
   * @param {number} epsilon - An epsilon to use to tell if two vertices are considered 'equal'.
   * @param {function} computeEdgeWeight - function(graph,i,j) => number
   * @returns {{ edges: Array<Edge>, vertices: Array<Vertex> }}
   */
  var v2g = function (voronoiCells, epsilon, computeEdgeWeight) {
    // Array<Vertex>
    var vertices = new ArraySet(function (vertA, vertB) {
      return vertA.distance(vertB) < epsilon;
    });
    // Array<{ i:number, j:number}>
    var edges = new ArraySet(function (edgeA, edgeB) {
      return (edgeA.i === edgeB.i && edgeA.j === edgeB.j) || (edgeA.i === edgeB.j && edgeA.j === edgeB.i);
    });

    for (var c in voronoiCells) {
      var cell = voronoiCells[c];

      // For each cell vertex:
      //  - put into vertex array (if not yet exists)
      //  - remember location (index)
      var cellVertices = cell.vertices;
      var vertIndexA = -1;
      for (var v = 0; v < cellVertices.length; v++) {
        var vertA = cellVertices[v];
        var vertB = cellVertices[(v + 1) % cellVertices.length];
        if (v === 0) {
          vertIndexA = vertices.add(vertA);
        }
        var vertIndexB = vertices.add(vertB);
        var edge = { i: vertIndexA, j: vertIndexB };
        edges.add(edge);
        vertIndexA = vertIndexB;
      }
    }
    // { edges: edges, vertices: vertices };
    return new Graph(vertices, edges, computeEdgeWeight);
  };

  return v2g;
})();
