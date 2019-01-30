/**
 * A vector (vertex,vertex) implementation.
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
     * @param {Vertex} vertA
     * @param {Vertex} vertB
     **/
    var Vector = function( vertA, vertB ) {
	Line.call(this,vertA,vertB);
	//this.a = vertA;
	//this.b = vertB;
    };

    /*
    Vector.prototype.length = function() {
	var x = this.b.x-this.a.x;
	var y = this.b.y-this.a.y;
	return Math.sqrt( x*x + y*y );
    };
    */

    _context.Vector = Vector;
    
})(window ? window : module.export);
