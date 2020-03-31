

import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable} from "./interfaces";

export class VertTuple<T extends VertTuple<T>> {


    /** 
     * @member {Vertex} 
     * @memberof Line
     * @instance
     */
    a:Vertex;

    /** 
     * @member {Vertex} 
     * @memberof Line
     * @instance
     */
    b:Vertex;

    private factory: (a:Vertex,b:Vertex)=>T;
    

    /**
     * Creates an instance.
     *
     * @constructor
     * @name Line
     * @param {Vertex} a The tuple's first point.
     * @param {Vertex} b The tuple's second point.
     **/
    constructor(a:Vertex,b:Vertex,factory:(a:Vertex,b:Vertex)=>T) { 
       	this.a = a;
	this.b = b;
	this.factory = factory;
    }

    
    /**
     * Get the length of this line.
     *
     * @method length
     * @instance
     * @memberof Line
     **/
    length():number {
	return Math.sqrt( Math.pow(this.b.x-this.a.x,2) + Math.pow(this.b.y-this.a.y,2) );
    };


    /**
     * Set the length of this vector to the given amount. This only works if this
     * vector is not a null vector.
     *
     * @method setLength
     * @param {number} length - The desired length.
     * @memberof Line
     * @return {Line} this (for chaining)
     **/
    setLength( length:number ):VertTuple<T> {
	return this.scale( length/this.length() );
    };
    

    /**
     * Substract the given vertex from this line's end points.
     *
     * @method sub
     * @param {Vertex} amount The amount (x,y) to substract.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    sub( amount:Vertex ):VertTuple<T> {
	this.a.sub( amount );
	this.b.sub( amount );
	return this;
    };


    /**
     * Add the given vertex to this line's end points.
     *
     * @method add
     * @param {Vertex} amount The amount (x,y) to add.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    add( amount:Vertex ):VertTuple<T> {
	this.a.add( amount );
	this.b.add( amount );
	return this;
    };


    /**
     * Normalize this line (set to length 1).
     *
     * @method normalize
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    normalize():VertTuple<T> {
	this.b.set( this.a.x + (this.b.x-this.a.x)/this.length(),
		    this.a.y + (this.b.y-this.a.y)/this.length() );
	return this;
    }; 
    
    
    /**
     * Scale this line by the given factor.
     *
     * @method scale
     * @param {number} factor The factor for scaling (1.0 means no scale).
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    scale( factor:number ):VertTuple<T> {
	this.b.set( this.a.x + (this.b.x-this.a.x)*factor,
		    this.a.y + (this.b.y-this.a.y)*factor );
	return this;
    };


    /**
     * Move this line to a new location.
     *
     * @method moveTo
     * @param {Vertex} newA - The new desired location of 'a'. Vertex 'b' will be moved, too.
     * @return {Line} this
     * @instance
     * @memberof Line
     **/
    moveTo( newA:Vertex ):VertTuple<T> {
	let diff = this.a.difference( newA );
	this.a.add( diff );
	this.b.add( diff );
	return this;
    };


    /**
     * Get the angle between this and the passed line (in radians).
     *
     * @method angle
     * @param {Line} [line] - (optional) The line to calculate the angle to. If null the baseline (x-axis) will be used.
     * @return {number} this
     * @instance
     * @memberof Line
     **/
    angle( line:VertTuple<any> ):number {
	if( typeof line == 'undefined' )
	    line = this.factory( new Vertex(0,0), new Vertex(100,0) ); // new Line( new Vertex(0,0), new Vertex(100,0) );
	// Compute the angle from x axis and the return the difference :)
	var v0 = this.b.clone().sub( this.a );
	var v1 = line.b.clone().sub( line.a );
	// Thank you, Javascript, for this second atan function. No additional math is needed here!
	// The result might be negative, but isn't it usually nicer to determine angles in positive values only?
	return Math.atan2( v1.x, v1.y ) - Math.atan2( v0.x, v0.y );
    };


