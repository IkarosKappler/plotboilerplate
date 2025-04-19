/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author   Ikaros Kappler
 * @date     2021-02-26
 * @modified 2022-02-02 Added the `destroy` method.
 * @modified 2022-11-01 Tweaked the `endpointToCenterParameters` function to handle negative values, too, without errors.
 * @modified 2025-04-01 Adapting a the `toCubicBezier` calculation to match an underlying change in the vertAt and tangentAt calculation of ellipses (was required to hamonize both methods with circles).
 * @modified 2025-04-02 Adding `VEllipseSector.containsAngle` method.
 * @modified 2025-04-02 Adding `VEllipseSector.lineIntersections` and `VEllipseSector.lineIntersectionTangents` and implementing `Intersectable`.
 * @modified 2025-04-07 Adding value wrapping (0 to TWO_PI) to the `VEllipseSector.containsAngle` method.
 * @modified 2025-04-09 Adding the `VEllipseSector.move` method.
 * @version  1.2.0
 */
import { CubicBezierCurve } from "./CubicBezierCurve";
import { SVGPathParams, UID, XYCoords } from "./interfaces";
import { Vector } from "./Vector";
import { VEllipse } from "./VEllipse";
import { Vertex } from "./Vertex";
import { VertTuple } from "./VertTuple";
/**
 * @classdesc A class for elliptic sectors.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
export declare class VEllipseSector {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof VEllipseSector
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {VEllipse}
     * @memberof VEllipseSector
     * @instance
     */
    ellipse: VEllipse;
    /**
     * @member {number}
     * @memberof VEllipseSector
     * @instance
     */
    startAngle: number;
    /**
     * @member {number}
     * @memberof VEllipseSector
     * @instance
     */
    endAngle: number;
    /**
     * @member isDestroyed
     * @memberof VEllipseSector
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * Create a new elliptic sector from the given ellipse and two angles.
     *
     * Note that the direction from start to end goes clockwise, and that start and end angle
     * will be wrapped to [0,PI*2).
     *
     * @constructor
     * @name VEllipseSector
     * @param {VEllipse} - The underlying ellipse to use.
     * @param {number} startAngle - The start angle of the sector.
     * @param {numner} endAngle - The end angle of the sector.
     */
    constructor(ellipse: VEllipse, startAngle: number, endAngle: number);
    /**
     * Move the ellipse sector by the given amount.
     *
     * @method move
     * @param {XYCoords} amount - The amount to move.
     * @instance
     * @memberof VEllipseSector
     * @return {VEllipseSector} this for chaining
     **/
    move(amount: XYCoords): VEllipseSector;
    /**
     * Checks wether the given angle (must be inside 0 and PI*2) is contained inside this sector.
     *
     * @param {number} angle - The numeric angle to check.
     * @method containsAngle
     * @instance
     * @memberof VEllipseSectpr
     * @return {boolean} True if (and only if) this sector contains the given angle.
     */
    containsAngle(angle: number): boolean;
    /**
     * Get the sectors starting point (on the underlying ellipse, located at the start angle).
     *
     * @method getStartPoint
     * @instance
     * @memberof VEllipseSector
     * @return {Vertex} The sector's stating point.
     */
    getStartPoint(): Vertex;
    /**
     * Get the sectors ending point (on the underlying ellipse, located at the end angle).
     *
     * @method getEndPoint
     * @instance
     * @memberof VEllipseSector
     * @return {Vertex} The sector's ending point.
     */
    getEndPoint(): Vertex;
    /**
     * Get the line intersections as vectors with this ellipse.
     *
     * @method lineIntersections
     * @instance
     * @memberof VEllipseSectpr
     * @param {VertTuple<Vector>} ray - The line/ray to intersect this ellipse with.
     * @param {boolean} inVectorBoundsOnly - (default=false) Set to true if only intersections within the vector bounds are of interest.
     * @returns
     */
    lineIntersections(ray: VertTuple<Vector>, inVectorBoundsOnly?: boolean): Array<Vertex>;
    /**
     * Get all line intersections of this polygon and their tangents along the shape.
     *
     * This method returns all intersection tangents (as vectors) with this shape. The returned array of vectors is in no specific order.
     *
     * @method lineIntersections
     * @memberof VEllipseSectpr
     * @param line
     * @param lineIntersectionTangents
     * @returns
     */
    lineIntersectionTangents(line: VertTuple<any>, inVectorBoundsOnly?: boolean): Array<Vector>;
    /**
     * Convert this elliptic sector into cubic Bézier curves.
     *
     * @param {number=3} quarterSegmentCount - The number of segments per base elliptic quarter (default is 3, min is 1).
     * @param {number=0.666666} threshold - The Bézier threshold (default value 0.666666 approximates the ellipse with best results
     * but you might wish to use other values)
     * @return {Array<CubicBezierCurve>} An array of cubic Bézier curves representing the elliptic sector.
     */
    toCubicBezier(quarterSegmentCount?: number, threshold?: number): Array<CubicBezierCurve>;
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    static ellipseSectorUtils: {
        /**
         * Helper function to convert an elliptic section to SVG arc params (for the `d` attribute).
         * Inspiration found at:
         *    https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         *
         * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
         * @return [ 'A', radiusH, radiusV, rotation, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
         */
        describeSVGArc: (x: number, y: number, radiusH: number, radiusV: number, startAngle: number, endAngle: number, rotation?: number, options?: {
            moveToStart: boolean;
        }) => SVGPathParams;
        /**
         * Helper function to find second-kind elliptic angles, so that the euclidean distance along the the
         * elliptic sector is the same for all.
         *
         * Note that this is based on the full ellipse calculuation and start and end will be cropped; so the
         * distance from the start angle to the first angle and/or the distance from the last angle to
         * the end angle may be different to the others.
         *
         * Furthermore the computation is only possible on un-rotated ellipses; if your source ellipse has
         * a rotation on the plane please 'rotate' the result angles afterwards to find matching angles.
         *
         * Returned angles are normalized to the interval `[ 0, PI*2 ]`.
         *
         * @param {number} radiusH - The first (horizonal) radius of the ellipse.
         * @param {number} radiusV - The second (vertical) radius of the ellipse.
         * @param {number} startAngle - The opening angle of your elliptic sector (please use normalized angles).
         * @param {number} endAngle - The closing angle of your elliptic sector (please use normalized angles).
         * @param {number} fullEllipsePointCount - The number of base segments to use from the source ellipse (12 or 16 are good numbers).
         * @return {Array<number>} An array of n angles inside startAngle and endAngle (where n <= fullEllipsePointCount).
         */
        equidistantVertAngles: (radiusH: number, radiusV: number, startAngle: number, endAngle: number, fullEllipsePointCount: number) => Array<number>;
        findClosestToStartAngle: (startAngle: number, endAngle: number, ellipseAngles: Array<number>) => number;
        normalizeAngle: (angle: number) => number;
        /**
         * Convert the elliptic arc from endpoint parameters to center parameters as described
         * in the w3c svg arc implementation note.
         *
         * https://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
         *
         * @param {number} x1 - The x component of the start point (end of last SVG command).
         * @param {number} y1 - The y component of the start point (end of last SVG command).
         * @param {number} rx - The first (horizontal) radius of the ellipse.
         * @param {number} ry - The second (vertical) radius of the ellipse.
         * @param {number} phi - The ellipse's rotational angle (angle of axis rotation) in radians (not in degrees as the SVG command uses!)
         * @param {boolean} fa - The large-arc-flag (boolean, not 0 or 1).
         * @param {boolean} fs - The sweep-flag (boolean, not 0 or 1).
         * @param {number} x2 - The x component of the end point (end of last SVG command).
         * @param {number} y2 - The y component of the end point (end of last SVG command).
         * @returns
         */
        endpointToCenterParameters(x1: number, y1: number, rx: number, ry: number, phi: number, fa: boolean, fs: boolean, x2: number, y2: number): VEllipseSector;
    };
}
