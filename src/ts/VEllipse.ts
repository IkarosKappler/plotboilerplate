/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @modified 2021-02-14 Added functions `radiusH` and `radiusV`.
 * @modified 2021-02-26 Added helper function `decribeSVGArc(...)`.
 * @modified 2021-03-01 Added attribute `rotation` to allow rotation of ellipses.
 * @modified 2021-03-03 Added the `vertAt` and `perimeter` methods.
 * @modified 2021-03-05 Added the `getFoci`, `normalAt` and `tangentAt` method.
 * @version  1.2.2
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/


import { Line } from "./Line";
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";
import { UIDGenerator } from "./UIDGenerator";
import { SVGSerializable, UID, XYCoords } from "./interfaces";


/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires SVGSerializable
 * @requires UID
 * @requires UIDGenerator
 * @requires Vertex
 */
export class VEllipse implements SVGSerializable {


    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "VEllipse";


    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof VEllipse
     * @instance
     * @readonly 
     */
    readonly uid : UID;
    
    
    /** 
     * @member {Vertex} 
     * @memberof VEllipse
     * @instance
     */
    center:Vertex;

    /** 
     * @member {Vertex} 
     * @memberof VEllipse
     * @instance
     */
    axis:Vertex;

    /**
     * @member {number}
     * @memberof VEllipse
     * @instance
     */
    rotation:number
    
    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center - The ellipses center.
     * @param {Vertex} axis - The x- and y-axis (the two radii encoded in a control point).
     * @param {Vertex} rotation - [optional, default=0] The rotation of this ellipse.
     * @name VEllipse
     **/
    constructor( center:Vertex, axis:Vertex, rotation?:number) {
	this.uid = UIDGenerator.next();
	this.center = center;
	this.axis = axis;
	this.rotation = rotation | 0.0;
    };

    /**
     * Get the non-negative horizonal radius of this ellipse.
     *
     * @method radiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned horizontal radius of this ellipse.
     */
    radiusH() : number {
	return Math.abs( this.signedRadiusH() );
    };

    /**
     * Get the signed horizonal radius of this ellipse.
     *
     * @method signedRadiusH
     * @instance
     * @memberof VEllipse
     * @return {number} The signed horizontal radius of this ellipse.
     */
    signedRadiusH() : number {
	// return Math.abs(this.axis.x - this.center.x);
	// Rotate axis back to origin before calculating radius
	// return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).x - this.center.x);
	return new Vertex(this.axis).rotate(-this.rotation,this.center).x - this.center.x;
    };

    /**
     * Get the non-negative vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The unsigned vertical radius of this ellipse.
     */
    radiusV() : number {
	return Math.abs( this.signedRadiusV() );
    };

    /**
     * Get the signed vertical radius of this ellipse.
     *
     * @method radiusV
     * @instance
     * @memberof VEllipse
     * @return {number} The signed vertical radius of this ellipse.
     */
    signedRadiusV() : number {
	// return Math.abs(this.axis.y - this.center.y);
	// Rotate axis back to origin before calculating radius
	// return Math.abs(new Vertex(this.axis).rotate(-this.rotation,this.center).y - this.center.y);
	return new Vertex(this.axis).rotate(-this.rotation,this.center).y - this.center.y;
    };


    /**
     * Get the vertex on the ellipse's outline at the given angle.
     *
     * @method vertAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to determine the vertex at.
     * @return {Vertex} The vertex on the outline at the given angle.
     */
    vertAt( angle:number ) : Vertex {
	// Tanks to Narasinham for the vertex-on-ellipse equations
	// https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
	const a : number = this.radiusH();
	const b : number = this.radiusV();
	return new Vertex( VEllipse.utils.polarToCartesian( this.center.x, this.center.y, a, b, angle) ).rotate( this.rotation, this.center );
    };


