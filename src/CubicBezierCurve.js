/**
 * @classdesc A refactored cubic bezier curve class.
 *
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2013-08-15
 * @modified 2018-08-16 Added a closure. Removed the wrapper class 'IKRS'. Replaced class THREE.Vector2 by Vertex class.
 * @modified 2018-11-19 Added the fromArray(Array) function.
 * @modified 2018-11-28 Added the locateCurveByPoint(Vertex) function.
 * @modified 2018-12-04 Added the toSVGPathData() function.
 * @modified 2019-03-20 Added JSDoc tags.
 * @modified 2019-03-23 Changed the signatures of getPoint, getPointAt and getTangent (!version 2.0).
 * @modified 2019-12-02 Fixed the updateArcLength function. It used the wrong pointAt function (was renamed before).
 * @version  2.0.1
 *
 * @file CubicBezierCurve
 * @public
 **/


(function(_context) {
    'use strict';

    /**
     * The constructor.
     *
     * @constructor
     * @name CubicBezierCurve
     * @param {Vertex} startPoint - The Bézier curve's start point.
     * @param {Vertex} endPoint   - The Bézier curve's end point.
     * @param {Vertex} startControlPoint - The Bézier curve's start control point.
     * @param {Vertex} endControlPoint   - The Bézier curve's end control point.
     **/
    var CubicBezierCurve = function ( startPoint,
				      endPoint,
				      startControlPoint,
				      endControlPoint
				    ) {		
	
	this.startPoint         = startPoint;
	this.startControlPoint  = startControlPoint;
	this.endPoint           = endPoint;
	this.endControlPoint    = endControlPoint;	
	this.curveIntervals     = 30;
	// An array of points
	this.segmentCache       = [];
	// An array of floats
	this.segmentLengths     = [];
	// float
	this.arcLength          = null;
	
	this.updateArcLengths();
    };

    /** @constant {number} */
    CubicBezierCurve.START_POINT         = 0;
    /** @constant {number} */
    CubicBezierCurve.START_CONTROL_POINT = 1;
    /** @constant {number} */
    CubicBezierCurve.END_CONTROL_POINT   = 2;
    /** @constant {number} */
    CubicBezierCurve.END_POINT           = 3;

    
    // CubicBezierCurve.prototype = new Object();
    CubicBezierCurve.prototype.constructor = CubicBezierCurve; 

    /** @constant {number} */
    CubicBezierCurve.prototype.START_POINT         = 0;
    /** @constant {number} */
    CubicBezierCurve.prototype.START_CONTROL_POINT = 1;
    /** @constant {number} */
    CubicBezierCurve.prototype.END_CONTROL_POINT   = 2;
    /** @constant {number} */
    CubicBezierCurve.prototype.END_POINT           = 3;

    
    /**
     * Move the given curve point (the start point, end point or one of the two
     * control points).
     *
     * @method moveCurvePoint
     * @param {number} pointID - The numeric identicator of the point to move. Use one of the four constants.
     * @param {Vertex} moveAmount - The amount to move the specified point by.
     * @param {boolean} moveControlPoint - Move the control points along with their path point (if specified point is a path point).
     * @param {boolean} updateArcLengths - Specifiy if the internal arc segment buffer should be updated.
     * @instance
     * @memberof CubicBezierCurve
     * @return {void}
     **/
    CubicBezierCurve.prototype.moveCurvePoint = function( pointID,           // int
							  moveAmount,        // Vertex
							  moveControlPoint,  // boolean
							  updateArcLengths   // boolean
							) {
	if( pointID == this.START_POINT ) {
	    this.getStartPoint().add( moveAmount );
	    if( moveControlPoint )
		this.getStartControlPoint().add( moveAmount );

	} else if( pointID == this.START_CONTROL_POINT ) {
	    this.getStartControlPoint().add( moveAmount );

	} else if( pointID == this.END_CONTROL_POINT ) {
	    this.getEndControlPoint().add( moveAmount );

	} else if( pointID == this.END_POINT ) {
	    this.getEndPoint().add( moveAmount );
	    if( moveControlPoint )
		this.getEndControlPoint().add( moveAmount );

	} else {
	    console.log( "[IKRS.CubicBezierCurve.moveCurvePoint] pointID '" + pointID +"' invalid." );
	}
	
	if( updateArcLengths )
	    this.updateArcLengths();
    }



    /**
     * Translate the whole curve by the given {x,y} amount: moves all four points.
     *
     * @method translate
     * @param {Vertex} amount - The amount to translate this curve by.
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} this
     **/
    CubicBezierCurve.prototype.translate = function( amount ) {
	this.startPoint.add( amount );
	this.startControlPoint.add( amount );
	this.endControlPoint.add( amount );
	this.endPoint.add( amount );   
    };


    
    /**
     * Get the total curve length.<br>
     * <br> 
     * As not all Bézier curved have a closed formula to calculate their lengths, this
     * implementation uses a segment buffer (with a length of 30 segments). So the 
     * returned length is taken from the arc segment buffer.<br>
     * <br>
     * Note that if the curve points were changed and the segment buffer was not
     * updated this function might return wrong (old) values.
     *
     * @method getLength
     * @instance
     * @memberof CubicBezierCurve
     * @return {number} >= 0
     **/
    CubicBezierCurve.prototype.getLength = function() {
	return this.arcLength;
    };

    
    /**
     * Uptate the internal arc segment buffer and their lengths.<br>
     * <br>
     * All class functions update the buffer automatically; if any
     * curve point is changed by other reasons you should call this
     * function to keep actual values in the buffer.
     *
     * @method updateArcLengths
     * @instance
     * @memberof CubicBezierCurve
     * @return {void}
     **/
    CubicBezierCurve.prototype.updateArcLengths = function() {
	var 
	pointA = new Vertex( this.startPoint.x, this.startPoint.y ),
	pointB = new Vertex( 0, 0 ),
	curveStep = 1.0/this.curveIntervals;
	
	var   u = curveStep; 
	// Clear segment cache
	this.segmentCache = [];
	// Push start point into buffer
	this.segmentCache.push( this.startPoint );	
	this.segmentLengths = [];
	//this.arcLength = 0.0;
	let newLength = 0.0;

	/*
	for( var i = 0; i < this.curveIntervals; i++) {	    
	    pointB = this.getPointAt( (i+1) * curveStep );  // parameter is 'u' (not 't')
	    //pointB = this.getPoint( (i+1) * curveStep );  // parameter is 'u' (not 't')
	    
	    // Store point into cache
	    this.segmentCache.push( pointB ); 

	    // Calculate segment length
	    var tmpLength = pointA.distance(pointB); // Math.sqrt( Math.pow(pointA.x-pointB.x,2) + Math.pow(pointA.y-pointB.y,2) );
	    this.segmentLengths.push( tmpLength );
	    newLength += tmpLength;
	    
	    pointA = pointB;
            u += curveStep;
	} // END for
	this.arcLength = newLength;
*/
	
	
	var t = 0.0;
	while( t <= 1.0 ) { //console.log('x',t);
	    pointB = this.getPointAt(t); // (i+1) * curveStep );  // parameter is 'u' (not 't')
	    
	    // Store point into cache
	    this.segmentCache.push( pointB ); 

	    // Calculate segment length
	    var tmpLength = pointA.distance(pointB); // Math.sqrt( Math.pow(pointA.x-pointB.x,2) + Math.pow(pointA.y-pointB.y,2) );
	    this.segmentLengths.push( tmpLength );
	    this.arcLength += tmpLength;
	    
	    pointA = pointB;
            // u += curveStep;
	    
	    t += curveStep;
	}
	
    }; // END function


    /**
     * Get the start point of the curve.<br>
     * <br>
     * This function just returns this.startPoint.
     *
     * @method getStartPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.startPoint
     **/
    CubicBezierCurve.prototype.getStartPoint = function() {
	return this.startPoint;
    };

    /**
     * Get the end point of the curve.<br>
     * <br>
     * This function just returns this.endPoint.
     *
     * @method getEndPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.endPoint
     **/
    CubicBezierCurve.prototype.getEndPoint = function() {
	return this.endPoint;
    };

    /**
     * Get the start control point of the curve.<br>
     * <br>
     * This function just returns this.startControlPoint.
     *
     * @method getStartControlPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.startControlPoint
     **/
    CubicBezierCurve.prototype.getStartControlPoint = function() {
	return this.startControlPoint;
    };

    /**
     * Get the end control point of the curve.<br>
     * <br>
     * This function just returns this.endControlPoint.
     *
     * @method getEndControlPoint
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} this.endControlPoint
     **/
    CubicBezierCurve.prototype.getEndControlPoint = function() {
	return this.endControlPoint;
    };


    /**
     * Get one of the four curve points specified by the passt point ID.
     *
     * @method getEndControlPoint
     * @param {number} id - One of START_POINT, START_CONTROL_POINT, END_CONTROL_POINT or END_POINT.
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPointByID = function( id ) {
	if( id == this.START_POINT ) return this.startPoint;
	if( id == this.END_POINT ) return this.endPoint;
	if( id == this.START_CONTROL_POINT ) return this.startControlPoint;
	if( id == this.END_CONTROL_POINT ) return this.endControlPoint;
	throw "Invalid point ID '" + id +"'.";
    };


    /**
     * Get the curve point at a given position t, where t is in [0,1].<br>
     * <br>
     * @see Line.pointAt
     *
     * @method getPointAt
     * @param {number} t - The position on the curve in [0,1] (0 means at 
     *                     start point, 1 means at end point, other values address points in bertween).
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPointAt = function( t ) {
	// Perform some powerful math magic
	var x = this.startPoint.x * Math.pow(1.0-t,3) + this.startControlPoint.x*3*t*Math.pow(1.0-t,2)
	    + this.endControlPoint.x*3*Math.pow(t,2)*(1.0-t)+this.endPoint.x*Math.pow(t,3);
	var y = this.startPoint.y*Math.pow(1.0-t,3)+this.startControlPoint.y*3*t*Math.pow(1.0-t,2)
	    + this.endControlPoint.y*3*Math.pow(t,2)*(1.0-t)+this.endPoint.y*Math.pow(t,3);
	return new Vertex( x, y );
    };


    /**
     * Get the curve point at a given position u, where u is in [0,arcLength].<br>
     * <br>
     * @see CubicBezierCurve.getPointAt
     *
     * @method getPoint
     * @param {number} u - The position on the curve in [0,arcLength] (0 means at 
     *                     start point, arcLength means at end point, other values address points in bertween).
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getPoint = function( u ) {  
	return this.getPointAt( u / this.arcLength );
    };


    /**
     * Get the curve tangent vector at a given absolute curve position t in [0,1].<br>
     * <br>
     * Note that the returned tangent vector (end point) is not normalized and relative to (0,0).
     *
     * @method getTangent
     * @param {number} t - The position on the curve in [0,1].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    CubicBezierCurve.prototype.getTangentAt = function( t ) {// console.log(t);
	
	var a = this.getStartPoint();
	var b = this.getStartControlPoint();
	var c = this.getEndControlPoint();
	var d = this.getEndPoint();
	
	// This is the shortened one
	var t2 = t * t;
	var t3 = t * t2;
	// (1 - t)^2 = (1-t)*(1-t) = 1 - t - t + t^2 = 1 - 2*t + t^2
	var nt2 = 1 - 2*t + t2;

	var tX = -3 * a.x * nt2 + 
	    b.x * (3 * nt2 - 6 *(t-t2) ) +
	    c.x * (6 *(t-t2) - 3*t2) +
	    3*d.x*t2;
	var tY = -3 * a.y * nt2 + 
	    b.y * (3 * nt2 - 6 *(t-t2) ) +
	    c.y * (6 *(t-t2) - 3*t2) +
	    3*d.y*t2;
	
	// Note: my implementation does NOT normalize tangent vectors!
	return new Vertex( tX, tY );
	

	/*
	// http://www.independent-software.com/determining-coordinates-on-a-html-canvas-bezier-curve.html
	function getBezierAngle(t, sx, sy, cp1x, cp1y, cp2x, cp2y, ex, ey) {
	    var dx = Math.pow(1-t, 2)*(cp1x-sx) + 2*t*(1-t)*(cp2x-cp1x) + t * t * (ex - cp2x);
	    var dy = Math.pow(1-t, 2)*(cp1y-sy) + 2*t*(1-t)*(cp2y-cp1y) + t * t * (ey - cp2y);
	    //return -Math.atan2(dx, dy) + 0.5*Math.PI;
	    return new Vertex(dx,dy);
	}
	return getBezierAngle(t,
			      this.startPoint.x, this.startPoint.y,
			      this.startControlPoint.x, this.startControlPoint.y,
			      this.endControlPoint.x, this.endControlPoint.y,
			      this.endPoint.x, this.endPoint.y );
	*/

	/*
	__normal2: function(t) {
	    var d = this.derivative(t);
	    var q = sqrt(d.x * d.x + d.y * d.y);
	    return { x: -d.y / q, y: d.x / q };
	},
	*/

	/*
	var dpoints = [ this.startPoint, this.startControlPoint, this.endControlPoint, this.endPoint ];
	//var p = dpoints;
	
	var mt = 1.0 - t,
            a,
            b,
            c = 0,
            p = dpoints; //this.startPoint; //this.dpoints[0];
	//if (this.order === 3) {
            a = mt * mt;
            b = mt * t * 2;
            c = t * t;
	//}
	var ret = {
            x: a * p[0].x + b * p[1].x + c * p[2].x,
            y: a * p[0].y + b * p[1].y + c * p[2].y
	};
	//if (this._3d) {
        //    ret.z = a * p[0].z + b * p[1].z + c * p[2].z;
	//}
	//return new Vertex(ret.x, ret.y); //ret;

	*/
	/*
	function __normal2(curve,t) {
	    var d = derivative(curve,t);
	    var q = Math.sqrt(d.x * d.x + d.y * d.y);
	    return { x: -d.y / q, y: d.x / q };
	}
	return __normal2(this,t);
	*/
    }

    /*
    function derivative(curve,t) {
	// !!!
	var dpoints = derive([ curve.startPoint, curve.startControlPoint, curve.endControlPoint, curve.endPoint ]);
	
      var mt = 1 - t,
        a,
        b,
        c = 0,
          p = [0];

        a = mt * mt;
        b = mt * t * 2;
        c = t * t;

      var ret = {
        x: a * p[0].x + b * p[1].x + c * p[2].x,
        y: a * p[0].y + b * p[1].y + c * p[2].y
      };
      return ret;
    }


    function derive(points) {
      var dpoints = [];
      for (var p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
        var list = [];
        for (var j = 0, dpt; j < c; j++) {
          dpt = {
            x: c * (p[j + 1].x - p[j].x),
            y: c * (p[j + 1].y - p[j].y)
          };
          //if (_3d) {
          //  dpt.z = c * (p[j + 1].z - p[j].z);
          //}
          list.push(dpt);
        }
        dpoints.push(list);
        p = list;
      }
      return dpoints;
    };
    */


    /**
     * Convert a relative curve position u to the absolute curve position t.
     *
     * @method convertU2t
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {number} 
     **/
    CubicBezierCurve.prototype.convertU2T = function( u ) { 
	return Math.max( 0.0, 
			 Math.min( 1.0, 
				   ( u / this.arcLength ) 
				 )
		       );
    }

    
    /**
     * Get the curve tangent vector at a given relative position u in [0,arcLength].<br>
     * <br>
     * Note that the returned tangent vector (end point) is not normalized.
     *
     * @method getTangent
     * @param {number} u - The position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    //CubicBezierCurve.prototype.getTangentAt = function( u ) {
    CubicBezierCurve.prototype.getTangent = function( u ) {
	// return this.getTangent( this.convertU2T(u) );
	return this.getTangentAt( this.convertU2T(u) );
    }
    

    /**
     * Get the curve perpendicular at a given relative position u in [0,arcLength] as a vector.<br>
     * <br>
     * Note that the returned vector (end point) is not normalized.
     *
     * @method getPerpendicular
     * @param {number} u - The relative position on the curve in [0,arcLength].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    //CubicBezierCurve.prototype.getPerpendicularAt = function( u ) {
    CubicBezierCurve.prototype.getPerpendicular = function( u ) {
	//return this.getPerpendicular( this.convertU2T(u) );
	return this.getPerpendicularAt( this.convertU2T(u) );
    }


    /**
     * Get the curve perpendicular at a given absolute position t in [0,1] as a vector.<br>
     * <br>
     * Note that the returned vector (end point) is not normalized.
     *
     * @method getPerpendicularAt
     * @param {number} u - The absolute position on the curve in [0,1].
     * @instance
     * @memberof CubicBezierCurve
     * @return {Vertex} 
     **/
    //CubicBezierCurve.prototype.getPerpendicular = function( t ) {
    CubicBezierCurve.prototype.getPerpendicularAt = function( t ) { 
	//var tangentVector = this.getTangent( t );
	var tangentVector = this.getTangentAt( t );
	return new Vertex( tangentVector.y, - tangentVector.x );
	//return new Vertex( - tangentVector.y, tangentVector.x );
	// return perpendicular;
    }




    /**
     * Clone this Bézier curve (deep clone).
     *
     * @method clone
     * @instance
     * @memberof CubicBezierCurve
     * @return {CubicBezierCurve} 
     **/
    CubicBezierCurve.prototype.clone = function() {
	var curve = new CubicBezierCurve( this.getStartPoint().clone(),
					  this.getEndPoint().clone(),
					  this.getStartControlPoint().clone(),
					  this.getEndControlPoint().clone()
					);
	return curve;
    }


    /**
     * Check if this and the specified curve are equal.<br>
     * <br>
     * All four points need to be equal for this, the Vertex.equals function is used.<br>
     * <br>
     * Please note that this function is not type safe (comparison with any object will fail).
     *
     * @method clone
     * @param {CubicBezierCurve} curve - The curve to compare with.
     * @instance
     * @memberof CubicBezierCurve
     * @return {boolean} 
     **/
    CubicBezierCurve.prototype.equals = function( curve ) {	
	if( !curve )
	    return false;	
	if( !curve.startPoint ||
	    !curve.endPoint ||
	    !curve.startControlPoint ||
	    !curve.endControlPoint )
	    return false;	
	return this.startPoint.equals(curve.startPoint) 
	    && this.endPoint.equals(curve.endPoint)
	    && this.startControlPoint.equals(curve.startControlPoint)
	    && this.endControlPoint.equals(curve.endControlPoint);
	
    }


  
    /**
     * Create an SVG path data representation of this bézier curve.
     *
     * Path data string format is:<br>
     *  <pre>'M x0 y1 C dx0 dy1 dx1 dy1 x1 x2'</pre><br>
     * or in other words<br>
     *   <pre>'M startoint.x startPoint.y C startControlPoint.x startControlPoint.y endControlPoint.x endControlPoint.y endPoint.x endPoint.y'</pre>
     *
     * @method toSVGPathData
     * @instance
     * @memberof CubicBezierCurve
     * @return {string}  The SVG path data string.
     **/
    CubicBezierCurve.prototype.toSVGPathData = function() {
	var buffer = [];
	buffer.push( 'M ' );
	buffer.push( this.startPoint.x );
	buffer.push( ' ' );
	buffer.push( this.startPoint.y );
	buffer.push( ' C ' );
	buffer.push( this.startControlPoint.x );
	buffer.push( ' ' );
	buffer.push( this.startControlPoint.y );
	buffer.push( ' ' );
	buffer.push( this.endControlPoint.x );
	buffer.push( ' ' );
	buffer.push( this.endControlPoint.y );
	buffer.push( ' ' );
	buffer.push( this.endPoint.x );
	buffer.push( ' ' );
	buffer.push( this.endPoint.y );
	return buffer.join('');
    }


    /**
     * Convert this curve to a JSON string.
     *
     * @method toJSON
     * @param {boolean=} [prettyFormat=false] - If set to true the function will add line breaks.
     * @instance
     * @memberof CubicBezierCurve
     * @return {string} The JSON data.
     **/
    CubicBezierCurve.prototype.toJSON = function( prettyFormat ) {
	var jsonString = "{ " + // begin object
            ( prettyFormat ? "\n\t" : "" ) +
	    "\"startPoint\" : [" + this.getStartPoint().x + "," + this.getStartPoint().y + "], " +
	    ( prettyFormat ? "\n\t" : "" ) +
	    "\"endPoint\" : [" + this.getEndPoint().x + "," + this.getEndPoint().y + "], " +
	    ( prettyFormat ? "\n\t" : "" ) +
	    "\"startControlPoint\": [" + this.getStartControlPoint().x + "," + this.getStartControlPoint().y + "], " +
	    ( prettyFormat ? "\n\t" : "" ) +
	    "\"endControlPoint\" : [" + this.getEndControlPoint().x + "," + this.getEndControlPoint().y + "]" +
	    ( prettyFormat ? "\n\t" : "" ) +
	    " }";  // end object
	return jsonString;
    }

    
    /**
     * Parse a Bézier curve from the given JSON string.
     *
     * @method fromJSON
     * @param {string} jsonString - The JSON data to parse.
     * @memberof CubicBezierCurve
     * @throws An exception if the JSON string is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromJSON = function( jsonString ) {
	var obj = JSON.parse( jsonString );
	return CubicBezierCurve.fromObject( obj );
    }


    /**
     * Try to convert the passed object to a CubicBezierCurve.
     *
     * @method fromObject
     * @param {object} obj - The object to convert.
     * @memberof CubicBezierCurve
     * @throws An exception if the passed object is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromObject = function( obj ) {
	
	if( typeof obj !== "object" ) 
	    throw "[IKRS.CubicBezierCurve.fromObject] Can only build from object.";


	if( !obj.startPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"startPoint\" missing.";
	if( !obj.endPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"endPoint\" missing.";
	if( !obj.startControlPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"startControlPoint\" missing.";
	if( !obj.endControlPoint )
	    throw "[IKRS.CubicBezierCurve.fromObject] Object member \"endControlPoint\" missing.";
	
	return new CubicBezierCurve( new Vertex(obj.startPoint[0],        obj.startPoint[1]),
				     new Vertex(obj.endPoint[0],          obj.endPoint[1]),
				     new Vertex(obj.startControlPoint[0], obj.startControlPoint[1]),
				     new Vertex(obj.endControlPoint[0],   obj.endControlPoint[1])
				   );
    };


    
    /**
     * Convert a 4-element array of vertices to a cubic bézier curve.
     *
     * @method fromArray
     * @param {Vertex[]} arr -  [ startVertex, endVertex, startControlVertex, endControlVertex ]
     * @memberof CubicBezierCurve
     * @throws An exception if the passed array is malformed.
     * @return {CubicBezierCurve}
     **/
    CubicBezierCurve.fromArray = function( arr ) {	
	if( !Array.isArray(arr) ) 
	    throw "[IKRS.CubicBezierCurve.fromArray] Can only build from object.";
	if( arr.length != 4 )
	    throw "[IKRS.CubicBezierCurve.fromArray] Can only build from array with four elements.";
	return new CubicBezierCurve( arr[0],
				     arr[1],
				     arr[2],
				     arr[3]
				   );
    };

    _context.CubicBezierCurve = CubicBezierCurve;
    
})(window); // END closure
