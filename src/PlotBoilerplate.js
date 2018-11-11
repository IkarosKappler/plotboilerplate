/**
 * The main class of the PlotBoilerplate.
 *
 * @author   Ikaros Kappler
 * @date     2018-10-23
 * @version  1.0.0
 **/


(function(_context) {
    "use strict";

    
    
    // Fetch the GET params
    let GUP = gup();
    
    const DEFAULT_CANVAS_WIDTH = 1024;
    const DEFAULT_CANVAS_HEIGHT = 768;


    // +---------------------------------------------------------------------------------
    // | A helper function to trigger fake click events.
    // +----------------------------
    var triggerClickEvent = function(element) {
	element.dispatchEvent( new MouseEvent('click', {
	    view: window,
	    bubbles: true,
	    cancelable: true
	} ) );
    };


    // +---------------------------------------------------------------------------------
    // | A wrapper class for draggable items (mostly vertices).
    // +----------------------------
    (function(_context) {
	var Draggable = function( item, type ) {
	    this.item = item;
	    this.type = type;
	    this.vindex = null;
	    this.pindex = null;
	    this.cundex = null;
	};
	Draggable.VERTEX = 'vertex';
	Draggable.prototype.isVertex = function() { return this.type == Draggable.VERTEX; };
	Draggable.prototype.setVIndex = function(vindex) { this.vindex = vindex; return this; };

	_context.Draggable = Draggable;
    })(_context);
    

    // +---------------------------------------------------------------------------------
    // | Initialize everything.
    // +----------------------------
    //window.addEventListener('load',function() {
    var PlotBoilerplate = function( config ) {
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	this.config = {
	    fullSize              : true,
	    fitToParent           : true,
	    scaleX                : 1.5,
	    scaleY                : 1.0,
	    drawEditorOutlines    : true,
	    backgroundColor       : '#ffffff',
	    rebuild               : function() { rebuild(); },
	    loadImage             : function() { var elem = document.getElementById('file');
						 elem.setAttribute('data-type','image-upload');
						 triggerClickEvent(elem);
					       },
	    saveFile              : function() { saveFile(); }
	};
	// Merge GET params into config
	/*for( var k in config ) {
	    if( !GUP.hasOwnProperty(k) )
		continue;
	    var type = typeof config[k];
	    if( type == 'boolean' ) config[k] = !!JSON.parse(GUP[k]);
	    else if( type == 'number' ) config[k] = JSON.parse(GUP[k])*1;
	    else if( type == 'function' ) ;
	    else config[k] = GUP[k];
	}*/

	
	this.canvas              = document.getElementById('my-canvas'); 
	this.ctx                 = this.canvas.getContext('2d');
	this.draw                = new drawutils(this.ctx,false);
	this.fill                = new drawutils(this.ctx,true);
	this.image               = null; // An image.
	this.imageBuffer         = null; // A canvas to read the pixel data from.
	this.canvasSize          = { width : DEFAULT_CANVAS_WIDTH, height : DEFAULT_CANVAS_HEIGHT };

	this.vertices            = [];

	this.draggedElements     = [];

	var _self = this;
	PlotBoilerplate.prototype.initDrawableObjects = function() {
	    var radius = Math.min(_self.canvasSize.width,_self.canvasSize.height)/3;
	    //draw.circle( {x:0,y:0}, radius, '#000000' );
	    var fract = 0.5;
	    var bpath = [
		[ new Vertex( { x : 0, y : -radius } ),
		  new Vertex( { x : radius, y : 0 } ),
		  new Vertex( { x : radius*fract, y : -radius } ),
		  new Vertex( { x : radius*fract, y : 0 } ) ],
		[ new Vertex( { x : radius, y : 0 } ),
		  new Vertex( { x : 0, y : radius } ),
		  new Vertex( { x : radius, y : radius*fract } ),
		  new Vertex( { x : 0, y : radius*fract } ) ],
		[ new Vertex( { x : 0, y : radius } ),
		  new Vertex( { x : -radius, y : 0 } ),
		  new Vertex( { x : -radius*fract, y : radius } ),
		  new Vertex( { x : -radius*fract, y : 0 } ) ],
		[ new Vertex( { x : -radius, y : 0 } ),
		  new Vertex( { x : 0, y : -radius } ),
		  new Vertex( { x : -radius, y : -radius*fract } ),
		  new Vertex( { x : 0, y : -radius*fract } )
		] ];

	    // Construct
	    this.vertices = [];
	    for( var i in bpath ) {
		//draw.cubicBezierHandleLines(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3]);
		//draw.cubicBezierHandles(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3],'#00a822');
		this.vertices.push( bpath[i][0] );
		this.vertices.push( bpath[i][1] );
		this.vertices.push( bpath[i][2] );
		this.vertices.push( bpath[i][3] );
	    }
	};
	
	
	// +---------------------------------------------------------------------------------
	// | The re-drawing function.
	// +-------------------------------
	PlotBoilerplate.prototype.redraw = function() {	    
	    // Note that the image might have an alpha channel. Clear the scene first.
	    this.ctx.fillStyle = _self.config.backgroundColor; 
	    this.ctx.fillRect(0,0,_self.canvasSize.width,_self.canvasSize.height);

	    //draw.scale.x = config.scaleX;
	    //fill.scale.x = config.scaleY;

	    // Draw the background image?
	    if( _self.image ) {
		if( _self.config.fitImage ) {
		    _self.ctx.drawImage(_self.image,0,0,_self.image.width,_self.image.height,0,0,_self.canvasSize.width,_self.canvasSize.height);
		} else {
		    _self.ctx.drawImage(_self.image,0,0);
		}
	    }

	    console.log('draw');
	    var radius = Math.min(_self.canvasSize.width,_self.canvasSize.height)/3;
	    _self.draw.circle( {x:0,y:0}, radius, '#000000' );

	    var fract = 0.5;
	    var bpath = [
		[ new Vertex( { x : 0, y : -radius } ),
		  new Vertex( { x : radius, y : 0 } ),
		  new Vertex( { x : radius*fract, y : -radius } ),
		  new Vertex( { x : radius*fract, y : 0 } ) ],
		[ new Vertex( { x : radius, y : 0 } ),
		  new Vertex( { x : 0, y : radius } ),
		  new Vertex( { x : radius, y : radius*fract } ),
		  new Vertex( { x : 0, y : radius*fract } ) ],
		[ new Vertex( { x : 0, y : radius } ),
		  new Vertex( { x : -radius, y : 0 } ),
		  new Vertex( { x : -radius*fract, y : radius } ),
		  new Vertex( { x : -radius*fract, y : 0 } ) ],
		[ new Vertex( { x : -radius, y : 0 } ),
		  new Vertex( { x : 0, y : -radius } ),
		  new Vertex( { x : -radius, y : -radius*fract } ),
		  new Vertex( { x : 0, y : -radius*fract } )
		] ];

	    // Construct
	    /*
	    vertices = [];
	    for( var i in bpath ) {
		//draw.cubicBezierHandleLines(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3]);
		//draw.cubicBezierHandles(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3],'#00a822');
		vertices.push( bpath[i][0] );
		vertices.push( bpath[i][1] );
		vertices.push( bpath[i][2] );
		vertices.push( bpath[i][3] );
	    }
	    */

	    for( var i in this.vertices ) {
		_self.draw.square( this.vertices[i], 5, 'rgba(0,128,192,0.5)' );
	    }
	    
	    for( var i in bpath )
		this.draw.cubicBezier(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3],'#00a822');
	};
	
	
	// +---------------------------------------------------------------------------------
	// | Handle a dropped image: initially draw the image (to fill the background).
	// +-------------------------------
	var handleImage = function(e) {
	    var validImageTypes = "image/gif,image/jpeg,image/jpg,image/gif,image/png";
	    if( validImageTypes.indexOf(e.target.files[0].type) == -1 ) {
		if( !window.confirm('This seems not to be an image ('+e.target.files[0].type+'). Continue?') )
		    return;
	    }	    
	    var reader = new FileReader();
	    reader.onload = function(event){
		this.image = new Image();
		this.image.onload = function() {
		    // Create image buffer
		    imageBuffer        = document.createElement('canvas');
		    imageBuffer.width  = this.image.width;
		    imageBuffer.height = this.image.height;
		    imageBuffer.getContext('2d').drawImage(this.image, 0, 0, this.image.width, image.height);
		    redraw();
		}
		this.image.src = event.target.result;
	    }
	    reader.readAsDataURL(e.target.files[0]);     
	}

	
	// +---------------------------------------------------------------------------------
	// | Decide which file type should be handled:
	// |  - image for the background or
	// |  - JSON (for the point set)
	// +-------------------------------
	var handleFile = function(e) {
	    var type = document.getElementById('file').getAttribute('data-type');
	    if( type == 'image-upload' ) {
		handleImage(e);
	    } else {
		console.warn('Unrecognized upload type: ' + type );
	    }   
	}
	document.getElementById( 'file' ).addEventListener('change', handleFile );
	

	// +---------------------------------------------------------------------------------
	// | Just a generic save-file dialog.
	// +-------------------------------
	var saveFile = function() {
	    // See documentation for FileSaver.js for usage.
	    //    https://github.com/eligrey/FileSaver.js
	    var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
	    saveAs(blob, "helloworld.txt");
	};
	
	
	// +---------------------------------------------------------------------------------
	// | The rebuild function just evaluates the input and
	// |  - triangulate the point set?
	// |  - build the voronoi diagram?
	// +-------------------------------
	var rebuild = function() {
	    // ...
	};


	// +---------------------------------------------------------------------------------
	// | This function resizes the canvas to the required settings (toggles fullscreen).
	// +-------------------------------
	PlotBoilerplate.prototype.resizeCanvas = function() {
	    var _setSize = function(w,h) {
		_self.ctx.canvas.width  = w;
		_self.ctx.canvas.height = h;		
		_self.canvas.width      = w;
		_self.canvas.height     = h;		
		_self.canvasSize.width  = w;
		_self.canvasSize.height = h;

		_self.draw.offset.x = _self.fill.offset.x = w/2;
		_self.draw.offset.y = _self.fill.offset.y = h/2;
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
                _setSize( DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT );
	    }
	    _self.redraw();
	};
	_context.addEventListener( 'resize', this.resizeCanvas );
	this.resizeCanvas();


	// +---------------------------------------------------------------------------------
	// | Handle left-click and tap event
	// +-------------------------------
	function handleTap(x,y) {
	    
	}

	// +---------------------------------------------------------------------------------
        // | Locates the point (index) at the passed position. Using an internal tolerance of 7 pixels.
	// |
	// | The result is an object { type : 'bpath', pindex, cindex, pid }
	// |
        // | Returns false if no point is near the passed position.
        // +-------------------------------
        var locatePointNear = function( point ) {
            var tolerance = 7;
	    // var point = { x : x, y : y };
	    // Search in vertices
	    for( var vindex in _self.vertices ) {
		var vert = _self.vertices[vindex];
		if( vert.distance(point) < tolerance ) {
		    // console.log( 'vertex found.' );
		    return new Draggable( vert, Draggable.VERTEX ).setVIndex(vindex); //{ type : 'vertex', vindex : vindex };
		}
	    }
	    
	    // Search in paths
	    /*
	    for( var pindex = 0; pindex < paths.length; pindex++ ) {
		var path = paths[pindex];
		for( var cindex = 0; cindex < path.bezierCurves.length; cindex++ ) {
		    var curve = path.bezierCurves[cindex];
		    let p = curve.startControlPoint;
                    let dist = p.distance(point); // Math.sqrt( Math.pow(x-p.x,2) + Math.pow(y-p.y,2) );
                    if( dist <= tolerance )
			return { type : 'bpath', pindex : pindex, cindex : cindex, pid : curve.START_CONTROL_POINT };
		    p = curve.endControlPoint;
                    dist = p.distance(point); // Math.sqrt( Math.pow(x-p.x,2) + Math.pow(y-p.y,2) );
                    if( dist <= tolerance )
			return { type : 'bpath', pindex : pindex, cindex : cindex, pid : curve.END_CONTROL_POINT };
		    p = curve.startPoint;
                    dist = p.distance(point); // Math.sqrt( Math.pow(x-p.x,2) + Math.pow(y-p.y,2) );
                    if( dist <= tolerance )
			return { type : 'bpath', pindex : pindex, cindex : cindex, pid : curve.START_POINT };
		    p = curve.endPoint;
                    dist = p.distance(point); // Math.sqrt( Math.pow(x-p.x,2) + Math.pow(y-p.y,2) );
                    if( dist <= tolerance )
			return { type : 'bpath', pindex : pindex, cindex : cindex, pid : curve.END_POINT };
		}
            }
	    */
            return false;
        }

	var transformMousePosition = function( x, y ) {
	    return { x : x/_self.draw.scale.x-_self.draw.offset.x, y : y/_self.draw.scale.y-_self.draw.offset.y };
	};

	// +---------------------------------------------------------------------------------
	// | Install a mouse handler on the canvas.
	// +-------------------------------
	new MouseHandler(this.canvas)
	    .mousedown( function(e) {
		if( e.which != 1 )
		    return; // Only react on left mouse
		var p = locatePointNear( transformMousePosition(e.params.pos.x, e.params.pos.y) );
		console.log( p );
		if( !p ) return;
		_self.draggedElements.push( p );
		//p.listeners.fireDragStartEvent( e );
		if( p.type == 'bpath' )
		    _self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragStartEvent( e );
		else if( p.type == 'vertex' )
		    _self.vertices[p.vindex].listeners.fireDragStartEvent( e );
		_self.redraw();
	    } )
	    .drag( function(e) {
		for( var i in _self.draggedElements ) {
		    var p = _self.draggedElements[i];
		    // console.log( 'i', i, 'pid', p.pid, 'pindex', p.pindex, 'cindex', p.cindex );
		    if( p.type == 'bpath' ) {
			_self.paths[p.pindex].moveCurvePoint( p.cindex, p.pid, e.params.dragAmount );
			_self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent( e );
		    } else if( p.type == 'vertex' ) {
			_self.vertices[p.vindex].add( e.params.dragAmount );
			_self.vertices[p.vindex].listeners.fireDragEvent( e );
		    }
		}
		_self.redraw();
	    } )
	    .mouseup( function(e) {
		if( e.which != 1 )
		    return; // Only react on left mouse;
		if( !e.params.wasDragged )
		    handleTap( e.params.pos.x, e.params.pos.y );
		for( var i in _self.draggedElements ) {
		    var p = _self.draggedElements[i];
		    // console.log( 'i', i, 'pid', p.pid, 'pindex', p.pindex, 'cindex', p.cindex );
		    if( p.type == 'bpath' ) {
			_self.paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent( e );
		    } else if( p.type == 'vertex' ) {
			_self.vertices[p.vindex].listeners.fireDragEndEvent( e );
		    }
		}
		_self.draggedElements = [];
		_self.redraw();
	    } );

	// Install key handler
	var keyHandler = new KeyHandler( { trackAll : true } )
	    .down('enter',function() { console.log('ENTER was hit.'); } )
	    .press('enter',function() { console.log('ENTER was pressed.'); } )
	    .up('enter',function() { console.log('ENTER was released.'); } )

	    .down('e',function() { console.log('e was hit. shift is pressed?',keyHandler.isDown('shift')); } ) 

	    .up('windows',function() { console.log('windows was released.'); } )
	;
	
	
	// Initialize the dialog
	window.dialog = new overlayDialog('dialog-wrapper');
	// window.dialog.show( 'Inhalt', 'Test' );

	this.initDrawableObjects();
	
	// Init	
	this.redraw();
	
    }; // END construcor 'PlotBoilerplate'

    _context.PlotBoilerplate = PlotBoilerplate;
    
})(window); 





