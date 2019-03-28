/**
 * The main script of the generic plotter.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2018-10-23
 * @modified 2018-11-09 Refactored the old code.
 * @modified 2018-12-17 Added the config.redrawOnResize param.
 * @version  1.0.2
 **/


(function(_context) {
    "use strict";

    // Fetch the GET params
    let GUP = gup();
    
    window.addEventListener(
	'load',
	function() {
	    // All config params are optional.
	    var pb = new PlotBoilerplate(
		PlotBoilerplate.utils.safeMergeByKeys(
		    { canvas                : document.getElementById('my-canvas'),					    
		      fullSize              : true,
		      fitToParent           : true,
		      scaleX                : 1.0,
		      scaleY                : 1.0,
		      rasterGrid            : true,
		      drawOrigin            : true,
		      rasterAdjustFactor    : 2.0,
		      redrawOnResize        : true,
		      defaultCanvasWidth    : 1024,
		      defaultCanvasHeight   : 768,
		      canvasWidthFactor     : 1.0,
		      canvasHeightFactor    : 1.0,
		      cssScaleX             : 1.0,
		      cssScaleY             : 1.0,
		      cssUniformScale       : true,
		      autoAdjustOffset      : true,
		      offsetAdjustXPercent  : 50,
		      offsetAdjustYPercent  : 50,
		      backgroundColor       : '#ffffff',
		      enableMouse           : true,
		      enableTouch           : true,
		      enableKeys            : true
		    }, GUP
		)
	    );

	    if( typeof humane != 'undefined' ) {
		pb.setConsole( { warn : function() {
		                     console.warn(arguments);
		                     humane.log(arguments[0]);
	                         }, 
				 log : function() {
				     console.log(arguments);
				     humane.log(arguments[0]);
				 },
				 error : function() {
				     console.error(arguments);
				     humane.log(arguments[0]);
				 }
			       } );
	    }
	    humane.log('PlotBoilerplate');
	   	    

	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    new MouseHandler(pb.canvas)
		.move( function(e) {
		    var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		    var cx = document.getElementById('cx');
		    var cy = document.getElementById('cy');
		    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
		} );
	    // +---------------------------------------------------------------------------------
	    // | Add a touch listener to track the touch position.
	    // +-------------------------------
	    new Touchy( pb.canvas,
			{ one : function( hand, finger ) {
			    var relPos = pb.transformMousePosition( finger.lastPoint.x, finger.lastPoint.y ); //e.params.pos.x, e.params.pos.y );
			    var cx = document.getElementById('cx');
			    var cy = document.getElementById('cy');
			    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
			    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
			    
			    hand.on('move', function (points) {
				relPos = pb.transformMousePosition( points[0].x, points[0].y ); //e.params.pos.x, e.params.pos.y );
				if( cx ) cx.innerHTML = relPos.x.toFixed(2);
				if( cy ) cy.innerHTML = relPos.y.toFixed(2);
			    } );
			}
			}
		      );

	    // +---------------------------------------------------------------------------------
	    // | Add some elements to draw (demo).
	    // +-------------------------------
	    var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/3.5;
	    var radius   = diameter*0.5;
	    var hypo     = Math.sqrt( radius*radius*2 );

	    // +---------------------------------------------------------------------------------
	    // | Add an image.
	    // +-------------------------------
	    var img = new Image(diameter,diameter);
	    pb.add( new PBImage(img, new Vertex(-radius,-radius), new Vertex(radius,radius)), false );
	   
	    // Finally load the image
	    img.addEventListener('load', function() { pb.redraw(); } );
	    img.src = '../../example-image.png';



	    /** +---------------------------------------------------------------------------------
	     * Handle a dropped image: initially draw the image (to fill the background).
	     **/ // +-------------------------------
	    var handleImage = function(e) {
		var validImageTypes = "image/gif,image/jpeg,image/jpg,image/gif,image/png,image/tiff";
		if( validImageTypes.indexOf(e.target.files[0].type) == -1 ) {
		    if( !window.confirm('This seems not to be an image ('+e.target.files[0].type+'). Continue?') )
			return;
		}	    
		var reader = new FileReader();
		reader.onload = function(event) {
		    var _image = new Image();
		    _image.onload = function() {
			// Create image buffer
			var imageBuffer    = document.createElement('canvas');
			imageBuffer.width  = _image.naturalWidth;
			imageBuffer.height = _image.naturalHeight;
			imageBuffer.getContext('2d').drawImage(_image, 0, 0, _image.width, _image.height);
			var ratio = _image.naturalWidth/_image.naturalHeight;
			pb.add( new PBImage(_image, new Vertex(-radius,-radius/ratio), new Vertex(radius,radius/ratio) ) );
		    }
		    _image.onerror = function(error) {
			console.log( error );
			pb.console.error('Could not load image due to unkown reasons. Does it exist?' );
		    };
		    _image.src = event.target.result;
		}
		reader.readAsDataURL(e.target.files[0]);     
	    }
	    /** +---------------------------------------------------------------------------------
	     * Decide which file type should be handled:
	     *  - image for the background or
	     *  - JSON (for the point set)
	     **/ // +-------------------------------
	    var handleFile = function(e) {
		var type = document.getElementById('file').getAttribute('data-type');
		if( type == 'image-upload' ) {
		    handleImage(e);
		} else {
		    _self.console.warn('Unrecognized upload type: ' + type );
		}   
	    }
	    document.getElementById( 'file' ).addEventListener('change', handleFile );

	    /** 
	     * A helper function to trigger fake click events.
	     **/ // +----------------------------
	    var triggerClickEvent = function(element) {
		element.dispatchEvent( new MouseEvent('click', {
		    view: window,
		    bubbles: true,
		    cancelable: true
		} ) );
	    };


	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    var gui = pb.createGUI();
	    var folder = gui.addFolder('Import');
	    folder.add({ uploadImage : function() { triggerClickEvent(document.getElementById( 'file' )); } }, 'uploadImage').title("Upload an image to the canvas.");
	    // END init dat.gui
	} );
    
})(window); 




