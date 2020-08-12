"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Line_1 = require("../../Line");
var Polygon_1 = require("../../Polygon");
var Vertex_1 = require("../../Vertex");
var VoronoiCell = /** @class */ (function () {
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
    function VoronoiCell(triangles, sharedVertex) {
        if (typeof triangles === 'undefined')
            triangles = [];
        if (typeof sharedVertex === 'undefined')
            sharedVertex = new Vertex_1.Vertex(0, 0);
        this.triangles = triangles;
        this.sharedVertex = sharedVertex;
    }
    ;
    /**
     * Check if the first and the last triangle in the path are NOT connected.
     *
     * @method isOpen
     * @instance
     * @memberof VoronoiCell
     * @return {boolean}
     **/
    VoronoiCell.prototype.isOpen = function () {
        // There must be at least three triangles
        return this.triangles.length < 3 || !this.triangles[0].isAdjacent(this.triangles[this.triangles.length - 1]);
    };
    ;
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
    VoronoiCell.prototype.toPolygon = function () {
        return new Polygon_1.Polygon(this.toPathArray(), this.isOpen());
    };
    ;
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
    VoronoiCell.prototype.toPathSVGString = function () {
        if (this.triangles.length == 0)
            return "";
        var arr = this.toPathArray();
        return arr.map(function (vert) { return '' + vert.x + ',' + vert.y; }).join(' ');
    };
    ;
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
    VoronoiCell.prototype.toPathArray = function () {
        if (this.triangles.length == 0)
            return [];
        if (this.triangles.length == 1)
            return [this.triangles[0].getCircumcircle().center];
        var arr = [];
        // Working for path begin
        if (false && this.isOpen())
            arr.push(VoronoiCell._calcOpenEdgePoint(this.triangles[0], this.triangles[1], this.sharedVertex));
        for (var t = 0; t < this.triangles.length; t++) {
            var cc = this.triangles[t].getCircumcircle();
            arr.push(cc.center);
        }
        // Urgh, this is not working right now.
        /* if( false && this.isOpen() )
            arr.push( VoronoiCell._calcOpenEdgePoint( this.triangles[ this.triangles.length-1 ], this.triangles[ this.triangles.length-2 ], this.sharedVertex ) );
        */
        return arr;
    };
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
    VoronoiCell._calcOpenEdgePoint = function (tri, neigh, sharedVertex) {
        var center = tri.getCircumcircle().center;
        // Find non-adjacent edge (=outer edge)
        var edgePoint = VoronoiCell._findOuterEdgePoint(tri, neigh, sharedVertex);
        // const perpendicular : Vertex = VoronoiCell._perpendicularLinePoint( sharedVertex, edgePoint, center );
        var perpendicular = new Line_1.Line(sharedVertex, edgePoint).getClosestPoint(center);
        // It is not necesary to make a difference on the determinant here
        var openEdgePoint = new Vertex_1.Vertex(perpendicular.x + (center.x - perpendicular.x) * 1000, perpendicular.y + (center.y - perpendicular.y) * 1000);
        return openEdgePoint;
    };
    ;
    /**
     * A helper function.
     *
     * Find the outer (not adjacent) vertex in triangle 'tri' which has triangle 'neighbour'.
     *
     * This function is used to determine outer hull points.
     *
     * @return {Vertex}
     **/
    VoronoiCell._findOuterEdgePoint = function (tri, neighbour, sharedVertex) {
        if (tri.a.equals(sharedVertex)) {
            if (neighbour.a.equals(tri.b) || neighbour.b.equals(tri.b) || neighbour.c.equals(tri.b))
                return tri.c;
            else
                return tri.b;
        }
        if (tri.b.equals(sharedVertex)) {
            if (neighbour.a.equals(tri.a) || neighbour.b.equals(tri.a) || neighbour.c.equals(tri.a))
                return tri.c;
            else
                return tri.a;
        }
        // Here:
        //    tri.c.equals(sharedVertex) 
        if (neighbour.a.equals(tri.a) || neighbour.b.equals(tri.a) || neighbour.c.equals(tri.a))
            return tri.b;
        else
            return tri.a;
    };
    ;
    return VoronoiCell;
}());
exports.VoronoiCell = VoronoiCell;
//# sourceMappingURL=VoronoiCell.js.map