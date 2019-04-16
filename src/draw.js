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
 * @modified 2018-12-09 Added the dot(Vertex,color) function (copied from Feigenbaum-plot-script).
 * @modified 2019-01-30 Added the arrow(Vertex,Vertex,color) function for drawing arrow heads.
 * @modified 2019-01-30 Added the image(Image,Vertex,Vertex) function for drawing images.
 * @version  1.2.0
 **/

(function(_context) {
    "use strict";

    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {Context2D} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
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
    // | Draw an arrow at the end (zB) of the given line with the specified (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.arrow = function( zA, zB, color ) {
	var headlen = 8;   // length of head in pixels
	var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
	this.line( zA, vertices[0], color );
	
	this.ctx.save();
	this.ctx.beginPath();
	var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
	
	this.ctx.moveTo( this.offset.x+vertices[0].x, this.offset.y+vertices[0].y );
	for( var i = 1; i < vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x+vertices[i].x, this.offset.y+vertices[i].y );
	}
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    // +---------------------------------------------------------------------------------
    // | Draw an image at the given position with the given size.
    // |
    // | Note: SVG images may have resizing issues at the moment.
    // +-------------------------------
    _context.drawutils.prototype.image = function( image, position, size ) {
	this.ctx.save();
	console.log( image.width, image.height );
	// Note that there is a Safari bug with the 3 or 5 params variant.
	// Only the 9-param varaint works.
	this.ctx.drawImage( image,
			    0, 0,
			    image.naturalWidth, image.naturalHeight,
			    this.offset.x+position.x*this.scale.x, this.offset.y+position.y*this.scale.y,
			    size.x*this.scale.x, size.y*this.scale.y );
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
	this.ctx.closePath();
	this.ctx.lineWidth = 2;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    // +---------------------------------------------------------------------------------
    // | Draw the given (cubic) bézier path.
    // +-------------------------------
    _context.drawutils.prototype.cubicBezierPath = function( path, color ) {
	if( !path || path.length == 0 )
	    return;
	// Draw curve
	this.ctx.save();
	this.ctx.beginPath();
	var curve, startPoint, endPoint, startControlPoint, endControlPoint;
	this.ctx.moveTo( this.offset.x+path[0].x*this.scale.x, this.offset.y+path[0].y*this.scale.y );
	for( var i = 1; i < path.length; i+=3 ) {
	    //startPoint = curve[0];
	    startControlPoint = path[i];
	    endControlPoint = path[i+1];
	    endPoint = path[i+2];
	    this.ctx.bezierCurveTo( this.offset.x+startControlPoint.x*this.scale.x, this.offset.y+startControlPoint.y*this.scale.y,
				    this.offset.x+endControlPoint.x*this.scale.x, this.offset.y+endControlPoint.y*this.scale.y,
				    this.offset.x+endPoint.x*this.scale.x, this.offset.y+endPoint.y*this.scale.y );
	}
	this.ctx.closePath();
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
    // | Draw a 1x1 dot with the specified (CSS-) color.
    // +-------------------------------
    _context.drawutils.prototype.dot = function( p, color ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x + this.scale.x*p.x, this.offset.y + this.scale.y*p.y );
	this.ctx.lineTo( this.offset.x + this.scale.x*p.x+1, this.offset.y + this.scale.y*p.y+1 );
	this.ctx.closePath();
	this._fillOrDraw( color );
	this.ctx.restore();
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
    _context.drawutils.prototype.label = function( text, x, y, rotation ) {
	this.ctx.save();
	this.ctx.translate(x, y);
	if( typeof rotation != 'undefined' )
	    this.ctx.rotate(rotation);
	this.ctx.fillStyle = 'black';
	if( this.fillShapes ) {
	    this.ctx.fillText( text, 0,0); 
	} else {
	    this.ctx.strokeText( text, 0,0);
	}
	this.ctx.restore();
    };
    
    
})(window ? window : module.export );
