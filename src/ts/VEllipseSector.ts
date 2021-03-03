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


import { geomutils } from "./geomutils";
import { SVGPathParams, UID, XYCoords } from "./interfaces";
import { UIDGenerator } from "./UIDGenerator";
import { VEllipse } from "./VEllipse";
import { Vertex } from "./Vertex";

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
	 * Helper function to convert an elliptic section to SVG arc params (for the `d` attribute).
	 * Inspiration found at: 
	 *    https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	 *
	 * @param {boolean} options.moveToStart - If false (default=true) the initial 'Move' command will not be used.
	 * @return [ 'A', radiusH, radiusV, rotation, largeArcFlag=1|0, sweepFlag=0, endx, endy ]
	 */
	describeSVGArc : ( x : number, y : number,
			   radiusH : number,
			   radiusV : number,
			   startAngle : number,
			   endAngle : number,
			   rotation?: number,
			   options? : { moveToStart : boolean }
			 ) : SVGPathParams => {
	    
	    if( typeof options === 'undefined' )
		options = { moveToStart : true };
	    if( typeof rotation === 'undefined' )
		rotation = 0.0;

	    // Important note: this function only works if start- and end-angle are within
	    // one whole circle [x,x+2*PI].
	    // Revelations of more than 2*PI might result in unexpected arcs.
	    // -> Use the geomutils.wrapMax( angle, 2*PI )
	    startAngle = geomutils.wrapMax( startAngle, Math.PI*2 );
	    endAngle = geomutils.wrapMax( endAngle, Math.PI*2 )

	    // Find the start- and end-point on the rotated ellipse
	    // XYCoords to Vertex (for rotation)
	    var end : Vertex = new Vertex(VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, endAngle ));
	    var start : Vertex = new Vertex(VEllipse.utils.polarToCartesian( x, y, radiusH, radiusV, startAngle ));
	    end.rotate( rotation, { x:x, y:y } );
	    start.rotate( rotation, { x:x, y:y } );
  
	    var diff : number = endAngle-startAngle;

	    // Boolean stored as integers (0|1).
	    var largeArcFlag : number;
	    if( diff < 0 ) {
		largeArcFlag = Math.abs(diff) < Math.PI ? 1 : 0;
	    } else { 
		largeArcFlag = Math.abs(diff) > Math.PI ? 1 : 0;
	    }
	    
	    const sweepFlag : number = 1;
	    const pathData : SVGPathParams = [];
	    if( options.moveToStart ) {
		pathData.push('M', start.x, start.y );
	    }
	    // Arc rotation in degrees, not radians.
	    const r2d : number = 180/Math.PI;
	    pathData.push("A", radiusH, radiusV, rotation*r2d, largeArcFlag, sweepFlag, end.x, end.y );
	    return pathData;
	} // END function describeSVGArc
    } // END ellipseSectorUtils
};