    /**
     * Get line point at position t in [0 ... 1]:<br>
     * <pre>[P(0)]=[A]--------------------[P(t)]------[B]=[P(1)]</pre><br>
     * <br>
     * The counterpart of this function is Line.getClosestT(Vertex).
     *
     * @method vertAt
     * @param {number} t The position scalar.
     * @return {Vertex} The vertex a position t. 
     * @instance
     * @memberof Line
     **/
    vertAt( t:number ):Vertex {
	return new Vertex( this.a.x + (this.b.x-this.a.x)*t,
			   this.a.y + (this.b.y-this.a.y)*t );
    };


    /**
     * Get the denominator of this and the given line.
     * 
     * If the denominator is zero (or close to zero) both line are co-linear.
     *
     * @param {Line} line
     * @return {Number}
     **/
    denominator( line:VertTuple<T> ):number {
	// http://jsfiddle.net/justin_c_rounds/Gd2S2/
	return ((line.b.y - line.a.y) * (this.b.x - this.a.x)) - ((line.b.x - line.a.x) * (this.b.y - this.a.y));
    };


    /**
     * Checks if this and the given line are co-linear.
     *
     * The constant Vertex.EPSILON is used for tolerance.
     *
     * @param {Line} line
     * @return true if both lines are co-linear.
     */
    colinear( line:VertTuple<T> ):boolean {
	return Math.abs( this.denominator(line) ) < Vertex.EPSILON;
    };


    /**
     * Get the closest position T from this line to the specified point.
     *
     * The counterpart for this function is Line.vertAt(Number).
     *
     * @method getClosestT
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The line position t of minimal distance to p.
     * @instance
     * @memberof Line
     **/
    getClosestT( p:Vertex ):number {
	var l2 = VertTuple.vtutils.dist2(this.a, this.b);
	if( l2 === 0 ) return 0; 
	var t = ((p.x - this.a.x) * (this.b.x - this.a.x) + (p.y - this.a.y) * (this.b.y - this.a.y)) / l2;
	// Wrap to [0,1]?
	// t = Math.max(0, Math.min(1, t));
	return t;
    };


    /**
     * The the minimal distance between this line and the specified point.
     *
     * @method pointDistance
     * @param {Vertex} p The point (vertex) to measre the distance to.
     * @return {number} The absolute minimal distance.
     * @instance
     * @memberof Line
     **/
    pointDistance( p:Vertex ):number {
	// Taken From:
	// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment

	function dist2(v, w) {
	    return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
	}

	// p - point
	// v - start point of segment
	// w - end point of segment
	function distToSegmentSquared (p, v, w) {
	    //var l2 = dist2(v, w);
	    //if( l2 === 0 ) return dist2(p, v);
	    //var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	    //t = Math.max(0, Math.min(1, t));
	    return dist2(p, this.vertAt(this.getClosestLineT(p))); // dist2(p, [ v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ]);
	}

	// p - point
	// v - start point of segment
	// w - end point of segment
	//function distToSegment (p, v, w) {
	//    return Math.sqrt(distToSegmentSquared(p, v, w));
	//}

	return Math.sqrt( distToSegmentSquared(p, this.a, this.b) );
    };


        
    /**
     * Create a deep clone of this instance.
     *
     * @method cloneLine
     * @return {T} A type safe clone if this instance.
     * @instance
     * @memberof Line
     **/ 
    clone():T {
	return this.factory(this.a.clone(),this.b.clone());
    };


    /**
     * Create a string representation of this line.
     *
     * @method totring
     * @return {string} The string representing this line.
     * @instance
     * @memberof Line
     **/
    toString():string {
	return "{ a : " + this.a.toString() + ", b : " + this.b.toString() + " }";
    };

    
    /**
     * @private
     **/
    static vtutils = {
	dist2 : function(v:Vertex, w:Vertex) {
	    return (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y);
	}
	//distToSegmentSquared (p, v, w) {
	//    return VertTuple.utils.dist2(p, this.vertAt(this.getClosestLineT(p)));
	//}
    };
   


    //static private utils {

    //}

}
