/**
 * The main script of the generic plotter: the SVG version.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, drawgl
 * 
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-01-10
 * @version     0.0.1
 **/


(function(_context) {
    "use strict";

    // Fetch the GET params
    let GUP = gup();
    
    window.addEventListener(
	'load',
	function() {
	    console.log( document.getElementById('my-svg-canvas').tagName );
	    // All config params are optional.
	    var pb = new PlotBoilerplate(
		PlotBoilerplate.utils.safeMergeByKeys(
		    { canvas                : document.getElementById('my-svg-canvas'),
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
		      enableKeys            : true,
		      enableGL              : true   // This one is experimental
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
				     // humane.log(arguments[0]);
				 },
				 error : function() {
				     console.error(arguments);
				     humane.log(arguments[0]);
				 }
			       } );
		humane.log('plotboilerplate-svg');
	    }
	    
	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    pb.createGUI(); 


	    // +---------------------------------------------------------------------------------
	    // | Add stats.
	    // +-------------------------------
	    var stats = {
		mouseX : 0,
		mouseY : 0
	    };
	    var uiStats = new UIStats( stats );
	    stats = uiStats.proxy;
	    uiStats.add( 'mouseX' );
	    uiStats.add( 'mouseY' );
	    

	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    new MouseHandler(pb.eventCatcher)
		.move( function(e) {
		    // Display the mouse position
		    var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		    stats.mouseX = relPos.x;
		    stats.mouseY = relPos.y;
		    console.log( 'canvasSize', pb.canvasSize );
		    console.log( 'viewPort', pb.viewport() );
		    console.log( 'draw.offset', pb.draw.offset );
		} );

	    // Use a helper function to build all demo-drawables.
	    var drawables = createDemoDrawables( pb.canvasSize,
						 'example-image.png',
						 function() { pb.redraw(); }
					       );
	    pb.add( drawables );
	} );
    
})(window); 