    /**
     * Get the normal vector at the given angle. 
     * The normal vector is the vector that intersects the ellipse in a 90 degree angle 
     * at the given point (speicified by the given angle).
     *
     * Length of desired normal vector can be specified, default is 1.0.
     * 
     * @method normalAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the normal vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    
    normalAt( angle:number, length?:number ) : Vector {
	const point : Vertex = this.vertAt( angle );
	const foci : [Vertex,Vertex] = this.getFoci();
	// Calculate the angle between [point,focusA] and [point,focusB]
	const angleA : number = new Line(point,foci[0]).angle();
	const angleB : number = new Line(point,foci[1]).angle();
	const centerAngle : number= angleA + (angleB-angleA)/2.0;
	const endPointA : Vertex = point.clone().addX(50).clone().rotate( centerAngle, point );
	const endPointB : Vertex = point.clone().addX(50).clone().rotate( Math.PI+centerAngle, point );
	if( this.center.distance(endPointA) < this.center.distance(endPointB) ) {
	    return new Vector( point, endPointB );
	} else {
	    return new Vector( point, endPointA );
	}
	
    };

    /**
     * Get the tangent vector at the given angle. 
     * The tangent vector is the vector that touches the ellipse exactly at the given given 
     * point (speicified by the given angle).
     *
     * Note that the tangent is just 90 degree rotated normal vector.
     *
     * Length of desired tangent vector can be specified, default is 1.0.
     * 
     * @method tangentAt
     * @instance
     * @memberof VEllipse
     * @param {number} angle - The angle to get the tangent vector at.
     * @param {number=1.0} length - [optional, default=1] The length of the returned vector.
     */
    tangentAt( angle:number, length?:number ) : Vector {
	const normal : Vector = this.normalAt( angle, length );
	// Rotate the normal by 90 degrees, then it is the tangent.
	normal.b.rotate( Math.PI/2, normal.a );
	return normal;
    };


    /**
     * Get the perimeter of this ellipse.
     *
     * @method perimeter
     * @instance
     * @memberof VEllipse
     * @return {number}
     */
    perimeter() : number {
	// This method does not use an iterative approximation to determine the perimeter, but it uses
	// a wonderful closed approximation found by Srinivasa Ramanujan.
	// Matt Parker made a neat video about it:
	//    https://www.youtube.com/watch?v=5nW3nJhBHL0
	const a : number = this.radiusH();
	const b : number = this.radiusV();
	return Math.PI * ( 3*(a+b) - Math.sqrt( (3*a+b)*(a+3*b) ) );
    };

    /**
     * Get the two foci of this ellipse.
     *
     * @method getFoci
     * @instance
     * @memberof VEllipse
     * @return {Array<Vertex>} An array with two elements, the two focal points of the ellipse (foci).
     */
    getFoci() : [Vertex,Vertex] {
	// https://www.mathopenref.com/ellipsefoci.html
	const rh : number = this.radiusH();
	const rv : number = this.radiusV();
	const sdiff : number = rh*rh - rv*rv;
	// f is the distance of each focs to the center.
	const f : number = Math.sqrt( Math.abs(sdiff) );
	// Foci on x- or y-axis?
	if( sdiff < 0 ) {
	    return [
		this.center.clone().addY( f).rotate( this.rotation, this.center ),
		this.center.clone().addY(-f).rotate( this.rotation, this.center )
	    ];
	} else {
	    return [
		this.center.clone().addX( f).rotate( this.rotation, this.center ),
		this.center.clone().addX(-f).rotate( this.rotation, this.center )
	    ];
	}
    };
    

    /**
     * Create an SVG representation of this ellipse.
     *
     * @deprecated DEPRECATION Please use the drawutilssvg library and an XMLSerializer instead.
     * @param {object} options { className?:string }
     * @return string The SVG string
     */
    toSVGString( options:{className?:string } ) {
	options = options || {};
	var buffer : Array<string> = [];
	buffer.push( '<ellipse' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' cx="' + this.center.x + '"' );
	buffer.push( ' cy="' + this.center.y + '"' );
	buffer.push( ' rx="' + this.axis.x + '"' );
	buffer.push( ' ry="' + this.axis.y + '"' );
	buffer.push( ' />' );
	return buffer.join('');
    };

    /**
     * A static collection of ellipse-related helper functions.
     * @static
     */
    static utils = {

	/**
	 * Calculate a particular point on the outline of the given ellipse (center plus two radii plus angle).
	 *
	 * @name polarToCartesian
	 * @param {number} centerX - The x coordinate of the elliptic center.
	 * @param {number} centerY - The y coordinate of the elliptic center.
	 * @param {number} radiusH - The horizontal radius of the ellipse.
	 * @param {number} radiusV - The vertical radius of the ellipse.
	 * @param {number} angle - The angle (in radians) to get the desired outline point for.
	 * @reutn {XYCoords} The outlont point in absolute x-y-coordinates.
	 */
	polarToCartesian : ( centerX:number, centerY:number,
			     radiusH:number, radiusV:number,
			     angle:number ) : XYCoords => {
	    // Tanks to Narasinham for the vertex-on-ellipse equations
	    // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
	    var s = Math.sin( Math.PI/2 - angle );
	    var c = Math.cos( Math.PI/2 - angle );
	    return { x : centerX + radiusH*radiusV*s / Math.sqrt( Math.pow(radiusH*c,2) + Math.pow(radiusV*s,2) ),
		     y : centerY + radiusH*radiusV*c / Math.sqrt( Math.pow(radiusH*c,2) + Math.pow(radiusV*s,2) )
		   };
	}
    }; // END utils
};
