/**
 * @author Ikaros Kappler
 * @modified 2021-01-10 Added the `CanvasWrapper` interface.
 * @modified 2021-01-20 Added the `UID` type.
 * @modified 2021-01-25 Added the `DrawLib.setCurrentId` and `DrawLib.setCurrentClassName` functions.
 * @modified 2021-01-25 Fixed the `PBParams` interface (inluding DrawConfig).
 * @modified 2021-02-08 Changed the `PBParams` interface: no longer sub-interface of `DrawConfig` (all those attributes were un-used).
 * @modified 2021-02-22 Added the `path` drawing function to draw SVG path data.
 **/

import { Vertex } from "./Vertex";
import { Vector } from "./Vector";
import { Triangle } from "./Triangle";
import { PBImage } from "./PBImage";
import { VEllipse } from "./VEllipse";
import { Circle } from "./Circle";
import { CircleSector } from "./CircleSector";
import { Polygon } from "./Polygon";
import { BezierPath } from "./BezierPath";
import { Line } from "./Line";
import { PlotBoilerplate } from "./PlotBoilerplate";


/**
 * @classdesc Coordinates (x,y) on the plane.
 *
 * @interface
 * @class
 * @name XYCoords
 **/
export interface XYCoords {
    x : number;
    y : number;
}


/**
 * @classdesc Object with `width` and `height`.
 *
 * @interface
 * @name XYDimension
 */
export interface XYDimension {
    width : number;
    height: number;
}


/**
 * @typedef {Object} IBounds
 * @property {XYCoords} min The upper left position.
 * @property {XYCoords} max The lower right position;.
 */
export interface IBounds {
    min : XYCoords;
    max : XYCoords;
}


/**
 * The types that can be drawn and thus added to the draw queue.
 */
export type Drawable = Vertex | Vector | Triangle | Circle | CircleSector | PBImage | VEllipse | Polygon | BezierPath | Line;


/**
 * A unique identifier (UID) to tell drawables apart in a performant manner.
 */
export type UID = string;


/**
 * This is used to wrap 2d/gl/svg canvas elements together.
 */
export interface CanvasWrapper {
    setSize : ( width : number, height : number ) => void;
    element : HTMLCanvasElement | SVGElement;
}
/**
 * The config that's used by PB.
 */
export interface Config {
    canvas : HTMLCanvasElement | string;   //  Your canvas element in the DOM (required).
    fullSize?: boolean;           // If set to true the canvas will gain full window size.
    fitToParent?: boolean;        // If set to true the canvas will gain the size of its parent container (overrides fullSize).
    scaleX?:number;               // The initial x-zoom. Default is 1.0.
    scaleY?:number;               // The initial y-zoom. Default is 1.0.
    offsetX?: number;             // The initial x-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
    offsetY?: number;             // The initial y-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values. 
    rasterGrid?: boolean;         // If set to true the background grid will be drawn rastered.
    rasterScaleX?: number;        // Define the default horizontal raster scale (default=1.0).
    rasterScaleY?: number;        // Define the default vertical raster scale (default=1.0).
    rasterAdjustFactor?: number;  // The exponential limit for wrapping down the grid. (2.0 means: halve the grid each 2.0*n zoom step).
    drawOrigin?: boolean;         // Draw a crosshair at (0,0).
    autoAdjustOffset?: boolean;   //  When set to true then the origin of the XY plane will
                                  // be re-adjusted automatically (see the params
	                          // offsetAdjust{X,Y}Percent for more).
    offsetAdjustXPercent?: number; // The x-fallback position for the origin after
                                   // resizing the canvas.
    offsetAdjustYPercent?: number; // The y-fallback position for the origin after
                                   // resizing the canvas.
    defaultCanvasWidth?: number;  //  The canvas size fallback (width) if no automatic resizing
                                  // is switched on. 
    defaultCanvasHeight?: number; //  The canvas size fallback (height) if no automatic resizing
                                  // is switched on. 
    canvasWidthFactor?: number;   // Scaling factor (width) upon the canvas size.
                                  // In combination with cssScale{X,Y} this can be used to obtain
                                  // sub pixel resolutions for retina displays.
    canvasHeightFactor?: number;  // Scaling factor (height) upon the canvas size.
                                  // In combination with cssScale{X,Y} this can be used to obtain
                                  // sub pixel resolutions for retina displays.
    cssScaleX?: number;           // Visually resize the canvas (horizontally) using CSS transforms (scale).
    cssScaleY?: number;           // Visually resize the canvas (vertically) using CSS transforms (scale).
    cssUniformScale?: boolean;    // CSS scale x and y obtaining aspect ratio.
    backgroundColor?: string;     // The backround color.
    redrawOnResize?: boolean;     //  Switch auto-redrawing on resize on/off (some applications
                                  // might want to prevent automatic redrawing to avoid data loss from the draw buffer).
    preClear?: ()=>void;               // A callback function that will be triggered just before the
                                  //    draw function clears the canvas (before anything else was drawn).
    preDraw?: ()=>void;           // A callback function that will be triggered just before the draw
                                  //    function starts.
    postDraw?: ()=>void;          // A callback function that will be triggered right after the drawing
                                  //   process finished.
    enableMouse?: boolean;        // Indicates if the application should handle mouse events for you.
    enableTouch?: boolean;        // Indicates if the application should handle touch events for you.
    enableKeys?: boolean;         // Indicates if the application should handle key events for you.
    enableMouseWheel?: boolean;   // Indicates if the application should handle mouse wheel events for you.
    enableGL?: boolean;           // Indicates if the application should use the experimental WebGL features (not recommended).
    enableSVGExport?: boolean;    // Indicates if the SVG export should be enabled (default is true). 
    // Note that changes from the postDraw hook might not be visible in the export.
    saveFile? : ()=>void;         // When called the save-file dialog will be triggered.
    setToRetina? : ()=>void;      // When called the resolution will be set to retina.

