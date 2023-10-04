/**
 * @author Ikaros Kappler
 * @modified 2021-01-10 Added the `CanvasWrapper` interface.
 * @modified 2021-01-20 Added the `UID` type.
 * @modified 2021-01-25 Added the `DrawLib.setCurrentId` and `DrawLib.setCurrentClassName` functions.
 * @modified 2021-01-25 Fixed the `PBParams` interface (inluding DrawConfig).
 * @modified 2021-02-08 Changed the `PBParams` interface: no longer sub-interface of `DrawConfig` (all those attributes were un-used).
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 * @modified 2021-03-01 Added the `rotation` param to the DrawLib.ellipse(...) function.
 * @modified 2021-03-02 Added the `VEllipseSector` as to the `Drawable` type.
 * @modified 2021-03-29 Added the `draw` and `fill` params to the `preDraw` and `postDraw` function (required for full svg export support).
 * @modified 2021-03-30 Added the `endDrawCycle` function to `DrawLib`.
 * @modified 2021-05-31 Added the `drawLib.setConfiguration` function.
 * @modified 2021-05-31 Splitted the large interfaces.ts file into this one and others.
 * @modified 2021-11-12 Added `text()` params fontSize, fontFamily, rotation, textAlign.
 * @modified 2021-11-16 Added `text()` params fontWeight and fontStyle.
 * @modified 2021-11-19 Added the `color` param to the `label(...)` function.
 * @modified 2022-02-03 Added the `lineWidth` param to the `crosshair` function.
 * @modified 2022-02-03 Added the `cross(...)` function.
 * @modified 2022-07-26 Adding `alpha` to the `image(...)` function.
 * @modified 2023-02-10 The methods `setCurrentClassName` and `setCurrentId` also accept `null` now.
 * @modified 2023-09-29 Downgrading all `Vertex` param type to the more generic `XYCoords` type in these render functions: line, arrow, texturedPoly, cubicBezier, cubicBezierPath, handle, handleLine, dot, point, circle, circleArc, ellipse, grid, raster.
 * @modified 2023-09-29 Added the `headLength` parameter to the 'DrawLib.arrow()` function.
 * @modified 2023-09-29 Added the `arrowHead(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `cubicBezierArrow(...)` function to the 'DrawLib.arrow()` interface.
 * @modified 2023-09-29 Added the `lineDashes` attribute.
 * @modified 2023-09-30 Adding `strokeOptions` param to these draw function: line, arrow, cubicBezierArrow, cubicBezier, cubicBezierPath, circle, circleArc, ellipse, square, rect, polygon, polyline.
 **/

import { Bounds } from "../Bounds";
import { Polygon } from "../Polygon";
import { Vertex } from "../Vertex";
import { SVGPathParams, UID, XYCoords } from "./core";

export interface DrawLibConfiguration {
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation#types
  // compositeOperation: CanvasCompositing["globalCompositeOperation"] | null;
  // TODO: check compatibility with
  // https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
  // prettier-ignore
  blendMode?:  'source-over' | 'source-in' | 'source-out' | 'source-atop' | 'destination-over' | 'destination-in' | 'destination-out' | 'destination-atop' | 'lighter' | 'copy' | 'xor' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity' | null;
}

export type FontWeight = "normal" | "bold" | "bolder" | "lighter" | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontStyle = "normal" | "italic" | "oblique";

export interface FontOptions {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
  lineHeight?: number;
  textAlign?: CanvasRenderingContext2D["textAlign"];
  rotation?: number;
}

/**
 * Defines a line-dash configuration.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
 * and https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
 * for how line dashes work.
 *
 * Setting line-dash to empty array `[]` resets the dashing.
 */
export interface StrokeOptions {
  dashOffset?: number;
  dashArray?: Array<number>;
}

/**
 * An interface all drawing libraries must implement to be used with PlotBoilerplate.
 *
 * The generic type `R` specifies the return-types for all draw functions. Libraries might
 * want to specify their own draw result; for PlotBoilerplate `void` or `any` is fine.
 *
 * Default implementation is `draw`.
 */
export interface DrawLib<R> {
  scale: Vertex;
  offset: Vertex;
  fillShapes: boolean;

  /**
   * Set the current drawlib configuration.
   *
   * @name setConfiguration
   * @method
   * @param {DrawLibConfiguration} configuration - The new configuration settings to use for the next render methods.
   */
  setConfiguration: (configuration: DrawLibConfiguration) => void;

  // /**
  //  * Set or clear the line-dash configuration. Pass `null` for un-dashed lines.
  //  *
  //  * See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
  //  * and https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
  //  * for how line dashes work.
  //  *
  //  * Setting line-dash to empty array `[]` resets the dashing.
  //  *
  //  * @method
  //  * @param {Array<number> lineDashes - The line-dash array configuration.
  //  * @returns {void}
  //  */
  // setLineDash: (lineDashes: Array<number>) => void;

