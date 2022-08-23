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
 * @version  1.4.0
 **/
import { Line } from "./Line";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { SVGSerializable, UID, XYCoords } from "./interfaces";
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
export declare class Circle implements SVGSerializable {
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
     * @param {Vertex} a - The first of the two points defining the line.
     * @param {Vertex} b - The second of the two points defining the line.
     * @return {Line|null} The intersection points (as a line) or null if this circle does not intersect the line given.
     **/
    lineIntersection(a: Vertex, b: Vertex): Line | null;
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
