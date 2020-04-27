/**
 * A script for testing Relative Neighbourhood Graphs.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
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

	// Add an attribute to the attribute model. We will need these later
	// in the delaunay2urquhart conversion.
	VertexAttr.model.pointListIndex = -1;
	
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

	
	var triangles;
	var urquhartEdges;
	var drawAll = function() {
	    triangulate();
	    // console.log( triangles );

	    delaunay2urquhart();

	    if( config.drawDelaunay ) {
		for( var t in triangles ) {
		    var tri = triangles[t];
		    pb.draw.polyline( [tri.a,tri.b,tri.c], false, 'rgba(0,0,0,0.05)', 1.0 );
		}
	    }

	    // console.log('urquhartEdges', urquhartEdges );
	    for( var e in urquhartEdges ) {
		var edge = urquhartEdges[e];
		pb.draw.line( edge.a, edge.b, 'rgba(0,128,255,1.0)', 2 );
	    }
	}

	var trySetMatrix = function( matrix, i, j, value ) {
	    if( typeof matrix[i] == 'undefined' )
		matrix[i] = {};
	    if( typeof matrix[j] == 'undefined' )
		matrix[j] = {};
	    if( typeof matrix[i][j] == 'undefined' || value == false ) {
		matrix[i][j] = value;
		matrix[j][i] = value;
	    }
	};

	var delaunay2urquhart = function( delaunayTriangles ) {
	    // Step 0: clean up old stuff
	    urquhartEdges = [];
	    
	    // Step 1/3: initialize the matrix.
	
	    // Set matrix[i][j]=false (symmetric) if there was an edge (i,j) in the delaunay
	    // triangulation and it was deleted by the urquhart algorithm.
	    // Otherwise set true. Non-edge pairs are kept undefined.
	    var matrix = {};
	    var n = pointList.pointList.length;
	    for( var i = 0; i < n; i++ ) {
		matrix[i] = {};
	    }

	    // Step 2/3: fill the matrix with egdes to be deleted (false) and edges to be kept (true).
	    for( var t in triangles ) {
		var tri = triangles[t];
		// Set the two non-longest edges (if not deleted before)
		var a = tri.a;
		var b = tri.b;
		var c = tri.c;

		var ab = a.distance(b);
		var bc = b.distance(c);
		var ca = c.distance(a);
		if( ab > bc && ab > ca ) {
		    // ab is longest
		    trySetMatrix( matrix, a.attr.pointListIndex, b.attr.pointListIndex, false );
		    trySetMatrix( matrix, b.attr.pointListIndex, c.attr.pointListIndex, true );
		    trySetMatrix( matrix, c.attr.pointListIndex, a.attr.pointListIndex, true );
		} else if( bc > ab && bc > ca ) {
		    // bc is longest
		    trySetMatrix( matrix, a.attr.pointListIndex, b.attr.pointListIndex, true );
		    trySetMatrix( matrix, b.attr.pointListIndex, c.attr.pointListIndex, false );
		    trySetMatrix( matrix, c.attr.pointListIndex, a.attr.pointListIndex, true );
		} else {
		    // ca is longest
		    trySetMatrix( matrix, a.attr.pointListIndex, b.attr.pointListIndex, true );
		    trySetMatrix( matrix, b.attr.pointListIndex, c.attr.pointListIndex, true );
		    trySetMatrix( matrix, c.attr.pointListIndex, a.attr.pointListIndex, false );
		}
	    }
	    // console.log( matrix );

	    // Step 3/3: build a list of edges
	    for( var a = 0; a < n; a++ ) {
		for( var b = 0; b < a; b++ ) {
		    if( matrix[a][b] === true )
			urquhartEdges.push( { a : pointList.pointList[a], b : pointList.pointList[b] } );
		}
	    }
	    
	};


	/**
	 * Make the triangulation (Delaunay).
	 */
	var triangulate = function() {
	    var delau = new Delaunay( pointList.pointList, {} );
	    triangles  = delau.triangulate();
	};


	/**
	 * Convert the triangle set to the Voronoi diagram.
	 */
	var makeVoronoiDiagram = function() {
	    var voronoiBuilder = new delaunay2voronoi(pointList.pointList,triangles);
	    voronoiDiagram = voronoiBuilder.build();
	    // The voronoi builde might have some 'failedTriangleSets' defined; this implies
	    // that some vertices are located really close (or be event the same).
	    // Let's ignore those here. Look at the 07-voronoi demo for details.
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
	    pointCount            : 64,
	    drawDelaunay          : false,
	    animate               : false,
	}, GUP );
	

	var updatePointList = function() {
	    pointList.updatePointCount(config.pointCount,false); // No full cover
	    animator = new LinearVertexAnimator( pointList.pointList, pb.viewport(), function() { pb.redraw(); } );
	};


	var addVertex = function(vert) {
	    pointList.addVertex(vert);
	    config.pointCount++;
	    if( animator ) animator.stop();
	    animator = new LinearVertexAnimator( pointList.pointList, pb.viewport(), function() { pb.redraw(); } );
	    toggleAnimation();
	    pb.redraw(); 
	    
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

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'pointCount').onChange( function() { updatePointList(); } ).name("Point count").title("Point count");
	    gui.add(config, 'drawDelaunay').onChange( function() { pb.redraw(); } ).name('Draw Delaunay triangulation').title('Draw the underlying Delaunay triangulation.');
	    gui.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate points').title('Animate points.');
	    // f1.open();
	}

	toggleAnimation();
	updatePointList();

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


