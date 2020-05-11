/**
 * @classdesc A refactored BezierPath class.
 *
 * @require Vertex, CubicBezierCurve
 * 
 * @author Ikaros Kappler
 * @date 2013-08-19
 * @modified 2018-08-16 Added closure. Removed the 'IKRS' wrapper.
 * @modified 2018-11-20 Added circular auto-adjustment.
 * @modified 2018-11-25 Added the point constants to the BezierPath class itself.
 * @modified 2018-11-28 Added the locateCurveByStartPoint() function.
 * @modified 2018-12-04 Added the toSVGString() function.
 * @modified 2019-03-23 Added JSDoc tags.
 * @modified 2019-03-23 Changed the fuctions getPoint and getPointAt to match semantics in the Line class.
 * @modified 2019-11-18 Fixed the clone function: adjustCircular attribute was not cloned.
 * @modified 2019-12-02 Removed some excessive comments.
 * @modified 2019-12-04 Fixed the missing obtainHandleLengths behavior in the adjustNeightbourControlPoint function.
 * @modified 2020-02-06 Added function locateCurveByEndPoint( Vertex ).
 * @modified 2020-02-11 Added 'return this' to the scale(Vertex,number) and to the translate(Vertex) function.
 * @modified 2020-03-24 Ported this class from vanilla-JS to Typescript.
 * @version 2.1.2
 *
 * @file BezierPath
 * @public
 **/

import { CubicBezierCurve } from "./CubicBezierCurve";
import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable} from "./interfaces";

export class BezierPath implements SVGSerializable {


    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string = "BezierPath";
    

    /** 
     * @member {Array<Vertex>} 
     * @memberof BezierPath
     * @type {Array<Vertex>}
     * @instance
     */
    pathPoints:Array<Vertex>;

    /** 
     * @member {number} 
     * @memberof BezierPath
     * @type {number}
     * @instance
     */
    totalArcLength:number;

    /**
     * Set this flag to true if you want the first point and
     * last point of the path to be auto adjusted, too.
     *
     * @member {number} 
     * @memberof BezierPath
     * @type {number}
     * @instance
     */
    adjustCircular:boolean;

    /** 
     * @member {Array<CubicBezierCurve>} 
     * @memberof BezierPath
     * @type {Array<CubicBezierCurve>}
     * @instance
     */
    bezierCurves:Array<CubicBezierCurve>;


    // +---------------------------------------------------------------------------------
    // | These constants equal the values from CubicBezierCurve.
    // +-------------------------------
    /** @constant {number} */
    static START_POINT:number         = 0;
    /** @constant {number} */
    static START_CONTROL_POINT:number = 1;
    /** @constant {number} */
    static END_CONTROL_POINT:number   = 2;
    /** @constant {number} */
    static END_POINT:number           = 3;
    /** @constant {number} */
    START_POINT:number         = 0;
    /** @constant {number} */
    START_CONTROL_POINT:number = 1;
    /** @constant {number} */
    END_CONTROL_POINT:number   = 2;
    /** @constant {number} */
    END_POINT:number           = 3;
    
    
    /**
     * The constructor.<br>
     * <br>
     * This constructor expects a sequence of path points and will approximate
     * the location of control points by picking some between the points.<br>
     * You should consider just constructing empty paths and then add more curves later using
     * the addCurve() function.
     *
     * @constructor
     * @name BezierPath
     * @param {Vertex[]} pathPoints - An array of path vertices (no control points).
     **/
    constructor( pathPoints:Array<Vertex> ) {
	
	if( !pathPoints )
	    pathPoints = [];
	this.totalArcLength = 0.0;
	// Set this flag to true if you want the first point and
	// last point of the path to be auto adjusted, too.
	this.adjustCircular = false;
	this.bezierCurves = [];


	//console.error( "THIS CONSTRUCTOR IS DEPRECATED. USE .fromArray INSTEAD." );
	//throw Error("THIS CONSTRUCTOR IS DEPRECATED. USE .fromArray INSTEAD.");
	/*
	for( var i = 1; i < pathPoints.length; i++ ) {
	    var bounds = new THREE.Box2( pathPoints[i].x - pathPoints[i-1].x, 
					 pathPoints[i].y - pathPoints[i-1].y
				       );
	    // Create a new Bezier curve inside the box
	    var bCurve =  new CubicBezierCurve( pathPoints[i-1],
						pathPoints[i],
						new Vertex( pathPoints[i-1].x, 
							    pathPoints[i-1].y - bounds.min/2
							  ),
						// This control point will be auto-adjusted in the next step
						new Vertex( pathPoints[i].x + bounds.max/2,
							    pathPoints[i].y 
							  )
					      );
	    this.bezierCurves.push( bCurve );
	    this.totalArcLength += bCurve.getLength();
	    
	    // Auto adjust the second control point (should be on a linear sub-space)
	    if( this.bezierCurves.length >= 2 ) {
		this.adjustSuccessorControlPoint( this.bezierCurves.length-2, // curveIndex, 
						  true,                       // obtain handle length?
						  true                        // update arc lengths
						);
	    }
	}
	*/
    };


