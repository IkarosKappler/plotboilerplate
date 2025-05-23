/**
 * @author   Ikaros Kappler
 * @date     2020-05-04
 * @modified 2020-05-09 Ported to typescript.
 * @modified 2020-05-25 Added the vertAt and tangentAt functions.
 * @mofidied 2020-09-07 Added the circleIntersection(Circle) function.
 * @modified 2020-09-07 Changed the vertAt function by switching sin and cos! The old version did not return the correct vertex (by angle) accoring to the assumed circle math.
 * @modified 2020-10-16 Added the containsCircle(...) function.
 * @modified 2021-01-20 Added UID.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2022-08-15 Added the `containsPoint` function.
 * @modified 2022-08-23 Added the `lineIntersection` function.
 * @modified 2022-08-23 Added the `closestPoint` function.
 * @modified 2025-04-09 Added the `Circle.move(amount: XYCoords)` method.
 * @modified 2025-04-16 Class `Circle` now implements interface `Intersectable`.
 * @version  1.5.0
 **/
import { Bounds } from "./Bounds";
import { Line } from "./Line";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { IBounded, Intersectable, SVGSerializable, UID, XYCoords } from "./interfaces";
/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
export declare class Circle implements IBounded, Intersectable, SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof Circle
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {Vertex}
     * @memberof Circle
     * @instance
     */
    center: Vertex;
    /**
     * @member {number}
     * @memberof Circle
     * @instance
     */
    radius: number;
    /**
     * @member isDestroyed
     * @memberof CubicBezierCurve
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor(center: Vertex, radius: number);
    /**
     * Move the circle by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof Circle
     * @return {Circle} this for chaining
     **/
    move(amount: XYCoords): Circle;
    /**
     * Check if the given circle is fully contained inside this circle.
     *
     * @method containsPoint
     * @param {XYCoords} point - The point to check if it is contained in this circle.
     * @instance
     * @memberof Circle
     * @return {boolean} `true` if the given point is inside this circle.
     */
    containsPoint(point: XYCoords): boolean;
    /**
     * Check if the given circle is fully contained inside this circle.
     *
     * @method containsCircle
     * @param {Circle} circle - The circle to check if it is contained in this circle.
     * @instance
     * @memberof Circle
     * @return {boolean} `true` if any only if the given circle is completely inside this circle.
     */
    containsCircle(circle: Circle): boolean;
    /**
     * Calculate the distance from this circle to the given line.
     *
     * * If the line does not intersect this ciecle then the returned
     *   value will be the minimal distance.
     * * If the line goes through this circle then the returned value
     *   will be max inner distance and it will be negative.
     *
     * @method lineDistance
     * @param {Line} line - The line to measure the distance to.
     * @return {number} The minimal distance from the outline of this circle to the given line.
     * @instance
     * @memberof Circle
     */
    lineDistance(line: VertTuple<any>): number;
    /**
     * Get the vertex on the this circle for the given angle.
     *
     * @method vertAt
     * @param {number} angle - The angle (in radians) to use.
     * @return {Vertex} The vertex (point) at the given angle.
     * @instance
     * @memberof Circle
     **/
    vertAt(angle: number): Vertex;
    /**
     * Get a tangent line of this circle for a given angle.
     *
     * Point a of the returned line is located on the circle, the length equals the radius.
     *
     * @method tangentAt
     * @instance
     * @param {number} angle - The angle (in radians) to use.
     * @return {Line} The tangent line.
     * @memberof Circle
     **/
    tangentAt(angle: number): Vector;
    /**
     * Get the bounding box (bounds) of this Circle.
     *
     * @method getBounds
     * @instance
     * @memberof Circle
     * @return {Bounds} The rectangular bounds of this Circle.
     **/
    getBounds(): Bounds;
    /**
     * Calculate the intersection points (if exists) with the given circle.
     *
     * @method circleIntersection
     * @instance
     * @memberof Circle
     * @param {Circle} circle
     * @return {Line|null} The intersection points (as a line) or null if the two circles do not intersect.
     **/
    circleIntersection(circle: Circle): Line | null;
    /**
     * Calculate the intersection points (if exists) with the given infinite line (defined by two points).
     *
     * @method lineIntersection
     * @instance
     * @memberof Circle
     * @param {Vertex} a- The first of the two points defining the line.
     * @param {XYCoords} b - The second of the two points defining the line.
     * @return {Line|null} The intersection points (as a line) or null if this circle does not intersect the line given.
     **/
    lineIntersection(a: Vertex, b: XYCoords): Line | null;
    /**
     * Get all line intersections with this circle.
     *
     * This method returns all intersections (as vertices) with this shape. The returned array of vertices is in no specific order.
     *
     * @param {VertTuple} line - The line to find intersections with.
     * @param {boolean} inVectorBoundsOnly - If set to true only intersecion points on the passed vector are returned (located strictly between start and end vertex).
     * @returns {Array<Vertex>} - An array of all intersections with the circle outline.
     */
    lineIntersections(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vertex>;
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @param line
     * @param lineIntersectionTangents
     * @returns
     */
    lineIntersectionTangents(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vector>;
    /**
     * Calculate the closest point on the outline of this circle to the given point.
     *
     * @method closestPoint
     * @instance
     * @memberof Circle
     * @param {XYCoords} vert - The point to find the closest circle point for.
     * @return {Vertex} The closest point on this circle.
     **/
    closestPoint(vert: XYCoords): Vertex;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    static circleUtils: {
        vertAt: (angle: number, radius: number) => Vertex;
    };
}
