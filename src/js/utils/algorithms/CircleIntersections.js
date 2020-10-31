"use strict";
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
 * @file CircleIntersections
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
var arrayFill_1 = require("./arrayFill");
var matrixFill_1 = require("./matrixFill");
var Line_1 = require("../../Line");
var CircularIntervalSet_1 = require("../datastructures/CircularIntervalSet");
var CircleIntersections = /** @class */ (function () {
    function CircleIntersections() {
    }
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
    CircleIntersections.findOuterPartitions = function (circles, intervalSets) {
        // For tracking which interval we already used for detecting the partition
        // we need a matrix; find the maximal interval length.
        var maxSetLength = 0;
        for (var i = 0; i < intervalSets.length; i++) {
            maxSetLength = Math.max(maxSetLength, intervalSets[i].intervals.length);
        }
        var usedIntervals = matrixFill_1.matrixFill(intervalSets.length, maxSetLength, false);
        // Draw connected paths?
        var path = null;
        var pathList = [];
        while ((path = CircleIntersections.findOuterPartition(circles, intervalSets, usedIntervals)) != null) {
            pathList.push(path);
        }
        return pathList;
    };
    ;
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
    CircleIntersections.buildRadicalLineMatrix = function (circles) {
        var radicalLines = [];
        for (var i = 0; i < circles.length; i++) {
            if (!radicalLines[i])
                radicalLines[i] = arrayFill_1.arrayFill(circles.length, null); // Array<Line>( circles.length );
            for (var j = 0; j < circles.length; j++) {
                if (i == j)
                    continue;
                if (radicalLines[i][j])
                    continue;
                radicalLines[i][j] = circles[i].circleIntersection(circles[j]);
                // Build symmetrical matrix
                if (radicalLines[i][j]) {
                    if (!radicalLines[j])
                        radicalLines[j] = arrayFill_1.arrayFill(circles.length, null); // Array<Line>( circles.length );
                    // Use reverse line
                    radicalLines[j][i] = new Line_1.Line(radicalLines[i][j].b, radicalLines[i][j].a);
                }
            }
        }
        return radicalLines;
    };
    ;
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
    CircleIntersections.findInnerCircles = function (circles) {
        var innerCircleIndices = [];
        for (var i = 0; i < circles.length; i++) {
            for (var j = 0; j < circles.length; j++) {
                if (i == j)
                    continue;
                if (circles[j].containsCircle(circles[i])) {
                    innerCircleIndices.push(i);
                }
            }
        }
        return innerCircleIndices;
    };
    ;
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
    CircleIntersections.findOuterCircleIntervals = function (circles, intersectionMatrix) {
        var intervalSets = [];
        for (var i = 0; i < circles.length; i++) {
            intervalSets[i] = new CircularIntervalSet_1.CircularIntervalSet(0, 2 * Math.PI);
            for (var j = 0; j < circles.length; j++) {
                if (i == j)
                    continue;
                if (intersectionMatrix[i][j] !== null) {
                    // const interval : Interval = CircleIntersections.radicalLineToInterval( circle, radicalLine );
                    CircleIntersections.handleCircleInterval(circles[i], intersectionMatrix[i][j], intervalSets[i]);
                }
                else if (circles[j].containsCircle(circles[i])) {
                    intervalSets[i].clear();
                }
            }
        }
        return intervalSets;
    };
    ;
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
    CircleIntersections.findOuterPartition = function (circles, intervalSets, usedIntervals) {
        var intLocation = CircleIntersections.randomUnusedInterval(intervalSets, usedIntervals);
        var path = [];
        while (intLocation != null) {
            path.push(intLocation);
            usedIntervals[intLocation.i][intLocation.j] = true;
            intLocation = CircleIntersections.findAdjacentInterval(circles, intLocation, intervalSets, usedIntervals, 0.001);
        }
        ;
        return path.length == 0 ? null : path;
    };
    ;
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
    CircleIntersections.radicalLineToInterval = function (circle, radicalLine) {
        // Get angle sections in the circles
        var lineA = new Line_1.Line(circle.center, radicalLine.a);
        var lineB = new Line_1.Line(circle.center, radicalLine.b);
        var angleA = lineA.angle();
        var angleB = lineB.angle();
        // Map angles to [0 ... 2*PI]
        // (the angle() function might return negative angles in [-PI .. 0 .. PI])
        if (angleA < 0)
            angleA = Math.PI * 2 + angleA;
        if (angleB < 0)
            angleB = Math.PI * 2 + angleB;
        return [angleA, angleB];
    };
    ;
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
    CircleIntersections.handleCircleInterval = function (circle, radicalLine, intervalSet) {
        var interval = CircleIntersections.radicalLineToInterval(circle, radicalLine);
        intervalSet.intersect(interval[1], interval[0]);
    };
    ;
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
    CircleIntersections.randomUnusedInterval = function (intervalSets, usedIntervals) {
        for (var i = 0; i < intervalSets.length; i++) {
            for (var j = 0; j < intervalSets[i].intervals.length; j++) {
                if (!usedIntervals[i][j]) {
                    return { i: i, j: j };
                }
            }
        }
        return null;
    };
    ;
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
    CircleIntersections.findAdjacentInterval = function (circles, intLocation, intervalSets, usedIntervalSetRecords, epsilon) {
        var curInterval = intervalSets[intLocation.i].intervals[intLocation.j];
        var curEndPoint = circles[intLocation.i].vertAt(curInterval[1]);
        for (var i = 0; i < intervalSets.length; i++) {
            for (var j = 0; j < intervalSets[i].intervals.length; j++) {
                if (usedIntervalSetRecords[i][j]) {
                    continue;
                }
                var interval = intervalSets[i].intervals[j];
                var startPoint = circles[i].vertAt(interval[0]);
                if (curEndPoint.distance(startPoint) < epsilon)
                    return { i: i, j: j };
            }
        }
        return null;
    };
    ;
    return CircleIntersections;
}());
exports.CircleIntersections = CircleIntersections;
;
//# sourceMappingURL=CircleIntersections.js.map