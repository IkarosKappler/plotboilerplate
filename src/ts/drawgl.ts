/**
 * @author   Ikaros Kappler
 * @date     2019-09-18
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2020-03-25 Ported stub to Typescript.
 * @modified 2020-10-15 Re-added the text() function.
 * @version  0.0.4
 **/


import { CubicBezierCurve } from "./CubicBezierCurve";
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { XYCoords, SVGSerializable} from "./interfaces";


/**
 * @classdesc A wrapper class for basic drawing operations. This is the WebGL
 * implementation whih sould work with shaders.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires SVGSerializable
 * @requires Vertex
 * @requires XYCoords
 */
export class drawutilsgl {
    
    // Vertex shader source code
    private static vertCode : string = `
    precision mediump float;

    attribute vec3 position;

    uniform vec2 uRotationVector;

    void main(void) {
	vec2 rotatedPosition = vec2(
	    position.x * uRotationVector.y +
		position.y * uRotationVector.x,
	    position.y * uRotationVector.y -
		position.x * uRotationVector.x
	);

	gl_Position = vec4(rotatedPosition, position.z, 1.0);
    }`;

    // Fragment shader source code
    private static fragCode : string = `
    precision highp float;

    void main(void) {
	gl_FragColor = vec4(0.0,0.75,1.0,1.0);
    }`;

    gl:WebGLRenderingContext;

    readonly offset:Vertex;
    readonly scale:Vertex;

    fillShapes:boolean;

    private _zindex:number;

    private glutils:GLU;

    private _vertShader:WebGLShader;  // TODO (what's the type?)
    private _fragShader:WebGLShader;  // TODO
    private _program:WebGLProgram;
    private vertex_buffer:WebGLBuffer; // TODO
    
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {WebGLRenderingContext} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    constructor( context:WebGLRenderingContext, fillShapes:boolean ) {
	this.gl = context;
	this.offset = new Vertex( 0, 0 );
	this.scale = new Vertex( 1, 1 );
	this.fillShapes = fillShapes;

	this._zindex = 0.0;

	if( context == null || typeof context === 'undefined' )
	    return;

	this.glutils = new GLU(context);
	// PROBLEM: CANNOT USE MULTIPLE SHADER PROGRAM INSTANCES ON THE SAME CONTEXT!
	// SOLUTION: USE SHARED SHADER PROGRAM!!! ... somehow ...
	// This needs to be considered in the overlying component; both draw-instances need to
	// share their gl context.
	// That's what the copyInstace(boolean) method is good for.
	this._vertShader = this.glutils.compileShader( drawutilsgl.vertCode, this.gl.VERTEX_SHADER );
	this._fragShader = this.glutils.compileShader( drawutilsgl.fragCode, this.gl.FRAGMENT_SHADER );
	this._program = this.glutils.makeProgram( this._vertShader, this._fragShader );

	// Create an empty buffer object
	this.vertex_buffer = this.gl.createBuffer();
	// Bind appropriate array buffer to it
	// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
	
	console.log('gl initialized');
    };

    /**
     * Called before each draw cycle.
     **/
    beginDrawCycle() {
	this._zindex = 0.0;
    };
    
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    copyInstance( fillShapes:boolean ) : drawutilsgl {
	var copy : drawutilsgl = new drawutilsgl(null,fillShapes);
	copy.gl = this.gl;
	copy.glutils = this.glutils;
	copy._vertShader = this._vertShader;
	copy._fragShader = this._fragShader;
	copy._program = this._program;
	return copy;
    };

    _x2rel(x:number) : number { return (this.scale.x*x+this.offset.x)/this.gl.canvas.width*2.0-1.0; };
    _y2rel(y:number) : number { return (this.offset.y-this.scale.y*y)/this.gl.canvas.height*2.0-1.0; };

    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line( zA:Vertex, zB:Vertex, color:string ) {
	const vertices : Float32Array = new Float32Array( 6 );
	vertices[0] = this._x2rel(zA.x);
	vertices[1] = this._y2rel(zA.y);
	vertices[2] = this._zindex;
	vertices[3] = this._x2rel(zB.x);
	vertices[4] = this._y2rel(zB.y);
	vertices[5] = this._zindex;
	this._zindex+=0.001;
	
	// Create an empty buffer object
	// const vertex_buffer = this.gl.createBuffer();
	// Bind appropriate array buffer to it
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
	// Pass the vertex data to the buffer
	this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
	// Bind vertex buffer object
	// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
	// Get the attribute location
	var coord = this.gl.getAttribLocation(this._program, "position");
	// Point an attribute to the currently bound VBO
	this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
	// Enable the attribute
	this.gl.enableVertexAttribArray(coord);
	// Unbind the buffer?
	//this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	// Set the view port
	this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height);

	let uRotationVector =
	    this.gl.getUniformLocation(this._program, "uRotationVector");
	// let radians = currentAngle * Math.PI / 180.0;
	let currentRotation = [ 0.0, 1.0 ];
	//currentRotation[0] = Math.sin(radians);
	//currentRotation[1] = Math.cos(radians);
	this.gl.uniform2fv( uRotationVector, currentRotation );

	this.gl.lineWidth(5);
	
