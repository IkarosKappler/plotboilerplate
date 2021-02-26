/**
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2021-01-20 Added UID.
 * @version  1.1.0
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/


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
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center The ellipses center.
     * @param {Vertex} axis The x- and y-axis.
     * @name VEllipse
     **/
    constructor( center:Vertex, axis:Vertex ) {
	this.uid = UIDGenerator.next();
	this.center = center;
	this.axis = axis;
    };

    radiusH() {
	return this.axis.x - this.center.x;
    };

    radiusV() {
	return this.axis.y - this.center.y;
    };

    /* 
    _vertAt( angle:number ) : Vertex {
	// Tanks to Narasinham for the vertex-on-ellipse equations
	// https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
	var a = this.radiusV();
	var b = this.radiusH();
	// var s = Math.sin( Math.PI/2 - angle );
	// var c = Math.cos( Math.PI/2 - angle );
	// return new Vertex( a*b*s / Math.sqrt( Math.pow(b*c,2) + Math.pow(a*s,2) ),
	//		   a*b*c / Math.sqrt( Math.pow(b*c,2) + Math.pow(a*s,2) )
	//		   ).add( this.center ); 
	return new Vertex( VEllipse.utils.polarToCartesian( this.center.x, this.center.y, a, b, angle ) );
    };
    */

    vertAt( angle:number ) : Vertex {
	// Tanks to Narasinham for the vertex-on-ellipse equations
	// https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
	var a = this.radiusH();
	var b = this.radiusV();
	/* var s = Math.sin( Math.PI/2 - angle );
	var c = Math.cos( Math.PI/2 - angle );
	return new Vertex( a*b*s / Math.sqrt( Math.pow(b*c,2) + Math.pow(a*s,2) ),
			   a*b*c / Math.sqrt( Math.pow(b*c,2) + Math.pow(a*s,2) )
			   ).add( this.center ); */
	return new Vertex( VEllipse.utils.polarToCartesian( this.center.x, this.center.y, a, b, angle ) );
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

    static utils = {
	polarToCartesian : ( centerX:number, centerY:number,
			     radiusH:number, radiusV:number,
			     angle:number ) : XYCoords => {
	    // Tanks to Narasinham for the vertex-on-ellipse equations
	    // https://math.stackexchange.com/questions/22064/calculating-a-point-that-lies-on-an-ellipse-given-an-angle
	    // var a = this.radiusV();
	    // var b = this.radiusH();
	    var s = Math.sin( Math.PI/2 - angle );
	    var c = Math.cos( Math.PI/2 - angle );
	    return { x : centerX + radiusH*radiusV*s / Math.sqrt( Math.pow(radiusH*c,2) + Math.pow(radiusV*s,2) ),
		     y : centerY + radiusH*radiusV*c / Math.sqrt( Math.pow(radiusH*c,2) + Math.pow(radiusV*s,2) )
		   };
	    /* return {
	       x: centerX + (radius * Math.cos(angle)),
	       y: centerY + (radius * Math.sin(angle))
	       }; */
	}
    }; // END utils
};
