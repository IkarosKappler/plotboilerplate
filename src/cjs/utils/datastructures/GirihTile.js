"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2013-11-27
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-30 Refactored the this super class to work with PlotBoilerplate.
 * @modified 2020-11-11 Ported the class from vanilla JS to TypeScript.
 * @version  2.0.1-alpha
 * @name GirihTile
 **/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GirihTile = exports.TileType = void 0;
var Bounds_1 = require("../../Bounds");
var Line_1 = require("../../Line");
var Polygon_1 = require("../../Polygon");
var Vertex_1 = require("../../Vertex");
var TileType;
(function (TileType) {
    TileType["UNKNOWN"] = "UNKNOWN";
    TileType["DECAGON"] = "DECAGON";
    TileType["PENTAGON"] = "PENTAGON";
    TileType["IRREGULAR_HEXAGON"] = "IRREGULAR_HEXAGON";
    TileType["RHOMBUS"] = "RHOMBUS";
    TileType["BOW_TIE"] = "BOW_TIE";
    // This is not part of the actual girih tile set!
    TileType["PENROSE_RHOMBUS"] = "PENROSE_RHOMBUS";
})(TileType = exports.TileType || (exports.TileType = {}));
/**
 * @classdesc This is a general tile superclass. All other tile classes extends this one.
 *
 * Rule:
 *  * the outer and the inner sub polygons must be inside the main polygon's bounds.
 *
 * @requires Bounds
 * @requires Polyon
 * @requires Vertex
 * @requires XYCoords
 */
