"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2020-05-11
 * @modified 2020-10-30 Added the static computeFromVertices function.
 * @modified 2020-11-19 Set min, max, width and height to private.
 * @modified 2021-02-02 Added the `toPolygon` method.
 * @modified 2021-06-21 (mid-summer) Added `getCenter` method.
 * @modified 2022-02-01 Added the `toString` function.
 * @modified 2022-10-09 Added the `fromDimension` function.
 * @modified 2022-11-28 Added the `clone` method.
 * @modified 2023-09-29 Added the `randomPoint` method.
 * @modified 2025-03-23 Added the `getMinDimension` and `getMaxDimension` methods.
 * @modified 2025-04-18 Change parameter type in `Bounds.computeFromVertices` from `Vertex` to more general `XYCoords`.
 * @modified 2025-04-19 Added methods to `Bounds` class: `getNorthPoint`, `getSouthPoint`, `getEastPoint` and `getWestPoint`.
 * @version  1.8.0
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
     * Get the center point of the north bound.
     *
     * @method getNorthPoint
     * @instance
     * @memberof Bounds
     * @return {Vertex} The "northmost" centered point of this bounding box.
     */
    Bounds.prototype.getNorthPoint = function () {
        return new Vertex_1.Vertex(this.min.x + this.width / 2.0, this.min.y);
    };
    ;
    /**
     * Get the center point of the south bound.
     *
     * @method getNorthPoint
     * @instance
     * @memberof Bounds
     * @return {Vertex} The "southhmost" centered point of this bounding box.
     */
    Bounds.prototype.getSouthPoint = function () {
        return new Vertex_1.Vertex(this.min.x + this.width / 2.0, this.max.y);
    };
    ;
    /**
    * Get the center point of the west bound.
    *
    * @method getWestPoint
    * @instance
    * @memberof Bounds
    * @return {Vertex} The "westhmost" centered point of this bounding box.
    */
    Bounds.prototype.getWestPoint = function () {
        return new Vertex_1.Vertex(this.min.x, this.min.y + this.height / 2.0);
    };
    ;
    /**
    * Get the center point of the east bound.
    *
    * @method getEastPoint
    * @instance
    * @memberof Bounds
    * @return {Vertex} The "easthmost" centered point of this bounding box.
    */
    Bounds.prototype.getEastPoint = function () {
        return new Vertex_1.Vertex(this.max.x, this.min.y + this.height / 2.0);
    };
    ;
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
    /**
     * Get the center of this boinding box.
     *
     * @method getCenter
     * @instance
     * @memberof Bounds
     * @returns {Vertex} The center of these bounds.
     */
    Bounds.prototype.getCenter = function () {
        return new Vertex_1.Vertex(this.min.x + (this.max.x - this.min.x) / 2.0, this.min.y + (this.max.y - this.min.y) / 2);
    };
    /**
     * Get the minimum of `width` and `height`.
     *
     * @returns {number} The value of Math.min( this.width, this.height )
     */
    Bounds.prototype.getMinDimension = function () {
        return Math.min(this.width, this.height);
    };
    /**
     * Get the minimum of `width` and `height`.
     *
     * @returns {number} The value of Math.min( this.width, this.height )
     */
    Bounds.prototype.getMaxDimension = function () {
        return Math.max(this.width, this.height);
    };
    /**
     * Generate a random point inside this bounds object. Safe areas at the border to avoid
     * included.
     *
     * @method randomPoint
     * @instance
     * @memberof Bounds
     * @param {horizontalSafeArea} - (optional) The horizonal (left and right) safe area. No vertex will be created here. Can be used as percent in (0.0 ... 0.1) interval.
     * @param {verticalSafeArea} - (optional) The vertical (top and bottom) safe area. No vertex will be created here. Can be used as percent in (0.0 ... 0.1) interval
     * @returns {Vertex} A pseudo random point inside these bounds.
     */
    Bounds.prototype.randomPoint = function (horizontalSafeArea, verticalSafeArea) {
        if (horizontalSafeArea === void 0) { horizontalSafeArea = 0; }
        if (verticalSafeArea === void 0) { verticalSafeArea = 0; }
        // Check if the safe areas are meant as percent
        var absHorizontalSafeArea = horizontalSafeArea > 0 && horizontalSafeArea < 1 ? this.width * horizontalSafeArea : horizontalSafeArea;
        var absVerticalSafeArea = verticalSafeArea > 0 && verticalSafeArea < 1 ? this.height * verticalSafeArea : verticalSafeArea;
        return new Vertex_1.Vertex(this.min.x + absHorizontalSafeArea + Math.random() * (this.width - 2 * absHorizontalSafeArea), this.min.y + absVerticalSafeArea + Math.random() * (this.height - 2 * absVerticalSafeArea));
    };
    /**
     * Convert these bounds to a human readable form.
     *
     * Note: the returned format might change in the future, so please do not
     * rely on the returned string format.
     *
     * @method toString
     * @instance
     * @memberof Bounds
     * @returns {string} Get these bounds in a human readable form.
     */
    Bounds.prototype.toString = function () {
        return "{ min: ".concat(this.min.toString(), ", max : ").concat(this.max.toString(), ", width: ").concat(this.width, ", height : ").concat(this.height, " }");
    };
    /**
     * Clone this bounds object (create a deep clone).
     *
     * @method clone
     * @instance
     * @memberof Bounds
     * @returns {Bounds} Creates a deep clone of this bounds object.
     */
    Bounds.prototype.clone = function () {
        return new Bounds({ x: this.min.x, y: this.min.y }, { x: this.max.x, y: this.max.y });
    };
    /**
     * Compute the minimal bounding box for a given set of vertices.
     *
     * An empty vertex array will return an empty bounding box located at (0,0).
     *
     * @static
     * @method computeFromVertices
     * @memberof Bounds
     * @param {Array<XYCoords>} vertices - The set of vertices you want to get the bounding box for.
     * @return The minimal Bounds for the given vertices.
     **/
    Bounds.computeFromVertices = function (vertices) {
        if (vertices.length == 0) {
            return new Bounds(new Vertex_1.Vertex(0, 0), new Vertex_1.Vertex(0, 0));
        }
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
    /**
    * Compute the minimal bounding box for a given set of existing bounding boxes.
    *
    * An empty vertex array will return an empty bounding box located at (0,0).
    *
    * @static
    * @method computeFromBoundsSet
    * @memberof Bounds
    * @param {Array<IBounds>} boundingBoxes - The set of existing bounding boxes to get the containing bounding box for.
    * @return The minimal Bounds for the given bounds instances.
    **/
    Bounds.computeFromBoundsSet = function (boundingBoxes) {
        if (boundingBoxes.length == 0) {
            return new Bounds(new Vertex_1.Vertex(0, 0), new Vertex_1.Vertex(0, 0));
        }
        var xMin = boundingBoxes[0].min.x;
        var xMax = boundingBoxes[0].max.x;
        var yMin = boundingBoxes[0].min.y;
        var yMax = boundingBoxes[0].min.y;
        var bounds;
        for (var i in boundingBoxes) {
            bounds = boundingBoxes[i];
            xMin = Math.min(xMin, bounds.min.x);
            xMax = Math.max(xMax, bounds.max.x);
            yMin = Math.min(yMin, bounds.min.y);
            yMax = Math.max(yMax, bounds.min.y);
        }
        return new Bounds(new Vertex_1.Vertex(xMin, yMin), new Vertex_1.Vertex(xMax, yMax));
    };
    /**
     * Create a new `Bounds` instance just from `width` and `height`, located at (0,0) or the optionally given origin.
     *
     * @param {number} width - The width of the bounds
     * @param {number} height  - The height of the bounds
     * @param {XYCoords={x:0,y:0}} origin - [optional] A origin to locate the new Bounds object at.
     * @returns {Bounds} A new `Bounds` instance width given width and height, located at (0,0) or the given origin..
     */
    Bounds.fromDimension = function (width, height, origin) {
        return new Bounds(origin !== null && origin !== void 0 ? origin : { x: 0, y: 0 }, { x: (origin ? origin.x : 0) + width, y: (origin ? origin.y : 0) + height });
    };
    return Bounds;
}()); // END class bounds
exports.Bounds = Bounds;
//# sourceMappingURL=Bounds.js.map