/**
 * A default SVG builder.
 *
 * @author  Ikaros Kappler
 * @date    2018-12-04
 * @version 1.0.0
 **/


(function(_context) {
    'use strict';

    var SVGBuilder = function() {

    };


    // +---------------------------------------------------------------------------------
    // | Builds teh SVG code from the given list of drawables.
    // |
    // | @param drawables:Array The drawable elements to be converted (each must have a toSVGString-function).
    // | @param options:Object { canvasSize, zoom, offset }
    // | 
    // +-------------------------------
    SVGBuilder.prototype.build = function( drawables, options ) {
	options = options || {};
	var buffer = [];
	buffer.push( '<svg width="'+options.canvasSize.width+'" height="'+options.canvasSize.height+'" xmlns="http://www.w3.org/2000/svg">' );

	buffer.push( '<defs>' );
	buffer.push( '<style>' );
	if( options.zoom || options.offset ) {
	    
	    buffer.push( '.main-g { transform:' );
	    if( options.zoom )
		buffer.push( ' scale(' + options.zoom.x + 'px,' + options.zoom.y + 'px)' );
	    if( options.offset )
		buffer.push( ' translate(' + options.offset.x + 'px,' + options.offset.y + 'px)' );
	    buffer.push( ' }' );
	}
	buffer.push( ' .Polygon { fill : none; stroke : green; stroke-width : 2px; } ' );
	buffer.push( ' .BezierPath { fill : none; stroke : blue; stroke-width : 2px; } ' );
	buffer.push( ' .VEllipse { fill : none; stroke : black; stroke-width : 1px; } ' );
	buffer.push( '</style>' );
	buffer.push( '</defs>' );

	buffer.push( '<g class="main-g">' );
	
	for( var i in drawables ) {
	    var d = drawables[i];
	    buffer.push( '      ' );
	    if( typeof d.toSVGString == 'function' ) {
		// console.log( i, d.constructor.name );
		buffer.push( d.toSVGString( { 'className' : d.constructor.name } ) );
	    } else {
		console.warn( 'Unrecognized drawable type has no toSVGString()-function. Ignoring: ' + d.constructor.name );
	    }
	}
	buffer.push( '</g>' );
	buffer.push( '</svg>' );
	return buffer.join('');
    };

    _context.SVGBuilder = SVGBuilder;

})(window ? window : module.export );
