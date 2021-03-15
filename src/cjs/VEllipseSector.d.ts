/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author  Ikaros Kappler
 * @date    2021-02-26
 * @version 1.0.0
 */
import { CubicBezierCurve } from "./CubicBezierCurve";
import { SVGPathParams, UID } from "./interfaces";
import { VEllipse } from "./VEllipse";
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
     * Create a new elliptic sector from the given ellipse and two angles.
     *
     * Note that the direction from start to end goes clockwise.
     *
     * @constructor
     * @name VEllipseSector
     * @param {VEllipse} - The underlying ellipse to use.
     * @param {number} startAngle - The start angle of the sector.
     * @param {numner} endAngle - The end angle of the sector.
     */
    constructor(ellipse: VEllipse, startAngle: number, endAngle: number);
    toCubicBezier(quarterSegmentCount?: number, threshold?: number): CubicBezierCurve[];
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
        mapAngle: (angle: number) => number;
    };
}
