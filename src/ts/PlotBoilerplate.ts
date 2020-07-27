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
 * @modified 2020-07-06 Replacing Touchy.js by AlloyFinger.js
 * @modified 2020-07-27 Added the getVertexNear(XYCoords,number) function
 * @modified 2020-07-27 Extended the remove(Drawable) function: vertices are now removed, too.
 * @modified 2020-07-28 Added PlotBoilerplate.revertMousePosition(number,number) –  the inverse function of transformMousePosition(...).
 * @version  1.9.0
 *
 * @file PlotBoilerplate
 * @fileoverview The main class.
 * @public
 **/

import { AlloyFinger } from "alloyfinger";
import { saveAs } from "file-saver";
import { GUI } from "dat.gui";

import { drawutils } from "./draw";
import { drawutilsgl } from "./drawgl";
import { BezierPath } from "./BezierPath";
import { Bounds } from "./Bounds";
import { Circle } from "./Circle";
import { CubicBezierCurve } from "./CubicBezierCurve";
import { Grid } from "./Grid";
import { KeyHandler, XKeyListener } from "./KeyHandler";
import { Line } from "./Line";
import { MouseHandler, XMouseEvent, XWheelEvent } from "./MouseHandler";
import { PBImage } from "./PBImage";
import { Polygon } from "./Polygon";
import { SVGBuilder } from "./SVGBuilder";
import { Triangle } from "./Triangle";
import { VEllipse } from "./VEllipse";
import { Vector } from "./Vector";
import { Vertex } from "./Vertex";
import { VertexAttr } from "./VertexAttr";
import { VertEvent } from "./VertexListeners";
import { IBounds, IDraggable, Config, Drawable, DrawConfig, IHooks, PBParams, SVGSerializable, XYCoords, XYDimension } from "./interfaces";


export class PlotBoilerplate {

    /** @constant {number} */
    static readonly DEFAULT_CANVAS_WIDTH : number    = 1024;
    /** @constant {number} */
    static readonly DEFAULT_CANVAS_HEIGHT : number   =  768;
    /** @constant {number} */
    static readonly DEFAULT_CLICK_TOLERANCE : number =    8;
    /** @constant {number} */
    static readonly DEFAULT_TOUCH_TOLERANCE : number =   32;


    /**
     * A wrapper class for draggable items (mostly vertices).
     * @private
     **/
    static Draggable = class {
	static VERTEX:string = 'vertex';
	item:any;
	typeName:string;
	vindex:number;   // Vertex-index
	pindex:number;   // Point-index (on path)
	pid:number;      // Point-ID (on curve)
	cindex:number;   // Curve-index
	constructor( item:any, typeName:string ) {
	    this.item = item;
	    this.typeName = typeName;
	};
	isVertex() { return this.typeName == PlotBoilerplate.Draggable.VERTEX; };
	setVIndex(vindex:number):IDraggable { this.vindex = vindex; return this; };
    }
    
    
    /** 
     * @member {HTMLCanvasElement} 
     * @memberof PlotBoilerplate
     * @instance
     */
    canvas:HTMLCanvasElement;

    /** 
     * @member {Config} 
     * @memberof PlotBoilerplate
     * @instance
     */
    config:Config;

    /** 
     * @member {CanvasRenderingContext2D|WebGLRenderingContext} 
     * @memberof PlotBoilerplate
     * @instance
     */
    ctx:CanvasRenderingContext2D|WebGLRenderingContext;

    /** 
     * @member {drawutils|drawutilsgl} 
     * @memberof PlotBoilerplate
     * @instance
     */
    draw:drawutils|drawutilsgl;

    /** 
     * @member {drawutils|drawutilsgl} 
     * @memberof PlotBoilerplate
     * @instance
     */
    fill:drawutils|drawutilsgl;

    /** 
     * @member {DrawConfig} 
     * @memberof PlotBoilerplate
     * @instance
     */
    drawConfig:DrawConfig;

    /** 
     * @member {Grid} 
     * @memberof PlotBoilerplate
     * @instance
     */
    grid:Grid;

    /** 
     * @member {XYDimension} 
     * @memberof PlotBoilerplate
     * @instance
     */
    canvasSize : XYDimension;

    /** 
     * @member {Array<Vertex>} 
     * @memberof PlotBoilerplate
     * @instance
     */
    vertices : Array<Vertex>;

    /** 
     * @member {Array<BezierPath>} 
     * @memberof PlotBoilerplate
     * @instance
     */
    // TODO: check if this is really still in use.
    paths : Array<BezierPath>;

    /** 
     * @member {Poylgon} 
     * @memberof PlotBoilerplate
     * @instance
     */
    selectPolygon : Polygon;

    /** 
     * @member {Array<IDraggable>} 
     * @memberof PlotBoilerplate
     * @instance
     */
    draggedElements : Array<IDraggable>;

    /** 
     * @member {Array<Drawable>} 
     * @memberof PlotBoilerplate
     * @instance
     */
    drawables : Array<Drawable>;

    /** 
     * @member {Console} 
     * @memberof PlotBoilerplate
     * @instance
     */
    console : Console;

    /** 
     * @member {IHooks} 
     * @memberof PlotBoilerplate
     * @instance
     */
    hooks : IHooks;

