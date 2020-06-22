/**
 * A wrapper class for basic drawing operations.
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
 * @modified 2019-04-27 Fixed a severe drawing bug in the arrow(...) function. Scaling arrows did not work properly.
 * @modified 2019-04-28 Added Math.round to the dot() drawing parameters to really draw a singlt dot.
 * @modified 2019-06-07 Fixed an issue in the cubicBezier() function. Paths were always closed.
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2019-10-25 Polygons are no longer drawn with dashed lines (solid lines instead).
 * @modified 2019-11-18 Added the polyline function.
 * @modified 2019-11-22 Added a second workaround for th drawImage bug in Safari.
 * @modified 2019-12-07 Added the 'lineWidth' param to the line(...) function.
 * @modified 2019-12-07 Added the 'lineWidth' param to the cubicBezier(...) function.
 * @modified 2019-12-11 Added the 'color' param to the label(...) function.
 * @modified 2019-12-18 Added the quadraticBezier(...) function (for the sake of approximating Lissajous curves).
 * @modified 2019-12-20 Added the 'lineWidth' param to the polyline(...) function.
 * @modified 2020-01-09 Added the 'lineWidth' param to the ellipse(...) function.
 * @modified 2020-03-25 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-05-05 Added the 'lineWidth' param to the circle(...) function.
 * @modified 2020-05-12 Drawing any handles (square, circle, diamond) with lineWidth 1 now; this was not reset before.
 * @modified 2020-06-22 Added a context.clearRect() call to the clear() function; clearing with alpha channel did not work as expected.
 * @version  1.5.6
 **/

import { CubicBezierCurve } from "./CubicBezierCurve";
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable} from "./interfaces";


// Todo: rename this class to Drawutils
export class drawutils {

    /** 
     * @member {CanvasRenderingContext2D} 
     * @memberof drawutils
     * @type {CanvasRenderingContext2D}
     * @instance
     */
    ctx:CanvasRenderingContext2D;

    /** 
     * @member {Vertex} 
     * @memberof drawutils
     * @type {Vertex}
     * @instance
     */
    readonly offset:Vertex;

    /** 
     * @member {Vertex} 
     * @memberof drawutils
     * @type {Vertex}
     * @instance
     */
    readonly scale:Vertex;

    /** 
     * @member {boolean} 
     * @memberof drawutils
     * @type {boolean}
     * @instance
     */
    fillShapes:boolean;
    
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {anvasRenderingContext2D} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    constructor( context:CanvasRenderingContext2D, fillShapes:boolean ) {
	this.ctx = context;
	this.offset = new Vertex( 0, 0 );
	this.scale = new Vertex( 1, 1 );
	this.fillShapes = fillShapes;
    };

