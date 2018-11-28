/**
 * A grid class with vertical and horizontal lines.
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @version  1.0.0
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
    
})(window ? window : module.export );
