/**
 * A grid class with vertical and horizontal lines.
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-09 Added the utils: baseLog(Number,Number) and mapRasterScale(Number,Number).
 * @version  1.0.1
 **/

(function(_context) {
    // +---------------------------------------------------------------------------------
    // | The constructor.
    // |
    // | @param center:Vertex The offset of the grid (default is [0,0]).
    // | @param size:Vertex The x- and y-size of the grid.
    // +-------------------------------
    _context.Grid = function( center, size ) {
	this.center = center;
	this.size = size;
    };


    // +---------------------------------------------------------------------------------
    // | Some helper functions.
    // +-------------------------------
    _context.Grid.utils = {

	// +---------------------------------------------------------------------------------
	// | Calculate the logarithm of the given number (num) to a given base.
	// |
	// | This function returns the number l with
	// |   num == Math.pow(base,l)	
	// |
	// | @param base:Number The base to calculate the logarithm to.
	// | @param num:Number  The number to calculate the logarithm for.
	// +-------------------------------
	baseLog : function(base,num) { return Math.log(base) / Math.log(num); },


	// +---------------------------------------------------------------------------------
	// | Calculate the raster scale for a given logarithmic mapping.
	// |
	// | Example (with adjustFactor=2):
	// |  If scale is 4.33, then the mapping is 1/2 (because 2^2 <= 4.33 <= 2^3)
	// |  If scale is 0.33, then the mapping is 2 because (2^(1/2) >= 0.33 >= 2^(1/4)
	// |
	// |
	// | @param adjustFactor:Number The base for the logarithmic raster scaling when zoomed.
	// | @param scale:Number        The currently used scale factor.
	// +-------------------------------
	mapRasterScale : function( adjustFactor, scale ) {
	    var gf = 1.0;
	    if( scale >= 1 ) {
		gf = Math.abs( Math.floor( 1/Grid.utils.baseLog(adjustFactor,scale) ) );
		gf = 1 / Math.pow( adjustFactor, gf );
	    } else {
		gf = Math.abs( Math.floor( Grid.utils.baseLog(1/adjustFactor,scale+1) ) );
		gf = Math.pow( adjustFactor, gf );
	    }
	    return gf;
	}
    };
    
})(window ? window : module.export );
