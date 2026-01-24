/**
 * Find the outer hull outlines of a (not necessarily full connected) polygon tesellation.
 *
 * The method `findAllOutlinesGraph` will return a simple graph containing all vertices and edges
 * that belong to the outer hull.
 *
 * The method `findAllOutlinesPolygons` will detect connected paths inside the graph and return
 * an array of Polygons.
 *
 *
 * @require detectPaths
 *
 * @author  Ikaros Kappler
 * @date    2026-01-20
 * @version 1.0.0
 */

import { Line } from "../../Line";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";
import { PathSegment, XYCoords } from "../../interfaces";
import { GenericPath } from "../datastructures/GenericPath";
import { IndexPair } from "../datastructures/interfaces";
import { arrayFill } from "./arrayFill";
import { detectPaths } from "./detectPaths";

export interface PolygonTesselationOutlinesOptions {
  tolerance?: number;
  removeUnusedVertices?: boolean;
}

export interface TesselationGraph {
  vertices: Array<Vertex>;
  edges: Array<IndexPair>;
}

/**
 * Convert any non-intersecting tesselation to a graph.
 * Adjadent tiles (polygons) will result in duplicate edges.
 *
 * @param {Polygon[]} polygons - The polygon tesselation to use.
 * @return {TesselationGraph} A tesselation graph.
 */
export const polygonTesselationToGraph = (polygons: Polygon[]): TesselationGraph => {
  const vertices: Array<Vertex> = [];
  const edges: Array<IndexPair> = [];
  // const vertexPolygonMapping: Array<number>[] = []; // Map polygon+vertex to graph vertices
  for (var i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];
    const polygonMapping: Array<number> = [];
    // vertexPolygonMapping.push(polygonMapping);
    // Add vertices
    for (var j = 0; j < polygon.vertices.length; j++) {
      const graphVertIndex = vertices.length;
      vertices.push(polygon.vertices[j]);
      polygonMapping.push(graphVertIndex);
    }
    // Now add edges
    for (var j = 0; j < polygon.vertices.length; j++) {
      const polyEdgeIndexA = j;
      const polyEdgeIndexB = (j + 1) % polygon.vertices.length;
      const grapgVertIndexA = polygonMapping[polyEdgeIndexA];
      const grapgVertIndexB = polygonMapping[polyEdgeIndexB];
      edges.push({ i: grapgVertIndexA, j: grapgVertIndexB });
    }
  }
  return { vertices, edges };
};

/**
 * A class to calculate the tesselation's outer hull.
 */
export class PolygonTesselationOutlines {
  public static readonly DEFAULT_TOLERANCE = 0.01;

  private readonly polygons: Polygon[];
  // private readonly tesselationGraph: TesselationGraph;
  private readonly tolerance: number;
  private readonly removeUnusedVertices: boolean;

  /**
   * @constructor
   * @param {Polygon[]} polygons - The polygon tesselation to use.
   * @param {PolygonTesselationOutlinesOptions} options - (optional)
   */
  constructor(polygons: Polygon[], options?: PolygonTesselationOutlinesOptions) {
    this.polygons = polygons;
    // this.tesselationGraph = tesselationToGraph(polygons);
    this.tolerance = options?.tolerance ?? PolygonTesselationOutlines.DEFAULT_TOLERANCE;
    this.removeUnusedVertices = options?.removeUnusedVertices ?? true;
  }

