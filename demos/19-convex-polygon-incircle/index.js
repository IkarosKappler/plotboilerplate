/**
 * A script for constructing max incircles for any convex polygon.
 *
 * To assure 'convexness' for a random vertex sets we are using the convex hull 
 * of all points here.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, convexHull, nSectAngle
 *
 * 
 * @author   Ikaros Kappler
 * @date     2019-05-04
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
		  enableTouch           : true,

		  enableSVGExport       : false
		}, GUP
	    )
	);

	

	var drawAll = function() {
	    var convexHull = new Polygon( getConvexHull( pointList.pointList ),
					  false  // isOpen=false
					);

	    if( config.drawConvexHull )
		pb.draw.polyline( convexHull.vertices, false, 'rgba(0,192,255,1.0)', 2 );

	    drawInnerBisectors( convexHull );

	    var result = convexPolygonIncircle( convexHull );
	    var circle = result.circle;
	    var triangle = result.triangle;
	    // Now we should have found the best inlying circle (and the corresponding triangle).
	    pb.draw.circle( circle.center, circle.radius, 'rgba(255,192,0,1.0)', 2 );
	    pb.draw.circle( circle.center, 5, 'rgba(255,0,0,1.0)', 2 );
	    pb.draw.circle( triangle.a, 5, 'rgba(0,192,0,1.0)', 2 );
	    pb.draw.circle( triangle.b, 5, 'rgba(0,192,0,1.0)', 2 );
	    pb.draw.circle( triangle.c, 5, 'rgba(0,192,0,1.0)', 2 );
	};
	

	/**
	 * Draw all inner bisector lines.
	 *
	 * @param {Polygon} convexHull
	 */
	var drawInnerBisectors = function( convexHull ) {
	    var n = convexHull.vertices.length;
	    for( var i = 1; i <= convexHull.vertices.length; i++ ) {
		var bisector = nsectAngle( convexHull.vertices[i%n], convexHull.vertices[(i-1)%n], convexHull.vertices[(i+1)%n], 2 )[0];
		pb.draw.line( bisector.a, bisector.b.scale(2.0,bisector.a), 'rgba(255,128,0,0.25)', 1 );
	    }
	};


	// +---------------------------------------------------------------------------------
	// | Let a poinst list manager do the randomization of the three points.
	// +-------------------------------
	var pointList = new CanvasPointList( pb, function(newVert) { newVert.attr.pointListIndex = pointList.pointList.length-1; } );
	// Keep a safe border to the left/right and top/bottom (0.1 each)
	pointList.verticalFillRatio = 0.8;
	pointList.horizontalFillRatio = 0.8;
	

	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'convexhull-demo')
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
	    pointCount            : 6,
	    drawConvexHull        : true,
	    animate               : false,
	}, GUP );
	

	// +---------------------------------------------------------------------------------
	// | Call when the number of desired points changed in config.pointCount.
	// +-------------------------------
	var updatePointList = function() {
	    pointList.updatePointCount(config.pointCount,false); // No full cover
	    animator = new LinearVertexAnimator( pointList.pointList, pb.viewport(), function() { pb.redraw(); } );
	};


	// +---------------------------------------------------------------------------------
	// | Manually add a vertex to the point list (like on click).
	// +-------------------------------
	var addVertex = function(vert) {
	    pointList.addVertex(vert);
	    config.pointCount++;
	    if( animator ) animator.stop();
	    animator = new LinearVertexAnimator( pointList.pointList, pb.viewport(), function() { pb.redraw(); } );
	    toggleAnimation();
	    pb.redraw(); 
	    
	};


	// +---------------------------------------------------------------------------------
	// | Some animation stuff.
	// +-------------------------------
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

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'pointCount').min(3).max(96).step(1).onChange( function() { updatePointList(); } ).name("Point count").title("Point count");
	    gui.add(config, 'drawConvexHull').onChange( function() { pb.redraw(); } ).name('Draw Convex Hull').title('Draw the Convex Hull.');
	    gui.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate points').title('Animate points.');
	}

	toggleAnimation();
	updatePointList();

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


