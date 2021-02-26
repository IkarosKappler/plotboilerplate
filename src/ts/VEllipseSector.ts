/**
 * Implementation of elliptic sectors.
 * Note that sectors are constructed in clockwise direction.
 *
 * @author  Ikaros Kappler
 * @date    2021-02-26
 * @version 1.0.0
 */

// TODO: add class to all demos
// TODO: add to PlotBoilerplate.add(...)


import { VEllipse } from "./VEllipse";
import { SVGPathParams, UID, XYCoords } from "./interfaces";
import { UIDGenerator } from "./UIDGenerator";

/**
 * @classdesc A class for elliptic sectors.
 *
 * @requires Line
 * @requires Vector
 * @requires VertTuple 
 * @requires Vertex
 * @requires SVGSerializale
 * @requires UID
 * @requires UIDGenerator
 **/
export class VEllipseSector {

    /** 
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "VEllipseSector";
    
    /**
     * The UID of this drawable object.
     *
     * @member {UID}
     * @memberof VEllipseSector
     * @instance
     * @readonly 
     */
    readonly uid : UID;
    
    
    /**
     * @member {VEllipse}
     * @memberof VEllipseSector
     * @instance
     */
    ellipse : VEllipse;
    
    /**
     * @member {number}
     * @memberof VEllipseSector
     * @instance
     */
    startAngle : number;

    /**
     * @member {number}
     * @memberof VEllipseSector
     * @instance
     */
    endAngle : number;

    /**
     * Create a new elliptic sector from the given ellipse and two angles.
     *
     * Note that the direction from start to end goes clockwise.
     *
     * @constructor
     * @name VEllipseSector
     * @param {VEllipse} - The underlying ellipse to use.
     * @param {number} startAngle - The start angle of the sector.
     * @param {numner} endAngle - The end angle of the sector.
     */
    constructor( ellipse : VEllipse,
		 startAngle : number,
		 endAngle : number
	       ) {
	this.uid = UIDGenerator.next();
	this.ellipse = ellipse;
	this.startAngle = startAngle;
	this.endAngle = endAngle;
    }
    
    static ellipseSectorUtils = {
	/**
	 * Helper function to convert a circle section as SVG arc params (for the `d` attribute).
	 * Found at: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	 *
	 * TODO: generalize for ellipses (two radii).
	 *
	 * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
	 * @return [ 'A', radiusH, radiusV, rotation=0, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
	 */
	describeSVGArc : ( x : number, y : number,
			   radiusH : number,
			   radiusV : number,
			   startAngle : number,
			   endAngle : number,
			   options? : { moveToStart : boolean }
			 ) : SVGPathParams => {
	    
	    if( typeof options === 'undefined' )
		options = { moveToStart : true };
	    
	    
	    // XYCoords
	    var end : XYCoords = VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, endAngle );
	    var start : XYCoords = VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, startAngle );
	    var diff : number = endAngle-startAngle;

	    /*
	      var r2d = 180/Math.PI;
	      console.log( "startAngle", (r2d*startAngle).toFixed(4),
	      "endAngle", (r2d*endAngle).toFixed(4),
	      "diff=" + (r2d*diff).toFixed(4) );
	    */

	    // Boolean stored as integers (0|1).
	    var largeArcFlag : number;
	    // var sweepFlag : numner;
	    if( diff < 0 ) {
		largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
		// sweepFlag = 1;
	    } else { 
		largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
		// sweepFlag = 1;
	    }
	    
	    const sweepFlag : number = 1;
	    const pathData : SVGPathParams = [];
	    if( options.moveToStart ) {
		pathData.push('M', start.x, start.y );
	    }
	    pathData.push("A", radiusH, radiusV, 0, largeArcFlag, sweepFlag, end.x, end.y );
	    return pathData;
	} // END function describeSVGArc
    } // END ellipseSectorUtils
};