  /**
   * This method shouled be called each time the currently drawn `Drawable` changes.
   * It is used by some libraries for identifying elemente on re-renders.
   *
   * @name setCurrentId
   * @method
   * @param {UID|null} uid - A UID identifying the currently drawn element(s), or null to clear.
   **/
  setCurrentId: (uid: UID | null) => void;

  /**
   * This method shouled be called each time the currently drawn `Drawable` changes.
   * Determine the class name for further usage here.
   *
   * @name setCurrentClassName
   * @method
   * @param {string|null} className - A class name for further custom use cases.
   **/
  setCurrentClassName: (className: string | null) => void;

  /**
   * Called before each draw cycle.
   *
   * This is required for compatibility with other draw classes in the library (like drawgl).
   *
   * @name beginDrawCycle
   * @method
   * @param {number} renderTime
   * @instance
   **/
  beginDrawCycle: (renderTime: number) => R;

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
  endDrawCycle: (renderTime: number) => R;

  /**
   * Draw the line between the given two points with the specified (CSS-) color.
   *
   * @method line
   * @param {XYCoords} zA - The start point of the line.
   * @param {XYCoords} zB - The end point of the line.
   * @param {string} color - Any valid CSS color string.
   * @param {number=1} lineWidth? - (optional) The line's width.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   * @return {R}
   * @instance
   * @memberof DrawLib
   **/
  line: (zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, strokeOptopns?: StrokeOptions) => R;

  /**
   * Draw a line and an arrow at the end (zB) of the given line width the specified (CSS-) color and size.
   *
   * @method arrow
   * @param {XYCoords} zA - The start point of the arrow-line.
   * @param {XYCoords} zB - The end point of the arrow-line.
   * @param {string} color - Any valid CSS color string.
   * @param {number=1} lineWidth - (optional) The line width to use; default is 1.
   * @param {headLength=8} headLength - (optional) The length of the arrow head (default is 8 units).
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   * @return {R}
   * @instance
   * @memberof DrawLib
   **/
  arrow: (zA: XYCoords, zB: XYCoords, color: string, lineWidth?: number, headLength?: number, strokeOptopns?: StrokeOptions) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  cubicBezierArrow: (
    startPoint: XYCoords,
    endPoint: XYCoords,
    startControlPoint: XYCoords,
    endControlPoint: XYCoords,
    color: string,
    lineWidth?: number,
    headLength?: number,
    strokeOptopns?: StrokeOptions
  ) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   **/
  arrowHead: (
    zA: XYCoords,
    zB: XYCoords,
    color: string,
    lineWidth?: number,
    headLength?: number,
    strokeOptopns?: StrokeOptions
  ) => R;

  /**
   * Draw an image at the given position with the given size.<br>
   * <br>
   * Note: SVG images may have resizing issues at the moment.Draw a line and an arrow at the end (zB) of the given line with the specified (CSS-) color.
   *
   * @method image
   * @param {Image} image - The image object to draw.
   * @param {XYCoords} position - The position to draw the the upper left corner at.
   * @param {XYCoords} size - The x/y-size to draw the image with.
   * @param {number=1.0} alpha - (optional, default=0.0) The transparency (1.0=opaque, 0.0=transparent).
   * @return {R}
   * @instance
   * @memberof DrawLib
   **/
  image: (image: HTMLImageElement, position: XYCoords, size: XYCoords, alpha?: number) => R;

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
   * @memberof DrawLib
   **/
  texturedPoly: (
    textureImage: HTMLImageElement,
    textureSize: Bounds,
    polygon: Polygon,
    polygonPosition: XYCoords,
    rotation: number
  ) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  cubicBezier: (
    startPoint: XYCoords,
    endPoint: XYCoords,
    startControlPoint: XYCoords,
    endControlPoint: XYCoords,
    color: string,
    lineWidth?: number,
    strokeOptopns?: StrokeOptions
  ) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  cubicBezierPath: (path: Array<XYCoords>, color: string, lineWidth?: number, strokeOptopns?: StrokeOptions) => R;

