/**
 * Draws elements into an SVG node.
 *
 * Note that this library uses buffers and draw cycles. To draw onto an SVG canvas, do this:
 *   const drawLib = new drawutilssvg( svgNode, ... );
 *   const fillLib = drawLib.copyInstance(true);
 *   // Begin draw cycle
 *   drawLib.beginDrawCycle(time);
 *   // ... draw or fill your stuff ...
 *   drawLib.endDrawCycle(time); // Here the elements become visible
 *
 * @author   Ikaros Kappler
 * @date     2021-01-03
 * @modified 2021-01-24 Fixed the `fillShapes` attribute in the copyInstance function.
 * @modified 2021-01-26 Changed the `isPrimary` (default true) attribute to `isSecondary` (default false).
 * @modified 2021-02-03 Added the static `createSvg` function.
 * @modified 2021-02-03 Fixed the currentId='background' bug on the clear() function.
 * @modified 2021-02-03 Fixed CSSProperty `stroke-width` (was line-width before, which is wrong).
 * @modified 2021-02-03 Added the static `HEAD_XML` attribute.
 * @modified 2021-02-19 Added the static helper function `transformPathData(...)` for svg path transformations (scale and translate).
 * @modified 2021-02-22 Added the static helper function `copyPathData(...)`.
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Fixed a bug in the `clear` function (curClassName was not cleared).
 * @modified 2021-03-29 Fixed a bug in the `text` function (second y param was wrong, used x here).
 * @modified 2021-03-29 Moved this file from `src/ts/utils/helpers/` to `src/ts/`.
 * @modified 2021-03-31 Added 'ellipseSector' the the class names.
 * @modified 2021-03-31 Implemented buffering using a buffer <g> node and the beginDrawCycle and endDrawCycle methods.
 * @modified 2021-05-31 Added the `setConfiguration` function from `DrawLib`.
 * @modified 2021-11-15 Adding more parameters tot the `text()` function: fontSize, textAlign, fontFamily, lineHeight.
 * @modified 2021-11-19 Fixing the `label(text,x,y)` position.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-03-26 Added the private `nodeDefs` and `bufferedNodeDefs` attributes.
 * @modified 2022-03-26 Added the `texturedPoly` function to draw textures polygons.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2022-11-10 Tweaking some type issues.
 * @modified 2023-02-04 Fixed a typo in the CSS classname for cubic Bézier paths: cubicBezier (was cubierBezier).
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @modified 2023-09-29 Added initialization checks for null parameters.
 * @modified 2023-09-29 Added a missing implementation to the `drawurilssvg.do(XYCoords,string)` function. Didn't draw anything.
 * @modified 2023-09-29 Downgrading all `Vertex` param type to the more generic `XYCoords` type in these render functions: line, arrow, texturedPoly, cubicBezier, cubicBezierPath, handle, handleLine, dot, point, circle, circleArc, ellipse, grid, raster.
 * @modified 2023-09-29 Added the `headLength` parameter to the 'DrawLib.arrow()` function.
 * @modified 2023-09-29 Added the `arrowHead(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `cubicBezierArrow(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-10-04 Adding `strokeOptions` param to these draw function: line, arrow, cubicBezierArrow, cubicBezier, cubicBezierPath, circle, circleArc, ellipse, square, rect, polygon, polyline.
 *
 * @version  1.6.7
 **/
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { DrawConfig, DrawLib, XYCoords, XYDimension, SVGPathParams, UID, DrawLibConfiguration, FontStyle, FontWeight, StrokeOptions } from "./interfaces";
import { Bounds } from "./Bounds";
/**
 * @classdesc A helper class for basic SVG drawing operations. This class should
 * be compatible to the default 'draw' class.
 *
 * @requires CubicBzierCurvce
 * @requires Polygon
 * @requires Vertex
 * @requires XYCoords
 */
