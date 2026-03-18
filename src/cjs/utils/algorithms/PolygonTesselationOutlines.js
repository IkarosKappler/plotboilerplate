"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonTesselationOutlines = exports.polygonTesselationToGraph = void 0;
var Line_1 = require("../../Line");
var Polygon_1 = require("../../Polygon");
var arrayFill_1 = require("./arrayFill");
var detectPaths_1 = require("./detectPaths");
/**
 * Convert any non-intersecting tesselation to a graph.
 * Adjadent tiles (polygons) will result in duplicate edges.
 *
 * @param {Polygon[]} polygons - The polygon tesselation to use.
 * @return {TesselationGraph} A tesselation graph.
 */
var polygonTesselationToGraph = function (polygons) {
    var vertices = [];
    var edges = [];
    // const vertexPolygonMapping: Array<number>[] = []; // Map polygon+vertex to graph vertices
    for (var i = 0; i < polygons.length; i++) {
        var polygon = polygons[i];
        var polygonMapping = [];
        // vertexPolygonMapping.push(polygonMapping);
        // Add vertices
        for (var j = 0; j < polygon.vertices.length; j++) {
            var graphVertIndex = vertices.length;
            vertices.push(polygon.vertices[j]);
            polygonMapping.push(graphVertIndex);
        }
        // Now add edges
        for (var j = 0; j < polygon.vertices.length; j++) {
            var polyEdgeIndexA = j;
            var polyEdgeIndexB = (j + 1) % polygon.vertices.length;
            var grapgVertIndexA = polygonMapping[polyEdgeIndexA];
            var grapgVertIndexB = polygonMapping[polyEdgeIndexB];
            edges.push({ i: grapgVertIndexA, j: grapgVertIndexB });
        }
    }
    return { vertices: vertices, edges: edges };
};
exports.polygonTesselationToGraph = polygonTesselationToGraph;
/**
 * A class to calculate the tesselation's outer hull.
 */
