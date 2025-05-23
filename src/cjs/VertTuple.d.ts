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
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2023-09-29 Fixed a calculation error in the VertTuple.hasPoint() function; distance measure was broken!
 * @modified 2024-09-10 Chaging the first param of `pointDistance` from `Vertex` to less strict type `XYCoords`. This should not break anything.
 * @modified 2024-09-10 Adding the optional `epsilon` param to the `hasPoint` method.
 * @modified 2024-12-02 Added the `epsilon` param to the `colinear` method. Default is 1.0e-6.
 * @modified 2025-03-31 Added the `VertTuple.revert` method.
 * @modified 2025-04-15 Changed param of `VertTuple.moveTo` method from `Vertex` to `XYCoords`.
 * @modified 2025-04-15 Added method `VertTuple.move` method.
 * @version 1.4.0
 */
import { Vertex } from "./Vertex";
import { XYCoords, UID } from "./interfaces";
/**
 * @classdesc An abstract base classes for vertex tuple constructs, like Lines or Vectors.
 * @abstract
 * @requires UID
 * @requires Vertex
 * @requires XYCoords
 */
export declare class VertTuple<T extends VertTuple<T>> {
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof VertTuple
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {Vertex}
     * @memberof VertTuple
     * @instance
     */
    a: Vertex;
    /**
     * @member {Vertex}
     * @memberof VertTuple
     * @instance
     */
    b: Vertex;
    /**
     * @member isDestroyed
     * @memberof VertTuple
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * The factory is used by the `clone` method.
     */
    private factory;
    /**
     * Creates an instance.
     *
     * @constructor
     * @name VertTuple
     * @param {Vertex} a The tuple's first point.
     * @param {Vertex} b The tuple's second point.
     **/
    constructor(a: Vertex, b: Vertex, factory: (a: Vertex, b: Vertex) => T);
    /**
     * Get the length of this line.
     *
     * @method length
     * @instance
     * @memberof VertTuple
     **/
    length(): number;
    /**
     * Set the length of this vector to the given amount. This only works if this
     * vector is not a null vector.
     *
     * @method setLength
     * @param {number} length - The desired length.
     * @memberof VertTuple
     * @return {T} this (for chaining)
     **/
    setLength(length: number): VertTuple<T>;
    /**
     * Substract the given vertex from this line's end points.
     *
     * @method sub
     * @param {XYCoords} amount The amount (x,y) to substract.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    sub(amount: XYCoords): VertTuple<T>;
    /**
     * Add the given vertex to this line's end points.
     *
     * @method add
     * @param {XYCoords} amount The amount (x,y) to add.
     * @instance
     * @memberof VertTuple
     * @return {VertTuple<T>} this
     **/
    add(amount: XYCoords): VertTuple<T>;
    /**
     * Reverse this vertex tuple: a becomes b, and b becomes a.
     * This operation is in-place.
     *
     * @method add
     * @param {XYCoords} amount The amount (x,y) to add.
     * @instance
     * @memberof VertTuple
     * @return {VertTuple<T>} this
     */
    revert(): VertTuple<T>;
    /**
     * Normalize this line (set to length 1).
     *
     * @method normalize
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    normalize(): VertTuple<T>;
    /**
     * Scale this line by the given factor.
     *
     * @method scale
     * @param {number} factor The factor for scaling (1.0 means no scale).
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    scale(factor: number): VertTuple<T>;
    /**
     * Move this line to a new location.
     *
     * @method moveTo
     * @param {XYCoords} newA - The new desired location of 'a'. Vertex 'b' will be moved, too.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    moveTo(newA: XYCoords): VertTuple<T>;
    /**
     * Move this line by the given amount
     *
     * @method move
     * @param {XYCoords} amount - The amount to move both point of this tuple.
     * @return {VertTuple} this
     * @instance
     * @memberof VertTuple
     **/
    move(amount: XYCoords): VertTuple<T>;
    /**
     * Get the angle between this and the passed line (in radians).
     *
     * @method angle
     * @param {VertTuple} line - (optional) The line to calculate the angle to. If null the baseline (x-axis) will be used.
     * @return {number} this
     * @instance
     * @memberof VertTuple
     **/
    angle(line?: VertTuple<any>): number;
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
    vertAt(t: number): Vertex;
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
    denominator(line: VertTuple<T>): number;
    /**
     * Checks if this and the given line are co-linear.
     *
     * The constant Vertex.EPSILON is used for tolerance.
     *
     * @method colinear
     * @param {VertTuple} line
     * @param {epsilon?=1.0e-6} epsilon - The epsilon to use (default is 1.0e-6).
     * @instance
     * @memberof VertTuple
     * @return true if both lines are co-linear.
     */
    colinear(line: VertTuple<T>, epsilon?: number): boolean;
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
    getClosestT(p: XYCoords): number;
    /**
     * Check if the given point is located on this line. Optionally also check if
     * that point is located between point `a` and `b`.
     *
     * @method hasPoint
     * @param {Vertex} point - The point to check.
     * @param {boolean=} insideBoundsOnly - [optional] If set to to true (default=false) the point must be between start and end point of the line.
     * @param {number=Vertex.EPSILON} epsilon - [optional] A tolerance.
     * @return {boolean} True if the given point is on this line.
     * @instance
     * @memberof VertTuple
     */
    hasPoint(point: XYCoords, insideBoundsOnly?: boolean, epsilon?: number): boolean;
    /**
     * Get the closest point on this line to the specified point.
     *
     * @method getClosestPoint
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {Vertex} The point on the line that is closest to p.
     * @instance
     * @memberof VertTuple
     **/
    getClosestPoint(p: Vertex): Vertex;
    /**
     * The the minimal distance between this line and the specified point.
     *
     * @method pointDistance
     * @param {XYCoords} p The point (vertex) to measre the distance to.
     * @return {number} The absolute minimal distance.
     * @instance
     * @memberof VertTuple
     **/
    pointDistance(p: XYCoords): number;
    /**
     * Create a deep clone of this instance.
     *
     * @method cloneLine
     * @return {T} A type safe clone if this instance.
     * @instance
     * @memberof VertTuple
     **/
    clone(): T;
    /**
     * Create a string representation of this line.
     *
     * @method totring
     * @return {string} The string representing this line.
     * @instance
     * @memberof VertTuple
     **/
    toString(): string;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    /**
     * @private
     **/
    static vtutils: {
        dist2: (v: XYCoords, w: XYCoords) => number;
    };
}
