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
 * @modified 2019-04-24 Added the randomVertex(ViewPort) function.
 * @modified 2019-11-07 Added toSVGString(object) function.
 * @modified 2019-11-18 Added the rotate(number,Vertex) function.
 * @modified 2019-11-21 Fixed a bug in the rotate(...) function (elements were moved).
 * @modified 2020-03-06 Added functions invX() and invY().
 * @modified 2020-03-23 Ported to Typescript from JS.
 * @modified 2020-05-26 Added functions addX(number) and addY(number).
 * @version  2.4.0
 *
 * @file Vertex
 * @public
 **/


import { IVertexAttr, VertexAttr } from "./VertexAttr";
import { VertexListeners } from "./VertexListeners";
import { XYCoords, SVGSerializable} from "./interfaces";


export class Vertex implements XYCoords, SVGSerializable {

    private static readonly ZERO = new Vertex(0,0);

    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "Vertex";
    
    /**
     * An epsilon for comparison
     *
     * @private
     **/
    static readonly EPSILON = 1.0e-6;


    /** 
     * @member {number} 
     * @memberof Vertex
     * @instance
     */
    x:number;

    /** 
     * @member {number} 
     * @memberof Vertex
     * @instance
     */
    y:number;

    /**
     * @member {IVertexAttr}
     * @memberof {Vertex}
     * @instance
     **/
    attr:IVertexAttr;

    /**
     * @member {VertexListeners}
     * @memberof {Vertex}
     * @instance
     **/
    listeners:VertexListeners;
    