    /** 
     * @member {KeyHandler|undefined} 
     * @memberof PlotBoilerplate
     * @instance
     */
    private keyHandler : KeyHandler|undefined;

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
    constructor( config:PBParams ) {
	// This should be in some static block ...
	VertexAttr.model = { bezierAutoAdjust : false, renderTime : 0, selectable : true, isSelected : false, draggable : true };
	
	if( typeof config.canvas == 'undefined' )
	    throw "No canvas specified.";
	
	/** 
	 * A global config that's attached to the dat.gui control interface.
	 *
	 * @member {Object} 
	 * @memberof PlotBoilerplate
	 * @instance
	 */
	this.config = {
	    canvas                : config.canvas,
	    fullSize              : PlotBoilerplate.utils.fetch.val(config,'fullSize',true), 
	    fitToParent           : PlotBoilerplate.utils.fetch.bool(config,'fitToParent',true),
	    scaleX                : PlotBoilerplate.utils.fetch.num(config,'scaleX',1.0), 
	    scaleY                : PlotBoilerplate.utils.fetch.num(config,'scaleY',1.0),
	    offsetX               : PlotBoilerplate.utils.fetch.num(config,'offsetX',0.0), 
	    offsetY               : PlotBoilerplate.utils.fetch.num(config,'offsetY',0.0), 
	    rasterGrid            : PlotBoilerplate.utils.fetch.bool(config,'rasterGrid',true),
	    rasterScaleX          : PlotBoilerplate.utils.fetch.num(config,'rasterScaleX',1.0),
	    rasterScaleY          : PlotBoilerplate.utils.fetch.num(config,'rasterScaleY',1.0),
	    rasterAdjustFactor    : PlotBoilerplate.utils.fetch.num(config,'rasterAdjustdFactror',2.0),
	    drawOrigin            : PlotBoilerplate.utils.fetch.bool(config,'drawOrigin',false),
	    autoAdjustOffset      : PlotBoilerplate.utils.fetch.val(config,'autoAdjustOffset',true),
	    offsetAdjustXPercent  : PlotBoilerplate.utils.fetch.num(config,'offsetAdjustXPercent',50),
	    offsetAdjustYPercent  : PlotBoilerplate.utils.fetch.num(config,'offsetAdjustYPercent',50),
	    backgroundColor       : config.backgroundColor || '#ffffff',
	    redrawOnResize        : PlotBoilerplate.utils.fetch.bool(config,'redrawOnResize',true), 
	    defaultCanvasWidth    : PlotBoilerplate.utils.fetch.num(config,'defaultCanvasWidth',PlotBoilerplate.DEFAULT_CANVAS_WIDTH),
	    defaultCanvasHeight   : PlotBoilerplate.utils.fetch.num(config,'defaultCanvasHeight',PlotBoilerplate.DEFAULT_CANVAS_HEIGHT),
	    canvasWidthFactor     : PlotBoilerplate.utils.fetch.num(config,'canvasWidthFactor',1.0),
	    canvasHeightFactor    : PlotBoilerplate.utils.fetch.num(config,'canvasHeightFactor',1.0),
	    cssScaleX             : PlotBoilerplate.utils.fetch.num(config,'cssScaleX',1.0),
	    cssScaleY             : PlotBoilerplate.utils.fetch.num(config,'cssScaleY',1.0),
	    cssUniformScale       : PlotBoilerplate.utils.fetch.bool(config,'cssUniformScale',true),
	    saveFile              : function() { _self.hooks.saveFile(_self); },
	    setToRetina           : function() { _self._setToRetina(); },
	    autoDetectRetina      : PlotBoilerplate.utils.fetch.bool(config,'autoDetectRetina',true),
	    enableSVGExport       : PlotBoilerplate.utils.fetch.bool(config,'enableSVGExport',true),

	    // Listeners/observers
	    preClear              : PlotBoilerplate.utils.fetch.func(config,'preClear',null),
	    preDraw               : PlotBoilerplate.utils.fetch.func(config,'preDraw',null),
	    postDraw              : PlotBoilerplate.utils.fetch.func(config,'postDraw',null),

	    // Interaction
	    enableMouse           : PlotBoilerplate.utils.fetch.bool(config,'enableMouse',true),
	    enableTouch           : PlotBoilerplate.utils.fetch.bool(config,'enableTouch',true),
	    enableKeys            : PlotBoilerplate.utils.fetch.bool(config,'enableKeys',true),
	    enableMouseWheel      : PlotBoilerplate.utils.fetch.bool(config,'enableMouseWheel',true),

	    // Experimental (and unfinished)
	    enableGL              : PlotBoilerplate.utils.fetch.bool(config,'enableGL',false)
	}; // END confog


	/** 
	 * Configuration for drawing things.
	 *
	 * @member {Object} 
	 * @memberof PlotBoilerplate
	 * @instance
	 */
	this.drawConfig = {
	    drawVertices : true,
	    drawBezierHandleLines : PlotBoilerplate.utils.fetch.bool(config,'drawBezierHandleLines',true),
	    drawBezierHandlePoints : PlotBoilerplate.utils.fetch.bool(config,'drawBezierHandlePoints',true),
	    drawHandleLines  : PlotBoilerplate.utils.fetch.bool(config,'drawHandleLines',true),
	    drawHandlePoints : PlotBoilerplate.utils.fetch.bool(config,'drawHandlePoints',true),
	    drawGrid : PlotBoilerplate.utils.fetch.bool(config,'drawGrid',true),
	    bezier : {
		color : '#00a822',
		lineWidth : 2,
		handleLine : {
		    color : 'rgba(180,180,180,0.5)',
		    lineWidth : 1
		}
	    },
	    polygon : {
		color : '#0022a8',
		lineWidth : 1
	    },
	    triangle : {
		color : '#6600ff',
		lineWidth : 1
	    },
	    ellipse : {
		color : '#2222a8',
		lineWidth : 1
	    },
	    circle : {
	    	color : '#22a8a8',
		lineWidth : 2
	    },
	    vertex : {
		color : '#a8a8a8',
		lineWidth : 1
	    },
	    line : {
		color : '#a844a8',
		lineWidth : 1
	    },
	    vector : {
		color : '#ff44a8',
		lineWidth : 1
	    },
	    image : {
		color : '#a8a8a8',
		lineWidth : 1
	    }
	}; // END drawConfig


	// +---------------------------------------------------------------------------------
	// | Object members.
	// +-------------------------------
	this.canvas              = typeof config.canvas == 'string' ? (document.querySelector(config.canvas) as HTMLCanvasElement) : config.canvas;
	if( this.config.enableGL ) {
	    this.ctx                 = this.canvas.getContext( 'webgl' ); // webgl-experimental?
	    this.draw                = new drawutilsgl(this.ctx,false);
	    // PROBLEM: same instance of fill and draw when using WebGL. Shader program cannot be duplicated on the same context
	    this.fill                = this.draw.copyInstance(true);
	    console.warn('Initialized with experimental mode enableGL=true. Note that this is not yet fully implemented.');
	} else {
	    this.ctx                 = this.canvas.getContext( '2d' );
	    this.draw                = new drawutils(this.ctx,false);
	    this.fill                = new drawutils(this.ctx,true);
	}
	this.draw.scale.set(this.config.scaleX,this.config.scaleY);
	this.fill.scale.set(this.config.scaleX,this.config.scaleY);
	this.grid                = new Grid( new Vertex(0,0), new Vertex(50,50) );
	this.canvasSize          = { width : PlotBoilerplate.DEFAULT_CANVAS_WIDTH, height : PlotBoilerplate.DEFAULT_CANVAS_HEIGHT };
	this.vertices            = [];
	this.selectPolygon       = null;
	this.draggedElements     = [];
	this.drawables           = [];
	this.console             = console;
	this.hooks               = {
	    // This is changable from the outside
	    saveFile : PlotBoilerplate._saveFile
	};
	var _self = this;

	// TODO: this should be placed in the caller and work for modules/global, too!
	if( window ) window.addEventListener( 'resize', () => _self.resizeCanvas() );
	this.resizeCanvas();
	if( config.autoDetectRetina ) {
	    this._setToRetina();
	}

	this.installInputListeners();
	 // Apply the configured CSS scale.
	this.updateCSSscale();	
	// Init	
	this.redraw();
	// Gain focus
	this.canvas.focus();
    }; // END constructor
    
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
    private static _saveFile( pb:PlotBoilerplate ) {
	var svgCode : string = new SVGBuilder().build( pb.drawables, { canvasSize : pb.canvasSize, offset : pb.draw.offset, zoom : pb.draw.scale } );
	var blob:Blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" } );

	// See documentation for FileSaver.js for usage.
	//    https://github.com/eligrey/FileSaver.js
	if( typeof window["saveAs"] != "function" )
	    throw "Cannot save file; did you load the ./utils/savefile helper function an the eligrey/SaveFile library?";
	const _saveAs:saveAs = window["saveAs"] as saveAs;
	_saveAs(blob, "plotboilerplate.svg");   
    };


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
    private _setToRetina() : void {
	this.config.autoDetectRetina = true;
	const pixelRatio : number = window.devicePixelRatio || 1;
	this.config.cssScaleX = this.config.cssScaleY = 1.0/pixelRatio; // 0.5;
	this.config.canvasWidthFactor = this.config.canvasHeightFactor = pixelRatio; // 2.0;
	// this.config.fullSize = false;
	// this.config.fitToParent = false;
	//console.log( 'pixelRatio', pixelRatio );
	this.resizeCanvas();
	this.updateCSSscale();
    };

