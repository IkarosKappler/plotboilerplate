/**
 * A script for testing Urquhart (or Relative Neighbourhood) Graphs.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui, Delaunay, delaunay2urquhart
 *
 * https://observablehq.com/@mbostock/convex-polygon-incircle
 * https://observablehq.com/@mbostock/circle-tangent-to-three-lines
 *
 * 
 * @author   Ikaros Kappler
 * @date     2019-04-27
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
	    var convexHull = getConvexHull( pointList.pointList );
	    var n = convexHull.length;
	    // console.log( 'convexHull', convexHull );
	    if( config.drawConvexHull )
		drawConvexHull( convexHull );

	    // Draw all inner bisectors
	    for( var i = 1; i <= n; i++ ) {
		var a = i-1;
		var b = i%n;
		var c = (i+1)%n;
		var d = (i+2)%n;
		var lineA = new Line( convexHull[a], convexHull[b] );
		var lineB = new Line( convexHull[b], convexHull[c] );
		var lineC = new Line( convexHull[c], convexHull[d] );
		//var bisector = bisectAngle( convexHull[i%n], convexHull[(i+1)%n], convexHull[ i-1 ] );
		var bisector = bisectAngle( convexHull[b], convexHull[a], convexHull[c] );
		//console.log( 'bisector', bisector );
		pb.draw.line( bisector.a, bisector.b.scale(2.0,bisector.a), 'rgba(255,128,0,0.5)', 1 );

		var bisector2 = bisectAngle( convexHull[(i+1)%n], convexHull[(i+2)%n], convexHull[i%n] );
		var bisector2 = bisectAngle( convexHull[c], convexHull[b], convexHull[d] );
		//pb.draw.line( bisector2.a, bisector2.b.scale(2.0,bisector2.a), 'rgba(255,128,0,0.5)', 1 );

		var intersection = bisector.intersection( bisector2 );
		pb.draw.circle( intersection, 5, 'rgba(255,0,0,1.0)', 2 );

		// Find the closest points on one of the polygon lines (all have same distance by construction)
		var circleIntersA = lineA.getClosestPoint( intersection );
		var circleIntersB = lineB.getClosestPoint( intersection );
		var circleIntersC = lineC.getClosestPoint( intersection );
		pb.draw.circle( circleIntersA, 5, 'rgba(0,192,0,1.0)', 2 );
		pb.draw.circle( circleIntersB, 5, 'rgba(0,192,0,1.0)', 2 );
		pb.draw.circle( circleIntersC, 5, 'rgba(0,192,0,1.0)', 2 );

		// { center: Vertex, radius: number }
		var circle = new Triangle(circleIntersA, circleIntersB, circleIntersC).getCircumcircle();
		if( i == 1 ) {
		    console.log( 'circle', circle );
		    pb.draw.line( intersection, circleIntersA, 'rgba(192,192,192,0.5)', 1 );
		    pb.draw.line( intersection, circleIntersB, 'rgba(192,192,192,0.5)', 1 );
		    pb.draw.line( intersection, circleIntersC, 'rgba(192,192,192,0.5)', 1 );
		    // Check if circle intersects some other lines
		    var intersectingLineIndices = findCircleIntersections( convexHull, new Circle(circle.center, circle.radius) );
		    var circleIsTooLarge = intersectingLineIndices.length > 3;
		    pb.draw.circle( intersection, circle.radius, circleIsTooLarge ? 'rgba(255,0,0,0.5)' : 'rgba(192,192,192,0.5)', 1 );
		}
	    }

	    // Try all possibilies of triple-pairs
	    for( var a = 0; a < n; a++ ) {
		for( var b = 0; b < n; b++ ) {
		    for( var c = 0; c < n; c++ ) {
			
		    }
		}
	    }
	};

	var drawConvexHull = function( convexHull ) {
	    var n = convexHull.length;
	    var a, b;
	    for( var i = 0; i < n; i++ ) {
		a = convexHull[i];
		b = convexHull[(i+1)%n];
		pb.draw.line( a, b, i<3 ? 'rgba(0,192,255,1.0)' : 'rgba(0,255,192,1.0)', 2.0 );
		if( i == 0 )
		    pb.draw.circle( a, 8, 'rgba(192,192,192,0.75)', 1.0 );
	    }
	};


	// circle : { center : Vertex, radius : number }
	var findCircleIntersections = function( convexHull, circle ) {
	    var result = [];
	    for( var i = 0; i < convexHull.length; i++ ) {
		var line = new Line( convexHull[i], convexHull[(i+1)%convexHull.length] );
		if( circle.lineDistance(line) <= 0 ) {
		    result.push( i );
		}
	    }
	    return result;
	};

	// +---------------------------------------------------------------------------------
	// | Compute the bisection of the angle in point A.
	// +-------------------------------
	var bisectAngle = function( pA, pB, pC ) {
	    var result = {};
	    result.triangle    = new Triangle( pA, pB, pC );
	    result.lineAB      = new Line( pA, pB );
	    result.lineAC      = new Line( pA, pC );
	    // Compute the slope (theta) of line AB and line AC
	    result.thetaAB     = result.lineAB.angle();
	    result.thetaAC     = result.lineAC.angle();
	    // Compute the difference; this is the angle between AB and AC
	    result.insideAngle = result.lineAB.angle( result.lineAC );
	    // We want the inner angles of the triangle, not the outer angle;
	    //   which one is which depends on the triangle 'direction'
	    result.clockwise   = result.triangle.determinant() > 0;
	    
	    // For convenience convert the angle [-PI,PI] to [0,2*PI]
	    if( result.insideAngle < 0 )
		result.insideAngle = 2*Math.PI + result.insideAngle;
	    if( !result.clockwise )
		result.insideAngle = (2*Math.PI - result.insideAngle) * (-1);  

	    // Scale the rotated lines to the max leg length (looks better)
	    var lineLength  = Math.max( result.lineAB.length(), result.lineAC.length() );
	    var scaleFactor = lineLength/result.lineAB.length();

	    return new Line( pA.clone(), pB.clone().rotate((-result.insideAngle/2.0), pA) ).scale(scaleFactor);   // inner sector line
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
	    pointCount            : 12,
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
	    gui.add(config, 'pointCount').min(3).max(96).onChange( function() { updatePointList(); } ).name("Point count").title("Point count");
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


