/**
 * A script for drawing parquet deformations.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui
 *
 * 
 * @author   Ikaros Kappler
 * @date     2019-06-03
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
		  backgroundColor       : '#f0f0f0',
		  enableMouse           : true,
		  enableKeys            : true,
		  enableTouch           : true,

		  enableSVGExport       : false
		}, GUP
	    )
	);

	var miniCanvas = new MiniCanvas( document.getElementById('mini-canvas'),
					 5,
					 function(v) {
					     //console.log('onVertexChange',v);
					     pb.redraw();
					 }
				       );

	var DEG_TO_RAD = Math.PI/180.0;
	
	var TYPE_HEXAGON  = "hexagon";
	var TYPE_TRIANGLE = "triangle";
	var TYPE_SQUARE   = "square";
	var type = TYPE_HEXAGON;

	var HexTile = function( center, radius ) {
	    this.vertices = makePolyNGon( center, radius, 6, 4, Math.PI/6.0 );
	    // For plane-filling circles/hexagon we need some offsets for even/odd rows.
	    this.offset = {
		// Row-filling circle-diameters
		x : radius*2,
		// Column-filling hexagonal offsets
		y : Math.sqrt( 3*radius*radius )
	    }
	};
	var QuadTile = function( center, radius ) {
	    this.vertices = makePolyNGon( center, radius, 4, 6, Math.PI/4.0 );
	    this.offset = {
		x : radius*2,
		y : radius*2
	    };
	};
	var TriTile = function( center, radius, down ) {
	    this.vertices = makePolyNGon( center, radius, 3, 8, Math.PI/2.0);
	    this.offset = {
		x : radius*2,
		y : radius*2
	    };
	};
	/**
	 * @param {Array} gradient - An array of n HexTile, QuadTile or TriTile settings.
	 * @param {number} ratio
	 * @param {Vertex} offset
	 **/
	var morphFromTo = function( gradient, ratio, offset, row, column ) {
	    var vertices = [];
	    var vert;
	    // Find index in array
	    var gradientIndex = Math.min( gradient.length-1,
					  Math.floor( ratio * gradient.length )
					);
	    var fromTile = gradient[gradientIndex];
	    var toTile =
		gradientIndex+1 >= gradient.length
		? gradient[gradientIndex]
		: gradient[gradientIndex+1];
	    var relativeRatio = (ratio - gradientIndex/gradient.length) * gradient.length;
	    for( var i = 0; i < fromTile.vertices.length; i++ ) {
		vert = fromTile.vertices[i]
		    .clone()
		    .add( fromTile.vertices[i]
			  .difference(toTile.vertices[i])
			  .multiplyScalar(relativeRatio)
			)
		    .add( offset );
		vertices.push( vert );
	    }
	    return vertices;
	};
	
	var cellRadiusPct = 0.025;
	var drawAll = function() {

	    // var tileFactory = makeHexaTileFactory( baseRadius );
	    
	    // Bounds: { ..., width, height }
	    var viewport = pb.viewport();
	    var baseCellRadius = viewport.width * (config.cellRadiusPct/100.0);
	    // This would be the outscribing circle radius for the plane-fitting hexagon.
	    var outerHexagonRadius = Math.sqrt( 4.0 * baseCellRadius * baseCellRadius / 3.0 );

	    var tileGradient = [
		new HexTile( new Vertex(0,0), baseCellRadius ),
		new QuadTile( new Vertex(0,0), baseCellRadius ),
		new TriTile( new Vertex(0,0), baseCellRadius )
	    ];
	    
	    // Get the start- and end-positions to use for the plane.
	    var startXY = pb.transformMousePosition( baseCellRadius, baseCellRadius );
	    var endXY = pb.transformMousePosition( viewport.width-baseCellRadius, viewport.height-baseCellRadius );

	    var viewWidth = endXY.x - startXY.x;
	    var viewHeight = endXY.y - startXY.y;
	    
	    var offset = tileGradient[0].offset;

	    var yOdd = false;
	    var yRow = 0;
	    for( var y = startXY.y; y < endXY.y; y+=offset.y ) {
		var yPct = 0.5-y/viewHeight;
		var xColumn = 0;
		for( var x = startXY.x+(yOdd ? 0 : offset.x/2.0); x < endXY.x; x+=offset.x ) {
		    var xPct = 0.5-x/viewWidth;
		    var center = new Vertex(x,y);
		    // console.log( center );
		 
		    // Make a hexagon that outscribes the circle?
		    // var outerNGonPoints = makeNGon( circle.center, outerHexagonRadius, 6, Math.PI/6.0 );
		    // var polyverts = morphFromTo( tileGradient, config.globalRatio/100.0, center );
		    var polyverts = morphFromTo( tileGradient, xPct*yPct, center, yRow, xColumn );
		    // pb.draw.polyline( polyverts, false, 'rgba(232,128,0,1.0)', 2 );
		    pb.draw.polyline( mapPolyLine( polyverts, miniCanvas.getPolyLine() ), false, 'rgba(232,128,0,1.0)', 2 );

		}
		yOdd = !yOdd;
	    }
	};
	

	var mapPolyLine = function( polyverts, lineShape ) {
	    var result = [];
	    var n = polyverts.length;
	    for( var v = 0; v < n; v++ ) {
		var start = polyverts[v];
		var end   = polyverts[(v+1)%n];
		result.push( start );
		// Map mid points from shape into segment between [start,end] line
		
	    }
	    return result; //polyverts;
	};
	
	
	/**
	 * Make an array with vertexCount*pointsPerVertex points, arranged in a polygon
	 * of 'vertexCount' vertices.
	 *
	 **/
	var makePolyNGon = function( center, radius, vertexCount, pointsPerVertex, startAngle ) {
	    var points = [];
	    var vert;
	    var angleStep = Math.PI*2 / vertexCount;
	    for( var i = 0; i < vertexCount; i++ ) {
		vert = center.clone().addX( radius );
		vert.rotate( startAngle + i*angleStep, center );
		for( var p = 0; p < pointsPerVertex; p++ ) {
		    points.push( vert.clone() );
		}
	    }
	    return points;
	};


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
	    } );  


	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    /* pointCount            : 6,
	    startAngle            : 45.0, // Math.PI/2.0,
	    xOffset               : 1.0,
	    yOffset               : 1.0,
	    xAngle                : 0.0,
	    yAngle                : 0.0,
	    starPointCount        : 6,    // will be doubled
	    fillShape             : true */
	    cellRadiusPct         : 2.5,  // %
	    globalRatio           : 0.0
	}, GUP );

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'globalRatio').min(0).max(100).step(0.1).onChange( function() { pb.redraw(); } ).name("ratio").title("The global ratio.");
	    gui.add(config, 'cellRadiusPct').min(0.5).max(10).step(0.1).onChange( function() { pb.redraw(); } ).name("Cell size %").title("The cell radis");
	    /*gui.add(config, 'startAngle').min(0).max(360).step(1.0).onChange( function() { pb.redraw(); } ).name("Start angle").title("The circle patterns' start angle.");
	    
	    gui.add(config, 'xOffset').min(-2.0).max(2.0).step(0.01).onChange( function() { pb.redraw(); } ).name("X offset").title("The x-axis offset.");
	    gui.add(config, 'yOffset').min(-2.0).max(2.0).step(0.01).onChange( function() { pb.redraw(); } ).name("Y offset").title("The y-axis offset.");
	    gui.add(config, 'xAngle').min(0.0).max(360).step(1.0).onChange( function() { pb.redraw(); } ).name("X angle").title("The x-angle.");
	    gui.add(config, 'yAngle').min(0.0).max(360).step(1.0).onChange( function() { pb.redraw(); } ).name("Y angle").title("The y-axis angle.");
	    gui.add(config, 'starPointCount').min(3).max(24).step(1).onChange( function() { pb.redraw(); } ).name("Point count").title("The star's point count.");
	    gui.add(config, 'fillShape').onChange( function() { pb.redraw(); } ).name("Fill shape").title("Fill the shape or draw the outline only?");*/
	}

	pb.config.postDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


