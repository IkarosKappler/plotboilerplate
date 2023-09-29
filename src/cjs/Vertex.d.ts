/**
 * @author   Ikaros Kappler
 * @date     2012-10-17
 * @modified 2018-04-03 Refactored the code of october 2012 into a new class.
 * @modified 2018-04-28 Added some documentation.
 * @modified 2018-08-16 Added the set() function.
 * @modified 2018-08-26 Added VertexAttr.
 * @modified 2018-10-31 Extended the constructor by object{x,y}.
 * @modified 2018-11-19 Extended the set(number,number) function to set(Vertex).
 * @modified 2018-11-28 Added 'this' to the VertexAttr constructor.
 * @modified 2018-12-05 Added the sub(...) function. Changed the signature of the add() function! add(Vertex) and add(number,number) are now possible.
 * @modified 2018-12-21 (It's winter solstice) Added the inv()-function.
 * @modified 2019-01-30 Added the setX(Number) and setY(Number) functions.
 * @modified 2019-02-19 Added the difference(Vertex) function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-24 Added the randomVertex(ViewPort) function.
 * @modified 2019-11-07 Added toSVGString(object) function.
 * @modified 2019-11-18 Added the rotate(number,Vertex) function.
 * @modified 2019-11-21 Fixed a bug in the rotate(...) function (elements were moved).
 * @modified 2020-03-06 Added functions invX() and invY().
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-05-26 Added functions addX(number) and addY(number).
 * @modified 2020-10-30 Changed the warnings in `sub(...)` and `add(...)` into real errors.
 * @modified 2021-03-01 Changed the second param `center` in the `rotate` function from Vertex to XYCoords.
 * @modified 2021-12-01 Changed the type of param of `scale` to XYCoords.
 * @modified 2021-12-01 Added function `scaleXY` for non uniform scaling.
 * @modified 2021-12-17 Added the functions `lerp` and `lerpAbs` for linear interpolations.
 * @modified 2022-01-31 Added `Vertex.utils.arrayToJSON`.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Vertex.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-11-28 Added the `subXY`, `subX` and `subY` methods to the `Vertex` class.
 * @modified 2023-09-29 Downgraded types for the `Vertex.utils.buildArrowHead` function (replacing Vertex params by more generic XYCoords type).
 * @version  2.8.0
 *
 * @file Vertex
 * @public
 **/
import { IVertexAttr } from "./VertexAttr";
import { VertexListeners } from "./VertexListeners";
import { XYCoords, SVGSerializable, UID } from "./interfaces";
/**
 * @classdesc A vertex is a pair of two numbers.<br>
 * <br>
 * It is used to identify a 2-dimensional point on the x-y-plane.
 *
 * @requires IVertexAttr
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires VertexAttr
 * @requires VertexListeners
 * @requires XYCoords
 *
 */
