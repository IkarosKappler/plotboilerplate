/**
 * @author    Ikaros Kappler
 * @date_init 2012-10-17 (Wrote a first version of this in that year).
 * @date      2018-04-03 (Refactored the code into a new class).
 * @modified  2018-04-28 Added some documentation.
 * @modified  2019-09-11 Added the scaleToCentroid(Number) function (used by the walking triangle demo).
 * @modified  2019-09-12 Added beautiful JSDoc compliable comments.
 * @modified  2019-11-07 Added to toSVG(options) function to make Triangles renderable as SVG.
 * @modified  2019-12-09 Fixed the determinant() function. The calculation was just wrong.
 * @modified  2020-03-16 (Corona times) Added the 'fromArray' function.
 * @modified  2020-03-17 Added the Triangle.toPolygon() function.
 * @modified  2020-03-17 Added proper JSDoc comments.
 * @modified  2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified  2020-05-09 Added the new Circle class (ported to Typescript from the demos).
 * @modified  2020-05-12 Added getIncircularTriangle() function.
 * @modified  2020-05-12 Added getIncircle() function.
 * @modified  2020-05-12 Fixed the signature of getCircumcirle(). Was still a generic object.
 * @modified  2020-06-18 Added the `getIncenter` function.
 * @modified  2020-12-28 Added the `getArea` function.
 * @modified  2021-01-20 Added UID.
 * @modified  2021-01-22 Always updating circumcircle when retieving it.
 * @modified  2022-02-02 Added the `destroy` method.
 * @modified  2022-02-02 Cleared the `Triangle.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified  2024-11-22 Added static utility function Triangle.utils.determinant; adapted method `determinant`.
 * @modified  2024-11-22 Changing visibility of `Triangle.utils` from `private` to `public`.
 * @modified  2025-14-16 Class `Triangle` now implements interface `Intersectable`.
 * @modified  2025-14-16 Class `Triangle` now implements interface `IBounded`.
 * @modified  2025-14-16 Class `Triangle` now implements interface `Intersectable`.
 * @modified  2025-14-16 Added method `Triangle.move`.
 * @version   2.10.0
 *
 * @file Triangle
 * @fileoverview A simple triangle class: three vertices.
 * @public
 **/
import { Bounds } from "./Bounds";
import { Circle } from "./Circle";
import { Line } from "./Line";
import { Polygon } from "./Polygon";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { IBounded, Intersectable, SVGSerializable, UID, XYCoords } from "./interfaces";
/**
 * @classdesc A triangle class for triangulations.
 *
 * The class was written for a Delaunay trinagulation demo so it might
 * contain some strange and unexpected functions.
 *
 * @requires Bounds
 * @requires Circle
 * @requires Line
 * @requires Vertex
 * @requires Polygon
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires geomutils
 *
 */
