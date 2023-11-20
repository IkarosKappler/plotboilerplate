/**
 * A function to detect contour lines from 3D terrain data.
 *
 * For usage see demo `./demos/48-contour-plot`.
 *
 * @requires detectPaths
 * @requires GenericPath
 * @author  Ikaros Kappler
 * @date    2023-11-05
 * @version 1.0.0
 */
import { Line } from "../../Line";
import { IDataGrid2d } from "../datastructures/DataGrid2d";
import { GenericPath } from "../datastructures/GenericPath";
export declare class ContourLineDetection {
    private dataGrid;
    private rawLinearPathSegments;
    static CLOSE_GAP_TYPE_NONE: number;
    static CLOSE_GAP_TYPE_ABOVE: number;
    static CLOSE_GAP_TYPE_BELOW: number;
    constructor(dataGrid: IDataGrid2d<number>);
    /**
     * Detect contour paths from the underlying data source.
     *
     * @param {number} criticalHeightValue - The height value. If above data's maximum or below data's minimum then the result will be empty (no intersections).
     * @param {number} options.closeGapType - `CLOSE_GAP_TYPE_NONE` or `CLOSE_GAP_TYPE_ABOVE` or `CLOSE_GAP_TYPE_BELOW`.
     * @param {boolean=false} options.useTriangles - If set to true the detection will split each face3 quad into two triangle faces.
     * @param {pathDetectEpsilon=0.000001} options.pathDetectEpsilon - (optional) The epsilon to tell if two points are located 'in the same place'. Used for connected path detection. If not specified the value `0.0000001` is used.
     * @param {function?} onRawSegmentsDetected - (optional) Get the interim result of all detected single lines before path detection starts; DO NOT MODIFY the array.
     * @returns {Array<GenericPath>} - A list of connected paths that resemble the contour lines of the data/terrain at the given height value.
     */
    detectContourPaths(criticalHeightValue: number, options?: {
        closeGapType: number;
        useTriangles?: boolean;
        pathDetectEpsilon?: number;
        onRawSegmentsDetected?: (rawSegmentsDoNotModifiy: Array<Line>) => void;
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
    private findHeight4FaceIntersectionLine;
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
    private findHeightFaceIntersectionLines;
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
    private findHeighteFace3IntersectionLine;
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
