/**
 * The vertex class for point set.
 *
 * @require VertexAttr
 * 
 * @author    Ikaros Kappler
 * @date_init 2012-10-17
 * @date      2018-04-03
 * @modified  2018-04-28 Added some documentation.
 * @modified  2018-08-16 Added the set() function.
 * @modified  2018-08-26 Added VertexAttr.
 * @modified  2018-10-31 Extended the constructor by object{x,y}.
 * @modified  2018-11-19 Extended the set(number,number) function to set(Vertex).
 * @modified  2018-11-28 Added 'this' to the VertexAttr constructor.
 * @modified  2018-12-05 Added the sub(...) function. Changed the signature of the add() function! add(Vertex) and add(number,number) are now possible.
 * @version   2.0.7
 **/


(function(_context) {

    // An epsilon for comparison
    var EPSILON = 1.0e-6;


    // +------------------------------------------------------------
    // | Vertex class
    // +------------------------------------------------------------
    var Vertex = _context.Vertex = function( x, y ) {
	if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x = x.x;
	    this.y = x.y;
	} else {
	    this.x = x;
	    this.y = y;
	}
	this.attr = new VertexAttr();
	this.listeners = new VertexListeners( this );
    };


    // +------------------------------------------------------------
    // | Set the x- and y- component of this vertex.
    // |
    // | @return Vertex
    // +-------------------------------------------------------
    Vertex.prototype.set = function( x, y ) {
	if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x = x.x;
	    this.y = x.y;
	} else {
	    this.x = x;
	    this.y = y;
	}
	return this;
    };


    // +------------------------------------------------------------
    // | Add the passed amount to x- and y- component of this vertex.
    // |
    // | @param x:Vertex|number
    // | @param y:number (optional)
    // |
    // | @return Vertex
    // +-------------------------------------------------------
    Vertex.prototype.add = function( x, y ) {
	if( typeof x == 'number' ) {
	    this.x += x;
	    if( typeof y == 'number' )
		this.y += y;
	} else {
	    this.x += x.x;
	    this.y += x.y
	}
	return this;
    };


    // +------------------------------------------------------------
    // | Add the passed amount to x- and y- component of this vertex.
    // |
    // | @param amountX:number
    // | @param amountY:number
    // |
    // | @return Vertex
    // +-------------------------------------------------------
    Vertex.prototype.addXY = function( amountX, amountY ) {
	this.x += amountX;
	this.y += amountY;
	return this;
    };


    // +------------------------------------------------------------
    // | Substract the passed vertex/components from this vertex.
    // |
    // | @return Vertex
    // +-------------------------------------------------------
    Vertex.prototype.sub = function( x, y ) {
	if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x -= x.x;
	    this.y -= x.y;
	} else {
	    this.x -= x;
	    this.y -= y;
	}
	return this;
    };
    
    
    // +------------------------------------------------------------
    // | Check if this vertex equals the passed one.
    // |
    // | This function uses the epsilon as tolerance.
    // |
    // | @param vertex:Vertex The vertex to compare this with.
    // |
    // | @return boolean
    // +-------------------------------------------------------
    Vertex.prototype.equals = function( vertex ) {
	var eqX =  (Math.abs(this.x-vertex.x) < EPSILON);
	var eqY =  (Math.abs(this.y-vertex.y) < EPSILON);
	var result = eqX && eqY;
	return result;
    };


    
    // +------------------------------------------------------------
    // | Create a copy of this vertex.
    // |
    // | @return Vertex
    // +-------------------------------------------------------
    Vertex.prototype.clone = function() {
	return new Vertex(this.x,this.y);
    };


    // +------------------------------------------------------------
    // | Get the distance to the passed point.
    // |
    // | @param vert:Vertex
    // | 
    // | @return number
    // +-------------------------------------------------------
    Vertex.prototype.distance = function( vert ) {
	return Math.sqrt( Math.pow(vert.x-this.x,2) + Math.pow(vert.y-this.y,2) );
    };


    // +------------------------------------------------------------
    // | This is a vector-like behavior and 'scales' this vertex
    // | towards/from a given center.
    // |
    // | @param factor:float The scale factor; 1.0 means no change.
    // | @param center:Vertex The origin of scaling; default is (0,0).
    // |
    // | @return Vertex This vector for chaining.
    // +-------------------------------------------------------
    Vertex.prototype.scale = function( factor, center ) { //console.log('scale='+factor+', center=' + JSON.stringify(center) );
	if( !center || typeof center === "undefined" )
	    center = new Vertex(0,0);
	this.x = center.x + (this.x-center.x)*factor;
	this.y = center.y + (this.y-center.y)*factor; //console.log( 'after scale: ' + this );
	return this;
    };


    // +------------------------------------------------------------
    // | Multiply both components of this vertex with the given scalar.
    // |
    // | Note: as in
    // |    https://threejs.org/docs/#api/math/Vector2.multiplyScalar
    // |
    // | @param scalar:float The scale factor; 1.0 means no change.
    // |
    // | @return Vertex This vertec for chaining.
    // +-------------------------------------------------------
    Vertex.prototype.multiplyScalar = function( scalar ) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
    };


    // +------------------------------------------------------------
    // | Round the two components x and y of this vertex.
    // |
    // | @return Vertex This vertec for chaining.
    // +-------------------------------------------------------
    Vertex.prototype.round = function() {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	return this;
    };
    
    // +------------------------------------------------------------
    // | Convert this vertex into a human-readable format.
    // |
    // | @return string
    // +-------------------------------------------------------
    Vertex.prototype.toString = function() {
	return '('+this.x+','+this.y+')';
    };
    // END Vertex

})( window ? window : module.exports );
