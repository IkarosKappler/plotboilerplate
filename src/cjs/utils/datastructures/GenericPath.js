"use strict";
/**
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2022-10-17
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericPath = void 0;
var GenericPath = /** @class */ (function () {
    function GenericPath(startSegment) {
        this.segments = [startSegment];
    }
    /**
     * Get the number of segments in this path.
     *
     * @method getSegmentCount
     * @memberof Path
     * @return {number} The number (integer) of path segments.
     */
    GenericPath.prototype.getSegmentCount = function () {
        return this.segments.length;
    };
    /**
     * Get the path segment at the given index.
     *
     * @method getSegmentAt
     * @memberof Path
     * @return {PathSegment} The paths segment at the given index.
     */
    GenericPath.prototype.getSegmentAt = function (index) {
        return this.segments[index];
    };
    /**
     * Create a deep clone of this path.
     *
     * @method clone
     * @memberof Path
     * @return {Path} A deep clone/copy of this path.
     */
    GenericPath.prototype.clone = function () {
        var newPath = new GenericPath(this.segments[this.segments.length - 1].clone().revert());
        for (var i = this.segments.length - 2; i >= 0; i--) {
            newPath.segments.push(this.segments[i].clone().revert());
        }
        return newPath;
    };
    /**
     * Reverse this path (swap start and end and thus – the direction) in-place.
     *
     * @method revert
     * @memberof Path
     * @return {PathSegment} This path instance.
     */
    GenericPath.prototype.revert = function () {
        var newSegments = [];
        for (var i = this.segments.length - 1; i >= 0; i--) {
            newSegments.push(this.segments[i].revert());
        }
        this.segments = newSegments;
        return this;
    };
    /**
     * Get the start point of this path segment.
     *
     * @method getStartPoint
     * @memberof PathSegment
     * @return {Vertex} The start point of this path segment.
     */
    GenericPath.prototype.getStartPoint = function () {
        return this.segments[0].getStartPoint();
    };
    /**
     * Get the end point of this path segment.
     *
     * @method getEndPoint
     * @memberof PathSegment
     * @return {Vertex} The end point of this path segment.
     */
    GenericPath.prototype.getEndPoint = function () {
        return this.segments[this.segments.length - 1].getEndPoint();
    };
    return GenericPath;
}());
exports.GenericPath = GenericPath;
//# sourceMappingURL=GenericPath.js.map