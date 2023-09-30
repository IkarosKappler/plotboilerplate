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
 * @modified 2023-09-29 Downgrading all `Vertex` param type to the more generic `XYCoords` type in these render functions: line, arrow, texturedPoly, cubicBezier, cubicBezierPath, handle, handleLine, dot, point, circle, circleArc, ellipse, grid, raster.
 * @modified 2023-09-29 Added the `headLength` parameter to the 'DrawLib.arrow()` function.
 * @modified 2023-09-29 Added the `arrowHead(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `cubicBezierArrow(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `lineDashes` attribute.
 * @version  0.0.10
 **/
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { DrawLib, XYCoords, SVGPathParams, UID, DrawLibConfiguration, FontStyle, FontWeight } from "./interfaces";
import { Bounds } from "./Bounds";
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
export declare class drawutilsgl implements DrawLib<void> {
    private static vertCode;
    private static fragCode;
    gl: WebGLRenderingContext;
    readonly offset: Vertex;
    readonly scale: Vertex;
    fillShapes: boolean;
    private _zindex;
    private glutils;
    private _vertShader;
    private _fragShader;
    private _program;
    private vertex_buffer;
    private curId;
    private renderTime;
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutils
     * @param {WebGLRenderingContext|null} context - The drawing context.
     * @param {boolean} fillShaped - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     **/
    constructor(context: WebGLRenderingContext, fillShapes: boolean);
    _x2rel(x: number): number;
    _y2rel(y: number): number;
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    copyInstance(fillShapes: boolean): drawutilsgl;
    /**
     * Called before each draw cycle.
     * @param {number} renderTime
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
     * Set or clear the line-dash configuration. Pass `null` for un-dashed lines.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
     * and https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
     * for how line dashes work.
     *
     * @method
     * @param {Array<number> lineDashes - The line-dash array configuration.
     * @returns {void}
     */
    setLineDash(lineDashes: Array<number>): void;
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     *
     * @name setCurrentId
     * @method
     * @param {UID|null} uid - A UID identifying the currently drawn element(s).es.
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
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line(zA: XYCoords, zB: XYCoords, color: string): void;
    /**
     * Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
     *
     * @method arrow
     * @param {XYCoords} zA - The start point of the arrow-line.
     * @param {XYCoords} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {headLength=8} headLength - (optional) The length of the arrow head (default is 8 units).
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    arrow(zA: XYCoords, zB: XYCoords, color: string): void;
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
     *
     * @return {void}
     * @instance
     * @memberof DrawLib
     */
    cubicBezierArrow(startPoint: XYCoords, endPoint: XYCoords, startControlPoint: XYCoords, endControlPoint: XYCoords, color: string, lineWidth?: number, headLength?: number): void;
    /**
     * Draw just an arrow head a the end of an imaginary line (zB) of the given line width the specified (CSS-) color and size.
     *
     * @method arrow
     * @param {XYCoords} zA - The start point of the arrow-line.
     * @param {XYCoords} zB - The end point of the arrow-line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=1} lineWidth - (optional) The line width to use; default is 1.
     * @param {number=8} headLength - (optional) The length of the arrow head (default is 8 pixels).
     * @return {void}
     * @instance
     * @memberof DrawLib
     **/
    arrowHead(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, headLength?: number): void;
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
     * @return {void}
     * @instance
     * @memberof drawutilsgl
     **/
    texturedPoly(textureImage: HTMLImageElement, textureSize: Bounds, polygon: Polygon, polygonPosition: XYCoords, rotation: number): void;
    _fillOrDraw(color: string): void;
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
    cubicBezier(startPoint: XYCoords, endPoint: XYCoords, startControlPoint: XYCoords, endControlPoint: XYCoords, color: string, lineWidth?: number): void;
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
    cubicBezierPath(path: Array<XYCoords>, color: string, lineWidth?: number): void;
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
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circle(center: XYCoords, radius: number, color: string, lineWidth?: number): void;
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
    circleArc(center: XYCoords, radius: number, startAngle: number, endAngle: number, color: string, lineWidth?: number): void;
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
    ellipse(center: XYCoords, radiusX: number, radiusY: number, color: string, lineWidth?: number, rotation?: number): void;
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
    square(center: XYCoords, size: number, color: string, lineWidth?: number): void;
    /**
     * Draw a rectangle.
     *
     * @param {XYCoords} position - The upper left corner of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} color - The color to use.
     * @param {number=1} lineWidth - (optional) The line with to use (default is 1).
     **/
    rect(position: XYCoords, width: number, height: number, color: string, lineWidth?: number): void;
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
    diamondHandle(center: XYCoords, size: number, color: string): void;
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
    squareHandle(center: XYCoords, size: number, color: string): void;
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
    circleHandle(center: XYCoords, size: number, color: string): void;
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
     * @param {Polygon} polygon - The polygon to draw.
     * @param {string} color - The CSS color to draw the polygon with.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polygon(polygon: Polygon, color: string, lineWidth?: number): void;
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
    polyline(vertices: Array<XYCoords>, isOpen: boolean, color: string, lineWidth?: number): void;
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
    label(text: string, x: number, y: number, rotation?: number, color?: string): void;
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
    path(pathData: SVGPathParams, color?: string, lineWidth?: number, options?: {
        inplace?: boolean;
    }): void;
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
