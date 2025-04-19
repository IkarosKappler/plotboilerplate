/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-14 Added functions `radiusH` and `radiusV`.
 * @modified 2021-02-26 Added helper function `decribeSVGArc(...)`.
 * @modified 2021-03-01 Added attribute `rotation` to allow rotation of ellipses.
 * @modified 2021-03-03 Added the `vertAt` and `perimeter` methods.
 * @modified 2021-03-05 Added the `getFoci`, `normalAt` and `tangentAt` methods.
 * @modified 2021-03-09 Added the `clone` and `rotate` methods.
 * @modified 2021-03-10 Added the `toCubicBezier` method.
 * @modified 2021-03-15 Added `VEllipse.quarterSegmentCount` and `VEllipse.scale` functions.
 * @modified 2021-03-19 Added the `VEllipse.rotate` function.
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-02-02 Cleared the `VEllipse.toSVGString` function (deprecated). Use `drawutilssvg` instead.
 * @modified 2025-03-31 ATTENTION: modified the winding direction of the `tangentAt` method to match with the Circle method. This is a breaking change!
 * @modified 2025-03-31 Adding the `VEllipse.move(amount: XYCoords)` method.
 * @modified 2025-04-19 Adding the `VEllipse.getBounds()` method.
 * @version  1.4.0
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";
import { IBounded, Intersectable, SVGSerializable, UID, XYCoords } from "./interfaces";
import { CubicBezierCurve } from "./CubicBezierCurve";
import { VertTuple } from "./VertTuple";
import { Bounds } from "./Bounds";
/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 */
export declare class VEllipse implements IBounded, Intersectable, SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof VEllipse
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {Vertex}
     * @memberof VEllipse
     * @instance
     */
    center: Vertex;
    /**
     * @member {Vertex}
     * @memberof VEllipse
     * @instance
     */
    axis: Vertex;
    /**
     * @member {number}
     * @memberof VEllipse
     * @instance
     */
    rotation: number;
    /**
     * @member isDestroyed
     * @memberof VEllipse
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center - The ellipses center.
     * @param {Vertex} axis - The x- and y-axis (the two radii encoded in a control point).
     * @param {Vertex} rotation - [optional, default=0] The rotation of this ellipse.
     * @name VEllipse
     **/
    constructor(center: Vertex, axis: Vertex, rotation?: number);
    /**
     * Clone this ellipse (deep clone).
     *
     * @return {VEllipse} A copy of this ellipse.s
     */
    clone(): VEllipse;
    /**
     * Get the non-negative horizonal radius of this ellipse.
     *
     * @method radiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned horizontal radius of this ellipse.
     */
    radiusH(): number;
    /**
     * Get the signed horizonal radius of this ellipse.
     *
     * @method signedRadiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The signed horizontal radius of this ellipse.
     */
    signedRadiusH(): number;
    /**
     * Get the non-negative vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned vertical radius of this ellipse.
     */
    radiusV(): number;
    /**
     * Get the signed vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The signed vertical radius of this ellipse.
     */
    signedRadiusV(): number;
    /**
     * Get the bounds of this ellipse.
     *
     * The bounds are approximated by the underlying segment buffer; the more segment there are,
     * the more accurate will be the returned bounds.
     *
     * @method getBounds
     * @instance
     * @memberof VEllipse
     * @return {Bounds} The bounds of this curve.
     **/
    getBounds(): Bounds;
    /**
     * Move the ellipse by the given amount. This is equivalent by moving the `center` and `axis` points.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof VEllipse
     * @return {VEllipse} this for chaining
     **/
    move(amount: XYCoords): VEllipse;
    /**
     * Scale this ellipse by the given factor from the center point. The factor will be applied to both radii.
     *
     * @method scale
     * @instance
     * @memberof VEllipse
     * @param {number} factor - The factor to scale by.
     * @return {VEllipse} this for chaining.
     */
    scale(factor: number): VEllipse;
    /**
     * Rotate this ellipse around its center.
     *
     * @method rotate
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to rotate by.
     * @returns {VEllipse} this for chaining.
     */
    rotate(angle: number): VEllipse;
    /**
     * Get the vertex on the ellipse's outline at the given angle.
     *
     * @method vertAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to determine the vertex at.
     * @return {Vertex} The vertex on the outline at the given angle.
     */
    vertAt(angle: number): Vertex;
    /**
     * Get the normal vector at the given angle.
     * The normal vector is the vector that intersects the ellipse in a 90 degree angle
     * at the given point (speicified by the given angle).
     *
     * Length of desired normal vector can be specified, default is 1.0.
     *
     * @method normalAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the normal vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    normalAt(angle: number, length?: number): Vector;
    /**
     * Get the tangent vector at the given angle.
     * The tangent vector is the vector that touches the ellipse exactly at the given given
     * point (speicified by the given angle).
     *
     * Note that the tangent is just 90 degree rotated normal vector.
     *
     * Length of desired tangent vector can be specified, default is 1.0.
     *
     * @method tangentAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the tangent vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    tangentAt(angle: number, length?: number): Vector;
    /**
     * Get the perimeter of this ellipse.
     *
     * @method perimeter
     * @instance
     * @memberof VEllipse
     * @return {number}
     */
    perimeter(): number;
    /**
     * Get the two foci of this ellipse.
     *
     * @method getFoci
     * @instance
     * @memberof VEllipse
     * @return {Array<Vertex>} An array with two elements, the two focal points of the ellipse (foci).
     */
    getFoci(): [Vertex, Vertex];
    /**
     * Get equally distributed points on the outline of this ellipse.
     *
     * @method getEquidistantVertices
     * @instance
     * @param {number} pointCount - The number of points.
     * @returns {Array<Vertex>}
     */
    getEquidistantVertices(pointCount: number): Array<Vertex>;
    /**
     * Get the line intersections as vectors with this ellipse.
     *
     * @method lineIntersections
     * @instance
     * @param {VertTuple<Vector> ray - The line/ray to intersect this ellipse with.
     * @param {boolean} inVectorBoundsOnly - (default=false) Set to true if only intersections within the vector bounds are of interest.
     * @returns
     */
    lineIntersections(ray: VertTuple<Vector>, inVectorBoundsOnly?: boolean): Array<Vertex>;
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
     * Convert this ellipse into cubic Bézier curves.
     *
     * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
     * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
     * but you might wish to use other values)
     * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing this ellipse.
     */
    toCubicBezier(quarterSegmentCount?: number, threshold?: number): Array<CubicBezierCurve>;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    /**
     * A static collection of ellipse-related helper functions.
     * @static
     */
    static utils: {
        /**
         * Calculate a particular point on the outline of the given ellipse (center plus two radii plus angle).
         *
         * @name polarToCartesian
         * @param {number} centerX - The x coordinate of the elliptic center.
         * @param {number} centerY - The y coordinate of the elliptic center.
         * @param {number} radiusH - The horizontal radius of the ellipse.
         * @param {number} radiusV - The vertical radius of the ellipse.
         * @param {number} angle - The angle (in radians) to get the desired outline point for.
         * @reutn {XYCoords} The outlont point in absolute x-y-coordinates.
         */
        polarToCartesian: (centerX: number, centerY: number, radiusH: number, radiusV: number, angle: number) => XYCoords;
        /**
         * Get the `theta` for a given `phi` (used to determine equidistant points on ellipse).
         *
         * @param radiusH
         * @param radiusV
         * @param phi
         * @returns {number} theta
         */
        phiToTheta: (radiusH: number, radiusV: number, phi: number) => number;
        /**
         * Get n equidistant points on the elliptic arc.
         *
         * @param pointCount
         * @returns
         */
        equidistantVertAngles: (radiusH: number, radiusV: number, pointCount: number) => Array<number>;
    };
}
