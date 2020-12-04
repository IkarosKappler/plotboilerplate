/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2019-02-06
 * @version  1.0.0
 **/


(function(_context) {
    "use strict";

    window.initializePB = function() {
	if( window.pbInitialized )
	    return;
	window.pbInitialized = true;
	
	// Fetch the GET params
	let GUP = gup();

	
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
		  enableKeys            : true
		}, GUP
	    )
	);

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
	pb.createGUI(); 
	// END init dat.gui
	

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
	// | Add some elements to draw (demo).
	// +-------------------------------

	// Create two points. The origin is at the visual center by default.
	var pointA = new Vertex( -100, -100 );
	var pointB = new Vertex( 100, 100 );
	pb.add( new Line(pointA,pointB) );

	// When point A is moved by the user then move point B in the opposite direction
	pointA.listeners.addDragListener( function(e) {
	    pointB.sub( e.params.dragAmount );
	    pb.redraw();
	} );

	// and when point B is moved then move point A
	pointB.listeners.addDragListener( function(e) {
	    pointA.sub( e.params.dragAmount );
	    pb.redraw();
	} );

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
})(window); 
