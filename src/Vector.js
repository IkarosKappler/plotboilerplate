/**
 * A vector (vertex,vertex) implementation.
 *
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-02-23 Added the toSVGString function, overriding Line.toSVGString.
 * @version  1.0.1
 **/

(function(_context) {
    'use strict';
    
    /**
     * +---------------------------------------------------------------------------------
     * | The constructor.
     * |
     * @param {Vertex} vertA
     * @param {Vertex} vertB
     **/
    var Vector = function( vertA, vertB ) {
	Line.call(this,vertA,vertB);
    };
    Object.extendClass(Line,Vector);

    // +---------------------------------------------------------------------------------
    // | Create an SVG representation of this line.
    // |
    // | @override
    // | @return string The SVG string
    // +-------------------------------
    Vector.prototype.toSVGString = function( options ) {
	options = options || {};
	var buffer = [];
	var vertices = PlotBoilerplate.utils.buildArrowHead( this.a, this.b, 8, 1.0, 1.0 );
	buffer.push( '<g' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( '>' );
	buffer.push( '   <line' );
	buffer.push( ' x1="' + this.a.x + '"' );
	buffer.push( ' y1="' + this.a.y + '"' );
	buffer.push( ' x2="' + vertices[0].x + '"' );
	buffer.push( ' y2="' + vertices[0].y + '"' );
	buffer.push( ' />' );
	// Add arrow head
	
	buffer.push( '   <polygon points="' );
	for( var i = 0; i < vertices.length; i++ ) {
	    if( i > 0 )
		buffer.push( ' ' );
	    buffer.push( '' + vertices[i].x + ',' + vertices[i].y );
	}
	buffer.push( '"/>' );
	buffer.push( '</g>' );
	return buffer.join('');
    };
    
    _context.Vector = Vector;
    
})(window ? window : module.export);