	// Draw the line
	this.gl.drawArrays(this.gl.LINES, 0, vertices.length/3);
	// POINTS, LINE_STRIP, LINE_LOOP, LINES,
	// TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
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
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
    _fillOrDraw( color:string ) {
	// NOT YET IMPLEMENTED
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
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezier( startPoint:Vertex, endPoint:Vertex, startControlPoint:Vertex, endControlPoint:Vertex, color:string ) {
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
    cubicBezierCurveHandleLines( curve:CubicBezierCurve ) {
	// NOT YET IMPLEMENTED
    };

    
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
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circle( center:Vertex, radius:number, color:string ) {
	// NOT YET IMPLEMENTED
    };


    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleArc( center:Vertex, radius:number, startAngle:number, endAngle:number, color:string, lineWidth?:number ) {
	// NOT YET IMPLEMENTED
    };


    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    ellipse( center:Vertex, radiusX:number, radiusY:number, color:string ) {
	// NOT YET IMPLEMENTED
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
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    square( center:Vertex, size:number, color:string ) {
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED
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
    circleHandle( center:Vertex, size:number, color:string ) {
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED	
    };


    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon} polygon - The polygon to draw.
     * @param {string} color - The CSS color to draw the polygon with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polygon( polygon:Polygon, color:string, lineWidth?:number ) {	
	const vertices : Float32Array = new Float32Array( polygon.vertices.length*3 );
	for( var i = 0; i < polygon.vertices.length; i++ ) {
	    vertices[i*3+0] = this._x2rel(polygon.vertices[i].x);
	    vertices[i*3+1] = this._y2rel(polygon.vertices[i].y);
	    vertices[i*3+2] = this._zindex;
	}
	this._zindex+=0.001;
	//console.log( vertices );
	
	// Create an empty buffer object
	// const vertex_buffer = this.gl.createBuffer();
	// Bind appropriate array buffer to it
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
	// Pass the vertex data to the buffer
	this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
	// Bind vertex buffer object
	// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
	// Get the attribute location
	var coord = this.gl.getAttribLocation(this._program, "position");
	// Point an attribute to the currently bound VBO
	this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
	// Enable the attribute
	this.gl.enableVertexAttribArray(coord);
	// Unbind the buffer?
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	// Set the view port
	this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height);

	let uRotationVector =
	    this.gl.getUniformLocation(this._program, "uRotationVector");
	// let radians = currentAngle * Math.PI / 180.0;
	let currentRotation = [ 0.0, 1.0 ];
	//currentRotation[0] = Math.sin(radians);
	//currentRotation[1] = Math.cos(radians);
	this.gl.uniform2fv( uRotationVector, currentRotation );
	
	// Draw the polygon
	this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, vertices.length/3);
	// POINTS, LINE_STRIP, LINE_LOOP, LINES,
	// TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
    };


    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polyline( vertices:Array<Vertex>, isOpen:boolean, color:string ) {
	// NOT YET IMPLEMENTED
    };

    text( text:string, x:number, y:number, options?:{color?:string}) {
     	   // NOT YET IMPLEMENTED
    };
    

    /**
     * Draw a non-scaling text label at the given position.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (aoptional) rotation in radians.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    // +---------------------------------------------------------------------------------
    // | Draw a non-scaling text label at the given position.
    // +-------------------------------
    label( text:string, x:number, y:number, rotation:number ) {
	// NOT YET IMPLEMENTED
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
	// NOT YET IMPLEMENTED

	// if( typeof color == 'string' )
	    // color = Color.parse(color); // Color class does not yet exist in TS
	
	// Clear the canvas
	this.gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// Enable the depth test
	this.gl.enable(this.gl.DEPTH_TEST);

	// Clear the color and depth buffer
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };

    
}



/**
 * Some GL helper utils.
 **/
class GLU {

    gl:WebGLRenderingContext;
    
    constructor( gl:WebGLRenderingContext ) {
	this.gl = gl;
    };

    bufferData( verts:Float32Array ) : WebGLBuffer {
	// Create an empty buffer object
	var vbuffer : WebGLBuffer = this.gl.createBuffer();
	// Bind appropriate array buffer to it
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbuffer);
	// Pass the vertex data to the buffer
	this.gl.bufferData(this.gl.ARRAY_BUFFER, verts, this.gl.STATIC_DRAW);
	// Unbind the buffer
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	return vbuffer;
    };
    

    /*=================== Shaders ====================*/
    compileShader( shaderCode:string, shaderType:any ) : WebGLShader {
	// Create a vertex shader object
	var shader : WebGLShader = this.gl.createShader(shaderType);
	// Attach vertex shader source code
	this.gl.shaderSource(shader, shaderCode);
	// Compile the vertex shader
	this.gl.compileShader(shader);
	const vertStatus = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
	if (!vertStatus) {
	    console.warn("Error in shader:" + this.gl.getShaderInfoLog(shader) );	
	    this.gl.deleteShader(shader);
	    return null;
	}
	return shader;
    };


    makeProgram( vertShader:WebGLShader, fragShader:WebGLShader ) : WebGLProgram {
	// Create a shader program object to store
	// the combined shader program
	var program : WebGLProgram = this.gl.createProgram();

	// Attach a vertex shader
	this.gl.attachShader(program, vertShader);

	// Attach a fragment shader
	this.gl.attachShader(program, fragShader);

	// Link both the programs
	this.gl.linkProgram(program);

	// Use the combined shader program object
	this.gl.useProgram(program);

	/*======= Do some cleanup ======*/
	this.gl.detachShader(program, vertShader);
	this.gl.detachShader(program, fragShader);
	this.gl.deleteShader(vertShader);
	this.gl.deleteShader(fragShader);

	return program;
    };
    
}