var PolygonTesselationOutlines = /** @class */ (function () {
    /**
     * @constructor
     * @param {Polygon[]} polygons - The polygon tesselation to use.
     * @param {PolygonTesselationOutlinesOptions} options - (optional)
     */
    function PolygonTesselationOutlines(polygons, options) {
        var _a, _b;
        this.polygons = polygons;
        // this.tesselationGraph = tesselationToGraph(polygons);
        this.tolerance = (_a = options === null || options === void 0 ? void 0 : options.tolerance) !== null && _a !== void 0 ? _a : PolygonTesselationOutlines.DEFAULT_TOLERANCE;
        this.removeUnusedVertices = (_b = options === null || options === void 0 ? void 0 : options.removeUnusedVertices) !== null && _b !== void 0 ? _b : true;
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
    PolygonTesselationOutlines.prototype.__eliminateDuplicateEdges = function (tesselationGraph) {
        var newEdges = [];
        for (var e = 0; e < tesselationGraph.edges.length; e++) {
            var curEdge = tesselationGraph.edges[e];
            if (!curEdge) {
                continue;
            }
            var curA = tesselationGraph.vertices[curEdge.i];
            var curB = tesselationGraph.vertices[curEdge.j];
            for (var f = 0; f < tesselationGraph.edges.length; f++) {
                if (e === f) {
                    continue;
                }
                var otherEdge = tesselationGraph.edges[f];
                if (!otherEdge) {
                    continue;
                }
                var otherA = tesselationGraph.vertices[otherEdge.i];
                var otherB = tesselationGraph.vertices[otherEdge.j];
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
            edges: tesselationGraph.edges.filter(function (edge) { return edge != null; })
        }; // TODO: create clean clone with new mapping
    };
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
    PolygonTesselationOutlines.prototype.__locateEdgeWithVertIndex = function (vertIndex, tesselationGraph) {
        return tesselationGraph.edges.findIndex(function (edge) { return edge.i == vertIndex || edge.j == vertIndex; });
    };
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
    PolygonTesselationOutlines.prototype.__removeUnusedVertices = function (tesselationGraph) {
        // First remove un-used vertices and re-map indices.
        var newVertices = [];
        var indexMapping = (0, arrayFill_1.arrayFill)(tesselationGraph.vertices.length, -1);
        for (var j = 0; j < tesselationGraph.vertices.length; j++) {
            var edgeIndex = this.__locateEdgeWithVertIndex(j, tesselationGraph);
            if (edgeIndex === -1) {
                // No adjacent edge found -> vertex is not in use
                // Ignore; index mapping remains to -1
            }
            else {
                // Keep vertex
                var newIndex = newVertices.length;
                newVertices.push(tesselationGraph.vertices[j]);
                indexMapping[j] = newIndex;
            }
        }
        // Now re-map the egdes
        var newEdges = [];
        for (var j = 0; j < tesselationGraph.edges.length; j++) {
            var edge = tesselationGraph.edges[j];
            newEdges.push({ i: indexMapping[edge.i], j: indexMapping[edge.j] });
        }
        return { vertices: newVertices, edges: newEdges };
    };
    /**
     * Creates a tesselation graph and removes all inner edges.
     *
     * @name findAllOutlinesGraph
     * @private
     * @memberof PolygonTesselationOutlines
     * @instance
     * @return {TesselationGraph} A tesselation graph containing the outer hull edges only.
     */
    PolygonTesselationOutlines.prototype.findAllOutlinesGraph = function () {
        // First build tesselation graph from polygons, containing all edges and vertices.
        var tesselationGraph = (0, exports.polygonTesselationToGraph)(this.polygons);
        // Now eliminate all duplicate edges. By construction only inner edges are duplicates.
        var outerHull = this.__eliminateDuplicateEdges(tesselationGraph);
        // Only of requested remove unused vertices.
        if (this.removeUnusedVertices) {
            var cleanOuterHull = this.__removeUnusedVertices(outerHull);
            return cleanOuterHull;
        }
        else {
            return outerHull;
        }
    };
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
    PolygonTesselationOutlines.prototype.__convertGenericPathToPolygon = function (path) {
        var vertices = [];
        var n = path.getSegmentCount();
        var isOpen = false;
        for (var i = 0; i < n; i++) {
            var segment = path.getSegmentAt(i);
            vertices.push(segment.getStartPoint());
            if (i > 0 && i + 1 >= n && !this.__isEqualPoint(segment.getEndPoint(), vertices[0])) {
                isOpen = true;
            }
        }
        return new Polygon_1.Polygon(vertices, isOpen);
    };
    /**
     * Creates a tesselation graph and removes all inner edges.
     *
     * @name findAllOutlinesPolygons
     * @private
     * @memberof PolygonTesselationOutlines
     * @instance
     * @param {TesselationGraph} tesselationGraph - Find all outlines on the tesselation graph.
     */
    PolygonTesselationOutlines.prototype.findAllOutlinesPolygons = function (tesselationGraph) {
        var _this = this;
        // Convert to real line segments:
        var lineSegments = tesselationGraph.edges.map(function (edge) { return new Line_1.Line(tesselationGraph.vertices[edge.i], tesselationGraph.vertices[edge.j]); });
        // Now run the path detection.
        var paths = (0, detectPaths_1.detectPaths)(lineSegments, this.tolerance);
        // And now convert the generic paths back to polygons
        // (we have put in line segments, so line segments must have returned)
        return paths.map(function (path) { return _this.__convertGenericPathToPolygon(path); });
    };
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
    PolygonTesselationOutlines.prototype.__isEqualPoint = function (vertA, vertB) {
        return vertA.distance(vertB) < this.tolerance;
    };
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
    PolygonTesselationOutlines.prototype.__isEqualEdge = function (edgeAvertA, edgeAvertB, edgeBvertA, edgeBvertB) {
        return ((this.__isEqualPoint(edgeAvertA, edgeBvertA) && this.__isEqualPoint(edgeAvertB, edgeBvertB)) ||
            (this.__isEqualPoint(edgeAvertA, edgeBvertB) && this.__isEqualPoint(edgeAvertB, edgeBvertA)));
    };
    PolygonTesselationOutlines.DEFAULT_TOLERANCE = 0.01;
    return PolygonTesselationOutlines;
}());
exports.PolygonTesselationOutlines = PolygonTesselationOutlines;
//# sourceMappingURL=PolygonTesselationOutlines.js.map