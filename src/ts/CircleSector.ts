/**
 * @author   Ikaros Kappler
 * @date     2020-12-17
 * @modified 2021-01-20 Added UID.
 * @version  1.1.0
 **/


import { Circle } from "./Circle";
import { UIDGenerator } from "./UIDGenerator";
import { SVGPathParams, SVGSerializable, UID, XYCoords } from "./interfaces";


/**
 * @classdesc A simple circle sector: circle, start- and end-angle.
 *
 * @requires Line
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 * @requires XYCoords
 **/
export class CircleSector implements SVGSerializable {

    /** 
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "CircleSector";
    
    
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof CircleSector
     * @instance
     * @readonly 
     */
    readonly uid : UID;
    
    
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
     * Create a new circle sector with given circle, start- and end-angle.
     *
     * @constructor
     * @name CircleSector
     * @param {Circle} circle - The circle.
     * @param {number} startAngle - The start angle of the sector.
     * @param {number} endAngle - The end angle of the sector.
     */
    constructor( circle:Circle, startAngle:number, endAngle:number ) {
	this.uid = UIDGenerator.next();
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
	buffer.push( '<path ' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	const data : SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc(
	    this.circle.center.x, this.circle.center.y,
	    this.circle.radius,
	    this.startAngle, this.endAngle );
	buffer.push( ' d="' + data.join(" ") + '" />' );
	return buffer.join('');
    };

    static circleSectorUtils = {
	/**
	 * Helper function to convert polar circle coordinates to cartesian coordinates.
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
	 * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	 *
	 * TODO: generalize for ellipses (two radii).
	 *
	 * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
	 * @return [ 'A', radiusx, radiusy, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
	 */
	describeSVGArc : ( x:number, y:number,
			   radius:number,
			   startAngle:number, endAngle:number,
			   options?:{moveToStart:boolean}
			 ) : SVGPathParams => {
	    
	    if( typeof options === 'undefined' )
		options = { moveToStart : true };
	    
	    const end : XYCoords = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, endAngle);
	    const start : XYCoords = CircleSector.circleSectorUtils.polarToCartesian(x, y, radius, startAngle);

	    // Split full circles into two halves.
	    // Some browsers have problems to render full circles (described by start==end).
	    if( Math.PI*2-Math.abs(startAngle-endAngle) < 0.001 ) {
		const firstHalf : SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc( x, y, radius, startAngle, startAngle+(endAngle-startAngle)/2, options );
		const firstEndPoint : XYCoords = { x : firstHalf[firstHalf.length-2] as number,
						   y : firstHalf[firstHalf.length-1] as number
						 };
		const secondHalf : SVGPathParams = CircleSector.circleSectorUtils.describeSVGArc( x, y, radius, startAngle+(endAngle-startAngle)/2, endAngle, options );
		return firstHalf.concat( secondHalf );
	    }

	    // Boolean stored as integers (0|1).
	    const largeArcFlag : number = endAngle - startAngle <= Math.PI ? 0 : 1;
	    const sweepFlag : number = 1;
	    const pathData = [];
	    if( options.moveToStart ) {
		pathData.push('M', start.x, start.y );
	    }
	    pathData.push("A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y );
	    return pathData;
	}
    };
    
} // END class