export declare class Vertex implements XYCoords, SVGSerializable {
    private static readonly ZERO;
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof Vertex
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * An epsilon for comparison
     *
     * @private
     * @readonly
     **/
    static readonly EPSILON = 0.000001;
    /**
     * @member {number}
     * @memberof Vertex
     * @instance
     */
    x: number;
    /**
     * @member {number}
     * @memberof Vertex
     * @instance
     */
    y: number;
    /**
     * @member {IVertexAttr}
     * @memberof {Vertex}
     * @instance
     **/
    attr: IVertexAttr;
    /**
     * @member {VertexListeners}
     * @memberof {Vertex}
     * @instance
     **/
    listeners: VertexListeners;
    /**
     * @member isDestroyed
     * @memberof Vertex
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * The constructor for the vertex class.
     *
     * @constructor
     * @name Vertex
     * @param {number} x - The x-coordinate of the new vertex.
     * @param {number} y - The y-coordinate of the new vertex.
     **/
    constructor(x?: number | XYCoords | undefined, y?: number | undefined);
    /**
     * Set the x- and y- component of this vertex.
     *
     * @method set
     * @param {number} x - The new x-component.
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    set(x: number | XYCoords, y?: number | undefined): Vertex;
    /**
     * Set the x-component of this vertex.
     *
     * @method setX
     * @param {number} x - The new x-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    setX(x: number): Vertex;
    /**
     * Set the y-component of this vertex.
     *
     * @method setY
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    setY(y: number): Vertex;
    /**
     * Set the x-component if this vertex to the inverse of its value.
     *
     * @method invX
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    invX(): Vertex;
    /**
     * Set the y-component if this vertex to the inverse of its value.
     *
     * @method invY
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    invY(): Vertex;
    /**
     * Add the passed amount to x- and y- component of this vertex.<br>
     * <br>
     * This function works with add( {number}, {number} ) and
     * add( {Vertex} ), as well.
     *
     * @method add
     * @param {(number|Vertex)} x - The amount to add to x (or a vertex itself).
     * @param {number=} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    add(x: number | XYCoords, y?: number): Vertex;
    /**
     * Add the passed amounts to the x- and y- components of this vertex.
     *
     * @method addXY
     * @param {number} x - The amount to add to x.
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addXY(amountX: number, amountY: number): Vertex;
    /**
     * Add the passed amounts to the x-component of this vertex.
     *
     * @method addX
     * @param {number} x - The amount to add to x.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addX(amountX: number): Vertex;
    /**
     * Add the passed amounts to the y-component of this vertex.
     *
     * @method addY
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addY(amountY: number): Vertex;
    /**
     * Substract the passed amount from x- and y- component of this vertex.<br>
     * <br>
     * This function works with sub( {number}, {number} ) and
     * sub( {Vertex} ), as well.
     *
     * @method sub
     * @param {(number|Vertex)} x - The amount to substract from x (or a vertex itself).
     * @param {number=} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    sub(x: number | XYCoords, y?: number): Vertex;
    /**
     * Substract the passed amounts from the x- and y- components of this vertex.
     *
     * @method subXY
     * @param {number} x - The amount to substract from x.
     * @param {number} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    subXY(amountX: number, amountY: number): Vertex;
    /**
     * Substract the passed amounts from the x-component of this vertex.
     *
     * @method addX
     * @param {number} x - The amount to substract from x.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    subX(amountX: number): Vertex;
    /**
     * Substract the passed amounts from the y-component of this vertex.
     *
     * @method subY
     * @param {number} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    subY(amountY: number): Vertex;
    /**
     * Check if this vertex equals the passed one.
     * <br>
     * This function uses an internal epsilon as tolerance.
     *
     * @method equals
     * @param {Vertex} vertex - The vertex to compare this with.
     * @return {boolean}
     * @instance
     * @memberof Vertex
     **/
    equals(vertex: XYCoords): boolean;
    /**
     * Create a copy of this vertex.
     *
     * @method clone
     * @return {Vertex} A new vertex, an exact copy of this.
     * @instance
     * @memberof Vertex
     **/
    clone(): Vertex;
    /**
     * Get the distance to the passed point (in euclidean metric)
     *
     * @method distance
     * @param {XYCoords} vert - The vertex to measure the distance to.
     * @return {number}
     * @instance
     * @memberof Vertex
     **/
    distance(vert: XYCoords): number;
    /**
     * Get the angle of this point (relative to (0,0) or to the given other origin point).
     *
     * @method angle
     * @param {XYCoords} origin - The vertex to measure the angle from.
     * @return {number}
     * @instance
     * @memberof Vertex
     **/
    angle(origin?: XYCoords): number;
    /**
     * Get the difference to the passed point.<br>
     * <br>
     * The difference is (vert.x-this.x, vert.y-this.y).
     *
     * @method difference
     * @param {Vertex} vert - The vertex to measure the x-y-difference to.
     * @return {Vertex} A new vertex.
     * @instance
     * @memberof Vertex
     **/
    difference(vert: XYCoords): Vertex;
    /**
     * This is a vector-like behavior and 'scales' this vertex
     * towards/from a given center by one uniform scale factor.
     *
     * @method scale
     * @param {number} factor - The factor to 'scale' this vertex; 1.0 means no change.
     * @param {XYCoords=} center - The origin of scaling; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    scale(factor: number, center?: XYCoords): Vertex;
    /**
     * Perform a linear interpolation towards the given target vertex.
     * The amount value `t` is relative, `t=0.0` means no change, `t=1.0`
     * means this point will be moved to the exact target position.
     *
     * `t=0.5` will move this point to the middle of the connecting
     * linear segment.
     *
     * @param {XYCoords} target - The target position to lerp this vertex to.
     * @param {number} t - The relative amount, usually in [0..1], but other values will work, too.
     * @returns
     */
    lerp(target: XYCoords, t: number): Vertex;
    /**
     * Perform a linear interpolation towards the given target vertex (absolute variant).
     * The amount value `t` is absolute, which means the lerp amount is a direct distance
     * value. This point will have move the amount of the passed distance `u`.
     *
     * @param {XYCoords} target - The target position to lerp this vertex to.
     * @param {number} t - The absolute move amount to use to lerping.
     * @returns
     */
    lerpAbs(target: XYCoords, u: number): Vertex;
    /**
     * This is a vector-like behavior and 'scales' this vertex
     * towards/from a given center by two independent x- and y- scale factors.
     *
     * @method scale
     * @param {number} factor - The factor to 'scale' this vertex; 1.0 means no change.
     * @param {XYCoords=} center - The origin of scaling; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    scaleXY(factors: XYCoords, center?: XYCoords): Vertex;
    /**
     * This is a vector-like behavior and 'rotates' this vertex
     * around given center.
     *
     * @method rotate
     * @param {number} angle - The angle to 'rotate' this vertex; 0.0 means no change.
     * @param {XYCoords=} center - The center of rotation; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    rotate(angle: number, center: XYCoords | undefined): Vertex;
    /**
     * Multiply both components of this vertex with the given scalar.<br>
     * <br>
     * Note: as in<br>
     *    https://threejs.org/docs/#api/math/Vector2.multiplyScalar
     *
     * @method multiplyScalar
     * @param {number} scalar - The scale factor; 1.0 means no change.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    multiplyScalar(scalar: number): this;
    /**
     * Round the two components x and y of this vertex.
     *
     * @method round
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    round(): Vertex;
    /**
     * Change this vertex (x,y) to its inverse (-x,-y).
     *
     * @method inv
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    inv(): Vertex;
    /**
     * Get a string representation of this vertex.
     *
     * @method toString
     * @return {string} The string representation of this vertex.
     * @instance
     * @memberof Vertex
     **/
    toString(): string;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    /**
     * Create a new random vertex inside the given viewport.
     *
     * @param {ViewPort} viewPort - A {min:Vertex, max:Vertex} viewport specifying the bounds.
     * @return A new vertex with a random position.
     **/
    static randomVertex(viewPort: {
        min: XYCoords;
        max: XYCoords;
    }): Vertex;
    static utils: {
        /**
         * Generate a four-point arrow head, starting at the vector end minus the
         * arrow head length.
         *
         * The first vertex in the returned array is guaranteed to be the located
         * at the vector line end minus the arrow head length.
         *
         *
         * Due to performance all params are required.
         *
         * The params scaleX and scaleY are required for the case that the scaling is not uniform (x and y
         * scaling different). Arrow heads should not look distored on non-uniform scaling.
         *
         * If unsure use 1.0 for scaleX and scaleY (=no distortion).
         * For headlen use 8, it's a good arrow head size.
         *
         * Example:
         *    buildArrowHead( new Vertex(0,0), new Vertex(50,100), 8, 1.0, 1.0 )
         *
         * @param {XYCoords} zA - The start vertex of the vector to calculate the arrow head for.
         * @param {XYCoords} zB - The end vertex of the vector.
         * @param {number} headlen - The length of the arrow head (along the vector direction. A good value is 12).
         * @param {number} scaleX  - The horizontal scaling during draw.
         * @param {number} scaleY  - the vertical scaling during draw.
         **/
        buildArrowHead: (zA: XYCoords, zB: XYCoords, headlen: number, scaleX: number, scaleY: number) => Array<Vertex>;
        /**
         * Convert the given vertices (array) to a JSON string.
         *
         * @param {number?} precision - (optional) The numeric precision to be used (number of precision digits).
         * @returns {string}
         */
        arrayToJSON(vertices: Array<XYCoords>, precision?: number): string;
    };
}