    /**
     * Set the current zoom and draw offset to fit the given bounds.
     *
     * This method currently restores the aspect zoom ratio.
     *
     **/
    fitToView( bounds:Bounds ) : void {
	//const viewport:Bounds = this.viewport();
	const canvasCenter:Vertex = new Vertex( this.canvasSize.width/2.0, this.canvasSize.height/2.0 );
	const canvasRatio:number = this.canvasSize.width / this.canvasSize.height;
	const ratio:number = bounds.width / bounds.height;

	// Find the new draw offset
	// const center:Vertex = new Vertex( bounds.max.x - bounds.width/2.0, bounds.max.y - bounds.height/2.0 );
	const center:Vertex =
	    new Vertex( bounds.max.x - bounds.width/2.0, bounds.max.y - bounds.height/2.0 )
		.inv()
		.addXY( this.canvasSize.width/2.0, this.canvasSize.height/2.0 );
	//center.addXY( this.canvasSize.width/2.0, this.canvasSize.height/2.0 );
	// But keep the old center of bounds
	//this.setOffset( center.clone().inv().addXY( this.canvasSize.width/2.0, this.canvasSize.height/2.0 ) );
	this.setOffset( center );
	
	if( canvasRatio < ratio ) {
	    const newUniformZoom:number = this.canvasSize.width/bounds.width;
	    this.setZoom( newUniformZoom, newUniformZoom, canvasCenter );
	    // this.setZoom( viewport.height/bounds.height, viewport.height/bounds.height, center );
	    //this.setZoom( viewport.width/bounds.width, viewport.width/bounds.width, center );
	} else {
	    const newUniformZoom:number = this.canvasSize.height/bounds.height;
	    this.setZoom( newUniformZoom, newUniformZoom, canvasCenter );
	    // this.setZoom( this.canvasSize.width/bounds.width, this.canvasSize.width/bounds.width, center );
	}

	this.redraw();
    };

    
    /**
     * Set the console for this instance.
     *
     * @method setConsole
     * @param {Console} con - The new console object (default is window.console).
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    setConsole( con:Console ) : void {
	if( typeof con.log != 'function' ) throw "Console object must have a 'log' function.";
	if( typeof con.warn != 'function' ) throw "Console object must have a 'warn' function.";
	if( typeof con.error != 'function' ) throw "Console object must have a 'error' function.";
	this.console = con;
    };

    
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
    private updateCSSscale() {
	if( this.config.cssUniformScale ) {
	    PlotBoilerplate.utils.setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleX );
	} else {
	    PlotBoilerplate.utils.setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleY );
	}
    };
    


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
    add( drawable:Drawable|Array<Drawable>,
	 redraw?:boolean
       ) {
	if( Array.isArray(drawable) ) {
	    const arr : Array<Drawable> = (drawable as Array<Drawable>);
	    // for( var i in arr )
	    for( var i = 0; i < arr.length; i++ )
		this.add( arr[i] );
	} else if( drawable instanceof Vertex ) {
	    this.drawables.push( drawable );
	    this.vertices.push( drawable );
	} else if( drawable instanceof Line ) {
	    // Add some lines
	    this.drawables.push( drawable );
	    this.vertices.push( drawable.a );
	    this.vertices.push( drawable.b );
	} else if( drawable instanceof Vector ) {
	    this.drawables.push( drawable );
	    this.vertices.push( drawable.a );
	    this.vertices.push( drawable.b );
	} else if( drawable instanceof VEllipse ) {
	    this.vertices.push( drawable.center );
	    this.vertices.push( drawable.axis );
	    this.drawables.push( drawable );
	    drawable.center.listeners.addDragListener( function(e) {
		drawable.axis.add( e.params.dragAmount );
	    } );
	} else if( drawable instanceof Circle ) {
	    this.vertices.push( drawable.center );
	    this.drawables.push( drawable );
	} else if( drawable instanceof Polygon ) {
	    this.drawables.push( drawable );
	    // for( var i in drawable.vertices )
	    for( var i = 0; i < drawable.vertices.length; i++ )
		this.vertices.push( drawable.vertices[i] );
	} else if( drawable instanceof Triangle ) {
	    this.drawables.push( drawable );
	    this.vertices.push( drawable.a );
	    this.vertices.push( drawable.b );
	    this.vertices.push( drawable.c );
	} else if( drawable instanceof BezierPath ) {
	    this.drawables.push( drawable );
	    const bezierPath:BezierPath = (drawable as BezierPath);
	    for( var i = 0; i < bezierPath.bezierCurves.length; i++ ) {
		if( !drawable.adjustCircular && i == 0 )
		    this.vertices.push( bezierPath.bezierCurves[i].startPoint );
		this.vertices.push( bezierPath.bezierCurves[i].endPoint );
		this.vertices.push( bezierPath.bezierCurves[i].startControlPoint );
		this.vertices.push( bezierPath.bezierCurves[i].endControlPoint );
		bezierPath.bezierCurves[i].startControlPoint.attr.selectable = false;
		bezierPath.bezierCurves[i].endControlPoint.attr.selectable = false;
	    }
	    PlotBoilerplate.utils.enableBezierPathAutoAdjust( drawable );
	} else if( drawable instanceof PBImage ) {
	    this.vertices.push( drawable.upperLeft );
	    this.vertices.push( drawable.lowerRight );
	    this.drawables.push( drawable );
	    // Todo: think about a IDragEvent interface
	    drawable.upperLeft.listeners.addDragListener( (e:VertEvent) => { 
		drawable.lowerRight.add( e.params.dragAmount );
	    } );
	    drawable.lowerRight.attr.selectable = false
	} else {
	    throw "Cannot add drawable of unrecognized type: " + (typeof drawable) + ".";
	}

	// This is a workaround for backwards compatibility when the 'redraw' param was not yet present.
	if( redraw || typeof redraw == 'undefined' )
	    this.redraw();
    };


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
    remove( drawable:Drawable, redraw?:boolean, removeWithVertices?:boolean ) {
	if( drawable instanceof Vertex )
	    this.removeVertex( drawable, false );
	for( var i = 0; i < this.drawables.length; i++ ) {
	    if( this.drawables[i] === drawable ) {
		this.drawables.splice(i,1);

		if( removeWithVertices ) {
		    // Check if some listeners need to be removed
		    if( drawable instanceof Line ) {
			// Add some lines
			this.removeVertex( drawable.a, false );
			this.removeVertex( drawable.b, false );
		    } else if( drawable instanceof Vector ) {
			this.removeVertex( drawable.a, false );
			this.removeVertex( drawable.b, false );
		    } else if( drawable instanceof VEllipse ) {
			this.removeVertex( drawable.center, false );
			this.removeVertex( drawable.axis, false );
		    } else if( drawable instanceof Circle ) {
			this.removeVertex( drawable.center, false );
		    } else if( drawable instanceof Polygon ) {
			// for( var i in drawable.vertices )
			for( var i = 0; i < drawable.vertices.length; i++ )
			    this.removeVertex( drawable.vertices[i], false );
		    } else if( drawable instanceof Triangle ) {
			this.removeVertex( drawable.a, false );
			this.removeVertex( drawable.b, false );
			this.removeVertex( drawable.c, false );
		    } else if( drawable instanceof BezierPath ) {
			PlotBoilerplate.utils.disableBezierPathAutoAdjust( drawable );
			for( var i = 0; i < drawable.bezierCurves.length; i++ ) {
			    this.removeVertex( drawable.bezierCurves[i].startPoint, false );
			    this.removeVertex( drawable.bezierCurves[i].startControlPoint, false );
			    this.removeVertex( drawable.bezierCurves[i].endControlPoint, false );
			    if( i+1 == drawable.bezierCurves.length ) {
				this.removeVertex( drawable.bezierCurves[i].endPoint, false );
			    }
			}
		    } else if( drawable instanceof PBImage ) {
			this.removeVertex( drawable.upperLeft, false );
			this.removeVertex( drawable.lowerRight, false );
		    }
		} // END removeWithVertices
		
		if( redraw )
		    this.redraw();
		return;
	    }
	}
    };


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
    removeVertex( vert:Vertex, redraw?:boolean ) : void {
	for( var i = 0; i < this.vertices.length; i++ ) {
	    if( this.vertices[i] === vert ) {
		this.vertices.splice(i,1);
		if( redraw )
		    this.redraw();
		return;
	    }
	}
    };

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
    getVertexNear( pixelPosition:XYCoords, pixelTolerance:number ) : Vertex|undefined {
	var p : IDraggable|undefined = this.locatePointNear( this.transformMousePosition(pixelPosition.x, pixelPosition.y),
							     pixelTolerance/Math.min(this.config.cssScaleX,this.config.cssScaleY) );
	if( p && p.typeName == "vertex" )
	    return this.vertices[p.vindex];
	return undefined;
    };
    

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
    drawGrid() {
	const gScale : XYCoords = {
	    x : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.x)*this.config.rasterScaleX / this.config.cssScaleX,
	    y : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.y)*this.config.rasterScaleY / this.config.cssScaleY
	};
	var gSize : XYDimension = { width : this.grid.size.x*gScale.x, height : this.grid.size.y*gScale.y };
	var cs : XYDimension = { width : this.canvasSize.width/2, height : this.canvasSize.height/2 };
	var offset : Vertex = this.draw.offset.clone().inv();
	offset.x = (Math.round(offset.x+cs.width)/Math.round(gSize.width))*(gSize.width)/this.draw.scale.x + (((this.draw.offset.x-cs.width)/this.draw.scale.x)%gSize.width);
	offset.y = (Math.round(offset.y+cs.height)/Math.round(gSize.height))*(gSize.height)/this.draw.scale.y + (((this.draw.offset.y-cs.height)/this.draw.scale.x)%gSize.height);
	if( this.drawConfig.drawGrid ) {
	    if( this.config.rasterGrid ) // TODO: move config member to drawConfig
		this.draw.raster( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.width, gSize.height, 'rgba(0,128,255,0.125)' );
	    else
		this.draw.grid( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.width, gSize.height, 'rgba(0,128,255,0.095)' );
	}
    };

    
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
    drawOrigin() {
	// Add a crosshair to mark the origin
	this.draw.crosshair( { x : 0, y : 0 }, 10, '#000000' );
    };


    /**
     * This is just a tiny helper function to determine the render color of vertices.
     **/
    _handleColor( h:Vertex, color:string ) {
	return h.attr.draggable ? color : 'rgba(128,128,128,0.5)';
    }


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
    drawDrawables( renderTime:number ) {
	
	// Draw drawables
	for( var i in this.drawables ) {
	    var d : Drawable = this.drawables[i];
	    if( d instanceof BezierPath ) {
		for( var c in d.bezierCurves ) {
		    this.draw.cubicBezier( d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.color, this.drawConfig.bezier.lineWidth );

		    if( this.drawConfig.drawBezierHandlePoints && this.drawConfig.drawHandlePoints ) {
			if( !d.bezierCurves[c].startPoint.attr.bezierAutoAdjust ) {
			    this.draw.diamondHandle( d.bezierCurves[c].startPoint, 7, this._handleColor(d.bezierCurves[c].startPoint,'orange') );
			    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
			}
			if( !d.bezierCurves[c].endPoint.attr.bezierAutoAdjust ) {
			    this.draw.diamondHandle( d.bezierCurves[c].endPoint, 7,  this._handleColor(d.bezierCurves[c].endPoint,'orange') );
			    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
			}
			this.draw.circleHandle( d.bezierCurves[c].startControlPoint, 3, this._handleColor(d.bezierCurves[c].startControlPoint,'#008888') );
			this.draw.circleHandle( d.bezierCurves[c].endControlPoint, 3, this._handleColor(d.bezierCurves[c].endControlPoint,'#008888') );
			d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
			d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
		    } else {
			d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
			d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
			d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
			d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
		    }
		    
		    if( this.drawConfig.drawBezierHandleLines && this.drawConfig.drawHandleLines ) {
			this.draw.line( d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
			this.draw.line( d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint, this.drawConfig.bezier.handleLine.color, this.drawConfig.bezier.handleLine.lineWidth );
		    }
		    
		}
	    } else if( d instanceof Polygon ) {
		this.draw.polygon( d, this.drawConfig.polygon.color, this.drawConfig.polygon.lineWidth );
		if( !this.drawConfig.drawHandlePoints ) {
		    for( var i in d.vertices )
			d.vertices[i].attr.renderTime = renderTime;
		}
	    } else if( d instanceof Triangle ) {
		this.draw.polyline( [d.a,d.b,d.c], false, this.drawConfig.triangle.color, this.drawConfig.triangle.lineWidth );
		if( !this.drawConfig.drawHandlePoints ) 
		    d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
	    } else if( d instanceof VEllipse ) {
		if( this.drawConfig.drawHandleLines ) {
		    this.draw.line( d.center.clone().add(0,d.axis.y-d.center.y), d.axis, '#c8c8c8' );
		    this.draw.line( d.center.clone().add(d.axis.x-d.center.x,0), d.axis, '#c8c8c8' );
		}
		this.draw.ellipse( d.center, Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y), this.drawConfig.ellipse.color,  this.drawConfig.ellipse.lineWidth );
		if( !this.drawConfig.drawHandlePoints ) {
		    d.center.attr.renderTime = renderTime;
		    d.axis.attr.renderTime = renderTime;
		}
	    } else if( d instanceof Circle ) {
		this.draw.circle( d.center, d.radius, this.drawConfig.circle.color,  this.drawConfig.circle.lineWidth );
	    } else if( d instanceof Vertex ) {
		if( this.drawConfig.drawVertices &&
		    (!d.attr.selectable || !d.attr.draggable) ) {
		    // Draw as special point (grey)
		    this.draw.circleHandle( d, 7, this.drawConfig.vertex.color );
		    d.attr.renderTime = renderTime;
		}
	    } else if( d instanceof Line ) {
		this.draw.line( d.a, d.b, this.drawConfig.line.color,  this.drawConfig.line.lineWidth );
		if( !this.drawConfig.drawHandlePoints || !d.a.attr.selectable ) 
		    d.a.attr.renderTime = renderTime;
		if( !this.drawConfig.drawHandlePoints || !d.b.attr.selectable ) 
		    d.b.attr.renderTime = renderTime;
	    } else if( d instanceof Vector ) {
		this.draw.arrow( d.a, d.b, this.drawConfig.vector.color ); // , this.drawConfig.vector.lineWidth );
		if( this.drawConfig.drawHandlePoints && d.b.attr.selectable ) {
		    this.draw.circleHandle( d.b, 3, '#a8a8a8' );
		} else {
		    d.b.attr.renderTime = renderTime;	
		}
		if( !this.drawConfig.drawHandlePoints || !d.a.attr.selectable ) 
		    d.a.attr.renderTime = renderTime;
		if( !this.drawConfig.drawHandlePoints || !d.b.attr.selectable ) 
		    d.b.attr.renderTime = renderTime;
		
	    } else if( d instanceof PBImage ) {
		if( this.drawConfig.drawHandleLines )
		    this.draw.line( d.upperLeft, d.lowerRight, this.drawConfig.image.color, this.drawConfig.image.lineWidth );
		this.fill.image( d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft) );
		if( this.drawConfig.drawHandlePoints ) {
		    this.draw.circleHandle( d.lowerRight, 3, this.drawConfig.image.color );
		    d.lowerRight.attr.renderTime = renderTime;
		}
	    } else {
		this.console.error( 'Cannot draw object. Unknown class.'); //  ' + d.constructor.name + '.' );
	    }
	}
    };



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
    drawSelectPolygon() {
	// Draw select polygon?
	if( this.selectPolygon != null && this.selectPolygon.vertices.length > 0 ) {
	    this.draw.polygon( this.selectPolygon, '#888888' );
	    this.draw.crosshair( this.selectPolygon.vertices[0], 3, '#008888' );
	}
    };
    

    
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
    drawVertices( renderTime:number ) {
	// Draw all vertices as small squares if they were not already drawn by other objects
	for( var i in this.vertices ) {
	    if( this.drawConfig.drawVertices && this.vertices[i].attr.renderTime != renderTime ) {
		this.draw.squareHandle( this.vertices[i], 5, this.vertices[i].attr.isSelected ? 'rgba(192,128,0)' : this._handleColor(this.vertices[i],'rgb(0,128,192)') );
	    }
	}
    };
    

    
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
    redraw() {
	var renderTime : number = new Date().getTime();

	if( this.config.preClear ) this.config.preClear();
	this.clear();
	if( this.config.preDraw ) this.config.preDraw();

	// Tell the drawing library that a new drawing cycle begins (required for the GL lib).
	this.draw.beginDrawCycle();
	this.fill.beginDrawCycle();
	
	this.drawGrid();
	if( this.config.drawOrigin )
	    this.drawOrigin(); 
	this.drawDrawables(renderTime);
	this.drawVertices(renderTime);
	this.drawSelectPolygon();

	if( this.config.postDraw ) this.config.postDraw();
	
    }; // END redraw



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
    clear() {
	// Note that elements might have an alpha channel. Clear the scene first.
	this.draw.clear( this.config.backgroundColor );
    };


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
    clearSelection( redraw?:boolean ) {
	for( var i in this.vertices ) 
	    this.vertices[i].attr.isSelected = false;
	if( redraw )
	    this.redraw();
	return this;
    };


    /**
     * Get the current view port.
     *
     * @method viewPort
     * @instance
     * @memberof PlotBoilerplate
     * @return {Bounds} The current viewport.
     **/
    viewport() : Bounds {
	return new Bounds( this.transformMousePosition(0,0),
			   this.transformMousePosition(this.canvasSize.width*this.config.cssScaleX,this.canvasSize.height*this.config.cssScaleY)
			 );
    };

    
    /**
     * Trigger the saveFile.hook.
     *
     * @method saveFile
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    saveFile() {
    	this.hooks.saveFile(this);
    };



    /**
     * Get the available inner space of the given container.
     *
     * Size minus padding minus border.
     **/	
    private getAvailableContainerSpace() : XYDimension {
	const _self : PlotBoilerplate = this;
	// var container : HTMLElement = _self.canvas.parentNode;
	const container : HTMLElement = (_self.canvas.parentNode as unknown) as HTMLElement; // Element | Document | DocumentFragment;
	var canvas : HTMLCanvasElement = _self.canvas;
	canvas.style.display = 'none';
	var
	padding : number = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding') ) || 0,
	border : number = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-width') ) || 0,
	pl : number = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-left') ) || padding,
	pr : number = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-right') ) || padding,
	pt : number = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-top') ) || padding,
	pb : number = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-bottom') ) || padding,
	bl : number = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-left-width') ) || border,
	br : number = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-right-width') ) || border,
	bt : number = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-top-width') ) || border,
	bb : number = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-bottom-width') ) || border;
	var w : number = container.clientWidth; 
	var h : number = container.clientHeight;
	canvas.style.display = 'block';
	return { width : (w-pl-pr-bl-br), height : (h-pt-pb-bt-bb) };
    }; 


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
    resizeCanvas() {
	const _self : PlotBoilerplate = this;
	const _setSize = (w:number,h:number) => {
	    w *= _self.config.canvasWidthFactor;
	    h *= _self.config.canvasHeightFactor;
	    _self.canvas.width      = w; 
	    _self.canvas.height     = h; 
	    _self.canvasSize.width  = w;
	    _self.canvasSize.height = h;
	    if( _self.config.autoAdjustOffset ) {
		_self.draw.offset.x = _self.fill.offset.x = _self.config.offsetX = w*(_self.config.offsetAdjustXPercent/100); 
		_self.draw.offset.y = _self.fill.offset.y = _self.config.offsetY = h*(_self.config.offsetAdjustYPercent/100);
	    }
	};
	if( _self.config.fullSize && !_self.config.fitToParent ) {
	    // Set editor size
	    var width : number  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	    var height : number = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	    _self.canvas.style.position = 'absolute';
	    _self.canvas.style.width = (_self.config.canvasWidthFactor * width) + 'px';
	    _self.canvas.style.height = (_self.config.canvasWidthFactor * height) + 'px';
	    _self.canvas.style.top = '0px';
	    _self.canvas.style.left = '0px';
	    _setSize( width, height );
	} else if( _self.config.fitToParent ) {
	    // Set editor size
	    _self.canvas.style.position = 'absolute';
	    const space : XYDimension = this.getAvailableContainerSpace();
	    // window.alert( space.width + " " + space.height );
	    _self.canvas.style.width = (_self.config.canvasWidthFactor*space.width)+'px';
	    _self.canvas.style.height = (_self.config.canvasHeightFactor*space.height)+'px';
	    _self.canvas.style.top = null;
	    _self.canvas.style.left = null;
	    _setSize( space.width, space.height );		
	} else {
	    _self.canvas.style.width = null;
	    _self.canvas.style.height = null;
            _setSize( _self.config.defaultCanvasWidth, _self.config.defaultCanvasHeight );
	}
	
	if( _self.config.redrawOnResize )
	    _self.redraw();
    };


    /**
     *  Add all vertices inside the polygon to the current selection.<br>
     *
     * @method selectVerticesInPolygon
     * @param {Polygon} polygon - The polygonal selection area.
     * @instance
     * @memberof PlotBoilerplate
     * @return {void}
     **/
    selectVerticesInPolygon( polygon:Polygon ) {
	for( var i in this.vertices ) {
	    if( this.vertices[i].attr.selectable && polygon.containsVert(this.vertices[i]) ) 
		this.vertices[i].attr.isSelected = true;
	}
    };



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
    private locatePointNear( point:XYCoords, tolerance?:number ) : IDraggable|null { 
	const _self : PlotBoilerplate = this;
	// var tolerance = 7;
	if( typeof tolerance == 'undefined' )
	    tolerance = 7;
	// Apply the zoom (the tolerant area should not shrink or grow when zooming)
	tolerance /= _self.draw.scale.x;
	// Search in vertices
	// for( var vindex in _self.vertices ) {
	for( var vindex = 0; vindex < _self.vertices.length; vindex++ ) {
	    var vert : Vertex = _self.vertices[vindex];
	    if( (vert.attr.draggable || vert.attr.selectable) && vert.distance(point) < tolerance ) {
		// { type : 'vertex', vindex : vindex };
		return new PlotBoilerplate.Draggable( vert, PlotBoilerplate.Draggable.VERTEX ).setVIndex(vindex); 
	    }
	} 
	return null;
    }


    /**
     * Handle left-click event.<br> 
     *
     * @method handleClick
     * @param {number} x - The click X position on the canvas.
     * @param {number} y - The click Y position on the canvas.
     * @private
     * @return {void}
     **/
    private handleClick(x:number,y:number) {
	const _self : PlotBoilerplate = this;
	var p : IDraggable = this.locatePointNear( _self.transformMousePosition(x, y), PlotBoilerplate.DEFAULT_CLICK_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
	if( p ) { 
	    if( this.keyHandler && this.keyHandler.isDown('shift') ) {
		if( p.typeName == 'bpath' ) {
		    let vert : Vertex = _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid);
		    if( vert.attr.selectable )
			vert.attr.isSelected = !vert.attr.isSelected;
		} else if( p.typeName == 'vertex' ) {
		    let vert : Vertex = _self.vertices[p.vindex];
		    if( vert.attr.selectable )
			vert.attr.isSelected = !vert.attr.isSelected;
		}
		_self.redraw();
	    } else if( this.keyHandler.isDown('y') /* && p.type=='bpath' && (p.pid==BezierPath.START_POINT || p.pid==BezierPath.END_POINT) */ ) {
		_self.vertices[p.vindex].attr.bezierAutoAdjust = !_self.vertices[p.vindex].attr.bezierAutoAdjust;
		_self.redraw();
	    }
	}
	else if( _self.selectPolygon != null ) {
	    const vert : XYCoords = _self.transformMousePosition( x, y );
	    _self.selectPolygon.vertices.push( new Vertex(vert.x,vert.y) );
	    _self.redraw();
	}
    }



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
    transformMousePosition( x:number, y:number ) : XYCoords {
	return { x : (x/this.config.cssScaleX-this.config.offsetX)/(this.config.scaleX),
		 y : (y/this.config.cssScaleY-this.config.offsetY)/(this.config.scaleY) };
    };

    /**
     * Revert a transformed mouse position back to canvas coordinates.
     *
     * This is the inverse function of `transformMousePosition`.
     *
     * @param {number} x - The x component of the position to revert.
     * @param {number} y - The y component of the position to revert.
     * @return {XYCoords} The canvas coordinates for the given position.
     **/
    revertMousePosition( x:number, y:number ) : XYCoords {
	return { x : x / this.config.cssScaleX + this.config.offsetX,
		 y : y / this.config.cssScaleY + this.config.offsetY };
    }



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
    private mouseDownHandler(e:XMouseEvent) {
	const _self = this;
	if( e.which != 1 ) // && !(window.TouchEvent && e.originalEvent instanceof TouchEvent) )
	    return; // Only react on left mouse or touch events
	var p : IDraggable = _self.locatePointNear( _self.transformMousePosition(e.params.pos.x, e.params.pos.y),
						   PlotBoilerplate.DEFAULT_CLICK_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
	if( !p ) return;
	// Drag all selected elements?
	if( p.typeName == 'vertex' && _self.vertices[p.vindex].attr.isSelected ) {
	    // Multi drag
	    // for( var i in _self.vertices ) {
	    for( var i = 0; i < _self.vertices.length; i++ ) {
		if( _self.vertices[i].attr.isSelected ) {
		    _self.draggedElements.push( new PlotBoilerplate.Draggable( _self.vertices[i], PlotBoilerplate.Draggable.VERTEX ).setVIndex(i) );
		    _self.vertices[i].listeners.fireDragStartEvent( e );
		}
	    }
	} else {
	    // Single drag
	    if( !_self.vertices[p.vindex].attr.draggable )
		return;
	    _self.draggedElements.push( p );
	    if( p.typeName == 'bpath' )
		_self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragStartEvent( e );
	    else if( p.typeName == 'vertex' )
		_self.vertices[p.vindex].listeners.fireDragStartEvent( e );
	}
	_self.redraw();
    };



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
    private mouseDragHandler(e:XMouseEvent) {
	const _self : PlotBoilerplate = this;
	const oldDragAmount : XYCoords = { x : e.params.dragAmount.x, y : e.params.dragAmount.y };
	e.params.dragAmount.x /= _self.config.cssScaleX;
	e.params.dragAmount.y /= _self.config.cssScaleY;
	// Important note to: this.keyHandler.isDown('ctrl')
	//    We should not use this for any input.
	//    Reason: most browsers use [Ctrl]+[t] to create new browser tabs.
	//            If so, the key-up event for [Ctrl] will be fired in the _new tab_,
	//            not this one. So this tab will never receive any [Ctrl-down] events
	//            until next keypress; the implication is, that [Ctrl] would still
	//            considered to be pressed which is not true.
	if( this.keyHandler.isDown('alt') || this.keyHandler.isDown('spacebar') ) {
	    _self.setOffset( _self.draw.offset.clone().add( e.params.dragAmount ) );
	    _self.redraw();
	} else { 
	    // Convert drag amount by scaling
	    // Warning: this possibly invalidates the dragEvent for other listeners!
	    //          Rethink the solution when other features are added.
	    e.params.dragAmount.x /= _self.draw.scale.x;
	    e.params.dragAmount.y /= _self.draw.scale.y;		
	    for( var i in _self.draggedElements ) { 
		var p = _self.draggedElements[i];
		if( p.typeName == 'bpath' ) {
		    _self.paths[p.pindex].moveCurvePoint( p.cindex, p.pid, new Vertex(e.params.dragAmount.x, e.params.dragAmount.y ) );
		    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent( e );
		} else if( p.typeName == 'vertex' ) {
		    if( !_self.vertices[p.vindex].attr.draggable )
			continue;
		    _self.vertices[p.vindex].add( e.params.dragAmount );
		    _self.vertices[p.vindex].listeners.fireDragEvent( e );
		}
	    }
	}
	// Restore old event values!
	e.params.dragAmount.x = oldDragAmount.x;
	e.params.dragAmount.y = oldDragAmount.y;
	_self.redraw();
    };



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
    private mouseUpHandler(e:XMouseEvent) {
	const _self : PlotBoilerplate = this;
	if( e.which != 1 )
	    return; // Only react on left mouse;
	if( !e.params.wasDragged )
	    _self.handleClick( e.params.pos.x, e.params.pos.y );
	for( var i in _self.draggedElements ) {
	    var p : IDraggable = _self.draggedElements[i];
	    if( p.typeName == 'bpath' ) {
		_self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent( e );
	    } else if( p.typeName == 'vertex' ) {
		_self.vertices[p.vindex].listeners.fireDragEndEvent( e );
	    }
	}
	_self.draggedElements = [];
	_self.redraw();
    };



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
    private mouseWheelHandler(e:XMouseEvent) {
	var zoomStep : number = 1.25;  // Make configurable?
	// CHANGED replaced _self by this
	const _self : PlotBoilerplate = this;
	const we : WheelEvent = ((e as unknown) as WheelEvent);
	if( we.deltaY < 0 ) {
	    _self.setZoom( _self.config.scaleX*zoomStep, _self.config.scaleY*zoomStep, new Vertex(e.params.pos.x, e.params.pos.y) );
	} else if( we.deltaY > 0 ) {
	    _self.setZoom( _self.config.scaleX/zoomStep, _self.config.scaleY/zoomStep, new Vertex(e.params.pos.x, e.params.pos.y) );
	}
	
	e.preventDefault();
	_self.redraw();
    };

    /**
     * Set the new draw offset.
     *
     * Note: the function will not trigger any redraws.
     *
     * @param {Vertex} newOffset - The new draw offset to use.
     **/
    private setOffset( newOffset : XYCoords ) {
	this.draw.offset.set( newOffset );
	this.fill.offset.set( newOffset );
	this.config.offsetX = newOffset.x;
	this.config.offsetY = newOffset.y;
    };

     /**
     * Set a new zoom value (and re-adjust the draw offset).
     *
     * Note: the function will not trigger any redraws.
     *
     * @param {number} zoomFactorX - The new horizontal zoom value.
     * @param {number} zoomFactorY - The new vertical zoom value.
     * @param {Vertex} interactionPos - The position of mouse/touch interaction.
     **/
    private setZoom(zoomFactorX : number, zoomFactorY : number, interactionPos : Vertex ) {
	let oldPos : XYCoords = this.transformMousePosition(interactionPos.x, interactionPos.y);
	this.draw.scale.x = this.fill.scale.x = this.config.scaleX = Math.max(zoomFactorX,0.01);
	this.draw.scale.y = this.fill.scale.y = this.config.scaleY = Math.max(zoomFactorY,0.01);
	let newPos : XYCoords = this.transformMousePosition(interactionPos.x, interactionPos.y);
	let newOffsetX : number = this.draw.offset.x + (newPos.x-oldPos.x)*this.draw.scale.x;
	let newOffsetY : number = this.draw.offset.y + (newPos.y-oldPos.y)*this.draw.scale.y;
	this.setOffset( { x : newOffsetX, y : newOffsetY } );
    }


    private installInputListeners() {
	var _self : PlotBoilerplate = this;
	if( this.config.enableMouse ) { 
	    // Install a mouse handler on the canvas.
	    new MouseHandler(this.canvas)
		.down( (e:XMouseEvent) => { _self.mouseDownHandler(e); } )
		.drag( (e:XMouseEvent) => { _self.mouseDragHandler(e); } )
		.up( (e:XMouseEvent) => { _self.mouseUpHandler(e); } )
	    ;
	} else { _self.console.log('Mouse interaction disabled.'); }
	
	if( this.config.enableMouseWheel ) { 
	    // Install a mouse handler on the canvas.
	    new MouseHandler(this.canvas)
		.wheel( (e:XWheelEvent) => { _self.mouseWheelHandler(e); } );
	} else { _self.console.log('Mouse wheel interaction disabled.'); }
	
	if( this.config.enableTouch) { 
	    // Install a touch handler on the canvas.
	    const relPos = (pos:XYCoords) : XYCoords => {
		return { x : pos.x - _self.canvas.offsetLeft,
			 y : pos.y - _self.canvas.offsetTop
		       };
	    }
	    
	    if( window["AlloyFinger"] && typeof window["AlloyFinger"] == "function" ) {
		// console.log('Alloy finger found.');
		
		try {
		    // Do not include AlloyFinger itself to the library
		    // (17kb, but we want to keep this lib as tiny as possible).
		    const AF : AlloyFinger = window["AlloyFinger"] as AlloyFinger;
		    var touchMovePos : Vertex|undefined|null= null;
		    var touchDownPos : Vertex|undefined|null = null;
		    var draggedElement : IDraggable|undefined|null = null;
		    var multiTouchStartScale : Vertex|undefined|null = null;
		    var clearTouch = () => {
			touchMovePos = null;
			touchDownPos = null;
			draggedElement = null;
			multiTouchStartScale = null;
		    };
		    var af = new AF( this.canvas, {
			touchStart: function (e) {
			    if( e.touches.length == 1 ) {
				touchMovePos = new Vertex( relPos( { x : e.touches[0].clientX, y : e.touches[0].clientY } ) );
				touchDownPos = new Vertex( relPos( { x : e.touches[0].clientX, y : e.touches[0].clientY } ) );
				draggedElement = _self.locatePointNear( _self.transformMousePosition(touchMovePos.x, touchMovePos.y), PlotBoilerplate.DEFAULT_TOUCH_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
				if( draggedElement && draggedElement.typeName == 'vertex' ) {
				    var draggingVertex : Vertex = _self.vertices[draggedElement.vindex];
				    var fakeEvent : VertEvent = ({ params : { dragAmount : { x: 0, y : 0 }, wasDragged : false, mouseDownPos : touchDownPos.clone(), mouseDragPos : touchDownPos.clone(), vertex : draggingVertex}} as unknown) as VertEvent;
				    draggingVertex.listeners.fireDragStartEvent( fakeEvent );
				}
			    }
			},
			touchMove: function (e) {
			    if( e.touches.length == 1 && draggedElement ) {
				e.preventDefault();
				e.stopPropagation(); 
				var rel : XYCoords = relPos( { x : e.touches[0].clientX, y : e.touches[0].clientY } ); //  points[0] );
				var trans : XYCoords = _self.transformMousePosition( rel.x, rel.y ); 
				var diff : Vertex = new Vertex(_self.transformMousePosition( touchMovePos.x, touchMovePos.y )).difference(trans);
				if( draggedElement.typeName == 'vertex' ) {
				    if( !_self.vertices[draggedElement.vindex].attr.draggable )
					return;
				    _self.vertices[draggedElement.vindex].add( diff );
				    var draggingVertex : Vertex = _self.vertices[draggedElement.vindex];
				    var fakeEvent : VertEvent = ({ params : { dragAmount : diff.clone(), wasDragged : true, mouseDownPos : touchDownPos.clone(), mouseDragPos : touchDownPos.clone().add(diff), vertex : draggingVertex}} as unknown) as VertEvent;
				    draggingVertex.listeners.fireDragEvent( fakeEvent );
				    _self.redraw();
				}
				touchMovePos = new Vertex(rel);
			    } else if( e.touches.length == 2 ) {
				// If at least two fingers touch and move, then change the draw offset (panning).
				e.preventDefault();
				e.stopPropagation();
				_self.setOffset( _self.draw.offset.clone().addXY( e.deltaX, e.deltaY ) ); // Apply zoom?
				_self.redraw();
			    }
			},
			touchEnd:  function (e) {
			    // Note: e.touches.length is 0 here
			    if( draggedElement && draggedElement.typeName == 'vertex' ) {
				var draggingVertex : Vertex = _self.vertices[draggedElement.vindex];
				var fakeEvent : VertEvent = ({ params : { dragAmount : { x: 0, y : 0 }, wasDragged : false, mouseDownPos : touchDownPos.clone(), mouseDragPos : touchDownPos.clone(), vertex : draggingVertex}} as unknown) as VertEvent;
				draggingVertex.listeners.fireDragEndEvent( fakeEvent );
			    }
			    clearTouch();
			},
			touchCancel: function (e) {
			    clearTouch();
			},
			multipointStart: function (e) {
			    multiTouchStartScale = _self.draw.scale.clone();
			},
			multipointEnd: function (e) {
			    multiTouchStartScale = null;
			},
			pinch: function (e) {
			    // For pinching there must be at least two touch items
			    const fingerA : Vertex = new Vertex( e.touches.item(0).clientX, e.touches.item(0).clientY );
			    const fingerB : Vertex = new Vertex( e.touches.item(1).clientX, e.touches.item(1).clientY );
			    const center : Vertex = new Line( fingerA, fingerB ).vertAt( 0.5 );
			    _self.setZoom( multiTouchStartScale.x*e.zoom, multiTouchStartScale.y*e.zoom, center );
			    _self.redraw();
			}
		    });
		} catch( e ) {
		    console.error("Failed to initialize AlloyFinger!");
		    console.error(e);
		};

	    } else if( window["Touchy"] && typeof window["Touchy"] == "function" ) {
		console.error('[Deprecation] Found Touchy which is not supported any more. Please use AlloyFinger instead.');
		// Convert absolute touch positions to relative DOM element position (relative to canvas)
	    } else {
		console.warn( "Cannot initialize the touch handler. AlloyFinger is missig. Did you include it?" );
	    }
	} else { _self.console.log('Touch interaction disabled.'); }
	
	if( this.config.enableKeys ) {
	    // Install key handler
	    this.keyHandler = new KeyHandler( { trackAll : true } )
		.down('escape',function() {
		    _self.clearSelection(true);
		} )
		.down('shift',function() {
		    _self.selectPolygon = new Polygon();
		    _self.redraw();
		} )
		.up('shift',function() {
		    // Find and select vertices in the drawn area
		    if( _self.selectPolygon == null )
			return;
		    _self.selectVerticesInPolygon( _self.selectPolygon );
		    _self.selectPolygon = null;
		    _self.redraw();
		} )
	    ;
	} // END IF enableKeys?
	else  { _self.console.log('Keyboard interaction disabled.'); }

    }


    /**
     * Creates a control GUI (a dat.gui instance) for this 
     * plot boilerplate instance.
     *
     * @method createGUI
     * @instance
     * @memberof PlotBoilerplate
     * @return {dat.gui.GUI} 
     **/
    createGUI() : GUI {
	// This function moved to the helper utils.
	// We do not want to include the whole dat.GUI package.
	// TODO: move to demos.
	if( window["utils"] && typeof window["utils"].createGUI == "function" )
	    return window["utils"].createGUI(this);
	else
	    throw "Cannot create dat.GUI instance; did you load the ./utils/creategui helper function an the dat.GUI library?";
    };

    /**
     * A set of helper functions.
     * @private
     **/
    static utils = {
	
	/** 
	 * Merge the elements in the 'extension' object into the 'base' object based on
	 * the keys of 'base'.
	 *
	 * @param {Object} base
	 * @param {Object} extension
	 * @return {Object} base extended by the new attributes.
	 **/
	safeMergeByKeys : ( base:Object, extension:Object ) : Object => {
	    for( var k in extension ) {
		if( !extension.hasOwnProperty(k) )
		    continue;
		console.log(k, extension[k]);
		if( base.hasOwnProperty(k) ) {
		    var typ = typeof base[k];
		    try {
			if( typ == 'boolean' ) base[k] = !!JSON.parse(extension[k]);
			else if( typ == 'number' ) base[k] = JSON.parse(extension[k])*1;
			else if( typ == 'function' && typeof extension[k] == 'function' ) base[k] = extension[k] ;
			else base[k] = extension[k];
		    } catch( e ) {
			console.error( 'error in key ', k, extension[k], e );
		    }
		} else {
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
	setCSSscale : ( element:HTMLElement,
			scaleX:number,
			scaleY:number ) : void => {
	    element.style['transform-origin'] = '0 0';
	    if( scaleX==1.0 && scaleY==1.0 ) element.style.transform = null;
	    else                             element.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
	},
	
	// A helper for fetching data from objects.
	fetch : {
	    /**
	     * A helper function to the the object property value specified by the given key.
	     *
	     * @param {any} object   - The object to get the property's value from. Must not be null.
	     * @param {string} key      - The key of the object property (the name).
	     * @param {any}    fallback - A default value if the key does not exist.
	     **/
	    val : ( obj:any, key:string, fallback:any ) => {
		if( !obj.hasOwnProperty(key) )
		    return fallback;
		if( typeof obj[key] == 'undefined' )
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
	    num : ( obj:any, key:string, fallback:number ) => {
		if( !obj.hasOwnProperty(key) )
		    return fallback;
		if( typeof obj[key] === 'number' )
		    return obj[key];
		else {
		    try {
			return JSON.parse(obj[key])*1;
		    } catch( e ) {
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
	    bool : ( obj:any, key:string, fallback:boolean ) => {
		if( !obj.hasOwnProperty(key) )
		    return fallback;
		if( typeof obj[key] == 'boolean' )
		    return obj[key];
		else {
		    try {
			return !!JSON.parse(obj[key]);
		    } catch( e ) {
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
	    func : ( obj:any, key:string, fallback:((...args)=>any) ) => {
		if( !obj.hasOwnProperty(key) )
		    return fallback;
		if( typeof obj[key] !== 'function' )
		    return fallback;
		return obj[key];
	    }
	},  // END fetch
	
	/**
	 * Installs vertex listeners to the path's vertices so that controlpoints
	 * move with their path points when dragged.
	 *
	 * Bézier path points with attr.bezierAutoAdjust==true will have their
	 * two control points audo-updated if moved, too (keep path connections smooth).
	 *
	 * @param {BezierPath} bezierPath - The path to use auto-adjustment for.
	 **/
	enableBezierPathAutoAdjust : ( bezierPath : BezierPath ) => {
	    for( var i = 0; i < bezierPath.bezierCurves.length; i++ ) {
		// This should be wrapped into the BezierPath implementation.
		bezierPath.bezierCurves[i].startPoint.listeners.addDragListener( function(e) {
		    var cindex : number = bezierPath.locateCurveByStartPoint( e.params.vertex );
		    bezierPath.bezierCurves[cindex].startPoint.addXY( -e.params.dragAmount.x, -e.params.dragAmount.y );
		    bezierPath.moveCurvePoint( cindex*1, 
					     bezierPath.START_POINT,     
					     e.params.dragAmount 
					   );
		    bezierPath.updateArcLengths();
		} );
		bezierPath.bezierCurves[i].startControlPoint.listeners.addDragListener( function(e) {
		    var cindex : number = bezierPath.locateCurveByStartControlPoint( e.params.vertex );
		    if( !bezierPath.bezierCurves[cindex].startPoint.attr.bezierAutoAdjust )
			return;
		    bezierPath.adjustPredecessorControlPoint( cindex*1, 
							    true,      // obtain handle length?
							    false      // update arc lengths
							  );
		    bezierPath.updateArcLengths();
		} );
		bezierPath.bezierCurves[i].endControlPoint.listeners.addDragListener( function(e) {
		    var cindex : number = bezierPath.locateCurveByEndControlPoint( e.params.vertex );
		    if( !bezierPath.bezierCurves[cindex%bezierPath.bezierCurves.length].endPoint.attr.bezierAutoAdjust )
			return;
		    bezierPath.adjustSuccessorControlPoint( cindex*1, 
							  true,        // obtain handle length?
							  false        // update arc lengths
							);
		    bezierPath.updateArcLengths();
		} );
		if( i+1 == bezierPath.bezierCurves.length ) { // && !bezierPath.adjustCircular ) { 
		    // Move last control point with the end point (if not circular)
		    bezierPath.bezierCurves[bezierPath.bezierCurves.length-1].endPoint.listeners.addDragListener( function(e) {
			if( !bezierPath.adjustCircular ) {
			    var cindex : number = bezierPath.locateCurveByEndPoint( e.params.vertex );
			    bezierPath.moveCurvePoint( cindex*1, 
						     bezierPath.END_CONTROL_POINT,     
						     new Vertex( { x: e.params.dragAmount.x, y : e.params.dragAmount.y } )
						   ); 
			}
			bezierPath.updateArcLengths();
		    } ); 
		}
	    } // END for
	},

	/**
	 * Removes vertex listeners from the path's vertices. This needs to be called
	 * when BezierPaths are removed from the canvas.
	 *
	 * Sorry, this is not yet implemented.
	 *
	 * @param {BezierPath} bezierPath - The path to use un-auto-adjustment for.
	 **/
	disableBezierPathAutoAdjust : ( bezierPath : BezierPath ) => {
	    // How to determine which listeners are mine???
	    /*
	      for( var i = 0; i < bezierPath.bezierCurves.length; i++ ) {
		// Just try to remove listeners from all vertices on the Bézier path.
		// No matter if there are not listeners installed for some reason.
		bezierPath.bezierCurves[i].startPoint.listeners.removeDragListener( );
		}
	    */
	}
	
    }; // END utils
} // END class PlotBoilerplate
