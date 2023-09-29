"use strict";
/**
 * @author   Ikaros Kappler
 * @date     2019-09-18
 * @modified 2019-10-03 Added the beginDrawCycle hook.
 * @modified 2020-03-25 Ported stub to Typescript.
 * @modified 2020-10-15 Re-added the text() function.
 * @modified 2021-01-24 Added the `setCurrentId` function.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-27 Added the `texturedPoly` function.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @version  0.0.9
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawutilsgl = void 0;
var Vertex_1 = require("./Vertex");
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
var drawutilsgl = /** @class */ (function () {
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {WebGLRenderingContext|null} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    function drawutilsgl(context, fillShapes) {
        this.gl = context;
        this.offset = new Vertex_1.Vertex(0, 0);
        this.scale = new Vertex_1.Vertex(1, 1);
        this.fillShapes = fillShapes;
        this._zindex = 0.0;
        if (context == null || typeof context === "undefined")
            return;
        this.glutils = new GLU(context);
        // PROBLEM: CANNOT USE MULTIPLE SHADER PROGRAM INSTANCES ON THE SAME CONTEXT!
        // SOLUTION: USE SHARED SHADER PROGRAM!!! ... somehow ...
        // This needs to be considered in the overlying component; both draw-instances need to
        // share their gl context.
        // That's what the copyInstace(boolean) method is good for.
        this._vertShader = this.glutils.compileShader(drawutilsgl.vertCode, this.gl.VERTEX_SHADER);
        this._fragShader = this.glutils.compileShader(drawutilsgl.fragCode, this.gl.FRAGMENT_SHADER);
        this._program = this.glutils.makeProgram(this._vertShader, this._fragShader);
        // Create an empty buffer object
        this.vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        console.log("gl initialized");
    }
    drawutilsgl.prototype._x2rel = function (x) {
        return ((this.scale.x * x + this.offset.x) / this.gl.canvas.width) * 2.0 - 1.0;
    };
    drawutilsgl.prototype._y2rel = function (y) {
        return ((this.offset.y - this.scale.y * y) / this.gl.canvas.height) * 2.0 - 1.0;
    };
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    drawutilsgl.prototype.copyInstance = function (fillShapes) {
        var copy = new drawutilsgl(null, fillShapes);
        copy.gl = this.gl;
        copy.glutils = this.glutils;
        copy._vertShader = this._vertShader;
        copy._fragShader = this._fragShader;
        copy._program = this._program;
        return copy;
    };
    /**
     * Called before each draw cycle.
     * @param {number} renderTime
     **/
    drawutilsgl.prototype.beginDrawCycle = function (renderTime) {
        this._zindex = 0.0;
        this.renderTime = renderTime;
    };
    /**
     * Called after each draw cycle.
     *
     * This is required for compatibility with other draw classes in the library (like drawgl).
     *
     * @name endDrawCycle
     * @method
     * @param {number} renderTime
     * @instance
     **/
    drawutilsgl.prototype.endDrawCycle = function (renderTime) {
        // NOOP
    };
    /**
     * Set the current drawlib configuration.
     *
     * @name setConfiguration
     * @method
     * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
     */
    drawutilsgl.prototype.setConfiguration = function (configuration) {
        // TODO
    };
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID|null} uid - A UID identifying the currently drawn element(s).es.
     **/
    drawutilsgl.prototype.setCurrentId = function (uid) {
        // NOOP
        this.curId = uid;
    };
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string|null} className - A class name for further custom use cases.
     **/
    drawutilsgl.prototype.setCurrentClassName = function (className) {
        // NOOP
    };
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {XYCoords} zA - The start point of the line.
     * @param {XYCoords} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    drawutilsgl.prototype.line = function (zA, zB, color) {
        var vertices = new Float32Array(6);
        vertices[0] = this._x2rel(zA.x);
        vertices[1] = this._y2rel(zA.y);
        vertices[2] = this._zindex;
        vertices[3] = this._x2rel(zB.x);
        vertices[4] = this._y2rel(zB.y);
        vertices[5] = this._zindex;
        this._zindex += 0.001;
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
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        var uRotationVector = this.gl.getUniformLocation(this._program, "uRotationVector");
        // let radians = currentAngle * Math.PI / 180.0;
        var currentRotation = [0.0, 1.0];
        //currentRotation[0] = Math.sin(radians);
        //currentRotation[1] = Math.cos(radians);
        this.gl.uniform2fv(uRotationVector, currentRotation);
        this.gl.lineWidth(5);
        // Draw the line
        this.gl.drawArrays(this.gl.LINES, 0, vertices.length / 3);
        // POINTS, LINE_STRIP, LINE_LOOP, LINES,
        // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
    };
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {XYCoords} zA - The start point of the arrow-line.
     * @param {XYCoords} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    drawutilsgl.prototype.arrow = function (zA, zB, color) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {XYCoords} position - The position to draw the the upper left corner at.
     * @param {XYCoords} size - The x/y-size to draw the image with.
     * @param {number=0.0} alpha - (optional, default=0.0) The transparency (0.0=opaque, 1.0=transparent).
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    drawutilsgl.prototype.image = function (image, position, size, alpha) {
        if (alpha === void 0) { alpha = 0.0; }
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method texturedPoly
     * @param {Image} textureImage - The image object to draw.
     * @param {Bounds} textureSize - The texture size to use; these are the original bounds to map the polygon vertices to.
     * @param {Polygon} polygon - The polygon to use as clip path.
     * @param {XYCoords} polygonPosition - The polygon's position (relative), measured at the bounding box's center.
     * @param {number} rotation - The rotation to use for the polygon (and for the texture).
     * @return {void}
     * @instance
     * @memberof drawutilsgl
     **/
    drawutilsgl.prototype.texturedPoly = function (textureImage, textureSize, polygon, polygonPosition, rotation) {
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
    drawutilsgl.prototype._fillOrDraw = function (color) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {XYCoords} startPoint - The start point of the cubic Bézier curve
     * @param {XYCoords} endPoint   - The end point the cubic Bézier curve.
     * @param {XYCoords} startControlPoint - The start control point the cubic Bézier curve.
     * @param {VertXYCoordsex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.cubicBezier = function (startPoint, endPoint, startControlPoint, endControlPoint, color, lineWidth) {
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
     * @param {XYCoords[]} path - The cubic bezier path as described above.
     * @param {string} color - The CSS colot to draw the path with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.cubicBezierPath = function (path, color, lineWidth) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw the given handle and handle point (used to draw interactive Bézier curves).
     *
     * The colors for this are fixed and cannot be specified.
     *
     * @method handle
     * @param {XYCoords} startPoint - The start of the handle.
     * @param {XYCoords} endPoint - The end point of the handle.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.handle = function (startPoint, endPoint) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a handle line (with a light grey).
     *
     * @method handleLine
     * @param {XYCoords} startPoint - The start point to draw the handle at.
     * @param {XYCoords} endPoint - The end point to draw the handle at.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.handleLine = function (startPoint, endPoint) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a 1x1 dot with the specified (CSS-) color.
     *
     * @method dot
     * @param {XYCoords} p - The position to draw the dot at.
     * @param {string} color - The CSS color to draw the dot with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.dot = function (p, color) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {XYCoords} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.point = function (p, color) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {XYCoords} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.circle = function (center, radius, color, lineWidth) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {XYCoords} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.circleArc = function (center, radius, startAngle, endAngle, color, lineWidth) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {XYCoords} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.ellipse = function (center, radiusX, radiusY, color, lineWidth, rotation) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {XYCords} center - The center of the square.
     * @param {number} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.square = function (center, size, color, lineWidth) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a rectangle.
     *
     * @param {XYCoords} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    drawutilsgl.prototype.rect = function (position, width, height, color, lineWidth) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a grid of horizontal and vertical lines with the given (CSS-) color.
     *
     * @method grid
     * @param {XYCoords} center - The center of the grid.
     * @param {number} width - The total width of the grid (width/2 each to the left and to the right).
     * @param {number} height - The total height of the grid (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal grid size.
     * @param {number} sizeY - The vertical grid size.
     * @param {string} color - The CSS color to draw the grid with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.grid = function (center, width, height, sizeX, sizeY, color) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a raster of crosshairs in the given grid.<br>
     *
     * This works analogue to the grid() function
     *
     * @method raster
     * @param {XYCoords} center - The center of the raster.
     * @param {number} width - The total width of the raster (width/2 each to the left and to the right).
     * @param {number} height - The total height of the raster (height/2 each to the top and to the bottom).
     * @param {number} sizeX - The horizontal raster size.
     * @param {number} sizeY - The vertical raster size.
     * @param {string} color - The CSS color to draw the raster with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.raster = function (center, width, height, sizeX, sizeY, color) {
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
     * @param {XYCoords} center - The center of the diamond.
     * @param {number} size - The x/y-size of the diamond.
     * @param {string} color - The CSS color to draw the diamond with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.diamondHandle = function (center, size, color) {
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
     * @param {XYCoords} center - The center of the square.
     * @param {number} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.squareHandle = function (center, size, color) {
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
     * @param {XYCoords} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.circleHandle = function (center, size, color) {
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
     * @param {number=0.5} lineWidth - (optional, default=0.5) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.crosshair = function (center, radius, color, lineWidth) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a cross with diagonal axes with given radius, color and lineWidth at the given position.<br>
     * <br>
     * Note that the x's radius will not be affected by scaling.
     *
     * @method crosshair
     * @param {XYCoords} center - The center of the crosshair.
     * @param {number} radius - The radius of the crosshair.
     * @param {string} color - The CSS color to draw the crosshair with.
     * @param {number=1} lineWidth - (optional, default=1.0) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.cross = function (center, radius, color, lineWidth) {
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
    drawutilsgl.prototype.polygon = function (polygon, color, lineWidth) {
        var vertices = new Float32Array(polygon.vertices.length * 3);
        for (var i = 0; i < polygon.vertices.length; i++) {
            vertices[i * 3 + 0] = this._x2rel(polygon.vertices[i].x);
            vertices[i * 3 + 1] = this._y2rel(polygon.vertices[i].y);
            vertices[i * 3 + 2] = this._zindex;
        }
        this._zindex += 0.001;
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
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        var uRotationVector = this.gl.getUniformLocation(this._program, "uRotationVector");
        // let radians = currentAngle * Math.PI / 180.0;
        var currentRotation = [0.0, 1.0];
        //currentRotation[0] = Math.sin(radians);
        //currentRotation[1] = Math.cos(radians);
        this.gl.uniform2fv(uRotationVector, currentRotation);
        // Draw the polygon
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, vertices.length / 3);
        // POINTS, LINE_STRIP, LINE_LOOP, LINES,
        // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
    };
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {XYCoords[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @param {number=}  lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.polyline = function (vertices, isOpen, color, lineWidth) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw a text at the given relative position.
     *
     * @method text
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {string=} options.color - The Color to use.
     * @param {string=} options.fontFamily - The font family to use.
     * @param {number=} options.fontSize - The font size (in pixels) to use.
     * @param {FontStyle=} options.fontStyle - The font style to use.
     * @param {FontWeight=} options.fontWeight - The font weight to use.
     * @param {number=} options.lineHeight - The line height (in pixels) to use.
     * @param {number=} options.rotation - The (optional) rotation in radians.
     * @param {string=} options.textAlign - The text align to use. According to the specifiactions (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) valid values are `"left" || "right" || "center" || "start" || "end"`.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.text = function (text, x, y, options) {
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
     * @param {string="black"} color - The color to use (default is black).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    drawutilsgl.prototype.label = function (text, x, y, rotation, color) {
        // NOT YET IMPLEMENTED
    };
    /**
     * Draw an SVG-like path given by the specified path data.
     *
     * @method path
     * @param {SVGPathData} pathData - An array of path commands and params.
     * @param {string=null} color - (optional) The color to draw this path with (default is null).
     * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
     * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    drawutilsgl.prototype.path = function (pathData, color, lineWidth, options) {
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
    drawutilsgl.prototype.clear = function (color) {
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
    // Vertex shader source code
    drawutilsgl.vertCode = "\n    precision mediump float;\n\n    attribute vec3 position;\n\n    uniform vec2 uRotationVector;\n\n    void main(void) {\n\tvec2 rotatedPosition = vec2(\n\t    position.x * uRotationVector.y +\n\t\tposition.y * uRotationVector.x,\n\t    position.y * uRotationVector.y -\n\t\tposition.x * uRotationVector.x\n\t);\n\n\tgl_Position = vec4(rotatedPosition, position.z, 1.0);\n    }";
    // Fragment shader source code
    drawutilsgl.fragCode = "\n    precision highp float;\n\n    void main(void) {\n\tgl_FragColor = vec4(0.0,0.75,1.0,1.0);\n    }";
    return drawutilsgl;
}());
exports.drawutilsgl = drawutilsgl;
/**
 * Some GL helper utils.
 **/
var GLU = /** @class */ (function () {
    function GLU(gl) {
        this.gl = gl;
    }
    GLU.prototype.bufferData = function (verts) {
        // Create an empty buffer object
        var vbuffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbuffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, verts, this.gl.STATIC_DRAW);
        // Unbind the buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        return vbuffer;
    };
    /*=================== Shaders ====================*/
    GLU.prototype.compileShader = function (shaderCode, shaderType) {
        // Create a vertex shader object
        var shader = this.gl.createShader(shaderType);
        // Attach vertex shader source code
        this.gl.shaderSource(shader, shaderCode);
        // Compile the vertex shader
        this.gl.compileShader(shader);
        var vertStatus = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!vertStatus) {
            console.warn("Error in shader:" + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    GLU.prototype.makeProgram = function (vertShader, fragShader) {
        // Create a shader program object to store
        // the combined shader program
        var program = this.gl.createProgram();
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
    return GLU;
}());
//# sourceMappingURL=drawgl.js.map