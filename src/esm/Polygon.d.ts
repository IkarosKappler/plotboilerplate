/**
 * @author   Ikaros Kappler
 * @date     2018-04-14
 * @modified 2018-11-17 Added the containsVert function.
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-10-25 Added the scale function.
 * @modified 2019-11-06 JSDoc update.
 * @modified 2019-11-07 Added toCubicBezierPath(number) function.
 * @modified 2019-11-22 Added the rotate(number,Vertex) function.
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-10-30 Added the `addVertex` function.
 * @modified 2020-10-31 Added the `getVertexAt` function.
 * @modified 2020-11-06 Added the `move` function.
 * @modified 2020-11-10 Added the `getBounds` function.
 * @modified 2020-11-11 Generalized `move(Vertex)` to `move(XYCoords)`.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-01-29 Added the `signedArea` function (was global function in the demos before).
 * @modified 2021-01-29 Added the `isClockwise` function.
 * @modified 2021-01-29 Added the `area` function.
 * @modified 2021-01-29 Changed the param type for `containsVert` from Vertex to XYCoords.
 * @modified 2021-12-14 Added the `perimeter()` function.
 * @modified 2021-12-16 Added the `getEvenDistributionPolygon()` function.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `Polygon.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-03-08 Added the `Polygon.clone()` function.
 * @modified 2023-09-25 Added the `Polygon.getInterpolationPolygon(number)` function.
 * @modified 2023-09-25 Added the `Polygon.lineIntersections(Line,boolean)` function.
 * @modified 2023-09-29 Added the `Polygon.closestLineIntersection(Line,boolean)` function.
 * @version 1.11.0
 *
 * @file Polygon
 * @public
 **/
import { BezierPath } from "./BezierPath";
import { Bounds } from "./Bounds";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable, UID } from "./interfaces";
/**
 * @classdesc A polygon class. Any polygon consists of an array of vertices; polygons can be open or closed.
 *
 * @requires BezierPath
 * @requires Bounds
 * @requires SVGSerializabe
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 * @requires XYCoords
 */
