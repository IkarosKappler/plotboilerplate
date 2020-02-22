/**
 * A simple bounding box implementation.
 *
 * @author  Ikaros Kappler
 * @date    2020-02-22
 * @version 1.0.0
 **/

(function(_context) {

    /**
     * @param {Vertex} min - The left upper corner.
     * @param {Vertex} max - The right lower corner.
     **/
    var BoundingBox = function( min, max ) {
	this.min = min;
	this.max = max;
    };

    BoundingBox.prototype.getWidth = function() {
	return this.max.x-this.min.x;
    };

    BoundingBox.prototype.getHeight = function() {
	return this.max.y-this.min.y;
    };

    BoundingBox.prototype.getArea = function() {
	return this.getWidth()*this.getHeight();
    };

    _context.BoundingBox = BoundingBox;

})(window ? window : module.exports );
