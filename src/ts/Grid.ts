/**
 * @classdesc A grid class with vertical and horizontal lines.
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-09 Added the utils: baseLog(Number,Number) and mapRasterScale(Number,Number).
 * @version  1.0.1
 *
 * @file Grid
 * @fileoverview Note that the PlotBoilerplate already has a Grid instance member. The Grid is not meant 
 *               to be added to the canvas as a drawable as it encapsulates more an abstract concept of the canvas
 *               rather than a drawable object.
 * @public
 **/


import { Vertex } from "./Vertex";


export class Grid {

    /** 
     * @member {Vertex} 
     * @memberof Grid
     * @instance
     */
    center:Vertex;

    /** 
     * @member {Vertex} 
     * @memberof Grid
     * @instance
     */
    size:Vertex;

    
    
    /**
     * The constructor.
     *
     * @constructor
     * @name Grid
     * @param {Vertex} center - The offset of the grid (default is [0,0]).
     * @param {Vertex} size   - The x- and y-size of the grid.
     **/
    constructor( center:Vertex, size:Vertex ) {
	this.center = center;
	this.size = size;
    };


    /**
     * @memberof Grid
     **/
    static utils = {

	/**
	 * Calculate the logarithm of the given number (num) to a given base.<br>
	 * <br>
	 * This function returns the number l with<br>
	 *  <pre>num == Math.pow(base,l)</pre>
	 *
	 * @member baseLog
	 * @function
	 * @memberof Grid
	 * @inner
	 * @param {number} base - The base to calculate the logarithm to.
	 * @param {number} num  - The number to calculate the logarithm for.
	 * @return {number} <pre>log(base)/log(num)</pre>
	 **/
	baseLog : (base:number,num:number) : number => { return Math.log(base) / Math.log(num); },


	/**
	 * Calculate the raster scale for a given logarithmic mapping.<br>
	 * <br>
	 * Example (with adjustFactor=2):<br>
	 * <pre>
	 * If scale is 4.33, then the mapping is 1/2 (because 2^2 <= 4.33 <= 2^3)<br>
	 * If scale is 0.33, then the mapping is 2 because (2^(1/2) >= 0.33 >= 2^(1/4)
	 * </pre>
	 *
	 * @member mapRasterScale
	 * @function
	 * @memberof Grid
	 * @inner
	 * @param {number} adjustFactor The base for the logarithmic raster scaling when zoomed.
	 * @param {number} scale        The currently used scale factor.
	 * @return {number} 
	 **/
	mapRasterScale : ( adjustFactor:number, scale:number ) : number => {
	    var gf : number = 1.0;
	    if( scale >= 1 ) {
		gf = Math.abs( Math.floor( 1/Grid.utils.baseLog(adjustFactor,scale) ) );
		gf = 1 / Math.pow( adjustFactor, gf );
	    } else {
		gf = Math.abs( Math.floor( Grid.utils.baseLog(1/adjustFactor,1/(scale+1)) ) );
		//gf = Math.pow( adjustFactor, gf );
	    }
	    return gf;
	}
    };
}