    /**
     * Add a cubic bezier curve to the end of this path.
     *
     * @method addCurve
     * @param {CubicBezierCurve} curve - The curve to be added to the end of the path.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    addCurve( curve:CubicBezierCurve ) : void {
	if( curve == null || typeof curve == 'undefined' )
	    throw "Cannot add null curve to bézier path.";
	this.bezierCurves.push( curve );
	if( this.bezierCurves.length > 1 ) {
	    curve.startPoint = this.bezierCurves[this.bezierCurves.length-2].endPoint;
	    this.adjustSuccessorControlPoint(
		this.bezierCurves.length-2, // curveIndex,
		true,                       // obtainHandleLength,  
		true                        // updateArcLengths  
	    );    
	} else {
	    this.totalArcLength += curve.getLength();
	}
    };


 
    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartPoint
     * @param {Vertex} point - The (curve start-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (start-) point not found
     **/
    locateCurveByStartPoint( point:Vertex ) : number {
	// for( var i in this.bezierCurves ) {
	for( var i = 0; i < this.bezierCurves.length; i++ ) {    
	    if( this.bezierCurves[i].startPoint.equals(point) )
		return i;
	}
	return -1;
    };


    /**
     * Locate the curve with the given end point (function returns the index).
     *
     * @method locateCurveByEndPoint
     * @param {Vertex} point - The (curve end-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    locateCurveByEndPoint( point:Vertex ) : number {
	// for( var i in this.bezierCurves ) {
	for( var i = 0; i < this.bezierCurves.length; i++ ) { 
	    if( this.bezierCurves[i].endPoint.equals(point) )
		return i;
	}
	return -1;
    };


    /**
     * Locate the curve with the given start point (function returns the index).
     *
     * @method locateCurveByStartControlPoint
     * @param {Vertex} point - The (curve endt-) point to look for.
     * @instance
     * @memberof BezierPath
     * @return {number} The curve index or -1 if curve (end-) point not found
     **/
    locateCurveByStartControlPoint( point:Vertex ) : number {
	// for( var i in this.bezierCurves ) {
	for( var i = 0; i < this.bezierCurves.length; i++ ) { 
	    if( this.bezierCurves[i].startControlPoint.equals(point) )
		return i;
	}
	return -1;
    };
    

    // +---------------------------------------------------------------------------------
    // | Locate the curve with the given end control point.
    // |
    // | @param point:Vertex The point to look for.
    // | @return Number The index or -1 if not found.
    // +-------------------------------
    locateCurveByEndControlPoint( point:Vertex ) : number {
	// for( var i in this.bezierCurves ) {
	for( var i = 0; i < this.bezierCurves.length; i++ ) { 
	    if( this.bezierCurves[i].endControlPoint.equals(point) )
		return i;
	}
	return -1;
    };


    
    /**
     * Get the total length of this path.<br>
     * <br>
     * Note that the returned value comes from the curve buffer. Unregistered changes 
     * to the curve points will result in invalid path length values.
     *
     * @method getLength
     * @instance
     * @memberof BezierPath
     * @return {number} The (buffered) length of the path.
     **/
    getLength() : number {
	return this.totalArcLength;
    };

    
    
    /**
     * This function is internally called whenever the curve or path configuration
     * changed. It updates the attribute that stores the path length information.<br>
     * <br>
     * If you perform any unregistered changes to the curve points you should call
     * this function afterwards to update the curve buffer. Not updating may
     * result in unexpected behavior.
     *
     * @method updateArcLengths
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    updateArcLengths() : void {
	this.totalArcLength = 0.0;
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    this.bezierCurves[ i ].updateArcLengths();
	    this.totalArcLength += this.bezierCurves[ i ].getLength();
	}
    };


    /**
     * Get the number of curves in this path.
     *
     * @method getCurveCount
     * @instance
     * @memberof BezierPath
     * @return {number} The number of curves in this path.
     **/
    getCurveCount() : number {
	return this.bezierCurves.length;
    };



    /**
     * Get the cubic bezier curve at the given index.
     *
     * @method getCurveAt
     * @param {number} index - The curve index from 0 to getCurveCount()-1.
     * @instance
     * @memberof BezierPath
     * @return {CubicBezierCurve} The curve at the specified index.
     **/
    getCurveAt( curveIndex:number ) : CubicBezierCurve {
	return this.bezierCurves[ curveIndex ];
    };



    /**
     * Remove the end point of this path (which removes the last curve from this path).<br>
     * <br>
     * Please note that this function does never remove the first curve, thus the path
     * cannot be empty after this call.
     *
     * @method removeEndPoint
     * @instance
     * @memberof BezierPath
     * @return {boolean} Indicating if the last curve was removed.
     **/
    /*
    BezierPath.prototype.removeEndPoint = function() {
	if( this.bezierCurves.length <= 1 )
	    return false;
	
	var newArray = [ this.bezierCurves.length-1 ];
	for( var i = 0; i < this.bezierCurves.length-1; i++ ) {
	    newArray[i] = this.bezierCurves[i];
	}
	
	// Update arc length
	this.totalArcLength -= this.bezierCurves[ this.bezierCurves.length-1 ].getLength();
	this.bezierCurves = newArray;	
	return true;
    }
    */


