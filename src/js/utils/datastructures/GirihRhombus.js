"use strict";
/**
 * @classdesc The rhombus tile from the Girih set.
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 *
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihRhombus
 * @public
 **/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Bounds_1 = require("../../Bounds");
var Circle_1 = require("../../Circle");
var GirihTile_1 = require("./GirihTile");
var Polygon_1 = require("../../Polygon");
var Vertex_1 = require("../../Vertex");
var GirihRhombus = /** @class */ (function (_super) {
    __extends(GirihRhombus, _super);
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihRhombus
     * @param {Vertex} position
     * @param {number} size
     */
    function GirihRhombus(position, size) {
        var _this = _super.call(this, position, size, GirihTile_1.TileType.TYPE_RHOMBUS) || this;
        // Overwrite the default symmetries:
        //    the rhombus tile has a 180° symmetry (5/10 * 360°)
        _this.uniqueSymmetries = 5;
        // Init the actual rhombus shape with the passed size
        var pointA = new Vertex_1.Vertex(0, 0);
        var pointB = pointA;
        _this.addVertex(pointB);
        var angles = [0.0,
            72.0,
            108.0
            // 72.0
        ];
        var theta = 0.0;
        for (var i = 0; i < angles.length; i++) {
            theta += (180.0 - angles[i]);
            pointA = pointB; // center of rotation
            pointB = pointB.clone();
            pointB.x += size;
            pointB.rotate(theta * (Math.PI / 180.0), pointA);
            _this.addVertex(pointB);
        }
        // Move to center    
        var bounds = Bounds_1.Bounds.computeFromVertices(_this.vertices);
        var move = new Vertex_1.Vertex(bounds.width / 2.0 - (bounds.width - size), bounds.height / 2.0);
        for (var i = 0; i < _this.vertices.length; i++) {
            _this.vertices[i].add(move).add(_this.position);
        }
        _this.imageProperties = {
            source: { x: 32 / 500.0,
                y: 188 / 460.0,
                width: 127 / 500.0,
                height: 92 / 460.0
            },
            destination: { xOffset: 0.0,
                yOffset: 0.0
            }
        };
        _this._buildInnerPolygons();
        _this._buildOuterPolygons(); // Call only AFTER the inner polygons were built!
        return _this;
    }
    ;
    /**
     * @override
     */
    GirihRhombus.prototype.clone = function () {
        return new GirihRhombus(this.position.clone(), this.size).rotate(this.rotation);
    };
    ;
    GirihRhombus.prototype._buildInnerPolygons = function () {
        // Connect all edges half-the-way
        var innerTile = new Polygon_1.Polygon(); // [];
        innerTile.addVertex(this.vertices[0].clone().scale(0.5, this.vertices[1]));
        innerTile.addVertex(this.vertices[1].clone().scale(0.5, this.vertices[2]));
        // Compute the next inner polygon vertex by the intersection of two circles
        var circleA = new Circle_1.Circle(innerTile.vertices[1], innerTile.vertices[0].distance(innerTile.vertices[1]) * 0.73);
        var circleB = new Circle_1.Circle(this.vertices[2].clone().scale(0.5, this.vertices[3]), circleA.radius);
        // There is definitely an intersection
        var intersection = circleA.circleIntersection(circleB);
        // One of the two points is inside the tile, the other is outside.
        // Locate the inside point.
        if (this.containsVert(intersection.a))
            innerTile.addVertex(intersection.b);
        else
            innerTile.addVertex(intersection.a);
        innerTile.addVertex(circleB.center);
        innerTile.addVertex(this.vertices[3].clone().scale(0.5, this.vertices[0]));
        // Move circles
        circleA.center = innerTile.vertices[4];
        circleB.center = innerTile.vertices[0];
        //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
        intersection = circleA.circleIntersection(circleB);
        // There are two points again (one inside, one outside the tile)
        if (this.containsVert(intersection.a))
            innerTile.addVertex(intersection.b);
        else
            innerTile.addVertex(intersection.a);
        this.innerTilePolygons.push(innerTile);
    };
    ;
    GirihRhombus.prototype._buildOuterPolygons = function () {
        var indicesA = [0, 2]; // 4:2
        var indicesB = [0, 3]; // 6:2
        for (var i = 0; i < indicesA.length; i++) {
            var indexA = indicesA[i];
            var indexB = indicesB[i];
            // The triangle
            var outerTileX = new Polygon_1.Polygon();
            outerTileX.addVertex(this.getVertexAt(indexA + 1).clone());
            outerTileX.addVertex(this.innerTilePolygons[0].getVertexAt(indexB).clone());
            outerTileX.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 1).clone());
            this.outerTilePolygons.push(outerTileX);
            // The first 'kite'
            var outerTileY = new Polygon_1.Polygon();
            outerTileY.addVertex(this.getVertexAt(indexA + 2).clone());
            outerTileY.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 1).clone());
            outerTileY.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 2).clone());
            outerTileY.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 3).clone());
            this.outerTilePolygons.push(outerTileY);
        }
    };
    ;
    return GirihRhombus;
}(GirihTile_1.GirihTile));
exports.GirihRhombus = GirihRhombus;
//# sourceMappingURL=GirihRhombus.js.map