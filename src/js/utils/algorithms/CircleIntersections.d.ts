/**
 * @classdesc A script for finding the intersection points of two circles (the 'radical line').
 *
 * Based on the C++ implementation by Robert King
 *    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
 * and the 'Circles and spheres' article by Paul Bourke.
 *    http://paulbourke.net/geometry/circlesphere/
 *
 * @requires Circle
 * @requires Line
 * @requires CirularIntervalSet
 *
 * @author   Ikaros Kappler
 * @date     2020-10-05
 * @version  1.0.0
 * @name CircleIntersections
 **/
import { Circle } from "../../Circle";
import { Line } from "../../Line";
export declare class CircleIntersections {
    /**
     * Get the radical lines of all circle intersections.
     *
     * The returned two-dimensional array has exactly as much entries as the passed circle array.
     *
     * @method findRadicalLines
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @return {Array<Array<Line>>}
     **/
    static findRadicalLines(circles: Array<Circle>): Line[][];
    /**
     * Find all circles (indices) which are completely located inside another circle.
     *
     * The returned array conatins the array indices.
     *
     * @method findInnerCircles
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @return {Array<number>}
     **/
    static findInnerCircles(circles: any): any[];
    /**
     * Calculate all circles intervals, dermined by the given circles and their radical lines.
     *
     * The returned array contains IntervalSets - one for each circle - indicating the remaining circle sections.
     *
     * @method findOuterCircleIntervals
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @param {Array<Line>} radicalLines
     * @return {Array<number>}
     **/
    static findOuterCircleIntervals(circles: any, radicalLines: any): any[];
    /**
     * This is a helper fuction used by `findCircleIntervals`.
     *
     * It applies the passed radical line by intersecting the remaining circle sections with the new section.
     *
     * @method handleCircleInterval
     * @static
     * @private
     * @memberof CircleIntersections
     * @param {Circle} circle - The circles to find intersections for.
     * @param {Line} radicalLine - The radical line to apply.
     * @param {CircularIntervalSet} intervalSet - The CircularIntervalSet to use (must have left and right border: 0 and 2*PI).
     * @return {void}
     **/
    private static handleCircleInterval;
}
