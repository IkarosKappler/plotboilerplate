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
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-31 Added the `endDrawCycle` function from `DrawLib`.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2021-11-12 Adding more parameters tot the `text()` function: fontSize, textAlign, fontFamily, lineHeight.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-27 Added the `texturedPoly` function.
 * @modified 2022-06-01 Tweaked the `polyline` function; lineWidth now scales with scale.x.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2022-08-23 Fixed a type issue in the `polyline` function.
 * @modified 2022-08-23 Fixed a type issue in the `setConfiguration` function.
 * @modified 2022-08-23 Fixed a type issue in the `path` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @modified 2023-09-29 Removed unused method stub for texturedPoly helper function (cleanup).
 * @modified 2023-09-29 Downgrading all `Vertex` param type to the more generic `XYCoords` type in these render functions: line, arrow, texturedPoly, cubicBezier, cubicBezierPath, handle, handleLine, dot, point, circle, circleArc, ellipse, grid, raster.
 * @modified 2023-09-29 Added the `headLength` parameter to the 'DrawLib.arrow()` function.
 * @modified 2023-09-29 Added the `arrowHead(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `cubicBezierArrow(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `lineDashes` attribute.
 * @modified 2023-09-30 Adding `strokeOptions` param to these draw function: line, arrow, cubicBezierArrow, cubicBezier, cubicBezierPath, circle, circleArc, ellipse, square, rect, polygon, polyline.
 * @modified 2023-10-07 Adding the optional `arrowHeadBasePositionBuffer` param to the arrowHead(...) method.
 * @version  1.13.0
 **/
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { DrawLib, SVGPathParams, XYCoords, UID, DrawLibConfiguration, FontStyle, FontWeight, StrokeOptions } from "./interfaces";
import { Bounds } from "./Bounds";
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
     * A private helper method to apply stroke options to the current
     * context.
     * @param {StrokeOptions=} strokeOptions -
     */
    private applyStrokeOpts;
    _fillOrDraw(color: string): void;
    /**
     * Called before each draw cycle.
     * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
     **/
    beginDrawCycle(renderTime: number): void;
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
    endDrawCycle(renderTime: number): void;
    /**
     * Set the current drawlib configuration.
     *
     * @name setConfiguration
     * @method
     * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
     */
    setConfiguration(configuration: DrawLibConfiguration): void;
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID|null} uid - A UID identifying the currently drawn element(s).
     **/
    setCurrentId(uid: UID | null): void;
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string|null} className - A class name for further custom use cases.
     **/
    setCurrentClassName(className: string | null): void;
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {XYCoords} zA - The start point of the line.
     * @param {XYCoords} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number} lineWidth? - [optional] The line's width.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {XYCoords} zA - The start point of the arrow-line.
     * @param {XYCoords} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @param {headLength=8} headLength - (optional) The length of the arrow head (default is 8 units).
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    arrow(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, headLength?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw a cubic Bézier curve and and an arrow at the end (endControlPoint) of the given line width the specified (CSS-) color and arrow size.
     *
     * @method cubicBezierArrow
     * @param {XYCoords} startPoint - The start point of the cubic Bézier curve
     * @param {XYCoords} endPoint   - The end point the cubic Bézier curve.
     * @param {XYCoords} startControlPoint - The start control point the cubic Bézier curve.
     * @param {XYCoords} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number} lineWidth - (optional) The line width to use.
     * @param {headLength=8} headLength - (optional) The length of the arrow head (default is 8 units).
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof DrawLib
     */
    cubicBezierArrow(startPoint: XYCoords, endPoint: XYCoords, startControlPoint: XYCoords, endControlPoint: XYCoords, color: string, lineWidth?: number, headLength?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw just an arrow head a the end of an imaginary line (zB) of the given line width the specified (CSS-) color and size.
     *
     * @method arrow
     * @param {XYCoords} zA - The start point of the arrow-line.
     * @param {XYCoords} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=1} lineWidth - (optional) The line width to use; default is 1.
     * @param {number=8} headLength - (optional) The length of the arrow head (default is 8 pixels).
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     * @param {XYCoords=} arrowHeadBasePositionBuffer - (optional) If not null, then this position will contain the arrow head's start point (after execution). Some sort of OUT variable.
     *
     * @return {void}
     * @instance
     * @memberof DrawLib
     **/
    arrowHead(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, headLength?: number, strokeOptions?: StrokeOptions, arrowHeadBasePositionBuffer?: XYCoords): void;
    /**
     * Draw an image at the given position with the given size.<br>
     * <br>
     * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method image
     * @param {Image} image - The image object to draw.
     * @param {XYCoords} position - The position to draw the the upper left corner at.
     * @param {XYCoords} size - The x/y-size to draw the image with.
     * @param {number=0.0} alpha - (optional, default=0.0) The transparency (1.0=opaque, 0.0=transparent).
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    image(image: HTMLImageElement, position: XYCoords, size: XYCoords, alpha?: number): void;
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
     * @param {XYCoords={x:0,y:0}} rotationCenter - (optional) The rotational center; default is center of bounding box.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    texturedPoly(textureImage: HTMLImageElement, textureSize: Bounds, polygon: Polygon, polygonPosition: XYCoords, rotation: number): void;
    /**
     * Draw a rectangle.
     *
     * @param {XYCoords} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    rect(position: XYCoords, width: number, height: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw the given (cubic) bézier curve.
     *
     * @method cubicBezier
     * @param {XYCoords} startPoint - The start point of the cubic Bézier curve
     * @param {XYCoords} endPoint   - The end point the cubic Bézier curve.
     * @param {XYCoords} startControlPoint - The start control point the cubic Bézier curve.
     * @param {XYCoords} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the curve with.
     * @param {number} lineWidth - (optional) The line width to use.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezier(startPoint: XYCoords, endPoint: XYCoords, startControlPoint: XYCoords, endControlPoint: XYCoords, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw the given (quadratic) bézier curve.
     *
     * @method quadraticBezier
     * @param {XYCoords} startPoint   - The start point of the cubic Bézier curve
     * @param {XYCoords} controlPoint - The control point the cubic Bézier curve.
     * @param {XYCoords} endPoint     - The end control point the cubic Bézier curve.
     * @param {string} color        - The CSS color to draw the curve with.
     * @param {number|string} lineWidth - (optional) The line width to use.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    quadraticBezier(startPoint: XYCoords, controlPoint: XYCoords, endPoint: XYCoords, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
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
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    cubicBezierPath(path: Array<XYCoords>, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
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
    handle(startPoint: XYCoords, endPoint: XYCoords): void;
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
    handleLine(startPoint: XYCoords, endPoint: XYCoords): void;
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
    dot(p: XYCoords, color: string): void;
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
    point(p: XYCoords, color: string): void;
    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {XYCoords} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number} lineWidth - The line width (optional, default=1).
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circle(center: XYCoords, radius: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {XYCoords} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string=#000000} color - The CSS color to draw the circle with.
     * @param {number=1} lineWidth - The line width to use
     * @param {boolean=false} options.asSegment - If `true` then no beginPath and no draw will be applied (as part of larger path).
     * @param {number=} options.dashOffset - (optional) `See StrokeOptions`.
     * @param {number=[]} options.dashArray - (optional) `See StrokeOptions`.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleArc(center: XYCoords, radius: number, startAngle: number, endAngle: number, color?: string, lineWidth?: number, options?: {
        asSegment?: boolean;
    } & StrokeOptions): void;
    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {XYCoords} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number} lineWidth=1 - An optional line width param (default is 1).
     * @param {number=} rotation - (optional, default=0) The rotation of the ellipse.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    ellipse(center: XYCoords, radiusX: number, radiusY: number, color: string, lineWidth?: number, rotation?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {XYCoords} center - The center of the square.
     * @param {number} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number} lineWidth - The line with to use (optional, default is 1).
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    square(center: XYCoords, size: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
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
    grid(center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string): void;
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
    raster(center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string): void;
    /**
     * Draw a diamond handle (square rotated by 45°) with the given CSS color.
     *
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
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
    diamondHandle(center: XYCoords, size: number, color: string): void;
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
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
    squareHandle(center: XYCoords, size: number, color: string): void;
    /**
     * Draw a circle handle with the given CSS color.<br>
     * <br>
     * It is an inherent feature of the handle functions that the drawn elements are not scaled and not
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
    circleHandle(center: XYCoords, radius: number, color: string): void;
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
    crosshair(center: XYCoords, radius: number, color: string, lineWidth?: number): void;
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
    cross(center: XYCoords, radius: number, color: string, lineWidth?: number): void;
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon}  polygon - The polygon to draw.
     * @param {string}   color - The CSS color to draw the polygon with.
     * @param {string}   lineWidth - The line width to use.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polygon(polygon: Polygon, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {XYCoords[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen     - If true the polyline will not be closed at its end.
     * @param {string}   color      - The CSS color to draw the polygon with.
     * @param {number}   lineWidth  - The line width (default is 1.0);
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polyline(vertices: Array<XYCoords>, isOpen: boolean, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): void;
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
    text(text: string, x: number, y: number, options?: {
        color?: string;
        fontFamily?: string;
        fontSize?: number;
        fontStyle?: FontStyle;
        fontWeight?: FontWeight;
        lineHeight?: number;
        textAlign?: CanvasRenderingContext2D["textAlign"];
        rotation?: number;
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
     * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @param {number=} options.dashOffset - (optional) `See StrokeOptions`.
     * @param {number=[]} options.dashArray - (optional) `See StrokeOptions`.
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    path(pathData: SVGPathParams, color?: string, lineWidth?: number, options?: {
        inplace?: boolean;
    } & StrokeOptions): void;
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    clear(color: string): void;
    private static helpers;
}