    /**
     * Remove the start point of this path (which removes the first curve from this path).<br>
     * <br>
     * Please note that this function does never remove the last curve, thus the path
     * cannot be empty after this call.<br>
     *
     * @method removeStartPoint
     * @instance
     * @memberof BezierPath
     * @return {boolean} Indicating if the first curve was removed.
     **/
    /*
    BezierPath.prototype.removeStartPoint = function() {

	if( this.bezierCurves.length <= 1 )
	    return false;

	var newArray = [ this.bezierCurves.length-1 ];
	for( var i = 1; i < this.bezierCurves.length; i++ ) {

	    newArray[i-1] = this.bezierCurves[i];

	}
	
	// Update arc length
	this.totalArcLength -= this.bezierCurves[ 0 ].getLength();
	this.bezierCurves = newArray;
	
	return true;
    }
    */


    
    /**
     * Removes a path point inside the path.
     *
     * This function joins the bezier curve at the given index with
     * its predecessor, which means that the start point at the given
     * curve index will be removed.
     *
     * @method joinAt
     * @param {number} curveIndex - The index of the curve to be joined with its predecessor.
     * @instance
     * @memberof BezierPath
     * @return {boolean} True if the passed index indicated an inner vertex and the two curves were joined.
     **/
    /*
    BezierPath.prototype.joinAt = function( curveIndex ) {

	if( curveIndex < 0 || curveIndex >= this.bezierCurves.length )
	    return false;
	
	var leftCurve  = this.bezierCurves[ curveIndex-1 ];
	var rightCurve = this.bezierCurves[ curveIndex ];

	// Make the length of the new handle double that long
	var leftControlPoint = leftCurve.getStartControlPoint().clone();
	leftControlPoint.sub( leftCurve.getStartPoint() );
	leftControlPoint.multiplyScalar( 2.0 );
	leftControlPoint.add( leftCurve.getStartPoint() );
	
	var rightControlPoint = rightCurve.getEndControlPoint().clone();
	rightControlPoint.sub( rightCurve.getEndPoint() );
	rightControlPoint.multiplyScalar( 2.0 );
	rightControlPoint.add( rightCurve.getEndPoint() );	

	var newCurve = new IKRS.CubicBezierCurve( leftCurve.getStartPoint(),
						  rightCurve.getEndPoint(),
						  leftControlPoint,
						  rightControlPoint 
						);	
	// Place into array
	var newArray = [ this.bezierCurves.length - 1 ];

	for( var i = 0; i < curveIndex-1; i++ ) 
	    newArray[ i ] = this.bezierCurves[i];
	
	newArray[ curveIndex-1 ] = newCurve;
	
	// Shift trailing curves left
	for( var i = curveIndex; i+1 < this.bezierCurves.length; i++ ) 
	    newArray[ i ] = this.bezierCurves[ i+1 ];
		
	this.bezierCurves = newArray;
	this.updateArcLengths();

	return true;
    }
    */



    /**
     * Add a new inner curve point to the path.<br>
     * <br>
     * This function splits the bezier curve at the given index and given
     * curve segment index.
     *
     * @method splitAt
     * @param {number} curveIndex - The index of the curve to split.
     * @param {nunber} segmentIndex - The index of the curve segment where the split should be performed.
     * @instance
     * @memberof BezierPath
     * @return {boolean} True if the passed indices were valid and the path was split.
     **/
    /*
    BezierPath.prototype.splitAt = function( curveIndex,
					     segmentIndex 
					   ) {
	// Must be a valid curve index
	if( curveIndex < 0 || curveIndex >= this.bezierCurves.length )
	    return false;

	var oldCurve = this.bezierCurves[ curveIndex ];

	// Segment must be an INNER point!
	// (the outer points are already bezier end/start points!)
	if( segmentIndex < 1 || segmentIndex-1 >= oldCurve.segmentCache.length )
	    return false;

	// Make room for a new curve
	for( var c = this.bezierCurves.length; c > curveIndex; c-- ) {
	    // Move one position to the right
	    this.bezierCurves[ c ] = this.bezierCurves[ c-1 ];	    
	}

	// Accumulate segment lengths
	var u = 0;
	for( var i = 0; i < segmentIndex; i++ )
	    u += oldCurve.segmentLengths[i];
	//var tangent = oldCurve.getTangentAt( u );
	var tangent = oldCurve.getTangent( u );
	tangent = tangent.multiplyScalar( 0.25 ); 

	var leftEndControlPoint = oldCurve.segmentCache[ segmentIndex ].clone();
	leftEndControlPoint.sub( tangent );
	
	var rightStartControlPoint = oldCurve.segmentCache[ segmentIndex ].clone();
	rightStartControlPoint.add( tangent );
	
	// Make the old existing handles a quarter that long
	var leftStartControlPoint = oldCurve.getStartControlPoint().clone();
	// move to (0,0)
	leftStartControlPoint.sub( oldCurve.getStartPoint() );
	leftStartControlPoint.multiplyScalar( 0.25 );
	leftStartControlPoint.add( oldCurve.getStartPoint() );

	var rightEndControlPoint = oldCurve.getEndControlPoint().clone(); 
	// move to (0,0)
	rightEndControlPoint.sub( oldCurve.getEndPoint() );
	rightEndControlPoint.multiplyScalar( 0.25 );
	rightEndControlPoint.add( oldCurve.getEndPoint() );

	var newLeft  = new CubicBezierCurve( oldCurve.getStartPoint(),                      // old start point
					     oldCurve.segmentCache[ segmentIndex ],         // new end point
					     leftStartControlPoint,                         // old start control point 
					     leftEndControlPoint                            // new end control point
					   );
	var newRight = new CubicBezierCurve( oldCurve.segmentCache[ segmentIndex ],         // new start point
					     oldCurve.getEndPoint(),                        // old end point
					     rightStartControlPoint,                        // new start control point 
					     rightEndControlPoint                           // old end control point
					   );
	
	// Insert split curve(s) at free index
	this.bezierCurves[ curveIndex ]     = newLeft;
	this.bezierCurves[ curveIndex + 1 ] = newRight;
	
	// Update total arc length, even if there is only a very little change!
	this.totalArcLength -= oldCurve.getLength();
	this.totalArcLength += newLeft.getLength();
	this.totalArcLength += newRight.getLength();

	return true;
    };
    */


   
    /**
     * Move the whole bezier path by the given (x,y)-amount.
     *
     * @method translate
     * @param {Vertex} amount - The amount to be added (amount.x and amount.y) 
     *                          to each vertex of the curve.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} this for chaining
     **/
    translate( amount:Vertex ) : BezierPath {	
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    var curve = this.bezierCurves[ i ];	    
	    curve.getStartPoint().add( amount );
	    curve.getStartControlPoint().add( amount );
	    curve.getEndControlPoint().add( amount );    
	}
	
