/**
 * A script for testing vector fields.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2019-02-03
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
		  drawOrigin            : false,
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
		  enableKeys            : true,
		  enableTouch           : true
		}, GUP
	    )
	);

	
	// +---------------------------------------------------------------------------------
	// | This is the triangle instance we will work on.
	// +-------------------------------
	var hobbyPath = new HobbyPath();

	var drawHandleLine = function( start, end ) {
	    pb.draw.line( start, end, 'rgba(0,192,64,0.55)', 3 );
	    var perpA = new Vector(end,start).perp().setLength(12);
	    var perpB = perpA.clone().inv();
	    pb.draw.line( perpA.b, perpB.b, 'rgba(0,192,64,0.65)', 1 );
	};
	
	// +---------------------------------------------------------------------------------
	// | Compute and draw the Morley triangle.
	// +-------------------------------
	var drawHobby = function() {
	    pb.draw.circleHandle( pb.vertices[0], 10, 'rgba(192,192,192,1.0)' );
	    pb.draw.polyline( pb.vertices, true, 'rgba(192,192,192,0.5)', 1 );

	    var curves = hobbyPath.generateCurve( config.circular, config.omega );
	    for( var i = 0; i < curves.length; i++ ) {		
		pb.draw.cubicBezier( curves[i].startPoint,
				     curves[i].endPoint, 
				     curves[i].startControlPoint, 
				     curves[i].endControlPoint, 
				     'rgba(255,128,0,0.95)',
				     5
				   );
		drawHandleLine( curves[i].startPoint, curves[i].startControlPoint );
		drawHandleLine( curves[i].endPoint, curves[i].endControlPoint );
	    }
	};
	



	// +---------------------------------------------------------------------------------
	// | Let a poinst list manager do the randomization of the three points.
	// +-------------------------------
	var pointList = new CanvasPointList( pb );
	// Keep a safe border to the left/right and top/bottom (0.1 each)
	pointList.verticalFillRatio = 0.8;
	pointList.horizontalFillRatio = 0.8;
	

	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'hobby-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);
	    } )
	    .up( function(e) {
		if( e.params.wasDragged )
		    return;
		var vert = new Vertex( pb.transformMousePosition( e.params.pos.x, e.params.pos.y ) );
		addVertex(vert);
	    } );  


	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    circular              : false,
	    pointCount            : 4,
	    omega                 : 0,
	    animate               : false,
	    colors                : {
		trisectors : [ 'rgba(0,164,0,0.5)', 'rgba(255,128,0,0.5)', 'rgba(0,96,255,0.5)' ],
		hexagon : 'rgba(0,164,255,0.7)',
		triangle : 'rgba(255,128,0,1.0)'
	    }
	}, GUP );
	

	var updatePointList = function() {
	    pointList.updatePointCount(config.pointCount,false); // No full cover
	    animator = new LinearVertexAnimator( pointList.pointList, pb.viewport(), function() { pb.redraw(); } );
	    hobbyPath = new HobbyPath();
	    for( var i = 0; i < pointList.pointList.length; i++ )
		hobbyPath.addPoint( pointList.pointList[i] );
	};



	var animator = null;
	function renderAnimation() {
	    if( config.animate )
		window.requestAnimationFrame( renderAnimation );
	    else // Animation stopped
		; 
	};
	
	function toggleAnimation() {
	    if( config.animate ) {
		if( animator )
		    animator.start();
		renderAnimation();
	    } else {
		if( animator )
		    animator.stop();
		pb.redraw();
	    }
	};

	var addVertex = function(vert) {
	    pointList.addVertex(vert);
	    hobbyPath.addPoint(vert);
	    config.pointCount++;
	    pb.redraw();
	};

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();

	    var f0 = gui.addFolder('Colors');
	    f0.addColor(config.colors.trisectors, 0).onChange( function() { pb.redraw(); } ).name('Trisector A').title('The first trisector');
	    f0.addColor(config.colors.trisectors, 1).onChange( function() { pb.redraw(); } ).name('Trisector B').title('The second trisector');
	    f0.addColor(config.colors.trisectors, 2).onChange( function() { pb.redraw(); } ).name('Trisector C').title('The third trisector');
	    f0.addColor(config.colors, 'hexagon').onChange( function() { pb.redraw(); } ).name('Hexagon').title('The hexagon color');
	    f0.addColor(config.colors, 'triangle').onChange( function() { pb.redraw(); } ).name('Triangle').title('The triangle color');
	    
	    var f1 = gui.addFolder('Path');
	    f1.add(config, 'circular').onChange( function() { pb.redraw(); } ).name('Circular').title('Close the loop.');
	    f1.add(config, 'omega').min(0).max(2.0).step(0.01).onChange( function() { pb.redraw(); } ).name('Omega').title("The 'curviness'.");
	    f1.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate points').title('Animate points.');
	    f1.open();
	}

	toggleAnimation();
	updatePointList();

	pb.config.preDraw = drawHobby;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


