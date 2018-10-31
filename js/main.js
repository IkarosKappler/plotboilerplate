/**
 * The main script of the generic plotter.
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
    window.addEventListener('load',function() {
	
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = {
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
	for( var k in config ) {
	    if( !GUP.hasOwnProperty(k) )
		continue;
	    var type = typeof config[k];
	    if( type == 'boolean' ) config[k] = !!JSON.parse(GUP[k]);
	    else if( type == 'number' ) config[k] = JSON.parse(GUP[k])*1;
	    else if( type == 'function' ) ;
	    else config[k] = GUP[k];
	}

	
	var canvas              = document.getElementById('my-canvas'); 
	var ctx                 = canvas.getContext('2d');
	var draw                = new drawutils(ctx,false);
	var fill                = new drawutils(ctx,true);
	var image               = null; // An image.
	var imageBuffer         = null; // A canvas to read the pixel data from.
	var canvasSize          = { width : DEFAULT_CANVAS_WIDTH, height : DEFAULT_CANVAS_HEIGHT };

	var vertices            = [];

	var draggedElements     = [];

	var initDrawableObjects = function() {
	    var radius = Math.min(canvasSize.width,canvasSize.height)/3;
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
	    vertices = [];
	    for( var i in bpath ) {
		//draw.cubicBezierHandleLines(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3]);
		//draw.cubicBezierHandles(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3],'#00a822');
		vertices.push( bpath[i][0] );
		vertices.push( bpath[i][1] );
		vertices.push( bpath[i][2] );
		vertices.push( bpath[i][3] );
	    }
	};
	
	
	// +---------------------------------------------------------------------------------
	// | The re-drawing function.
	// +-------------------------------
	var redraw = function() {	    
	    // Note that the image might have an alpha channel. Clear the scene first.
	    ctx.fillStyle = config.backgroundColor; 
	    ctx.fillRect(0,0,canvasSize.width,canvasSize.height);

	    //draw.scale.x = config.scaleX;
	    //fill.scale.x = config.scaleY;

	    // Draw the background image?
	    if( image ) {
		if( config.fitImage ) {
		    ctx.drawImage(image,0,0,image.width,image.height,0,0,canvasSize.width,canvasSize.height);
		} else {
		    ctx.drawImage(image,0,0);
		}
	    }

	    console.log('draw');
	    var radius = Math.min(canvasSize.width,canvasSize.height)/3;
	    draw.circle( {x:0,y:0}, radius, '#000000' );

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

	    for( var i in vertices ) {
		draw.square( vertices[i], 5, 'rgba(0,128,192,0.5)' );
	    }
	    
	    for( var i in bpath )
		draw.cubicBezier(bpath[i][0],bpath[i][1],bpath[i][2],bpath[i][3],'#00a822');
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
		image = new Image();
		image.onload = function() {
		    // Create image buffer
		    imageBuffer        = document.createElement('canvas');
		    imageBuffer.width  = image.width;
		    imageBuffer.height = image.height;
		    imageBuffer.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
		    redraw();
		}
		image.src = event.target.result;
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
	var resizeCanvas = function() {
	    var _setSize = function(w,h) {
		ctx.canvas.width  = w;
		ctx.canvas.height = h;		
		canvas.width      = w;
		canvas.height     = h;		
		canvasSize.width  = w;
		canvasSize.height = h;

		draw.offset.x = fill.offset.x = w/2;
		draw.offset.y = fill.offset.y = h/2;
	    };
	    if( config.fullSize && !config.fitToParent ) {
		// Set editor size
		var width  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		_setSize( width, height );
	    } else if( config.fitToParent ) {
		// Set editor size
		var width  = canvas.parentNode.clientWidth - 2; // 1px border
		var height = canvas.parentNode.clientHeight - 2; // 1px border
		_setSize( width, height );
	    } else {
                _setSize( DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT );
	    }
	    redraw();
	};
	window.addEventListener( 'resize', resizeCanvas );
	resizeCanvas();


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
	{ 
	    var gui = new dat.gui.GUI();
	    gui.remember(config);

	    gui.add(config, 'rebuild').name('Rebuild all').title('Rebuild all.');

	    var fold0 = gui.addFolder('Editor settings');
	    fold0.add(config, 'fullSize').onChange( resizeCanvas ).title("Toggles the fullpage mode.");
	    fold0.add(config, 'fitToParent').onChange( resizeCanvas ).title("Toggles the fit-to-parent mode (overrides fullsize).");
	    fold0.add(config, 'scaleX').onChange( function() { console.log('changed'); draw.scale.x = fill.scale.x = config.scaleX; redraw(); } ).title("Scale x.").min(0.0).max(10.0).step(0.1);
	    fold0.add(config, 'drawEditorOutlines').onChange( redraw ).title("Toggle if editor outlines should be drawn.");
	    fold0.addColor(config, 'backgroundColor').onChange( redraw ).title("Choose a background color.");
	    fold0.add(config, 'loadImage').name('Load Image').title("Load a background image to pick triangle colors from.");

	    var fold1 = gui.addFolder('Export');
	    fold1.add(config, 'saveFile').name('Save a file').title("Save a file.");
 	    
	}


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
	    for( var vindex in vertices ) {
		var vert = vertices[vindex];
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
	    return { x : x/draw.scale.x-draw.offset.x, y : y/draw.scale.y-draw.offset.y };
	};

	// +---------------------------------------------------------------------------------
	// | Install a mouse handler on the canvas.
	// +-------------------------------
	new MouseHandler(canvas)
	    .mousedown( function(e) {
		if( e.which != 1 )
		    return; // Only react on left mouse
		var p = locatePointNear( transformMousePosition(e.params.pos.x, e.params.pos.y) );
		console.log( p );
		if( !p ) return;
		draggedElements.push( p );
		//p.listeners.fireDragStartEvent( e );
		if( p.type == 'bpath' )
		    paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragStartEvent( e );
		else if( p.type == 'vertex' )
		    vertices[p.vindex].listeners.fireDragStartEvent( e );
		redraw();
	    } )
	    .drag( function(e) {
		for( var i in draggedElements ) {
		    var p = draggedElements[i];
		    // console.log( 'i', i, 'pid', p.pid, 'pindex', p.pindex, 'cindex', p.cindex );
		    if( p.type == 'bpath' ) {
			paths[p.pindex].moveCurvePoint( p.cindex, p.pid, e.params.dragAmount );
			paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEvent( e );
		    } else if( p.type == 'vertex' ) {
			vertices[p.vindex].add( e.params.dragAmount );
			vertices[p.vindex].listeners.fireDragEvent( e );
		    }
		}
		redraw();
	    } )
	    .mouseup( function(e) {
		if( e.which != 1 )
		    return; // Only react on eft mouse;
		if( !e.params.wasDragged )
		    handleTap( e.params.pos.x, e.params.pos.y );
		for( var i in draggedElements ) {
		    var p = draggedElements[i];
		    // console.log( 'i', i, 'pid', p.pid, 'pindex', p.pindex, 'cindex', p.cindex );
		    if( p.type == 'bpath' ) {
			paths[p.pindex].bezierCurves[p.cindex].getPointByID(p.pid).listeners.fireDragEndEvent( e );
		    } else if( p.type == 'vertex' ) {
			vertices[p.vindex].listeners.fireDragEndEvent( e );
		    }
		}
		draggedElements = [];
		redraw();
	    } );

	
	// Initialize the dialog
	window.dialog = new overlayDialog('dialog-wrapper');
	// window.dialog.show( 'Inhalt', 'Test' );

	initDrawableObjects();
	
	// Init	
	redraw();
	
    } ); // END document.ready / window.onload
    
})(window); 




