/**
 * A simple 2d point set and image triangulation (color fill).
 *
 * @requires Vertex, Triangle, Polygon, VoronoiCell, delaunay, delaunay2voronoi, saveAs
 *
 * @author   Ikaros Kappler
 * @date     2017-07-31
 * @modified 2018-04-03 Added the voronoi-from-delaunay computation.
 * @modified 2018-04-11 Added the option to draw circumcircles.
 * @modified 2018-04-14 Added quadratic bezier Voronoi cells.
 * @modified 2018-04-16 Added cubic bezier Voronoi cells.
 * @modified 2018-04-22 Added SVG export for cubic and quadratic voronoi cells.
 * @modified 2018-04-28 Added a better mouse handler.
 * @modified 2018-04-29 Added web colors.
 * @modified 2018-05-04 Drawing voronoi cells by their paths now, not the triangles' circumcenters.
 * @modified 2019-04-24 Refactored the whole code and added an animator.
 * @modified 2019-10-25 Using draw.polygon(...) to draw Voronoi cells now. Added configurable colors.
 * @version  2.0.1
 **/



(function() {
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
		      drawGrid              : false,
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
		      backgroundColor       : '#000000',
		      drawHandleLines       : false,
		      drawHandlePoints      : false,
		      enableMouse           : true,
		      enableKeys            : true,
		      enableTouch           : true,
		      enableMouseWheel      : true
		      enableExport          : true
		    }, GUP
		)
	    );

	    pb.config.postDraw = function() {
		// In this demo the PlotBoilerplate only draws the vertices.
		// Everything else is drawn by this script, with the help of some PB functions.
		redraw();
	    };

	    /**
	     * This is a function hooked into the plot boilerplate's savefile-handler.
	     **/
	    pb.hooks.saveFile = function() {
		var v2svg = new drawablesToSVG( { canvasSize : pb.canvasSize, offset : pb.draw.offset, zoom : pb.draw.scale } );
		if( config.drawTriangles ) {
		    // let color = config.makeVoronoiDiagram ? 'rgba(0,128,224,0.33)' : '#0088d8';
		    for( var i in triangles ) {
			var t = triangles[i];
			v2svg.addDrawable( t );
		    }
		}

		if( config.drawCircumCircles )
		    ; // Draw circumcircles in the SVG? 
		
		if( config.makeVoronoiDiagram ) {
		    for( var v in voronoiDiagram ) {
			var cell = voronoiDiagram[v];
			var polygon = new Polygon(cell.toPathArray(),cell.isOpen());
			polygon.scale( config.voronoiCellScale, cell.sharedVertex );
			// let pcolor = config.voronoiOutlineColor;
			v2svg.addDrawable( polygon );

			if( config.drawCubicCurves && !cell.isOpen() && cell.triangles.length >= 3 ) {
			    var cbezier = polygon.toCubicBezierData( config.voronoiCubicThreshold );
			    // let vcolor = config.voronoiCellColor;
				pb.draw.cubicBezierPath( cbezier, config.voronoiCellColor );
			    // Add cubic bezier path
			    v2svg.addDrawable( polygon.toCubicBezierPath() );
    
			}
		    }
		}

		if( pb.drawConfig.drawVertices ) {
		    for( var i in pb.vertices ) {
			v2svg.addDrawable( pb.vertices[i] );
		    }
		}

		var svgCode = v2svg.build();
		var blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" } );
		saveAs(blob, "voronoi-delaunay.svg");
	    };
	    

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
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
				   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
				 );
	    };

	    
	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		makeVoronoiDiagram    : true,
		drawPoints            : true,
		drawTriangles         : true,
		drawCircumCircles     : false,
		drawCubicCurves       : false,
		fillVoronoiCells      : true,
		voronoiOutlineColor   : 'rgba(0,168,40, 1.0)',
		voronoiCellColor      : 'rgba(0,128,192, 0.5)',
		voronoiCubicThreshold : 1.0,
		voronoiCellScale      : 0.8,
		pointCount            : 25,
		rebuild               : function() { rebuild(); },
		randomize             : function() { randomPoints(true,false,false); trianglesPointCount = -1; rebuild(); },
		fullCover             : function() { randomPoints(true,true,false); trianglesPointCount = -1; rebuild(); },
		animate               : false,
		animationType         : 'linear' // 'linear' or 'circular'
	    }, GUP );


	    var triangles           = [];
	    var trianglesPointCount = -1;   // Keep track of the number of points when the triangles were generated.
	    var voronoiDiagram      = [];   // An array of VoronoiCells.

	    
	    // A list of points.
	    var pointList            = [];

	    // +---------------------------------------------------------------------------------
	    // | Adds a random point to the point list. Needed for initialization.
	    // +-------------------------------
	    var addRandomPoint = function() {
		addVertex( randomVertex() );
		
	    };

	    var addVertex = function( vert ) {
		pointList.push( vert );
		pb.add( vert );
		vert.listeners.addDragListener( function() { rebuild(); } );
	    };
	    

	    // +---------------------------------------------------------------------------------
	    // | Removes a random point from the point list.
	    // +-------------------------------
	    var removeRandomPoint = function() {
		if( pointList.length > 1 ) 
		    pb.remove( pointList.pop() );
	    };

	    // +---------------------------------------------------------------------------------
	    // | Generates a random int value between 0 and max (both inclusive).
	    // +-------------------------------
	    var randomInt = function(max) {
		return Math.round( Math.random()*max );
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | Draw the given triangle with the specified (CSS-) color.
	    // +-------------------------------
	    var drawTriangle = function( t, color ) {
		pb.draw.line( t.a, t.b, color );
		pb.draw.line( t.b, t.c, color );
		pb.draw.line( t.c, t.a, color );
	    };
	    
	    
	    /**
	     * The re-drawing function.
	     */
	    var redraw = function() {
		// Draw triangles
		if( config.drawTriangles )
		    drawTriangles();

		// Draw circumcircles
		if( config.drawCircumCircles )
		    drawCircumCircles();
		
		// Draw voronoi diagram?
		if( config.makeVoronoiDiagram )
		    drawVoronoiDiagram();

	    };

	    
	    /**
	     * A function for drawing the triangles.
	     */
	    var drawTriangles = function() {
		for( var i in triangles ) {
		    var t = triangles[i];
		    drawTriangle( t, config.makeVoronoiDiagram ? 'rgba(0,128,224,0.33)' : '#0088d8' );
		}
	    };
	    
	    /**
	     * Draw the stored voronoi diagram.
	     */
	    var drawVoronoiDiagram = function() {
		for( var v in voronoiDiagram ) {
		    var cell = voronoiDiagram[v];
		    var polygon = new Polygon(cell.toPathArray(),cell.isOpen());
		    polygon.scale( config.voronoiCellScale, cell.sharedVertex );
		    pb.draw.polygon( polygon, config.voronoiOutlineColor ); 

		    if( config.drawCubicCurves && !cell.isOpen() && cell.triangles.length >= 3 ) {
			var cbezier = polygon.toCubicBezierData( config.voronoiCubicThreshold );
			if( config.fillVoronoiCells )
			    pb.fill.cubicBezierPath( cbezier, config.voronoiCellColor );
			else
			    pb.draw.cubicBezierPath( cbezier, config.voronoiCellColor );
		    }
		}
	    };

	    
	    /**
	     * Draw the circumcircles of all triangles.
	     */
	    var drawCircumCircles = function() {
		for( var t in triangles ) {
		    var cc = triangles[t].getCircumcircle();
		    pb.draw.circle( cc.center, cc.radius, '#e86800' );
		}
	    };

	    /**
	     * Draw the voronoi cells as quadratic bezier curves.
	     */
	    /* var drawCubicBezierVoronoi = function() {
		for( var c in voronoiDiagram ) {
		    var cell = voronoiDiagram[c];
		    if( cell.isOpen() || cell.triangles.length < 3 )
			continue;
		    
		    var cbezier = new Polygon(cell.toPathArray(),cell.isOpen()).toCubicBezierData( config.voronoiCellThreshold );
		    if( config.fillVoronoiCells )
			pb.fill.cubicBezierPath( cbezier, config.voronoiCellColor );
		    else
			pb.draw.cubicBezierPath( cbezier, config.voronoiCellColor );
		}
		
	    }; // END drawCubicBezierVoronoi
	    */
	    
	    
	    /**
	     * The rebuild function just evaluates the input and
	     *  - triangulate the point set?
	     *  - build the voronoi diagram?
	     */
	    var rebuild = function() {
		// Only re-triangulate if the point list changed.
		var draw = true;
		triangulate();
		if( config.makeVoronoiDiagram || config.drawCubicCurves )
		    draw = makeVoronoiDiagram();

		if( draw )
		    pb.redraw();
	    };

	    
	    /**
	     * Make the triangulation (Delaunay).
	     */
	    var triangulate = function() {
		var delau = new Delaunay( pointList, {} );
		triangles  = delau.triangulate();
		trianglesPointCount = pointList.length;
		voronoiDiagram = [];
		redraw();
	    };


	    /**
	     * Convert the triangle set to the Voronoi diagram.
	     */
	    var makeVoronoiDiagram = function() {
		var voronoiBuilder = new delaunay2voronoi(pointList,triangles);
		voronoiDiagram = voronoiBuilder.build();
		redraw();
		// Handle errors if vertices are too close and/or co-linear:
		if( voronoiBuilder.failedTriangleSets.length != 0 ) {
		    console.log( 'The error report contains '+voronoiBuilder.failedTriangleSets.length+' unconnected set(s) of triangles:' );
		    // Draw illegal triangle sets?
		    for( var s = 0; s < voronoiBuilder.failedTriangleSets.length; s++ ) {
			console.log( 'Set '+s+': ' + JSON.stringify(voronoiBuilder.failedTriangleSets[s]) );
			var n = voronoiBuilder.failedTriangleSets[s].length;
			for( var i = 0; i < n; i++ ) {
			    console.log('highlight triangle ' + i );
			    var tri = voronoiBuilder.failedTriangleSets[s][i];
			    drawTriangle( tri, 'rgb(255,'+Math.floor(255*(i/n))+',0)' );
			    draw.circle( tri.center, tri.radius, 'rgb(255,'+Math.floor(255*(i/n))+',0)' );
			}
		    }
		    return false;
		} else {
		    return true;
		}
	    };

	    /**
	     * Add or remove n random points; depends on the config settings.
	     *
	     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
	     */
	    var randomPoints = function( clear, fullCover, doRebuild ) {
		if( clear ) {
		    for( var i in pointList )
			pb.remove( pointList[i], false );
		    pointList = [];
		}
		// Generate random points on image border?
		if( fullCover ) {
		    var remainingPoints = config.pointCount-pointList.length;
		    var borderPoints    = Math.sqrt(remainingPoints);
		    var ratio           = pb.canvasSize.height/pb.canvasSize.width;
		    var hCount          = Math.round( (borderPoints/2)*ratio );
		    var vCount          = (borderPoints/2)-hCount;
		    
		    while( vCount > 0 ) {
			addVertex( new Vertex(-pb.canvasSize.width/2, randomInt(pb.canvasSize.height/2)-pb.canvasSize.height/2) );
			addVertex( new Vertex(pb.canvasSize.width/2, randomInt(pb.canvasSize.height/2)-pb.canvasSize.height/2) );		    
			vCount--;
		    }
		    
		    while( hCount > 0 ) {
			addVertex( new Vertex(randomInt(pb.canvasSize.width/2)-pb.canvasSize.width/2,0) );
			addVertex( new Vertex(randomInt(pb.canvasSize.width/2)-pb.canvasSize.width/2,pb.canvasSize.height/2) );
			hCount--;
		    }

		    // Additionally add 4 points to the corners
		    addVertex( new Vertex(0,0) );
		    addVertex( new Vertex(pb.canvasSize.width/2,0) );
		    addVertex( new Vertex(pb.canvasSize.width/2,pb.canvasSize.height/2) );
		    addVertex( new Vertex(0,pb.canvasSize.height/2) );	
		}
		
		// Generate random points.
		for( var i = pointList.length; i < config.pointCount; i++ ) {
		    addRandomPoint();
		}
		updateAnimator();
		if( doRebuild )
		    rebuild();
	    };

	    /**
	     * Called when the desired number of points changes.
	     **/
	    var updatePointCount = function() {
		if( config.pointCount > pointList.length )
		    randomPoints(false,false,true); // Do not clear ; no full cover ; do rebuild
		else if( config.pointCount < pointList.length ) {
		    // Remove n-m points
		    for( var i = config.pointCount; i < pointList.length; i++ )
			pb.remove( pointList[i] );
		    pointList = pointList.slice( 0, config.pointCount );
		    updateAnimator();
		    rebuild();
		}
		
	    };
	    

	    // Animate the vertices: make them bounce around and reflect on the walls.
	    var animator = null;
	    var toggleAnimation = function() {
		if( config.animate ) {
		    if( animator )
			animator.stop();
		    if( config.animationType=='radial' )
			animator = new CircularVertexAnimator( pointList, pb.viewport(), rebuild );
		    else // 'linear'
			animator = new LinearVertexAnimator( pointList, pb.viewport(), rebuild );
		    animator.start();
		} else {
		    animator.stop();
		    animator = null;
		}
	    };

	    /**
	     * Unfortunately the animator is not smart, so we have to create a new
	     * one (and stop the old one) each time the vertex count changes.
	     **/
	    var updateAnimator = function() {
		if( !animator )
		    return;
		animator.stop();
		animator = null;
		toggleAnimation(); 
	    };
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI(); 

		gui.add(config, 'rebuild').name('Rebuild all').title("Rebuild all.");

		var f0 = gui.addFolder('Points');
		f0.add(config, 'pointCount').min(3).max(200).onChange( function() { config.pointCount = Math.round(config.pointCount); updatePointCount(); } ).title("The total number of points.");
		f0.add(config, 'randomize').name('Randomize').title("Randomize the point set.");
		f0.add(config, 'fullCover').name('Full Cover').title("Randomize the point set with full canvas coverage.");
		f0.add(config, 'animate').onChange( toggleAnimation ).title("Toggle point animation on/off.");
		f0.add(config, 'animationType', { Linear: 'linear', Radial : 'radial' } ).onChange( function() { toggleAnimation(); } );
		f0.open();
		
		var f1 = gui.addFolder('Delaunay');
		f1.add(config, 'drawTriangles').onChange( function() { pb.redraw() } ).title("If checked the triangle edges will be drawn.");
		f1.add(config, 'drawCircumCircles').onChange( function() { pb.redraw() } ).title("If checked the triangles circumcircles will be drawn.");

		var f2 = gui.addFolder('Voronoi');
		f2.add(config, 'makeVoronoiDiagram').onChange( rebuild ).title("Make voronoi diagram from the triangle set.");
		f2.addColor(config, 'voronoiOutlineColor').onChange( function() { pb.redraw() } ).title("Choose Voronoi outline color.");
		f2.add(config, 'drawCubicCurves').onChange( rebuild ).title("If checked the Voronoi's cubic curves will be drawn.");
		f2.add(config, 'fillVoronoiCells').onChange( rebuild ).title("If checked the Voronoi cells will be filled.");
		f2.addColor(config, 'voronoiCellColor').onChange( function() { pb.redraw() } ).title("Choose Voronoi cell color.");
		f2.add(config, 'voronoiCubicThreshold').min(0.0).max(1.0).onChange( function() { pb.redraw() } ).title("(Experimental) Specifiy the cubic or cell coefficients.");
		f2.add(config, 'voronoiCellScale').min(-1.0).max(2.0).onChange( function() { pb.redraw() } ).title("Scale each voronoi cell before rendering.");

		if( config.animate ) toggleAnimation();
	    }


	    // Init
	    randomPoints(true,false,false); // clear ; no full cover ; do not redraw
	    rebuild();
	    pb.redraw();
	    
	} ); // END document.ready / window.onload
    
})();




