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
import { CircularIntervalSet } from "../datastructures/CircularIntervalSet";

type Interval = [ number, number ];

/*
export interface ICircleIntersecion {
    line : Line;
    interval : Interval;
}; */

export type Matrix<T> = Array<Array<T>>;

export class CircleIntersections {

    /**
     * Build the n*n intersection matrix: contains the radical line at (i,j) if circle i and circle j do intersect.
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
    static buildRadicalLineMatrix( circles:Array<Circle> ) : Matrix<Line> {
	var radicalLines:Array<Array<Line>> = [];
	for( var i = 0; i < circles.length; i++ ) {
	    if( !radicalLines[i] )
		radicalLines[i] = CircleIntersections.arrayFill( circles.length, null ); // Array<Line>( circles.length );
	    for( var j = 0; j < circles.length; j++ ) {
		if( i == j )
		    continue;
		if( radicalLines[i][j] )
		    continue;
		radicalLines[i][j] = circles[i].circleIntersection( circles[j] );
		// Build symmetrical matrix
		if( radicalLines[i][j] ) {
		    if( !radicalLines[j] )
			radicalLines[j] = Array<Line>( circles.length );
		    // Use reverse line
		    radicalLines[j][i] = new Line( radicalLines[i][j].b, radicalLines[i][j].a );
		}
	    }
	}
	return radicalLines;
    };


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
    static findInnerCircles( circles ) {
	var innerCircleIndices = [];
	for( var i = 0; i < circles.length; i++ ) {
	    for( var j = 0; j < circles.length; j++ ) {
		if( i == j )
		    continue;
		if( circles[j].containsCircle(circles[i]) ) {
		    innerCircleIndices.push( i );
		}
	    }
	}
	return innerCircleIndices;
    };

    
    /**
     * Calculate all circles intervals, dermined by the given circles and their radical lines.
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
    static findOuterCircleIntervals( circles:Array<Circle>, intersectionMatrix: Matrix<Line> ) : Array<CircularIntervalSet> {
	const intervalSets : Array<CircularIntervalSet> = [];
	for( var i = 0; i < circles.length; i++ ) {
	    intervalSets[i] = new CircularIntervalSet( 0, 2*Math.PI );
	    for( var j = 0; j < circles.length; j++ ) {
		if( i == j )
		    continue;
		if( intersectionMatrix[i][j] !== null ) {
		    CircleIntersections.handleCircleInterval( circles[i], intersectionMatrix[i][j], intervalSets[i] );
		} else if( circles[j].containsCircle(circles[i]) ) {
		    intervalSets[i].clear();
		} 
	    }
	}
	return intervalSets;
    };


    /**
     * Calculate all circles intervals, dermined by the given circles and their radical lines.
     *
     * The returned array contains IntervalSets - one for each circle - indicating the remaining circle sections.
     *
     * @method 
     * @static
     * @memberof CircleIntersections
     * @param {Array<Circle>} circles - The circles to find intersections for.
     * @param {Array<Line>} intersectionMatrix
     * @return {Array<number>}
     **/
    static convertRadicalLinesToAngles( circles:Array<Circle>, radicalLineMatrix: Matrix<Line> ) : Matrix<Interval> {
	const angleMatrix : Matrix<Interval> = Array( circles.length );
	for( var i = 0; i < circles.length; i++ ) {
	    angleMatrix[i] = CircleIntersections.arrayFill( circles.length, null );
	    for( var j = 0; j < circles.length; j++ ) {
		if( i == j )
		    continue;
		if( radicalLineMatrix[i][j] ) {
		    // CircleIntersections.handleCircleInterval( circles[i], radicalLineMatrix[i][j], intervalSets[i] );#
		    const interval : Interval = CircleIntersections.radicalLineToAngle( circles[i], radicalLineMatrix[i][j] );
		    angleMatrix[i][j] = interval;
		}
	    }
	}
	return angleMatrix;
    };


    private static radicalLineToAngle( circle:Circle, radicalLine:Line ) : Interval {
	// Get angle sections in the circles
	var lineAa = new Line( circle.center, radicalLine.a );
	var lineAb = new Line( circle.center, radicalLine.b );

	var anglea = lineAa.angle();
	var angleb = lineAb.angle();

	// Map angles to [0 ... 2*PI]
	// (the angle() function might return negative angles in [-PI .. 0 .. PI])
	if( anglea < 0 ) anglea = Math.PI*2 + anglea;
	if( angleb < 0 ) angleb = Math.PI*2 + angleb;

	// intervalSet.intersect( angleb, anglea );
	return [anglea, angleb];
    };
    

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
    // TODO delete this method (only used once and only two lines)
    private static handleCircleInterval( circle, radicalLine, intervalSet ) {
	// Get angle sections in the circles
	/*
	var lineAa = new Line( circle.center, radicalLine.a );
	var lineAb = new Line( circle.center, radicalLine.b );

	var anglea = lineAa.angle();
	var angleb = lineAb.angle();

	// Map angles to [0 ... 2*PI]
	// (the angle() function might return negative angles in [-PI .. 0 .. PI])
	if( anglea < 0 ) anglea = Math.PI*2 + anglea;
	if( angleb < 0 ) angleb = Math.PI*2 + angleb;
	*/

	const interval : Interval = CircleIntersections.radicalLineToAngle( circle, radicalLine );

	// intervalSet.intersect( angleb, anglea );
	intervalSet.intersect( interval[1], interval[0] );
    };

    public static arrayFill<T extends any>( count:number, initialValue:T ) : Array<T> {
	const arr : Array<T> = Array<T>( count );
	for( var i = 0; i < count; i++ )
	    arr[i] = initialValue;
	return arr;
    };

    public static matrixFill<T extends any>( countA:number, countB:number, initialValue:T ) : Matrix<T> {
	const arr : Matrix<T> = Array<Array<T>>( countA );
	for( var i = 0; i < countA; i++ ) {
	    arr[i] = CircleIntersections.arrayFill( countB, initialValue );
	}
	return arr;
    };

};
