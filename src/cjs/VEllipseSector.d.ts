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
    toCubicBezier(segmentCount?: number, threshold?: number): CubicBezierCurve[];
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
    };
}
