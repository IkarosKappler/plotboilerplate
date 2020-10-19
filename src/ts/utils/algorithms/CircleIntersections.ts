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

export class CircleIntersections {

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
    static findRadicalLines( circles:Array<Circle> ) {
	var radicalLines:Array<Array<Line>> = [];
	for( var i = 0; i < circles.length; i++ ) {
	    radicalLines[i] = [];
	    for( var j = 0; j < circles.length; j++ ) {
		if( i == j )
		    continue;
		radicalLines[i][j] = circles[i].circleIntersection( circles[j] );
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
     * @param {Array<Line>} radicalLines
     * @return {Array<number>}
     **/
    static findOuterCircleIntervals( circles, radicalLines ) {
	var intervalSets = [];
	for( var i = 0; i < circles.length; i++ ) {
	    intervalSets[i] = new CircularIntervalSet( 0, 2*Math.PI );
	    for( var j = 0; j < circles.length; j++ ) {
		if( i == j )
		    continue;
		if( radicalLines[i][j] !== null ) {
		    CircleIntersections.handleCircleInterval( circles[i], radicalLines[i][j], intervalSets[i] );
		} else if( circles[j].containsCircle(circles[i]) ) {
		    intervalSets[i].clear();
		} 
	    }
	}
	return intervalSets;
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
    private static handleCircleInterval( circle, radicalLine, intervalSet ) {
	// Get angle sections in the circles
	var lineAa = new Line( circle.center, radicalLine.a );
	var lineAb = new Line( circle.center, radicalLine.b );

	var anglea = lineAa.angle();
	var angleb = lineAb.angle();

	// Map angles to [0 ... 2*PI]
	// (the angle() function might return negative angles in [-PI .. 0 .. PI])
	if( anglea < 0 ) anglea = Math.PI*2 + anglea;
	if( angleb < 0 ) angleb = Math.PI*2 + angleb;

	intervalSet.intersect( angleb, anglea );
    };
};
