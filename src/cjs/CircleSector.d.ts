/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-26 Fixed an error in the svg-arc-calculation (case angle<90deg and anti-clockwise).
 * @modified 2024-01-30 Added a missing type in the `describeSVGArc` function.
 * @version  1.1.2
 **/
import { Circle } from "./Circle";
import { SVGPathParams, SVGSerializable, UID, XYCoords } from "./interfaces";
/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires XYCoords
 **/
export declare class CircleSector implements SVGSerializable {
    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof CircleSector
     * @instance
     * @readonly
     */
    readonly uid: UID;
    /**
     * @member {Circle}
     * @memberof CircleSector
     * @instance
     */
    circle: Circle;
    /**
     * @member {number}
     * @memberof CircleSector
     * @instance
     */
    startAngle: number;
    /**
     * @member {number}
     * @memberof CircleSector
     * @instance
     */
    endAngle: number;
    /**
     * @member isDestroyed
     * @memberof CircleSector
     * @type {boolean}
     * @instance
     */
    isDestroyed: boolean;
    /**
     * Create a new circle sector with given circle, start- and end-angle.
     *
     * @constructor
     * @name CircleSector
     * @param {Circle} circle - The circle.
     * @param {number} startAngle - The start angle of the sector.
     * @param {number} endAngle - The end angle of the sector.
     */
    constructor(circle: Circle, startAngle: number, endAngle: number);
    /**
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     */
    destroy(): void;
    static circleSectorUtils: {
        /**
         * Helper function to convert polar circle coordinates to cartesian coordinates.
         *
         * TODO: generalize for ellipses (two radii).
         *
         * @param {number} angle - The angle in radians.
         */
        polarToCartesian: (centerX: number, centerY: number, radius: number, angle: number) => XYCoords;
        /**
         * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
         * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
         *
         * TODO: generalize for ellipses (two radii).
         *
         * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
         * @return [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
         */
        describeSVGArc: (x: number, y: number, radius: number, startAngle: number, endAngle: number, options?: {
            moveToStart: boolean;
        }) => SVGPathParams;
    };
}
