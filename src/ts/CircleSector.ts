/**
 * @author   Ikaros Kappler
 * @version  1.0.0
 * @date     2020-12-17
 **/


import { Circle } from "./Circle";
// import { Vector } from "./Vector";
// import { VertTuple } from "./VertTuple";
import { Vertex } from "./Vertex";
import { SVGPathParams, SVGSerializable, XYCoords } from "./interfaces";

// [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
export type SVGArcPathParams = [ string, number, number, number, number, number, number, number ];

/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires Vertex
 * @requires XYCoords
 **/
export class CircleSector implements SVGSerializable {

    /** 
     * @member {Circle} 
     * @memberof CircleSector
     * @instance
     */
    circle:Circle;

   /**	
     * @member {number} 
     * @memberof CircleSector
     * @instance
     */
    startAngle:number;

    /**	
     * @member {number} 
     * @memberof CircleSector
     * @instance
     */
    endAngle:number;

    /** 
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "CircleSector";

    /**
     * Create a new circle sector with given circle, start- and end-angle.
     *
     * @constructor
     * @name CircleSector
     * @param {Circle} circle - The circle.
     * @param {number} startAngle - The start angle of the sector.
     * @param {number} endAngle - The end angle of the sector.
     */
    constructor( circle:Circle, startAngle:number, endAngle:number ) {
	this.circle = circle;
	this.startAngle = startAngle;
	this.endAngle = endAngle;
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
	/* buffer.push( '<circle' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' cx="' + this.center.x + '"' );
	buffer.push( ' cy="' + this.center.y + '"' );
	buffer.push( ' r="' + this.radius + '"' );
	buffer.push( ' />' ); */
	return buffer.join('');
    };

    static circleSectorUtils = {
	/**
	 * Helper function to convert polar circle coordinates to cartesian coordinates.
	 * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	 *
	 * TODO: generalize for ellipses (two radii).
	 *
	 * @param {number} angle - The angle in radians.
	*/
	polarToCartesian : ( centerX:number, centerY:number, radius:number, angle:number ) : XYCoords => {
	    return {
		x: centerX + (radius * Math.cos(angle)),
		y: centerY + (radius * Math.sin(angle))
	    };
	},

	/**
	 * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
	 *
	 * TODO: generalize for ellipses (two radii).
	 *
	 * @return [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
	 */
	describeSVGArc : ( x:number, y:number, radius:number, startAngle:number, endAngle:number ) : SVGPathParams => {
	    const end : XYCoords = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
	    const start : XYCoords = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);

	    // Split full circles into two halves.
	    // Some browsers have problems to render full circles (described by start==end).
	    if( Math.PI*2-Math.abs(startAngle-endAngle) < 0.001 ) {
		const firstHalf : SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc( x, y, radius, startAngle, startAngle+(endAngle-startAngle)/2 );
		// const firstEndPoint : XYCoords = new Vertex( firstHalf[firstHalf.length-2], firstHalf[firstHalf.length-1] );
		const firstEndPoint : XYCoords = { x : firstHalf[firstHalf.length-2] as number,
						   y : firstHalf[firstHalf.length-1] as number
						 };
		const secondHalf : SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc( x, y, radius, startAngle+(endAngle-startAngle)/2, endAngle );
		return firstHalf.concat( secondHalf );
	    }

	    // Boolean stored as integers (0|1).
	    const largeArcFlag : number = endAngle - startAngle <= Math.PI ? 0 : 1;
	    const sweepFlag : number = 1;
	    return ["A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y ];
	}
    };
    
} // END class