var GirihTile = /** @class */ (function (_super) {
    __extends(GirihTile, _super);
    /**
     * @constructor
     * @memberof GirihTile
     * @abstract class
     * @param {Vertex} position   - The position of the tile.
     * @param {number} edgeLength - The edge length (default is GirihTile.DEFAULT_EDGE_LENGTH).
     * @param {TileType} tileType - One of `TileType.*` enum members.
     **/
    function GirihTile(position, edgeLength, tileType) {
        var _this = _super.call(this, [], false) || this;
        if (typeof edgeLength === "undefined")
            edgeLength = GirihTile.DEFAULT_EDGE_LENGTH;
        if (typeof tileType == "undefined")
            tileType = TileType.UNKNOWN;
        _this.edgeLength = edgeLength;
        _this.position = position;
        _this.rotation = 0.0; // angle;
        _this.symmetry = 10;
        _this.uniqueSymmetries = 10;
        // An array of polygons.
        // The inner tile polygons are those that do not share edges with the outer
        // tile bounds (vertices are OK).
        _this.innerTilePolygons = [];
        // A second array of polygons.
        // The outer tile polygons are those that make up the whole tile area
        // _together with the inner tile polygons (!)_; the union of the
        // inner tile polygons and the outer tile polygons covers exactly
        // the whole tile polygon.
        // The intersection of both sets is empty.
        // Outer tile polygon share at least one (partial) edge with the complete
        // tile polygon (length > 0).
        _this.outerTilePolygons = [];
        // this.imageProperties      = null;
        _this.textureSource = new Bounds_1.Bounds(new Vertex_1.Vertex(), new Vertex_1.Vertex());
        _this.tileType = tileType;
        return _this;
    }
    /**
     * Move this tile around (together will all inner polygons).
     * As this function overrides Polygon.move(...), the returned
     * instance (this) must be of type `Polygon`.
     *
     * @name move
     * @instance
     * @override
     * @memberof GirihTile
     * @param {XYCoords} amount
     * @return {Polygon} this
     */
    GirihTile.prototype.move = function (amount) {
        _super.prototype.move.call(this, amount);
        for (var i in this.innerTilePolygons)
            this.innerTilePolygons[i].move(amount);
        for (var i in this.outerTilePolygons)
            this.outerTilePolygons[i].move(amount);
        this.position.add(amount);
        return this;
    };
    /**
     * Find the adjacent tile (given by the template tile)
     * Note that the tile itself will be modified (rotated and moved to the correct position).
     *
     * @name findAdjacentTilePosition
     * @memberof GirihTile
     * @instance
     * @param {number} edgeIndex - The edge number of the you you want to find adjacency for.
     * @param {Polygon} tile - The polygon (or tile) you want to find adjacency for at the specified edge.
     * @return {IAdjacency|null} Adjacency information or null if the passed tile does not match.
     */
    GirihTile.prototype.findAdjacentTilePosition = function (edgeIndex, tile) {
        var edgeA = new Line_1.Line(this.vertices[edgeIndex % this.vertices.length], this.vertices[(edgeIndex + 1) % this.vertices.length]);
        // Find adjacent edge
        for (var i = 0; i < tile.vertices.length; i++) {
            var edgeB = new Line_1.Line(tile.vertices[i % tile.vertices.length].clone(), tile.vertices[(i + 1) % tile.vertices.length].clone());
            // Goal: edgeA.a==edgeB.b && edgeA.b==edgeB.a
            // So move edgeB
            var offset = edgeB.b.difference(edgeA.a);
            edgeB.add(offset);
            if (edgeB.a.distance(edgeA.b) < GirihTile.epsilon) {
                return { edgeIndex: i, offset: offset };
            }
        }
        return null;
    };
    /**
     * Find all possible adjacent tile positions (and rotations) for `neighbourTile`.
     *
     * @name transformTileToAdjacencies
     * @memberof GirihTile
     * @instance
     * @param {number} baseEdgeIndex - The edge number of the you you want to find adjacencies for.
     * @param {GirihTile} neighbourTile - The polygon (or tile) you want to find adjacencies for at the specified edge.
     * @return {IAdjacency|null} Adjacency information or null if the passed tile does not match.
     */
    GirihTile.prototype.transformTileToAdjacencies = function (baseEdgeIndex, neighbourTile) {
        // Find a rotation for that tile to match
        var i = 0;
        var foundAlignments = [];
        var positionedTile = null;
        while (i < neighbourTile.uniqueSymmetries) {
            positionedTile = this.transformTilePositionToAdjacency(baseEdgeIndex, neighbourTile);
            if (positionedTile != null) {
                positionedTile = positionedTile.clone();
                foundAlignments.push(positionedTile);
            }
            neighbourTile.rotate((Math.PI * 2) / neighbourTile.symmetry);
            i++;
        }
        return foundAlignments;
    };
    /**
     * Apply adjacent tile position to `neighbourTile`.
     *
     * @name transformTilePositionToAdjacencies
     * @memberof GirihTile
     * @instance
     * @param {number} baseEdgeIndex - The edge number of the you you want to apply adjacent position for.
     * @param {Polygon} neighbourTile - The polygon (or tile) you want to find adjacency for at the specified edge.
     * @return {Polygon|null} the passed tile itself if adjacency was found, null otherwise.
     */
    GirihTile.prototype.transformTilePositionToAdjacency = function (baseEdgeIndex, neighbourTile) {
        // Find the position for that tile to match (might not exist)
        // { edgeIndex:number, offset:XYCoords }
        var adjacency = this.findAdjacentTilePosition(baseEdgeIndex, neighbourTile);
        if (adjacency != null) {
            neighbourTile.move(adjacency.offset);
            return neighbourTile;
        }
        return null;
    };
    /**
     * Get the inner tile polygon at the given index.
     * This function applies MOD to the index.
     *
     * @name getInnerTilePolygonAt
     * @instance
     * @memberof GirihTile
     * @param {number} index
     * @return {Polygon} The sub polygon (inner tile) at the given index.
     **/
    GirihTile.prototype.getInnerTilePolygonAt = function (index) {
        if (index < 0)
            return this.innerTilePolygons[this.innerTilePolygons.length - (Math.abs(index) % this.innerTilePolygons.length)];
        else
            return this.innerTilePolygons[index % this.innerTilePolygons.length];
    };
    /**
     * Get the outer tile polygon at the given index.
     * This function applies MOD to the index.
     *
     * @name getOuterTilePolygonAt
     * @instance
     * @memberof GirihTile
     * @param {number} index
     * @return {Polygon} The sub polygon (outer tile) at the given index.
     **/
    GirihTile.prototype.getOuterTilePolygonAt = function (index) {
        if (index < 0)
            return this.outerTilePolygons[this.outerTilePolygons.length - (Math.abs(index) % this.outerTilePolygons.length)];
        else
            return this.outerTilePolygons[index % this.outerTilePolygons.length];
    };
    /**
     * Rotate this tile
     * Note: this function behaves a bitdifferent than the genuine Polygon.rotate function!
     *       Polygon has the default center of rotation at (0,0).
     *       The GirihTile rotates around its center (position) by default.
     *
     * @name rotate
     * @instance
     * @memberof GirihTile
     * @param {number} angle - The angle to use for rotation.
     * @param {Vertex?} center - The center of rotation (default is this.position).
     * @return {Polygon} this
     **/
    GirihTile.prototype.rotate = function (angle, center) {
        if (typeof center === "undefined")
            center = this.position;
        _super.prototype.rotate.call(this, angle, center);
        for (var i in this.innerTilePolygons) {
            this.innerTilePolygons[i].rotate(angle, center);
        }
        for (var i in this.outerTilePolygons) {
            this.outerTilePolygons[i].rotate(angle, center);
        }
        this.rotation += angle;
        return this;
    };
    /**
     * This function locates the closest tile edge (polygon edge)
     * to the passed point.
     *
     * Currently the edge distance to a point is measured by the
     * euclidian distance from the edge's middle point.
     *
     * Idea: move this function to Polygon?
     *
     * @name locateEdgeAtPoint
     * @instance
     * @memberof GirihTile
     * @param {XYCoords} point     - The point to detect the closest edge for.
     * @param {number}   tolerance - The tolerance (=max distance) the detected edge
     *                               must be inside.
     * @return {nmber} the edge index (index of the starting vertex, so [index,index+1] is the edge ) or -1 if not found.
     **/
    GirihTile.prototype.locateEdgeAtPoint = function (point, tolerance) {
        if (this.vertices.length == 0)
            return -1;
        var middle = new Vertex_1.Vertex(0, 0);
        var tmpDistance = 0;
        var resultDistance = tolerance * 2; // definitely outside the tolerance :)
        var resultIndex = -1;
        for (var i = 0; i < this.vertices.length; i++) {
            var vertI = this.getVertexAt(i);
            var vertJ = this.getVertexAt(i + 1);
            // Create a point in the middle of the edge
            middle.x = vertI.x + (vertJ.x - vertI.x) / 2.0;
            middle.y = vertI.y + (vertJ.y - vertI.y) / 2.0;
            tmpDistance = middle.distance(point);
            if (tmpDistance <= tolerance && (resultIndex == -1 || tmpDistance < resultDistance)) {
                resultDistance = tmpDistance;
                resultIndex = i;
            }
        }
        return resultIndex;
    };
    /**
     * An epsilon to use for detecting adjacent edges. 0.001 seems to be a good value.
     * Adjust if needed.
     *
     * @name epsilon
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @static
     */
    GirihTile.epsilon = 0.001;
    /**
     * The default edge length.
     *
     * @name DEFAULT_EDGE_LENGTH
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @readonly
     * @static
     */
    GirihTile.DEFAULT_EDGE_LENGTH = 58;
    return GirihTile;
}(Polygon_1.Polygon)); // END class
exports.GirihTile = GirihTile;
//# sourceMappingURL=GirihTile.js.map