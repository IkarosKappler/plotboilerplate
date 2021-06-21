"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @modified 2020-11-19 Set min, max, width and height to private.
 * @modified 2021-02-02 Added the `toPolygon` method.
 * @modified 2021-06-21 (mid-summer) Added `getCenter` method.
 * @version  1.3.0
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bounds = void 0;
var Polygon_1 = require("./Polygon");
var Vertex_1 = require("./Vertex");
/**
 * @classdesc A bounds class with min and max values. Implementing IBounds.
 *
 * @requires XYCoords
 * @requires Vertex
 * @requires IBounds
 **/
var Bounds = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name Bounds
     * @param {XYCoords} min - The min values (x,y) as a XYCoords tuple.
     * @param {XYCoords} max - The max values (x,y) as a XYCoords tuple.
     **/
    function Bounds(min, max) {
        this.min = min;
        this.max = max;
        this.width = max.x - min.x;
        this.height = max.y - min.y;
    }
    /**
     * Convert this rectangular bounding box to a polygon with four vertices.
     *
     * @method toPolygon
     * @instance
     * @memberof Bounds
     * @return {Polygon} This bound rectangle as a polygon.
     */
    Bounds.prototype.toPolygon = function () {
        return new Polygon_1.Polygon([new Vertex_1.Vertex(this.min), new Vertex_1.Vertex(this.max.x, this.min.y), new Vertex_1.Vertex(this.max), new Vertex_1.Vertex(this.min.x, this.max.y)], false);
    };
    Bounds.prototype.getCenter = function () {
        return new Vertex_1.Vertex(this.min.x + (this.max.x - this.min.x) / 2.0, this.min.y + (this.max.y - this.min.y) / 2);
    };
    /**
     * Compute the minimal bounding box for a given set of vertices.
     *
     * An empty vertex array will return an empty bounding box located at (0,0).
     *
     * @static
     * @method computeFromVertices
     * @memberof Bounds
     * @param {Array<Vertex>} vertices - The set of vertices you want to get the bounding box for.
     * @return The minimal Bounds for the given vertices.
     **/
    Bounds.computeFromVertices = function (vertices) {
        if (vertices.length == 0)
            return new Bounds(new Vertex_1.Vertex(0, 0), new Vertex_1.Vertex(0, 0));
        var xMin = vertices[0].x;
        var xMax = vertices[0].x;
        var yMin = vertices[0].y;
        var yMax = vertices[0].y;
        var vert;
        for (var i in vertices) {
            vert = vertices[i];
            xMin = Math.min(xMin, vert.x);
            xMax = Math.max(xMax, vert.x);
            yMin = Math.min(yMin, vert.y);
            yMax = Math.max(yMax, vert.y);
        }
        return new Bounds(new Vertex_1.Vertex(xMin, yMin), new Vertex_1.Vertex(xMax, yMax));
    };
    return Bounds;
}()); // END class bounds
exports.Bounds = Bounds;
//# sourceMappingURL=Bounds.js.map