  /**
   * Clears duplicate edges.
   *
   * Note: this works only for duplicates. Triplets will not be removed.
   *
   * @name __eliminateDuplicateEdges
   * @private
   * @memberof TesselationGraph
   * @instance
   * @param {TesselationGraph} tesselationGraph - The tesselation graph to remove duplicate edges from.
   * @return {TesselationGraph} A new tesselation graph with cleaned up edges.
   */
  private __eliminateDuplicateEdges(tesselationGraph: TesselationGraph): TesselationGraph {
    const newEdges: Array<IndexPair> = [];
    for (var e = 0; e < tesselationGraph.edges.length; e++) {
      const curEdge: IndexPair = tesselationGraph.edges[e];
      if (!curEdge) {
        continue;
      }
      const curA: Vertex = tesselationGraph.vertices[curEdge.i];
      const curB: Vertex = tesselationGraph.vertices[curEdge.j];
      for (var f = 0; f < tesselationGraph.edges.length; f++) {
        if (e === f) {
          continue;
        }
        const otherEdge: IndexPair = tesselationGraph.edges[f];
        if (!otherEdge) {
          continue;
        }
        const otherA: Vertex = tesselationGraph.vertices[otherEdge.i];
        const otherB: Vertex = tesselationGraph.vertices[otherEdge.j];
        if (this.__isEqualEdge(curA, curB, otherA, otherB)) {
          // Both edges are equal -> remove both
          tesselationGraph.edges[e] = null;
          tesselationGraph.edges[f] = null;
        }
      }
    }
    // return tesselationGraph; // TODO: create clean clone with new mapping
    // Clear null-records.
    return {
      vertices: tesselationGraph.vertices,
      edges: tesselationGraph.edges.filter((edge: IndexPair) => edge != null)
    }; // TODO: create clean clone with new mapping
  }

  /**
   * Locate some edge that adjacent to the given vertex index
   *
   * @name __locateEdgeWithVertIndex
   * @private
   * @memberof TesselationGraph
   * @instance
   * @param {number} vertIndex - The vertex index to find an edge for.
   * @param {TesselationGraph} tesselationGraph - The tesselation graph to remove unused vertices from.
   * @return {number} The edge index that's adjacent to the given vertex index.
   * @return -1 if no such edge is found.
   */
  private __locateEdgeWithVertIndex(vertIndex: number, tesselationGraph: TesselationGraph): number {
    return tesselationGraph.edges.findIndex((edge: IndexPair) => edge.i == vertIndex || edge.j == vertIndex);
  }

  /**
   * Removes all unused vertices from the graph and re-matps the edges.
   *
   * @name __removeUnusedVertices
   * @private
   * @memberof TesselationGraph
   * @instance
   * @param {TesselationGraph} tesselationGraph - The tesselation graph to remove unused vertices from.
   * @return {TesselationGraph} A new tesselation graph.
   */
  private __removeUnusedVertices(tesselationGraph: TesselationGraph): TesselationGraph {
    // First remove un-used vertices and re-map indices.
    const newVertices: Array<Vertex> = [];
    const indexMapping: Array<number> = arrayFill(tesselationGraph.vertices.length, -1);
    for (var j = 0; j < tesselationGraph.vertices.length; j++) {
      const edgeIndex: number = this.__locateEdgeWithVertIndex(j, tesselationGraph);
      if (edgeIndex === -1) {
        // No adjacent edge found -> vertex is not in use
        // Ignore; index mapping remains to -1
      } else {
        // Keep vertex
        const newIndex: number = newVertices.length;
        newVertices.push(tesselationGraph.vertices[j]);
        indexMapping[j] = newIndex;
      }
    }

    // Now re-map the egdes
    const newEdges: Array<IndexPair> = [];
    for (var j = 0; j < tesselationGraph.edges.length; j++) {
      const edge = tesselationGraph.edges[j];
      newEdges.push({ i: indexMapping[edge.i], j: indexMapping[edge.j] });
    }
    return { vertices: newVertices, edges: newEdges };
  }

