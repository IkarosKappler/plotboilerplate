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

	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    cellRadiusPct         : 2.5,  // %
	    shapeRadiusFactor     : 1.0,
	    segmentCount          : 4,

	    gradientType          : "TSH"
	}, GUP );

	var miniCanvas = new MiniCanvas( document.getElementById('mini-canvas'),
					 config.segmentCount+1,
					 function(v) { // Drag listener
					     pb.redraw();
					 }
				       );

	var DEG_TO_RAD = Math.PI/180.0;
	
	var TYPE_HEXAGON  = "hexagon";
	var TYPE_TRIANGLE = "triangle";
	var TYPE_SQUARE   = "square";
	var type = TYPE_HEXAGON;

	var HexTile = function( center, radius ) {
	    this.vertices = makePolyNGon( center, radius*config.shapeRadiusFactor, 6, 4, Math.PI/6.0 );
	    // For plane-filling circles/hexagon we need some offsets for even/odd rows.
	    this.offset = {
		// Row-filling circle-diameters
		x : radius*2,
		// Column-filling hexagonal offsets
		y : Math.sqrt( 3*radius*radius )
	    }
	};
	var QuadTile = function( center, radius ) {
	    this.vertices = makePolyNGon( center, radius*config.shapeRadiusFactor, 4, 6, Math.PI/4.0 );
	    this.offset = {
		x : radius*2,
		y : radius*2
	    };
	};
	var TriTile = function( center, radius, down ) {
	    this.vertices = makePolyNGon( center, radius*config.shapeRadiusFactor, 3, 8, Math.PI/2.0);
	    this.offset = {
		x : radius*2,
		y : radius*2
	    };
	};

	var getSelectedGradient = function(baseCellRadius) {
	    var type = config.gradientType.split("");
	    console.log( type );
	    var result = [];
	    for( var i = 0; i < type.length; i++ ) {
		console.log( type[i] );
		switch( type[i] ) {
		case "H" : result.push( new HexTile( new Vertex(0,0), baseCellRadius ) ); break;
		case "S" : result.push( new QuadTile( new Vertex(0,0), baseCellRadius ) ); break;
		case "T" : result.push( new TriTile( new Vertex(0,0), baseCellRadius ) ); break;
		}
	    }
	    console.log( result );
	    return result;
	};
	
	/**
	 * @param {Array} gradient - An array of n HexTile, QuadTile or TriTile settings.
	 * @param {number} ratio
	 * @param {Vertex} offset
	 **/
	var morphFromTo = function( gradient, ratio, offset, row, column ) {
	    var vertices = [];
	    var vert;
	    // Find index in shape gradient array
	    var gradientIndex = Math.min( gradient.length-1,
					  Math.floor( (1-ratio) * gradient.length )
					);
	    var fromTile = gradient[gradientIndex];
	    var toTile = 
		gradientIndex+1 >= gradient.length
		? gradient[gradientIndex]
		: gradient[gradientIndex+1];
	    var relativeRatio = ( (1-ratio) - gradientIndex/gradient.length) * gradient.length;
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
	
	var drawAll = function() {
	    console.log('gradientType', config.gradientType );

	    // Bounds: { ..., width, height }
	    var viewport = pb.viewport();
	    var baseCellRadius = viewport.width * (config.cellRadiusPct/100.0);
	    // This would be the outscribing circle radius for the plane-fitting hexagon.
	    var outerHexagonRadius = Math.sqrt( 4.0 * baseCellRadius * baseCellRadius / 3.0 );

	    var tileGradient = getSelectedGradient(baseCellRadius);
	    
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
	

	/**
	 * The lineShape must be aligned on the x-axis and must not be empty.
	 *
	 * @param {Vertex[]} polyVerts
	 * @param {Vertex[]} lineShape
	 **/
	var mapPolyLine = function( polyverts, lineShape ) {
	    var result = [];
	    var shapeVec = new Vector(lineShape[0], lineShape[lineShape.length-1]);
	    var shapeLen = shapeVec.length();
	    var n = polyverts.length;
	    for( var v = 0; v < n; v++ ) {
		var start = polyverts[ v ];
		var end   = polyverts[ (v+1)%n ];
		var vec = new Vector(start,end);
		result.push( start );
		// Map mid points from shape into segment between [start,end] line
		// (if line is too short just add start point)
		if( vec.length() > 1.0 ) {
		    var perp = vec.clone().perp();
		    for( var i = 0; i < lineShape.length; i++ ) {
			var shapeVert = lineShape[i];
			var xPct = (shapeVert.x-shapeVec.a.x)/shapeLen;
			var yPct = shapeVert.y/shapeLen; // y is orientated on the x-axis
			var vert = vec.vertAt( xPct );
			// result.push( vert );
			// pb.draw.circle( vert, 3 );
			var tmpPerp = vec.clone().moveTo( vert ).perp();
			var perpVert = tmpPerp.vertAt( yPct );
			result.push( perpVert );
		    }
		}
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
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var SHAPE_GRADIENTS = {
		"△"   :"T",
		"□"  :"S",
		"⬡" :"H",
		"△□"  :"TS",
		"△⬡" :"TH",
		"△□⬡" :"TSH",
		"△⬡"  :"TH"
	    };
	    var gui = pb.createGUI();
	    gui.add(config, 'cellRadiusPct').min(0.5).max(10).step(0.1).onChange( function() { pb.redraw(); } ).name("Cell size %").title("The cell radius");
	    gui.add(config, 'shapeRadiusFactor').min(0.0).max(2.0).step(0.01).onChange( function() { pb.redraw(); } ).name("Shape factor").title("The shape factor inside the cell.");
	    gui.add(config, 'segmentCount').min(1).max(10).step(1).onChange( function() { miniCanvas.setVertCount(config.segmentCount+1); pb.redraw(); } ).name("#segments").title("The segment count for each interpolated linear edge.");
	    gui.add(config, 'gradientType', SHAPE_GRADIENTS).onChange( function() { pb.redraw(); } ).name("Gradient type").title("Which shape gradient to use?");   
	}

	pb.config.postDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


