/**
 * @author   Ikaros Kappler
 * @date     2016-03-12
 * @modified 2018-12-05 Refactored the code from the morley-triangle script.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-28 Fixed a bug in the Line.sub( Vertex ) function (was not working).
 * @modified 2019-09-02 Added the Line.add( Vertex ) function.
 * @modified 2019-09-02 Added the Line.denominator( Line ) function.
 * @modified 2019-09-02 Added the Line.colinear( Line ) function.
 * @modified 2019-09-02 Fixed an error in the Line.intersection( Line ) function (class Point was renamed to Vertex).
 * @modified 2019-12-15 Added the Line.moveTo(Vertex) function.
 * @modified 2020-03-16 The Line.angle(Line) parameter is now optional. The baseline (x-axis) will be used if not defined.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-12-04 The `intersection` function returns undefined if both lines are parallel.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-10-09 Changed the actual return value of the `intersection` function to null (was undefined before).
 * @modified 2022-10-17 Adding these methods from the `PathSegment` interface: getStartPoint, getEndPoint, revert.
 * @modified 2023-09-25 Changed param type of `intersection()` from Line to VertTuple.
 * @version  2.3.0
 *
 * @file Line
 * @public
 **/
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
/**
 * @classdesc A line consists of two vertices a and b.<br>
 * <br>
 * This is some refactored code from my 'Morley Triangle' test<br>
 *   https://github.com/IkarosKappler/morleys-trisector-theorem
 *
 * @requires Vertex
 */
export class Line extends VertTuple {
    /**
     * Creates an instance of Line.
     *
     * @constructor
     * @name Line
     * @param {Vertex} a The line's first point.
     * @param {Vertex} b The line's second point.
     **/
    constructor(a, b) {
        super(a, b, (a, b) => new Line(a, b));
        /**
         * Required to generate proper CSS classes and other class related IDs.
         **/
        this.className = "Line";
    }
    /**
     * Get the intersection if this line and the specified line.
     *
     * @method intersection
     * @param {Line} line The second line.
     * @return {Vertex|undefined} The intersection (may lie outside the end-points) or `undefined` if both lines are parallel.
     * @instance
     * @memberof Line
     **/
    // !!! DO NOT MOVE TO VertTuple
    intersection(line) {
        const denominator = this.denominator(line);
        if (denominator == 0) {
            return null;
        }
        let a = this.a.y - line.a.y;
        let b = this.a.x - line.a.x;
        const numerator1 = (line.b.x - line.a.x) * a - (line.b.y - line.a.y) * b;
        const numerator2 = (this.b.x - this.a.x) * a - (this.b.y - this.a.y) * b;
        a = numerator1 / denominator; // NaN if parallel lines
        b = numerator2 / denominator;
        // Catch NaN?
        const x = this.a.x + a * (this.b.x - this.a.x);
        const y = this.a.y + a * (this.b.y - this.a.y);
        if (isNaN(a) || isNaN(x) || isNaN(y)) {
            return null;
        }
        // if we cast these lines infinitely in both directions, they intersect here:
        return new Vertex(x, y);
    }
    //--- Implement PathSegment ---
    /**
     * Get the start point of this path segment.
     *
     * @method getStartPoint
     * @memberof PathSegment
     * @return {Vertex} The start point of this path segment.
     */
    getStartPoint() {
        return this.a;
    }
    /**
     * Get the end point of this path segment.
     *
     * @method getEndPoint
     * @memberof PathSegment
     * @return {Vertex} The end point of this path segment.
     */
    getEndPoint() {
        return this.b;
    }
    /**
     * Get the tangent's end point at the start point of this segment.
     *
     * @method getStartTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the starting point's tangent.
     */
    getStartTangent() {
        return this.b;
    }
    /**
     * Get the tangent's end point at the end point of this segment.
     *
     * @method getEndTangent
     * @memberof PathSegment
     * @return {Vertex} The end point of the ending point's tangent.
     */
    getEndTangent() {
        return this.a;
    }
    /**
     * Inverse this path segment (in-place) and return this same instance (useful for chaining).
     *
     * @method reverse
     * @memberof PathSegment
     * @return {PathSegment} This path segment instance (for chaining).
     */
    reverse() {
        var tmp = this.a;
        this.a = this.b;
        this.b = tmp;
        return this;
    }
}
//# sourceMappingURL=Line.js.map