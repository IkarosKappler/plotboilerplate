/**
 * @classdesc A vector (Vertex,Vertex) is a line with a visible direction.<br>
 *            <br>
 *            Vectors are drawn with an arrow at their end point.<br>
 *            <b>The Vector class extends the Line class.</b>
 *
 * @requires Vertex, Line
 *
 * @author   Ikaros Kappler
 * @date     2019-01-30
 * @modified 2019-02-23 Added the toSVGString function, overriding Line.toSVGString.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-04-19 Added the clone function (overriding Line.clone()).
 * @modified 2019-09-02 Added the Vector.perp() function.
 * @modified 2019-09-02 Added the Vector.inverse() function.
 * @modified 2019-12-04 Added the Vector.inv() function.
 * @version  1.2.0
 *
 * @file Vector
 * @public
 **/

(function(_context) {
    'use strict';
    
    /**
     * The constructor.
     * 
     * @constructor
     * @name Vector
     * @extends Line
     * @param {Vertex} vertA - The start vertex of the vector.
     * @param {Vertex} vertB - The end vertex of the vector.
     **/
    var Vector = function( vertA, vertB ) {
	Line.call(this,vertA,vertB);
    };
    Object.extendClass(Line,Vector);


    /**
     * Get the perpendicular of this vector which is located at a.
     *
     * @param {Number} t The position on the vector.
     * @return {Vector} A new vector being the perpendicular of this vector sitting on a.
     **/
    Vector.prototype.perp = function() {
	var v = this.clone().sub( this.a );
	return new Vector( new Vertex(), new Vertex(-v.b.y,v.b.x) ).add( this.a );
    };

    
    /**
     * The inverse of a vector is a vector witht the same magnitude but oppose direction.
     *
     * Please not that the origin of this vector changes here: a->b becomes b->a.
     *
     * @return {Vector}
     **/
    Vector.prototype.inverse = function() {
	var tmp = this.a;
	this.a = this.b;
	this.b = tmp;
	return this;
    };
    

    /**
     * This function computes the inverse of the vector, which means a stays untouched.
     *
     * @return {Vector} this for chaining.
     **/
    Vector.prototype.inv = function() {
	this.b.x = this.a.x-(this.b.x-this.a.x);
	this.b.y = this.a.y-(this.b.y-this.a.y);
	return this;
    };
    

    /**
     * Create a deep clone of this Vector.
     *
     * @method clone
     * @override
     * @return {Vector} A copy if this line.
     * @instance
     * @memberof Vector
     **/
    Vector.prototype.clone = function() {
	return new Vector( this.a.clone(), this.b.clone() );
    };

    
    /**
     * Create an SVG representation of this line.
     *
     * @method toSVGString
     * @override
     * @param {object=} options - A set of options, like 'className'.
     * @return {string} The SVG string representation.
     * @instance
     * @memberof Vector
     **/
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
