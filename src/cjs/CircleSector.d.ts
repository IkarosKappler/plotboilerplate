/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-26 Fixed an error in the svg-arc-calculation (case angle<90deg and anti-clockwise).
 * @modified 2024-01-30 Added a missing type in the `describeSVGArc` function.
 * @modified 2024-03-01 Added the `getStartPoint` and `getEndPoint` methods.
 * @modified 2024-03-08 Added the `containsAngle` method.
 * @modified 2024-03-09 Added the `circleSectorIntersection` method to find coherent sector intersections..
 * @modified 2024-03-09 Added the `angleAt` method to determine any angle at some ratio.
 * @version  1.2.0
 **/
import { Circle } from "./Circle";
import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
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
     * Checks wether the given angle (must be inside 0 and PI*2) is contained inside this sector.
     *
     * @param {number} angle - The numeric angle to check.
     * @method containsAngle
     * @instance
     * @memberof CircleSector
     * @return {boolean} True if (and only if) this sector contains the given angle.
     */
    containsAngle(angle: number): boolean;
    /**
     * Get the angle inside this sector for a given ratio. 0.0 means startAngle, and 1.0 means endAngle.
     *
     * @param {number} t - The ratio inside [0..1].
     * @method angleAt
     * @instance
     * @memberof CircleSector
     * @return {number} The angle inside this sector at a given ratio.
     */
    angleAt(t: number): number;
    /**
     * Get the sectors starting point (on the underlying circle, located at the start angle).
     *
     * @method getStartPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's stating point.
     */
    getStartPoint(): Vertex;
    /**
     * Get the sectors ending point (on the underlying circle, located at the end angle).
     *
     * @method getEndPoint
     * @instance
     * @memberof CircleSector
     * @return {Vertex} The sector's ending point.
     */
    getEndPoint(): Vertex;
    /**
     * Calculate the intersection of this circle sector and some other sector.
     *
     * If the two sectors do not corerently intersect (when not both points of the
     * radical line are containted in both source sectors) then null is returned.
     *
     * See demo/53-circle-sector-intersections for a geometric visualisation.
     *
     * @method circleSectorIntersection
     * @instance
     * @memberof CircleSector
     * @return {CircleSector | null} The intersecion of both sectors or null if they don't intersect.
     */
    circleSectorIntersection(sector: CircleSector): CircleSector | null;
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
     * This function should invalidate any installed listeners and invalidate this object.
     * After calling this function the object might not hold valid data any more and
     * should not be used.
     *
     * @method destroy
     * @instance
     * @memberof CircleSector
     * @return {void}
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