    autoDetectRetina? : boolean;  // When set to true (default) the canvas will try to use the display's pixel ratio.
}

/**
 * For initialization the constructor needs a mix of config and draw-settings.
 */
export interface PBParams extends Config { // , DrawConfig { 
    // No additional attributes, just merge two interfaces.
}

export interface DrawSettings {
    color : string;
    lineWidth : number;
}

export interface DrawConfig {
    drawVertices : boolean;
    drawBezierHandleLines?: boolean;   // Indicates if Bézier curve handles should be drawn (used for
                                       // editors, no required in pure visualizations).
    drawBezierHandlePoints?: boolean;  // Indicates if Bézier curve handle points should be drawn.
    drawHandleLines : boolean;
    drawHandlePoints : boolean;
    drawGrid: boolean;
    bezier : {
	color : string;
	lineWidth : number;
	handleLine : DrawSettings;
    },
    polygon : DrawSettings;
    triangle : DrawSettings;
    ellipse : DrawSettings;
    circle : DrawSettings;
    circleSector : DrawSettings;
    vertex : DrawSettings;
    selectedVertex : DrawSettings;
    line : DrawSettings;
    vector : DrawSettings;
    image : DrawSettings;
}

/** This is a fix for the problem, that the constructor's "name" attribute is not
 * visible in ES6:
 *   >> The 'name' property is part of ES6 that's why you don't see it in lib.d.ts.
 *   >> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
 * ... does this collide with anything?
 */
export interface SVGSerializable {

    /**
     * Required to generate proper CSS classes and other class related IDs.
     **/
    readonly className : string;
    
    /**
     * Convert this vertex to SVG code.
     *
     * @method toSVGString
     * @param {object=} options - An optional set of options, like 'className'.
     * @return {string} A string representing the SVG code for this vertex.
     * @instance
     * @memberof Vertex
     **/
    toSVGString : ( options:{ className?:string } ) => string;
}

/**
 * A type for SVG &lt;path d="..." /> params.
 * Example: [ 'A':string, radiusx:number, radiusy:number, rotation:number, largeArcFlag=1|0, sweepFlag=1|0, endx:number, endy:number ]
 */
export type SVGPathParams = Array<string|number>;

export interface IHooks {
    saveFile: (pb:PlotBoilerplate)=>void;
}

/**
 * A wrapper class/interface for draggable items (mostly vertices).
 * @private
 **/
export interface IDraggable {
    item:any;
    typeName:string;
    vindex:number;   // Vertex-index
    pindex:number;   // Point-index (on path)
    pid:number;      // Point-ID (on curve)
    cindex:number;   // Curve-index
    isVertex():boolean;
    setVIndex(vindex:number):IDraggable;
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
    scale:Vertex;
    offset:Vertex;
    fillShapes:boolean;

    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * It is used by some libraries for identifying elemente on re-renders.
     * 
     * @name setCurrentId
     * @method 
     * @param {UID|null} uid - A UID identifying the currently drawn element(s), or null to clear.
     **/
    setCurrentId : ( uid: UID | undefined ) => void;

    /**
     * This method shouled be called each time the currently drawn `Drawable` changes.
     * Determine the class name for further usage here.
     * 
     * @name setCurrentClassName
     * @method 
     * @param {string} className - A class name for further custom use cases.
     **/
    setCurrentClassName : ( className: string|undefined ) => void;
    
    /**
     * Called before each draw cycle.
     *
     * This is required for compatibility with other draw classes in the library (like drawgl).
     * 
     * @method
     * @param {number} renderTime
     * @instance
     **/
    beginDrawCycle : ( renderTime:number ) => R;

