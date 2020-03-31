import { Vertex } from "./Vertex";
export declare class VertTuple<T extends VertTuple<T>> {
    /**
     * @member {Vertex}
     * @memberof Line
     * @instance
     */
    a: Vertex;
    /**
     * @member {Vertex}
     * @memberof Line
     * @instance
     */
    b: Vertex;
    private factory;
    /**
     * Creates an instance.
     *
     * @constructor
     * @name Line
     * @param {Vertex} a The tuple's first point.
     * @param {Vertex} b The tuple's second point.
     **/
    constructor(a: Vertex, b: Vertex, factory: (a: Vertex, b: Vertex) => T);
    /**
     * Get the length of this line.
     *
     * @method length
     * @instance
     * @memberof Line
     **/
    length(): number;
    /**
     * Set the length of this vector to the given amount. This only works if this
     * vector is not a null vector.
     *
     * @method setLength
     * @param {number} length - The desired length.
     * @memberof Line
     * @return {Line} this (for chaining)
     **/
    setLength(length: number): VertTuple<T>;
    /**
     * Substract the given vertex from this line's end points.
     *
     * @method sub
     * @param {Vertex} amount The amount (x,y) to substract.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    sub(amount: Vertex): VertTuple<T>;
    /**
     * Add the given vertex to this line's end points.
     *
     * @method add
     * @param {Vertex} amount The amount (x,y) to add.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    add(amount: Vertex): VertTuple<T>;
    /**
     * Normalize this line (set to length 1).
     *
     * @method normalize
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    normalize(): VertTuple<T>;
    /**
     * Scale this line by the given factor.
     *
     * @method scale
     * @param {number} factor The factor for scaling (1.0 means no scale).
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    scale(factor: number): VertTuple<T>;
    /**
     * Move this line to a new location.
     *
     * @method moveTo
     * @param {Vertex} newA - The new desired location of 'a'. Vertex 'b' will be moved, too.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    moveTo(newA: Vertex): VertTuple<T>;
    /**
     * Get the angle between this and the passed line (in radians).
     *
     * @method angle
     * @param {Line} [line] - (optional) The line to calculate the angle to. If null the baseline (x-axis) will be used.
     * @return {number} this
     * @instance
     * @memberof Line
     **/
    angle(line: VertTuple<any>): number;
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
     * @memberof Line
     **/
    vertAt(t: number): Vertex;
    /**
     * Get the denominator of this and the given line.
     *
     * If the denominator is zero (or close to zero) both line are co-linear.
     *
     * @param {Line} line
     * @return {Number}
     **/
    denominator(line: VertTuple<T>): number;
    /**
     * Checks if this and the given line are co-linear.
     *
     * The constant Vertex.EPSILON is used for tolerance.
     *
     * @param {Line} line
     * @return true if both lines are co-linear.
     */
    colinear(line: VertTuple<T>): boolean;
    /**
     * Get the closest position T from this line to the specified point.
     *
     * The counterpart for this function is Line.vertAt(Number).
     *
     * @method getClosestT
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The line position t of minimal distance to p.
     * @instance
     * @memberof Line
     **/
    getClosestT(p: Vertex): number;
    /**
     * The the minimal distance between this line and the specified point.
     *
     * @method pointDistance
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The absolute minimal distance.
     * @instance
     * @memberof Line
     **/
    pointDistance(p: Vertex): number;
    /**
     * Create a deep clone of this instance.
     *
     * @method cloneLine
     * @return {T} A type safe clone if this instance.
     * @instance
     * @memberof Line
     **/
    clone(): T;
    /**
     * Create a string representation of this line.
     *
     * @method totring
     * @return {string} The string representing this line.
     * @instance
     * @memberof Line
     **/
    toString(): string;
    /**
     * @private
     **/
    static vtutils: {
        dist2: (v: Vertex, w: Vertex) => number;
    };
}
