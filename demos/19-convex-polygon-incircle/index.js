/**
 * A script for testing Urquhart (or Relative Neighbourhood) Graphs.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, convexHull
 *
 * https://observablehq.com/@mbostock/convex-polygon-incircle
 * https://observablehq.com/@mbostock/circle-tangent-to-three-lines
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

	    // Try all possibilies of triple-pairs
	    /* var bestCircle = undefined;
	    var bestTriangle = undefined;
	    for( var a = 0; a < n; a++ ) {
		for( var b = a+1; b < n; b++ ) {
		    for( var c = b+1; c < n; c++ ) {
			// As these lines are part of the convex hull, we know that
			//  * line a preceeds line b and
			//  * line b preceeds line c :)
			var lineA = new Line( convexHull.vertices[a], convexHull.vertices[(a+1)%n] );
			var lineB = new Line( convexHull.vertices[b], convexHull.vertices[(b+1)%n] );
			var lineC = new Line( convexHull.vertices[c], convexHull.vertices[(c+1)%n] );

			// Find intersections by expanding the lines
			var vertB = lineA.intersection(lineB);
			var vertC = lineB.intersection(lineC);

			// An object: { center: Vertex, radius: number }
			var triangle = getTangentTriangle4( lineA.a, vertB, vertC, lineC.b );
			// Workaround. There will be a future version where the 'getCircumCircle()' functions
			// returns a real Circle instance.
			var _circle = triangle.getCircumcircle();
			var circle = new Circle( _circle.center, _circle.radius );

			// Count the number of intersections with the convex hull:
			// If there are exactly three, we have found an in-lying circle.
			//  * Check if this one is better (bigger) than the old one.
			//  * Also check if the circle is located inside the polygon;
			//    The construction can, in some cases, produce an out-lying circle.
			if( !convexHull.containsVert(circle.center) )
			    continue;
			var circleIntersections = findCircleIntersections( convexHull, circle );
			if( circleIntersections.length == 3 && (bestCircle == undefined || bestCircle.radius < circle.radius) ) {
			    bestCircle = circle;
			    bestTriangle = triangle;
			}
		    }
		}
	    } */
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


	/**
	 * Compute the max sized inlying circle in the given convex (!) polygon - also called the
	 * convex-polygon incircle.
	 *
	 * The function will return an object with either: the circle, and the triangle that defines
	 * the three tangent points where the circle touches the polygon.
	 *
	 * @param {Polygon} convexHull - The actual convex polygon.
	 * @return { circle: circle, tringle: triangle }
	 */
	var convexPolygonIncircle = function( convexHull ) {
	    var n = convexHull.vertices.length;
	    var bestCircle = undefined;
	    var bestTriangle = undefined;
	    for( var a = 0; a < n; a++ ) {
		for( var b = a+1; b < n; b++ ) {
		    for( var c = b+1; c < n; c++ ) {
			// As these lines are part of the convex hull, we know that
			//  * line a preceeds line b and
			//  * line b preceeds line c :)
			var lineA = new Line( convexHull.vertices[a], convexHull.vertices[(a+1)%n] );
			var lineB = new Line( convexHull.vertices[b], convexHull.vertices[(b+1)%n] );
			var lineC = new Line( convexHull.vertices[c], convexHull.vertices[(c+1)%n] );

			// Find intersections by expanding the lines
			var vertB = lineA.intersection(lineB);
			var vertC = lineB.intersection(lineC);

			// An object: { center: Vertex, radius: number }
			var triangle = getTangentTriangle4( lineA.a, vertB, vertC, lineC.b );
			// Workaround. There will be a future version where the 'getCircumCircle()' functions
			// returns a real Circle instance.
			var _circle = triangle.getCircumcircle();
			var circle = new Circle( _circle.center, _circle.radius );

			// Count the number of intersections with the convex hull:
			// If there are exactly three, we have found an in-lying circle.
			//  * Check if this one is better (bigger) than the old one.
			//  * Also check if the circle is located inside the polygon;
			//    The construction can, in some cases, produce an out-lying circle.
			if( !convexHull.containsVert(circle.center) )
			    continue;
			var circleIntersections = findCircleIntersections( convexHull, circle );
			if( circleIntersections.length == 3 && (bestCircle == undefined || bestCircle.radius < circle.radius) ) {
			    bestCircle = circle;
			    bestTriangle = triangle;
			}
		    }
		}
	    }
	    return { circle : bestCircle, triangle : bestTriangle };
	};

	
	/**
	 * This function computes the three points for the inner maximum circle 
	 * lying tangential to the three subsequential lines (given by four points).
	 *
	 * Compute the circle from that triangle by using Triangle.getCircumcircle().
	 *
	 * Not all three lines should be parallel, otherwise the circle might have infinite radius.
	 *
	 * LineA = [vertA, vertB]
	 * LineB = [vertB, vertC]
	 * LineC = [vertC, vertD]
	 *
	 * @param {Vertex} vertA - The first point of the three connected lines.
	 * @param {Vertex} vertB - The second point of the three connected lines.
	 * @param {Vertex} vertC - The third point of the three connected lines.
	 * @param {Vertex} vertD - The fourth point of the three connected lines.
	 * @return {Triangle}
	 */
	var getTangentTriangle4 = function( vertA, vertB, vertC, vertD ) {
	    var lineA = new Line(vertA,vertB);
	    var lineB = new Line(vertB,vertC);
	    var lineC = new Line(vertC,vertD);

	    var bisector1 = nsectAngle( vertB, vertA, vertC, 2 )[0]; // bisector of first triangle
	    var bisector2 = nsectAngle( vertC, vertB, vertD, 2 )[0]; // bisector of second triangle
	    var intersection = bisector1.intersection( bisector2 );

	    // Find the closest points on one of the polygon lines (all have same distance by construction)
	    var circleIntersA = lineA.getClosestPoint( intersection );
	    var circleIntersB = lineB.getClosestPoint( intersection );
	    var circleIntersC = lineC.getClosestPoint( intersection );

	    var triangle = new Triangle(circleIntersA, circleIntersB, circleIntersC);

	    // Unfortunately the returned Circle is just a wrapper, not a real class instance.
	    // The Triangle class does not yet know the Circle class.
	    return triangle; 
	};

	
	var findCircleIntersections = function( convexHull, circle ) {
	    var result = [];
	    for( var i = 0; i < convexHull.vertices.length; i++ ) {
		var line = new Line( convexHull.vertices[i], convexHull.vertices[(i+1)%convexHull.vertices.length] );
		// Use an epsilon here because circle coordinates can be kind of unprecise in the detail.
		if( circle.lineDistance(line) < 0.1 ) {
		    result.push( i );
		}
	    }
	    return result;
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


