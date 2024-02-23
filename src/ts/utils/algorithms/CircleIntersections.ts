/**
 * @author   Ikaros Kappler
 * @date     2020-10-05
 * @modified 2021-02-08 Fixed a lot of es2015 compatibility issues.
 * @modified 2024-02-23 Fixed some null-type conflicts.
 * @version  1.0.2
 * @file CircleIntersections
 * @public
 **/

import { arrayFill } from "./arrayFill";
import { matrixFill } from "./matrixFill";
import { Circle } from "../../Circle";
import { CircleSector } from "../../CircleSector";
import { Line } from "../../Line";
import { CircularIntervalSet } from "../datastructures/CircularIntervalSet";
import { Interval, IndexPair, Matrix } from "../datastructures/interfaces";

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
export class CircleIntersections {
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
  static findOuterPartitions(circles: Array<Circle>, intervalSets: Array<CircularIntervalSet>): Array<Array<IndexPair>> {
    // For tracking which interval we already used for detecting the partition
    // we need a matrix; find the maximal interval length.
    let maxSetLength: number = 0;
    for (var i = 0; i < intervalSets.length; i++) {
      maxSetLength = Math.max(maxSetLength, intervalSets[i].intervals.length);
    }
    const usedIntervals: Matrix<boolean> = matrixFill<boolean>(intervalSets.length, maxSetLength, false);

    var path: Array<IndexPair> | null = null;
    var pathList: Array<Array<IndexPair>> = [];
    while ((path = CircleIntersections.findOuterPartition(circles, intervalSets, usedIntervals)) != null) {
      pathList.push(path);
    }

    return pathList;
  }

