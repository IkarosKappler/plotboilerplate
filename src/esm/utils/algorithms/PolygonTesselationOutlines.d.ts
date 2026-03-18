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
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";
import { IndexPair } from "../datastructures/interfaces";
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
export declare const polygonTesselationToGraph: (polygons: Polygon[]) => TesselationGraph;
/**
 * A class to calculate the tesselation's outer hull.
 */
export declare class PolygonTesselationOutlines {
    static readonly DEFAULT_TOLERANCE = 0.01;
    private readonly polygons;
    private readonly tolerance;
    private readonly removeUnusedVertices;
    /**
     * @constructor
     * @param {Polygon[]} polygons - The polygon tesselation to use.
     * @param {PolygonTesselationOutlinesOptions} options - (optional)
     */
    constructor(polygons: Polygon[], options?: PolygonTesselationOutlinesOptions);
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
    private __eliminateDuplicateEdges;
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
    private __locateEdgeWithVertIndex;
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
    private __removeUnusedVertices;
    /**
     * Creates a tesselation graph and removes all inner edges.
     *
     * @name findAllOutlinesGraph
     * @private
     * @memberof PolygonTesselationOutlines
     * @instance
     * @return {TesselationGraph} A tesselation graph containing the outer hull edges only.
     */
    findAllOutlinesGraph(): TesselationGraph;
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
    private __convertGenericPathToPolygon;
    /**
     * Creates a tesselation graph and removes all inner edges.
     *
     * @name findAllOutlinesPolygons
     * @private
     * @memberof PolygonTesselationOutlines
     * @instance
     * @param {TesselationGraph} tesselationGraph - Find all outlines on the tesselation graph.
     */
    findAllOutlinesPolygons(tesselationGraph: TesselationGraph): Array<Polygon>;
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
    private __isEqualPoint;
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
    private __isEqualEdge;
}
