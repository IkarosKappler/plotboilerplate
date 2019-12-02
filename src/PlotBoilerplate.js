/**
 * @classdesc The main class of the PlotBoilerplate.
 *
 * @requires Vertex, Line, Vector, Polygon, PBImage, MouseHandler, KeyHandler, VertexAttr, CubicBezierCurve, BezierPath, Triangle, drawutils, drawutilsgl
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
 * @version  1.5.1
 *
 * @file PlotBoilerplate
 * @public
 **/


(function(_context) {
    "use strict";

    /** @constant {number} */
    const DEFAULT_CANVAS_WIDTH    = 1024;
    /** @constant {number} */
    const DEFAULT_CANVAS_HEIGHT   =  768;
    /** @constant {number} */
    const DEFAULT_CLICK_TOLERANCE =    8;
    /** @constant {number} */
    const DEFAULT_TOUCH_TOLERANCE =   32;


 
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
    var setCSSscale = function( element, scaleX, scaleY ) {
	element.style['transform-origin'] = '0 0';
	if( scaleX==1.0 && scaleY==1.0 ) element.style.transform = null;
	else                             element.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
    };


    /**
     * A wrapper class for draggable items (mostly vertices).
     * @private
     **/
    (function(_context) {
	var Draggable = function( item, type ) {
	    this.item = item;
	    this.type = type;
	    this.vindex = null;
	    this.pindex = null;
	    this.cindex = null;
	};
	Draggable.VERTEX = 'vertex';
	Draggable.prototype.isVertex = function() { return this.type == Draggable.VERTEX; };
	Draggable.prototype.setVIndex = function(vindex) { this.vindex = vindex; return this; };

	_context.Draggable = Draggable;
    })(_context);


    /**
     * Use a special custom attribute set for vertices.
     **/
    VertexAttr.model = { bezierAutoAdjust : false, renderTime : 0, selectable : true, isSelected : false, draggable : true };
    

    /** 
     * The constructor.
     *
     * @constructor
     * @name PlotBoilerplate
     * @param {object} config={} - The configuration.
     * @param {HTMLElement} config.canvas - Your canvas element in the DOM (required).
     * @param {boolean=} [config.fullSize=true] - If set to true the canvas will gain full window size.
     * @param {boolean=} [config.fitToParent=true] - If set to true the canvas will gain the size of its parent container (overrides fullSize).
     * @param {number=}  [config.scaleX=1.0] - The initial x-zoom. Default is 1.0.
     * @param {number=}  [config.scaleY=1.0] - The initial y-zoom. Default is 1.0.
     * @param {boolean=} [config.rasterGrid=true] - If set to true the background grid will be drawn rastered.
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
     * @param {boolean=} [config.enableTouch=true] - Indicates if the application should handle key events for you.
     * @param {boolean=} [config.enableMouseWheel=true] - Indicates if the application should handle mouse wheel events for you.
     * @param {boolean=} [config.enableGL=false] - Indicates if the application should use the experimental WebGL features (not recommended).
     * @param {boolean=} [config.enableSVGExport=true] - Indicates if the SVG export should be enabled (default is true). 
     *                                                   Note that changes from the postDraw hook might not be visible in the export.
     */
    var PlotBoilerplate = function( config ) {
	config = config || {};
	if( typeof config.canvas == 'undefined' )
	    throw "No canvas specified.";
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------

	/** 
	 * A config.
	 *
	 * @member {Object} 
	 * @memberof PlotBoilerplate
	 * @instance
	 */
	this.config = {
	    fullSize              : fetch.val(config,'fullSize',true), 
	    fitToParent           : fetch.bool(config,'fitToParent',true),
	    scaleX                : fetch.num(config,'scaleX',1.0), 
	    scaleY                : fetch.num(config,'scaleY',1.0), 
	    drawGrid              : fetch.bool(config,'drawGrid',true),
	    rasterGrid            : fetch.bool(config,'rasterGrid',true),
	    rasterAdjustFactor    : fetch.num(config,'rasterAdjustdFactror',2.0),
	    drawOrigin            : fetch.bool(config,'drawOrigin',false),
	    autoAdjustOffset      : fetch.val(config,'autoAdjustOffset',true),
	    offsetAdjustXPercent  : fetch.num(config,'offsetAdjustXPercent',50),
	    offsetAdjustYPercent  : fetch.num(config,'offsetAdjustYPercent',50),
	    backgroundColor       : config.backgroundColor || '#ffffff',
	    redrawOnResize        : fetch.bool(config,'redrawOnResize',true), 
	    defaultCanvasWidth    : fetch.num(config,'defaultCanvasWidth',DEFAULT_CANVAS_WIDTH),
	    defaultCanvasHeight   : fetch.num(config,'defaultCanvasHeight',DEFAULT_CANVAS_HEIGHT),
	    canvasWidthFactor     : fetch.num(config,'canvasWidthFactor',1.0),
	    canvasHeightFactor    : fetch.num(config,'canvasHeightFactor',1.0),
	    cssScaleX             : fetch.num(config,'cssScaleX',1.0),
	    cssScaleY             : fetch.num(config,'cssScaleY',1.0),
	    cssUniformScale       : fetch.bool(config,'cssUniformScale',true),
	    rebuild               : function() { rebuild(); },
	    saveFile              : function() { _self.saveFile(); },
	    enableExport          : fetch.bool(config,'enableExport',true),

	    drawBezierHandleLines : fetch.bool(config,'drawBezierHandleLines',true),
	    drawBezierHandlePoints : fetch.bool(config,'drawBezierHandlePoints',true),
	    drawHandleLines       : fetch.bool(config,'drawHandleLines',true),
	    drawHandlePoints      : fetch.bool(config,'drawHandlePoints',true),
	    
	    // Listeners/observers
	    preClear              : fetch.func(config,'preClear',null),
	    preDraw               : fetch.func(config,'preDraw',null),
	    postDraw              : fetch.func(config,'postDraw',null),

	    // Interaction
	    enableMouse           : fetch.bool(config,'enableMouse',true),
	    enableTouch           : fetch.bool(config,'enableTouch',true),
	    enableKeys            : fetch.bool(config,'enableKeys',true),
	    enableMouseWheel      : fetch.bool(config,'enableMouseWheel',true),

	    // Experimental (and unfinished)
	    enableGL              : fetch.bool(config,'enableGL',false)
	};


	/** 
	 * Configuration for drawing things.
	 *
	 * @member {Object} 
	 * @memberof PlotBoilerplate
	 * @instance
	 */
	this.drawConfig = {
	    drawVertices : true
	};


	// +---------------------------------------------------------------------------------
	// | Object members.
	// +-------------------------------
	this.canvas              = typeof config.canvas == 'string' ? document.getElementById(config.canvas) : config.canvas;
	if( this.config.enableGL ) {
	    this.ctx                 = this.canvas.getContext( 'webgl' ); // webgl-experimental?
	    this.draw                = new drawutilsgl(this.ctx,false);
	    // PROBLEM: same instance of fill and draw when using WebGL. Shader program cannot be duplicated on the same context
	    this.fill                = this.draw.copyInstance(true);
	} else {
	    this.ctx                 = this.canvas.getContext( '2d' );
	    this.draw                = new drawutils(this.ctx,false);
	    this.fill                = new drawutils(this.ctx,true);
	}
	this.draw.scale.set(this.config.scaleX,this.config.scaleY);
	this.fill.scale.set(this.config.scaleX,this.config.scaleY);
	this.grid                = new Grid( new Vertex(0,0), new Vertex(50,50) );
	this.image               = null; // An image.
	this.imageBuffer         = null; // A canvas to read the pixel data from.
	this.canvasSize          = { width : DEFAULT_CANVAS_WIDTH, height : DEFAULT_CANVAS_HEIGHT };
	this.vertices            = [];
	this.selectPolygon       = null;
	this.draggedElements     = [];
	this.drawables           = [];
	this.console             = console;
	var _self = this;


	/**
	 * This function opens a save-as file dialog and – once an output file is
	 * selected – stores the current canvas contents as an SVG image.
	 *
	 * It is the default hook for saving files and can be overwritten.
	 *
	 * @method saveFile
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	var _saveFile = function() {
	    var svgCode = new SVGBuilder().build( _self.drawables, { canvasSize : _self.canvasSize, offset : _self.draw.offset, zoom : _self.draw.scale } );
	    // See documentation for FileSaver.js for usage.
	    //    https://github.com/eligrey/FileSaver.js
	    var blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" } );
	    saveAs(blob, "plot-boilerplate.svg");
	};


	/**
	 * A set of hook functions.
	 **/
	this.hooks = {
	    saveFile : _saveFile
	};

	
	// +---------------------------------------------------------------------------------
	// | After this line: object members.
	// +-------------------------------
	
	/**
	 * Set the console for this instance.
	 *
	 * @method setConsole
	 * @param {object} con - The new console object (default is window.console).
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.setConsole = function( con ) {
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
	PlotBoilerplate.prototype.updateCSSscale = function() {
	    if( this.config.cssUniformScale ) {
		setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleX );
	    } else {
		setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleY );
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
	PlotBoilerplate.prototype.add = function( drawable, redraw ) {
	    if( Array.isArray(drawable) ) {
		for( var i in drawable )
		    this.add( drawable[i] );
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
	    } else if( drawable instanceof Polygon ) {
		this.drawables.push( drawable );
		for( var i in drawable.vertices )
		    this.vertices.push( drawable.vertices[i] );
	    } else if( drawable instanceof Triangle ) {
		this.drawables.push( drawable );
		this.vertices.push( drawable.a );
		this.vertices.push( drawable.b );
		this.vertices.push( drawable.c );
	    } else if( drawable instanceof BezierPath ) {
		this.drawables.push( drawable );
		for( var i in drawable.bezierCurves ) {
		    if( !drawable.adjustCircular && i == 0 )
			this.vertices.push( drawable.bezierCurves[i].startPoint );
		    this.vertices.push( drawable.bezierCurves[i].endPoint );
		    this.vertices.push( drawable.bezierCurves[i].startControlPoint );
		    this.vertices.push( drawable.bezierCurves[i].endControlPoint );
		    drawable.bezierCurves[i].startControlPoint.attr.selectable = false;
		    drawable.bezierCurves[i].endControlPoint.attr.selectable = false;
		}
		for( var i in drawable.bezierCurves ) {	
		    // This should be wrapped into the BezierPath implementation.
		    drawable.bezierCurves[i].startPoint.listeners.addDragListener( function(e) {
			var cindex = drawable.locateCurveByStartPoint( e.params.vertex );
			drawable.bezierCurves[cindex].startPoint.addXY( -e.params.dragAmount.x, -e.params.dragAmount.y );
			drawable.moveCurvePoint( cindex*1, 
						 drawable.START_POINT,         // obtain handle length?
						 e.params.dragAmount           // update arc lengths
					       );
		    } );
		    drawable.bezierCurves[i].startControlPoint.listeners.addDragListener( function(e) {
			var cindex = drawable.locateCurveByStartControlPoint( e.params.vertex );
			if( !drawable.bezierCurves[cindex].startPoint.attr.bezierAutoAdjust )
			    return;
			drawable.adjustPredecessorControlPoint( cindex*1, 
								true,          // obtain handle length?
								true           // update arc lengths
							      );
		    } );
		    drawable.bezierCurves[i].endControlPoint.listeners.addDragListener( function(e) {
			var cindex = drawable.locateCurveByEndControlPoint( e.params.vertex );
			if( !drawable.bezierCurves[(cindex)%drawable.bezierCurves.length].endPoint.attr.bezierAutoAdjust )
			    return;
			drawable.adjustSuccessorControlPoint( cindex*1, 
							      true,            // obtain handle length?
							      true             // update arc lengths
							    );
		    } );
		} // END for
	    } else if( drawable instanceof PBImage ) {
		this.vertices.push( drawable.upperLeft );
		this.vertices.push( drawable.lowerRight );
		this.drawables.push( drawable );
		drawable.upperLeft.listeners.addDragListener( function(e) {
		    drawable.lowerRight.add( e.params.dragAmount );
		} );
		drawable.lowerRight.attr.selectable = false
	    } else {
		throw "Cannot add drawable of unrecognized type: " + drawable.constructor.name;
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
	 *  * a Polygon
	 *  * a BezierPath
	 *  * a BPImage
	 * </pre>
	 *
	 * @param {Object} drawable - The drawable (of one of the allowed class instance) to remove.
	 * @param {boolean} [redraw=false]
	 * @method remove
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.remove = function( drawable, redraw ) {
	    if( drawable instanceof Vertex )
		this.removeVertex( drawable, false );
	    for( var i in this.drawables ) {
		if( this.drawables[i] === drawable ) {
		    this.drawables.splice(i,1);
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
	PlotBoilerplate.prototype.removeVertex = function( vert, redraw ) {
	    for( var i in this.drawables ) {
		if( this.vertices[i] === vert ) {
		    this.vertices.splice(i,1);
		    if( redraw )
			this.redraw();
		    return;
		}
	    }
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
	PlotBoilerplate.prototype.drawGrid = function() {
	    var gScale = { x : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.x),
			   y : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.y) };
	    var gSize = { w : this.grid.size.x*gScale.x, h : this.grid.size.y*gScale.y };
	    var cs = { w : this.canvasSize.width/2, h : this.canvasSize.height/2 };
	    var offset = this.draw.offset.clone().inv();
	    offset.x = (Math.round(offset.x+cs.w)/Math.round(gSize.w))*(gSize.w)/this.draw.scale.x + (((this.draw.offset.x-cs.w)/this.draw.scale.x)%gSize.w);
	    offset.y = (Math.round(offset.y+cs.h)/Math.round(gSize.h))*(gSize.h)/this.draw.scale.y + (((this.draw.offset.y-cs.h)/this.draw.scale.x)%gSize.h);
	    if( this.config.drawGrid ) {
		if( this.config.rasterGrid )
		    this.draw.raster( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.w, gSize.h, 'rgba(0,128,255,0.125)' );
		else
		    this.draw.grid( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.w, gSize.h, 'rgba(0,128,255,0.095)' );
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
	PlotBoilerplate.prototype.drawOrigin = function() {
	    // Add a crosshair to mark the origin
	    this.draw.crosshair( { x : 0, y : 0 }, 10, '#000000' );
	};


	/**
	 * This is just a tiny helper function to determine the render color of vertices.
	 **/
	function _handleColor( h, color ) {
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
	PlotBoilerplate.prototype.drawDrawables = function( renderTime ) {
	    
	    // Draw drawables
	    for( var i in this.drawables ) {
		var d = this.drawables[i];
		if( d instanceof BezierPath ) {
		    for( var c in d.bezierCurves ) {
			this.draw.cubicBezier( d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, '#00a822' );

			if( this.config.drawBezierHandlePoints && this.config.drawHandlePoints ) {
			    if( !d.bezierCurves[c].startPoint.attr.bezierAutoAdjust ) {
				this.draw.diamondHandle( d.bezierCurves[c].startPoint, 7, _handleColor(d.bezierCurves[c].startPoint,'orange') );
				d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
			    }
			    if( !d.bezierCurves[c].endPoint.attr.bezierAutoAdjust ) {
				this.draw.diamondHandle( d.bezierCurves[c].endPoint, 7,  _handleColor(d.bezierCurves[c].endPoint,'orange') );
				d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
			    }
			    this.draw.circleHandle( d.bezierCurves[c].startControlPoint, 7, _handleColor(d.bezierCurves[c].startControlPoint,'#008888') );
			    this.draw.circleHandle( d.bezierCurves[c].endControlPoint, 7, _handleColor(d.bezierCurves[c].endControlPoint,'#008888') );
			    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
			} else {
			    d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].startControlPoint.attr.renderTime = renderTime;
			    d.bezierCurves[c].endControlPoint.attr.renderTime = renderTime;
			}
			
			if( this.config.drawBezierHandleLines && this.config.drawHandleLines ) {
			    this.draw.handleLine( d.bezierCurves[c].startPoint, d.bezierCurves[c].startControlPoint );
			    this.draw.handleLine( d.bezierCurves[c].endPoint, d.bezierCurves[c].endControlPoint );
			}
			
		    }
		} else if( d instanceof Polygon ) {
		    this.draw.polygon( d, '#0022a8' );
		    if( !this.config.drawHandlePoints ) {
			for( var i in d.vertices )
			    d.vertices[i].attr.renderTime = renderTime;
		    }
		} else if( d instanceof Triangle ) {
		    this.draw.polyline( [d.a,d.b,d.c], false, '#6600ff' );
		    if( !this.config.drawHandlePoints ) 
			d.a.attr.renderTime = d.b.attr.renderTime = d.c.attr.renderTime = renderTime;
		} else if( d instanceof VEllipse ) {
		    if( this.config.drawHandleLines ) {
			this.draw.line( d.center.clone().add(0,d.axis.y-d.center.y), d.axis, '#c8c8c8' );
			this.draw.line( d.center.clone().add(d.axis.x-d.center.x,0), d.axis, '#c8c8c8' );
		    }
		    this.draw.ellipse( d.center, Math.abs(d.axis.x-d.center.x), Math.abs(d.axis.y-d.center.y), '#2222a8' );
		    if( !this.config.drawHandlePoints ) {
			d.center.attr.renderTime = renderTime;
			d.axis.attr.renderTime = renderTime;
		    }
		} else if( d instanceof Vertex ) {
		    if( this.drawConfig.drawVertices &&
			(!d.attr.selectable || !d.attr.draggable) ) {
			// Draw as special point (grey)
			this.draw.circleHandle( d, 7, '#a8a8a8' );
			d.attr.renderTime = renderTime;
		    }
		} else if( d instanceof Line ) {
		    this.draw.line( d.a, d.b, '#a844a8' );
		    if( !this.config.drawHandlePoints || !d.a.attr.selectable ) 
			d.a.attr.renderTime = renderTime;
		    if( !this.config.drawHandlePoints || !d.b.attr.selectable ) 
			d.b.attr.renderTime = renderTime;
		} else if( d instanceof Vector ) {
		    // this.draw.line( d.a, d.b, '#ff44a8' );
		    this.draw.arrow( d.a, d.b, '#ff44a8' );
		    if( this.config.drawHandlePoints && d.b.attr.selectable ) {
			this.draw.circleHandle( d.b, 7, '#a8a8a8' );
		    } else {
			d.b.attr.renderTime = renderTime;	
		    }
		    // d.a.attr.renderTime = renderTime;
		    if( !this.config.drawHandlePoints || !d.a.attr.selectable ) 
			d.a.attr.renderTime = renderTime;
		    if( !this.config.drawHandlePoints || !d.b.attr.selectable ) 
			d.b.attr.renderTime = renderTime;
		    
		} else if( d instanceof PBImage ) {
		    if( this.config.drawHandleLines )
			this.draw.line( d.upperLeft, d.lowerRight, '#a8a8a8' );
		    this.fill.image( d.image, d.upperLeft, d.lowerRight.clone().sub(d.upperLeft) );
		    if( this.config.drawHandlePoints ) {
			this.draw.circleHandle( d.lowerRight, 7, '#a8a8a8' );
			d.lowerRight.attr.renderTime = renderTime;
		    }
		} else {
		    this.console.error( 'Cannot draw object. Unknown class ' + d.constructor.name + '.' );
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
	PlotBoilerplate.prototype.drawSelectPolygon = function() {
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
	PlotBoilerplate.prototype.drawVertices = function( renderTime ) {
	    // Draw all vertices as small squares if they were not already drawn by other objects
	    for( var i in this.vertices ) {
		if( this.drawConfig.drawVertices && this.vertices[i].attr.renderTime != renderTime ) {
		    this.draw.squareHandle( this.vertices[i], 5, this.vertices[i].attr.isSelected ? 'rgba(192,128,0)' : _handleColor(this.vertices[i],'rgb(0,128,192)') );
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
	PlotBoilerplate.prototype.redraw = function() {
	    var renderTime = new Date().getTime();

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
	PlotBoilerplate.prototype.clear = function() {
	    // Note that the image might have an alpha channel. Clear the scene first.
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
	PlotBoilerplate.prototype.clearSelection = function( redraw ) {
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
	PlotBoilerplate.prototype.viewport = function() {
	    return { min : this.transformMousePosition(0,0),
		     max : this.transformMousePosition(this.canvasSize.width,this.canvasSize.height)
		   };
	};
	/**
	 * @typedef {Object} Bounds
	 * @property {Vertex} min The upper left position.
	 * @property {Vertex} max The lower right position;.
	 */


	
	/**
	 * Trigger the saveFile.hook.
	 *
	 * @method saveFile
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.saveFile = function() {
	    this.hooks.saveFile();
	};



	/**
	 * Get the available inner space of the given container.
	 *
	 * Size minus padding minus border.
	 **/	
	var getAvailableContainerSpace = function() {
	    var container = _self.canvas.parentNode;
	    var canvas = _self.canvas;
	    canvas.style.display = 'none';
	    var
	    padding = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding') ) || 0,
	    border = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-width') ) || 0,
	    pl = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-left') ) || padding,
	    pr = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-right') ) || padding,
	    pt = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-top') ) || padding,
	    pb = parseFloat( window.getComputedStyle(container, null).getPropertyValue('padding-bottom') ) || padding,
	    bl = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-left-width') ) || border,
	    br = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-right-width') ) || border,
	    bt = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-top-width') ) || border,
	    bb = parseFloat( window.getComputedStyle(canvas, null).getPropertyValue('border-bottom-width') ) || border;
	    var w = container.clientWidth; 
	    var h = container.clientHeight;
	    // console.log( 'w', w, 'h', h, 'border', border, 'padding', padding, pl, pr, pt, pb, bl, br, bt, bb );
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
	PlotBoilerplate.prototype.resizeCanvas = function() {
	    var _setSize = function(w,h) {
		w *= _self.config.canvasWidthFactor;
		h *= _self.config.canvasHeightFactor;
		_self.canvas.width      = w; 
		_self.canvas.height     = h; 
		_self.canvasSize.width  = w;
		_self.canvasSize.height = h;
		if( _self.config.autoAdjustOffset ) {
		    _self.draw.offset.x = _self.fill.offset.x = w*(_self.config.offsetAdjustXPercent/100); 
		    _self.draw.offset.y = _self.fill.offset.y = h*(_self.config.offsetAdjustYPercent/100);
		}
	    };
	    if( _self.config.fullSize && !_self.config.fitToParent ) {
		// Set editor size
		var width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		_self.canvas.style.position = 'absolute';
		_self.canvas.style.width = width+'px';
		_self.canvas.style.height = height+'px';
		_self.canvas.style.top = 0;
		_self.canvas.style.left = 0;
		_setSize( width, height );
	    } else if( _self.config.fitToParent ) {
		// Set editor size
		_self.canvas.style.position = 'absolute';
		var space = getAvailableContainerSpace( _self.canvas.parentNode );
		_self.canvas.style.width = (_self.config.canvasWidthFactor*space.width)+'px';
		_self.canvas.style.height = (_self.config.canvasHeightFactor*space.height)+'px';
		_self.canvas.style.top = null;
		_self.canvas.style.left = null;
		_setSize( space.width, space.height );		
	    } else {
		_self.canvas.style.width = null; // space.width+'px';
		_self.canvas.style.height = null; //space.height+'px';
                _setSize( _self.config.defaultCanvasWidth, _self.config.defaultCanvasHeight );
	    }
	    
	    if( _self.config.redrawOnResize )
		_self.redraw();
	};
	_context.addEventListener( 'resize', this.resizeCanvas );
	this.resizeCanvas();



	/**
	 *  Add all vertices inside the polygon to the current selection.<br>
	 *
	 * @method selectVerticesInPolygon
	 * @param {Polygon} polygon - The polygonal selection area.
	 * @instance
	 * @memberof PlotBoilerplate
	 * @return {void}
	 **/
	PlotBoilerplate.prototype.selectVerticesInPolygon = function( polygon ) {
	    for( var i in this.vertices ) {
		if( polygon.containsVert(this.vertices[i]) ) 
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
	 * @return {Draggable} Or false if none found.
	 **/
        var locatePointNear = function( point, tolerance ) {
            // var tolerance = 7;
	    if( typeof tolerance == 'undefined' )
		tolerance = 7;
	    // Apply the zoom (the tolerant area should not shrink or grow when zooming)
	    tolerance /= _self.draw.scale.x;
	    // Search in vertices
	    for( var vindex in _self.vertices ) {
		var vert = _self.vertices[vindex];
		if( (vert.attr.draggable || vert.attr.selectable) && vert.distance(point) < tolerance ) {
		    // { type : 'vertex', vindex : vindex };
		    return new Draggable( vert, Draggable.VERTEX ).setVIndex(vindex); 
		}
	    } 
            return false;
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
	function handleClick(x,y) {
	    var p = locatePointNear( _self.transformMousePosition(x, y), DEFAULT_CLICK_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
	    if( p ) { 
		if( keyHandler.isDown('shift') ) {
		    if( p.type == 'bpath' ) {
			let vert = _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid);
			if( vert.attr.selectable )
			    vert.attr.isSelected = !vert.attr.isSelected;
		    } else if( p.type == 'vertex' ) {
			let vert = _self.vertices[p.vindex];
			if( vert.attr.selectable )
			    vert.attr.isSelected = !vert.attr.isSelected;
		    }
		    _self.redraw();
		} else if( keyHandler.isDown('y') /* && p.type=='bpath' && (p.pid==BezierPath.START_POINT || p.pid==BezierPath.END_POINT) */ ) {
		    _self.vertices[p.vindex].attr.bezierAutoAdjust = !_self.vertices[p.vindex].attr.bezierAutoAdjust;
		    _self.redraw();
		}
	    }
	    else if( _self.selectPolygon != null ) {
		var vert = _self.transformMousePosition( x, y );
		_self.selectPolygon.vertices.push( vert );
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
	 * @return {object} A simple object <pre>{ x : Number, y : Number }</pre> with the transformed coordinates.
	 **/
	PlotBoilerplate.prototype.transformMousePosition = function( x, y ) {
	    return { x : (x/this.config.cssScaleX-this.draw.offset.x)/(this.draw.scale.x), y : (y/this.config.cssScaleY-this.draw.offset.y)/(this.draw.scale.y) };
	};
	


	/**
	 * (Helper) The mouse-down handler.
	 *
	 * It selects vertices for dragging.
	 *
	 * @method mouseDownHandler.
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseDownHandler = function(e) {
	    if( e.which != 1 && !(window.TouchEvent && e.originalEvent instanceof TouchEvent) )
		return; // Only react on left mouse or touch events
	    var p = locatePointNear( _self.transformMousePosition(e.params.pos.x, e.params.pos.y), DEFAULT_CLICK_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
	    if( !p ) return;
	    // Drag all selected elements?
	    if( p.type == 'vertex' && _self.vertices[p.vindex].attr.isSelected ) {
		// Multi drag
		for( var i in _self.vertices ) {
		    if( _self.vertices[i].attr.isSelected ) {
			_self.draggedElements.push( new Draggable( _self.vertices[i], Draggable.VERTEX ).setVIndex(i) );
			_self.vertices[i].listeners.fireDragStartEvent( e );
		    }
		}
	    } else {
		// Single drag
		if( !_self.vertices[p.vindex].attr.draggable )
		    return;
		_self.draggedElements.push( p );
		if( p.type == 'bpath' )
		    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragStartEvent( e );
		else if( p.type == 'vertex' )
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
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseDragHandler = function(e) {
	    var oldDragAmount = { x : e.params.dragAmount.x, y : e.params.dragAmount.y };
	    e.params.dragAmount.x /= _self.config.cssScaleX;
	    e.params.dragAmount.y /= _self.config.cssScaleY;
	    if( keyHandler.isDown('alt') || keyHandler.isDown('ctrl') || keyHandler.isDown('spacebar') ) {
		_self.draw.offset.add( e.params.dragAmount );
		_self.fill.offset.set( _self.draw.offset );
		_self.redraw();
	    } else {
		// Convert drag amount by scaling
		// Warning: this possibly invalidates the dragEvent for other listeners!
		//          Rethink the solution when other features are added.
		e.params.dragAmount.x /= _self.draw.scale.x;
		e.params.dragAmount.y /= _self.draw.scale.y;		
		for( var i in _self.draggedElements ) {
		    var p = _self.draggedElements[i];
		    if( p.type == 'bpath' ) {
			_self.paths[p.pindex].moveCurvePoint( p.cindex, p.pid, e.params.dragAmount );
			_self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent( e );
		    } else if( p.type == 'vertex' ) {
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
	 * @method mouseDownHandler.
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseUpHandler = function(e) {
	    if( e.which != 1 )
		return; // Only react on left mouse;
	    if( !e.params.wasDragged )
		handleClick( e.params.pos.x, e.params.pos.y );
	    for( var i in _self.draggedElements ) {
		var p = _self.draggedElements[i];
		if( p.type == 'bpath' ) {
		    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent( e );
		} else if( p.type == 'vertex' ) {
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
	 * @param {Event} e - The event to handle
	 * @private
	 * @return {void}
	 **/
	var mouseWheelHandler = function(e) {
	    var zoomStep = 1.25;
	    if( e.deltaY < 0 ) {
		_self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX = _self.config.scaleX*zoomStep;
		_self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY = _self.config.scaleY*zoomStep;
	    } else if( e.deltaY > 0 ) {
		_self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX = Math.max(_self.config.scaleX/zoomStep,0.01);
		_self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY = Math.max(_self.config.scaleY/zoomStep,0.01);
	    }
	    e.preventDefault();
	    _self.redraw();
	};


	if( this.config.enableMouse ) { 
	    // Install a mouse handler on the canvas.
	    new MouseHandler(this.canvas)
		.down( mouseDownHandler )
		.drag( mouseDragHandler )
		.up( mouseUpHandler )
	    ;
	} else { _self.console.log('Mouse interaction disabled.'); }


	if( this.config.enableMouseWheel ) { 
	    // Install a mouse handler on the canvas.
	    new MouseHandler(this.canvas)
		.wheel( mouseWheelHandler )
	    ;
	} else { _self.console.log('Mouse wheel interaction disabled.'); }


	
	if( this.config.enableTouch) { 
	    // Install a touch handler on the canvas.

	    // Convert absolute touch positions to relative DOM element position (relative to canvas)
	    function relPos(pos) {
		return { x : pos.x - _self.canvas.offsetLeft,
			 y : pos.y - _self.canvas.offsetTop
		       };
	    }
	    // Some private vars to store the current mouse/position/button state.
	    var touchMovePos = null;
	    var touchDownPos = null;
	    var draggedElement = null;
	    new Touchy( this.canvas,
			{ one : function( hand, finger ) {
			    touchMovePos = new Vertex( relPos(finger.lastPoint) );
			    touchDownPos = new Vertex( relPos(finger.lastPoint) );
			    draggedElement = locatePointNear( _self.transformMousePosition(touchMovePos.x, touchMovePos.y), DEFAULT_TOUCH_TOLERANCE/Math.min(_self.config.cssScaleX,_self.config.cssScaleY) );
			    if( draggedElement ) {
				hand.on('move', function (points) {
				    var rel = relPos( points[0] );
				    var trans = _self.transformMousePosition( rel.x, rel.y ); 
				    var diff = new Vertex(_self.transformMousePosition( touchMovePos.x, touchMovePos.y )).difference(trans);
				    if( draggedElement.type == 'vertex' ) {
					if( !_self.vertices[draggedElement.vindex].attr.draggable )
					    return;
					_self.vertices[draggedElement.vindex].add( diff );
					var fakeEvent = { params : { dragAmount : diff.clone(), wasDragged : true, mouseDownPos : touchDownPos.clone(), mouseDragPos : touchDownPos.clone().add(diff) }};
					_self.vertices[draggedElement.vindex].listeners.fireDragEvent( fakeEvent );
					_self.redraw();
				    }
				    touchMovePos = new Vertex(rel);
				} );
			    }

			}
			} );
	} else { _self.console.log('Touch interaction disabled.'); }

	if( this.config.enableKeys ) {
	    // Install key handler
	    var keyHandler = new KeyHandler( { trackAll : true } )
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
		.down('e',function() { _self.console.log('e was hit. shift is pressed?',keyHandler.isDown('shift')); } ) 
	    ;
	} // END IF enableKeys?
	else  { _self.console.log('Keyboard interaction disabled.'); }
	
	// Apply the configured CSS scale.
	this.updateCSSscale();	
	// Init	
	this.redraw();
	// Gain focus
	this.canvas.focus();
	
    }; // END construcor 'PlotBoilerplate'



    /**
     * Creates a control GUI (a dat.gui instance) for this 
     * plot boilerplate instance.
     *
     * @method createGUI
     * @instance
     * @memberof PlotBoilerplate
     * @return {dat.gui} 
     **/
    PlotBoilerplate.prototype.createGUI = function() {
	var gui = new dat.gui.GUI();
	var _self = this;
	gui.remember(this.config);
	var fold0 = gui.addFolder('Editor settings');
	var fold00 = fold0.addFolder('Canvas size');
	fold00.add(this.config, 'fullSize').onChange( function() { _self.resizeCanvas(); } ).title("Toggles the fullpage mode.");
	fold00.add(this.config, 'fitToParent').onChange( function() { _self.resizeCanvas(); } ).title("Toggles the fit-to-parent mode to fit to parent container (overrides fullsize).");
	fold00.add(this.config, 'defaultCanvasWidth').min(1).step(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies the fallback width.");
	fold00.add(this.config, 'defaultCanvasHeight').min(1).step(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies the fallback height.");
	fold00.add(this.config, 'canvasWidthFactor').min(0.1).step(0.1).max(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies a factor for the current width.");
	fold00.add(this.config, 'canvasHeightFactor').min(0.1).step(0.1).max(10).onChange( function() { _self.resizeCanvas(); } ).title("Specifies a factor for the current height.");
	fold00.add(this.config, 'cssScaleX').min(0.01).step(0.01).max(1.0).onChange( function() { if(_self.config.cssUniformScale) _self.config.cssScaleY = _self.config.cssScaleX; _self.updateCSSscale(); } ).title("Specifies the visual x scale (CSS).").listen();
	fold00.add(this.config, 'cssScaleY').min(0.01).step(0.01).max(1.0).onChange( function() { if(_self.config.cssUniformScale) _self.config.cssScaleX = _self.config.cssScaleY; _self.updateCSSscale(); } ).title("Specifies the visual y scale (CSS).").listen();
	fold00.add(this.config, 'cssUniformScale').onChange( function() { if(_self.config.cssUniformScale) _self.config.cssScaleY = _self.config.cssScaleX; _self.updateCSSscale(); } ).title("CSS uniform scale (x-scale equlsa y-scale).");
	
	var fold01 = fold0.addFolder('Draw settings');
	fold01.add(this.config, 'drawBezierHandlePoints').onChange( function() { _self.redraw(); } ).title("Draw Bézier handle points.");
	fold01.add(this.config, 'drawBezierHandleLines').onChange( function() { _self.redraw(); } ).title("Draw Bézier handle lines.");
	fold01.add(this.config, 'drawHandlePoints').onChange( function() { _self.redraw(); } ).title("Draw handle points (overrides all other settings).");
	fold01.add(this.config, 'drawHandleLines').onChange( function() { _self.redraw(); } ).title("Draw handle lines in general (overrides all other settings).");
	fold01.add(this.drawConfig, 'drawVertices').onChange( function() { _self.redraw(); } ).title("Draw vertices in general.");
	
	
	fold0.add(this.config, 'scaleX').title("Scale x.").min(0.01).max(10.0).step(0.01).onChange( function() { _self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX; _self.redraw(); } ).listen();
	fold0.add(this.config, 'scaleY').title("Scale y.").min(0.01).max(10.0).step(0.01).onChange( function() { _self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY; _self.redraw(); } ).listen();
	fold0.add(this.config, 'rasterGrid').title("Draw a fine raster instead a full grid.").onChange( function() { _self.redraw(); } ).listen();
	fold0.add(this.config, 'redrawOnResize').title("Automatically redraw the data if window or canvas is resized.").listen();
	fold0.addColor(this.config, 'backgroundColor').onChange( function() { _self.redraw(); } ).title("Choose a background color.");
	// fold0.add(bp.config, 'loadImage').name('Load Image').title("Load a background image.");

	if( this.config.enableExport ) {
	    var fold1 = gui.addFolder('Export');
	    fold1.add(this.config, 'saveFile').name('Save a file').title("Save as SVG.");
	}
	
	return gui;
    };



    /**
     * A set of helper functions.
     * @private
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
	safeMergeByKeys : function( base, extension ) {
	    for( var k in base ) {
		if( !extension.hasOwnProperty(k) )
		    continue;
		var type = typeof base[k];
		try {
		    if( type == 'boolean' ) base[k] = !!JSON.parse(extension[k]);
		    else if( type == 'number' ) base[k] = JSON.parse(extension[k])*1;
		    else if( type == 'function' && typeofextension[k] == 'function' ) base[k] = extension[k] ;
		    else base[k] = extension[k];
		} catch( e ) {
		    _self.console.error( 'error in key ', k, extension[k], e );
		}
	    }
	    return base;
	},

	
	/**
	 * Generate a four-point arrow head, starting at the vector end minus the
	 * arrow head length.
	 *
	 * The first vertex in the returned array is guaranteed to be the located
	 * at the vector line end minus the arrow head length.
	 *
	 *
	 * Due to performance all params are required.
	 *
	 * The params scaleX and scaleY are required for the case that the scaling is not uniform (x and y
	 * scaling different). Arrow heads should not look distored on non-uniform scaling.
	 *
	 * If unsure use 1.0 for scaleX and scaleY (=no distortion).
	 * For headlen use 8, it's a good arrow head size.
	 *
	 * Example:
	 *    buildArrowHead( new Vertex(0,0), new Vertex(50,100), 8, 1.0, 1.0 )
	 *
	 * @param {Vertex} zA - The start vertex of the vector to calculate the arrow head for.
	 * @param {Vertex} zB - The end vertex of the vector.
	 * @param {number} headlen - The length of the arrow head (along the vector direction. A good value is 12).
	 * @param {number} scaleX  - The horizontal scaling during draw.
	 * @param {number} scaleY  - the vertical scaling during draw.
	 **/
	buildArrowHead : function( zA, zB, headlen, scaleX, scaleY ) {
	    var angle = Math.atan2( (zB.y-zA.y)*scaleY, (zB.x-zA.x)*scaleX );
	    
	    var vertices = [];
	    vertices.push( new Vertex(zB.x*scaleX-(headlen)*Math.cos(angle), zB.y*scaleY-(headlen)*Math.sin(angle)) );    
	    vertices.push( new Vertex(zB.x*scaleX-(headlen*1.35)*Math.cos(angle-Math.PI/8), zB.y*scaleY-(headlen*1.35)*Math.sin(angle-Math.PI/8) ) );
	    vertices.push( new Vertex(zB.x*scaleX, zB.y*scaleY) );
	    vertices.push( new Vertex(zB.x*scaleX-(headlen*1.35)*Math.cos(angle+Math.PI/8), zB.y*scaleY-(headlen*1.35)*Math.sin(angle+Math.PI/8)) );

	    return vertices;
	}
    };


    // A helper for fetching data from objects.
    let fetch = {
	/**
	 * A helper function to the the object property value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	val : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] == 'undefined' )
		return fallback;
	    return obj[key];
	},


	/**
	 * A helper function to the the object property numeric value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	num : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] !== 'number' )
		return fallback;
	    return obj[key];
	},

	/**
	 * A helper function to the the object property boolean value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	bool : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] !== 'boolean' )
		return fallback;
	    return obj[key];
	},


	/**
	 * A helper function to the the object property function-value specified by the given key.
	 *
	 * @param {object} object   - The object to get the property's value from. Must not be null.
	 * @param {string} key      - The key of the object property (the name).
	 * @param {any}    fallback - A default value if the key does not exist.
	 **/
	func : function( obj, key, fallback ) {
	    if( !obj.hasOwnProperty(key) )
		return fallback;
	    if( typeof obj[key] !== 'function' )
		return fallback;
	    return obj[key];
	},
    };
    
    _context.PlotBoilerplate = PlotBoilerplate;
    
})(window); 





