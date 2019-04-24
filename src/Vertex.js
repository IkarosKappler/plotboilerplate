/**
 * @classdesc A vertex is a pair of two numbers.<br>
 * <br>
 * It is used to identify a 2-dimensional point on the x-y-plane.
 *
 * @requires VertexAttr
 * 
 * @author   Ikaros Kappler
 * @date     2012-10-17
 * @modified 2018-04-03 Refactored the code of october 2012 into a new class.
 * @modified 2018-04-28 Added some documentation.
 * @modified 2018-08-16 Added the set() function.
 * @modified 2018-08-26 Added VertexAttr.
 * @modified 2018-10-31 Extended the constructor by object{x,y}.
 * @modified 2018-11-19 Extended the set(number,number) function to set(Vertex).
 * @modified 2018-11-28 Added 'this' to the VertexAttr constructor.
 * @modified 2018-12-05 Added the sub(...) function. Changed the signature of the add() function! add(Vertex) and add(number,number) are now possible.
 * @modified 2018-12-21 (It's winter solstice) Added the inv()-function.
 * @modified 2019-01-30 Added the setX(Number) and setY(Number) functions.
 * @modified 2019-02-19 Added the difference(Vertex) function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @mosified 2019-04-24 Added the randomVertex(ViewPort) function.
 * @version  2.1.0
 *
 * @file Vertex
 * @public
 **/


(function(_context) {
    'use strict';

    /**
     * An epsilon for comparison
     *
     * @private
     **/
    var EPSILON = 1.0e-6;


    /**
     * The constructor for the vertex class.
     *
     * @constructor
     * @name Vertex
     * @param {number} x - The x-coordinate of the new vertex.
     * @param {number} y - The y-coordinate of the new vertex.
     **/
    var Vertex = function( x, y ) {
	if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x = x.x;
	    this.y = x.y;
	} else {
	    if( typeof x == 'undefined' ) x = 0;
	    if( typeof y == 'undefined' ) y = 0;
	    this.x = x;
	    this.y = y;
	}
	this.attr = new VertexAttr();
	this.listeners = new VertexListeners( this );
    };


    /** 
     * @member {Vertex} 
     * @memberof Vertex
     * @instance
     */
    Vertex.prototype.x = null;

    /** 
     * @member {Vertex} 
     * @memberof Vertex
     * @instance
     */
    Vertex.prototype.y = null;


    /**
     * Set the x- and y- component of this vertex.
     *
     * @method set
     * @param {number} x - The new x-component.
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
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


    /**
     * Set the x-component of this vertex.
     *
     * @method setX
     * @param {number} x - The new x-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.setX = function( x ) {
	this.x = x;
	return this;
    };


    /**
     * Set the y-component of this vertex.
     *
     * @method setY
     * @param {number} y - The new y-component.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.setY = function( y ) {
	this.y = y;
	return this;
    };
    

    /**
     * Add the passed amount to x- and y- component of this vertex.<br>
     * <br>
     * This function works with add( {number}, {number} ) and 
     * add( {Vertex} ), as well.
     *
     * @method add
     * @param {(number|Vertex)} x - The amount to add to x (or a vertex itself).
     * @param {number=} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.add = function( x, y ) {
	if( typeof x == 'number' ) {
	    this.x += x;
	    if( typeof y == 'number' )
		this.y += y;
	} else {
	    this.x += x.x;
	    this.y += x.y;
	}
	return this;
    };


    /**
     * Add the passed amounts to the x- and y- components of this vertex.
     * 
     * @method addXY
     * @param {number} x - The amount to add to x.
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.addXY = function( amountX, amountY ) {
	this.x += amountX;
	this.y += amountY;
	return this;
    };


    /**
     * Substract the passed amount from x- and y- component of this vertex.<br>
     * <br>
     * This function works with sub( {number}, {number} ) and 
     * sub( {Vertex} ), as well.
     *
     * @method sub
     * @param {(number|Vertex)} x - The amount to substract from x (or a vertex itself).
     * @param {number=} y - The amount to substract from y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
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
    
    
    /**
     * Check if this vertex equals the passed one.
     * <br>
     * This function uses an internal epsilon as tolerance.
     *
     * @method equals
     * @param {Vertex} vertex - The vertex to compare this with.
     * @return {boolean}
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.equals = function( vertex ) {
	var eqX =  (Math.abs(this.x-vertex.x) < EPSILON);
	var eqY =  (Math.abs(this.y-vertex.y) < EPSILON);
	var result = eqX && eqY;
	return result;
    };


    /**
     * Create a copy of this vertex.
     * 
     * @method clone
     * @return {Vertex} A new vertex, an exact copy of this.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.clone = function() {
	return new Vertex(this.x,this.y);
    };


    /**
     * Get the distance to the passed point (in euclidean metric)
     *
     * @method distance
     * @param {Vertex} vert - The vertex to measure the distance to.
     * @return {number}
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.distance = function( vert ) {
	return Math.sqrt( Math.pow(vert.x-this.x,2) + Math.pow(vert.y-this.y,2) );
    };


    /**
     * Get the difference to the passed point.<br>
     * <br>
     * The difference is (vert.x-this.x, vert.y-this.y).
     *
     * @method difference
     * @param {Vertex} vert - The vertex to measure the x-y-difference to.
     * @return {Vertex} A new vertex.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.difference = function( vert ) {
	return new Vertex( vert.x-this.x, vert.y-this.y );
    };


    /**
     * This is a vector-like behavior and 'scales' this vertex
     * towards/from a given center.
     *
     * @method scale
     * @param {number} factor - The factor to 'scale' this vertex; 1.0 means no change.
     * @param {Vertex=} center - The origin of scaling; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.scale = function( factor, center ) {
	if( !center || typeof center === "undefined" )
	    center = new Vertex(0,0);
	this.x = center.x + (this.x-center.x)*factor;
	this.y = center.y + (this.y-center.y)*factor; 
	return this;
    };


    /**
     * Multiply both components of this vertex with the given scalar.<br>
     * <br>
     * Note: as in<br>
     *    https://threejs.org/docs/#api/math/Vector2.multiplyScalar
     *
     * @method multiplyScalar
     * @param {number} scalar - The scale factor; 1.0 means no change.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.multiplyScalar = function( scalar ) {
	this.x *= scalar;
	this.y *= scalar;
	return this;
    };


    /**
     * Round the two components x and y of this vertex.
     *
     * @method round
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.round = function() {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	return this;
    };


    /**
     * Change this vertex (x,y) to its inverse (-x,-y).
     *
     * @method inv
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.inv = function() {
	this.x = -this.x;
	this.y = -this.y;
	return this;
    };
    
    
    /**
     * Get a string representation of this vertex.
     *
     * @method toString
     * @return {string} The string representation of this vertex.
     * @instance
     * @memberof Vertex
     **/
    Vertex.prototype.toString = function() {
	return '('+this.x+','+this.y+')';
    };
    // END Vertex


    /**
     * Create a new random vertex inside the given viewport.
     *
     * @param {ViewPort} viewPort - A {min:Vertex, max:Vertex} viewport specifying the bounds.
     * @return A new vertex with a random position.
     **/
    Vertex.randomVertex = function( viewPort ) {
	return new Vertex( viewPort.min.x + Math.random()*(viewPort.max.x-viewPort.min.x),
			   viewPort.min.y + Math.random()*(viewPort.max.y-viewPort.min.y)
			 );
    };
    
    
    _context.Vertex = Vertex;

})( window ? window : module.export );