    /**
     * The constructor for the vertex class.
     *
     * @constructor
     * @name Vertex
     * @param {number} x - The x-coordinate of the new vertex.
     * @param {number} y - The y-coordinate of the new vertex.
     **/
    constructor( x?:number|XYCoords|undefined, y?:number|undefined ) {
	/*if( x instanceof Vertex ) {
	    this.x = x.x;
	    this.y = x.y;
	    } */
	if( typeof x == 'undefined' ) {
	    this.x = 0;
	    this.y = 0;
	} else if( typeof x == 'number' && typeof y == 'number' ) {
	    this.x = x;
	    this.y = y;
	} else {
	    const tuple = (x as XYCoords);
	    if( typeof tuple.x == "number" && typeof tuple.y == "number" ) {
		this.x = tuple.x;
		this.y = tuple.y;
	    } else {
		if( typeof x == 'number' ) this.x = x;
		else if( typeof x == 'undefined' ) this.x = 0;
		else this.x = NaN;
		if( typeof y == 'number' ) this.y = y;
		else if( typeof y == 'undefined' ) this.y = 0;
		else this.y = NaN;
	    }
	}
	this.attr = new VertexAttr();
	this.listeners = new VertexListeners( this );
    };


    


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
    set( x:number|XYCoords, y?:number|undefined ):Vertex {
	if( typeof x == 'number' && typeof y == 'number' ) {
	    this.x = x;
	    this.y = y;
	} else {
	    const tuple = (x as XYCoords);
	    if( typeof tuple.x == "number" && typeof tuple.y == "number" ) {
		this.x = tuple.x;
		this.y = tuple.y;
	    } else {
		if( typeof x == 'number' ) this.x = x;
		else if( typeof x == 'undefined' ) this.x = 0;
		else this.x = NaN;
		if( typeof y == 'number' ) this.y = y;
		else if( typeof y == 'undefined' ) this.y = 0;
		else this.y = NaN;
	    }
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
    setX( x:number ):Vertex {
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
    setY( y:number ):Vertex {
	this.y = y;
	return this;
    };


    /**
     * Set the x-component if this vertex to the inverse of its value.
     *
     * @method invX
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    invX():Vertex {
	this.x = -this.x;
	return this;
    };


    /**
     * Set the y-component if this vertex to the inverse of its value.
     *
     * @method invy
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    invY():Vertex {
	this.y = -this.y;
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
    add( x:number|XYCoords, y?:number ):Vertex {
	if( typeof x == 'number' && typeof y == 'number' ) {
	    this.x += x;
	    this.y += y;
	} else {
	    const tuple = (x as XYCoords);
	    if( typeof tuple.x == "number" && typeof tuple.y == "number" ) {
		this.x += tuple.x;
		this.y += tuple.y;
	    } else {
		if( typeof x == 'number' ) this.x += x;
		else console.warn(`Cannot add ${typeof x} to numeric x component!`);
		if( typeof y == 'number' ) this.y += y;
		else console.warn(`Cannot add ${typeof y} to numeric y component!`);
	    }
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
    addXY( amountX:number, amountY:number ):Vertex {
	this.x += amountX;
	this.y += amountY;
	return this;
    };

    
    /**
     * Add the passed amounts to the x-component of this vertex.
     * 
     * @method addX
     * @param {number} x - The amount to add to x.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addX( amountX:number ):Vertex {
	this.x += amountX;
	return this;
    };


    /**
     * Add the passed amounts to the y-component of this vertex.
     * 
     * @method addY
     * @param {number} y - The amount to add to y.
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    addY( amountY:number ):Vertex {
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
    sub( x:number|XYCoords, y?:number ):Vertex {
	/* if( typeof x == 'object' && typeof x.x == 'number' && typeof x.y == 'number' ) {
	    this.x -= x.x;
	    this.y -= x.y;
	} else {
	    this.x -= x;
	    this.y -= y;
	    } */
	if( typeof x == 'number' && typeof y == 'number' ) {
	    this.x -= x;
	    this.y -= y;
	} else {
	    const tuple = (x as XYCoords);
	    if( typeof tuple.x == "number" && typeof tuple.y == "number" ) {
		this.x -= tuple.x;
		this.y -= tuple.y;
	    } else {
		if( typeof x == 'number' ) this.x -= x;
		else console.warn(`Cannot add ${typeof x} to numeric x component!`);
		if( typeof y == 'number' ) this.y -= y;
		else console.warn(`Cannot add ${typeof y} to numeric y component!`);
	    }
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
    equals( vertex:XYCoords ):boolean {
	var eqX =  (Math.abs(this.x-vertex.x) < Vertex.EPSILON);
	var eqY =  (Math.abs(this.y-vertex.y) < Vertex.EPSILON);
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
    clone():Vertex {
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
    distance( vert:XYCoords ):number {
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
    difference( vert:XYCoords ):Vertex {
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
    scale( factor:number, center:Vertex ):Vertex {
	if( !center || typeof center === "undefined" )
	    center = new Vertex(0,0);
	this.x = center.x + (this.x-center.x)*factor;
	this.y = center.y + (this.y-center.y)*factor; 
	return this;
    };


    /**
     * This is a vector-like behavior and 'rotates' this vertex
     * around given center.
     *
     * @method rotate
     * @param {number} angle - The angle to 'rotate' this vertex; 0.0 means no change.
     * @param {Vertex=} center - The center of rotation; default is (0,0).
     * @return {Vertex} this
     * @instance
     * @memberof Vertex
     **/
    rotate( angle:number, center:Vertex|undefined ):Vertex {
	if( !center || typeof center === "undefined" )
	    center = new Vertex(0,0);
	this.sub( center );
	angle += Math.atan2(this.y,this.x);
	let len = this.distance(Vertex.ZERO); // {x:0,y:0});
	let lenX = this.x;
	let lenY = this.y;
	this.x = len * Math.cos(angle);
	this.y = len * Math.sin(angle);
	this.add( center );
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
    multiplyScalar( scalar:number ) {
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
    round():Vertex {
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
    inv():Vertex {
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
    toString():string {
	return '('+this.x+','+this.y+')';
    };


    /**
     * Convert this vertex to SVG code.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Vertex
     **/
    toSVGString( options:{ className?:string } ):string {
	options = options || {};
	var buffer = [];
	buffer.push( '<circle' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' cx="' + this.x + '"' );
	buffer.push( ' cy="' + this.y + '"' );
	buffer.push( ' r="2"' );
	buffer.push( ' />' );
	return buffer.join('');
    };
    // END Vertex


    /**
     * Create a new random vertex inside the given viewport.
     *
     * @param {ViewPort} viewPort - A {min:Vertex, max:Vertex} viewport specifying the bounds.
     * @return A new vertex with a random position.
     **/
    static randomVertex( viewPort:{min:XYCoords,max:XYCoords} ):Vertex {
	return new Vertex( viewPort.min.x + Math.random()*(viewPort.max.x-viewPort.min.x),
			   viewPort.min.y + Math.random()*(viewPort.max.y-viewPort.min.y)
			 );
    };


    static utils = {
	/**
	 * Generate a four-point arrow head, starting at the vector end minus the
	 * arrow head length.
	 *
	 * The first vertex in the returned array is guaranteed to be the located
	 * at the vector line end minus the arrow head length.
	 *
	 *
	 * Due to performance all params are required.
	 *
	 * The params scaleX and scaleY are required for the case that the scaling is not uniform (x and y
	 * scaling different). Arrow heads should not look distored on non-uniform scaling.
	 *
	 * If unsure use 1.0 for scaleX and scaleY (=no distortion).
	 * For headlen use 8, it's a good arrow head size.
	 *
	 * Example:
	 *    buildArrowHead( new Vertex(0,0), new Vertex(50,100), 8, 1.0, 1.0 )
	 *
	 * @param {Vertex} zA - The start vertex of the vector to calculate the arrow head for.
	 * @param {Vertex} zB - The end vertex of the vector.
	 * @param {number} headlen - The length of the arrow head (along the vector direction. A good value is 12).
	 * @param {number} scaleX  - The horizontal scaling during draw.
	 * @param {number} scaleY  - the vertical scaling during draw.
	 **/
	// @DEPRECATED: use Vector.utils.buildArrowHead instead!!!
	buildArrowHead : ( zA:Vertex, zB:Vertex, headlen:number, scaleX:number, scaleY:number ) : Array<Vertex> => {
	    // console.warn('This function is deprecated! Use Vector.utils.buildArrowHead instead!');
	    var angle :number = Math.atan2( (zB.y-zA.y)*scaleY, (zB.x-zA.x)*scaleX );
	    
	    var vertices : Array<Vertex>= [];
	    vertices.push( new Vertex(zB.x*scaleX-(headlen)*Math.cos(angle), zB.y*scaleY-(headlen)*Math.sin(angle)) );    
	    vertices.push( new Vertex(zB.x*scaleX-(headlen*1.35)*Math.cos(angle-Math.PI/8), zB.y*scaleY-(headlen*1.35)*Math.sin(angle-Math.PI/8) ) );
	    vertices.push( new Vertex(zB.x*scaleX, zB.y*scaleY) );
	    vertices.push( new Vertex(zB.x*scaleX-(headlen*1.35)*Math.cos(angle+Math.PI/8), zB.y*scaleY-(headlen*1.35)*Math.sin(angle+Math.PI/8)) );

	    return vertices;
	} 
	
    };
    
}
