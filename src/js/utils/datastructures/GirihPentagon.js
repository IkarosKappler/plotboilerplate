"use strict";
/**
 * @classdesc The pentagon tile from the Girih set.
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihPentagon
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
exports.GirihPentagon = void 0;
var GirihTile_1 = require("./GirihTile");
var Polygon_1 = require("../../Polygon");
var GirihPentagon = /** @class */ (function (_super) {
    __extends(GirihPentagon, _super);
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihPentagon
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    function GirihPentagon(position, edgeLength) {
        var _this = _super.call(this, position, edgeLength, GirihTile_1.TileType.PENTAGON) || this;
        // Overwrite the default symmetries:
        //    the pentagon tile has a 72° symmetry (2/10 * 360°)
        _this.uniqueSymmetries = 2;
        // Init the actual pentagon shape with the passed size:
        // Divide the full circle into 5 sections (we want to make a regular pentagon).
        var theta = (Math.PI * 2) / 5.0;
        // Compute the 'radius' using pythagoras
        var radius = Math.sqrt(Math.pow(_this.edgeLength / 2, 2)
            +
                Math.pow(1 / Math.tan(theta / 2) * _this.edgeLength / 2, 2));
        for (var i = 0; i < 5; i++) {
            _this.addVertex(position.clone().addY(-radius).rotate(theta / 2 + i * theta, position));
        }
        _this.textureSource.min.x = 7 / 500.0;
        _this.textureSource.min.y = (303) / 460.0;
        _this.textureSource.max.x = _this.textureSource.min.x + 157 / 500.0;
        _this.textureSource.max.y = _this.textureSource.min.y + (150) / 460.0;
        _this.baseBounds = _this.getBounds();
        _this._buildInnerPolygons(_this.edgeLength);
        _this._buildOuterPolygons(_this.edgeLength); // Only call AFTER the inner polygons were built!
        return _this;
    }
    ;
    /**
     * @override
     */
    GirihPentagon.prototype.clone = function () {
        return new GirihPentagon(this.position.clone(), this.edgeLength).rotate(this.rotation);
    };
    ;
    GirihPentagon.prototype._buildInnerPolygons = function (edgeLength) {
        // Connect all edges half-the-way
        var innerTile = new Polygon_1.Polygon();
        for (var i = 0; i < this.vertices.length; i++) {
            innerTile.addVertex(this.getVertexAt(i).clone().scale(0.5, this.getVertexAt(i + 1)));
            // ... make linear approximation instead
            innerTile.addVertex(this.getVertexAt(i + 1).clone().scale(0.5, this.position));
        }
        this.innerTilePolygons.push(innerTile);
    };
    ;
    GirihPentagon.prototype._buildOuterPolygons = function (edgeLength) {
        for (var i = 0; i < this.vertices.length; i++) {
            var indexA = i;
            var indexB = i * 2;
            // The triangle
            var outerTile = new Polygon_1.Polygon();
            outerTile.addVertex(this.getVertexAt(indexA + 1).clone());
            outerTile.addVertex(this.innerTilePolygons[0].getVertexAt(indexB).clone());
            outerTile.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 1).clone());
            outerTile.addVertex(this.innerTilePolygons[0].getVertexAt(indexB + 2).clone());
            this.outerTilePolygons.push(outerTile);
        }
    };
    ;
    return GirihPentagon;
}(GirihTile_1.GirihTile));
exports.GirihPentagon = GirihPentagon;
//# sourceMappingURL=GirihPentagon.js.map