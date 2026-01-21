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
export declare const polygonTesselationToGraph: (polygons: Polygon[]) => TesselationGraph;
export declare class PolygonTesselationOutlines {
    static readonly DEFAULT_TOLERANCE = 0.01;
    private readonly polygons;
    private readonly tolerance;
    private readonly removeUnusedVertices;
    constructor(polygons: Polygon[], options?: PolygonTesselationOutlinesOptions);
    private eliminateDuplicateEdges;
    private locateEdgeWithVertIndex;
    private __removeUnusedVertices;
    findAllOutlinesGraph(): TesselationGraph;
    private __convertGenericPathToPolygon;
    findAllOutlinesPolygons(tesselationGraph: TesselationGraph): Array<Polygon>;
    private isEqualPoint;
    private isEqualEdge;
}
