/**
 * @author   Ikaros Kappler
 * @date     2020-10-05
 * @version  1.0.0
 * @file CircleIntersections
 * @public
 **/
import { Circle } from "../../Circle";
import { CircleSector } from "../../CircleSector";
import { Line } from "../../Line";
import { CircularIntervalSet } from "../datastructures/CircularIntervalSet";
import { IndexPair, Matrix } from "../datastructures/interfaces";
/**
 * @classdesc A script for finding the intersection points of two or
 * multiple circles (the 'radical lines').
 *
 * Based on the C++ implementation by Robert King
 *    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
 * and the 'Circles and spheres' article by Paul Bourke.
 *    http://paulbourke.net/geometry/circlesphere/
 *
 * @requires arrayFill
 * @requires matrixFill
 * @requires Circle
 * @requires IndexPair
 * @requires Matrix
 * @requires Interval
 * @requires Line
 * @requires CirularIntervalSet
 */
export declare class CircleIntersections {
    /**
     * Find all connected outer path partitions.
     *
     * @method findOuterPartitions
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @param {Array<CircularIntervalSet>} intervalSets - The determined interval sets (see `findOuterCircleIntervals`).
     * @return {Array<Array<IndexPair>>} An array of paths, each defined by a sequence of IndexPairs adressing circle i and interval j.
     **/
    static findOuterPartitions(circles: Array<Circle>, intervalSets: Array<CircularIntervalSet>): Array<Array<IndexPair>>;
    /**
     * Find all connected outer path partitions (as CirclePartitions).
     *
     * @method findOuterPartitionsAsSectors
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @param {Array<CircularIntervalSet>} intervalSets - The determined interval sets (see `findOuterCircleIntervals`).
     * @return {Array<Array<IndexPair>>} An array of paths, each defined by a sequence of IndexPairs adressing circle i and interval j.
     **/
    static findOuterPartitionsAsSectors(circles: Array<Circle>, intervalSets: Array<CircularIntervalSet>): Array<Array<CircleSector>>;
    /**
     * Build the n*n intersection matrix: contains the radical line at (i,j) if circle i and circle j do intersect;
     * conatins null at (i,j) otherwise.
     *
     * Note that this matrix is symmetrical: if circles (i,j) intersect with line (A,B), then also circles (j,i) intersect
     * with line (B,A).
     *
     * The returned two-dimensional matrix (array) has exactly as many entries as the passed circle array.
     *
     * @method buildRadicalLineMatrix
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @return {Array<Array<Line>>} A 2d-matrix containing the radical lines where circles intersect.
     **/
    static buildRadicalLineMatrix(circles: Array<Circle>): Matrix<Line>;
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
    static findInnerCircles(circles: any): Array<number>;
    /**
     * Calculate all outer circle intervals (sections that belong to the outermost line), dermined by the given
     * circles and their radical lines.
     *
     * The returned array contains IntervalSets - one for each circle - indicating the remaining circle sections.
     *
     * @method findOuterCircleIntervals
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @param {Array<Line>} intersectionMatrix
     * @return {Array<number>}
     **/
    static findOuterCircleIntervals(circles: Array<Circle>, intersectionMatrix: Matrix<Line>): Array<CircularIntervalSet>;
    /**
     * Calculate the next connected partition from the given set of circles and outer path intervals. The function
     * will pick a random unused circle interval and detect all adjacent intervals until a closed partition
     * was found.
     *
     * If an interval (circle section) was already visited will be stored in the `usedIntervalSetRecords` matrix (thus
     * is must be large enough to map all sections).
     *
     * The returned array contains IndexPairs (i,j) - one for each circle i - indicating the used circle section j.
     *
     * @method findOuterPartition
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @param {Array<CircularIntervalSet>} intervalSets - The circle intervals that form the intersection outline.
     * @param {Matrix<boolean>} usedIntervals - A matrix for remembering which circle intervals were always used.
     * @return {Array<Indexpair>|null} The next partition or `null` if no more can be found.
     **/
    static findOuterPartition(circles: Array<Circle>, intervalSets: Array<CircularIntervalSet>, usedIntervals: Matrix<boolean>): Array<IndexPair> | null;
    /**
     * Convert a radical line (belonging to a circle) into an interval: start angle and end angle.
     *
     * @method radicalLineToInterval
     * @static
     * @private
     * @memberof CircleIntersections
     * @param {Circle} circle - The circle itself.
     * @param {Line} radicaLine - The radical line to convert (must have two intersection points on the circle).
     * @return {Interval} The interval `[startAngle,endAngle]` determined by the radical line.
     **/
    private static radicalLineToInterval;
    /**
     * This is a helper fuction used by `findOuterCircleIntervals`.
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
    /**
     * Pick a random unused circle interval. This function is used by the `findOuterPartition` function, which
     * starts the detection with any random section.
     *
     * @method randomUnusedInterval
     * @static
     * @private
     * @memberof CircleIntersections
     * @param {Array<CircularIntervalSet>} intervalSets - An array of all available interval sets/intervals.
     * @param {Matrix<boolean>} usedIntervals - A matrix indicating which intervals have already been used/visited by the algorithm
     * @return {IndexPair|null}
     **/
    private static randomUnusedInterval;
    /**
     * Find the next adjacent circle interval for the given interval.
     * starts the detection with any random section.
     *
     * @method randomUnusedInterval
     * @static
     * @private
     * @memberof CircleIntersections
     * @param {Array<CircularIntervalSet>} intervalSets - An array of all available interval sets/intervals.
     * @param {Matrix<boolean>} usedIntervals - A matrix indicating which intervals have already been used/visited by the algorithm
     * @return {IndexPair|null}
     **/
    private static findAdjacentInterval;
}
