/**
 * A wrapper for image objects.
 *
 * @author  Ikaros Kappler
 * @date    2019-01-30
 * @version 1.0.0
 **/

(function(_context) {

    /**
     * +---------------------------------------------------------------------------------
     * | The constructor.
     * |
     * @param {Image} image
     * @param {Vertex} upperLeft
     * @param {Vertex} lowerRight
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