    /**
     * Called before each draw cycle.
     **/
    beginDrawCycle() {
	// NOOP
    };

    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number|string} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line( zA:Vertex, zB:Vertex, color:string, lineWidth?:number ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+zA.x*this.scale.x, this.offset.y+zA.y*this.scale.y );
	this.ctx.lineTo( this.offset.x+zB.x*this.scale.x, this.offset.y+zB.y*this.scale.y );
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = lineWidth || 1;
	this.ctx.stroke();
	this.ctx.restore();
    };

    

    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {Vertex} zA - The start point of the arrow-line.
     * @param {Vertex} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    arrow( zA:Vertex, zB:Vertex, color:string ) {
	var headlen:number = 8;   // length of head in pixels
	// var vertices = PlotBoilerplate.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
	// var vertices : Array<Vertex> = Vertex.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
	
	this.ctx.save();
	this.ctx.beginPath();
	var vertices : Array<Vertex> = Vertex.utils.buildArrowHead( zA, zB, headlen, this.scale.x, this.scale.y );
	
	this.ctx.moveTo( this.offset.x+zA.x*this.scale.x, this.offset.y+zA.y*this.scale.y );
	for( var i = 0; i < vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x+vertices[i].x, this.offset.y+vertices[i].y );
	}
	this.ctx.lineTo( this.offset.x+vertices[0].x, this.offset.y+vertices[0].y );
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {Vertex} position - The position to draw the the upper left corner at.
     * @param {Vertex} size - The x/y-size to draw the image with.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    image( image:HTMLImageElement, position:Vertex, size:Vertex ) {
	this.ctx.save();
	// Note that there is a Safari bug with the 3 or 5 params variant.
	// Only the 9-param varaint works.
	this.ctx.drawImage( image,
			    0, 0,
			    image.naturalWidth-1,  // There is this horrible Safari bug (fixed in newer versions)
			    image.naturalHeight-1, // To avoid errors substract 1 here.
			    this.offset.x+position.x*this.scale.x,
			    this.offset.y+position.y*this.scale.y,
			    size.x*this.scale.x,
			    size.y*this.scale.y );
	this.ctx.restore();	
    };

    
    // +---------------------------------------------------------------------------------
    // | This is the final helper function for drawing and filling stuff. It is not
    // | intended to be used from the outside.
    // |
    // | When in draw mode it draws the current shape.
    // | When in fill mode it fills the current shape.
    // |
    // | This function is usually only called internally.
    // |
    // | @param color A stroke/fill color to use.
    // +-------------------------------
    // TODO: convert this to a STATIC function.
    _fillOrDraw( color:string ) {
	if( this.fillShapes ) {
	    this.ctx.fillStyle = color;
	    this.ctx.fill();
	} else {
	    this.ctx.strokeStyle = color;
	    this.ctx.stroke();
	}
    };


    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number|string} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezier( startPoint:Vertex, endPoint:Vertex, startControlPoint:Vertex, endControlPoint:Vertex, color:string, lineWidth?:number ) {
	if( startPoint instanceof CubicBezierCurve ) {
	    this.cubicBezier( startPoint.startPoint, startPoint.endPoint, startPoint.startControlPoint, startPoint.endControlPoint, color, lineWidth );
	    return;
	}
	// Draw curve
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+startPoint.x*this.scale.x, this.offset.y+startPoint.y*this.scale.y );
	this.ctx.bezierCurveTo( this.offset.x+startControlPoint.x*this.scale.x, this.offset.y+startControlPoint.y*this.scale.y,
				this.offset.x+endControlPoint.x*this.scale.x, this.offset.y+endControlPoint.y*this.scale.y,
				this.offset.x+endPoint.x*this.scale.x, this.offset.y+endPoint.y*this.scale.y );
	//this.ctx.closePath();
	this.ctx.lineWidth = lineWidth || 2;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    
    /**
     * Draw the given (quadratic) bézier curve.
     *
     * @method quadraticBezier
     * @param {Vertex} startPoint   - The start point of the cubic Bézier curve
     * @param {Vertex} controlPoint - The control point the cubic Bézier curve.
     * @param {Vertex} endPoint     - The end control point the cubic Bézier curve.
     * @param {string} color        - The CSS color to draw the curve with.
     * @param {number|string} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    quadraticBezier( startPoint:Vertex, controlPoint:Vertex, endPoint:Vertex, color:string, lineWidth?:number ) {
	// Draw curve
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x+startPoint.x*this.scale.x, this.offset.y+startPoint.y*this.scale.y );
	this.ctx.quadraticCurveTo( this.offset.x+controlPoint.x*this.scale.x, this.offset.y+controlPoint.y*this.scale.y,
				   this.offset.x+endPoint.x*this.scale.x, this.offset.y+endPoint.y*this.scale.y );
	this.ctx.lineWidth = lineWidth || 2;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    /**
     * Draw the given (cubic) Bézier path.
     *
     * The given path must be an array with n*3+1 vertices, where n is the number of
     * curves in the path:
     * <pre> [ point1, point1_startControl, point2_endControl, point2, point2_startControl, point3_endControl, point3, ... pointN_endControl, pointN ]</pre> 
     *
     * @method cubicBezierPath
     * @param {Vertex[]} path - The cubic bezier path as described above.
     * @param {string} color - The CSS colot to draw the path with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezierPath( path:Array<Vertex>, color:string ) {
	if( !path || path.length == 0 )
	    return;
	// Draw curve
	this.ctx.save();
	this.ctx.beginPath();
	var curve:any, startPoint:Vertex, endPoint:Vertex, startControlPoint:Vertex, endControlPoint:Vertex;
	this.ctx.moveTo( this.offset.x+path[0].x*this.scale.x, this.offset.y+path[0].y*this.scale.y );
	for( var i = 1; i < path.length; i+=3 ) {
	    startControlPoint = path[i];
	    endControlPoint = path[i+1];
	    endPoint = path[i+2];
	    this.ctx.bezierCurveTo( this.offset.x+startControlPoint.x*this.scale.x, this.offset.y+startControlPoint.y*this.scale.y,
				    this.offset.x+endControlPoint.x*this.scale.x, this.offset.y+endControlPoint.y*this.scale.y,
				    this.offset.x+endPoint.x*this.scale.x, this.offset.y+endPoint.y*this.scale.y );
	}
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
	this.ctx.restore();
    };


    /**
     * Draw the given handle and handle point (used to draw interactive Bézier curves).
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method handle
     * @param {Vertex} startPoint - The start of the handle.
     * @param {Vertex} endPoint - The end point of the handle.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    handle( startPoint:Vertex, endPoint:Vertex ) { 
	// Draw handles
	// (No need to save and restore here)
	this.point( startPoint, 'rgb(0,32,192)' );
	this.square( endPoint, 5, 'rgba(0,128,192,0.5)' );
    };


    /**
     * Draw the given handle cubic Bézier curve handle lines.
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method cubicBezierCurveHandleLines
     * @param {CubicBezierCurve} curve - The curve.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    /* cubicBezierCurveHandleLines( curve:CubicBezierCurve ) {
	// Draw handle lines
	this.cubicBezierHandleLines( curve.startPoint, curve.endPoint, curve.startControlPoint, curve.endControlPoint );
	// this.draw.line( d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
	// this.draw.line( d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
    }; */

    
    /**
     * Draw a handle line (with a light grey).
     *
     * @method handleLine
     * @param {Vertex} startPoint - The start point to draw the handle at.
     * @param {Vertex} endPoint - The end point to draw the handle at.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    handleLine( startPoint:Vertex, endPoint:Vertex ) {
	// Draw handle lines
	this.line( startPoint, endPoint, 'rgb(192,192,192)' );	
    };


    
    /**
     * Draw a 1x1 dot with the specified (CSS-) color.
     *
     * @method dot
     * @param {Vertex} p - The position to draw the dot at.
     * @param {string} color - The CSS color to draw the dot with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    dot( p:Vertex, color:string ) {
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.moveTo( Math.round(this.offset.x + this.scale.x*p.x), Math.round(this.offset.y + this.scale.y*p.y) );
	this.ctx.lineTo( Math.round(this.offset.x + this.scale.x*p.x+1), Math.round(this.offset.y + this.scale.y*p.y+1) );
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
	this.ctx.restore();
    };

    
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {Vertex} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    point( p:Vertex, color:string ) {
	var radius:number = 3;
	this.ctx.beginPath();
	this.ctx.arc( this.offset.x+p.x*this.scale.x, this.offset.y+p.y*this.scale.y, radius, 0, 2 * Math.PI, false );
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
    };


    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number} lineWidth - The line width (optional, default=1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circle( center:Vertex, radius:number, color:string, lineWidth?:number ) {
	this.ctx.beginPath();
	this.ctx.ellipse( this.offset.x + center.x*this.scale.x, this.offset.y + center.y*this.scale.y, radius*this.scale.x, radius*this.scale.y, 0.0, 0.0, Math.PI*2 );
	this.ctx.closePath();
	this.ctx.lineWidth = lineWidth || 1;
	this._fillOrDraw( color );
    };


    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number} lineWidth=1 - An optional line width param (default is 1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    ellipse( center:Vertex, radiusX:number, radiusY:number, color:string, lineWidth?:number ) {
	this.ctx.beginPath();
	this.ctx.ellipse( this.offset.x + center.x*this.scale.x, this.offset.y + center.y*this.scale.y, radiusX*this.scale.x, radiusY*this.scale.y, 0.0, 0.0, Math.PI*2 );
	this.ctx.closePath();
	this.ctx.lineWidth = lineWidth || 1;
	this._fillOrDraw( color );
    };   


    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number} lineWidth - The line with to use (optional, default is 1).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    square( center:Vertex, size:number, color:string, lineWidth?:number ) {
	this.ctx.beginPath();
	this.ctx.rect( this.offset.x+(center.x-size/2.0)*this.scale.x, this.offset.y+(center.y-size/2.0)*this.scale.y, size*this.scale.x, size*this.scale.y );
	this.ctx.closePath();
	this.ctx.lineWidth = lineWidth || 1;
	this._fillOrDraw( color );
    };


    /**
     * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
     *
     * @method grid
     * @param {Vertex} center - The center of the grid.
     * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
     * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal grid size.
     * @param {number} sizeY - The vertical grid size.
     * @param {string} color - The CSS color to draw the grid with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    grid( center:Vertex, width:number, height:number, sizeX:number, sizeY:number, color:string ) {
	this.ctx.beginPath();
	var yMin : number = -Math.ceil((height*0.5)/sizeY)*sizeY;
	var yMax : number = height/2;
	for( var x = -Math.ceil((width*0.5)/sizeX)*sizeX; x < width/2; x+=sizeX ) {
	    this.ctx.moveTo( this.offset.x+(center.x+x)*this.scale.x, this.offset.y+(center.y+yMin)*this.scale.y );
	    this.ctx.lineTo( this.offset.x+(center.x+x)*this.scale.x, this.offset.y+(center.y+yMax)*this.scale.y );
	}

	var xMin : number = -Math.ceil((width*0.5)/sizeX)*sizeX; // -Math.ceil((height*0.5)/sizeY)*sizeY;
	var xMax : number = width/2; // height/2;
	for( var y = -Math.ceil((height*0.5)/sizeY)*sizeY; y < height/2; y+=sizeY ) {
	    this.ctx.moveTo( this.offset.x+(center.x+xMin)*this.scale.x-4, this.offset.y+(center.y+y)*this.scale.y );
	    this.ctx.lineTo( this.offset.x+(center.x+xMax)*this.scale.x+4, this.offset.y+(center.y+y)*this.scale.y );
	}
	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = 1.0;
	this.ctx.stroke();
	this.ctx.closePath();
    };


    /**
     * Draw a raster of crosshairs in the given grid.<br>
     *
     * This works analogue to the grid() function
     *
     * @method raster
     * @param {Vertex} center - The center of the raster.
     * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
     * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal raster size.
     * @param {number} sizeY - The vertical raster size.
     * @param {string} color - The CSS color to draw the raster with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    raster( center:Vertex, width:number, height:number, sizeX:number, sizeY:number, color:string ) {
	this.ctx.save();
	this.ctx.beginPath();
	var cx : number = 0, cy : number = 0;
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
    

    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped diamonds.
     *
     * @method diamondHandle
     * @param {Vertex} center - The center of the diamond.
     * @param {Vertex} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    diamondHandle( center:Vertex, size:number, color:string ) {
	this.ctx.beginPath();
	this.ctx.moveTo( this.offset.x + center.x*this.scale.x - size/2.0, this.offset.y + center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x,            this.offset.y + center.y*this.scale.y - size/2.0 );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x + size/2.0, this.offset.y + center.y*this.scale.y );
	this.ctx.lineTo( this.offset.x + center.x*this.scale.x,            this.offset.y + center.y*this.scale.y + size/2.0 );
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
    };


    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    squareHandle( center:Vertex, size:number, color:string ) {
	this.ctx.beginPath();
	this.ctx.rect( this.offset.x+center.x*this.scale.x-size/2.0, this.offset.y+center.y*this.scale.y-size/2.0, size, size );
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
    };


    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped circles.
     *
     * @method circleHandle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleHandle( center:Vertex, radius:number, color:string ) {
	radius = radius || 3;
	this.ctx.beginPath();
	this.ctx.arc( this.offset.x+center.x*this.scale.x, this.offset.y+center.y*this.scale.y, radius, 0, 2 * Math.PI, false );
	this.ctx.closePath();
	this.ctx.lineWidth = 1;
	this._fillOrDraw( color );
    };


    /**
     * Draw a crosshair with given radius and color at the given position.<br>
     * <br>
     * Note that the crosshair radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    crosshair( center:XYCoords, radius:number, color:string ) {
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


    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon}  polygon - The polygon to draw.
     * @param {string}   color - The CSS color to draw the polygon with.
     * @param {string}   lineWidth - The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polygon( polygon:Polygon, color:string, lineWidth?:number ) {
	this.polyline( polygon.vertices, polygon.isOpen, color, lineWidth );
    };


    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices   - The polygon vertices to draw.
     * @param {boolan}   isOpen     - If true the polyline will not be closed at its end.
     * @param {string}   color      - The CSS color to draw the polygon with.
     * @param {number}   lineWidth  - The line width (default is 1.0);
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polyline( vertices:Array<Vertex>, isOpen:boolean, color:string, lineWidth?:number ) {
	if( vertices.length <= 1 )
	    return;
	this.ctx.save();
	this.ctx.beginPath();
	this.ctx.lineWidth = lineWidth || 1.0;
	this.ctx.moveTo( this.offset.x + vertices[0].x*this.scale.x, this.offset.y + vertices[0].y*this.scale.y );
	for( var i = 0; i < vertices.length; i++ ) {
	    this.ctx.lineTo( this.offset.x + vertices[i].x*this.scale.x, this.offset.y + vertices[i].y*this.scale.y );
	}
	if( !isOpen && vertices.length > 2 )
	    this.ctx.closePath();
	this._fillOrDraw( color );
	this.ctx.setLineDash([]);
	this.ctx.restore();
    };

    
    // THIS FUNCTION IS CURRENTLY NOT IN USE, AS SVG TO CANVAS ARC CONVERSION IS UN-NECESSARY COMPLICATED.
    // BUT IT IS WORKING.
    // Found in an old version of
    //    https://github.com/canvg/canvg
    /*
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
    */

    
    // THIS FUNCTION IS CURRENTLY NOT IN USE
    /*
    _context.drawutils.prototype.text = function( text, x, y, options ) {
	options = options || {};
	//this.ctx.save();
	x = this.offset.x+x*this.scale.x;
	y = this.offset.y+y*this.scale.y;
	var color = options.color || 'black';
	if( this.fillShapes ) {
	    this.ctx.fillStyle = color;
	    this.ctx.fillText( text, x, y );
	} else {
	    this.ctx.strokeStyle = color;
	    this.ctx.strokeText( text, x, y );
	}
	//this.ctx.restore();
    };
    */
    


    /**
     * Draw a non-scaling text label at the given position.
     *
     * Note that these are absolute label positions, they are not affected by offset or scale.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians (default=0).
     * @param {string=} color - The color to render the text with (default=black).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    label( text:string, x:number, y:number, rotation?:number, color?:string ) {
	this.ctx.save();
	this.ctx.translate(x, y);
	if( typeof rotation != 'undefined' )
	    this.ctx.rotate(rotation);
	this.ctx.fillStyle = color || 'black';
	if( this.fillShapes ) {
	    this.ctx.fillText( text, 0,0); 
	} else {
	    this.ctx.strokeText( text, 0,0);
	}
	this.ctx.restore();
    };


    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    clear( color:string ) {
	this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	this.ctx.fillStyle = color; 
	this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    };
    
   
}