    /**
     * Draw the line between the given two points with the specified (CSS-) color.
     *
     * @method line
     * @param {Vertex} zA - The start point of the line.
     * @param {Vertex} zB - The end point of the line.
     * @param {string} color - Any valid CSS color string.
     * @param {number=1} lineWidth? - [optional] The line's width.
     * @return {void}
     * @instance
     * @memberof drawutils
     **/
    line : ( zA:Vertex, zB:Vertex, color:string, lineWidth?:number ) => R;


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
    arrow : ( zA:Vertex, zB:Vertex, color:string, lineWidth?:number ) => R;


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
    image : ( image:HTMLImageElement, position:Vertex, size:Vertex ) => R;

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
    cubicBezier : ( startPoint:Vertex, endPoint:Vertex, startControlPoint:Vertex, endControlPoint:Vertex, color:string, lineWidth?:number ) => R;


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
    cubicBezierPath : ( path:Array<Vertex>, color:string, lineWidth?:number ) => R;


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
    handle : ( startPoint:Vertex, endPoint:Vertex ) => R;

    
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
    handleLine : ( startPoint:Vertex, endPoint:Vertex ) => R;

    
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
    dot : ( p:Vertex, color:string ) => R;

    
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
    point : ( p:Vertex, color:string ) => R;


    /**
     * Draw a circle with the specified (CSS-) color and radius.<br>
     * <br>
     * Note that if the x- and y- scales are different the result will be an ellipse rather than a circle.
     *
     * @method circle
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circle : ( center:Vertex, radius:number, color:string, lineWidth?:number ) => R;


    /**
     * Draw a circular arc (section of a circle) with the given CSS color.
     *
     * @method circleArc
     * @param {Vertex} center - The center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The angle to start at.
     * @param {number} endAngle - The angle to end at.
     * @param {string} color - The CSS color to draw the circle with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    circleArc : ( center:Vertex, radius:number, startAngle:number, endAngle:number, color:string, lineWidth?:number ) => R;


    /**
     * Draw an ellipse with the specified (CSS-) color and thw two radii.
     *
     * @method ellipse
     * @param {Vertex} center - The center of the ellipse.
     * @param {number} radiusX - The radius of the ellipse.
     * @param {number} radiusY - The radius of the ellipse.
     * @param {string} color - The CSS color to draw the ellipse with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    ellipse : ( center:Vertex, radiusX:number, radiusY:number, color:string, lineWidth?:number ) => R;


    /**
     * Draw square at the given center, size and with the specified (CSS-) color.<br>
     * <br>
     * Note that if the x-scale and the y-scale are different the result will be a rectangle rather than a square.
     *
     * @method square
     * @param {Vertex} center - The center of the square.
     * @param {Vertex} size - The size of the square.
     * @param {string} color - The CSS color to draw the square with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    square : ( center:Vertex, size:number, color:string, lineWidth?:number ) => R;


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
    grid : ( center:Vertex, width:number, height:number, sizeX:number, sizeY:number, color:string ) => R;


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
    raster : ( center:Vertex, width:number, height:number, sizeX:number, sizeY:number, color:string ) => R;
    

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
    diamondHandle : ( center:Vertex, size:number, color:string ) => R;


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
    squareHandle : ( center:Vertex, size:number, color:string ) => R;


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
    circleHandle : ( center:Vertex, size:number, color:string ) => R;


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
    crosshair : ( center:XYCoords, radius:number, color:string ) => R;


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
    polygon : ( polygon:Polygon, color:string, lineWidth?:number ) => R;


    /**
     * Draw a polygon line (alternative function to the polygon).
     *
     * @method polyline
     * @param {Vertex[]} vertices - The polygon vertices to draw.
     * @param {boolan}   isOpen   - If true the polyline will not be closed at its end.
     * @param {string}   color    - The CSS color to draw the polygon with.
     * @param {number=} lineWidth - (optional) The line width to use; default is 1.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    polyline : ( vertices:Array<Vertex>, isOpen:boolean, color:string, lineWidth?:number ) => R;


    /**
     * Draw a text label at the given relative position.
     *
     * @method text
     * @param {string} text - The text to draw.
     * @param {number} x - The x-position to draw the text at.
     * @param {number} y - The y-position to draw the text at.
     * @param {number=} rotation - The (optional) rotation in radians.
     * @return {void}
     * @instance
     * @memberof drawutils
     */
    text : ( text:string, x:number, y:number, options?:{color?:string}) => R;
    

    /**
     * Draw a non-scaling text label at the given absolute position.
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
    label : ( text:string, x:number, y:number, rotation:number ) => R;


    /**
     * Draw an SVG-like path given by the specified path data.
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
    path : ( pathData : SVGPathParams, color?:string, lineWidth?:number, inplace?:boolean ) => R;
        

    /**
     * Due to gl compatibility there is a generic 'clear' function required
     * to avoid accessing the context object itself directly.
     *
     * This function just fills the whole canvas with a single color.
     *
     * @param {string} color - The color to clear with.
     **/
    clear : ( color:string ) => R;

}
