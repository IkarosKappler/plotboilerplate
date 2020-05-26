/**
 * @classdesc A simple circle: center point and radius.
 *
 * @requires Line, Vector, VertTuple, Vertex, SVGSerializale
 *
 * @author   Ikaros Kappler
 * @version  1.0.1
 * @date     2020-05-04
 * @modified 2020-05-09 Ported to typescript.
 * @modified 2020-05-25 Added the vertAt and tangentAt functions.
 * 
 * @file Circle
 * @fileoverview A simple circle class: center point and radius.
 * @public
 **/


import { Vector } from "./Vector";
import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { SVGSerializable } from "./interfaces";

export class Circle implements SVGSerializable {

    /** 
     * @member {Vertex} 
     * @memberof Circle
     * @instance
     */
    center:Vertex;

   /**	
     * @member {number} 
     * @memberof Circle
     * @instance
     */
    radius:number;

    /** 
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "Circle";

    /**
     * Create a new circle with given center point and radius.
     *
     * @constructor
     * @name Circle
     * @param {Vertex} center - The center point of the circle.
     * @param {number} radius - The radius of the circle.
     */
    constructor( center:Vertex, radius:number ) {
	this.center = center;
	this.radius = radius;
    };


    /**
     * Calculate the distance from this circle to the given line.
     *
     * * If the line does not intersect this ciecle then the returned 
     *   value will be the minimal distance.
     * * If the line goes through this circle then the returned value 
     *   will be max inner distance and it will be negative.
     *
     * @method lineDistance
     * @param {Line} line - The line to measure the distance to.
     * @return {number} The minimal distance from the outline of this circle to the given line.
     * @instance
     * @memberof Circle
     */
    lineDistance( line:VertTuple<any> ) : number {
	const closestPointOnLine : Vertex = line.getClosestPoint( this.center );
	return closestPointOnLine.distance( this.center ) - this.radius;
    };

    /**
     * Get the vertex on the this circle for the given angle.
     *
     * @param {number} angle - The angle (in radians) to use.
     * @retrn {Vertex} Te the vertex (point) at the given angle.
     **/
    vertAt( angle: number ) : Vertex {
	// Find the point on the circle respective the angle. Then move relative to center.
	return Circle.circleUtils.vertAt( angle, this.radius ).add( this.center );
    };
    

    /**
     * Get a tangent line of this circle for a given angle.
     *
     * Point a of the returned line is located on the circle, the length equals the radius.
     *
     * @param {number} angle - The angle (in radians) to use.
     * @return {Line} The tangent line.
     **/
    tangentAt( angle: number ) : Vector {
	const pointA : Vertex = Circle.circleUtils.vertAt( angle, this.radius );
	// Construct the perpendicular of the line in point a. Then move relative to center.
	return (new Vector( pointA, new Vertex(0,0) ).add( this.center ) as Vector).perp() as Vector;
    };

   /**
     * Create an SVG representation of this circle.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Circle
     */
    toSVGString( options:{className?:string } ) {
	options = options || {};
	var buffer : Array<string> = [];
	buffer.push( '<circle' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' cx="' + this.center.x + '"' );
	buffer.push( ' cy="' + this.center.y + '"' );
	buffer.push( ' r="' + this.radius + '"' );
	buffer.push( ' />' );
	return buffer.join('');
    };

    static circleUtils = {
	vertAt : function(angle,radius) {
	    return new Vertex( Math.sin(angle) * radius,
			       Math.cos(angle) * radius );
	}
    };
    
} // END class
