/**
 * A script for testing the lib with three.js.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires three.js
 * 
 * @author   Ikaros Kappler
 * @date     2021-01-10
 * @version  1.0.0
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


	    // +---------------------------------------------------------------------------------
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
				   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
				 );
	    };
	    

	    var bezierDistanceT = 0.0;
	    var bezierDistanceLine = null;
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		outlineSegmentCount   : 128,
		shapeSegmentCount     : 64,
		showNormals           : false,
		normalsLength         : 10.0,
		useTextureImage       : true,
		textureImagePath      : 'wood.png',
		wireframe             : false,
		exportSTL             : function() { exportSTL(); },
		showPathJSON          : function() { showPathJSON(); },
		insertPathJSON        : function() { insertPathJSON(); },

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
		drawVoronoiIncircles  : false,
		drawVoronoiOutlines   : true,
		pointCount            : 32,
		rebuild               : function() { rebuildVoronoi(); },
		randomize             : function() { randomPoints(true,false,false); trianglesPointCount = -1; rebuildVoronoi(); },
		fullCover             : function() { randomPoints(true,true,false); trianglesPointCount = -1; rebuildVoronoi(); },
		animate               : false,
		animationType         : 'linear' // 'linear' or 'radial'
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
		vert.listeners.addDragListener( function() { rebuildVoronoi(); } );
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


	    /**
	     * The re-drawing function.
	     */
	    var redraw = function() {
		// Draw triangles
		// if( config.drawTriangles )
		//    drawTriangles();

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
		    var polygon = cell.toPolygon();
		    polygon.scale( config.voronoiCellScale, cell.sharedVertex );
		    if( config.drawVoronoiOutlines )
			pb.draw.polygon( polygon, config.voronoiOutlineColor ); 

		    if( !cell.isOpen() && cell.triangles.length >= 3 ) {
			if( config.drawCubicCurves ) {
			    var cbezier = polygon.toCubicBezierData( config.voronoiCubicThreshold );
			    if( config.fillVoronoiCells ) 
				pb.fill.cubicBezierPath( cbezier, config.voronoiCellColor );
			    else 
				pb.draw.cubicBezierPath( cbezier, config.voronoiCellColor );
			}
			if( config.drawVoronoiIncircles  ) {
			    var result = convexPolygonIncircle( polygon ); 
			    var circle = result.circle;
			    var triangle = result.triangle;
			    // Here we should have found the best inlying circle (and the corresponding triangle)
			    // inside the Voronoi cell.
			    pb.draw.circle( circle.center, circle.radius, 'rgba(255,192,0,1.0)', 2 );
			}
		    } // END cell is not open
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
	     * The rebuild function just evaluates the input and
	     *  - triangulate the point set?
	     *  - build the voronoi diagram?
	     */
	    var rebuildVoronoi = function() {
		// Only re-triangulate if the point list changed.
		var draw = true;
		triangulate();
		if( config.makeVoronoiDiagram || config.drawCubicCurves )
		    draw = makeVoronoiDiagram();

		if( draw )
		    pb.redraw();

		rebuildVoronoiMesh();
	    };

	    
	    /**
	     * Make the triangulation (Delaunay).
	     */
	    var triangulate = function() {
		var delau = new Delaunay( pointList, {} );
		triangles  = delau.triangulate();
		trianglesPointCount = pointList.length;
		voronoiDiagram = [];
		// redraw();
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
		// updateAnimator();
		if( doRebuild )
		    rebuildVoronoi();
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
		    rebuildVoronoi();
		}
		
	    };
	    
	    
	    var voronoiGeneration = new VoronoiGeneration('three-canvas');
	    var modal = new Modal();

	    // +---------------------------------------------------------------------------------
	    // | Export the model as an STL file.
	    // +-------------------------------
	    var exportSTL = function() {
		function saveFile( data, filename ) {
		    saveAs( new Blob( [ data ], { type: 'application/sla' } ), filename );
		}
		modal.setTitle( "Export STL" );
		modal.setFooter( "" );
		modal.setActions( [ { label : 'Cancel', action : function() { modal.close(); console.log('canceled'); } } ] );
		modal.setBody( "Loading ..." ); 
		modal.open();
		try {
		    voronoiGeneration.generateSTL( {
			onComplete : function(stlData) {
			    window.setTimeout( function() {
				modal.setBody( "File ready." ); 
				modal.setActions( [ Modal.ACTION_CLOSE ] );
				saveFile(stlData,'voronoiomodel.stl');
			    }, 500 );
			}
		    } );
		} catch( e ) {
		    modal.setBody( "Error: " + e ); 
		    modal.setActions( [ Modal.ACTION_CLOSE ] );
		}
	    };


	    var showPathJSON = function() {
		/* modal.setTitle( "Show Path JSON" );
		modal.setFooter( "" );
		modal.setActions( [ Modal.ACTION_CLOSE ] );
		modal.setBody( outline.toJSON(true) ); 
		modal.open(); */
	    };


	    var insertPathJSON = function() {
		/* var textarea = document.createElement('textarea');
		textarea.style.width = "100%";
		textarea.style.height = "50vh";
		textarea.innerHTML = outline.toJSON(true);
		modal.setTitle( "Insert Path JSON" );
		modal.setFooter( "" );
		modal.setActions( [ Modal.ACTION_CANCEL, { label : "Load JSON", action : function() { loadPathJSON(textarea.value); modal.close(); } }] );
		modal.setBody( textarea ); 
		modal.open(); */
	    };

	    var loadPathJSON = function( jsonData ) {
		/* var newOutline = BezierPath.fromJSON( jsonData );
		setPathInstance( newOutline );
		rebuild(); */
	    };

	    
	    // +---------------------------------------------------------------------------------
	    // | Delay the build a bit. And cancel stale builds.
	    // | This avoids too many rebuilds (pretty expensive) on mouse drag events.
	    // +-------------------------------
	    var buildId = null;
	    var rebuildVoronoiMesh = function() {
		// rebuildVoronoi();
		var buildId = new Date().getTime();
		// window.setTimeout( (function(bId) {
		//    return function() {
		//	if( bId == buildId ) {
			    // voronoiGeneration.rebuild( Object.assign( { outline : outline }, config ) );
			    voronoiGeneration.rebuild( Object.assign( { voronoiDiagram : voronoiDiagram }, config ) );
		//	}
		//    };
		//})(buildId), 50 );
	    };
	    
	    // new DoubleclickHandler( pb, handleDoubleclick );

	    
	    // +---------------------------------------------------------------------------------
	    // | Each outline vertex requires a drag (end) listener. Wee need this to update
	    // | the 3d mesh on changes.
	    // +-------------------------------
	    /* var dragListener = function( dragEvent ) {
		// Uhm, well, some curve point moved.
		rebuild();
	    };
	    var addPathListeners = function( path ) {
		BezierPathInteractionHelper.addPathVertexDragEndListeners( path, dragListener );
	    };
	    var removePathListeners = function( path ) {
		BezierPathInteractionHelper.removePathVertexDragEndListeners( path, dragListener );
	    }; */
	    
	    // +---------------------------------------------------------------------------------
	    // | Draw some stuff before rendering?
	    // +-------------------------------
	    /* var preDraw = function() { 
		// Draw bounds
		var pathBounds = outline.getBounds();
		pb.draw.rect( pathBounds.min, pathBounds.width, pathBounds.height, 'rgba(0,0,0,0.5)', 1 );

		// Fill inner area
		var polyline = [ new Vertex( pathBounds.max.x, pathBounds.min.y ),
				 new Vertex( pathBounds.max.x, pathBounds.max.y ),
				 new Vertex( pathBounds.min.x, pathBounds.max.y ) ];
		var pathSteps = 50;
		for( var i = 0; i < pathSteps; i++ ) {
		    polyline.push( outline.getPointAt(i/pathSteps) );
		}
		pb.fill.polyline( polyline, false, 'rgba(0,0,0,0.25)' );		
	    }; */

	    // +---------------------------------------------------------------------------------
	    // | Draw the split-indicator (if split position ready).
	    // +-------------------------------
	    /* var postDraw = function() {
		if( bezierDistanceLine != null ) {
		    pb.draw.line( bezierDistanceLine.a, bezierDistanceLine.b, 'rgb(255,192,0)', 2 );
		    pb.fill.circleHandle( bezierDistanceLine.a, 3.0, 'rgb(255,192,0)' );
		}
	    }; */
	    


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
	    // | Create the outline: a Bézier path.
	    // +-------------------------------
	    var outline = null;
	    // This will trigger the first initial postDraw/draw/redraw call
	    // setPathInstance( BezierPath.fromJSON( DEFAULT_BEZIER_JSON ) );

	    

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
		var fold0 = gui.addFolder("Mesh");
		fold0.add(config, "outlineSegmentCount").min(3).max(512).onChange( function() { rebuild() } ).name('outlineSegmentCount').title('The number of segments on the outline.');
		fold0.add(config, "shapeSegmentCount").min(3).max(256).onChange( function() { rebuild() } ).name('shapeSegmentCount').title('The number of segments on the shape.');
		fold0.add(config, "showNormals").onChange( function() { rebuild() } ).name('showNormals').title('Show the vertex normals.');
		fold0.add(config, "normalsLength").min(1.0).max(20.0).onChange( function() { rebuild() } ).name('normalsLength').title('The length of rendered normals.');
		fold0.add(config, "useTextureImage").onChange( function() { rebuild() } ).name('useTextureImage').title('Use a texture image.');
		fold0.add(config, "wireframe").onChange( function() { rebuild() } ).name('wireframe').title('Display the mesh as a wireframe model.');

		var fold1 = gui.addFolder("Export");
		fold1.add(config, "exportSTL").name('STL').title('Export an STL file.');
		fold1.add(config, "showPathJSON").name('Show Path JSON ...').title('Show the path data.');

		var fold2 = gui.addFolder("Import");
		fold2.add(config, "insertPathJSON").name('Insert Path JSON ...').title('Insert path data as JSON.');

		fold0.open();


		var f3 = gui.addFolder('Points');
		f3.add(config, 'pointCount').min(3).max(200).onChange( function() { config.pointCount = Math.round(config.pointCount); updatePointCount(); } ).title("The total number of points.");
		f3.add(config, 'randomize').name('Randomize').title("Randomize the point set.");
		f3.add(config, 'fullCover').name('Full Cover').title("Randomize the point set with full canvas coverage.");
		// f3.add(config, 'animate').onChange( toggleAnimation ).title("Toggle point animation on/off.");
		// f3.add(config, 'animationType', { Linear: 'linear', Radial : 'radial' } ).onChange( function() { toggleAnimation(); } );
		// f3.open();
		
		var f4 = gui.addFolder('Delaunay');
		f4.add(config, 'drawTriangles').onChange( function() { pb.redraw() } ).title("If checked the triangle edges will be drawn.");
		f4.add(config, 'drawCircumCircles').onChange( function() { pb.redraw() } ).title("If checked the triangles circumcircles will be drawn.");

		var f5 = gui.addFolder('Voronoi');
		f5.add(config, 'makeVoronoiDiagram').onChange( rebuildVoronoi ).title("Make voronoi diagram from the triangle set.");
		f5.addColor(config, 'voronoiOutlineColor').onChange( function() { pb.redraw() } ).title("Choose Voronoi outline color.");
		f5.add(config, 'drawCubicCurves').onChange( rebuildVoronoi ).title("If checked the Voronoi's cubic curves will be drawn.");
		f5.add(config, 'drawVoronoiOutlines').onChange( rebuildVoronoi ).title("If checked the Voronoi cells' outlines will be drawn.");
		f5.add(config, 'drawVoronoiIncircles').onChange( rebuildVoronoi ).title("If checked the Voronoi cells' incircles will be drawn.");
		f5.add(config, 'fillVoronoiCells').onChange( rebuildVoronoi ).title("If checked the Voronoi cells will be filled.");
		f5.addColor(config, 'voronoiCellColor').onChange( function() { pb.redraw() } ).title("Choose Voronoi cell color.");
		f5.add(config, 'voronoiCubicThreshold').min(0.0).max(1.0).onChange( function() { pb.redraw() } ).title("(Experimental) Specifiy the cubic or cell coefficients.");
		f5.add(config, 'voronoiCellScale').min(-1.0).max(2.0).onChange( function() { pb.redraw(); rebuildVoronoi() } ).title("Scale each voronoi cell before rendering.");
	    }

	    // pb.config.preDraw = preDraw;
	    pb.config.postDraw = redraw;
	    // pb.fitToView( scaleBounds(outline.getBounds(),1.6) );
	    randomPoints(true,false,false); // clear ; no full cover ; do not redraw
	    rebuildVoronoi();
	    
	} );
    
})(window); 