  /**
   * Find all connected outer path partitions (as CircleSectors).
   *
   * @method findOuterPartitionsAsSectors
   * @static
   * @memberof CircleIntersections
   * @param {Array<Circle>} circles - The circles to find intersections for.
   * @param {Array<CircularIntervalSet>} intervalSets - The determined interval sets (see `findOuterCircleIntervals`).
   * @return {Array<Array<CircleSector>>} An array of paths, each defined by a sequence of SircleSectors.
   **/
  static findOuterPartitionsAsSectors(
    circles: Array<Circle>,
    intervalSets: Array<CircularIntervalSet>
  ): Array<Array<CircleSector>> {
    const partitions: Array<Array<IndexPair>> = CircleIntersections.findOuterPartitions(circles, intervalSets);

    const partitionsAsArcs: Array<Array<CircleSector>> = [];
    for (var p = 0; p < partitions.length; p++) {
      const path: Array<IndexPair> = partitions[p];
      const pathAsArcs: Array<CircleSector> = [];
      for (var i = 0; i < path.length; i++) {
        const circleIndex: number = path[i].i;
        const circle: Circle = circles[circleIndex];
        var interval = intervalSets[path[i].i].intervals[path[i].j];
        // Params: circle, startAngle, endAngle
        pathAsArcs.push(new CircleSector(circle, interval[0], interval[1]));
      } // END for
      partitionsAsArcs.push(pathAsArcs);
    } // END for
    return partitionsAsArcs;
  }

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
  static buildRadicalLineMatrix(circles: Array<Circle>): Matrix<Line | null> {
    var radicalLines: Array<Array<Line | null>> = [];
    for (var i = 0; i < circles.length; i++) {
      if (!radicalLines[i]) {
        radicalLines[i] = arrayFill<Line | null>(circles.length, null);
      }
      for (var j = 0; j < circles.length; j++) {
        if (i == j) continue;
        if (radicalLines[i][j]) continue;
        radicalLines[i][j] = circles[i].circleIntersection(circles[j]);
        // Build symmetrical matrix
        var tmpRadLine = radicalLines[i][j];
        if (tmpRadLine) {
          if (!radicalLines[j]) {
            radicalLines[j] = arrayFill<Line | null>(circles.length, null);
          }
          // Use reverse line
          radicalLines[j][i] = new Line(tmpRadLine.b, tmpRadLine.a);
        }
      }
    }
    return radicalLines;
  }

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
  static findInnerCircles(circles: Array<Circle>): Array<number> {
    const innerCircleIndices: Array<number> = [];
    for (var i = 0; i < circles.length; i++) {
      for (var j = 0; j < circles.length; j++) {
        if (i == j) continue;
        if (circles[j].containsCircle(circles[i])) {
          innerCircleIndices.push(i);
        }
      }
    }
    return innerCircleIndices;
  }

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
  static findOuterCircleIntervals(circles: Array<Circle>, intersectionMatrix: Matrix<Line>): Array<CircularIntervalSet> {
    const intervalSets: Array<CircularIntervalSet> = [];
    for (var i = 0; i < circles.length; i++) {
      intervalSets[i] = new CircularIntervalSet(0, 2 * Math.PI);
      for (var j = 0; j < circles.length; j++) {
        if (i == j) continue;
        if (intersectionMatrix[i][j] !== null) {
          // const interval : Interval = CircleIntersections.radicalLineToInterval( circle, radicalLine );
          CircleIntersections.handleCircleInterval(circles[i], intersectionMatrix[i][j], intervalSets[i]);
        } else if (circles[j].containsCircle(circles[i])) {
          intervalSets[i].clear();
        }
      }
    }
    return intervalSets;
  }

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
  static findOuterPartition(
    circles: Array<Circle>,
    intervalSets: Array<CircularIntervalSet>,
    usedIntervals: Matrix<boolean>
  ): Array<IndexPair> | null {
    let intLocation: IndexPair | null = CircleIntersections.randomUnusedInterval(intervalSets, usedIntervals);
    const path: Array<IndexPair> = [];
    while (intLocation != null) {
      path.push(intLocation);
      usedIntervals[intLocation.i][intLocation.j] = true;
      intLocation = CircleIntersections.findAdjacentInterval(circles, intLocation, intervalSets, usedIntervals, 0.001);
    }
    return path.length == 0 ? null : path;
  }

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
  private static radicalLineToInterval(circle: Circle, radicalLine: Line): Interval {
    // Get angle sections in the circles
    const lineA: Line = new Line(circle.center, radicalLine.a);
    const lineB: Line = new Line(circle.center, radicalLine.b);

    let angleA: number = lineA.angle();
    let angleB: number = lineB.angle();

    // Map angles to [0 ... 2*PI]
    // (the angle() function might return negative angles in [-PI .. 0 .. PI])
    if (angleA < 0) angleA = Math.PI * 2 + angleA;
    if (angleB < 0) angleB = Math.PI * 2 + angleB;

    return [angleA, angleB];
  }

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
  private static handleCircleInterval(circle: Circle, radicalLine: Line, intervalSet: CircularIntervalSet): void {
    const interval: Interval = CircleIntersections.radicalLineToInterval(circle, radicalLine);
    intervalSet.intersect(interval[1], interval[0]);
  }

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
  private static randomUnusedInterval(
    intervalSets: Array<CircularIntervalSet>,
    usedIntervals: Matrix<boolean>
  ): IndexPair | null {
    for (var i = 0; i < intervalSets.length; i++) {
      for (var j = 0; j < intervalSets[i].intervals.length; j++) {
        if (!usedIntervals[i][j]) {
          return { i: i, j: j };
        }
      }
    }
    return null;
  }

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
  private static findAdjacentInterval(
    circles: Array<Circle>,
    intLocation: IndexPair,
    intervalSets: Array<CircularIntervalSet>,
    usedIntervalSetRecords: Matrix<boolean>,
    epsilon: number
  ) {
    var curInterval = intervalSets[intLocation.i].intervals[intLocation.j];
    var curEndPoint = circles[intLocation.i].vertAt(curInterval[1]);
    for (var i = 0; i < intervalSets.length; i++) {
      for (var j = 0; j < intervalSets[i].intervals.length; j++) {
        if (usedIntervalSetRecords[i][j]) {
          continue;
        }
        var interval = intervalSets[i].intervals[j];
        var startPoint = circles[i].vertAt(interval[0]);
        if (curEndPoint.distance(startPoint) < epsilon) return { i: i, j: j };
      }
    }
    return null;
  }
}
