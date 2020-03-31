/**
 * @classdesc A wrapper for image objects.
 *
 * @author  Ikaros Kappler
 * @date    2019-01-30
 * @modified 2019-03-23 Added JSDoc tags.
 * @version 1.0.1
 *
 * @file PBImage
 * @fileoverview As native Image objects have only a position and with 
 *               and height thei are not suitable for UI dragging interfaces.
 * @public
 **/

(function(_context) {
    'use strict';

    /**
     * The constructor.
     * 
     * @constructor
     * @name PBImage
     * @param {Image} image - The actual image.
     * @param {Vertex} upperLeft - The upper left corner.
     * @param {Vertex} lowerRight - The lower right corner.
     **/
    var PBImage = function( image, upperLeft, lowerRight ) {
	if( typeof image == 'undefined' )
	    throw Error('image must not be null.');
	if( typeof upperLeft == 'undefined' )
	    throw Error('upperLeft must not be null.');
	if( typeof lowerRight == 'undefined' )
	    throw Error('lowerRight must not be null.');
	this.image = image;
	this.upperLeft = upperLeft;
	this.lowerRight = lowerRight;
    };

    _context.PBImage = PBImage;
    
})(window ? window : module.export);
