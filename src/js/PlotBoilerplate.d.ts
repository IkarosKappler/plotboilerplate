/**
 * @classdesc The main class of the PlotBoilerplate.
 *
 * @requires Vertex, Line, Vector, Polygon, PBImage, VEllipse, Circle, MouseHandler, KeyHandler, VertexAttr, CubicBezierCurve, BezierPath, Triangle, drawutils, drawutilsgl
 *
 * @author   Ikaros Kappler
 * @date     2018-10-23
 * @modified 2018-11-19 Added multi-select and multi-drag.
 * @modified 2018-12-04 Added basic SVG export.
 * @modified 2018-12-09 Extended the constructor (canvas).
 * @modified 2018-12-18 Added the config.redrawOnResize param.
 * @modified 2018-12-18 Added the config.defaultCanvas{Width,Height} params.
 * @modified 2018-12-19 Added CSS scaling.
 * @modified 2018-12-28 Removed the unused 'drawLabel' param. Added the 'enableMouse' and 'enableKeys' params.
 * @modified 2018-12-29 Added the 'drawOrigin' param.
 * @modified 2018-12-29 Renamed the 'autoCenterOffset' param to 'autoAdjustOffset'. Added the params 'offsetAdjustXPercent' and 'offsetAdjustYPercent'.
 * @modified 2019-01-14 Added params 'drawBezierHandleLines' and 'drawBezierHandlePoints'. Added the 'redraw' praam to the add() function.
 * @modified 2019-01-16 Added params 'drawHandleLines' and 'drawHandlePoints'. Added the new params to the dat.gui interface.
 * @modified 2019-01-30 Added the 'Vector' type (extending the Line class).
 * @modified 2019-01-30 Added the 'PBImage' type (a wrapper for images).
 * @modified 2019-02-02 Added the 'canvasWidthFactor' and 'canvasHeightFactor' params.
 * @modified 2019-02-03 Removed the drawBackgroundImage() function, with had no purpose at all. Just add an image to the drawables-list.
 * @modified 2019-02-06 Vertices (instace of Vertex) can now be added. Added the 'draggable' attribute to the vertex attributes.
 * @modified 2019-02-10 Fixed a draggable-bug in PBImage handling (scaling was not possible).
 * @modified 2019-02-10 Added the 'enableTouch' option (default is true).
 * @modified 2019-02-14 Added the console for debugging (setConsole(object)).
 * @modified 2019-02-19 Added two new constants: DEFAULT_CLICK_TOLERANCE and DEFAULT_TOUCH_TOLERANCE.
 * @modified 2019-02-19 Added the second param to the locatePointNear(Vertex,Number) function.
 * @modified 2019-02-20 Removed the 'loadFile' entry from the GUI as it was experimental and never in use.
 * @modified 2019-02-23 Removed the 'rebuild' function as it had no purpose.
 * @modified 2019-02-23 Added scaling of the click-/touch-tolerance with the CSS scale.
 * @modified 2019-03-23 Added JSDoc tags. Changed the default value of config.drawOrigin to false.
 * @modified 2019-04-03 Fixed the touch-drag position detection for canvas elements that are not located at document position (0,0).
 * @modified 2019-04-03 Tweaked the fit-to-parent function to work with paddings and borders.
 * @modified 2019-04-28 Added the preClear callback param (called before the canvas was cleared on redraw and before any elements are drawn).
 * @modified 2019-09-18 Added basics for WebGL support (strictly experimental).
 * @modified 2019-10-03 Added the .beginDrawCycle call in the redraw function.
 * @modified 2019-11-06 Added fetch.num, fetch.val, fetch.bool, fetch.func functions.
 * @modified 2019-11-13 Fixed an issue with the mouse-sensitive area around vertices (were affected by zoom).
 * @modified 2019-11-13 Added the 'enableMouseWheel' param.
 * @modified 2019-11-18 Added the Triangle class as a regular drawable element.
 * @modified 2019-11-18 The add function now works with arrays, too.
 * @modified 2019-11-18 Added the _handleColor helper function to determine the render color of non-draggable vertices.
 * @modified 2019-11-19 Fixed a bug in the resizeCanvas function; retina resolution was not possible.
 * @modified 2019-12-04 Added relative positioned zooming.
 * @modified 2019-12-04 Added offsetX and offsetY params.
 * @modified 2019-12-04 Added an 'Set to fullsize retina' button to the GUI config.
 * @modified 2019-12-07 Added the drawConfig for lines, polygons, ellipse, triangles, bezier curves and image control lines.
 * @modified 2019-12-08 Fixed a css scale bug in the viewport() function.
 * @modified 2019-12-08 Added the drawconfig UI panel (line colors and line widths).
 * @modified 2020-02-06 Added handling for the end- and end-control-points of non-cirular Bézier paths (was still missing).
 * @modified 2020-02-06 Fixed a drag-amount bug in the move handling of end points of Bezier paths (control points was not properly moved when non circular).
 * @modified 2020-03-28 Ported this class from vanilla-JS to Typescript.
 * @modified 2020-03-29 Fixed the enableSVGExport flag (read enableEport before).
 * @modified 2020-05-09 Included the Cirlcle class.
 * @modified 2020-06-22 Added the rasterScaleX and rasterScaleY config params.
 * @modified 2020-06-03 Fixed the selectedVerticesOnPolyon(Polygon) function: non-selectable vertices were selected too, before.
 * @modified 2020-06-06 Replacing Touchy.js by AlloyFinger.js
 * @version  1.8.2
 *
 * @file PlotBoilerplate
 * @fileoverview The main class.
 * @public
 **/
