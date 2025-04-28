/**
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-02-23 Added the toSVGString function, overriding Line.toSVGString.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-19 Added the clone function (overriding Line.clone()).
 * @modified 2019-09-02 Added the Vector.perp() function.
 * @modified 2019-09-02 Added the Vector.inverse() function.
 * @modified 2019-12-04 Added the Vector.inv() function.
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Vector.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-10-25 Added the `getOrthogonal` method.
 * @modified 2025-04-14 Added the `Vector.rotate(number)` method.
 * @version  1.6.0
 *
 * @file Vector
 * @public
 **/
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { SVGSerializable, XYCoords } from "./interfaces";
/**
 * @classdesc A vector (Vertex,Vertex) is a line with a visible direction.<br>
 *            <br>
 *            Vectors are drawn with an arrow at their end point.<br>
 *            <b>The Vector class extends the Line class.</b>
 *
 * @requires VertTuple
 * @requires Vertex
 **/
export declare class Vector extends VertTuple<Vector> implements SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The constructor.
     *
     * @constructor
     * @name Vector
     * @extends Line
     * @param {Vertex} vertA - The start vertex of the vector.
     * @param {Vertex} vertB - The end vertex of the vector.
     **/
    constructor(vertA: Vertex, vertB: Vertex);
    /**
     * Get the perpendicular of this vector which is located at a.
     *
     * @return {Vector} A new vector being the perpendicular of this vector sitting on a.
     **/
    perp(): Vector;
    /**
     * The inverse of a vector is a vector with the same magnitude but oppose direction.
     *
     * Please not that the origin of this vector changes here: a->b becomes b->a.
     *
     * @return {Vector}
     **/
    inverse(): Vector;
    /**
     * This function computes the inverse of the vector, which means 'a' stays untouched.
     *
     * @return {Vector} this for chaining.
     **/
    inv(): Vector;
    /**
     * Get the intersection if this vector and the specified vector.
     *
     * @method intersection
     * @param {Vector} line The second vector.
     * @return {Vertex} The intersection (may lie outside the end-points).
     * @instance
     * @memberof Line
     **/
    intersection(line: Vector): Vertex | null;
    /**
     * Get the orthogonal "vector" of this vector (rotated by 90° clockwise).
     *
     * @name getOrthogonal
     * @method getOrthogonal
     * @return {Vector} A new vector with the same length that stands on this vector's point a.
     * @instance
     * @memberof Vector
     **/
    getOrthogonal(): Vector;
    /**
     * Rotate this vector by the given angle around the first point `a`.
     *
     * @name rotate
     * @method rotate
     * @return {Vector} this - for chaining.
     * @instance
     * @memberof Vector
     */
    rotate(angle: number): Vector;
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
    };
}
