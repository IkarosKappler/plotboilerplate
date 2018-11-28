/**
 * An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
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
    // | @param center:Vertex The ellipses center.
    // | @param axis:Vertex The x- and y-axis.
    // +-------------------------------
    _context.VEllipse = function( center, axis ) {
	this.center = center;
	this.axis = axis;
    };
    
})(window ? window : module.export );
