/**
 * Moved some draw functions to this wrapper.
 *
 * @require Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-04-22
 * @modified 2018-08-16 Added the curve() function to draw cubic bézier curves.
 * @modified 2018-10-23 Recognizing the offset param in the circle() function.
 * @version  1.0.2
 **/

(function(_context) {
    "use strict";

    // +---------------------------------------------------------------------------------
    // | The constructor.
    // |
    // | @param context:Context2D The canvas context to draw on.
    // | @param fillShapes:boolean Indicates if shapes should be filled or not.
    // +-------------------------------
    _context.drawutils = function( context, fillShapes ) {
	this.ctx = context;
	this.offset = new Vertex( 0, 0 );
	this.scale = new Vertex( 1, 1 );
	this.fillShapes = fillShapes;
    };

    // +---------------------------------------------------------------------------------
    // | Draw the given line (between the two points) with the specified (CSS-) color.
    // +-------------------------------
    // CURRENTLY NOT IN USE
    _context.drawutils.prototype.line = function( zA, zB, color ) {
	    this.ctx.beginPath();
	    this.ctx.moveTo( this.offset.x+zA.x*this.scale.x, this.offset.y+zA.y*this.scale.y );
	    this.ctx.lineTo( this.offset.x+zB.x*this.scale.x, this.offset.y+zB.y*this.scale.y );
	    this.ctx.strokeStyle = color;
	    this.ctx.lineWidth = 1;
	    this.ctx.stroke();
    };


    _context.drawutils.prototype._fillOrDraw = function( color ) {
	if( this.fillShapes ) {
	    this.ctx.fillStyle = color;
	    this.ctx.fill();
	} else {
	    this.ctx.strokeStyle = color;
	    this.ctx.stroke();
	}
    };
    

    
    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezierCurve = function( curve, color ) {
	if( typeof CubicBezierCurve == 'undefined' || !(curve instanceof CubicBezierCurve) )
	    throw "The passed curve is not an instance of CubicBezierCurve and thus cannot be plotted with this function.";
	// Draw curve
	this.cubicBezier( curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint, color );
    };
    


    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezier = function( startPoint, endPoint, startControlPoint, endControlPoint, color ) {
	// Draw curve
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+startPoint.x*this.scale.x, this.offset.y+startPoint.y*this.scale.y );
	this.ctx.bezierCurveTo( this.offset.x+startControlPoint.x*this.scale.x, this.offset.y+startControlPoint.y*this.scale.y,
				this.offset.x+endControlPoint.x*this.scale.x, this.offset.y+endControlPoint.y*this.scale.y,
				this.offset.x+endPoint.x*this.scale.x, this.offset.y+endPoint.y*this.scale.y );
	this.ctx.lineWidth = 2;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezierCurveHandles = function( curve ) {
	// Draw handles
	this.cubicBezierHandles( curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint );
    };


    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezierHandles = function( startPoint, endPoint, startControlPoint, endControlPoint ) {
	// Draw handles
	this.ctx.save();
	this.ctx.lineWidth = 1;
	this.point( startPoint, 'rgb(0,32,192)' );
	this.point( endPoint, 'rgb(0,32,192)' );
	this.square( startControlPoint, 5, 'rgba(0,128,192,0.5)' );
	this.square( endControlPoint, 5, 'rgba(0,128,192,0.5)' );
	this.ctx.restore();
    };


    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezierCurveHandleLines = function( curve ) {
	// Draw handle lines
	//this.line( curve.startPoint, curve.startControlPoint, 'lightgrey' );
	//this.line( curve.endPoint, curve.endControlPoint, 'lightgrey' );
	this.cubicBezierHandleLines( curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint );
    };

    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezierHandleLines = function( startPoint, endPoint, startControlPoint, endControlPoint ) {
	// Draw handle lines
	this.line( startPoint, startControlPoint, 'lightgrey' );
	this.line( endPoint, endControlPoint, 'lightgrey' );
	
    };



    
    // +---------------------------------------------------------------------------------
    // | Fill the given point with the specified (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.point = function( p, color ) {
	var radius = 3;
	this.ctx.beginPath();
	this.ctx.arc( this.offset.x+p.x*this.scale.x, this.offset.y+p.y*this.scale.y, radius, 0, 2 * Math.PI, false );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    // +---------------------------------------------------------------------------------
    // | Draw a circle with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.circle = function( center, radius, color ) {
	this.ctx.beginPath();
	this.ctx.arc( this.offset.x + center.x*this.scale.x, this.offset.y + center.y*this.scale.y, radius, 0, Math.PI*2 );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };

    // +---------------------------------------------------------------------------------
    // | Fill the given point with the specified (CSS-) color.
    // |
    // | This version uses four bezier curves to draw it so scaling is possible.
    // +-------------------------------
    /*
    _context.drawutils.prototype.bezierCircle = function( center, radius, color ) {
	// The ratio of the bezier handles is
	//    (4/3)*tan(pi/8) = 4*(sqrt(2)-1)/3 = 0.552284749831
	// See
	//    https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
	var ratio = 0.552284749831;
	this.ctx.beginPath();
	this.cubicBezier( { x : 0, y : center.y-radius },
			  { x : center.x+radius, y : 0 },
			  { x : center.x+radius*ratio, y : center.y-radius },
			  { x : center.x+radius, y : center.y-radius*ratio },
			  color );
	this.cubicBezier( { x : center.x+radius, y : 0 },
			  { x : 0, y : center.y+radius },
			  { x : center.x+radius, y : center.y+radius*ratio },
			  { x : center.x+radius*ratio, y : center.y+radius },
			  color );
	this.cubicBezier( { x : 0, y : center.y+radius },
			  { x : center.x-radius, y : 0 },
			  { x : center.x-radius*ratio, y : center.y+radius },
			  { x : center.x-radius, y : center.y+radius*ratio },
			  color );
	this.cubicBezier( { x : center.x-radius, y : 0 },
			  { x : 0, y : center.y-radius },
			  { x : center.x-radius, y : center.y-radius*ratio },
			  { x : center.x-radius*ratio, y : center.y-radius },
			  color );
	this._fillOrDraw( color );
    };
    */
    

    
    // +---------------------------------------------------------------------------------
    // | Fill a square with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.square = function( center, size, color ) {
	this.ctx.beginPath();
	this.ctx.rect( this.offset.x+(center.x-size/2.0)*this.scale.x, this.offset.y+(center.y-size/2.0)*this.scale.y, size*this.scale.x, size*this.scale.y );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    // +---------------------------------------------------------------------------------
    // | Draw a crosshair with given radius and color at the given position.
    // +-------------------------------
    _context.drawutils.prototype.crosshair = function( center, radius, color ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+center.x*this.scale.x-radius, this.offset.y+center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x+center.x*this.scale.x+radius, this.offset.y+center.y*this.scale.y );
	this.ctx.moveTo( this.offset.x+center.x*this.scale.x, this.offset.y+center.y*this.scale.y-radius );
	this.ctx.lineTo( this.offset.x+center.x*this.scale.x, this.offset.y+center.y*this.scale.y+radius );
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = 0.5;
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
    };

    // +---------------------------------------------------------------------------------
    // | Draw a text at the given position.
    // +-------------------------------
    _context.drawutils.prototype.polygon = function( polygon, color ) {
	if( polygon.vertices.length <= 1 )
	    return;
	// options = options || {};
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.setLineDash([3, 5]);
	this.ctx.moveTo( this.offset.x + polygon.vertices[0].x*this.scale.x, this.offset.y + polygon.vertices[0].y*this.scale.y );
	for( var i = 0; i < polygon.vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x + polygon.vertices[i].x*this.scale.x, this.offset.y + polygon.vertices[i].y*this.scale.y );
	}
	if( !polygon.isOpen )
	    this.ctx.closePath();
	// this.strokeStyle = color;
	// this.ctx.stroke();
	this._fillOrDraw( color );
	//this.ctx.setLineDash([]);
	this.ctx.restore();
    };
    
    // +---------------------------------------------------------------------------------
    // | Draw a text at the given position.
    // +-------------------------------
    _context.drawutils.prototype.string = function( text, x, y ) {
	if( this.fillShapes ) {
	    this.ctx.fillStyle = 'black';
	    this.ctx.fillText( text, x, y );
	} else {
	    this.ctx.strokeStyle = 'black';
	    this.ctx.strokeText( text, x, y, );
	}
    };
    
    
})(window ? window : module.export );