  /**
   * Creates a tesselation graph and removes all inner edges.
   *
   * @name findAllOutlinesGraph
   * @private
   * @memberof PolygonTesselationOutlines
   * @instance
   * @return {TesselationGraph} A tesselation graph containing the outer hull edges only.
   */
  findAllOutlinesGraph(): TesselationGraph {
    // First build tesselation graph from polygons, containing all edges and vertices.
    const tesselationGraph: TesselationGraph = polygonTesselationToGraph(this.polygons);

    // Now eliminate all duplicate edges. By construction only inner edges are duplicates.
    const outerHull = this.__eliminateDuplicateEdges(tesselationGraph);
    // Only of requested remove unused vertices.
    if (this.removeUnusedVertices) {
      const cleanOuterHull = this.__removeUnusedVertices(outerHull);
      return cleanOuterHull;
    } else {
      return outerHull;
    }
  }

  /**
   * Convert any generic path to a polygon. Each path segment (start point and end point)
   * are interpreted as a linear segment here.
   *
   * @name __convertGenericPathToPolygon
   * @private
   * @memberof PolygonTesselationOutlines
   * @instance
   * @param {GenericPath} path - The path to convert.
   */
  private __convertGenericPathToPolygon(path: GenericPath): Polygon {
    const vertices: Array<Vertex> = [];
    const n: number = path.getSegmentCount();
    let isOpen: boolean = false;
    for (var i = 0; i < n; i++) {
      const segment: PathSegment = path.getSegmentAt(i);
      vertices.push(segment.getStartPoint());
      if (i > 0 && i + 1 >= n && !this.__isEqualPoint(segment.getEndPoint(), vertices[0])) {
        isOpen = true;
      }
    }
    return new Polygon(vertices, isOpen);
  }

  /**
   * Creates a tesselation graph and removes all inner edges.
   *
   * @name findAllOutlinesPolygons
   * @private
   * @memberof PolygonTesselationOutlines
   * @instance
   * @param {TesselationGraph} tesselationGraph - Find all outlines on the tesselation graph.
   */
  findAllOutlinesPolygons(tesselationGraph: TesselationGraph): Array<Polygon> {
    // Convert to real line segments:
    const lineSegments: Array<Line> = tesselationGraph.edges.map(
      (edge: IndexPair) => new Line(tesselationGraph.vertices[edge.i], tesselationGraph.vertices[edge.j])
    );
    // Now run the path detection.
    const paths: Array<GenericPath> = detectPaths(lineSegments, this.tolerance);

    // And now convert the generic paths back to polygons
    // (we have put in line segments, so line segments must have returned)
    return paths.map((path: GenericPath) => this.__convertGenericPathToPolygon(path));
  }

  /**
   * Checks if two vertices are equal – regarding to the current tolerance setting.
   *
   * @name __isEqualPoint
   * @private
   * @memberof PolygonTesselationOutlines
   * @instance
   * @param {boolean} vertA - The first point.
   * @param {boolean} vertB - The second point.
   * @return True if the vertices are equal.
   */
  private __isEqualPoint(vertA: Vertex, vertB: Vertex): boolean {
    return vertA.distance(vertB) < this.tolerance;
  }

  /**
   * Checks if two edges (identified as two pairs of vertices) are equal – regarding to the
   * current tolerance setting.
   *
   * @name __isEqualEdge
   * @private
   * @memberof PolygonTesselationOutlines
   * @instance
   * @param {boolean} edgeAvertA - The first edge's point A.
   * @param {boolean} edgeAvertB - The first edge's point B.
   * @param {boolean} edgeBvertA - The second edge's point A.
   * @param {boolean} edgeBvertB - The second edge's point B.
   * @return True if the edges are equal.
   */
  private __isEqualEdge(edgeAvertA: Vertex, edgeAvertB: Vertex, edgeBvertA: Vertex, edgeBvertB: Vertex): boolean {
    return (
      (this.__isEqualPoint(edgeAvertA, edgeBvertA) && this.__isEqualPoint(edgeAvertB, edgeBvertB)) ||
      (this.__isEqualPoint(edgeAvertA, edgeBvertB) && this.__isEqualPoint(edgeAvertB, edgeBvertA))
    );
  }
}
