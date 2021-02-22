/**
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
 * @modified 2020-09-07 Added the circleArc(...) function to draw sections of circles.
 * @modified 2020-10-06 Removed the .closePath() instruction from the circleArc function.
 * @modified 2020-10-15 Re-added the text() function.
 * @modified 2020-10-28 Added the path(Path2D) function.
 * @modified 2020-12-28 Added the `singleSegment` mode (test).
 * @modified 2021-01-05 Added the image-loaded/broken check.
 * @modified 2021-01-24 Added the `setCurrentId` function from the `DrawLib` interface.
 * @version  1.8.3
 **/
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { DrawLib, SVGPathParams, XYCoords, UID } from "./interfaces";
/**
 * @classdesc A wrapper class for basic drawing operations.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires Vertex
 * @requires XYCoords
 */
export declare class drawutils implements DrawLib<void> {
    /**
     * @member {CanvasRenderingContext2D}
     * @memberof drawutils
     * @type {CanvasRenderingContext2D}
     * @instance
     */
    ctx: CanvasRenderingContext2D;
    /**
     * @member {Vertex}
     * @memberof drawutils
     * @type {Vertex}
     * @instance
     */
    readonly offset: Vertex;
    /**
     * @member {Vertex}
     * @memberof drawutils
     * @type {Vertex}
     * @instance
     */
    readonly scale: Vertex;
    /**
     * @member {boolean}
     * @memberof drawutils
     * @type {boolean}
     * @instance
     */
    fillShapes: boolean;
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {anvasRenderingContext2D} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    constructor(context: CanvasRenderingContext2D, fillShapes: boolean);
    /**
     * Called before each draw cycle.
     * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
     **/
    beginDrawCycle(renderTime: number): void;
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID} uid - A UID identifying the currently drawn element(s).
     **/
    setCurrentId(uid: UID | undefined): void;
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string} className - A class name for further custom use cases.
     **/
    setCurrentClassName(className: string | undefined): void;
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line(zA: Vertex, zB: Vertex, color: string, lineWidth?: number): void;
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {Vertex} zA - The start point of the arrow-line.
     * @param {Vertex} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    arrow(zA: Vertex, zB: Vertex, color: string, lineWidth?: number): void;
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
    image(image: HTMLImageElement, position: Vertex, size: Vertex): void;
    /**
     * Draw a rectangle.
     *
     * @param {Vertex} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    rect(position: Vertex, width: number, height: number, color: string, lineWidth?: number): void;
    _fillOrDraw(color: string): void;
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {Vertex} startPoint - The start point of the cubic Bézier curve
     * @param {Vertex} endPoint   - The end point the cubic Bézier curve.
     * @param {Vertex} startControlPoint - The start control point the cubic Bézier curve.
     * @param {Vertex} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezier(startPoint: Vertex, endPoint: Vertex, startControlPoint: Vertex, endControlPoint: Vertex, color: string, lineWidth?: number): void;
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
    quadraticBezier(startPoint: Vertex, controlPoint: Vertex, endPoint: Vertex, color: string, lineWidth?: number): void;
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
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezierPath(path: Array<Vertex>, color: string, lineWidth?: number): void;
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
    handle(startPoint: Vertex, endPoint: Vertex): void;
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
    handleLine(startPoint: Vertex, endPoint: Vertex): void;
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
    dot(p: Vertex, color: string): void;
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
    point(p: Vertex, color: string): void;
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
    circle(center: Vertex, radius: number, color: string, lineWidth?: number): void;
    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string=#000000} color - The CSS color to draw the circle with.
     * @param {number=1} lineWidth - The line width to use
     // * @param {boolean=false} options.asSegment - If `true` then no beginPath and no draw will be applied (as part of larger path).
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleArc(center: Vertex, radius: number, startAngle: number, endAngle: number, color?: string, lineWidth?: number, options?: {
        asSegment?: boolean;
    }): void;
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
    ellipse(center: Vertex, radiusX: number, radiusY: number, color: string, lineWidth?: number): void;
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
    square(center: Vertex, size: number, color: string, lineWidth?: number): void;
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
    grid(center: Vertex, width: number, height: number, sizeX: number, sizeY: number, color: string): void;
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
    raster(center: Vertex, width: number, height: number, sizeX: number, sizeY: number, color: string): void;
    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
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
    diamondHandle(center: Vertex, size: number, color: string): void;
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
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
    squareHandle(center: Vertex, size: number, color: string): void;
    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
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
    circleHandle(center: Vertex, radius: number, color: string): void;
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
    crosshair(center: XYCoords, radius: number, color: string): void;
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
    polygon(polygon: Polygon, color: string, lineWidth?: number): void;
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
    polyline(vertices: Array<Vertex>, isOpen: boolean, color: string, lineWidth?: number): void;
    text(text: string, x: number, y: number, options?: {
        color?: string;
    }): void;
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
    label(text: string, x: number, y: number, rotation?: number, color?: string): void;
    /**
     * Draw an SVG-like path given by the specified path data.
     *
     *
     * @method path
     * @param {SVGPathData} pathData - An array of path commands and params.
     * @param {string=null} color - (optional) The color to draw this path with (default is null).
     * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
     * @param {boolean=false} inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    path(pathData: SVGPathParams, color?: string, lineWidth?: number, inplace?: boolean): void;
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    clear(color: string): void;
}
