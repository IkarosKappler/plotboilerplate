"use strict";
/**
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
 * @modified 2020-07-06 Replacing Touchy.js by AlloyFinger.js
 * @modified 2020-07-27 Added the getVertexNear(XYCoords,number) function
 * @modified 2020-07-27 Extended the remove(Drawable) function: vertices are now removed, too.
 * @modified 2020-07-28 Added PlotBoilerplate.revertMousePosition(number,number) –  the inverse function of transformMousePosition(...).
 * @modified 2020-07-31 Added PlotBoilerplate.getDraggedElementCount() to check wether any elements are currently being dragged.
 * @modified 2020-08-19 Added the VertexAttributes.visible attribute to make vertices invisible.
 * @modified 2020-11-17 Added pure click handling (no dragEnd and !wasMoved jiggliny any more) to the PlotBoilerplate.
 * @modified 2020-12-11 Added the `removeAll(boolean)` function.
 * @modified 2020-12-17 Added the `CircleSector` drawable.
 * @modified 2021-01-04 Avoiding multiple redraw call on adding multiple Drawables (array).
 * @modified 2021-01-08 Added param `draw:DraLib<void>` to the methods `drawVertices`, `drawGrid` and `drawSelectPolygon`.
 * @modified 2021-01-08 Added the customizable `drawAll(...)` function.
 * @modified 2021-01-09 Added the `drawDrawable(...)` function.
 * @modified 2021-01-10 Added the `eventCatcher` element (used to track mouse events on SVGs).
 * @modified 2021-01-26 Fixed SVG resizing.
 * @modified 2021-01-26 Replaced the old SVGBuilder by the new `drawutilssvg` library.
 * @modified 2021-02-08 Fixed a lot of es2015 compatibility issues.
 * @modified 2021-02-18 Adding `adjustOffset(boolean)` function.
 * @version  1.13.0
 *
 * @file PlotBoilerplate
 * @fileoverview The main class.
 * @public
 **/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotBoilerplate = void 0;
var alloyfinger_typescript_1 = require("alloyfinger-typescript");
var draw_1 = require("./draw");
var drawgl_1 = require("./drawgl");
var drawutilssvg_1 = require("./utils/helpers/drawutilssvg");
var BezierPath_1 = require("./BezierPath");
var Bounds_1 = require("./Bounds");
var Circle_1 = require("./Circle");
var CircleSector_1 = require("./CircleSector");
var Grid_1 = require("./Grid");
var KeyHandler_1 = require("./KeyHandler");
var Line_1 = require("./Line");
var MouseHandler_1 = require("./MouseHandler");
var PBImage_1 = require("./PBImage");
var Polygon_1 = require("./Polygon");
var Triangle_1 = require("./Triangle");
var VEllipse_1 = require("./VEllipse");
var Vector_1 = require("./Vector");
var Vertex_1 = require("./Vertex");
var VertexAttr_1 = require("./VertexAttr");
/**
 * @classdesc The main class of the PlotBoilerplate.
 *
 * @requires Vertex
 * @requires Line
 * @requires Vector
 * @requires Polygon
 * @requires PBImage
 * @requires VEllipse
 * @requires Circle
 * @requires MouseHandler
 * @requires KeyHandler
 * @requires VertexAttr
 * @requires CubicBezierCurve
 * @requires BezierPath
 * @requires Drawable
 * @requires DrawConfig
 * @requires IHooks
 * @requires PBParams
 * @requires Triangle
 * @requires drawutils
 * @requires drawutilsgl
 * @requires SVGSerializable
 * @requires XYCoords
 * @requires XYDimension
 */
