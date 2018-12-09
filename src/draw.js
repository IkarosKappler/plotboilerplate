/**
 * Moved some draw functions to this wrapper.
 *
 * @require Vertex
 *
 * @author   Ikaros Kappler
 * @date     2018-04-22
 * @modified 2018-08-16 Added the curve() function to draw cubic bézier curves.
 * @modified 2018-10-23 Recognizing the offset param in the circle() function.
 * @modified 2018-11-27 Added the diamondHandle() function.
 * @modified 2018-11-28 Added the grid() function and the ellipse() function.
 * @modified 2018-11-30 Renamed the text() function to label() as it is not scaling.
 * @modified 2018-12-06 Added a test function for drawing arc in SVG style.
 * @version  1.0.6
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
    _context.drawutils.prototype.line = function( zA, zB, color ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+zA.x*this.scale.x, this.offset.y+zA.y*this.scale.y );
	this.ctx.lineTo( this.offset.x+zB.x*this.scale.x, this.offset.y+zB.y*this.scale.y );
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = 1;
	this.ctx.stroke();
	this.ctx.restore();
    };


    // +---------------------------------------------------------------------------------
    // | This is the final helper function for drawing and filling stuff.
    // |
    // | When in draw mode it draws the current shape.
    // | When in fill mode it fills the current shape.
    // |
    // | This function is usually only called internally.
    // |
    // | @param color A stroke/fill color to use.
    // +-------------------------------
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
    _context.drawutils.prototype.cubicBezier = function( startPoint, endPoint, startControlPoint, endControlPoint, color ) {
	if( startPoint instanceof CubicBezierCurve ) {
	    this.cubicBezier( startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, endPoint );
	    return;
	}
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
    _context.drawutils.prototype.handle = function( startPoint, endPoint ) { 
	// Draw handles
	// (No need to save and restore here)
	this.point( startPoint, 'rgb(0,32,192)' );
	this.square( endPoint, 5, 'rgba(0,128,192,0.5)' );
    };


    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezierCurveHandleLines = function( curve ) {
	// Draw handle lines
	this.cubicBezierHandleLines( curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint );
    };

    
    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier curve.
    // +-------------------------------
    
    _context.drawutils.prototype.handleLine = function( startPoint, endPoint ) {
	// Draw handle lines
	this.line( startPoint, endPoint, 'rgb(192,192,192)' );	
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
	this.ctx.ellipse( this.offset.x + center.x*this.scale.x, this.offset.y + center.y*this.scale.y, radius*this.scale.x, radius*this.scale.y, 0.0, 0.0, Math.PI*2 );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };

    
    // +---------------------------------------------------------------------------------
    // | Draw an ellipse with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.ellipse = function( center, radiusX, radiusY, color ) {
	this.ctx.beginPath();
	this.ctx.ellipse( this.offset.x + center.x*this.scale.x, this.offset.y + center.y*this.scale.y, radiusX*this.scale.x, radiusY*this.scale.y, 0.0, 0.0, Math.PI*2 );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };   

    
    // +---------------------------------------------------------------------------------
    // | Draw a square with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.square = function( center, size, color ) {
	this.ctx.beginPath();
	this.ctx.rect( this.offset.x+(center.x-size/2.0)*this.scale.x, this.offset.y+(center.y-size/2.0)*this.scale.y, size*this.scale.x, size*this.scale.y );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    // +---------------------------------------------------------------------------------
    // | Draw grid of horizontal and vertical lines with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.grid = function( center, width, height, sizeX, sizeY, color ) {
	console.log( 'draw grid' );
	this.ctx.beginPath();
	// center to right
	var x = 0;
	while( x < width/2 ) {
	    this.ctx.moveTo( this.offset.x + (center.x+x)*this.scale.x, this.offset.y - (center.y - height*0.5)*this.scale.y  );
	    this.ctx.lineTo( this.offset.x + (center.x+x)*this.scale.x, this.offset.y - (center.y + height*0.5)*this.scale.y  );
	    x+=sizeX;
	}
	x = sizeX;
	while( x < width/2 ) {
	    this.ctx.moveTo( this.offset.x + (center.x-x)*this.scale.x, this.offset.y - (center.y - height*0.5)*this.scale.y  );
	    this.ctx.lineTo( this.offset.x + (center.x-x)*this.scale.x, this.offset.y - (center.y + height*0.5)*this.scale.y  );
	    x+=sizeX;
	}
	var y = 0;
	while( y < height/2 ) {
	    this.ctx.moveTo( this.offset.x - (center.x - width*0.5)*this.scale.x, this.offset.y + (center.y+y)*this.scale.y );
	    this.ctx.lineTo( this.offset.x - (center.x + width*0.5)*this.scale.x, this.offset.y + (center.y+y)*this.scale.y );
	    y+=sizeY;
	}
	var y = sizeY;
	while( y < height/2 ) {
	    this.ctx.moveTo( this.offset.x - (center.x - width*0.5)*this.scale.x, this.offset.y + (center.y-y)*this.scale.y );
	    this.ctx.lineTo( this.offset.x - (center.x + width*0.5)*this.scale.x, this.offset.y + (center.y-y)*this.scale.y );
	    y+=sizeY;
	}
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    // +---------------------------------------------------------------------------------
    // | Draw a raster of crosshairs in the given grid.
    // |
    // | This works analogue to the grid() function.
    // +-------------------------------
    _context.drawutils.prototype.raster = function( center, width, height, sizeX, sizeY, color ) {
	this.ctx.save();
	this.ctx.beginPath();
	var cx = 0, cy = 0;
	for( var x = -Math.ceil((width*0.5)/sizeX)*sizeX; x < width/2; x+=sizeX ) {
	    cx++;
	    for( var y = -Math.ceil((height*0.5)/sizeY)*sizeY; y < height/2; y+=sizeY ) {
		if( cx == 1 ) cy++;
		// Draw a crosshair
		this.ctx.moveTo( this.offset.x+(center.x+x)*this.scale.x-4, this.offset.y+(center.y+y)*this.scale.y );
		this.ctx.lineTo( this.offset.x+(center.x+x)*this.scale.x+4, this.offset.y+(center.y+y)*this.scale.y );
		this.ctx.moveTo( this.offset.x+(center.x+x)*this.scale.x, this.offset.y+(center.y+y)*this.scale.y-4 );
		this.ctx.lineTo( this.offset.x+(center.x+x)*this.scale.x, this.offset.y+(center.y+y)*this.scale.y+4 );	
	    }
	}
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = 1.0; 
	this.ctx.stroke();
	this.ctx.closePath();
	this.ctx.restore();
    };
    

    // +---------------------------------------------------------------------------------
    // | Draw adiamond handle with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.diamondHandle = function( center, size, color ) {
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x + center.x*this.scale.x - size/2.0, this.offset.y + center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x,            this.offset.y + center.y*this.scale.y - size/2.0 );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x + size/2.0, this.offset.y + center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x,            this.offset.y + center.y*this.scale.y + size/2.0 );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };

    
    // +---------------------------------------------------------------------------------
    // | Draw a square handle with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.squareHandle = function( center, size, color ) {
	this.ctx.beginPath();
	this.ctx.rect( this.offset.x+center.x*this.scale.x-size/2.0, this.offset.y+center.y*this.scale.y-size/2.0, size, size );
	this.ctx.closePath();
	this._fillOrDraw( color );
    };


    // +---------------------------------------------------------------------------------
    // | Draw a circle handle with the given (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.circleHandle = function( center, size, color ) {
	var radius = 3;
	this.ctx.beginPath();
	this.ctx.arc( this.offset.x+center.x*this.scale.x, this.offset.y+center.y*this.scale.y, radius, 0, 2 * Math.PI, false );
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
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.setLineDash([3, 5]);
	this.ctx.lineWidth = 1.0;
	this.ctx.moveTo( this.offset.x + polygon.vertices[0].x*this.scale.x, this.offset.y + polygon.vertices[0].y*this.scale.y );
	for( var i = 0; i < polygon.vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x + polygon.vertices[i].x*this.scale.x, this.offset.y + polygon.vertices[i].y*this.scale.y );
	}
	if( !polygon.isOpen && polygon.vertices.length > 2 )
	    this.ctx.closePath();
	this._fillOrDraw( color );
	this.ctx.setLineDash([]);
	this.ctx.restore();
    };

    // Found in an old version of
    //    https://github.com/canvg/canvg
    _context.drawutils.prototype.arcto = function(lastX,lastY,rx,ry,xAxisRotation,largeArcFlag,sweepFlag,x,y, color)
    {
	lastX = this.offset.x + this.scale.x*lastX;
	lastY = this.offset.y + this.scale.y*lastY;
	x = this.offset.x + this.scale.x*x;
	y = this.offset.y + this.scale.y*y;
	rx *= this.scale.x;
	ry *= this.scale.y;
	//--------------------
	// rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y
	// are the 6 data items in the SVG path declaration following the A
	//
	// lastX and lastY are the previous point on the path before the arc
	//--------------------
	// useful functions
	var m   = function (   v) {return Math.sqrt (Math.pow (v[0],2) + Math.pow (v[1],2))};
	var r   = function (u, v) {return ( u[0]*v[0] + u[1]*v[1]) / (m(u) * m(v))};
	var ang = function (u, v) {return ((u[0]*v[1] < u[1]*v[0])? -1 : 1) * Math.acos (r (u,v))};
	//--------------------

	var currpX =  Math.cos (xAxisRotation) * (lastX - x) / 2.0 + Math.sin (xAxisRotation) * (lastY - y) / 2.0 ;
	var currpY = -Math.sin (xAxisRotation) * (lastX - x) / 2.0 + Math.cos (xAxisRotation) * (lastY - y) / 2.0 ;

	var l = Math.pow (currpX,2) / Math.pow (rx,2) + Math.pow (currpY,2) / Math.pow (ry,2);
	if (l > 1) {rx *= Math.sqrt (l); ry *= Math.sqrt (l)};
	var s = ((largeArcFlag == sweepFlag)? -1 : 1) * Math.sqrt 
	(( (Math.pow (rx,2) * Math.pow (ry    ,2)) - (Math.pow (rx,2) * Math.pow (currpY,2)) - (Math.pow (ry,2) * Math.pow (currpX,2))) 
	 / (Math.pow (rx,2) * Math.pow (currpY,2) +   Math.pow (ry,2) * Math.pow (currpX,2)));
	if (isNaN (s)) s = 0 ;

	var cppX = s *  rx * currpY / ry ;
	var cppY = s * -ry * currpX / rx ;
	var centpX = (lastX + x) / 2.0 + Math.cos (xAxisRotation) * cppX - Math.sin (xAxisRotation) * cppY ;
	var centpY = (lastY + y) / 2.0 + Math.sin (xAxisRotation) * cppX + Math.cos (xAxisRotation) * cppY ;

	var ang1 = ang ([1,0], [(currpX-cppX)/rx,(currpY-cppY)/ry]);
	var a = [(  currpX-cppX)/rx,(currpY-cppY)/ry];
	var b = [(-currpX-cppX)/rx,(-currpY-cppY)/ry];
	var angd = ang (a,b);
	if (r (a,b) <= -1) angd = Math.PI;
	if (r (a,b) >=  1) angd = 0;

	var rad = (rx > ry)? rx : ry;
	var sx  = (rx > ry)? 1 : rx / ry;
	var sy  = (rx > ry)? ry / rx : 1;

	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( lastX, lastY );
	this.ctx.translate (centpX,centpY);
	this.ctx.rotate (xAxisRotation);
	this.ctx.scale (sx, sy);
	this.ctx.arc (0, 0, rad, ang1, ang1 + angd, 1 - sweepFlag);
	this.ctx.scale (1/sx, 1/sy);
	this.ctx.rotate (-xAxisRotation);
	this.ctx.translate (-centpX, -centpY);
	this._fillOrDraw( color );
	this.ctx.restore();
    }; 
    
    // +---------------------------------------------------------------------------------
    // | Draw a text at the given position.
    // +-------------------------------
    // THIS FUNCTION IS CURRENTLY NOT IN USE
    // TODO: make text scaling with zoom?
    _context.drawutils.prototype.text = function( text, x, y, options ) {
	options = options || {};
	if( this.fillShapes ) {
	    this.ctx.fillStyle = 'black';
	    this.ctx.fillText( text, x, y );
	} else {
	    this.ctx.strokeStyle = 'black';
	    this.ctx.strokeText( text, x, y, );
	}
    };

    
    // +---------------------------------------------------------------------------------
    // | Draw a non-scaling text label at the given position.
    // +-------------------------------
    _context.drawutils.prototype.label = function( text, x, y ) {
	if( this.fillShapes ) {
	    this.ctx.fillStyle = 'black';
	    this.ctx.fillText( text, x, y );
	} else {
	    this.ctx.strokeStyle = 'black';
	    this.ctx.strokeText( text, x, y, );
	}
    };
    
    
})(window ? window : module.export );
