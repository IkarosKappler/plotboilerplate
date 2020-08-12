/**
 * @classdesc A simple voronoi cell (part of a voronoi diagram), stored as an array of
 * adjacent triangles.
 *
 * @requires Triangle
 * @requires Polygon
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-04-11
 * @modified 2018-05-04 Added the 'sharedVertex' param to the constructor. Extended open cells into 'infinity'.
 * @modified 2019-10-25 Fixed a serious bug in the toPathArray function; cell with only one vertex (extreme cases) returned invalid arrays which broke the rendering.
 * @modified 2019-12-09 Removed an unnecesary if-condition from the _calculateOpenEdgePoint(...) helper function.
 * @modified 2020-05-18 Added function VoronoiCell.toPolygon().
 * @modified 2020-08-12 Ported this class from vanilla JS to TypeScript.
 * @version  1.1.1
 *
 * @file VoronoiCell
 * @public
 **/
import { Polygon } from "../../Polygon";
import { Triangle } from "../../Triangle";
import { Vertex } from "../../Vertex";
export declare class VoronoiCell {
    /**
     * @member {Array<Triangle>} triangles
     * @memberof VoronoiCell
     * @type {Array<Triangle>}
     * @instance
     */
    private triangles;
    /**
     * @member {Vertex} sharedVertex
     * @memberof VoronoiCell
     * @type {Vertex}
     * @instance
     */
    private sharedVertex;
    /**
     * The constructor.
     *
     * @constructor
     * @name VoronoiCell
     * @param {Triangle[]} triangles    The passed triangle array must contain an ordered sequence of
     *                                  adjacent triangles.
     * @param {Vertex}     sharedVertex This is the 'center' of the voronoi cell; all triangles must share
     *                                  that vertex.
     **/
    constructor(triangles: Array<Triangle>, sharedVertex: Vertex);
    /**
     * Check if the first and the last triangle in the path are NOT connected.
     *
     * @method isOpen
     * @instance
     * @memberof VoronoiCell
     * @return {boolean}
     **/
    isOpen(): boolean;
    /**
     * Convert this Voronoi cell to a path polygon, consisting of all Voronoi cell corner points.
     *
     * Note that open Voronoi cell cannot properly converted to Polygons as they are considered
     * infinite. 'Open' Voronoi edges will be cut off at their innermose vertices.
     *
     * @method toPolygon
     * @instance
     * @memberof VoronoiCell
     * @return {Polygon}
     **/
    toPolygon(): Polygon;
    /**
     * Convert the voronoi cell path data to an SVG polygon data string.
     *
     * "x0,y0 x1,y1 x2,y2 ..."
     *
     * @method toPathSVGString
     * @instance
     * @memberof VoronoiCell
     * @return {string}
     **/
    toPathSVGString(): string;
    /**
     * Convert the voronoi cell path data to an array.
     *
     * [vertex0, vertex1, vertex2, ... ]
     *
     * @method toPathArray
     * @instance
     * @memberof VoronoiCell
     * @return {Vertex[]}
     **/
    toPathArray(): Array<Vertex>;
    /**
     * A helper function.
     *
     * Calculate the 'infinite' open edge point based on the open path triangle
     * 'tri' and its neighbour 'neigh'.
     *
     * This function is used to determine outer hull points.
     *
     * @method _calcOpenEdhePoint
     * @private
     * @static
     * @instance
     * @memberof VoronoiCell
     * @return {Vertex}
     **/
    private static _calcOpenEdgePoint;
    /**
     * A helper function.
     *
     * Find the outer (not adjacent) vertex in triangle 'tri' which has triangle 'neighbour'.
     *
     * This function is used to determine outer hull points.
     *
     * @return {Vertex}
     **/
    private static _findOuterEdgePoint;
}