	// Don't forget to translate the last curve's last point
	var curve : CubicBezierCurve = this.bezierCurves[ this.bezierCurves.length-1 ];
	curve.getEndPoint().add( amount );

	this.updateArcLengths();
	return this;
    };


    
    /**
     * Scale the whole bezier path by the given (x,y)-factors.
     *
     * @method scale
     * @param {Vertex} anchor - The scale origin to scale from.
     * @param {number} amount - The scalar to be multiplied with.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} this for chaining.
     **/
    scale( anchor:Vertex, scaling:number ) : BezierPath {
	
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    var curve = this.bezierCurves[ i ];
	    curve.getStartPoint().scale( scaling, anchor );
	    curve.getStartControlPoint().scale( scaling, anchor );
	    curve.getEndControlPoint().scale( scaling, anchor );
	    // Do NOT scale the end point here!
	    // Don't forget that the curves are connected and on curve's end point
	    // the the successor's start point (same instance)!
	}
	
	// Finally move the last end point (was not scaled yet)
	if( this.bezierCurves.length > 0 && !this.adjustCircular ) {
	    this.bezierCurves[ this.bezierCurves.length-1 ].getEndPoint().scale( scaling, anchor );
	}
	
	this.updateArcLengths();
	return this;
    };


    /**
     * Rotate the whole bezier path around a point..
     *
     * @method rotate
     * @param {Vertex} angle  - The angle to rotate this path by.
     * @param {Vertex} center - The rotation center.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    rotate( angle:number, center:Vertex ) : void {

	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    var curve = this.bezierCurves[ i ];	    
	    curve.getStartPoint().rotate( angle, center ); 
	    curve.getStartControlPoint().rotate( angle, center );
	    curve.getEndControlPoint().rotate( angle, center );
	    // Do NOT rotate the end point here!
	    // Don't forget that the curves are connected and on curve's end point
	    // the the successor's start point (same instance)!
	}
	
	// Finally move the last end point (was not scaled yet)
	if( this.bezierCurves.length > 0 && !this.adjustCircular ) {
	    this.bezierCurves[ this.bezierCurves.length-1 ].getEndPoint().rotate( angle, center );
	}
    };

    

    /**
     * Get the point on the bézier path at the given relative path location.
     *
     * @method getPoint
     * @param {number} u - The relative path position: <pre>0 <= u <= this.getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the relative path position.
     **/
    getPoint( u:number ) : Vertex|undefined {
	if( u < 0 || u > this.totalArcLength ) {
	    console.log( "[BezierPath.getPoint(u)] u is out of bounds: " + u + "." );
	    return null;
	}
	// Find the spline to extract the value from
	var i : number = 0;
	var uTemp : number = 0.0;
	while( i < this.bezierCurves.length &&
	       (uTemp + this.bezierCurves[i].getLength()) < u 
	     ) {
	    
	    uTemp += this.bezierCurves[ i ].getLength();
	    i++;
	}
	
	// if u == arcLength
	//   -> i is max
	if( i >= this.bezierCurves.length )
	    return this.bezierCurves[ this.bezierCurves.length-1 ].getEndPoint().clone();
	
	var bCurve : CubicBezierCurve = this.bezierCurves[ i ];
	var relativeU : number = u - uTemp;
	return bCurve.getPoint( relativeU );
    };


    
    /**
     * Get the point on the bézier path at the given path fraction.
     *
     * @method getPointAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The point at the absolute path position.
     **/
    getPointAt( t:number ) : Vertex {
	return this.getPoint( t * this.totalArcLength );
    };

    
  
    /**
     * Get the tangent of the bézier path at the given path fraction.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getTangentAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The tangent vector at the absolute path position.
     **/
    getTangentAt( t:number ) : Vertex {
	return this.getTangent( t * this.totalArcLength );
    };

    
  
    /**
     *  Get the tangent of the bézier path at the given path location.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getTangent
     * @param {number} u - The relative path position: <pre>0 <= u <= getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The tangent vector at the relative path position.
     **/
    getTangent( u:number ) : Vertex {
	if( u < 0 || u > this.totalArcLength ) {
	    console.warn( "[BezierPath.getTangent(u)] u is out of bounds: " + u + "." );
	    return null;
	}
	// Find the spline to extract the value from
	var i : number = 0;
	var uTemp : number = 0.0;
	while( i < this.bezierCurves.length &&
	       (uTemp + this.bezierCurves[i].getLength()) < u 
	     ) {   
	    uTemp += this.bezierCurves[ i ].getLength();
	    i++;
	}
	var bCurve : CubicBezierCurve = this.bezierCurves[ i ];
	var relativeU : number = u - uTemp;
	return bCurve.getTangent( relativeU );
    };



    /**
     * Get the perpendicular of the bézier path at the given absolute path location (fraction).<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getPerpendicularAt
     * @param {number} t - The absolute path position: <pre>0.0 <= t <= 1.0</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The perpendicluar vector at the absolute path position.
     **/
    getPerpendicularAt( t:number ) : Vertex { 
	return this.getPerpendicular( t * this.totalArcLength );
    };



    /**
     * Get the perpendicular of the bézier path at the given relative path location.<br>
     * <br>
     * Note that the returned vector is not normalized.
     *
     * @method getPerpendicular
     * @param {number} u - The relative path position: <pre>0 <= u <= getLength()</pre>
     * @instance
     * @memberof BezierPath
     * @return {Vertex} The perpendicluar vector at the relative path position.
     **/
    getPerpendicular( u:number ) : Vertex {
	if( u < 0 || u > this.totalArcLength ) {
	    console.log( "[BezierPath.getPerpendicular(u)] u is out of bounds: " + u + "." );
	    return null;
	}

	// Find the spline to extract the value from
	var i : number = 0;
	var uTemp : number = 0.0;
	var uResult : { i:number, uPart:number, uBefore:number } = BezierPath._locateUIndex( this, u );
	var bCurve : CubicBezierCurve = this.bezierCurves[ uResult.i ];
	var relativeU : number = u - uResult.uPart;
	
	return bCurve.getPerpendicular( relativeU );
    };


    /**
     * This is a helper function to locate the curve index for a given
     * absolute path position u.
     *
     * I decided to put this into privat scope as it is really specific. Maybe
     * put this into a utils wrapper.
     *
     * Returns:
     * - {number} i - the index of the containing curve.
     * - {number} uPart - the absolute curve length sum (length from the beginning to u, should equal u itself).
     * - {number} uBefore - the absolute curve length for all segments _before_ the matched curve (usually uBefore <= uPart).
     **/
    static _locateUIndex( path:BezierPath, u:number ) : { i:number, uPart:number, uBefore:number } {
	var i : number = 0;
	var uTemp : number = 0.0;
	var uBefore : number = 0.0;
	while( i < path.bezierCurves.length &&
	       (uTemp + path.bezierCurves[i].getLength()) < u 
	     ) {
	    uTemp += path.bezierCurves[ i ].getLength();
	    if( i+1 < path.bezierCurves.length )
		uBefore += path.bezierCurves[ i ].getLength();
	    i++;
	}
	return { i : i, uPart : uTemp, uBefore : uBefore };
    };
    

    /**
     * Get a specific sub path from this path. The start and end position are specified by
     * ratio number in [0..1].
     *
     * 0.0 is at the beginning of the path.
     * 1.0 is at the end of the path.
     *
     * Values below 0 or beyond 1 are cropped down to the [0..1] interval.
     *
     * startT > endT is allowed, the returned sub path will have inverse direction then.
     *
     * @method getSubPathAt
     * @param {number} startT - The start position of the sub path.
     * @param {number} endT - The end position of the sub path.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The desired sub path in the bounds [startT..endT].
     **/
    getSubPathAt( startT:number, endT:number ) : BezierPath {
	startT = Math.max(0,startT);
	endT = Math.min(1.0,endT);
	let startU : number = startT * this.totalArcLength;
	let endU : number = endT * this.totalArcLength;

	var uStartResult : { i:number, uPart:number, uBefore:number } = BezierPath._locateUIndex( this, startU ); // { i:int, uPart:float, uBefore:float }
	var uEndResult : { i:number, uPart:number, uBefore:number } = BezierPath._locateUIndex( this, endU );     // { i:int, uPart:float, uBefore:float }
	
	var firstT : number = (startU-uStartResult.uBefore) / this.bezierCurves[uStartResult.i].getLength();
	if( uStartResult.i == uEndResult.i ) {
	    // Subpath begins and ends in the same path segment (just get a simple sub curve from that path element).
	    var lastT : number = (endU-uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
	    var firstCurve : CubicBezierCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, lastT); 
	    return BezierPath.fromArray( [ firstCurve ] ); 
	} else {
	    var curves : Array<CubicBezierCurve> = [];
	    if( uStartResult.i > uEndResult.i ) {
		// Back to front direction
		var firstCurve : CubicBezierCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT,0.0);
		curves.push(firstCurve);	
		for( var i = uStartResult.i-1; i > uEndResult.i; i-- ) {
		    curves.push( this.bezierCurves[i].clone().reverse() ); 
		}
		var lastT : number = (endU-uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
		curves.push( this.bezierCurves[uEndResult.i].getSubCurveAt(1.0,lastT) );
	    } else {
		// Front to back direction
		var firstCurve : CubicBezierCurve = this.bezierCurves[uStartResult.i].getSubCurveAt(firstT, 1.0);
		curves.push(firstCurve);
		
		for( var i = uStartResult.i+1; i < uEndResult.i && i < this.bezierCurves.length; i++ ) {
		    curves.push( this.bezierCurves[i].clone() );
		}
		
		var lastT : number = (endU-uEndResult.uBefore) / this.bezierCurves[uEndResult.i].getLength();
		curves.push( this.bezierCurves[uEndResult.i].getSubCurveAt(0,lastT) );
	    }
	    return BezierPath.fromArray( curves );
	}
    };
        

    /**
     * This function moves the addressed curve point (or control point) with
     * keeping up the path's curve integrity.<br>
     * <br>
     * Thus is done by moving neighbour- and control- points as needed.
     *
     * @method moveCurvePoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {number} pointID - One of the curve's four point IDs (START_POINT, 
     *                           START_CONTROL_POINT, END_CONTRO_POINT or END_POINT).
     * @param {Vertex} moveAmount - The amount to move the addressed vertex by.
     * @instance
     * @memberof BezierPath
     * @return {void}
     **/
    moveCurvePoint( curveIndex:number, pointID:number, moveAmount:Vertex ) : void {
	var bCurve : CubicBezierCurve = this.getCurveAt( curveIndex );
	bCurve.moveCurvePoint( pointID,
			       moveAmount,
			       true,       // move control point, too
			       true        // updateArcLengths
			     );

	// If inner point and NOT control point
	//  --> move neightbour
	if( pointID == this.START_POINT && (curveIndex > 0 || this.adjustCircular) ) {

	    // Set predecessor's control point!
	    var predecessor = this.getCurveAt( curveIndex-1<0 ? this.bezierCurves.length+(curveIndex-1) : curveIndex-1 );
	    predecessor.moveCurvePoint( this.END_CONTROL_POINT, 
					moveAmount,
					true,                    // move control point, too
					false                    // updateArcLengths
				      );

	} else if( pointID == this.END_POINT && (curveIndex+1 < this.bezierCurves.length || this.adjustCircular) ) {
	    // Set successcor
	    var successor : CubicBezierCurve = this.getCurveAt( (curveIndex+1)%this.bezierCurves.length );
	    successor.moveCurvePoint( this.START_CONTROL_POINT, 
				      moveAmount, 
				      true,                  // move control point, too
				      false                  // updateArcLengths
				    );
	   
	    
	} else if( pointID == this.START_CONTROL_POINT && curveIndex > 0 ) {
	    
	    this.adjustPredecessorControlPoint( curveIndex, 
						true,            // obtain handle length?
						false            // update arc lengths
					      );
	    
	} else if( pointID == this.END_CONTROL_POINT && curveIndex+1 < this.getCurveCount() ) {
	    
	    this.adjustSuccessorControlPoint( curveIndex, 
					      true,            // obtain handle length?
					      false            // update arc lengths
					    );
	    
	}

	// Don't forget to update the arc lengths!
	// Note: this can be optimized as only two curves have changed their lengths!
	this.updateArcLengths();
    };


    
    /**
     * This helper function adjusts the given point's predecessor's control point.
     *
     * @method adjustPredecessorControlPoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {boolean} obtainHandleLength - Moves the point with keeping the original handle length.
     * @param {boolean} updateArcLength - The amount to move the addressed vertex by.
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    adjustPredecessorControlPoint( curveIndex:number, obtainHandleLength:boolean, updateArcLengths:boolean ): void  {
	
	if( !this.adjustCircular && curveIndex <= 0 )
	    return; // false;

	var mainCurve : CubicBezierCurve = this.getCurveAt( curveIndex );
	var neighbourCurve : CubicBezierCurve = this.getCurveAt( curveIndex-1<0 ? this.getCurveCount()+(curveIndex-1) : curveIndex-1 );
	/* return ? */ this.adjustNeighbourControlPoint( mainCurve,
						 neighbourCurve,
						 mainCurve.getStartPoint(),            // the reference point
						 mainCurve.getStartControlPoint(),     // the dragged control point
						 neighbourCurve.getEndPoint(),         // the neighbour's point
						 neighbourCurve.getEndControlPoint(),  // the neighbour's control point to adjust
						 obtainHandleLength,
						 updateArcLengths
					       );
    };


    
    /**
     * This helper function adjusts the given point's successor's control point.
     *
     * @method adjustSuccessorControlPoint
     * @param {number} curveIndex - The curve index to move a point from.
     * @param {boolean} obtainHandleLength - Moves the point with keeping the original handle length.
     * @param {boolean} updateArcLength - The amount to move the addressed vertex by.
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    adjustSuccessorControlPoint( curveIndex:number, obtainHandleLength:boolean, updateArcLengths:boolean ) : void {
	if( !this.adjustCircular && curveIndex+1 > this.getCurveCount() )
	    return; //  false; 

	var mainCurve : CubicBezierCurve      = this.getCurveAt( curveIndex );
	var neighbourCurve : CubicBezierCurve = this.getCurveAt( (curveIndex+1)%this.getCurveCount() );
	return this.adjustNeighbourControlPoint( mainCurve,
						 neighbourCurve,
						 mainCurve.getEndPoint(),                // the reference point
						 mainCurve.getEndControlPoint(),         // the dragged control point
						 neighbourCurve.getStartPoint(),         // the neighbour's point
						 neighbourCurve.getStartControlPoint(),  // the neighbour's control point to adjust
						 obtainHandleLength,
						 updateArcLengths
					       );
    };

    /**
     * This helper function adjusts the given point's successor's control point.
     *
     * @method adjustNeighbourControlPoint
     * @param {CubicBezierCurve} mainCurve
     * @param {CubicBezierCurve} neighbourCurve
     * @param {Vertex} mainPoint
     * @param {Vertex} mainControlPoint
     * @param {Vertex} neighbourPoint
     * @param {Vertex} neighbourControlPoint
     * @param {boolean} obtainHandleLengths
     * @param {boolean} updateArcLengths
     * @instance
     * @private
     * @memberof BezierPath
     * @return {void}
     **/
    // !!! TODO: SHOULDNT THIS BE A STATIC FUNCTION ???
    adjustNeighbourControlPoint( mainCurve:CubicBezierCurve,
				 neighbourCurve:CubicBezierCurve,
				 mainPoint:Vertex,
				 mainControlPoint:Vertex,
				 neighbourPoint:Vertex,
				 neighbourControlPoint:Vertex,
				 obtainHandleLengths:boolean, 
				 updateArcLengths:boolean
			       ) : void {

	// Calculate start handle length
	var mainHandleBounds : Vertex       = new Vertex( mainControlPoint.x - mainPoint.x,
							  mainControlPoint.y - mainPoint.y
							);
	var neighbourHandleBounds : Vertex  = new Vertex( neighbourControlPoint.x - neighbourPoint.x,
							  neighbourControlPoint.y - neighbourPoint.y
						);
	var mainHandleLength : number       = Math.sqrt( Math.pow(mainHandleBounds.x,2) + Math.pow(mainHandleBounds.y,2) );
	var neighbourHandleLength : number  = Math.sqrt( Math.pow(neighbourHandleBounds.x,2) + Math.pow(neighbourHandleBounds.y,2) );

	if( mainHandleLength <= 0.1 ) 
	    return; // no secure length available for division? What about zoom? Use EPSILON?	
	
	// Just invert the main handle (keep length or not?
	if( obtainHandleLengths ) {
	    neighbourControlPoint.set( neighbourPoint.x - mainHandleBounds.x * (neighbourHandleLength/mainHandleLength),
				       neighbourPoint.y - mainHandleBounds.y * (neighbourHandleLength/mainHandleLength)
				     );
	} else {
	    neighbourControlPoint.set( neighbourPoint.x - mainHandleBounds.x, // * (neighbourHandleLength/mainHandleLength),
				       neighbourPoint.y - mainHandleBounds.y // * (neighbourHandleLength/mainHandleLength)
				     );
	}
	neighbourCurve.updateArcLengths();
    };

    
    /**
     * Clone this BezierPath (deep clone).
     *
     * @method clone
     * @instance
     * @memberof BezierPath
     * @return {BezierPath}
     **/
    clone() : BezierPath {
	var path : BezierPath = new BezierPath( null );
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    path.bezierCurves.push( this.bezierCurves[i].clone() );
	    // Connect splines
	    if( i > 0 )
		path.bezierCurves[i-1].endPoint = path.bezierCurves[i].startPoint;
	}
	path.updateArcLengths();
	path.adjustCircular = this.adjustCircular;
	return path;
    };


    
    /**
     * Compare this and the passed Bézier path.
     *
     * @method equals
     * @param {BezierPath} path - The pass to compare with.
     * @instance
     * @memberof BezierPath
     * @return {boolean}
     **/
    equals( path:BezierPath ) : boolean {
	if( !path )
	    return false;
	// Check if path contains the credentials
	if( !path.bezierCurves )
	    return false;
	if( typeof path.bezierCurves.length == "undefined" )
	    return false;
	if( path.bezierCurves.length != this.bezierCurves.length )
	    return false;
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    if( !this.bezierCurves[i].equals(path.bezierCurves[i]) )
		return false;
	}
	return true;
    };


    /**
     * Create a <pre>&lt;path&gt;</pre> SVG representation of this bézier curve.
     *
     * @method toSVGString
     * @param {object=} [options={}] - Like options.className
     * @param {string=} [options.className] - The classname to use for the SVG item.
     * @instance
     * @memberof BezierPath
     * @return {string} The SVG string.
     **/
    toSVGString( options:{ className?: string } ) : string {
	options = options || {};
	var buffer : Array<string> = [];
	buffer.push( '<path' );
	if( options.className )
	    buffer.push( ' class="' + options.className + '"' );
	buffer.push( ' d="' );
	for( var c = 0; c < this.bezierCurves.length; c++ ) {
	    if( c > 0 )
		buffer.push( ' ' );
	    buffer.push( this.bezierCurves[c].toSVGPathData() );
	}
	buffer.push( '" />' );
	return buffer.join('');
    };



    /**
     * Create a JSON string representation of this bézier curve.
     *
     * @method toJSON
     * @param {boolean} prettyFormat - If true then the function will add line breaks.
     * @instance
     * @memberof BezierPath
     * @return {string} The JSON string.
     **/
    toJSON( prettyFormat:boolean ) : string {
	var buffer : Array<string> = [];
	buffer.push( "[" ); // array begin
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    if( i > 0 ) 
		buffer.push( "," );
	    if( prettyFormat)
		buffer.push( "\n\t" );
	    else
		buffer.push( " " );
	    buffer.push( this.bezierCurves[i].toJSON( prettyFormat ) );
	}
	if( this.bezierCurves.length != 0 )
	    buffer.push( " " );
	buffer.push( "]" ); // array end
	
	return buffer.join( "" ); // Convert to string, with empty separator.
    };


    /**
     * Parse a BezierPath from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The string with the JSON data.
     * @throw An error if the string is not JSON or does not contain a bezier path object.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The parsed bezier path instance.
     **/
    fromJSON( jsonString:string ) : BezierPath {
	var obj:any = JSON.parse( jsonString );
	return BezierPath.fromArray( obj );
    };


    /**
     * Create a BezierPath instance from the given array.
     *
     * @method fromArray
     * @param {Vertex[][]} arr - A two-dimensional array containing the bezier path vertices.
     * @throw An error if the array does not contain proper bezier path data.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The bezier path instance retrieved from the array data.
     **/
    static fromArray( obj:any ) { 

	if( !Array.isArray(obj) )
	    throw "[BezierPath.fromArray] Passed object must be an array.";

	const arr:Array<any> = (obj as Array<Array<Vertex>>); // FORCE?
	
	if( arr.length < 1 )
	    throw "[BezierPath.fromArray] Passed array must contain at least one bezier curve (has " + arr.length + ").";
	
	
	// Create an empty bezier path
	var bPath : BezierPath = new BezierPath( null );
	var lastCurve : CubicBezierCurve|undefined = null;
	for( var i = 0; i < arr.length; i++ ) {
	    
	    // Convert object (or array?) to bezier curve
	    var bCurve : CubicBezierCurve = null;
	    if( CubicBezierCurve.isInstance(arr[i]) ) { 
		bCurve = arr[i].clone();
	    } else if( 0 in arr[i] && 1 in arr[i] && 2 in arr[i] && 3 in arr[i] ) {
		if( !arr[i][0] || !arr[i][1] || !arr[i][2] || !arr[i][3] )
		    throw "Cannot convert path data to BezierPath instance. At least one element is undefined (index="+i+"): " + arr[i];
		bCurve = CubicBezierCurve.fromArray( arr[i] );
	    } else {
		bCurve = CubicBezierCurve.fromObject( arr[i] );
	    }
	    // Set curve start point?
	    // (avoid duplicate point instances!)
	    if( lastCurve )
		bCurve.startPoint = lastCurve.endPoint;
	    
	    // Add to path's internal list
	    bPath.bezierCurves.push( bCurve );
	    // bPath.totalArcLength += bCurve.getLength(); 	    
	    
	    lastCurve = bCurve;
	}
	bPath.updateArcLengths();
	// Bezier segments added. Done
	return bPath;
    };


    
    /**
     * This function converts the bezier path into a string containing
     * integer values only.
     * The points' float values are rounded to 1 digit after the comma.
     *
     * The returned string represents a JSON array (with leading '[' and
     * trailing ']', the separator is ',').
     *
     * @method toReducedListRepresentation
     * @param {number} digits - The number of digits to be used after the comma '.'.
     * @instance
     * @memberof BezierPath
     * @return {string} The reduced list representation of this path.
     **/
    toReducedListRepresentation( digits:number ): string {
	
	if( typeof digits == "undefined" )
	    digits = 1;
	
	var buffer : Array<string> = [];
	buffer.push( "[" ); // array begin
	for( var i = 0; i < this.bezierCurves.length; i++ ) {
	    
	    var curve = this.bezierCurves[i];
	    buffer.push( curve.getStartPoint().x.toFixed(digits) );
	    buffer.push( "," );
	    buffer.push( curve.getStartPoint().y.toFixed(digits) );
	    buffer.push( "," );

	    buffer.push( curve.getStartControlPoint().x.toFixed(digits) );
	    buffer.push( "," );
	    buffer.push( curve.getStartControlPoint().y.toFixed(digits) );
	    buffer.push( "," );
	    
	    buffer.push( curve.getEndControlPoint().x.toFixed(digits) );
	    buffer.push( "," );
	    buffer.push( curve.getEndControlPoint().y.toFixed(digits) );
	    buffer.push( "," );		

	}
	if( this.bezierCurves.length != 0 ) {
	    var curve = this.bezierCurves[ this.bezierCurves.length-1 ];
	    buffer.push( curve.getEndPoint().x.toFixed(digits) );
	    buffer.push( "," );
	    buffer.push( curve.getEndPoint().y.toFixed(digits) );
	}
	buffer.push( "]" ); // array end
	
	return buffer.join( "" ); // Convert to string, with empty separator.
    };


    /**
     * Parse a BezierPath instance from the reduced list representation.<br>
     * <br>
     * The passed string must represent a JSON array containing numbers only.
     *
     * @method fromReducedListRepresentation
     * @param {string} listJSON - The number of digits to be used after the floating point.
     * @throw An error if the string is malformed.
     * @instance
     * @memberof BezierPath
     * @return {BezierPath} The bezier path instance retrieved from the string.
     **/
    static fromReducedListRepresentation( listJSON:string ) : BezierPath {

	// Parse the array
	var pointArray : Array<number> = (JSON.parse( listJSON ) as Array<number>);

	if( !pointArray.length ) {
	    console.log( "Cannot parse bezier path from non-array object nor from empty point list." );
	    throw "Cannot parse bezier path from non-array object nor from empty point list.";
	}
	
	if( pointArray.length < 8 ) {
	    console.log( "Cannot build bezier path. The passed array must contain at least 8 elements (numbers)." );
	    throw "Cannot build bezier path. The passed array must contain at least 8 elements (numbers).";
	}

	// Convert to object
	var bezierPath : BezierPath = new BezierPath( null ); // No points yet
        
	var startPoint : Vertex|undefined        = null;
	var startControlPoint : Vertex|undefined = null;
	var endControlPoint : Vertex|undefined   = null;
	var endPoint : Vertex|undefined          = null;
	var i : number = 0;

	do {
	    
	    if( i == 0 )
		startPoint        = new Vertex( pointArray[i], pointArray[i+1] );
	    startControlPoint = new Vertex( pointArray[i+2], pointArray[i+3] );
	    endControlPoint   = new Vertex( pointArray[i+4], pointArray[i+5] );
	    endPoint          = new Vertex( pointArray[i+6], pointArray[i+7] );

	    var bCurve : CubicBezierCurve = new CubicBezierCurve( startPoint,
								  endPoint,
								  startControlPoint,
								  endControlPoint
								);
	    bezierPath.bezierCurves.push( bCurve );

	    startPoint = endPoint;
	    
	    i += 6;

	} while( i+2 < pointArray.length );
	bezierPath.updateArcLengths();
	return bezierPath;
    };

}
