/**
 * As the voronoi tool and other demos use the postDraw hook for performance reasons, the built-in
 * SVG builder will create empty documents.
 *
 * Here's a workaround.
 *
 * @require SVGBuilder
 *
 * @date    2019-11-06
 * @author  Ikaros Kappler
 * @version 1.0.0
 **/

(function(_context) {
    'use strict';

    /**
     * @param {options.canvasSize} {width,height}
     * @param {options.offset} {x,y}
     * @param {options.zoom} {x,y}
     **/
    var drawablesToSVG = function( options ) {
	this.options = options;
	this.drawables = [];
    };

    drawablesToSVG.prototype.addDrawable = function(d) {
	this.drawables.push(d);
    };

    drawablesToSVG.prototype.build = function() {
	return new SVGBuilder().build( this.drawables, this.options );
    };
    
    _context.drawablesToSVG = drawablesToSVG;
    
} )(window ? window : module.export );