export declare class drawutilssvg implements DrawLib<void | SVGElement> {
    static HEAD_XML: string;
    /**
     * @member {SVGGElement}
     * @memberof drawutilssvg
     * @instance
     */
    svgNode: SVGElement;
    /**
     * The root elements container <g> in the svgNode.
     */
    private gNode;
    /**
     * To avoid flickering the lib draws on a buffer, which is replacing the old <g> node at the end of the draw cycle.
     * @member {SVGGelement}
     * @memberof drawutilssvg
     * @instance
     * @private
     */
    private bufferGNode;
    /**
     * A style node of type `<style>`.
     * @member {SVGGelement}
     * @memberof drawutilssvg
     * @instance
     * @private
     */
    private nodeStyle;
    /**
     * A style node of type `<defs>`.
     * @member {SVGGelement}
     * @memberof drawutilssvg
     * @instance
     * @private
     */
    private nodeDefs;
    /**
     * The buffered nodeDefs.
     * @member {SVGGelement}
     * @memberof drawutilssvg
     * @instance
     * @private
     */
    private bufferedNodeDefs;
    /**
     * @member {Vertex}
     * @memberof drawutilssvg
     * @instance
     */
    scale: Vertex;
    /**
     * @member {Vertex}
     * @memberof drawutilssvg
     * @instance
     */
    offset: Vertex;
    /**
     * @member {boolean}
     * @memberof drawutilssvg
     * @instance
     */
    fillShapes: boolean;
    /**
     * @member {XYDimension}
     * @memberof drawutilssvg
     * @instance
     */
    canvasSize: XYDimension;
    /**
     * The current drawlib configuration to be used for all upcoming draw operations.
     * @member {DrawLibConfiguration}
     * @memberof drawutilssvg
     * @instance
     */
    drawlibConfiguration: DrawLibConfiguration;
    /**
     * The current drawable-ID. This can be any unique ID identifying the following drawn element.
     *
     * @member {UID|null}
     * @memberof drawutilssvg
     * @instance
     */
    private curId;
    /**
     * The current drawable-classname.
     */
    private curClassName;
    /**
     * The SVG element cache. On clear() all elements are kept for possible re-use on next draw cycle.
     */
    private cache;
    /**
     * Indicates if this library is the primary or seconday instance (draw an fill share the same DOM nodes).
     */
    private isSecondary;
    /**
     * The constructor.
     *
     * @constructor
     * @name drawutilssvg
     * @param {SVGElement} svgNode - The SVG node to use.
     * @param {XYCoords} offset - The draw offset to use.
     * @param {XYCoords} scale - The scale factors to use.
     * @param {XYDimension} canvasSize - The initial canvas size (use setSize to change).
     * @param {boolean} fillShapes - Indicates if the constructed drawutils should fill all drawn shapes (if possible).
     * @param {DrawConfig} drawConfig - The default draw config to use for CSS fallback styles.
     * @param {boolean=} isSecondary - (optional) Indicates if this is the primary or secondary instance. Only primary instances manage child nodes.
     * @param {SVGGElement=} gNode - (optional) Primary and seconday instances share the same &lt;g> node.
     **/
    constructor(svgNode: SVGElement, offset: XYCoords, scale: XYCoords, canvasSize: XYDimension, fillShapes: boolean, drawConfig: DrawConfig, isSecondary?: boolean, gNode?: SVGGElement, bufferGNode?: SVGGElement, nodeDefs?: SVGDefsElement, bufferNodeDefs?: SVGDefsElement);
    /**
     * Adds a default style defintion based on the passed DrawConfig.
     * Twaek the draw config to change default colors or line thicknesses.
     *
     * @param {DrawConfig} drawConfig
     */
    private addStyleDefs;
    /**
     * Adds the internal <defs> node.
     */
    private addDefsNode;
    /**
     * This is a simple way to include custom CSS class mappings to the style defs of the generated SVG.
     *
     * The mapping should be of the form
     *   [style-class] -> [style-def-string]
     *
     * Example:
     *   "rect.red" -> "fill: #ff0000; border: 1px solid red"
     *
     * @param {Map<string,string>} defs
     */
    addCustomStyleDefs(defs: Map<string, string>): void;
    /**
     * Retieve an old (cached) element.
     * Only if both – key and nodeName – match, the element will be returned (null otherwise).
     *
     * @method findElement
     * @private
     * @memberof drawutilssvg
     * @instance
     * @param {UID} key - The key of the desired element (used when re-drawing).
     * @param {string} nodeName - The expected node name.
     */
    private findElement;
    /**
     * Create a new DOM node &lt;svg&gt; in the SVG namespace.
     *
     * @method createSVGNode
     * @private
     * @memberof drawutilssvg
     * @instance
     * @param {string} nodeName - The node name (tag-name).
     * @return {SVGElement} A new element in the SVG namespace with the given node name.
     */
    private createSVGNode;
    /**
     * Make a new SVG node (or recycle an old one) with the given node name (circle, path, line, rect, ...).
     *
     * This function is used in draw cycles to re-use old DOM nodes (in hope to boost performance).
     *
     * @method makeNode
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {string} nodeName - The node name.
     * @return {SVGElement} The new node, which is not yet added to any document.
     */
    private makeNode;
    /**
     * This is the final helper function for drawing and filling stuff and binding new
     * nodes to the SVG document.
     * It is not intended to be used from the outside.
     *
     * When in draw mode it draws the current shape.
     * When in fill mode it fills the current shape.
     *
     * This function is usually only called internally.
     *
     * @method _bindFillDraw
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {SVGElement} node - The node to draw/fill and bind.
     * @param {string} className - The class name(s) to use.
     * @param {string} color - A stroke/fill color to use.
     * @param {number=1} lineWidth - (optional) A line width to use for drawing (default is 1).
     * @return {SVGElement} The node itself (for chaining).
     */
    private _bindFillDraw;
    /**
     * Bind this given node to a parent. If no parent is passed then the global
     * node buffer will be used.
     *
     * @method _bindNode
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {SVGElement} node - The SVG node to bind.
     * @param {SVGElement=} bindingParent - (optional) You may pass node other than the glober buffer node.
     * @returns {SVGElement} The passed node itself.
     */
    private _bindNode;
    /**
     * Add custom CSS class names and the globally defined CSS classname to the
     * given node.
     *
     * @method addCSSClasses
     * @private
     * @instance
     * @memberof drawutilssvg
     * @param {SVGElement} node - The SVG node to bind.
     * @param {string} className - The additional custom classname to add.
     * @returns {void}
     */
    private _addCSSClasses;
    private _configureNode;
    /**
     * Sets the size and view box of the document. Call this if canvas size changes.
     *
     * @method setSize
     * @instance
     * @memberof drawutilssvg
     * @param {XYDimension} canvasSize - The new canvas size.
     */
    setSize(canvasSize: XYDimension): void;
    /**
     * Creates a 'shallow' (non deep) copy of this instance. This implies
     * that under the hood the same gl context and gl program will be used.
     */
    copyInstance(fillShapes: boolean): drawutilssvg;
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
     * @instance
     * @memberof drawutilssvg
     **/
    setCurrentId(uid: UID | null): void;
    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     *
     * @name setCurrentClassName
     * @method
     * @param {string|null} className - A class name for further custom use cases.
     * @instance
     * @memberof drawutilssvg
     **/
    setCurrentClassName(className: string | null): void;
    /**
     * Called before each draw cycle.
     * This is required for compatibility with other draw classes in the library.
     *
     * @name beginDrawCycle
     * @method
     * @param {UID=} uid - (optional) A UID identifying the currently drawn element(s).
     * @instance
     * @memberof drawutilssvg
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
     * A private helper method to apply stroke options to the current
     * context.
     * @param {StrokeOptions=} strokeOptions -
     */
    private applyStrokeOpts;
    private _x;
    private _y;
    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {XYCoords} zA - The start point of the line.
     * @param {XYCoords} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=1} lineWidth? - [optional] The line's width.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    line(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     * @memberof drawutilssvg
     **/
    arrow(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, headLength?: number, strokeOptions?: StrokeOptions): SVGElement;
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
    cubicBezierArrow(startPoint: XYCoords, endPoint: XYCoords, startControlPoint: XYCoords, endControlPoint: XYCoords, color: string, lineWidth?: number, headLength?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     *
     * @return {void}
     * @instance
     * @memberof DrawLib
     **/
    arrowHead(zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, headLength?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     * @memberof drawutilssvg
     **/
    image(image: HTMLImageElement, position: XYCoords, size: XYCoords, alpha?: number): SVGElement;
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
     * @memberof drawutilssvg
     **/
    texturedPoly(textureImage: HTMLImageElement, textureSize: Bounds, polygon: Polygon, polygonPosition: XYCoords, rotation: number): SVGElement;
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
     * @memberof drawutilssvg
     */
    cubicBezier(startPoint: XYCoords, endPoint: XYCoords, startControlPoint: XYCoords, endControlPoint: XYCoords, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     * @memberof drawutilssvg
     */
    cubicBezierPath(path: Array<XYCoords>, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     * @memberof drawutilssvg
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
     * @memberof drawutilssvg
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
     * @memberof drawutilssvg
     */
    dot(p: XYCoords, color: string): SVGElement;
    /**
     * Draw the given point with the specified (CSS-) color and radius 3.
     *
     * @method point
     * @param {XYCoords} p - The position to draw the point at.
     * @param {string} color - The CSS color to draw the point with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    point(p: XYCoords, color: string): SVGElement;
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
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    circle(center: XYCoords, radius: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {XYCoords} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    circleArc(center: XYCoords, radius: number, startAngle: number, endAngle: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    ellipse(center: XYCoords, radiusX: number, radiusY: number, color: string, lineWidth?: number, rotation?: number, strokeOptions?: StrokeOptions): SVGElement;
    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {XYCoords} center - The center of the square.
     * @param {number} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {SVGElement}
     * @instance
     * @memberof drawutilssvg
     */
    square(center: XYCoords, size: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     * @return {SVGElement}
     * @instance
     * @memberof drawutilssvg
     **/
    rect(position: XYCoords, width: number, height: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
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
     * @memberof drawutilssvg
     */
    grid(center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string): SVGElement;
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
     * @memberof drawutilssvg
     */
    raster(center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string): SVGElement;
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
     * @memberof drawutilssvg
     */
    diamondHandle(center: XYCoords, size: number, color: string): SVGElement;
    /**
     * Draw a square handle with the given CSS color.<br>
     * <br>
     * It is an inherent featur of the handle functions that the drawn elements are not scaled and not
     * distorted. So even if the user zooms in or changes the aspect ratio, the handles will be drawn
     * as even shaped squares.
     *
     * @method squareHandle
     * @param {XYCoords} center - The center of the square.
     * @param {XYCoords} size - The x/y-size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    squareHandle(center: XYCoords, size: number, color: string): SVGElement;
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
     * @memberof drawutilssvg
     */
    circleHandle(center: XYCoords, radius: number, color: string): SVGElement;
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
     * @memberof drawutilssvg
     */
    crosshair(center: XYCoords, radius: number, color: string, lineWidth?: number): SVGElement;
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
    cross(center: XYCoords, radius: number, color: string, lineWidth?: number): SVGElement;
    /**
     * Draw a polygon.
     *
     * @method polygon
     * @param {Polygon} polygon - The polygon to draw.
     * @param {string} color - The CSS color to draw the polygon with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    polygon(polygon: Polygon, color: string, lineWidth?: number): SVGElement;
    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {XYCoords[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
     *
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    polyline(vertices: Array<XYCoords>, isOpen: boolean, color: string, lineWidth?: number, strokeOptions?: StrokeOptions): SVGElement;
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
    }): SVGElement;
    /**
     * Draw a non-scaling text label at the given position.
     *
     * @method label
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians.
     * @param {string="black"} color - The color to use (default is black).
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     */
    label(text: string, x: number, y: number, rotation?: number, color?: string): SVGElement;
    /**
     * Draw an SVG-like path given by the specified path data.
     *
     * @method path
     * @param {SVGPathData} pathData - An array of path commands and params.
     * @param {string=null} color - (optional) The color to draw this path with (default is null).
     * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
     * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
     * @param {number=} options.dashOffset - (optional) `See StrokeOptions`.
     * @param {number=[]} options.dashArray - (optional) `See StrokeOptions`.
     *
     * @instance
     * @memberof drawutils
     * @return {R} An instance representing the drawn path.
     */
    path(pathData: SVGPathParams, color?: string, lineWidth?: number, options?: {
        inplace?: boolean;
    } & StrokeOptions): SVGElement;
    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     * @return {void}
     * @instance
     * @memberof drawutilssvg
     **/
    clear(color: string): void;
    /**
     * A private helper function to clear all SVG nodes from the &gt;g> node.
     *
     * @private
     */
    private removeAllChildNodes;
    /**
     * Create a new and empty `SVGElement` &lt;svg&gt; in the svg-namespace.
     *
     * @name createSvg
     * @static
     * @memberof drawutilssvg
     * @return SVGElement
     */
    static createSvg(): SVGElement;
    /**
     * Create a copy of the given path data. As path data only consists of strings and numbers,
     * the copy will be shallow by definition.
     *
     * @name copyPathData
     * @static
     * @memberof drawutilssvg
     */
    static copyPathData(data: SVGPathParams): SVGPathParams;
    /**
     * Transform the given path data (translate and scale. rotating is not intended here).
     *
     * @name transformPathData
     * @static
     * @memberof drawutilssvg
     * @param {SVGPathParams} data - The data to transform.
     * @param {XYCoords} offset - The translation offset (neutral is x=0, y=0).
     * @param {XYCoords} scale - The scale factors (neutral is x=1, y=1).
     */
    static transformPathData(data: SVGPathParams, offset: XYCoords, scale: XYCoords): void;
    private static nodeSupportsLineDash;
    /**
     * Creates a basic <line> node with start and end coordinates. The created node will not
     * be bound to any root node.
     *
     * @private
     * @method makeLineNode
     * @param {XYCoords} zA - The line's start position.
     * @param {XYCoords} zB - The line's start position.
     * @param {string} color - The CSS color to draw the point with.
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
     * @param {string=} classNameOverride - (optional) If nothing is passed the default classname 'path' will be used.
     * @return {SVGLineElement}
     * @instance
     * @memberof drawutilssvg
     */
    private makeLineNode;
    /**
     * Creates a basic <path> node with given path string data. The created node will not
     * be bound to any root node.
     *
     * @private
     * @method makePathNode
     * @param {string} pathString - The path data (must be a valid path data string).
     * @param {string} color - The CSS color to draw the point with.
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
     * @param {string=} classNameOverride - (optional) If nothing is passed the default classname 'path' will be used.
     * @return {SVGPathElement}
     * @instance
     * @memberof drawutilssvg
     */
    private makePathNode;
    /**
     * Creates a basic arrow head node (<path> node) at the end of the given line coordinates. The created node will not
     * be bound to any root node.
     *
     * @private
     * @method makeArrowHeadNode
     * @param {string} pathString - The path data (must be a valid path data string).
     * @param {string} color - The CSS color to draw the point with.
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @param {number=8} headLength - (optional) The length of the arrow head; if none is specified then the head will be 8 absolute units long.
     * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
     * @param {XYCoords=} arrowHeadBasePositionBuffer - (optional) If not null, then this position will contain the arrow head's start point (after execution). Some sort of OUT variable.
     * @return {SVGPathElement}
     * @instance
     * @memberof drawutilssvg
     */
    private makeArrowHeadNode;
    /**
     * Creates a basic cubic Bézier path node (<path> node) with the given cubic Bézier data. The created node will not
     * be bound to any root node.
     *
     * @private
     * @method makeCubicBezierNode
     * @param {XYCoords} startPoint - The start point of the cubic Bézier curve
     * @param {XYCoords} endPoint   - The end point the cubic Bézier curve.
     * @param {XYCoords} startControlPoint - The start control point the cubic Bézier curve.
     * @param {XYCoords} endControlPoint   - The end control point the cubic Bézier curve.
     * @param {string} color - The CSS color to draw the point with.
     * @param {number=1} lineWidth - (optional) The line width to use.
     * @param {StrokeOptions=} strokeOptions - (optional) Additional stroke options to use.
     * @param {string=} classNameOverride - (optional) If nothing is passed the default classname 'path' will be used.
     * @param {XYCoords=} arrowHeadBasePositionBuffer - (optional) If not null, then this position will contain the arrow head's start point (after execution). Some sort of OUT variable.
     * @return {SVGPathElement}
     * @instance
     * @memberof drawutilssvg
     */
    private makeCubicBezierNode;
}
