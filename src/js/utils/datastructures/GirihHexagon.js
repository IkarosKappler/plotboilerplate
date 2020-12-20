"use strict";
/**
 * @classdesc The irregular hexagon tile from the Girih set.
 *
 * @requires Bounds
 * @requires Circle
 * @requires GirihTile
 * @requires Line
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihHexagon
 * @public
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
exports.GirihHexagon = void 0;
var Circle_1 = require("../../Circle");
var GirihTile_1 = require("./GirihTile");
var Polygon_1 = require("../../Polygon");
var Vertex_1 = require("../../Vertex");
var GirihHexagon = /** @class */ (function (_super) {
    __extends(GirihHexagon, _super);
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihHexagon
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    function GirihHexagon(position, edgeLength) {
        var _this = _super.call(this, position, edgeLength, GirihTile_1.TileType.IRREGULAR_HEXAGON) || this;
        // Overwrite the default symmetries:
        //    the hexagon tile has a 180° symmetry (5/10 * 360°)
        _this.uniqueSymmetries = 5;
        // Init the actual decahedron shape with the passed size
        var pointA = new Vertex_1.Vertex(0, 0);
        var pointB = pointA;
        var startPoint = pointA;
        var oppositePoint = null;
        _this.addVertex(pointB);
        // TODO: use radians here
        var angles = [0.0,
            72.0,
            144.0,
            144.0,
            72.0
            // 144.0
        ];
        var theta = 0.0;
        for (var i = 0; i < angles.length; i++) {
            theta += (180.0 - angles[i]);
            pointA = pointB; // center of rotation
            pointB = pointB.clone();
            pointB.x -= _this.edgeLength;
            pointB.rotate(theta * (Math.PI / 180.0), pointA);
            _this.addVertex(pointB);
            if (i == 2)
                oppositePoint = pointB;
        }
        // Center and move to desired position    
        var move = new Vertex_1.Vertex((oppositePoint.x - startPoint.x) / 2.0, (oppositePoint.y - startPoint.y) / 2.0);
        for (var i = 0; i < _this.vertices.length; i++) {
            _this.vertices[i].add(position).sub(move);
        }
        _this.textureSource.min.x = 77 / 500.0;
        _this.textureSource.min.y = 11 / 460.0;
        _this.textureSource.max.x = _this.textureSource.min.x + 205 / 500.0;
        _this.textureSource.max.y = _this.textureSource.min.y + 150 / 460.0;
        _this.baseBounds = _this.getBounds();
        _this._buildInnerPolygons(_this.edgeLength);
        _this._buildOuterPolygons(_this.edgeLength); // Only call AFTER the inner polygons were created!
        return _this;
    }
    ;
    /**
     * @override
     */
    GirihHexagon.prototype.clone = function () {
        return new GirihHexagon(this.position.clone(), this.edgeLength).rotate(this.rotation);
    };
    ;
    GirihHexagon.prototype._buildInnerPolygons = function (edgeLength) {
        // Connect all edges half-the-way
        var innerTile = new Polygon_1.Polygon();
        innerTile.addVertex(this.vertices[0].clone().scale(0.5, this.vertices[1]));
        innerTile.addVertex(this.vertices[1].clone().scale(0.5, this.vertices[2]));
        // Compute the next inner polygon vertex by the intersection of two circles
        var circleA = new Circle_1.Circle(innerTile.vertices[1], innerTile.vertices[0].distance(innerTile.vertices[1]));
        var circleB = new Circle_1.Circle(this.vertices[2].clone().scale(0.5, this.vertices[3]), circleA.radius);
        // TODO: the following piece of code occurs exactly four times.
        // -> refactor! (DRY)
        // There is definitely an intersection
        var intersection = circleA.circleIntersection(circleB);
        // The intersection is definitely not empty (by construction)
        // One of the two points is inside the tile, the other is outside.
        // Locate the inside point.
        // Use the point that is closer to the center
        if (this.position.distance(intersection.a) < this.position.distance(intersection.b))
            innerTile.addVertex(intersection.a);
        else
            innerTile.addVertex(intersection.b);
        innerTile.addVertex(circleB.center.clone());
        // var i = 3;
        // Move circles
        circleA.center = circleB.center;
        circleB.center = this.vertices[3].clone().scale(0.5, this.vertices[4]);
        intersection = circleA.circleIntersection(circleB);
        // The intersection is definitely not empty (by construction)
        // There are two points again (one inside, one outside the tile)
        // Use the point that is closer to the center
        if (this.position.distance(intersection.a) < this.position.distance(intersection.b))
            innerTile.addVertex(intersection.a);
        else
            innerTile.addVertex(intersection.b);
        innerTile.addVertex(circleB.center.clone());
        innerTile.addVertex(this.vertices[4].clone().scale(0.5, this.vertices[5]));
        // Move circles  
        circleA.center = innerTile.vertices[innerTile.vertices.length - 1];
        circleB.center = this.vertices[5].clone().scale(0.5, this.vertices[0]);
        intersection = circleA.circleIntersection(circleB);
        // The intersection is definitely not empty (by construction)
        // There are two points again (one inside, one outside the tile)
        // Use the point that is closer to the center
        if (this.position.distance(intersection.a) < this.position.distance(intersection.b))
            innerTile.addVertex(intersection.a);
        else
            innerTile.addVertex(intersection.b);
        innerTile.addVertex(circleB.center.clone());
        // Move circles  
        circleA.center = innerTile.vertices[innerTile.vertices.length - 1];
        circleB.center = innerTile.vertices[0];
        intersection = circleA.circleIntersection(circleB);
        // The intersection is definitely not empty (by construction)
        // There are two points again (one inside, one outside the tile)
        // Use the point that is closer to the center
        if (this.position.distance(intersection.a) < this.position.distance(intersection.b))
            innerTile.addVertex(intersection.a);
        else
            innerTile.addVertex(intersection.b);
        innerTile.addVertex(circleB.center.clone());
        this.innerTilePolygons.push(innerTile);
    };
    ;
    GirihHexagon.prototype._buildOuterPolygons = function (edgeLength) {
        // First add the two triangles at the 'ends' of the shape.
        var indicesA = [0, 3]; //  6:2
        var indicesB = [0, 5]; // 10:2
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
            // The second 'kite'
            var outerTileZ = new Polygon_1.Polygon();
            outerTileZ.addVertex(this.getVertexAt(indexA + 3).clone());
            outerTileZ.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 3).clone());
            outerTileZ.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 4).clone());
            outerTileZ.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 5).clone());
            this.outerTilePolygons.push(outerTileZ);
        }
    };
    ;
    return GirihHexagon;
}(GirihTile_1.GirihTile));
exports.GirihHexagon = GirihHexagon;
//# sourceMappingURL=GirihHexagon.js.map