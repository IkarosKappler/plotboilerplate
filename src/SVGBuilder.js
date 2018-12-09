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
	var nl = '\n';
	var indent = '  ';
	var buffer = [];
	
	// buffer.push( '<svg width="'+options.canvasSize.width+'" height="'+options.canvasSize.height+'" xmlns="http://www.w3.org/2000/svg">' + nl );
	buffer.push( '<svg width="'+options.canvasSize.width+'" height="'+options.canvasSize.height+'"' );
	buffer.push( ' viewBox="' );
	buffer.push( 0 );
	buffer.push( ' ' );
	buffer.push( 0 );
	buffer.push( ' ' );
	buffer.push( options.canvasSize.width );
	buffer.push( ' ' );
	buffer.push( options.canvasSize.height );
	buffer.push( '"' );
	
	buffer.push( ' xmlns="http://www.w3.org/2000/svg">' + nl );

	buffer.push( indent + '<defs>' + nl );
	buffer.push( indent + '<style>' + nl);
	/* if( options.zoom || options.offset ) {    
	    buffer.push( indent + indent + '.main-g { transform:' );
	    if( options.zoom )
		buffer.push( ' scale(' + options.zoom.x + ',' + options.zoom.y + ')' );
	    if( options.offset )
		buffer.push( ' translate(' + options.offset.x + 'px,' + options.offset.y + 'px)' );
	    buffer.push( ' }' + nl );
	} */
	buffer.push( indent + indent + ' .Polygon { fill : none; stroke : green; stroke-width : 2px; } ' + nl );
	buffer.push( indent + indent + ' .BezierPath { fill : none; stroke : blue; stroke-width : 2px; } ' + nl );
	buffer.push( indent + indent + ' .VEllipse { fill : none; stroke : black; stroke-width : 1px; } ' + nl );
	buffer.push( indent + indent + ' .Line { fill : none; stroke : purple; stroke-width : 1px; } ' + nl );
	buffer.push( indent + '</style>' + nl );
	buffer.push( indent + '</defs>' + nl );

	buffer.push( indent + '<g class="main-g"' );
	if( options.zoom || options.offset ) {
	    buffer.push( ' transform="' );
	    if( options.zoom )
		buffer.push( 'scale(' + options.zoom.x + ',' + options.zoom.y + ')' );
	    if( options.offset )
		buffer.push( ' translate(' + options.offset.x + ',' + options.offset.y + ')' );
	    buffer.push( '"' ); 
	}
	buffer.push( '>' + nl );
	
	for( var i in drawables ) {
	    var d = drawables[i];
	    if( typeof d.toSVGString == 'function' ) {
		buffer.push( indent + indent );
		buffer.push( d.toSVGString( { 'className' : d.constructor.name } ) );
		buffer.push( nl );
	    } else {
		console.warn( 'Unrecognized drawable type has no toSVGString()-function. Ignoring: ' + d.constructor.name );
	    }
	}
	buffer.push( indent + '</g>' + nl );
	buffer.push( '</svg>' + nl );
	return buffer.join('');
    };

    _context.SVGBuilder = SVGBuilder;

})(window ? window : module.export );
