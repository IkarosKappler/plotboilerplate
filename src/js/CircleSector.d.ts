/**
 * @author   Ikaros Kappler
 * @version  1.0.0
 * @date     2020-12-17
 **/
import { Circle } from "./Circle";
import { SVGPathParams, SVGSerializable, XYCoords } from "./interfaces";
export declare type SVGArcPathParams = [string, number, number, number, number, number, number, number];
/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires XYCoords
 **/
export declare class CircleSector implements SVGSerializable {
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
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className: string;
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
      * Create an SVG representation of this circle.
      *
      * @method toSVGString
      * @param {object=} options - An optional set of options, like 'className'.
      * @return {string} A string representing the SVG code for this vertex.
      * @instance
      * @memberof Circle
      */
    toSVGString(options: {
        className?: string;
    }): string;
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
