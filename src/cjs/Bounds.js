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
 * @modified 2025-04-26 Added static method `Bounds.computeFromBoundsSet` to calculate containing bounds for a set of bounding boxes.
 * @modified 2025-10-17 Added the methods `Bounds.getSouthWestPoint`, `getNorthWestPoint`, `getNorthEastPoint` and `getSouthEastPoint`.
 * @modified 2025-10-18 Added method `Bounds.containsVert(XYCoords)`.
 * @modified 2025-10-28 Added the `Bounds.getWidth()` and `Bounds.getHeight()`.
 * @modified 2025-11-12 Added the `Bounds.getMoved()` method.
 * @modified 2026-10-11 Adding methods `Bounds.getWestBound`, `Bounds.getNorthBound`, `Bounds.getEastBound`, `Bounds.getSouthBound`.
 * @modified 2026-10-12 Adding method `Bounds.expandLine`.
 * @version  1.11.0
 **/
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bounds = void 0;
var Polygon_1 = require("./Polygon");
var Vertex_1 = require("./Vertex");
var Line_1 = require("./Line");
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
     * Check if the given vertex is inside this bounds.
     *
     * @method containsVert
     * @param {XYCoords} vert - The vertex to check.
     * @return {boolean} True if the passed vertex is inside this bounds.
     * @instance
     * @memberof Bounds
     **/
    Bounds.prototype.containsVert = function (vert) {
        return this.min.x <= vert.x && vert.x < this.max.x && this.min.y <= vert.y && vert.y < this.max.y;
    };
    Bounds.prototype.getWidth = function () {
        return this.max.x - this.min.x;
    };
    Bounds.prototype.getHeight = function () {
        return this.max.y - this.min.y;
    };
    Bounds.prototype.getScaled = function (scaleFactor) {
        var center = this.getCenter();
        var newMin = new Vertex_1.Vertex(this.min).scale(scaleFactor, center);
        var newMax = new Vertex_1.Vertex(this.max).scale(scaleFactor, center);
        return new Bounds(newMin, newMax);
    };
    Bounds.prototype.getMoved = function (moveAmount) {
        var newMin = new Vertex_1.Vertex(this.min).move(moveAmount);
        var newMax = new Vertex_1.Vertex(this.max).move(moveAmount);
        return new Bounds(newMin, newMax);
    };
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
    /**
     * Get the upper left corner point these bounds box.
     *
     * @method getNorthWestPoint
     * @instance
     * @memberof Bounds
     * @return {Vertex} The "northwestmost" point of this bounding box.
     */
    Bounds.prototype.getNorthWestPoint = function () {
        return new Vertex_1.Vertex(this.min.x, this.min.y);
    };
    /**
     * Get the upper right corner point these bounds box.
     *
     * @method getNorthEastPoint
     * @instance
     * @memberof Bounds
     * @return {Vertex} The "northeastmost" point of this bounding box.
     */
    Bounds.prototype.getNorthEastPoint = function () {
        return new Vertex_1.Vertex(this.max.x, this.min.y);
    };
    /**
     * Get the lower right corner point these bounds box.
     *
     * @method getSouthEastPoint
     * @instance
     * @memberof Bounds
     * @return {Vertex} The "southeastmost" point of this bounding box.
     */
    Bounds.prototype.getSouthEastPoint = function () {
        return new Vertex_1.Vertex(this.max.x, this.max.y);
    };
    /**
     * Get the lower left corner point these bounds box.
     *
     * @method getSouthWestPoint
     * @instance
     * @memberof Bounds
     * @return {Vertex} The "southwestmost" point of this bounding box.
     */
    Bounds.prototype.getSouthWestPoint = function () {
        return new Vertex_1.Vertex(this.min.x, this.max.y);
    };
    Bounds.prototype.getWestBound = function () {
        return new Line_1.Line(this.getSouthWestPoint(), this.getNorthWestPoint());
    };
    Bounds.prototype.getNorthBound = function () {
        return new Line_1.Line(this.getNorthWestPoint(), this.getNorthEastPoint());
    };
    Bounds.prototype.getEastBound = function () {
        return new Line_1.Line(this.getNorthEastPoint(), this.getSouthEastPoint());
    };
    Bounds.prototype.getSouthBound = function () {
        return new Line_1.Line(this.getSouthEastPoint(), this.getSouthWestPoint());
    };
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
     * Get an 'infinite' line that touches the bounds of this bounded box.
     *
     * @method expandLine
     * @instance
     * @memberof Bounds
     * @param {Vertex} pA - The first point of the line.
     * @param {Vertex} pB - The second point of the line.
     * @returns {ine} A new line covering the whole box.
     */
    Bounds.prototype.expandLine = function (line) {
        var _a, _b;
        // There is an easier way: just extend the line 2x the viewport size – but that's not accurate.
        var north = this.getNorthBound();
        var east = this.getEastBound();
        var west = this.getWestBound();
        var south = this.getSouthBound();
        // var intersections: [Vertex | null, Vertex | null, Vertex | null, Vertex | null] = [
        var intersections = [
            north.intersection(line, true),
            east.intersection(line, true),
            south.intersection(line, true),
            west.intersection(line, true)
        ].filter(function (vert) { return Boolean(vert); });
        // console.log("intersections", intersections);
        // intersections = intersections.filter((vert: Vertex | null) => Boolean(vert));
        var first = intersections[0];
        var second = intersections[1];
        // console.log("first", first, "second", second);
        intersections.splice(0, 2);
        var resultA = (_a = line.a).findClosestPoint.apply(_a, __spreadArray([first, second], intersections, false));
        // var resultA = line.a.findClosestPoint(intersections[0], intersections[1], intersections[2], intersections[3]);
        // var resultB = line.a.findFarestPoint(intersections[0], intersections[1], intersections[2], intersections[3]);
        var resultB = (_b = line.a).findFarestPoint.apply(_b, __spreadArray([first, second], intersections, false));
        return new Line_1.Line(resultA, resultB);
        // // var scale = Math.max( this.getMaxDimension() /
        // // var resultA = line.a.scale(this.width / line.getBounds().width, line.b);
        // // var resultB = line.b.scale(this.width / line.getBounds().width, line.a);
        // // var middle = line.vertAt(0.5);
        // // var diff = middle.difference(line.a);
        // // var resultA = middle.
        // // return new Line(resultA, resultB);
        // var diff = line.a.difference(line.b);
        // var factors = { x: this.width / diff.x, y: this.height / diff.y };
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