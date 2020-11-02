/**
 * A script for drawing Girihs.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 * 
 * @author   Ikaros Kappler
 * @date     2020-10-30
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
		  drawGrid              : true,
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
		  enableKeys            : true,
		  enableTouch           : true,

		  enableSVGExport       : false
		}, GUP
	    )
	);

	
	// +---------------------------------------------------------------------------------
	// | Pick a color from the WebColors array.
	// +-------------------------------
	var randomWebColor = function(index) {
	    return WebColors[ index % WebColors.length ].cssRGB();
	};

	
	// +---------------------------------------------------------------------------------
	// | Create a random vertex inside the canvas viewport.
	// +-------------------------------
	var randomVertex = function() {
	    return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
			       Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
			     );
	};

	// +---------------------------------------------------------------------------------
	// | Initialize 
	// +-------------------------------
	var hoverTileIndex = -1;
	var hoverEdgeIndex = -1;
	var tiles = [];
	var edgeLength = GirihTile.DEFAULT_EDGE_LENGTH;

	/**
	 * Find that tile (index) which contains the given position. First match will be returned.
	 *
	 * @name locateContainingTile
	 * @param {Vertex} position
	 * @return {number} The index of the containing tile or -1 if none was found.
	 **/
	var locateConatiningTile = function( position ) {
	    for( var i in tiles ) {
		if( tiles[i].containsVert( position ) )
		    return i;
	    }
	    return -1;
	};
	
	// Todo for all tiles: `position` should be first param
	var decagon = new GirihDecagon( new Vertex(-200,-100), edgeLength, 0.0 );
	tiles.push( decagon );

	var pentagon = new GirihPentagon( new Vertex(-77,-60), edgeLength, 0.0 );
	tiles.push( pentagon );

	var hexagon = new GirihHexagon( new Vertex(25,-0.5), edgeLength, 0.0 );
	tiles.push( hexagon );

	var bowtie = new GirihBowtie( new Vertex(-232,0), edgeLength, 0.0 );
	tiles.push( bowtie );

	var rhombus = new GirihRhombus( new Vertex(-68,-127.5), edgeLength, 0.0 );
	tiles.push( rhombus );

	var penrose = new GirihPenroseRhombus( new Vertex(-24,-28), edgeLength, 0.0, true );
	tiles.push( penrose );

	// +---------------------------------------------------------------------------------
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    // Draw all tiles
	    for( var i in tiles ) {
		var tile = tiles[i];
		// Fill polygon when highlighted (mouse hover)
		if( hoverTileIndex == i ) 
		    pb.fill.polygon( tile, 'rgba(128,128,128,0.12)' );
		pb.draw.polygon( tile, Green.cssRGB(), 2.0 ); // Polygon is not open
		// Draw all inner polygons
		for( var j = 0; j < tile.innerTilePolygons.length; j++ ) {
		    pb.draw.polygon( tile.innerTilePolygons[j], DeepPurple.cssRGB(), 1.0 );
		}
		// Draw all outer polygons
		for( var j = 0; j < tile.outerTilePolygons.length; j++ ) {
		    pb.draw.polygon( tile.outerTilePolygons[j], Teal.cssRGB(), 1.0 );
		}
		// Draw a crosshair at the center
		// pb.draw.crosshair( tile.position, 7, 'rgba(0,192,192,0.5)' );
		drawFancyCrosshair( tile.position, hoverTileIndex == i );
	    }

	    if( hoverTileIndex != -1 && hoverEdgeIndex != -1 ) {
		var tile = tiles[ hoverTileIndex ];
		var edge = new Line( tile.vertices[ hoverEdgeIndex ],
				     tile.vertices[ (hoverEdgeIndex+1) % tile.vertices.length ]
				   ); 
		pb.draw.line( edge.a, edge.b, Red.cssRGB(), 2.0 );
	    }
	};

	
	var drawFancyCrosshair = function( position, isHighlighted ) {
	    var color = isHighlighted ? 'rgba(192,0,0,0.5)' : 'rgba(0,192,192,0.5)';
	    var crossRadius = 2;
	    var arcRadius = 3;
	    var s = Math.sin(Math.PI/4)*crossRadius;
	    var c = Math.cos(Math.PI/4)*crossRadius;
	    pb.draw.line( new Vertex( position.x + c,
				      position.y + s ),
			  new Vertex( position.x - c,
				      position.y - s ),
			  color );
	    pb.draw.line( new Vertex( position.x + c,
				      position.y - s ),
			  new Vertex( position.x - c,
				      position.y + s ),
			  color );
	    for( var i = 0; i < 4; i++ ) {
		pb.draw.circleArc( position,
				   arcRadius,
				   Math.PI/2 * (i+1) + Math.PI*2*0.2,
				   Math.PI/2 * (i+1) + Math.PI*2*0.3,
				   color, 1.0 );
	    }
	};

	

	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'girih-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);

		handleMouseMove( relPos );
	    } );  


	// @param {XYCoords} relPos
	var handleMouseMove = function( relPos ) {
	    var containedTileIndex = locateConatiningTile(relPos);
	    
	    // Find Girih edge nearby ...
	    var oldHoverTileIndex = hoverTileIndex;
	    var oldHoverEdgeIndex = hoverEdgeIndex;
	    hoverTileIndex = -1;
	    hoverEdgeIndex = -1;
	    var i = containedTileIndex == -1 ? 0 : containedTileIndex;
	    do {
		var tile = tiles[i];
		var tmpPos = tile.position.clone().add( relPos );
		// May be -1
		hoverEdgeIndex = tile.locateEdgeAtPoint( tmpPos, edgeLength/2 );
		if( hoverEdgeIndex != -1 )
		    hoverTileIndex = i;
		i++;
	    } while( i < tiles.length && containedTileIndex == -1 && hoverEdgeIndex == -1 );
	    if( hoverTileIndex == -1 )
		hoverTileIndex = containedTileIndex;
	    
	    if( oldHoverTileIndex != hoverTileIndex || oldHoverEdgeIndex != hoverEdgeIndex )
		pb.redraw();
	};
	
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	   
	}, GUP );
	


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    
	}

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


