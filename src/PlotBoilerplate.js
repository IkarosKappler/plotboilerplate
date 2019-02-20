/**
 * The main class of the PlotBoilerplate.
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
 * @version  1.3.6
 **/


(function(_context) {
    "use strict";

    const DEFAULT_CANVAS_WIDTH    = 1024;
    const DEFAULT_CANVAS_HEIGHT   =  768;
    const DEFAULT_CLICK_TOLERANCE =    8;
    const DEFAULT_TOUCH_TOLERANCE =   32;


    // +---------------------------------------------------------------------------------
    /** 
     * A helper function to trigger fake click events.
     **/ // +----------------------------
    /*
    var triggerClickEvent = function(element) {
	element.dispatchEvent( new MouseEvent('click', {
	    view: window,
	    bubbles: true,
	    cancelable: true
	} ) );
    };
    */

    // +---------------------------------------------------------------------------------
    /** 
     * A helper function to scale elements (usually the canvas) using CSS.
     *
     * transform-origin is at (0,0).
     *
     * @param {HTMLElement} element The DOM element to scale.
     * @param {number} scaleX The X scale factor.
     * @param {number} scaleY The Y scale factor.
     **/ // +----------------------------
    var setCSSscale = function( element, scaleX, scaleY ) {
	element.style['transform-origin'] = '0 0';
	if( scaleX==1.0 && scaleY==1.0 ) element.style.transform = null;
	else                             element.style.transform = 'scale(' + scaleX + ',' + scaleY+')';
    };

    // +---------------------------------------------------------------------------------
    /**
     * A wrapper class for draggable items (mostly vertices).
     **/ // +----------------------------
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


    // +---------------------------------------------------------------------------------
    /**
     * Use a special custom attribute set for vertices.
    **/ // +----------------------------
    VertexAttr.model = { bezierAutoAdjust : false, renderTime : 0, selectable : true, isSelected : false, draggable : true };
    

    /** 
     * The constructor.
     *
     * @constructor
     * @class PlotBoilerplate
     *
     * @param {object} [config] The configuration.
     */
    var PlotBoilerplate = function( config ) {
	config = config || {};
	if( typeof config.canvas == 'undefined' )
	    throw "No canvas specified.";
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	this.config = {
	    fullSize              : typeof config.fullSize != 'undefined' ? config.fullSize : true,
	    fitToParent           : typeof config.fitToParent != 'undefined' ? config.fitToParent : true,
	    scaleX                : config.scaleX || 1.0,
	    scaleY                : config.scaleY || 1.0,
	    rasterGrid            : typeof config.rasterGrid != 'undefined' ? config.rasterGrid : true,
	    drawOrigin            : typeof config.drawOrigin != 'undefined' ? config.drawOrigin : true,
	    rasterAdjustFactor    : typeof config.rasterAdjustFactor == 'number' ? config.rasterAdjustFactor : 2.0,
	    autoAdjustOffset      : typeof config.autoAdjustOffset != 'undefined' ? config.autoAdjustOffset : true,
	    offsetAdjustXPercent  : typeof config.offsetAdjustXPercent == 'number' ? config.offsetAdjustXPercent : 50,
	    offsetAdjustYPercent  : typeof config.offsetAdjustYPercent == 'number' ? config.offsetAdjustYPercent : 50,
	    backgroundColor       : config.backgroundColor || '#ffffff',
	    redrawOnResize        : typeof config.redrawOnResize != 'undefined' ? config.redrawOnResize : true,
	    defaultCanvasWidth    : typeof config.defaultCanvasWidth == 'number' ? config.defaultCanvasWidth : DEFAULT_CANVAS_WIDTH,
	    defaultCanvasHeight   : typeof config.defaultCanvasHeight == 'number' ? config.defaultCanvasHeight : DEFAULT_CANVAS_HEIGHT,
	    canvasWidthFactor     : typeof config.canvasWidthFactor == 'number' ? config.canvasWidthFactor : 1.0,
	    canvasHeightFactor    : typeof config.canvasHeightFactor == 'number' ? config.canvasHeightFactor : 1.0,
	    cssScaleX             : typeof config.cssScaleX == 'number' ? config.cssScaleX : 1.0,
	    cssScaleY             : typeof config.cssScaleY == 'number' ? config.cssScaleY : 1.0,
	    cssUniformScale       : typeof config.cssUniformScale != 'undefined' ? config.cssUniformScale : true,
	    rebuild               : function() { rebuild(); },
	    /* loadImage             : function() { var elem = document.getElementById('file');
						 elem.setAttribute('data-type','image-upload');
						 triggerClickEvent(elem);
					       }, */
	    saveFile              : function() { saveFile(); },

	    drawBezierHandleLines : typeof config.drawBezierHandleLines != 'undefined' ? config.drawBezierHandleLines : true,
	    drawBezierHandlePoints : typeof config.drawBezierHandlePoints != 'undefined' ? config.drawBezierHandlePoints : true,
	    drawHandleLines       : typeof config.drawHandleLines != 'undefined' ? config.drawHandleLines : true,
	    drawHandlePoints      : typeof config.drawHandlePoints != 'undefined' ? config.drawHandlePoints : true,
	    
	    // Listeners/observers
	    preDraw               : (typeof config.preDraw == 'function' ? config.preDraw : null),
	    postDraw              : (typeof config.postDraw == 'function' ? config.postDraw : null),

	    // Interaction
	    enableMouse           : typeof config.enableMouse != 'undefined' ? config.enableMouse : true,
	    enableTouch           : typeof config.enableTouch != 'undefined' ? config.enableTouch : true,
	    enableKeys            : typeof config.enableKeys != 'undefined' ? config.enableKeys : true
	};


	// +---------------------------------------------------------------------------------
	// | Object members.
	// +-------------------------------
	this.canvas              = typeof config.canvas == 'string' ? document.getElementById(config.canvas) : config.canvas;
	this.ctx                 = this.canvas.getContext('2d');
	this.draw                = new drawutils(this.ctx,false);
	this.draw.scale.set(this.config.scaleX,this.config.scaleY);
	this.fill                = new drawutils(this.ctx,true);
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


	// +---------------------------------------------------------------------------------
	// | Object members.
	// +-------------------------------
	PlotBoilerplate.prototype.setConsole = function( con ) {
	    if( typeof con.log != 'function' ) throw "Console object must have a 'log' function.";
	    if( typeof con.warn != 'function' ) throw "Console object must have a 'warn' function.";
	    if( typeof con.error != 'function' ) throw "Console object must have a 'error' function.";
	    this.console = con;
	};
	
	// +---------------------------------------------------------------------------------
	// | Object members.
	// +-------------------------------
	PlotBoilerplate.prototype.updateCSSscale = function() {
	    // this.console.log('update css scale');
	    if( this.config.cssUniformScale ) {
		setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleX );
	    } else {
		setCSSscale( this.canvas, this.config.cssScaleX, this.config.cssScaleY );
	    }
	};
	
	// !!! PRE ALPHA TEST FOR ELLIPSES !!!
	// THIS IS A BIT DIFFICULT BECAUSE CANVAS ELLIPSES AND SVG ELLIPSES ARE FUNDAMENTALLY DIFFERENT
	/*
	var _testArc = { a : new Vertex(-200,0), b : new Vertex(200,0), radius : new Vertex(100,100), rotation : 0.0, largeArcFlag : false, sweepFlag : false };
	this.vertices.push( _testArc.a );
	this.vertices.push( _testArc.b );
	this.vertices.push( _testArc.radius );
	*/

	// +---------------------------------------------------------------------------------
	/**
	 * Add a drawable object.
	 *
	 * This must be either:
	 *  * a Vertex
	 *  * a Line
	 *  * a Vector
	 *  * a VEllipse
	 *  * a Polygon
	 *  * a BezierPath
	 *  * a BPImage
	 *
	 * @param drawable:Object The drawable (of one of the allowed class instance) to add.
	 * @param redraw:boolean
	 **/ // +-------------------------------
	PlotBoilerplate.prototype.add = function( drawable, redraw ) {
	    if( drawable instanceof Vertex ) {
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


	// +---------------------------------------------------------------------------------
	/**
	 * Draw the grid.
	 **/ // +-------------------------------
	PlotBoilerplate.prototype.drawGrid = function() {
	    var gScale = { x : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.x),
			   y : Grid.utils.mapRasterScale(this.config.rasterAdjustFactor,this.draw.scale.y) };
	    var gSize = { w : this.grid.size.x*gScale.x, h : this.grid.size.y*gScale.y };
	    var cs = { w : this.canvasSize.width/2, h : this.canvasSize.height/2 };
	    var offset = this.draw.offset.clone().inv();
	    offset.x = (Math.round(offset.x+cs.w)/Math.round(gSize.w))*(gSize.w)/this.draw.scale.x + (((this.draw.offset.x-cs.w)/this.draw.scale.x)%gSize.w);
	    offset.y = (Math.round(offset.y+cs.h)/Math.round(gSize.h))*(gSize.h)/this.draw.scale.y + (((this.draw.offset.y-cs.h)/this.draw.scale.x)%gSize.h);
	    if( this.config.rasterGrid )
		this.draw.raster( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.w, gSize.h, 'rgba(0,128,255,0.125)' );
	    else
		this.draw.grid( offset, (this.canvasSize.width)/this.draw.scale.x, (this.canvasSize.height)/this.draw.scale.y, gSize.w, gSize.h, 'rgba(0,128,255,0.095)' )
	};

	// +---------------------------------------------------------------------------------
	/**
	 * Draw the origin as a crosshair.
	 **/ // +-------------------------------
	PlotBoilerplate.prototype.drawOrigin = function() {
	    // Add a crosshair to mark the origin
	    this.draw.crosshair( { x : 0, y : 0 }, 10, '#000000' );
	};


	// +---------------------------------------------------------------------------------
	/**
	 * Draw all drawable elements.
	**/ // +-------------------------------
	PlotBoilerplate.prototype.drawDrawables = function( renderTime ) {
	    // Draw drawables
	    for( var i in this.drawables ) {
		var d = this.drawables[i];
		if( d instanceof BezierPath ) {
		    for( var c in d.bezierCurves ) {
			this.draw.cubicBezier( d.bezierCurves[c].startPoint, d.bezierCurves[c].endPoint, d.bezierCurves[c].startControlPoint, d.bezierCurves[c].endControlPoint, '#00a822' );

			if( this.config.drawBezierHandlePoints && this.config.drawHandlePoints ) {
			    if( !d.bezierCurves[c].startPoint.attr.bezierAutoAdjust ) {
				this.draw.diamondHandle( d.bezierCurves[c].startPoint, 7, 'orange' );
				d.bezierCurves[c].startPoint.attr.renderTime = renderTime;
			    }
			    if( !d.bezierCurves[c].endPoint.attr.bezierAutoAdjust ) {
				this.draw.diamondHandle( d.bezierCurves[c].endPoint, 7, 'orange' );
				d.bezierCurves[c].endPoint.attr.renderTime = renderTime;
			    }
			    this.draw.circleHandle( d.bezierCurves[c].startControlPoint, 7, '#008888' );
			    this.draw.circleHandle( d.bezierCurves[c].endControlPoint, 7, '#008888' );
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
		    if( !d.attr.selectable || !d.attr.draggable ) {
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


	/** +---------------------------------------------------------------------------------
	 * Draw all drawable elements.
	**/ // +-------------------------------
	PlotBoilerplate.prototype.drawSelectPolygon = function() {
	    // Draw select polygon?
	    if( this.selectPolygon != null && this.selectPolygon.vertices.length > 0 ) {
		this.draw.polygon( this.selectPolygon, '#888888' );
		this.draw.crosshair( this.selectPolygon.vertices[0], 3, '#008888' );
	    }
	};
	    

	/** +---------------------------------------------------------------------------------
	 * Draw the (remaining) vertices.
	**/ // +-------------------------------
	PlotBoilerplate.prototype.drawVertices = function( renderTime ) {
	    // Draw all vertices as small squares if they were not already drawn by other objects
	    for( var i in this.vertices ) {
		if( this.vertices[i].attr.renderTime != renderTime ) {
		    this.draw.squareHandle( this.vertices[i], 5, this.vertices[i].attr.isSelected ? 'rgba(192,128,0)' : 'rgb(0,128,192)' );
		}
	    }
	};
	
	
	/** +---------------------------------------------------------------------------------
	 * The re-drawing function.
	 **/ // +-------------------------------
	PlotBoilerplate.prototype.redraw = function() {
	    var renderTime = new Date().getTime();
	    
	    this.clear();
	    if( this.config.preDraw ) this.config.preDraw();
	    
	    this.drawGrid();
	    if( this.config.drawOrigin )
		this.drawOrigin(); 
	    // !!! Draw some test stuff !!!
	    /*
	    var d = _testArc;
	    try {
		// First draw helper	
		this.draw.arcto( d.a.x, d.a.y, d.radius.x, Math.abs(d.radius.y), d.rotation, !d.largeArcFlag, !d.sweepFlag, d.b.x, d.b.y, '#c8c8c8' );
		// Then draw arc itself
		this.draw.arcto( d.a.x, d.a.y, d.radius.x, Math.abs(d.radius.y), d.rotation, d.largeArcFlag, d.sweepFlag, d.b.x, d.b.y, '#008888' );
	    } catch( e ) {
		this.console.error( e );
	    }
	    */
	    this.drawDrawables(renderTime);
	    this.drawVertices(renderTime);
	    this.drawSelectPolygon();

	    if( this.config.postDraw ) this.config.postDraw();
	    
	}; // END redraw



	/** +---------------------------------------------------------------------------------
	 * This function clears the canvas with the configured background color.
	 **/ // +-------------------------------
	PlotBoilerplate.prototype.clear = function() {
	    // Note that the image might have an alpha channel. Clear the scene first.
	    this.ctx.fillStyle = this.config.backgroundColor; 
	    this.ctx.fillRect(0,0,this.canvasSize.width,this.canvasSize.height);
	};


	/** +---------------------------------------------------------------------------------
	 * Clear the selection.
	 *
	 * @param redraw:boolean Indicates if the redraw function should be triggered.
	 *
	 * @return this for chaining.
	**/ // +-------------------------------
	PlotBoilerplate.prototype.clearSelection = function( redraw ) {
	    for( var i in this.vertices ) 
		this.vertices[i].attr.isSelected = false;
	    if( redraw )
		this.redraw();
	    return this;
	};


	/** +---------------------------------------------------------------------------------
	 * Just a generic save-file dialog.
	 **/ // +-------------------------------
	var saveFile = function() {
	    var svgCode = new SVGBuilder().build( _self.drawables, { canvasSize : _self.canvasSize, offset : _self.draw.offset, zoom : _self.draw.scale } );
	    // See documentation for FileSaver.js for usage.
	    //    https://github.com/eligrey/FileSaver.js
	    var blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" } );
	    saveAs(blob, "plot-boilerplate.svg");
	};
	
	
	/** +---------------------------------------------------------------------------------
	 * The rebuild function just evaluates the input and
	 *  - triangulate the point set?
	 *  - build the voronoi diagram?
	**/ // +-------------------------------
	var rebuild = function() {
	    // ...
	};


	/** +---------------------------------------------------------------------------------
	 * This function resizes the canvas to the required settings (toggles fullscreen).
	 **/ // +-------------------------------
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
		_setSize( width, height );
	    } else if( _self.config.fitToParent ) {
		// Set editor size
		var width  = _self.canvas.parentNode.clientWidth - 2; // 1px border
		var height = _self.canvas.parentNode.clientHeight - 2; // 1px border
		_setSize( width, height );
	    } else {
                _setSize( _self.config.defaultCanvasWidth, _self.config.defaultCanvasHeight );
	    }
	    
	    if( _self.config.redrawOnResize )
		_self.redraw();
	};
	_context.addEventListener( 'resize', this.resizeCanvas );
	this.resizeCanvas();


	/** +---------------------------------------------------------------------------------
	 * Add all vertices inside the polygon to the current selection.
	 * 
	 * @param polygon:Polygon The polygonal selection area.
	**/ // +-------------------------------
	PlotBoilerplate.prototype.selectVerticesInPolygon = function( polygon ) {
	    for( var i in this.vertices ) {
		if( polygon.containsVert(this.vertices[i]) ) 
		    this.vertices[i].attr.isSelected = true;
	    }
	};
	
	
	/** +---------------------------------------------------------------------------------
         * Locates the point (index) at the passed position. Using an internal tolerance of 7 pixels.
	 *
	 * The result is an object { type : 'bpath', pindex, cindex, pid }
	 *
         * Returns false if no point is near the passed position.
	 *
	 * @param point:Vertex
         **/ // +-------------------------------
        var locatePointNear = function( point, tolerance ) {
            // var tolerance = 7;
	    if( typeof tolerance == 'undefined' )
		tolerance = 7;
	    // Search in vertices
	    for( var vindex in _self.vertices ) {
		var vert = _self.vertices[vindex];
		if( vert.distance(point) < tolerance ) {
		    // { type : 'vertex', vindex : vindex };
		    return new Draggable( vert, Draggable.VERTEX ).setVIndex(vindex); 
		}
	    } 
            return false;
        }


	/** +---------------------------------------------------------------------------------
	 * Handle left-click event.
	 *
	 * @param x:Number The click X position on the canvas.
	 * @param y:Number The click Y position on the canvas.
	 **/ // +-------------------------------
	function handleClick(x,y) {
	    var p = locatePointNear( _self.transformMousePosition(x, y), DEFAULT_CLICK_TOLERANCE );
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
		    // _self.console.log( 'bezierAutoAdjust=' + _self.vertices[p.vindex].attr.bezierAutoAdjust );
		    _self.redraw();
		}
	    }
	    else if( _self.selectPolygon != null ) {
		var vert = _self.transformMousePosition( x, y );
		_self.selectPolygon.vertices.push( vert );
		_self.redraw();
	    }
	}

	/** +---------------------------------------------------------------------------------
	 * Transform the given x-y-(mouse-)point to coordinates respecting the view offset
	 * and the zoom settings.
	 *
	 * @param x:Number The mouse-x position relative to the canvas.
	 * @param y:Number The mouse-y position relative to the canvas.
	**/ // +-------------------------------
	PlotBoilerplate.prototype.transformMousePosition = function( x, y ) {
	    return { x : (x/this.config.cssScaleX-this.draw.offset.x)/(this.draw.scale.x), y : (y/this.config.cssScaleY-this.draw.offset.y)/(this.draw.scale.y) };
	};
	

	/** +---------------------------------------------------------------------------------
	 * The mouse-down handler.
	 *
	 * It selects vertices for dragging.
	 **/ // +-------------------------------
	var mouseDownHandler = function(e) {
	    // _self.console.log( 'is touch event', e instanceof TouchEvent );
	    if( e.which != 1 && !(window.TouchEvent && e.originalEvent instanceof TouchEvent) )
		return; // Only react on left mouse or touch events
	    var p = locatePointNear( _self.transformMousePosition(e.params.pos.x, e.params.pos.y), DEFAULT_CLICK_TOLERANCE );
	    _self.console.log('point at position found: '+p );
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

	/** +---------------------------------------------------------------------------------
	 * The mouse-drag handler.
	 *
	 * It moves selected elements around or performs the panning if the ctrl-key if
	 * hold down.
	 **/ // +-------------------------------
	var mouseDragHandler = function(e) {
	    var oldDragAmount = { x : e.params.dragAmount.x, y : e.params.dragAmount.y };
	    e.params.dragAmount.x /= _self.config.cssScaleX;
	    e.params.dragAmount.y /= _self.config.cssScaleY;
	    if( keyHandler.isDown('alt') || keyHandler.isDown('ctrl') ) {
		_self.draw.offset.add( e.params.dragAmount );
		_self.fill.offset.set( _self.draw.offset );
		_self.redraw();
	    } else {
		// Convert drag amount by scaling
		// Warning: this possibly invalidates the dragEvent for other listeners!
		//          Rethink the solution when other features are added.
		e.params.dragAmount.x /= _self.draw.scale.x;
		e.params.dragAmount.y /= _self.draw.scale.y;
		
		// _self.console.log( 'draggedElements',_self.draggedElements );
		
		for( var i in _self.draggedElements ) {
		    var p = _self.draggedElements[i];
		    // _self.console.log( 'i', i, 'pid', p.pid, 'pindex', p.pindex, 'cindex', p.cindex );
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

	
	/** +---------------------------------------------------------------------------------
	 * The mouse-up handler.
	 *
	 * It clears the dragging-selection.
	 **/ // +-------------------------------
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

	/** +---------------------------------------------------------------------------------
	 * The mouse-wheel handler.
	 *
	 * It performs the zooming.
	 **/ // +-------------------------------
	var mouseWheelHandler = function(e) {
	    var zoomStep = 1.25;
	    if( e.deltaY < 0 ) {
		_self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX = _self.config.scaleX*zoomStep;
		_self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY = _self.config.scaleY*zoomStep;
	    } else if( e.deltaY > 0 ) {
		_self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX = Math.max(_self.config.scaleX/zoomStep,0.01);
		_self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY = Math.max(_self.config.scaleY/zoomStep,0.01);
	    }
	    _self.redraw();
	};


	if( this.config.enableMouse ) { 
	    /** +---------------------------------------------------------------------------------
	     * Install a mouse handler on the canvas.
	     **/ // +-------------------------------
	    new MouseHandler(this.canvas)
		.down( mouseDownHandler )
		.drag( mouseDragHandler )
		.up( mouseUpHandler )
		.wheel( mouseWheelHandler )
	    ;
	} else { _self.console.log('Mouse interaction disabled.'); }


	
	if( this.config.enableTouch) { // && typeof TouchHandler != 'undefined' ) { 
	    /** +---------------------------------------------------------------------------------
	     * Install a touch handler on the canvas.
	     **/ // +-------------------------------
	    _self.console.log( 'Installing touch handler' );
	    var touchMovePos = null;
	    var touchDownPos = null;
	    var draggedElement = null;
	    new Touchy( this.canvas,
			{ one : function( hand, finger ) {
			    touchMovePos = new Vertex(finger.lastPoint);
			    touchDownPos = new Vertex(finger.lastPoint);
			    draggedElement = locatePointNear( _self.transformMousePosition(touchMovePos.x, touchMovePos.y), DEFAULT_TOUCH_TOLERANCE );
			    if( draggedElement ) {
				hand.on('move', function (points) {
				    //console.log( points );	    
				    var trans = _self.transformMousePosition( points[0].x, points[0].y );
				    var diff = new Vertex(_self.transformMousePosition( touchMovePos.x, touchMovePos.y )).difference(trans);
				    if( draggedElement.type == 'vertex' ) {
					if( !_self.vertices[draggedElement.vindex].attr.draggable )
					    return;
					_self.vertices[draggedElement.vindex].add( diff );
					var fakeEvent = { params : { dragAmount : diff.clone(), wasDragged : true, mouseDownPos : touchDownPos.clone(), mouseDragPos : touchDownPos.clone().add(diff) }};
					_self.vertices[draggedElement.vindex].listeners.fireDragEvent( fakeEvent );
					_self.redraw();
				    }
				    touchMovePos = new Vertex(points[0]);
				} );
			    }

			}
			} );
	} else { _self.console.log('Touch interaction disabled.'); }

	if( this.config.enableKeys ) {
	    // Install key handler
	    var keyHandler = new KeyHandler( { trackAll : true } )

		.down('alt',function() { _self.console.log('alt was hit.'); } )
		.press('alt',function() { _self.console.log('alt was pressed.'); } )
		.up('alt',function() { _self.console.log('alt was released.'); } )

		.down('ctrl',function() { _self.console.log('ctrl was hit.'); } )
		.press('ctrl',function() { _self.console.log('ctrl was pressed.'); } )
		.up('ctrl',function() { _self.console.log('ctrl was released.'); } )

		.down('escape',function() {
		    // _self.console.log('ESCAPE was hit.');
		    _self.clearSelection(true);
		} )

		.down('shift',function() {
		    //_self.console.log('SHIFT was hit.');
		_self.selectPolygon = new Polygon();
		    _self.redraw();
		} )
		.up('shift',function() {
		    //_self.console.log('SHIFT was released.');
		    // Find and select vertices in the drawn area
		    if( _self.selectPolygon == null )
			return;
		    _self.selectVerticesInPolygon( _self.selectPolygon );
		    _self.selectPolygon = null;
		    _self.redraw();
		} )

		.down('y',function() { _self.console.log('y was hit.'); } )
		.up('y',function() { _self.console.log('y was released.'); } )

		.down('e',function() { _self.console.log('e was hit. shift is pressed?',keyHandler.isDown('shift')); } ) 

		.up('windows',function() { _self.console.log('windows was released.'); } )
	    ;
	} // END IF enableKeys?
	else  { _self.console.log('Keyboard interaction disabled.'); }
	
	// Initialize the dialog
	window.dialog = new overlayDialog('dialog-wrapper');
	// Apply the configured CSS scale.
	this.updateCSSscale();	
	// Init	
	this.redraw();
	// Gain focus
	this.canvas.focus();
	
    }; // END construcor 'PlotBoilerplate'


    /** +---------------------------------------------------------------------------------
     * A static function to create a control GUI (a dat.gui instance) for the given
     * plot boilerplate.
     * 
     * @return dat.gui
     **/ // +-------------------------------
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
	
	fold0.add(this.config, 'scaleX').title("Scale x.").min(0.01).max(10.0).step(0.01).onChange( function() { _self.draw.scale.x = _self.fill.scale.x = _self.config.scaleX; _self.redraw(); } ).listen();
	fold0.add(this.config, 'scaleY').title("Scale y.").min(0.01).max(10.0).step(0.01).onChange( function() { _self.draw.scale.y = _self.fill.scale.y = _self.config.scaleY; _self.redraw(); } ).listen();
	fold0.add(this.config, 'rasterGrid').title("Draw a fine raster instead a full grid.").onChange( function() { _self.redraw(); } ).listen();
	fold0.add(this.config, 'redrawOnResize').title("Automatically redraw the data if window or canvas is resized.").listen();
	fold0.addColor(this.config, 'backgroundColor').onChange( function() { _self.redraw(); } ).title("Choose a background color.");
	// fold0.add(bp.config, 'loadImage').name('Load Image').title("Load a background image.");
	
	var fold1 = gui.addFolder('Export');
	fold1.add(this.config, 'saveFile').name('Save a file').title("Save as SVG.");	 
	
	return gui;
    };


    /** +---------------------------------------------------------------------------------
     * A set of helper functions.
    **/ // +-------------------------------
    PlotBoilerplate.utils = {
	
	/** +---------------------------------------------------------------------------------
	 * Merge the elements in the 'extension' object into the 'base' object based on
	 * the keys of 'base'.
	 *
	 * @param base:Object
	 * @param extension:Object
	 * @return Object base extended by the new attributes.
	 **/ // +-------------------------------
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
	}
    };
    
    _context.PlotBoilerplate = PlotBoilerplate;
    
})(window); 





