"use strict";
/**
 * @classdesc The penrose rhombus tile from the Girih set.
 * The penrose rhombus (angles 36° and 144°) is NOT part of the actual girih tile set!
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 *
 * But it fits perfect into the girih as the angles are the same.
 * *
 * @author Ikaros Kappler
 * @date 2013-12-11
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihPenroseRhombus
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
var GirihTile_1 = require("./GirihTile");
var Polygon_1 = require("../../Polygon");
var Vertex_1 = require("../../Vertex");
var GirihPenroseRhombus = /** @class */ (function (_super) {
    __extends(GirihPenroseRhombus, _super);
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihPenroseRhombus
     * @param {Vertex} position
     * @param {number} size
     */
    function GirihPenroseRhombus(position, size, addCenterPolygon) {
        var _this = _super.call(this, position, size, GirihTile_1.TileType.TYPE_PENROSE_RHOMBUS) || this;
        // Overwrite the default symmetries:
        //    the penrose-rhombus tile has a 180° symmetry (5/10 * 360°)
        _this.uniqueSymmetries = 5;
        if (typeof addCenterPolygon == "undefined")
            addCenterPolygon = true; // Add by default
        // Init the actual decahedron shape with the passed size
        var pointA = new Vertex_1.Vertex(0, 0);
        var pointB = pointA;
        _this.addVertex(pointB);
        var angles = [0.0,
            36.0,
            144.0 // 108.0
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
        // Move to center and position
        var bounds = Bounds_1.Bounds.computeFromVertices(_this.vertices);
        var move = new Vertex_1.Vertex(bounds.width / 2.0 - (bounds.width - size), bounds.height / 2.0);
        for (var i = 0; i < _this.vertices.length; i++) {
            _this.vertices[i].add(move).add(position);
        }
        _this.imageProperties = {
            source: { x: 2 / 500.0,
                y: 8 / 460.0,
                width: 173 / 500.0,
                height: 56 / 460.0
            },
            destination: { xOffset: 0.0,
                yOffset: 0.0
            }
        };
        _this._buildInnerPolygons(size, addCenterPolygon);
        _this._buildOuterPolygons(size, addCenterPolygon);
        return _this;
    }
    ;
    /**
     * @override
     */
    GirihPenroseRhombus.prototype.clone = function () {
        return new GirihPenroseRhombus(this.position.clone(), this.size, true).rotate(this.rotation);
    };
    ;
    GirihPenroseRhombus.prototype._buildInnerPolygons = function (edgeLength, addCenterPolygon) {
        var indices = [0, 2];
        var centerTile = new Polygon_1.Polygon();
        for (var i = 0; i < indices.length; i++) {
            var innerTile = new Polygon_1.Polygon();
            var index = indices[i];
            var left = this.getVertexAt(index).clone().scale(0.5, this.getVertexAt(index + 1));
            var right = this.getVertexAt(index + 1).clone().scale(0.5, this.getVertexAt(index + 2));
            var innerA = this.getVertexAt(index + 1).clone().scale(0.28, this.position);
            var innerB = this.getVertexAt(index + 1).clone().scale(0.55, this.position);
            innerTile.addVertex(left);
            innerTile.addVertex(innerA);
            innerTile.addVertex(right);
            innerTile.addVertex(innerB);
            centerTile.addVertex(this.getVertexAt(index).clone().scale(0.1775, this.getVertexAt(index + 2)));
            centerTile.addVertex(innerA.clone());
            this.innerTilePolygons.push(innerTile);
        }
        if (addCenterPolygon)
            this.innerTilePolygons.push(centerTile);
    };
    ;
    GirihPenroseRhombus.prototype._buildOuterPolygons = function (edgeLength, centerPolygonExists) {
        // Add left and right 'spikes'.
        var indices = [0, 2];
        for (var i = 0; i < indices.length; i++) {
            var outerTile = new Polygon_1.Polygon();
            var index = indices[i];
            var left = this.getVertexAt(index).clone().scale(0.5, this.getVertexAt(index + 1));
            var right = this.getVertexAt(index + 1).clone().scale(0.5, this.getVertexAt(index + 2));
            var innerA = this.getVertexAt(index + 1).clone().scale(0.28, this.position); // multiplyScalar( 0.28 );
            var innerB = this.getVertexAt(index + 1).clone().scale(0.55, this.position); // multiplyScalar( 0.55 );
            outerTile.addVertex(left.clone());
            outerTile.addVertex(this.getVertexAt(index + 1).clone());
            outerTile.addVertex(right.clone());
            outerTile.addVertex(innerB.clone());
            this.outerTilePolygons.push(outerTile);
        }
        // If the center polygon exists then the last outer polygon is split into two.
        if (centerPolygonExists) {
            // Two polygons
            var indices_1 = [0, 2];
            for (var i = 0; i < indices_1.length; i++) {
                var outerTile = new Polygon_1.Polygon();
                var index = indices_1[i];
                outerTile.addVertex(this.getVertexAt(index).clone());
                outerTile.addVertex(this.getVertexAt(index).clone().scale(0.5, this.getVertexAt(index + 1)));
                outerTile.addVertex(this.innerTilePolygons[i].getVertexAt(1).clone());
                outerTile.addVertex(this.getVertexAt(index).clone().scale(0.1775, this.getVertexAt(index + 2)));
                outerTile.addVertex(this.innerTilePolygons[(i + 1) % 2].getVertexAt(1).clone());
                outerTile.addVertex(this.getVertexAt(index - 1).clone().scale(0.5, this.getVertexAt(index)));
                this.outerTilePolygons.push(outerTile);
            }
        }
    };
    ;
    /**
     * If you want the center polygon not to be drawn the canvas handler needs to
     * know the respective polygon index (inside the this.innerTilePolygons array).
     **/
    // TODO: IS THIS STILL REQUIRED
    GirihPenroseRhombus.prototype.getCenterPolygonIndex = function () {
        return 2;
    };
    ;
    return GirihPenroseRhombus;
}(GirihTile_1.GirihTile));
exports.GirihPenroseRhombus = GirihPenroseRhombus;
;
//# sourceMappingURL=GirihPenroseRhombus.js.map