/**
 * A rectangle of given size (width and height) that produces and stores
 * random vertices with a given density and min-distance property.
 *
 * @author   Ikaros Kappler
 * @version  1.0.0
 * @modified 2020-02-22
 **/

(function(_context) {

    /**
     * @param {Vertex} offset
     * @param {number} w
     * @param {number} height
     * @param {number} maxNumVerts
     * @param {number} minDist
     **/
    var RandomRect = function( offset, w, h, numMaxVerts, killRange ) {
	this.vertices = null;
	this.offset = offset;
	this.width = w;
	this.height = h;
	this.numMaxVerts = numMaxVerts;
	this.killRange = killRange;

	this.randomize();
    };

    RandomRect.prototype.randomVert = function() {
	return new Vertex( this.offset.x + Math.random()*this.width, this.offset.y + Math.random()*this.height );
    };
    
    RandomRect.prototype.randomize = function() {
	this.vertices = [];
	for( var i = 0; i < this.numMaxVerts; i++ ) {
	    var vert = this.randomVert();
	    this.tryAdd(vert);
	}
	console.log('added', this.vertices.length, ' of ', this.numMaxVerts, 'killRange', this.killRange );
    };

    RandomRect.prototype.tryAdd = function( vert ) {
	for( var i in this.vertices ) {
	    if( this.vertices[i].distance(vert) < this.killRange )
		return false;
	}
	this.vertices.push( vert );
	return true;
    };

    _context.RandomRect = RandomRect;

})(window ? window : module.exports );