  /**
   * Draw the given handle and handle point (used to draw interactive Bézier curves).
   *
   * The colors for this are fixed and cannot be specified.
   *
   * @method handle
   * @param {XYCoords} startPoint - The start of the handle.
   * @param {XYCoords} endPoint - The end point of the handle.
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  handle: (startPoint: XYCoords, endPoint: XYCoords) => R;

  /**
   * Draw a handle line (with a light grey).
   *
   * @method handleLine
   * @param {XYCoords} startPoint - The start point to draw the handle at.
   * @param {XYCoords} endPoint - The end point to draw the handle at.
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  handleLine: (startPoint: XYCoords, endPoint: XYCoords) => R;

  /**
   * Draw a 1x1 dot with the specified (CSS-) color.
   *
   * @method dot
   * @param {XYCoords} p - The position to draw the dot at.
   * @param {string} color - The CSS color to draw the dot with.
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  dot: (p: XYCoords, color: string) => R;

  /**
   * Draw the given point with the specified (CSS-) color and radius 3.
   *
   * @method point
   * @param {XYCoords} p - The position to draw the point at.
   * @param {XYCoords} color - The CSS color to draw the point with.
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  point: (p: XYCoords, color: string) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  circle: (center: XYCoords, radius: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions) => R;

  /**
   * Draw a circular arc (section of a circle) with the given CSS color.
   *
   * @method circleArc
   * @param {XYCoords} center - The center of the circle.
   * @param {number} radius - The radius of the circle.
   * @param {number} startAngle - The angle to start at.
   * @param {number} endAngle - The angle to end at.
   * @param {string} color - The CSS color to draw the circle with.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  circleArc: (
    center: XYCoords,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions
  ) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  ellipse: (
    center: XYCoords,
    radiusX: number,
    radiusY: number,
    color: string,
    lineWidth?: number,
    rotation?: number,
    strokeOptions?: StrokeOptions
  ) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  square: (center: XYCoords, size: number, color: string, lineWidth?: number, strokeOptions?: StrokeOptions) => R;

  /**
   * Draw a rectangle at the given left upper corner, with, height; and with the specified line width and (CSS-) color.<br>
   *
   * @method rect
   * @param {XYCoords} center - The center of the rectangle.
   * @param {number} width - The width of the rectangle.
   * @param {number} height - The height of the rectangle.
   * @param {string} color - The CSS color to draw the rectangle with.
   * @param {number=} lineWidth - (optional) The line width to use; default is 1.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  rect: (
    upperLeft: XYCoords,
    width: number,
    height: number,
    color: string,
    lineWidth?: number,
    strokeOptions?: StrokeOptions
  ) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  grid: (center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  raster: (center: XYCoords, width: number, height: number, sizeX: number, sizeY: number, color: string) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  diamondHandle: (center: XYCoords, size: number, color: string) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  squareHandle: (center: XYCoords, size: number, color: string) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  circleHandle: (center: XYCoords, size: number, color: string) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  crosshair: (center: XYCoords, radius: number, color: string, lineWidth?: number) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  cross: (center: XYCoords, radius: number, color: string, lineWidth?: number) => R;

  /**
   * Draw a polygon.
   *
   * @method polygon
   * @param {Polygon} polygon - The polygon to draw.
   * @param {string} color - The CSS color to draw the polygon with.
   * @param {number=} lineWidth - The line width to draw this polygon with.
   * @param {StrokeOptions=} strokeOptions - (optional) Stroke settings to use.
   *
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  polygon: (polygon: Polygon, color: string, lineWidth?: number, strokeOptions?: StrokeOptions) => R;

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
   * @return {R}
   * @instance
   * @memberof DrawLib
   */
  polyline: (vertices: Array<XYCoords>, isOpen: boolean, color: string, lineWidth?: number, strokeOptions?: StrokeOptions) => R;

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
   * @memberof DrawLib
   */
  text: (text: string, x: number, y: number, options?: FontOptions) => R;

  /**
   * Draw a non-scaling text label at the given absolute position.
   *
   * @method label
   * @param {string} text - The text to draw.
   * @param {number} x - The x-position to draw the text at.
   * @param {number} y - The y-position to draw the text at.
   * @param {number=} rotation - The (aoptional) rotation in radians.
   * @param {string="black"} color - The color to use (default is black).
   * @return {void}
   * @instance
   * @memberof DrawLib
   */
  label: (text: string, x: number, y: number, rotation?: number, color?: string) => R;

  /**
   * Draw an SVG-like path given by the specified path data.
   *
   * @method path
   * @param {SVGPathData} pathData - An array of path commands and params.
   * @param {string=null} color - (optional) The color to draw this path with (default is null).
   * @param {number=1} lineWidth - (optional) the line width to use (default is 1).
   * @param {boolean=false} options.inplace - (optional) If set to true then path transforamtions (scale and translate) will be done in-place in the array. This can boost the performance.
   * @param {number=} options.dashOffset - See `StrokeOptions`.
   * @param {number[]=} options.dashArray - See `StrokeOptions`.
   *
   * @instance
   * @memberof DrawLib
   * @return {R} An instance representing the drawn path.
   */
  path: (pathData: SVGPathParams, color?: string, lineWidth?: number, options?: { inplace?: boolean } & StrokeOptions) => R;

  /**
   * Due to gl compatibility there is a generic 'clear' function required
   * to avoid accessing the context object itself directly.
   *
   * This function just fills the whole canvas with a single color.
   *
   * @param {string} color - The color to clear with.
   **/
  clear: (color: string) => R;
}
