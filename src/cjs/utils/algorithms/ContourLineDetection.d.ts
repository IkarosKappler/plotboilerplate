/**
 * A function to detect contour lines from 3D terrain data.
 *
 * @author  Ikaros Kappler
 * @date    2023-11-04
 * @version 1.0.0
 */
import { IDataGrid2d } from "../datastructures/DataGrid2d";
import { GenericPath } from "../datastructures/GenericPath";
export declare const CLOSE_GAP_TYPE_NONE = 0;
export declare const CLOSE_GAP_TYPE_ABOVE = 1;
export declare const CLOSE_GAP_TYPE_BELOW = 2;
export declare class ContourLineDetection {
    private dataGrid;
    private rawLinearPathSegments;
    constructor(dataGrid: IDataGrid2d<number>);
    /**
     * Rebuild the whole paths.
     */
    detectContourPaths(criticalHeightValue: number, options: {
        closeGapType: number;
    }): Array<GenericPath>;
    /**
     * This function will calculate a single intersecion line of the given face4 data
     * segment. If the given face does not intersect with the plane at the given `heightValue`
     * then `null` is returned.
     *
     * @param {number} xIndex - The x position (index) of the data face.
     * @param {number} yIndex - The y position (index) of the data face.
     * @param {[[number,number],[number,number]]} heightFace - The data sample that composes the face4 as a two-dimensional number array.
     * @param {number} heightValue - The height value of the intersection plane to check for.
     * @returns {Line|null}
     */
    private findHeightFaceIntersectionLine;
    /**
     * This procedure will look at the face4 at the ((x,y),(nextX,nextY)) position – which are four values –
     * and determines the local contour lines for these cases.
     *
     * This is used to detect and calculate edge cases on the borders of the underliying height data:
     *  * left and right border (x=0, x=data.xSegmentCount)
     *  * top and bottom border (x=y, x=data.ySegmentCount)
     *
     * Resulting path segments will be stored in the global `segments` array.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} nextX
     * @param {number} nextY
     * @param {number} criticalHeightValue
     * @param {number} closeGapType - CLOSE_GAP_TYPE_ABOVE or CLOSE_GAP_TYPE_BELOW.
     * @return {void}
     */
    detectAboveBelowLerpSegment(x: number, y: number, nextX: number, nextY: number, criticalHeightValue: number, closeGapType: number): void;
    /**
     * Checks if both value are on the same side of the critical value (above or below). The `closeGapType`
     * indictes if `CLOSE_GAP_TYPE_BELOW` or `CLOSE_GAP_TYPE_ABOVE` should be used as a rule.
     *
     * @param {number} valueA
     * @param {number} valueB
     * @param {number} criticalValue
     * @param {number} closeGapType
     * @returns {boolean}
     */
    private areBothValuesOnRequiredPlaneSide;
    /**
     * Test if a given numeric value (`curValue`) is between the given values `valA` and `valB`.
     * Value A and B don't need to be in ascending order, so `valA <= curValue <= valB` and `valB <= curvalue <= valA`
     * will do the job.
     *
     * @param {number} valA - The first of the two bounds.
     * @param {number} valB - The second of the two bounds.
     * @param {number} curValue - The value to check if it is between (or equal) to the given bounds.
     * @returns {boolean}
     */
    private isBetween;
    /**
     * Get a 'lerp' value - which is some sort of percentage/ratio for the `curValue` inside the
     * range of the given interval `[valA ... valB]`.
     *
     * Examples:
     *  * getLerpRatio(0,100,50) === 0.5
     *  * getLerpRatio(50,100,75) === 0.5
     *  * getLerpRatio(0,100,0) === 0.0
     *  * getLerpRatio(0,100,100) === 1.0
     *  * getLerpRatio(0,100,-50) === -0.5
     *
     * @param {number} valA
     * @param {number} valB
     * @param {number} curValue
     * @returns
     */
    private getLerpRatio;
    private lerp;
}