import { GUI } from "dat.gui";
import { drawutils } from "./draw";
import { drawutilsgl } from "./drawgl";
import { BezierPath } from "./BezierPath";
import { Bounds } from "./Bounds";
import { Grid } from "./Grid";
import { Polygon } from "./Polygon";
import { Vertex } from "./Vertex";
import { IDraggable, Config, Drawable, DrawConfig, IHooks, PBParams, XYCoords, XYDimension } from "./interfaces";
export declare class PlotBoilerplate {
    /** @constant {number} */
    static readonly DEFAULT_CANVAS_WIDTH: number;
    /** @constant {number} */
    static readonly DEFAULT_CANVAS_HEIGHT: number;
    /** @constant {number} */
    static readonly DEFAULT_CLICK_TOLERANCE: number;
    /** @constant {number} */
    static readonly DEFAULT_TOUCH_TOLERANCE: number;
    /**
     * A wrapper class for draggable items (mostly vertices).
     * @private
     **/
    static Draggable: {
        new (item: any, typeName: string): {
            item: any;
            typeName: string;
            vindex: number;
            pindex: number;
            pid: number;
            cindex: number;
            isVertex(): boolean;
            setVIndex(vindex: number): IDraggable;
        };
        VERTEX: string;
    };
    /**
     * @member {HTMLCanvasElement}
     * @memberof PlotBoilerplate
     * @instance
     */
    canvas: HTMLCanvasElement;
    /**
     * @member {Config}
     * @memberof PlotBoilerplate
     * @instance
     */
    config: Config;
    /**
     * @member {CanvasRenderingContext2D|WebGLRenderingContext}
     * @memberof PlotBoilerplate
     * @instance
     */
    ctx: CanvasRenderingContext2D | WebGLRenderingContext;
    /**
     * @member {drawutils|drawutilsgl}
     * @memberof PlotBoilerplate
     * @instance
     */
    draw: drawutils | drawutilsgl;
    /**
     * @member {drawutils|drawutilsgl}
     * @memberof PlotBoilerplate
     * @instance
     */
    fill: drawutils | drawutilsgl;
    /**
     * @member {DrawConfig}
     * @memberof PlotBoilerplate
     * @instance
     */
    drawConfig: DrawConfig;
    /**
     * @member {Grid}
     * @memberof PlotBoilerplate
     * @instance
     */
    grid: Grid;
    /**
     * @member {XYDimension}
     * @memberof PlotBoilerplate
     * @instance
     */
    canvasSize: XYDimension;
    /**
     * @member {Array<Vertex>}
     * @memberof PlotBoilerplate
     * @instance
     */
    vertices: Array<Vertex>;
    /**
     * @member {Array<BezierPath>}
     * @memberof PlotBoilerplate
     * @instance
     */
    paths: Array<BezierPath>;
    /**
     * @member {Poylgon}
     * @memberof PlotBoilerplate
     * @instance
     */
    selectPolygon: Polygon;
    /**
     * @member {Array<IDraggable>}
     * @memberof PlotBoilerplate
     * @instance
     */
    draggedElements: Array<IDraggable>;
    /**
     * @member {Array<Drawable>}
     * @memberof PlotBoilerplate
     * @instance
     */
    drawables: Array<Drawable>;
    /**
     * @member {Console}
     * @memberof PlotBoilerplate
     * @instance
     */
    console: Console;
    /**
     * @member {IHooks}
     * @memberof PlotBoilerplate
     * @instance
     */
    hooks: IHooks;
    /**
     * @member {KeyHandler|undefined}
     * @memberof PlotBoilerplate
     * @instance
     */
    private keyHandler;
    /**
     * The constructor.
     *
     * @constructor
     * @name PlotBoilerplate
     * @public
     * @param {object} config={} - The configuration.
     * @param {HTMLCanvasElement} config.canvas - Your canvas element in the DOM (required).
     * @param {boolean=} [config.fullSize=true] - If set to true the canvas will gain full window size.
     * @param {boolean=} [config.fitToParent=true] - If set to true the canvas will gain the size of its parent container (overrides fullSize).
     * @param {number=}  [config.scaleX=1.0] - The initial x-zoom. Default is 1.0.
     * @param {number=}  [config.scaleY=1.0] - The initial y-zoom. Default is 1.0.
     * @param {number=}  [config.offsetX=1.0] - The initial x-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {number=}  [config.offsetY=1.0] - The initial y-offset. Default is 0.0. Note that autoAdjustOffset=true overrides these values.
     * @param {boolean=} [config.rasterGrid=true] - If set to true the background grid will be drawn rastered.
     * @param {boolean=} [config.rasterScaleX=1.0] - Define the default horizontal raster scale (default=1.0).
     * @param {boolean=} [config.rasterScaleY=1.0] - Define the default vertical raster scale (default=1.0).
     * @param {number=}  [config.rasterAdjustFactor=1.0] - The exponential limit for wrapping down the grid. (2.0 means: halve the grid each 2.0*n zoom step).
     * @param {boolean=} [config.drawOrigin=false] - Draw a crosshair at (0,0).
     * @param {boolean=} [config.autoAdjustOffset=true] -  When set to true then the origin of the XY plane will
     *                         be re-adjusted automatically (see the params
     *                         offsetAdjust{X,Y}Percent for more).
     * @param {number=}  [config.offsetAdjustXPercent=50] - The x-fallback position for the origin after
     *                         resizing the canvas.
     * @param {number=}  [config.offsetAdjustYPercent=50] - The y-fallback position for the origin after
     *                         resizing the canvas.
     * @param {number=}  [config.defaultCanvasWidth=1024] - The canvas size fallback (width) if no automatic resizing
     *                         is switched on.
     * @param {number=}  [config.defaultCanvasHeight=768] - The canvas size fallback (height) if no automatic resizing
     *                         is switched on.
     * @param {number=}  [config.canvasWidthFactor=1.0] - Scaling factor (width) upon the canvas size.
     *                         In combination with cssScale{X,Y} this can be used to obtain
     *                         sub pixel resolutions for retina displays.
     * @param {number=}  [config.canvasHeightFactor=1.0] - Scaling factor (height) upon the canvas size.
     *                         In combination with cssScale{X,Y} this can be used to obtain
     *                         sub pixel resolutions for retina displays.
     * @param {number=}  [config.cssScaleX=1.0] - Visually resize the canvas (horizontally) using CSS transforms (scale).
     * @param {number=}  [config.cssScaleY=1.0] - Visually resize the canvas (vertically) using CSS transforms (scale).
     * @param {boolan=}  [config.cssUniformScale=true] - CSS scale x and y obtaining aspect ratio.
     * @param {boolean=} [config.autoDetectRetina=true] - When set to true (default) the canvas will try to use the display's pixel ratio.
     * @param {string=}  [config.backgroundColor=#ffffff] - The backround color.
     * @param {boolean=} [config.redrawOnResize=true] - Switch auto-redrawing on resize on/off (some applications
     *                         might want to prevent automatic redrawing to avoid data loss from the draw buffer).
     * @param {boolean=} [config.drawBezierHandleLines=true] - Indicates if Bézier curve handles should be drawn (used for
     *                         editors, no required in pure visualizations).
     * @param {boolean=} [config.drawBezierHandlePoints=true] - Indicates if Bézier curve handle points should be drawn.
     * @param {function=} [config.preClear=null] - A callback function that will be triggered just before the
     *                         draw function clears the canvas (before anything else was drawn).
     * @param {function=} [config.preDraw=null] - A callback function that will be triggered just before the draw
     *                         function starts.
     * @param {function=} [config.postDraw=null] - A callback function that will be triggered right after the drawing
     *                         process finished.
     * @param {boolean=} [config.enableMouse=true] - Indicates if the application should handle mouse events for you.
     * @param {boolean=} [config.enableTouch=true] - Indicates if the application should handle touch events for you.
     * @param {boolean=} [config.enableKeys=true] - Indicates if the application should handle key events for you.
     * @param {boolean=} [config.enableMouseWheel=true] - Indicates if the application should handle mouse wheel events for you.
     * @param {boolean=} [config.enableGL=false] - Indicates if the application should use the experimental WebGL features (not recommended).
     * @param {boolean=} [config.enableSVGExport=true] - Indicates if the SVG export should be enabled (default is true).
     *                                                   Note that changes from the postDraw hook might not be visible in the export.
     */
    constructor(config: PBParams);
    /**
     * This function opens a save-as file dialog and – once an output file is
     * selected – stores the current canvas contents as an SVG image.
     *
     * It is the default hook for saving files and can be overwritten.
     *
     * @method _saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    private static _saveFile;
    /**
     * This function sets the canvas resolution to factor 2.0 (or the preferred pixel ratio of your device) for retina displays.
     * Please not that in non-GL mode this might result in very slow rendering as the canvas buffer size may increase.
     *
     * @method _setToRetina
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    private _setToRetina;
    /**
     * Set the current zoom and draw offset to fit the given bounds.
     *
     * This method currently restores the aspect zoom ratio.
     *
     **/
    fitToView(bounds: Bounds): void;
    /**
     * Set the console for this instance.
     *
     * @method setConsole
     * @param {Console} con - The new console object (default is window.console).
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    setConsole(con: Console): void;
    /**
     * Update the CSS scale for the canvas depending onf the cssScale{X,Y} settings.<br>
     * <br>
     * This function is usually only used inernally.
     *
     * @method updateCSSscale
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     * @private
     **/
    private updateCSSscale;
    /**
     * Add a drawable object.<br>
     * <br>
     * This must be either:<br>
     * <pre>
     *  * a Vertex
     *  * a Line
     *  * a Vector
     *  * a VEllipse
     *  * a Circle
     *  * a Polygon
     *  * a Triangle
     *  * a BezierPath
     *  * a BPImage
     * </pre>
     *
     * @param {Drawable|Drawable[]} drawable - The drawable (of one of the allowed class instance) to add.
     * @param {boolean} [redraw=true] - If true the function will trigger redraw after the drawable(s) was/were added.
     * @method add
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    add(drawable: Drawable | Array<Drawable>, redraw?: boolean): void;
    /**
     * Remove a drawable object.<br>
     * <br>
     * This must be either:<br>
     * <pre>
     *  * a Vertex
     *  * a Line
     *  * a Vector
     *  * a VEllipse
     *  * a Circle
     *  * a Polygon
     *  * a BezierPath
     *  * a BPImage
     *  * a Triangle
     * </pre>
     *
     * @param {Object} drawable - The drawable (of one of the allowed class instance) to remove.
     * @param {boolean} [redraw=false]
     * @method remove
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    remove(drawable: Drawable, redraw?: boolean): void;
    /**
     * Remove a vertex from the vertex list.<br>
     *
     * @param {Vertex} vert - The vertex to remove.
     * @param {boolean} [redraw=false]
     * @method removeVertex
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    removeVertex(vert: Vertex, redraw?: boolean): void;
    /**
     * Draw the grid with the current config settings.<br>
     *
     * This function is usually only used internally.
     *
     * @method drawGrid
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawGrid(): void;
    /**
     * Draw the origin with the current config settings.<br>
     *
     * This function is usually only used internally.
     *
     * @method drawOrigin
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawOrigin(): void;
    /**
     * This is just a tiny helper function to determine the render color of vertices.
     **/
    _handleColor(h: Vertex, color: string): string;
    /**
     * Draw all drawables.
     *
     * This function is usually only used internally.
     *
     * @method drawDrawables
     * @private
     * @param {number} renderTime - The current render time. It will be used to distinct
     *                              already draw vertices from non-draw-yet vertices.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawDrawables(renderTime: number): void;
    /**
     * Draw the select-polygon (if there is one).
     *
     * This function is usually only used internally.
     *
     * @method drawSelectPolygon
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawSelectPolygon(): void;
    /**
     * Draw all vertices that were not yet drawn with the given render time.<br>
     * <br>
     * This function is usually only used internally.
     *
     * @method drawVertices
     * @private
     * @param {number} renderTime - The current render time. It is used to distinct
     *                              already draw vertices from non-draw-yet vertices.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    drawVertices(renderTime: number): void;
    /**
     * Trigger redrawing of all objects.<br>
     * <br>
     * Usually this function is automatically called when objects change.
     *
     * @method redraw
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    redraw(): void;
    /**
     * This function clears the canvas with the configured background color.<br>
     * <br>
     * This function is usually only used internally.
     *
     * @method clear
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    clear(): void;
    /**
     * Clear the selection.<br>
     * <br>
     * This function is usually only used internally.
     *
     * @method clearSelection
     * @private
     * @param {boolean=} [redraw=false] - Indicates if the redraw function should be triggered.
     * @instance
     * @memberof PlotBoilerplate
     * @return {PlotBoilerplate} this
     **/
    clearSelection(redraw?: boolean): this;
    /**
     * Get the current view port.
     *
     * @method viewPort
     * @instance
     * @memberof PlotBoilerplate
     * @return {Bounds} The current viewport.
     **/
    viewport(): Bounds;
    /**
     * Trigger the saveFile.hook.
     *
     * @method saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    saveFile(): void;
    /**
     * Get the available inner space of the given container.
     *
     * Size minus padding minus border.
     **/
    private getAvailableContainerSpace;
    /**
     * This function resizes the canvas to the required settings (toggles fullscreen).<br>
     * <br>
     * This function is usually only used internally but feel free to call it if resizing required.
     *
     * @method resizeCanvas
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    resizeCanvas(): void;
    /**
     *  Add all vertices inside the polygon to the current selection.<br>
     *
     * @method selectVerticesInPolygon
     * @param {Polygon} polygon - The polygonal selection area.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    selectVerticesInPolygon(polygon: Polygon): void;
    /**
     * (Helper) Locates the point (index) at the passed position. Using an internal tolerance of 7 pixels.
     *
     * The result is an object { type : 'bpath', pindex, cindex, pid }
     *
     * Returns false if no point is near the passed position.
     *
     * @method locatePointNear
     * @param {Vertex} point - The polygonal selection area.
     * @param {number=} [tolerance=7] - The tolerance to use identtifying vertices.
     * @private
     * @return {IDraggable} Or false if none found.
     **/
    private locatePointNear;
    /**
     * Handle left-click event.<br>
     *
     * @method handleClick
     * @param {number} x - The click X position on the canvas.
     * @param {number} y - The click Y position on the canvas.
     * @private
     * @return {void}
     **/
    private handleClick;
    /**
     * Transforms the given x-y-(mouse-)point to coordinates respecting the view offset
     * and the zoom settings.
     *
     * @method transformMousePosition
     * @param {number} x - The x position relative to the canvas.
     * @param {number} y - The y position relative to the canvas.
     * @instance
     * @memberof PlotBoilerplate
     * @return {object} A simple object <pre>{ x : Number, y : Number }</pre> with the transformed coordinates.
     **/
    transformMousePosition(x: number, y: number): XYCoords;
    /**
     * (Helper) The mouse-down handler.
     *
     * It selects vertices for dragging.
     *
     * @method mouseDownHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    private mouseDownHandler;
    /**
     * The mouse-drag handler.
     *
     * It moves selected elements around or performs the panning if the ctrl-key if
     * hold down.
     *
     * @method mouseDownHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    private mouseDragHandler;
    /**
     * The mouse-up handler.
     *
     * It clears the dragging-selection.
     *
     * @method mouseUpHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    private mouseUpHandler;
    /**
     * The mouse-wheel handler.
     *
     * It performs the zooming.
     *
     * @method mouseWheelHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    private mouseWheelHandler;
    /**
     * Set the new draw offset.
     *
     * Note: the function will not trigger any redraws.
     *
     * @param {Vertex} newOffset - The new draw offset to use.
     **/
    private setOffset;
    /**
    * Set a new zoom value (and re-adjust the draw offset).
    *
    * Note: the function will not trigger any redraws.
    *
    * @param {number} zoomFactorX - The new horizontal zoom value.
    * @param {number} zoomFactorY - The new vertical zoom value.
    * @param {Vertex} interactionPos - The position of mouse/touch interaction.
    **/
    private setZoom;
    private installInputListeners;
    /**
     * Creates a control GUI (a dat.gui instance) for this
     * plot boilerplate instance.
     *
     * @method createGUI
     * @instance
     * @memberof PlotBoilerplate
     * @return {dat.gui.GUI}
     **/
    createGUI(): GUI;
    /**
     * A set of helper functions.
     * @private
     **/
    static utils: {
        /**
         * Merge the elements in the 'extension' object into the 'base' object based on
         * the keys of 'base'.
         *
         * @param {Object} base
         * @param {Object} extension
         * @return {Object} base extended by the new attributes.
         **/
        safeMergeByKeys: (base: Object, extension: Object) => Object;
        /**
         * A helper function to scale elements (usually the canvas) using CSS.
         *
         * transform-origin is at (0,0).
         *
         * @param {HTMLElement} element - The DOM element to scale.
         * @param {number} scaleX The - X scale factor.
         * @param {number} scaleY The - Y scale factor.
         * @return {void}
         **/
        setCSSscale: (element: HTMLElement, scaleX: number, scaleY: number) => void;
        fetch: {
            /**
             * A helper function to the the object property value specified by the given key.
             *
             * @param {any} object   - The object to get the property's value from. Must not be null.
             * @param {string} key      - The key of the object property (the name).
             * @param {any}    fallback - A default value if the key does not exist.
             **/
            val: (obj: any, key: string, fallback: any) => any;
            /**
             * A helper function to the the object property numeric value specified by the given key.
             *
             * @param {any}    object   - The object to get the property's value from. Must not be null.
             * @param {string} key      - The key of the object property (the name).
             * @param {number} fallback - A default value if the key does not exist.
             * @return {number}
             **/
            num: (obj: any, key: string, fallback: number) => any;
            /**
             * A helper function to the the object property boolean value specified by the given key.
             *
             * @param {any}     object   - The object to get the property's value from. Must not be null.
             * @param {string}  key      - The key of the object property (the name).
             * @param {boolean} fallback - A default value if the key does not exist.
             * @return {boolean}
             **/
            bool: (obj: any, key: string, fallback: boolean) => any;
            /**
             * A helper function to the the object property function-value specified by the given key.
             *
             * @param {any}      object   - The object to get the property's value from. Must not be null.
             * @param {string}   key      - The key of the object property (the name).
             * @param {function} fallback - A default value if the key does not exist.
             * @return {function}
             **/
            func: (obj: any, key: string, fallback: (...args: any[]) => any) => any;
        };
        /**
         * Installs vertex listeners to the path's vertices so that controlpoints
         * move with their path points when dragged.
         *
         * Bézier path points with attr.bezierAutoAdjust==true will have their
         * two control points audo-updated if moved, too (keep path connections smooth).
         *
         * @param {BezierPath} bezierPath - The path to use auto-adjustment for.
         **/
        enableBezierPathAutoAdjust: (bezierPath: BezierPath) => void;
        /**
         * Removes vertex listeners from the path's vertices. This needs to be called
         * when BezierPaths are removed from the canvas.
         *
         * Sorry, this is not yet implemented.
         *
         * @param {BezierPath} bezierPath - The path to use un-auto-adjustment for.
         **/
        disableBezierPathAutoAdjust: (bezierPath: BezierPath) => void;
    };
}
