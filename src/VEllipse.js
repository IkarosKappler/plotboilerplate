/**
 * @classdesc An ellipse class based on two vertices [centerX,centerY] and [radiusX,radiusY].
 *
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2018-11-28
 * @modified 2018-12-04 Added the toSVGString function.
 * @version  1.0.1
 *
 * @file VEllipse
 * @fileoverview Ellipses with a center and an x- and a y-axis (stored as a vertex).
 **/

(function(_context) {

    /**
     * The constructor.
     *
     * @constructor
     * @param {Vertex} center The ellipses center.
     * @param {Vertex} axis The x- and y-axis.
     * @name VEllipse
     **/
    var VEllipse = function( center, axis ) {
	this.center = center;
	this.axis = axis;
    };


    /** 
     * @member {Vertex} 
     * @memberof VEllipse
     * @instance
     */
    VEllipse.prototype.center = null;

    /** 
     * @member {Vertex} 
     * @memberof VEllipse
     * @instance
     */
    VEllipse.prototype.axis = null;


    // +---------------------------------------------------------------------------------
    // | Create an SVG representation of this ellipse.
    // |
    // | @return string The SVG string
    // +-------------------------------
    VEllipse.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
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

    _context.VEllipse = VEllipse;
    
})(window ? window : module.export );