export declare class Triangle implements IBounded, SVGSerializable, Intersectable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof Triangle
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * An epsilon for comparison.
     * This should be the same epsilon as in Vertex.
     *
     * @private
     **/
    static readonly EPSILON: number;
    /**
     * @member {Vertex}
     * @memberof Triangle
     * @instance
     */
    a: Vertex;
    /**
     * @member {Vertex}
     * @memberof Triangle
     * @instance
     */
    b: Vertex;
    /**
     * @member {Vertex}
     * @memberof Triangle
     * @instance
     */
    c: Vertex;
    /**
     * @member {Vertex}
     * @memberof Triangle
     * @instance
     * @private
     */
    private center;
    /**
     * @member {number}
     * @memberof Triangle
     * @instance
     * @private
     */
    private radius_squared;
    /**
     * @member {number}
     * @memberof Triangle
     * @instance
     * @private
     */
    private radius;
    /**
     * @member isDestroyed
     * @memberof Triangle
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * The constructor.
     *
     * @constructor
     * @name Triangle
     * @param {Vertex} a - The first vertex of the triangle.
     * @param {Vertex} b - The second vertex of the triangle.
     * @param {Vertex} c - The third vertex of the triangle.
     **/
    constructor(a: Vertex, b: Vertex, c: Vertex);
    /**
     * Create a new triangle from the given array of vertices.
     *
     * The array must have at least three vertices, otherwise an error will be raised.
     * This function will not create copies of the vertices.
     *
     * @method fromArray
     * @static
     * @param {Array<Vertex>} arr - The required array with at least three vertices.
     * @memberof Vertex
     * @return {Triangle}
     **/
    static fromArray(arr: Array<Vertex>): Triangle;
    /**
     * Get the area of this triangle. The returned area is never negative.
     *
     * If you are interested in the signed area, please consider using the
     * `Triangle.utils.signedArea` helper function. This method just returns
     * the absolute value of the signed area.
     *
     * @method getArea
     * @instance
     * @memberof Triangle
     * @return {number} The non-negative area of this triangle.
     */
    getArea(): number;
    /**
     * Get the centroid of this triangle.
     *
     * The centroid is the average midpoint for each side.
     *
     * @method getCentroid
     * @return {Vertex} The centroid
     * @instance
     * @memberof Triangle
     **/
    getCentroid(): Vertex;
    /**
     * Scale the triangle towards its centroid.
     *
     * @method scaleToCentroid
     * @param {number} - The scale factor to use. That can be any scalar.
     * @return {Triangle} this (for chaining)
     * @instance
     * @memberof Triangle
     */
    scaleToCentroid(factor: number): Triangle;
    /**
     * Get the bounding box (bounds) of this Triangle.
     *
     * @method getBounds
     * @instance
     * @memberof Triangle
     * @return {Bounds} The rectangular bounds of this Triangle.
     **/
    getBounds(): Bounds;
    /**
     * Move the Triangle's vertices by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof Triangle
     * @return {Triangle} this for chaining
     **/
    move(amount: XYCoords): Triangle;
    /**
     * Get the circumcircle of this triangle.
     *
     * The circumcircle is that unique circle on which all three
     * vertices of this triangle are located on.
     *
     * Please note that for performance reasons any changes to vertices will not reflect in changes
     * of the circumcircle (center or radius). Please call the calcCirumcircle() function
     * after triangle vertex changes.
     *
     * @method getCircumcircle
     * @return {Object} - { center:Vertex, radius:float }
     * @instance
     * @memberof Triangle
     */
    getCircumcircle(): Circle;
    /**
     * Check if this triangle and the passed triangle share an
     * adjacent edge.
     *
     * For edge-checking Vertex.equals is used which uses an
     * an epsilon for comparison.
     *
     * @method isAdjacent
     * @param {Triangle} tri - The second triangle to check adjacency with.
     * @return {boolean} - True if this and the passed triangle have at least one common edge.
     * @instance
     * @memberof Triangle
     */
    isAdjacent(tri: Triangle): boolean;
    /**
     * Get that vertex of this triangle (a,b,c) that is not vert1 nor vert2 of
     * the passed two.
     *
     * @method getThirdVertex
     * @param {Vertex} vert1 - The first vertex.
     * @param {Vertex} vert2 - The second vertex.
     * @return {Vertex} - The third vertex of this triangle that makes up the whole triangle with vert1 and vert2.
     * @instance
     * @memberof Triangle
     */
    getThirdVertex(vert1: Vertex, vert2: Vertex): Vertex;
    /**
     * Re-compute the circumcircle of this triangle (if the vertices
     * have changed).
     *
     * The circumcenter and radius are stored in this.center and
     * this.radius. There is a third result: radius_squared (for internal computations).
     *
     * @method calcCircumcircle
     * @return void
     * @instance
     * @memberof Triangle
     */
    calcCircumcircle(): void;
    /**
     * Check if the passed vertex is inside this triangle's
     * circumcircle.
     *
     * @method inCircumcircle
     * @param {Vertex} v - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    inCircumcircle(v: Vertex): boolean;
    /**
     * Get the rectangular bounds for this triangle.
     *
     * @method bounds
     * @return {Bounds} - The min/max bounds of this triangle.
     * @instance
     * @memberof Triangle
     */
    bounds(): Bounds;
    /**
     * Get all line intersections with this polygon.
     *
     * This method returns all intersections (as vertices) with this shape. The returned array of vertices is in no specific order.
     *
     * See demo `47-closest-vector-projection-on-polygon` for how it works.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections within the polygon bounds.
     */
    lineIntersections(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vertex>;
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @param line
     * @param inVectorBoundsOnly
     * @returns
     */
    lineIntersectionTangents(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vector>;
    getEdgeAt(edgeIndex: number): Line;
    /**
     * Convert this triangle to a polygon instance.
     *
     * Plase note that this conversion does not perform a deep clone.
     *
     * @method toPolygon
     * @return {Polygon} A new polygon representing this triangle.
     * @instance
     * @memberof Triangle
     **/
    toPolygon(): Polygon;
    /**
     * Get the determinant of this triangle.
     *
     * @method determinant
     * @return {number} - The determinant (float).
     * @instance
     * @memberof Triangle
     */
    determinant(): number;
    /**
     * Checks if the passed vertex (p) is inside this triangle.
     *
     * Note: matrix determinants rock.
     *
     * @method containsPoint
     * @param {Vertex} p - The vertex to check.
     * @return {boolean}
     * @instance
     * @memberof Triangle
     */
    containsPoint(p: Vertex): boolean;
    /**
     * Get that inner triangle which defines the maximal incircle.
     *
     * @return {Triangle} The triangle of those points in this triangle that define the incircle.
     */
    getIncircularTriangle(): Triangle;
    /**
     * Get the incircle of this triangle. That is the circle that touches each side
     * of this triangle in exactly one point.
     *
     * Note this just calls getIncircularTriangle().getCircumcircle()
     *
     * @return {Circle} The incircle of this triangle.
     */
    getIncircle(): Circle;
    /**
     * Get the incenter of this triangle (which is the center of the circumcircle).
     *
     * Note: due to performance reasonst the incenter is buffered inside the triangle because
     *       computing it is relatively expensive. If a, b or c have changed you should call the
     *       calcCircumcircle() function first, otherwise you might get wrong results.
     * @return Vertex The incenter of this triangle.
     **/
    getIncenter(): Vertex;
    /**
     * Converts this triangle into a human-readable string.
     *
     * @method toString
     * @return {string}
     * @instance
     * @memberof Triangle
     */
    toString(): string;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    static utils: {
        max3(a: number, b: number, c: number): number;
        min3(a: number, b: number, c: number): number;
        signedArea(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number): number;
        /**
         * Used by the containsPoint() function.
         *
         * @private
         **/
        pointIsInTriangle(px: number, py: number, p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number): boolean;
        /**
         * Calculate the determinant of the three vertices a, b and c (in this order).
         * @param {XYCords} a - The first vertex.
         * @param {XYCords} b - The first vertex.
         * @param {XYCords} c - The first vertex.
         * @returns {nmber}
         */
        determinant(a: XYCoords, b: XYCoords, c: XYCoords): number;
    };
}
