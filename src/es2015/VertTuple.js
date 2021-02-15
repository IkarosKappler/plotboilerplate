"use strict";
/**
 * @author Ikaros Kappler
 * @date   2020-03-24
 * @modified 2020-05-04 Fixed a serious bug in the pointDistance function.
 * @modified 2020-05-12 The angle(line) param was still not optional. Changed that.
 * @modified 2020-11-11 Generalized the `add` and `sub` param from `Vertex` to `XYCoords`.
 * @modified 2020-12-04 Changed`vtutils.dist2` params from `Vertex` to `XYCoords` (generalized).
 * @modified 2020-12-04 Changed `getClosestT` param from `Vertex` to `XYCoords` (generalized).
 * @modified 2020-12-04 Added the `hasPoint(XYCoords)` function.
 * @modified 2021-01-20 Added UID.
 * @version 1.1.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertTuple = void 0;
const Vertex_1 = require("./Vertex");
const UIDGenerator_1 = require("./UIDGenerator");
/**
 * @classdesc An abstract base classes for vertex tuple constructs, like Lines or Vectors.
 * @abstract
 * @requires UID
 * @requires Vertex
 * @requires XYCoords
 */
class VertTuple {
    /**
     * Creates an instance.
     *
     * @constructor
     * @name VertTuple
     * @param {Vertex} a The tuple's first point.
     * @param {Vertex} b The tuple's second point.
     **/
    constructor(a, b, factory) {
        this.uid = UIDGenerator_1.UIDGenerator.next();
        this.a = a;
        this.b = b;
        this.factory = factory;
    }
    /**
     * Get the length of this line.
     *
     * @method length
     * @instance
     * @memberof VertTuple
     **/
    length() {
        return Math.sqrt(Math.pow(this.b.x - this.a.x, 2) + Math.pow(this.b.y - this.a.y, 2));
    }
    ;
    /**
     * Set the length of this vector to the given amount. This only works if this
     * vector is not a null vector.
     *
     * @method setLength
     * @param {number} length - The desired length.
     * @memberof VertTuple
     * @return {T} this (for chaining)
     **/
    setLength(length) {
        return this.scale(length / this.length());
    }
    ;
    /**
     * Substract the given vertex from this line's end points.
     *
     * @method sub
     * @param {XYCoords} amount The amount (x,y) to substract.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    sub(amount) {
        this.a.sub(amount);
        this.b.sub(amount);
        return this;
    }
    ;
    /**
     * Add the given vertex to this line's end points.
     *
     * @method add
     * @param {XYCoords} amount The amount (x,y) to add.
     * @return {Line} this
     * @instance
     * @memberof VertTuple
     **/
    add(amount) {
        this.a.add(amount);
        this.b.add(amount);
        return this;
    }
    ;
    /**
     * Normalize this line (set to length 1).
     *
     * @method normalize
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    normalize() {
        this.b.set(this.a.x + (this.b.x - this.a.x) / this.length(), this.a.y + (this.b.y - this.a.y) / this.length());
        return this;
    }
    ;
    /**
     * Scale this line by the given factor.
     *
     * @method scale
     * @param {number} factor The factor for scaling (1.0 means no scale).
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    scale(factor) {
        this.b.set(this.a.x + (this.b.x - this.a.x) * factor, this.a.y + (this.b.y - this.a.y) * factor);
        return this;
    }
    ;
    /**
     * Move this line to a new location.
     *
     * @method moveTo
     * @param {Vertex} newA - The new desired location of 'a'. Vertex 'b' will be moved, too.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    moveTo(newA) {
        let diff = this.a.difference(newA);
        this.a.add(diff);
        this.b.add(diff);
        return this;
    }
    ;
    /**
     * Get the angle between this and the passed line (in radians).
     *
     * @method angle
     * @param {VertTuple} line - (optional) The line to calculate the angle to. If null the baseline (x-axis) will be used.
     * @return {number} this
     * @instance
     * @memberof VertTuple
     **/
    angle(line) {
        if (line == null || typeof line == 'undefined') {
            line = this.factory(new Vertex_1.Vertex(0, 0), new Vertex_1.Vertex(100, 0));
        }
        // Compute the angle from x axis and the return the difference :)
        var v0 = this.b.clone().sub(this.a);
        var v1 = line.b.clone().sub(line.a);
        // Thank you, Javascript, for this second atan function. No additional math is needed here!
        // The result might be negative, but isn't it usually nicer to determine angles in positive values only?
        return Math.atan2(v1.x, v1.y) - Math.atan2(v0.x, v0.y);
    }
    ;
    /**
     * Get line point at position t in [0 ... 1]:<br>
     * <pre>[P(0)]=[A]--------------------[P(t)]------[B]=[P(1)]</pre><br>
     * <br>
     * The counterpart of this function is Line.getClosestT(Vertex).
     *
     * @method vertAt
     * @param {number} t The position scalar.
     * @return {Vertex} The vertex a position t.
     * @instance
     * @memberof VertTuple
     **/
    vertAt(t) {
        return new Vertex_1.Vertex(this.a.x + (this.b.x - this.a.x) * t, this.a.y + (this.b.y - this.a.y) * t);
    }
    ;
    /**
     * Get the denominator of this and the given line.
     *
     * If the denominator is zero (or close to zero) both line are co-linear.
     *
     * @method denominator
     * @param {VertTuple} line
     * @instance
     * @memberof VertTuple
     * @return {Number}
     **/
    denominator(line) {
        // http://jsfiddle.net/justin_c_rounds/Gd2S2/
        return ((line.b.y - line.a.y) * (this.b.x - this.a.x)) - ((line.b.x - line.a.x) * (this.b.y - this.a.y));
    }
    ;
    /**
     * Checks if this and the given line are co-linear.
     *
     * The constant Vertex.EPSILON is used for tolerance.
     *
     * @method colinear
     * @param {VertTuple} line
     * @instance
     * @memberof VertTuple
     * @return true if both lines are co-linear.
     */
    colinear(line) {
        return Math.abs(this.denominator(line)) < Vertex_1.Vertex.EPSILON;
    }
    ;
    /**
     * Get the closest position T from this line to the specified point.
     *
     * The counterpart for this function is Line.vertAt(Number).
     *
     * @name getClosetT
     * @method getClosestT
     * @param {XYCoords} p The point (vertex) to measure the distance to.
     * @return {number} The line position t of minimal distance to p.
     * @instance
     * @memberof VertTuple
     **/
    getClosestT(p) {
        var l2 = VertTuple.vtutils.dist2(this.a, this.b);
        if (l2 === 0)
            return 0;
        var t = ((p.x - this.a.x) * (this.b.x - this.a.x) + (p.y - this.a.y) * (this.b.y - this.a.y)) / l2;
        // Do not wrap to [0,1] here.
        // Other results are of interest, too.
        // t = Math.max(0, Math.min(1, t));
        return t;
    }
    ;
    /**
     * Check if the given point is located on this line. Optionally also check if
     * that point is located between point `a` and `b`.
     *
     * @method hasPoint
     * @param {Vertex} point The point to check.
     * @param {boolean=} insideBoundsOnly If set to to true (default=false) the point must be between start and end point of the line.
     * @return {boolean} True if the given point is on this line.
     * @instance
     * @memberof VertTuple
     */
    hasPoint(point, insideBoundsOnly) {
        const t = this.getClosestT(point);
        // Compare to pointDistance?
        if (typeof insideBoundsOnly !== "undefined" && insideBoundsOnly) {
            const distance = Math.sqrt(VertTuple.vtutils.dist2(point, this.vertAt(t)));
            return distance < Vertex_1.Vertex.EPSILON && t >= 0 && t <= 1;
        }
        else {
            return t >= 0 && t <= 1;
        }
    }
    /**
     * Get the closest point on this line to the specified point.
     *
     * @method getClosestPoint
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {Vertex} The point on the line that is closest to p.
     * @instance
     * @memberof VertTuple
     **/
    getClosestPoint(p) {
        var t = this.getClosestT(p);
        return this.vertAt(t);
    }
    ;
    /**
     * The the minimal distance between this line and the specified point.
     *
     * @method pointDistance
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The absolute minimal distance.
     * @instance
     * @memberof VertTuple
     **/
    pointDistance(p) {
        // Taken From:
        // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        return Math.sqrt(VertTuple.vtutils.dist2(p, this.vertAt(this.getClosestT(p))));
    }
    ;
    /**
     * Create a deep clone of this instance.
     *
     * @method cloneLine
     * @return {T} A type safe clone if this instance.
     * @instance
     * @memberof VertTuple
     **/
    clone() {
        return this.factory(this.a.clone(), this.b.clone());
    }
    ;
    /**
     * Create a string representation of this line.
     *
     * @method totring
     * @return {string} The string representing this line.
     * @instance
     * @memberof VertTuple
     **/
    toString() {
        return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + " }";
    }
    ;
}
exports.VertTuple = VertTuple;
/**
 * @private
 **/
VertTuple.vtutils = {
    dist2: function (v, w) {
        return (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
    }
};
//# sourceMappingURL=VertTuple.js.map