var PlotBoilerplate = /** @class */ (function () {
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
    function PlotBoilerplate(config) {
        // This should be in some static block ...
        VertexAttr_1.VertexAttr.model = { bezierAutoAdjust: false,
            renderTime: 0,
            selectable: true,
            isSelected: false,
            draggable: true,
            visible: true
        };
        if (typeof config.canvas == 'undefined') {
            throw "No canvas specified.";
        }
        /**
         * A global config that's attached to the dat.gui control interface.
         *
         * @member {Object}
         * @memberof PlotBoilerplate
         * @instance
         */
        var f = PlotBoilerplate.utils.fetch;
        this.config = {
            canvas: config.canvas,
            fullSize: f.val(config, 'fullSize', true),
            fitToParent: f.bool(config, 'fitToParent', true),
            scaleX: f.num(config, 'scaleX', 1.0),
            scaleY: f.num(config, 'scaleY', 1.0),
            offsetX: f.num(config, 'offsetX', 0.0),
            offsetY: f.num(config, 'offsetY', 0.0),
            rasterGrid: f.bool(config, 'rasterGrid', true),
            rasterScaleX: f.num(config, 'rasterScaleX', 1.0),
            rasterScaleY: f.num(config, 'rasterScaleY', 1.0),
            rasterAdjustFactor: f.num(config, 'rasterAdjustdFactror', 2.0),
            drawOrigin: f.bool(config, 'drawOrigin', false),
            autoAdjustOffset: f.val(config, 'autoAdjustOffset', true),
            offsetAdjustXPercent: f.num(config, 'offsetAdjustXPercent', 50),
            offsetAdjustYPercent: f.num(config, 'offsetAdjustYPercent', 50),
            backgroundColor: config.backgroundColor || '#ffffff',
            redrawOnResize: f.bool(config, 'redrawOnResize', true),
            defaultCanvasWidth: f.num(config, 'defaultCanvasWidth', PlotBoilerplate.DEFAULT_CANVAS_WIDTH),
            defaultCanvasHeight: f.num(config, 'defaultCanvasHeight', PlotBoilerplate.DEFAULT_CANVAS_HEIGHT),
            canvasWidthFactor: f.num(config, 'canvasWidthFactor', 1.0),
            canvasHeightFactor: f.num(config, 'canvasHeightFactor', 1.0),
            cssScaleX: f.num(config, 'cssScaleX', 1.0),
            cssScaleY: f.num(config, 'cssScaleY', 1.0),
            cssUniformScale: f.bool(config, 'cssUniformScale', true),
            saveFile: function () { _self.hooks.saveFile(_self); },
            setToRetina: function () { _self._setToRetina(); },
            autoDetectRetina: f.bool(config, 'autoDetectRetina', true),
            enableSVGExport: f.bool(config, 'enableSVGExport', true),
            // Listeners/observers
            preClear: f.func(config, 'preClear', null),
            preDraw: f.func(config, 'preDraw', null),
            postDraw: f.func(config, 'postDraw', null),
            // Interaction
            enableMouse: f.bool(config, 'enableMouse', true),
            enableTouch: f.bool(config, 'enableTouch', true),
            enableKeys: f.bool(config, 'enableKeys', true),
            enableMouseWheel: f.bool(config, 'enableMouseWheel', true),
            // Experimental (and unfinished)
            enableGL: f.bool(config, 'enableGL', false)
        }; // END confog
        /**
         * Configuration for drawing things.
         *
         * @member {Object}
         * @memberof PlotBoilerplate
         * @instance
         */
        this.drawConfig = {
            drawVertices: true,
            drawBezierHandleLines: f.bool(config, 'drawBezierHandleLines', true),
            drawBezierHandlePoints: f.bool(config, 'drawBezierHandlePoints', true),
            drawHandleLines: f.bool(config, 'drawHandleLines', true),
            drawHandlePoints: f.bool(config, 'drawHandlePoints', true),
            drawGrid: f.bool(config, 'drawGrid', true),
            bezier: {
                color: '#00a822',
                lineWidth: 2,
                handleLine: {
                    color: 'rgba(180,180,180,0.5)',
                    lineWidth: 1
                }
            },
            polygon: {
                color: '#0022a8',
                lineWidth: 1
            },
            triangle: {
                color: '#6600ff',
                lineWidth: 1
            },
            ellipse: {
                color: '#2222a8',
                lineWidth: 1
            },
            circle: {
                color: '#22a8a8',
                lineWidth: 2
            },
            circleSector: {
                color: '#2280a8',
                lineWidth: 1
            },
            vertex: {
                color: '#a8a8a8',
                lineWidth: 1
            },
            selectedVertex: {
                color: '#c08000',
                lineWidth: 2
            },
            line: {
                color: '#a844a8',
                lineWidth: 1
            },
            vector: {
                color: '#ff44a8',
                lineWidth: 1
            },
            image: {
                color: '#a8a8a8',
                lineWidth: 1
            }
        }; // END drawConfig
        // +---------------------------------------------------------------------------------
        // | Object members.
        // +-------------------------------
        this.grid = new Grid_1.Grid(new Vertex_1.Vertex(0, 0), new Vertex_1.Vertex(50, 50));
        this.canvasSize = { width: PlotBoilerplate.DEFAULT_CANVAS_WIDTH, height: PlotBoilerplate.DEFAULT_CANVAS_HEIGHT };
        var canvasElement = typeof config.canvas == 'string'
            ? document.querySelector(config.canvas)
            : config.canvas;
        // Which renderer to use: Canvas2D, WebGL (experimental) or SVG?
        if (canvasElement.tagName.toLowerCase() === 'canvas') {
            this.canvas = canvasElement;
            this.eventCatcher = this.canvas;
            if (this.config.enableGL && typeof drawgl_1.drawutilsgl === "undefined") {
                console.warn("Cannot use webgl. Package was compiled without experimental gl support. Please use plotboilerplate-glsupport.min.js instead.");
                console.warn("Disabling GL and falling back to Canvas2D.");
                this.config.enableGL = false;
            }
            if (this.config.enableGL) {
                var ctx = this.canvas.getContext('webgl'); // webgl-experimental?
                this.draw = new drawgl_1.drawutilsgl(ctx, false);
                // PROBLEM: same instance of fill and draw when using WebGL.
                //          Shader program cannot be duplicated on the same context.
                this.fill = this.draw.copyInstance(true);
                console.warn('Initialized with experimental mode enableGL=true. Note that this is not yet fully implemented.');
            }
            else {
                var ctx = this.canvas.getContext('2d');
                this.draw = new draw_1.drawutils(ctx, false);
                this.fill = new draw_1.drawutils(ctx, true);
            }
        }
        else if (canvasElement.tagName.toLowerCase() === 'svg') {
            if (typeof drawutilssvg_1.drawutilssvg === "undefined")
                throw "The svg draw library is not yet integrated part of PlotBoilerplate. Please include ./src/js/utils/helpers/drawutils.svg into your document.";
            this.canvas = canvasElement;
            this.draw = new drawutilssvg_1.drawutilssvg(this.canvas, new Vertex_1.Vertex(), // offset
            new Vertex_1.Vertex(), // scale
            this.canvasSize, false, // fillShapes=false
            this.drawConfig, false // isSecondary=false
            );
            this.fill = this.draw.copyInstance(true); // fillShapes=true
            if (this.canvas.parentElement) {
                this.eventCatcher = document.createElement('div');
                this.eventCatcher.style.position = 'absolute';
                this.eventCatcher.style.left = '0';
                this.eventCatcher.style.top = '0';
                this.eventCatcher.style.cursor = 'pointer';
                this.canvas.parentElement.style.position = 'relative';
                this.canvas.parentElement.appendChild(this.eventCatcher);
            }
            else {
                this.eventCatcher = document.body;
            }
        }
        else {
            throw 'Element is neither a canvas nor an svg element.';
        }
        this.draw.scale.set(this.config.scaleX, this.config.scaleY);
        this.fill.scale.set(this.config.scaleX, this.config.scaleY);
        this.vertices = [];
        this.selectPolygon = null;
        this.draggedElements = [];
        this.drawables = [];
        this.console = console;
        this.hooks = {
            // This is changable from the outside
            saveFile: PlotBoilerplate._saveFile
        };
        var _self = this;
        globalThis.addEventListener('resize', function () { return _self.resizeCanvas(); });
        this.resizeCanvas();
        if (config.autoDetectRetina) {
            this._setToRetina();
        }
        this.installInputListeners();
        // Apply the configured CSS scale.
        this.updateCSSscale();
        // Init	
        this.redraw();
        // Gain focus
        this.canvas.focus();
    }
    ; // END constructor
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
    PlotBoilerplate._saveFile = function (pb) {
        if (typeof drawutilssvg_1.drawutilssvg === "undefined") {
            console.error("Cannot convert image to SVG. The svg renderer 'drawutilssvg' is missing. Did you load it?");
            return;
        }
        // Create fake SVG node
        var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // var svgNode = document.getElementById('preview-svg');
        // Draw everything to fake node.
        var tosvgDraw = new drawutilssvg_1.drawutilssvg(svgNode, pb.draw.offset, pb.draw.scale, pb.canvasSize, false, // fillShapes=false
        pb.drawConfig);
        var tosvgFill = tosvgDraw.copyInstance(true); // fillShapes=true
        tosvgDraw.beginDrawCycle(0);
        tosvgFill.beginDrawCycle(0);
        tosvgDraw.clear(pb.config.backgroundColor);
        pb.drawAll(0, tosvgDraw, tosvgFill);
        // Full support in all browsers \o/
        //    https://caniuse.com/xml-serializer
        var serializer = new XMLSerializer();
        var svgCode = serializer.serializeToString(svgNode);
        var blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" });
        // See documentation for FileSaver.js for usage.
        //    https://github.com/eligrey/FileSaver.js
        if (typeof globalThis["saveAs"] != "function")
            throw "Cannot save file; did you load the ./utils/savefile helper function and the eligrey/SaveFile library?";
        var _saveAs = globalThis["saveAs"];
        _saveAs(blob, "plotboilerplate.svg");
    };
    ;
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
    PlotBoilerplate.prototype._setToRetina = function () {
        this.config.autoDetectRetina = true;
        var pixelRatio = globalThis.devicePixelRatio || 1;
        this.config.cssScaleX = this.config.cssScaleY = 1.0 / pixelRatio; // 0.5;
        this.config.canvasWidthFactor = this.config.canvasHeightFactor = pixelRatio; // 2.0;
        this.resizeCanvas();
        this.updateCSSscale();
    };
    ;
    /**
     * Set the current zoom and draw offset to fit the given bounds.
     *
     * This method currently restores the aspect zoom ratio.
     *
     **/
    PlotBoilerplate.prototype.fitToView = function (bounds) {
        var canvasCenter = new Vertex_1.Vertex(this.canvasSize.width / 2.0, this.canvasSize.height / 2.0);
        var canvasRatio = this.canvasSize.width / this.canvasSize.height;
        var ratio = bounds.width / bounds.height;
        // Find the new draw offset
        var center = new Vertex_1.Vertex(bounds.max.x - bounds.width / 2.0, bounds.max.y - bounds.height / 2.0)
            .inv()
            .addXY(this.canvasSize.width / 2.0, this.canvasSize.height / 2.0);
        this.setOffset(center);
        if (canvasRatio < ratio) {
            var newUniformZoom = this.canvasSize.width / bounds.width;
            this.setZoom(newUniformZoom, newUniformZoom, canvasCenter);
        }
        else {
            var newUniformZoom = this.canvasSize.height / bounds.height;
            this.setZoom(newUniformZoom, newUniformZoom, canvasCenter);
        }
        this.redraw();
    };
    ;
    /**
     * Set the console for this instance.
     *
     * @method setConsole
     * @param {Console} con - The new console object (default is globalThis.console).
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.setConsole = function (con) {
        this.console = con;
    };
    ;
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
    PlotBoilerplate.prototype.updateCSSscale = function () {
        if (this.config.cssUniformScale) {
            PlotBoilerplate.utils.setCSSscale(this.canvas, this.config.cssScaleX, this.config.cssScaleX);
        }
        else {
            PlotBoilerplate.utils.setCSSscale(this.canvas, this.config.cssScaleX, this.config.cssScaleY);
        }
    };
    ;
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
    PlotBoilerplate.prototype.add = function (drawable, redraw) {
        if (Array.isArray(drawable)) {
            var arr = drawable;
            // for( var i in arr )
            for (var i = 0; i < arr.length; i++) {
                this.add(arr[i], false);
            }
        }
        else if (drawable instanceof Vertex_1.Vertex) {
            this.drawables.push(drawable);
            this.vertices.push(drawable);
        }
        else if (drawable instanceof Line_1.Line) {
            // Add some lines
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
        }
        else if (drawable instanceof Vector_1.Vector) {
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
        }
        else if (drawable instanceof VEllipse_1.VEllipse) {
            this.vertices.push(drawable.center);
            this.vertices.push(drawable.axis);
            this.drawables.push(drawable);
            drawable.center.listeners.addDragListener(function (e) {
                drawable.axis.add(e.params.dragAmount);
            });
        }
        else if (drawable instanceof Circle_1.Circle) {
            this.vertices.push(drawable.center);
            this.drawables.push(drawable);
        }
        else if (drawable instanceof CircleSector_1.CircleSector) {
            this.vertices.push(drawable.circle.center);
            this.drawables.push(drawable);
        }
        else if (drawable instanceof Polygon_1.Polygon) {
            this.drawables.push(drawable);
            // for( var i in drawable.vertices )
            for (var i = 0; i < drawable.vertices.length; i++)
                this.vertices.push(drawable.vertices[i]);
        }
        else if (drawable instanceof Triangle_1.Triangle) {
            this.drawables.push(drawable);
            this.vertices.push(drawable.a);
            this.vertices.push(drawable.b);
            this.vertices.push(drawable.c);
        }
        else if (drawable instanceof BezierPath_1.BezierPath) {
            this.drawables.push(drawable);
            var bezierPath = drawable;
            for (var i = 0; i < bezierPath.bezierCurves.length; i++) {
                if (!drawable.adjustCircular && i == 0)
                    this.vertices.push(bezierPath.bezierCurves[i].startPoint);
                this.vertices.push(bezierPath.bezierCurves[i].endPoint);
                this.vertices.push(bezierPath.bezierCurves[i].startControlPoint);
                this.vertices.push(bezierPath.bezierCurves[i].endControlPoint);
                bezierPath.bezierCurves[i].startControlPoint.attr.selectable = false;
                bezierPath.bezierCurves[i].endControlPoint.attr.selectable = false;
            }
            PlotBoilerplate.utils.enableBezierPathAutoAdjust(drawable);
        }
        else if (drawable instanceof PBImage_1.PBImage) {
            this.vertices.push(drawable.upperLeft);
            this.vertices.push(drawable.lowerRight);
            this.drawables.push(drawable);
            // Todo: think about a IDragEvent interface
            drawable.upperLeft.listeners.addDragListener(function (e) {
                drawable.lowerRight.add(e.params.dragAmount);
            });
            drawable.lowerRight.attr.selectable = false;
        }
        else {
            throw "Cannot add drawable of unrecognized type: " + (typeof drawable) + ".";
        }
        // This is a workaround for backwards compatibility when the 'redraw' param was not yet present.
        if (redraw || typeof redraw == 'undefined')
            this.redraw();
    };
    ;
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
    PlotBoilerplate.prototype.remove = function (drawable, redraw, removeWithVertices) {
        if (drawable instanceof Vertex_1.Vertex)
            this.removeVertex(drawable, false);
        for (var i = 0; i < this.drawables.length; i++) {
            if (this.drawables[i] === drawable) {
                this.drawables.splice(i, 1);
                if (removeWithVertices) {
                    // Check if some listeners need to be removed
                    if (drawable instanceof Line_1.Line) {
                        // Add some lines
                        this.removeVertex(drawable.a, false);
                        this.removeVertex(drawable.b, false);
                    }
                    else if (drawable instanceof Vector_1.Vector) {
                        this.removeVertex(drawable.a, false);
                        this.removeVertex(drawable.b, false);
                    }
                    else if (drawable instanceof VEllipse_1.VEllipse) {
                        this.removeVertex(drawable.center, false);
                        this.removeVertex(drawable.axis, false);
                    }
                    else if (drawable instanceof Circle_1.Circle) {
                        this.removeVertex(drawable.center, false);
                    }
                    else if (drawable instanceof CircleSector_1.CircleSector) {
                        this.removeVertex(drawable.circle.center, false);
                    }
                    else if (drawable instanceof Polygon_1.Polygon) {
                        // for( var i in drawable.vertices )
                        for (var i = 0; i < drawable.vertices.length; i++)
                            this.removeVertex(drawable.vertices[i], false);
                    }
                    else if (drawable instanceof Triangle_1.Triangle) {
                        this.removeVertex(drawable.a, false);
                        this.removeVertex(drawable.b, false);
                        this.removeVertex(drawable.c, false);
                    }
                    else if (drawable instanceof BezierPath_1.BezierPath) {
                        for (var i = 0; i < drawable.bezierCurves.length; i++) {
                            this.removeVertex(drawable.bezierCurves[i].startPoint, false);
                            this.removeVertex(drawable.bezierCurves[i].startControlPoint, false);
                            this.removeVertex(drawable.bezierCurves[i].endControlPoint, false);
                            if (i + 1 == drawable.bezierCurves.length) {
                                this.removeVertex(drawable.bezierCurves[i].endPoint, false);
                            }
                        }
                    }
                    else if (drawable instanceof PBImage_1.PBImage) {
                        this.removeVertex(drawable.upperLeft, false);
                        this.removeVertex(drawable.lowerRight, false);
                    }
                } // END removeWithVertices
                if (redraw)
                    this.redraw();
                return;
            }
        }
    };
    ;
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
    PlotBoilerplate.prototype.removeVertex = function (vert, redraw) {
        for (var i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i] === vert) {
                this.vertices.splice(i, 1);
                if (redraw)
                    this.redraw();
                return;
            }
        }
    };
    ;
    /**
     * Remove all elements.
     *
     * If you want to keep the vertices, pass `true`.
     *
     * @method removeAll
     * @param {boolean=false} keepVertices
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     */
    PlotBoilerplate.prototype.removeAll = function (keepVertices) {
        this.drawables = [];
        if (!Boolean(keepVertices)) {
            this.vertices = [];
        }
        this.redraw();
    };
    ;
    /**
     * Find the vertex near the given position.
     *
     * The position is the absolute vertex position, not the x-y-coordinates on the canvas.
     *
     * @param {XYCoords} position - The position of the vertex to search for.
     * @param {number} pixelTolerance - A radius around the position to include into the search.
     *                                  Note that the tolerance will be scaled up/down when zoomed.
     * @return The vertex near the given position or undefined if none was found there.
     **/
    PlotBoilerplate.prototype.getVertexNear = function (pixelPosition, pixelTolerance) {
        var p = this.locatePointNear(this.transformMousePosition(pixelPosition.x, pixelPosition.y), pixelTolerance / Math.min(this.config.cssScaleX, this.config.cssScaleY));
        if (p && p.typeName == "vertex")
            return this.vertices[p.vindex];
        return undefined;
    };
    ;
    /**
     * Draw the grid with the current config settings.<br>
     *
     * This function is usually only used internally.
     *
     * @method drawGrid
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.drawGrid = function (draw) {
        var gScale = {
            x: Grid_1.Grid.utils.mapRasterScale(this.config.rasterAdjustFactor, this.draw.scale.x) * this.config.rasterScaleX / this.config.cssScaleX,
            y: Grid_1.Grid.utils.mapRasterScale(this.config.rasterAdjustFactor, this.draw.scale.y) * this.config.rasterScaleY / this.config.cssScaleY
        };
        var gSize = { width: this.grid.size.x * gScale.x, height: this.grid.size.y * gScale.y };
        var cs = { width: this.canvasSize.width / 2, height: this.canvasSize.height / 2 };
        var offset = this.draw.offset.clone().inv();
        // console.log( "drawGrid", gScale, gSize, cs, offset );
        offset.x = (Math.round(offset.x + cs.width) / Math.round(gSize.width)) * (gSize.width) / this.draw.scale.x + (((this.draw.offset.x - cs.width) / this.draw.scale.x) % gSize.width);
        offset.y = (Math.round(offset.y + cs.height) / Math.round(gSize.height)) * (gSize.height) / this.draw.scale.y + (((this.draw.offset.y - cs.height) / this.draw.scale.x) % gSize.height);
        if (this.drawConfig.drawGrid) {
            if (this.config.rasterGrid) { // TODO: move config member to drawConfig
                draw.setCurrentId('raster');
                draw.raster(offset, this.canvasSize.width / this.draw.scale.x, (this.canvasSize.height) / this.draw.scale.y, gSize.width, gSize.height, 'rgba(0,128,255,0.125)');
            }
            else {
                draw.setCurrentId('grid');
                draw.grid(offset, this.canvasSize.width / this.draw.scale.x, (this.canvasSize.height) / this.draw.scale.y, gSize.width, gSize.height, 'rgba(0,128,255,0.095)');
            }
        }
    };
    ;
    /**
     * Draw the origin with the current config settings.<br>
     *
     * This function is usually only used internally.
     *
     * @method drawOrigin
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @private
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.drawOrigin = function (draw) {
        // Add a crosshair to mark the origin
        draw.setCurrentId('origin');
        draw.crosshair({ x: 0, y: 0 }, 10, '#000000');
    };
    ;
    /**
     * This is just a tiny helper function to determine the render color of vertices.
     **/
    PlotBoilerplate.prototype._handleColor = function (h, color) {
        return h.attr.isSelected ? this.drawConfig.selectedVertex.color : (h.attr.draggable ? color : 'rgba(128,128,128,0.5)');
    };
    /**
     * Draw all drawables.
     *
     * This function is usually only used internally.
     *
     * @method drawDrawables
     * @param {number} renderTime - The current render time. It will be used to distinct
     *                              already draw vertices from non-draw-yet vertices.
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @param {DrawLib} fill - The drawing library to use to fill areas.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.drawDrawables = function (renderTime, draw, fill) {
        for (var i in this.drawables) {
            var d = this.drawables[i];
            this.draw.setCurrentId(d.uid);
            this.fill.setCurrentId(d.uid);
            this.draw.setCurrentClassName(d.className);
            this.draw.setCurrentClassName(d.className);
            this.drawDrawable(d, renderTime, draw, fill);
        }
    };
    ;
    /**
     * Draw the given drawable.
     *
     * This function is usually only used internally.
     *
     * @method drawDrawable
     * @param {Drawable} d - The drawable to draw.
     * @param {number} renderTime - The current render time. It will be used to distinct
     *                              already draw vertices from non-draw-yet vertices.
     * @param {DrawLib} draw - The drawing library to use to draw lines.
     * @param {DrawLib} fill - The drawing library to use to fill areas.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.drawDrawable = function (d, renderTime, draw, fill) {
        if (d instanceof BezierPath_1.BezierPath) {
            for (var c in d.bezierCurves) {
                draw.cubicBezier(d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.color, this.drawConfig.bezier.lineWidth);
                if (this.drawConfig.drawBezierHandlePoints && this.drawConfig.drawHandlePoints) {
                    if (!d.bezierCurves[c].startPoint.attr.bezierAutoAdjust) {
                        if (d.bezierCurves[c].startPoint.attr.visible) {
                            draw.setCurrentId(d.uid + "_h0");
                            draw.setCurrentClassName(d.className + "-start-handle");
                            draw.diamondHandle(d.bezierCurves[c].startPoint, 7, this._handleColor(d.bezierCurves[c].startPoint, this.drawConfig.vertex.color));
                        }
                        d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                    }
                    if (!d.bezierCurves[c].endPoint.attr.bezierAutoAdjust) {
                        if (d.bezierCurves[c].endPoint.attr.visible) {
                            draw.setCurrentId(d.uid + "_h1");
                            draw.setCurrentClassName(d.className + "-end-handle");
                            draw.diamondHandle(d.bezierCurves[c].endPoint, 7, this._handleColor(d.bezierCurves[c].endPoint, this.drawConfig.vertex.color));
                        }
                        d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                    }
                    if (d.bezierCurves[c].startControlPoint.attr.visible) {
                        draw.setCurrentId(d.uid + "_h2");
                        draw.setCurrentClassName(d.className + "-start-control-handle");
                        draw.circleHandle(d.bezierCurves[c].startControlPoint, 3, this._handleColor(d.bezierCurves[c].startControlPoint, '#008888'));
                    }
                    if (d.bezierCurves[c].endControlPoint.attr.visible) {
                        draw.setCurrentId(d.uid + "_h3");
                        draw.setCurrentClassName(d.className + "-end-control-handle");
                        draw.circleHandle(d.bezierCurves[c].endControlPoint, 3, this._handleColor(d.bezierCurves[c].endControlPoint, '#008888'));
                    }
                    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                }
                else {
                    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
                    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
                }
                if (this.drawConfig.drawBezierHandleLines && this.drawConfig.drawHandleLines) {
                    draw.setCurrentId(d.uid + "_l0");
                    draw.setCurrentClassName(d.className + "-start-line");
                    draw.line(d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth);
                    draw.setCurrentId(d.uid + "_l1");
                    draw.setCurrentClassName(d.className + "-end-line");
                    draw.line(d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth);
                }
            }
        }
        else if (d instanceof Polygon_1.Polygon) {
            draw.polygon(d, this.drawConfig.polygon.color, this.drawConfig.polygon.lineWidth);
            if (!this.drawConfig.drawHandlePoints) {
                for (var i in d.vertices) {
                    d.vertices[i].attr.renderTime = renderTime;
                }
            }
        }
        else if (d instanceof Triangle_1.Triangle) {
            draw.polyline([d.a, d.b, d.c], false, this.drawConfig.triangle.color, this.drawConfig.triangle.lineWidth);
            if (!this.drawConfig.drawHandlePoints)
                d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
        }
        else if (d instanceof VEllipse_1.VEllipse) {
            if (this.drawConfig.drawHandleLines) {
                draw.setCurrentId(d.uid + "_e0");
                draw.setCurrentClassName(d.className + "-v-line");
                draw.line(d.center.clone().add(0, d.axis.y - d.center.y), d.axis, '#c8c8c8');
                draw.setCurrentId(d.uid + "_e1");
                draw.setCurrentClassName(d.className + "-h-line");
                draw.line(d.center.clone().add(d.axis.x - d.center.x, 0), d.axis, '#c8c8c8');
            }
            draw.setCurrentId(d.uid);
            draw.setCurrentClassName("" + d.className);
            draw.ellipse(d.center, 
            // Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y),
            d.radiusH(), d.radiusV(), this.drawConfig.ellipse.color, this.drawConfig.ellipse.lineWidth, d.rotation);
            if (!this.drawConfig.drawHandlePoints) {
                d.center.attr.renderTime = renderTime;
                d.axis.attr.renderTime = renderTime;
            }
        }
        else if (d instanceof Circle_1.Circle) {
            draw.circle(d.center, d.radius, this.drawConfig.circle.color, this.drawConfig.circle.lineWidth);
        }
        else if (d instanceof CircleSector_1.CircleSector) {
            draw.circleArc(d.circle.center, d.circle.radius, d.startAngle, d.endAngle, this.drawConfig.circleSector.color, this.drawConfig.circleSector.lineWidth);
        }
        else if (d instanceof Vertex_1.Vertex) {
            if (this.drawConfig.drawVertices &&
                (!d.attr.selectable || !d.attr.draggable) && d.attr.visible) {
                // Draw as special point (grey)		
                draw.circleHandle(d, 7, this.drawConfig.vertex.color);
                d.attr.renderTime = renderTime;
            }
        }
        else if (d instanceof Line_1.Line) {
            draw.line(d.a, d.b, this.drawConfig.line.color, this.drawConfig.line.lineWidth);
            if (!this.drawConfig.drawHandlePoints || !d.a.attr.selectable)
                d.a.attr.renderTime = renderTime;
            if (!this.drawConfig.drawHandlePoints || !d.b.attr.selectable)
                d.b.attr.renderTime = renderTime;
        }
        else if (d instanceof Vector_1.Vector) {
            draw.arrow(d.a, d.b, this.drawConfig.vector.color);
            if (this.drawConfig.drawHandlePoints && d.b.attr.selectable && d.b.attr.visible) {
                draw.setCurrentId(d.uid + "_h0");
                draw.setCurrentClassName(d.className + "-handle");
                draw.circleHandle(d.b, 3, '#a8a8a8');
            }
            else {
                d.b.attr.renderTime = renderTime;
            }
            if (!this.drawConfig.drawHandlePoints || !d.a.attr.selectable)
                d.a.attr.renderTime = renderTime;
            if (!this.drawConfig.drawHandlePoints || !d.b.attr.selectable)
                d.b.attr.renderTime = renderTime;
        }
        else if (d instanceof PBImage_1.PBImage) {
            if (this.drawConfig.drawHandleLines) {
                draw.setCurrentId(d.uid + "_l0");
                draw.setCurrentClassName(d.className + "-line");
                draw.line(d.upperLeft, d.lowerRight, this.drawConfig.image.color, this.drawConfig.image.lineWidth);
            }
            fill.setCurrentId(d.uid);
            fill.image(d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft));
            if (this.drawConfig.drawHandlePoints) {
                draw.setCurrentId(d.uid + "_h0");
                draw.setCurrentClassName(d.className + "-lower-right");
                draw.circleHandle(d.lowerRight, 3, this.drawConfig.image.color);
                d.lowerRight.attr.renderTime = renderTime;
            }
        }
        else {
            console.error('Cannot draw object. Unknown class.');
        }
    };
    ;
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
    PlotBoilerplate.prototype.drawSelectPolygon = function (draw) {
        // Draw select polygon?
        if (this.selectPolygon != null && this.selectPolygon.vertices.length > 0) {
            draw.setCurrentId(this.selectPolygon.uid);
            draw.polygon(this.selectPolygon, '#888888');
            draw.crosshair(this.selectPolygon.vertices[0], 3, '#008888');
        }
    };
    ;
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
    PlotBoilerplate.prototype.drawVertices = function (renderTime, draw) {
        // Draw all vertices as small squares if they were not already drawn by other objects
        for (var i in this.vertices) {
            if (this.drawConfig.drawVertices
                && this.vertices[i].attr.renderTime != renderTime
                && this.vertices[i].attr.visible) {
                draw.setCurrentId(this.vertices[i].uid);
                draw.squareHandle(this.vertices[i], 5, this._handleColor(this.vertices[i], 'rgb(0,128,192)'));
            }
        }
    };
    ;
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
    PlotBoilerplate.prototype.redraw = function () {
        var renderTime = new Date().getTime();
        if (this.config.preClear)
            this.config.preClear();
        this.clear();
        if (this.config.preDraw)
            this.config.preDraw();
        this.drawAll(renderTime, this.draw, this.fill);
        if (this.config.postDraw)
            this.config.postDraw();
    };
    ;
    /**
     * Draw all: drawables, grid, select-polygon and vertices.
     *
     * @method drawAll
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.drawAll = function (renderTime, draw, fill) {
        // Tell the drawing library that a new drawing cycle begins (required for the GL lib).
        draw.beginDrawCycle(renderTime);
        fill.beginDrawCycle(renderTime);
        this.drawGrid(draw);
        if (this.config.drawOrigin)
            this.drawOrigin(draw);
        this.drawDrawables(renderTime, draw, fill);
        this.drawVertices(renderTime, draw);
        this.drawSelectPolygon(draw);
    };
    ; // END redraw
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
    PlotBoilerplate.prototype.clear = function () {
        // Note that elements might have an alpha channel. Clear the scene first.
        this.draw.clear(this.config.backgroundColor);
    };
    ;
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
    PlotBoilerplate.prototype.clearSelection = function (redraw) {
        for (var i in this.vertices)
            this.vertices[i].attr.isSelected = false;
        if (redraw)
            this.redraw();
        return this;
    };
    ;
    /**
     * Get the current view port.
     *
     * @method viewport
     * @instance
     * @memberof PlotBoilerplate
     * @return {Bounds} The current viewport.
     **/
    PlotBoilerplate.prototype.viewport = function () {
        return new Bounds_1.Bounds(this.transformMousePosition(0, 0), this.transformMousePosition(this.canvasSize.width * this.config.cssScaleX, this.canvasSize.height * this.config.cssScaleY));
    };
    ;
    /**
     * Trigger the saveFile.hook.
     *
     * @method saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.saveFile = function () {
        this.hooks.saveFile(this);
    };
    ;
    /**
     * Internal helper function used to get 'float' properties from elements.
     * Used to determine border withs and paddings that were defined using CSS.
     */
    PlotBoilerplate.prototype.getFProp = function (elem, propName) {
        return parseFloat(globalThis.getComputedStyle(elem, null).getPropertyValue(propName));
    };
    /**
     * Get the available inner space of the given container.
     *
     * Size minus padding minus border.
     **/
    PlotBoilerplate.prototype.getAvailableContainerSpace = function () {
        var _self = this;
        var container = _self.canvas.parentNode; // Element | Document | DocumentFragment;
        // var canvas : HTMLCanvasElement = _self.canvas;
        _self.canvas.style.display = 'none';
        /* var
        padding : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding') ) || 0,
        border : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-width') ) || 0,
        pl : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-left') ) || padding,
        pr : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-right') ) || padding,
        pt : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-top') ) || padding,
        pb : number = parseFloat( globalThis.getComputedStyle(container, null).getPropertyValue('padding-bottom') ) || padding,
        bl : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-left-width') ) || border,
        br : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-right-width') ) || border,
        bt : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-top-width') ) || border,
        bb : number = parseFloat( globalThis.getComputedStyle(_self.canvas, null).getPropertyValue('border-bottom-width') ) || border;
        */
        var padding = this.getFProp(container, 'padding') || 0, border = this.getFProp(_self.canvas, 'border-width') || 0, pl = this.getFProp(container, 'padding-left') || padding, pr = this.getFProp(container, 'padding-right') || padding, pt = this.getFProp(container, 'padding-top') || padding, pb = this.getFProp(container, 'padding-bottom') || padding, bl = this.getFProp(_self.canvas, 'border-left-width') || border, br = this.getFProp(_self.canvas, 'border-right-width') || border, bt = this.getFProp(_self.canvas, 'border-top-width') || border, bb = this.getFProp(_self.canvas, 'border-bottom-width') || border;
        var w = container.clientWidth;
        var h = container.clientHeight;
        _self.canvas.style.display = 'block';
        return { width: (w - pl - pr - bl - br), height: (h - pt - pb - bt - bb) };
    };
    ;
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
    PlotBoilerplate.prototype.resizeCanvas = function () {
        var _this = this;
        var _self = this;
        var _setSize = function (w, h) {
            w *= _self.config.canvasWidthFactor;
            h *= _self.config.canvasHeightFactor;
            _self.canvasSize.width = w;
            _self.canvasSize.height = h;
            // TODO: use CanvasWrapper.setSize here?
            if (_self.canvas instanceof HTMLCanvasElement) {
                _self.canvas.width = w;
                _self.canvas.height = h;
            }
            else if (_self.canvas instanceof SVGElement) {
                _this.canvas.setAttribute('viewBox', "0 0 " + w + " " + h);
                _this.canvas.setAttribute('width', "" + w);
                _this.canvas.setAttribute('height', "" + h);
                _this.draw.setSize(_self.canvasSize); // No need to set size to this.fill (instance copy)
                // console.log(
                _this.eventCatcher.style.width = w + "px";
                _this.eventCatcher.style.height = h + "px";
            }
            else {
                console.error('Error: cannot resize canvas element because it seems neither be a HTMLCanvasElement nor an SVGElement.');
            }
            if (_self.config.autoAdjustOffset) {
                // _self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX = w*(_self.config.offsetAdjustXPercent/100); 
                // _self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY = h*(_self.config.offsetAdjustYPercent/100);
                _self.adjustOffset(false);
            }
        };
        if (_self.config.fullSize && !_self.config.fitToParent) {
            // Set editor size
            var width = globalThis.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var height = globalThis.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            _self.canvas.style.position = 'absolute';
            _self.canvas.style.width = (_self.config.canvasWidthFactor * width) + 'px';
            _self.canvas.style.height = (_self.config.canvasWidthFactor * height) + 'px';
            _self.canvas.style.top = '0px';
            _self.canvas.style.left = '0px';
            _setSize(width, height);
        }
        else if (_self.config.fitToParent) {
            // Set editor size
            _self.canvas.style.position = 'absolute';
            var space = this.getAvailableContainerSpace();
            _self.canvas.style.width = (_self.config.canvasWidthFactor * space.width) + 'px';
            _self.canvas.style.height = (_self.config.canvasHeightFactor * space.height) + 'px';
            _self.canvas.style.top = null;
            _self.canvas.style.left = null;
            _setSize(space.width, space.height);
        }
        else {
            _self.canvas.style.width = null;
            _self.canvas.style.height = null;
            _setSize(_self.config.defaultCanvasWidth, _self.config.defaultCanvasHeight);
        }
        if (_self.config.redrawOnResize)
            _self.redraw();
    };
    ;
    /**
     *  Add all vertices inside the polygon to the current selection.<br>
     *
     * @method selectVerticesInPolygon
     * @param {Polygon} polygon - The polygonal selection area.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    PlotBoilerplate.prototype.selectVerticesInPolygon = function (polygon) {
        for (var i in this.vertices) {
            if (this.vertices[i].attr.selectable && polygon.containsVert(this.vertices[i]))
                this.vertices[i].attr.isSelected = true;
        }
    };
    ;
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
    PlotBoilerplate.prototype.locatePointNear = function (point, tolerance) {
        var _self = this;
        if (typeof tolerance == 'undefined')
            tolerance = 7;
        // Apply the zoom (the tolerant area should not shrink or grow when zooming)
        tolerance /= _self.draw.scale.x;
        // Search in vertices
        // for( var vindex in _self.vertices ) {
        for (var vindex = 0; vindex < _self.vertices.length; vindex++) {
            var vert = _self.vertices[vindex];
            if ((vert.attr.draggable || vert.attr.selectable) && vert.distance(point) < tolerance) {
                // { type : 'vertex', vindex : vindex };
                return new PlotBoilerplate.Draggable(vert, PlotBoilerplate.Draggable.VERTEX).setVIndex(vindex);
            }
        }
        return null;
    };
    /**
     * Handle left-click event.<br>
     *
     * @method handleClick
     * @param {number} x - The click X position on the canvas.
     * @param {number} y - The click Y position on the canvas.
     * @private
     * @return {void}
     **/
    PlotBoilerplate.prototype.handleClick = function (e) {
        var _self = this;
        // const x:number = e.params.pos.x;
        //const y:number = e.params.pos.y;
        var p = this.locatePointNear(_self.transformMousePosition(e.params.pos.x, e.params.pos.y), PlotBoilerplate.DEFAULT_CLICK_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
        if (p) {
            _self.vertices[p.vindex].listeners.fireClickEvent(e);
            if (this.keyHandler && this.keyHandler.isDown('shift')) {
                if (p.typeName == 'bpath') {
                    var vert = _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid);
                    if (vert.attr.selectable)
                        vert.attr.isSelected = !vert.attr.isSelected;
                }
                else if (p.typeName == 'vertex') {
                    var vert = _self.vertices[p.vindex];
                    if (vert.attr.selectable)
                        vert.attr.isSelected = !vert.attr.isSelected;
                }
                _self.redraw();
            }
            else if (this.keyHandler.isDown('y') /* && p.type=='bpath' && (p.pid==BezierPath.START_POINT || p.pid==BezierPath.END_POINT) */) {
                _self.vertices[p.vindex].attr.bezierAutoAdjust = !_self.vertices[p.vindex].attr.bezierAutoAdjust;
                _self.redraw();
            }
        }
        else if (_self.selectPolygon != null) {
            var vert = _self.transformMousePosition(e.params.pos.x, e.params.pos.y);
            _self.selectPolygon.vertices.push(new Vertex_1.Vertex(vert.x, vert.y));
            _self.redraw();
        }
    };
    /**
     * Transforms the given x-y-(mouse-)point to coordinates respecting the view offset
     * and the zoom settings.
     *
     * @method transformMousePosition
     * @param {number} x - The x position relative to the canvas.
     * @param {number} y - The y position relative to the canvas.
     * @instance
     * @memberof PlotBoilerplate
     * @return {XYCoords} A simple object <pre>{ x : Number, y : Number }</pre> with the transformed coordinates.
     **/
    PlotBoilerplate.prototype.transformMousePosition = function (x, y) {
        return { x: (x / this.config.cssScaleX - this.config.offsetX) / (this.config.scaleX),
            y: (y / this.config.cssScaleY - this.config.offsetY) / (this.config.scaleY) };
    };
    ;
    /**
     * Revert a transformed mouse position back to canvas coordinates.
     *
     * This is the inverse function of `transformMousePosition`.
     *
     * @method revertMousePosition
     * @param {number} x - The x component of the position to revert.
     * @param {number} y - The y component of the position to revert.
     * @instance
     * @memberof PlotBoilerplate
     * @return {XYCoords} The canvas coordinates for the given position.
     **/
    PlotBoilerplate.prototype.revertMousePosition = function (x, y) {
        return { x: x / this.config.cssScaleX + this.config.offsetX,
            y: y / this.config.cssScaleY + this.config.offsetY };
    };
    ;
    /**
     * Determine if any elements are currently being dragged (on mouse move or touch move).
     *
     * @method getDraggedElementCount
     * @instance
     * @memberof PlotBoilerplate
     * @return {number} The number of elements that are currently being dragged.
     **/
    PlotBoilerplate.prototype.getDraggedElementCount = function () {
        return this.draggedElements.length;
    };
    ;
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
    PlotBoilerplate.prototype.mouseDownHandler = function (e) {
        var _self = this;
        if (e.which != 1)
            return; // Only react on left mouse or touch events
        var p = _self.locatePointNear(_self.transformMousePosition(e.params.pos.x, e.params.pos.y), PlotBoilerplate.DEFAULT_CLICK_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
        if (!p)
            return;
        // Drag all selected elements?
        if (p.typeName == 'vertex' && _self.vertices[p.vindex].attr.isSelected) {
            // Multi drag
            // for( var i in _self.vertices ) {
            for (var i = 0; i < _self.vertices.length; i++) {
                if (_self.vertices[i].attr.isSelected) {
                    _self.draggedElements.push(new PlotBoilerplate.Draggable(_self.vertices[i], PlotBoilerplate.Draggable.VERTEX).setVIndex(i));
                    _self.vertices[i].listeners.fireDragStartEvent(e);
                }
            }
        }
        else {
            // Single drag
            if (!_self.vertices[p.vindex].attr.draggable)
                return;
            _self.draggedElements.push(p);
            if (p.typeName == 'bpath')
                _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragStartEvent(e);
            else if (p.typeName == 'vertex')
                _self.vertices[p.vindex].listeners.fireDragStartEvent(e);
        }
        _self.redraw();
    };
    ;
    /**
     * The mouse-drag handler.
     *
     * It moves selected elements around or performs the panning if the ctrl-key if
     * hold down.
     *
     * @method mouseDragHandler.
     * @param {XMouseEvent} e - The event to handle
     * @private
     * @return {void}
     **/
    PlotBoilerplate.prototype.mouseDragHandler = function (e) {
        var _self = this;
        var oldDragAmount = { x: e.params.dragAmount.x, y: e.params.dragAmount.y };
        e.params.dragAmount.x /= _self.config.cssScaleX;
        e.params.dragAmount.y /= _self.config.cssScaleY;
        // Important note to: this.keyHandler.isDown('ctrl')
        //    We should not use this for any input.
        //    Reason: most browsers use [Ctrl]+[t] to create new browser tabs.
        //            If so, the key-up event for [Ctrl] will be fired in the _new tab_,
        //            not this one. So this tab will never receive any [Ctrl-down] events
        //            until next keypress; the implication is, that [Ctrl] would still
        //            considered to be pressed which is not true.
        if (this.keyHandler.isDown('alt') || this.keyHandler.isDown('spacebar')) {
            _self.setOffset(_self.draw.offset.clone().add(e.params.dragAmount));
            _self.redraw();
        }
        else {
            // Convert drag amount by scaling
            // Warning: this possibly invalidates the dragEvent for other listeners!
            //          Rethink the solution when other features are added.
            e.params.dragAmount.x /= _self.draw.scale.x;
            e.params.dragAmount.y /= _self.draw.scale.y;
            for (var i in _self.draggedElements) {
                var p = _self.draggedElements[i];
                if (p.typeName == 'bpath') {
                    _self.paths[p.pindex].moveCurvePoint(p.cindex, p.pid, new Vertex_1.Vertex(e.params.dragAmount.x, e.params.dragAmount.y));
                    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent(e);
                }
                else if (p.typeName == 'vertex') {
                    if (!_self.vertices[p.vindex].attr.draggable)
                        continue;
                    _self.vertices[p.vindex].add(e.params.dragAmount);
                    _self.vertices[p.vindex].listeners.fireDragEvent(e);
                }
            }
        }
        // Restore old event values!
        e.params.dragAmount.x = oldDragAmount.x;
        e.params.dragAmount.y = oldDragAmount.y;
        _self.redraw();
    };
    ;
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
    PlotBoilerplate.prototype.mouseUpHandler = function (e) {
        var _self = this;
        if (e.which != 1)
            return; // Only react on left mouse;
        if (!e.params.wasDragged) {
            _self.handleClick(e); // e.params.pos.x, e.params.pos.y );
        }
        for (var i in _self.draggedElements) {
            var p = _self.draggedElements[i];
            if (p.typeName == 'bpath') {
                _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent(e);
            }
            else if (p.typeName == 'vertex') {
                _self.vertices[p.vindex].listeners.fireDragEndEvent(e);
            }
        }
        _self.draggedElements = [];
        _self.redraw();
    };
    ;
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
    PlotBoilerplate.prototype.mouseWheelHandler = function (e) {
        var zoomStep = 1.25; // Make configurable?
        // CHANGED replaced _self by this
        var _self = this;
        var we = e;
        if (we.deltaY < 0) {
            _self.setZoom(_self.config.scaleX * zoomStep, _self.config.scaleY * zoomStep, new Vertex_1.Vertex(e.params.pos.x, e.params.pos.y));
        }
        else if (we.deltaY > 0) {
            _self.setZoom(_self.config.scaleX / zoomStep, _self.config.scaleY / zoomStep, new Vertex_1.Vertex(e.params.pos.x, e.params.pos.y));
        }
        e.preventDefault();
        _self.redraw();
    };
    ;
    /**
     * Re-adjust the configured offset depending on the current canvas size and zoom (scaleX and scaleY).
     *
     * @method adjustOffset
     * @param {boolean=false} redraw - [optional] If set the canvas will redraw with the new offset (default=false).
     * @return {void}
     **/
    PlotBoilerplate.prototype.adjustOffset = function (redraw) {
        this.draw.offset.x = this.fill.offset.x = this.config.offsetX = this.canvasSize.width * (this.config.offsetAdjustXPercent / 100);
        this.draw.offset.y = this.fill.offset.y = this.config.offsetY = this.canvasSize.height * (this.config.offsetAdjustYPercent / 100);
        if (redraw) {
            this.redraw();
        }
    };
    ;
    /**
     * Set the new draw offset.
     *
     * Note: the function will not trigger any redraws.
     *
     * @param {Vertex} newOffset - The new draw offset to use.
     **/
    PlotBoilerplate.prototype.setOffset = function (newOffset) {
        this.draw.offset.set(newOffset);
        this.fill.offset.set(newOffset);
        this.config.offsetX = newOffset.x;
        this.config.offsetY = newOffset.y;
    };
    ;
    /**
    * Set a new zoom value (and re-adjust the draw offset).
    *
    * Note: the function will not trigger any redraws.
    *
    * @param {number} zoomFactorX - The new horizontal zoom value.
    * @param {number} zoomFactorY - The new vertical zoom value.
    * @param {Vertex} interactionPos - The position of mouse/touch interaction.
    **/
    PlotBoilerplate.prototype.setZoom = function (zoomFactorX, zoomFactorY, interactionPos) {
        var oldPos = this.transformMousePosition(interactionPos.x, interactionPos.y);
        this.draw.scale.x = this.fill.scale.x = this.config.scaleX = Math.max(zoomFactorX, 0.01);
        this.draw.scale.y = this.fill.scale.y = this.config.scaleY = Math.max(zoomFactorY, 0.01);
        var newPos = this.transformMousePosition(interactionPos.x, interactionPos.y);
        var newOffsetX = this.draw.offset.x + (newPos.x - oldPos.x) * this.draw.scale.x;
        var newOffsetY = this.draw.offset.y + (newPos.y - oldPos.y) * this.draw.scale.y;
        this.setOffset({ x: newOffsetX, y: newOffsetY });
    };
    PlotBoilerplate.prototype.installInputListeners = function () {
        var _self = this;
        if (this.config.enableMouse) {
            // Install a mouse handler on the canvas.
            new MouseHandler_1.MouseHandler(this.eventCatcher ? this.eventCatcher : this.canvas)
                .down(function (e) { _self.mouseDownHandler(e); })
                .drag(function (e) { _self.mouseDragHandler(e); })
                .up(function (e) { _self.mouseUpHandler(e); });
        }
        else {
            _self.console.log('Mouse interaction disabled.');
        }
        if (this.config.enableMouseWheel) {
            // Install a mouse handler on the canvas.
            new MouseHandler_1.MouseHandler(this.eventCatcher ? this.eventCatcher : this.canvas)
                .wheel(function (e) { _self.mouseWheelHandler(e); });
        }
        else {
            _self.console.log('Mouse wheel interaction disabled.');
        }
        if (this.config.enableTouch) {
            // Install a touch handler on the canvas.
            var relPos_1 = function (pos) {
                var bounds = _self.canvas.getBoundingClientRect();
                return { x: pos.x - bounds.left,
                    y: pos.y - bounds.top
                };
            };
            if (globalThis["AlloyFinger"] && typeof globalThis["AlloyFinger"] == "function") {
                try {
                    // Do not include AlloyFinger itself to the library
                    // (17kb, but we want to keep this lib as tiny as possible).
                    // Solution: only import type defintions from AlloyFinger.
                    var touchMovePos = null;
                    var touchDownPos = null;
                    var draggedElement = null;
                    var multiTouchStartScale = null;
                    var clearTouch_1 = function () {
                        touchMovePos = null;
                        touchDownPos = null;
                        draggedElement = null;
                        multiTouchStartScale = null;
                        _self.draggedElements = [];
                    };
                    new alloyfinger_typescript_1.default(this.eventCatcher ? this.eventCatcher : this.canvas, {
                        touchStart: function (evt) {
                            if (evt.touches.length == 1) {
                                touchMovePos = new Vertex_1.Vertex(relPos_1({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                                touchDownPos = new Vertex_1.Vertex(relPos_1({ x: evt.touches[0].clientX, y: evt.touches[0].clientY }));
                                draggedElement = _self.locatePointNear(_self.transformMousePosition(touchMovePos.x, touchMovePos.y), PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE / Math.min(_self.config.cssScaleX, _self.config.cssScaleY));
                                if (draggedElement && draggedElement.typeName == 'vertex') {
                                    var draggingVertex = _self.vertices[draggedElement.vindex];
                                    var fakeEvent = { params: { isTouchEvent: true, dragAmount: { x: 0, y: 0 }, wasDragged: false, mouseDownPos: touchDownPos.clone(), mouseDragPos: touchDownPos.clone(), vertex: draggingVertex } };
                                    _self.draggedElements = [draggedElement];
                                    draggingVertex.listeners.fireDragStartEvent(fakeEvent);
                                }
                            }
                        },
                        touchMove: function (evt) {
                            if (evt.touches.length == 1 && draggedElement) {
                                evt.preventDefault();
                                evt.stopPropagation();
                                var rel = relPos_1({ x: evt.touches[0].clientX, y: evt.touches[0].clientY });
                                var trans = _self.transformMousePosition(rel.x, rel.y);
                                var diff = new Vertex_1.Vertex(_self.transformMousePosition(touchMovePos.x, touchMovePos.y)).difference(trans);
                                if (draggedElement.typeName == 'vertex') {
                                    if (!_self.vertices[draggedElement.vindex].attr.draggable)
                                        return;
                                    _self.vertices[draggedElement.vindex].add(diff);
                                    var draggingVertex = _self.vertices[draggedElement.vindex];
                                    var fakeEvent = { isTouchEvent: true, params: { dragAmount: diff.clone(), wasDragged: true, mouseDownPos: touchDownPos.clone(), mouseDragPos: touchDownPos.clone().add(diff), vertex: draggingVertex } };
                                    draggingVertex.listeners.fireDragEvent(fakeEvent);
                                    _self.redraw();
                                }
                                touchMovePos = new Vertex_1.Vertex(rel);
                            }
                            else if (evt.touches.length == 2) {
                                // If at least two fingers touch and move, then change the draw offset (panning).
                                evt.preventDefault();
                                evt.stopPropagation();
                                _self.setOffset(_self.draw.offset.clone().addXY(evt.deltaX, evt.deltaY)); // Apply zoom?
                                _self.redraw();
                            }
                        },
                        touchEnd: function (evt) {
                            // Note: e.touches.length is 0 here
                            if (draggedElement && draggedElement.typeName == 'vertex') {
                                var draggingVertex = _self.vertices[draggedElement.vindex];
                                var fakeEvent = { isTouchEvent: true, params: { dragAmount: { x: 0, y: 0 }, wasDragged: false, mouseDownPos: touchDownPos.clone(), mouseDragPos: touchDownPos.clone(), vertex: draggingVertex } };
                                // Check if vertex was moved
                                if (touchMovePos && touchDownPos && touchDownPos.distance(touchMovePos) < 0.001) {
                                    // if( e.touches.length == 1 && diff.x == 0 && diff.y == 0 ) {
                                    draggingVertex.listeners.fireClickEvent(fakeEvent);
                                }
                                else {
                                    draggingVertex.listeners.fireDragEndEvent(fakeEvent);
                                }
                            }
                            clearTouch_1();
                        },
                        touchCancel: function (evt) {
                            clearTouch_1();
                        },
                        multipointStart: function (evt) {
                            multiTouchStartScale = _self.draw.scale.clone();
                        },
                        multipointEnd: function (evt) {
                            multiTouchStartScale = null;
                        },
                        pinch: function (evt) {
                            // For pinching there must be at least two touch items
                            var fingerA = new Vertex_1.Vertex(evt.touches.item(0).clientX, evt.touches.item(0).clientY);
                            var fingerB = new Vertex_1.Vertex(evt.touches.item(1).clientX, evt.touches.item(1).clientY);
                            var center = new Line_1.Line(fingerA, fingerB).vertAt(0.5);
                            _self.setZoom(multiTouchStartScale.x * evt.zoom, multiTouchStartScale.y * evt.zoom, center);
                            _self.redraw();
                        }
                    });
                }
                catch (e) {
                    console.error("Failed to initialize AlloyFinger!");
                    console.error(e);
                }
                ;
            }
            else if (globalThis["Touchy"] && typeof globalThis["Touchy"] == "function") {
                console.error('[Deprecation] Found Touchy which is not supported any more. Please use AlloyFinger instead.');
                // Convert absolute touch positions to relative DOM element position (relative to canvas)
            }
            else {
                console.warn("Cannot initialize the touch handler. AlloyFinger is missig. Did you include it?");
            }
        }
        else {
            _self.console.log('Touch interaction disabled.');
        }
        if (this.config.enableKeys) {
            // Install key handler
            this.keyHandler = new KeyHandler_1.KeyHandler({ trackAll: true })
                .down('escape', function () {
                _self.clearSelection(true);
            })
                .down('shift', function () {
                _self.selectPolygon = new Polygon_1.Polygon();
                _self.redraw();
            })
                .up('shift', function () {
                // Find and select vertices in the drawn area
                if (_self.selectPolygon == null)
                    return;
                _self.selectVerticesInPolygon(_self.selectPolygon);
                _self.selectPolygon = null;
                _self.redraw();
            });
        } // END IF enableKeys?
        else {
            _self.console.log('Keyboard interaction disabled.');
        }
    };
    /**
     * Creates a control GUI (a dat.gui instance) for this
     * plot boilerplate instance.
     *
     * @method createGUI
     * @instance
     * @memberof PlotBoilerplate
     * @return {dat.gui.GUI}
     **/
    PlotBoilerplate.prototype.createGUI = function () {
        // This function moved to the helper utils.
        // We do not want to include the whole dat.GUI package.
        if (globalThis["utils"] && typeof globalThis["utils"].createGUI == "function")
            return globalThis["utils"].createGUI(this);
        else
            throw "Cannot create dat.GUI instance; did you load the ./utils/creategui helper function an the dat.GUI library?";
    };
    ;
    var _a;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_CANVAS_WIDTH = 1024;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_CANVAS_HEIGHT = 768;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_CLICK_TOLERANCE = 8;
    /** @constant {number} */
    PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE = 32;
    /**
     * A wrapper class for draggable items (mostly vertices).
     * @private
     **/
    PlotBoilerplate.Draggable = (_a = /** @class */ (function () {
            function class_1(item, typeName) {
                this.item = item;
                this.typeName = typeName;
            }
            ;
            class_1.prototype.isVertex = function () { return this.typeName == PlotBoilerplate.Draggable.VERTEX; };
            ;
            class_1.prototype.setVIndex = function (vindex) { this.vindex = vindex; return this; };
            ;
            return class_1;
        }()),
        _a.VERTEX = 'vertex',
        _a);
    /**
     * A set of helper functions.
     **/
    PlotBoilerplate.utils = {
        /**
         * Merge the elements in the 'extension' object into the 'base' object based on
         * the keys of 'base'.
         *
         * @param {Object} base
         * @param {Object} extension
         * @return {Object} base extended by the new attributes.
         **/
        safeMergeByKeys: function (base, extension) {
            for (var k in extension) {
                if (!extension.hasOwnProperty(k))
                    continue;
                if (base.hasOwnProperty(k)) {
                    var typ = typeof base[k];
                    try {
                        if (typ == 'boolean')
                            base[k] = !!JSON.parse(extension[k]);
                        else if (typ == 'number')
                            base[k] = JSON.parse(extension[k]) * 1;
                        else if (typ == 'function' && typeof extension[k] == 'function')
                            base[k] = extension[k];
                        else
                            base[k] = extension[k];
                    }
                    catch (e) {
                        console.error('error in key ', k, extension[k], e);
                    }
                }
                else {
                    base[k] = extension[k];
                }
            }
            return base;
        },
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
        setCSSscale: function (element, scaleX, scaleY) {
            element.style['transform-origin'] = '0 0';
            if (scaleX == 1.0 && scaleY == 1.0)
                element.style.transform = null;
            else
                element.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
        },
        // A helper for fetching data from objects.
        fetch: {
            /**
             * A helper function to the the object property value specified by the given key.
             *
             * @param {any} object   - The object to get the property's value from. Must not be null.
             * @param {string} key      - The key of the object property (the name).
             * @param {any}    fallback - A default value if the key does not exist.
             **/
            val: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] == 'undefined')
                    return fallback;
                return obj[key];
            },
            /**
             * A helper function to the the object property numeric value specified by the given key.
             *
             * @param {any}    object   - The object to get the property's value from. Must not be null.
             * @param {string} key      - The key of the object property (the name).
             * @param {number} fallback - A default value if the key does not exist.
             * @return {number}
             **/
            num: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] === 'number')
                    return obj[key];
                else {
                    try {
                        return JSON.parse(obj[key]) * 1;
                    }
                    catch (e) {
                        return fallback;
                    }
                }
            },
            /**
             * A helper function to the the object property boolean value specified by the given key.
             *
             * @param {any}     object   - The object to get the property's value from. Must not be null.
             * @param {string}  key      - The key of the object property (the name).
             * @param {boolean} fallback - A default value if the key does not exist.
             * @return {boolean}
             **/
            bool: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] == 'boolean')
                    return obj[key];
                else {
                    try {
                        return !!JSON.parse(obj[key]);
                    }
                    catch (e) {
                        return fallback;
                    }
                }
            },
            /**
             * A helper function to the the object property function-value specified by the given key.
             *
             * @param {any}      object   - The object to get the property's value from. Must not be null.
             * @param {string}   key      - The key of the object property (the name).
             * @param {function} fallback - A default value if the key does not exist.
             * @return {function}
             **/
            func: function (obj, key, fallback) {
                if (!obj.hasOwnProperty(key))
                    return fallback;
                if (typeof obj[key] !== 'function')
                    return fallback;
                return obj[key];
            }
        },
        /**
         * Installs vertex listeners to the path's vertices so that controlpoints
         * move with their path points when dragged.
         *
         * Bézier path points with attr.bezierAutoAdjust==true will have their
         * two control points audo-updated if moved, too (keep path connections smooth).
         *
         * @param {BezierPath} bezierPath - The path to use auto-adjustment for.
         **/
        enableBezierPathAutoAdjust: function (bezierPath) {
            for (var i = 0; i < bezierPath.bezierCurves.length; i++) {
                // This should be wrapped into the BezierPath implementation.
                bezierPath.bezierCurves[i].startPoint.listeners.addDragListener(function (e) {
                    var cindex = bezierPath.locateCurveByStartPoint(e.params.vertex);
                    bezierPath.bezierCurves[cindex].startPoint.addXY(-e.params.dragAmount.x, -e.params.dragAmount.y);
                    bezierPath.moveCurvePoint(cindex * 1, bezierPath.START_POINT, e.params.dragAmount);
                    bezierPath.updateArcLengths();
                });
                bezierPath.bezierCurves[i].startControlPoint.listeners.addDragListener(function (e) {
                    var cindex = bezierPath.locateCurveByStartControlPoint(e.params.vertex);
                    if (!bezierPath.bezierCurves[cindex].startPoint.attr.bezierAutoAdjust)
                        return;
                    bezierPath.adjustPredecessorControlPoint(cindex * 1, true, // obtain handle length?
                    false // update arc lengths
                    );
                    bezierPath.updateArcLengths();
                });
                bezierPath.bezierCurves[i].endControlPoint.listeners.addDragListener(function (e) {
                    var cindex = bezierPath.locateCurveByEndControlPoint(e.params.vertex);
                    if (!bezierPath.bezierCurves[cindex % bezierPath.bezierCurves.length].endPoint.attr.bezierAutoAdjust)
                        return;
                    bezierPath.adjustSuccessorControlPoint(cindex * 1, true, // obtain handle length?
                    false // update arc lengths
                    );
                    bezierPath.updateArcLengths();
                });
                if (i + 1 == bezierPath.bezierCurves.length) { // && !bezierPath.adjustCircular ) { 
                    // Move last control point with the end point (if not circular)
                    bezierPath.bezierCurves[bezierPath.bezierCurves.length - 1].endPoint.listeners.addDragListener(function (e) {
                        if (!bezierPath.adjustCircular) {
                            var cindex = bezierPath.locateCurveByEndPoint(e.params.vertex);
                            bezierPath.moveCurvePoint(cindex * 1, bezierPath.END_CONTROL_POINT, new Vertex_1.Vertex({ x: e.params.dragAmount.x, y: e.params.dragAmount.y }));
                        }
                        bezierPath.updateArcLengths();
                    });
                }
            } // END for
        }
    }; // END utils
    return PlotBoilerplate;
}());
exports.PlotBoilerplate = PlotBoilerplate;
; // END class PlotBoilerplate
exports.default = PlotBoilerplate;
//# sourceMappingURL=PlotBoilerplate.js.map