export declare class Polygon implements SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof Polygon
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {Array<Vertex>}
     * @memberof Polygon
     * @type {Array<Vertex>}
     * @instance
     */
    vertices: Array<Vertex>;
    /**
     * @member {boolean}
     * @memberof Polygon
     * @type {boolean}
     * @instance
     */
    isOpen: boolean;
    /**
     * @member isDestroyed
     * @memberof Polygon
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * The constructor.
     *
     * @constructor
     * @name Polygon
     * @param {Vertex[]} vertices - An array of 2d vertices that shape the polygon.
     * @param {boolean} isOpen - Indicates if the polygon should be rendered as an open or closed shape.
     **/
    constructor(vertices?: Array<Vertex>, isOpen?: boolean);
    /**
     * Add a vertex to the end of the `vertices` array.
     *
     * @method addVert
     * @param {Vertex} vert - The vertex to add.
     * @instance
     * @memberof Polygon
     **/
    addVertex(vert: Vertex): void;
    /**
     * Get the polygon vertex at the given position (index).
     *
     * The index may exceed the total vertex count, and will be wrapped around then (modulo).
     *
     * For k >= 0:
     *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
     *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
     *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
     *
     * @metho getVertexAt
     * @param {number} index - The index of the desired vertex.
     * @instance
     * @memberof Polygon
     * @return {Vertex} At the given index.
     **/
    getVertexAt(index: number): Vertex;
    /**
     * Move the polygon's vertices by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this for chaining
     **/
    move(amount: XYCoords): Polygon;
    /**
     * Check if the given vertex is inside this polygon.<br>
     * <br>
     * Ray-casting algorithm found at<br>
     *    https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
     *
     * @method containsVert
     * @param {XYCoords} vert - The vertex to check. The new x-component.
     * @return {boolean} True if the passed vertex is inside this polygon. The polygon is considered closed.
     * @instance
     * @memberof Polygon
     **/
    containsVert(vert: XYCoords): boolean;
    /**
     * Calculate the area of the given polygon (unsigned).
     *
     * Note that this does not work for self-intersecting polygons.
     *
     * @method area
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    area(): number;
    /**
     * Calulate the signed polyon area by interpreting the polygon as a matrix
     * and calculating its determinant.
     *
     * @method signedArea
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    signedArea(): number;
    /**
     * Get the winding order of this polgon: clockwise or counterclockwise.
     *
     * @method isClockwise
     * @instance
     * @memberof Polygon
     * @return {boolean}
     */
    isClockwise(): boolean;
    /**
     * Get the perimeter of this polygon.
     * The perimeter is the absolute length of the outline.
     *
     * If this polygon is open then the last segment (connecting the first and the
     * last vertex) will be skipped.
     *
     * @method perimeter
     * @instance
     * @memberof Polygon
     * @return {number}
     */
    perimeter(): number;
    /**
     * Scale the polygon relative to the given center.
     *
     * @method scale
     * @param {number} factor - The scale factor.
     * @param {Vertex} center - The center of scaling.
     * @return {Polygon} this, for chaining.
     * @instance
     * @memberof Polygon
     **/
    scale(factor: number, center: Vertex): Polygon;
    /**
     * Rotate the polygon around the given center.
     *
     * @method rotate
     * @param {number} angle  - The rotation angle.
     * @param {Vertex} center - The center of rotation.
     * @instance
     * @memberof Polygon
     * @return {Polygon} this, for chaining.
     **/
    rotate(angle: number, center: Vertex): Polygon;
    /**
     * Get all line intersections with this polygon.
     *
     * See demo `47-closest-vector-projection-on-polygon` for how it works.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections within the polygon bounds.
     */
    lineIntersections(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vertex>;
    /**
     * Get the closest line-polygon-intersection point (closest the line point A).
     *
     * See demo `47-closest-vector-projection-on-polygon` for how it works.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are considered (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections within the polygon bounds.
     */
    closestLineIntersection(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Vertex | null;
    /**
     * Construct a new polygon from this polygon with more vertices on each edge. The
     * interpolation count determines the number of additional vertices on each edge.
     * An interpolation count of `0` will return a polygon that equals the source
     * polygon.
     *
     * @param {number} interpolationCount
     * @returns {Polygon} A polygon with `interpolationCount` more vertices (as as factor).
     */
    getInterpolationPolygon(interpolationCount: number): Polygon;
    /**
     * Convert this polygon into a new polygon with n evenly distributed vertices.
     *
     * @param {number} pointCount - Must not be negative.
     */
    getEvenDistributionPolygon(pointCount: number): Polygon;
    /**
     * Get the bounding box (bounds) of this polygon.
     *
     * @method getBounds
     * @instance
     * @memberof Polygon
     * @return {Bounds} The rectangular bounds of this polygon.
     **/
    getBounds(): Bounds;
    /**
     * Create a deep copy of this polygon.
     *
     * @return {Polygon} The cloned polygon.
     */
    clone(): Polygon;
    /**
     * Convert this polygon to a sequence of quadratic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are pairs of control-point-and-end-point:
     * <pre>startPoint, controlPoint0, pathPoint1, controlPoint1, pathPoint2, controlPoint2, ..., endPoint</pre>
     *
     * @method toQuadraticBezierData
     * @return {Vertex[]}  An array of 2d vertices that shape the quadratic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    toQuadraticBezierData(): Array<Vertex>;
    /**
     * Convert this polygon to a quadratic bezier curve, represented as an SVG data string.
     *
     * @method toQuadraticBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    toQuadraticBezierSVGString(): string;
    /**
     * Convert this polygon to a sequence of cubic Bézier curves.<br>
     * <br>
     * The first vertex in the returned array is the start point.<br>
     * The following sequence are triplets of (first-control-point, secnond-control-point, end-point):<br>
     * <pre>startPoint, controlPoint0_0, controlPoint1_1, pathPoint1, controlPoint1_0, controlPoint1_1, ..., endPoint</pre>
     *
     * @method toCubicBezierData
     * @param {number=} threshold - An optional threshold (default=1.0) how strong the curve segments
     *                              should over-/under-drive. Should be between 0.0 and 1.0 for best
     *                              results but other values are allowed.
     * @return {Vertex[]}  An array of 2d vertices that shape the cubic Bézier curve.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierData(threshold: number | undefined): Array<Vertex>;
    /**
     * Convert this polygon to a cubic bezier curve, represented as an SVG data string.
     *
     * @method toCubicBezierSVGString
     * @return {string} The 'd' part for an SVG 'path' element.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierSVGString(threshold: number): string;
    /**
     * Convert this polygon to a cubic bezier path instance.
     *
     * @method toCubicBezierPath
     * @param {number} threshold - The threshold, usually from 0.0 to 1.0.
     * @return {BezierPath}      - A bezier path instance.
     * @instance
     * @memberof Polygon
     **/
    toCubicBezierPath(threshold: number): BezierPath;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    static utils: {
        /**
         * Calculate the area of the given polygon (unsigned).
         *
         * Note that this does not work for self-intersecting polygons.
         *
         * @name area
         * @return {number}
         */
        area(vertices: Array<XYCoords>): number;
        /**
         * Calulate the signed polyon area by interpreting the polygon as a matrix
         * and calculating its determinant.
         *
         * @name signedArea
         * @return {number}
         */
        signedArea(vertices: Array<XYCoords>): number;
    };
}
