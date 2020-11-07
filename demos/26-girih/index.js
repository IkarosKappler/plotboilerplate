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

	// Initialize templates, one for each Girih tile type.
	var edgeLength = GirihTile.DEFAULT_EDGE_LENGTH;
	var templatePointer = 0;	
	var TILE_TEMPLATES = [];
	
	    /* new GirihDecagon( new Vertex(-200,-100), edgeLength, 0.0 ),
	    new GirihPentagon( new Vertex(-77,-60), edgeLength, 0.0 ),
	    new GirihHexagon( new Vertex(25,-0.5), edgeLength, 0.0 ),
	    new GirihBowtie( new Vertex(-232,0), edgeLength, 0.0 ),
	    new GirihRhombus( new Vertex(-68,-127.5), edgeLength, 0.0 ),
	    new GirihPenroseRhombus( new Vertex(-24,-28), edgeLength, 0.0, true ) */
/*
	    decagon,
	    new GirihPentagon( new Vertex(-77,-60), edgeLength, 0.0 ),
	    new GirihHexagon( new Vertex(25,-0.5), edgeLength, 0.0 ),
	    applyAdjacentTile( decagon, new GirihBowtie( new Vertex(-232,0), edgeLength, 0.0 ), 4 ),
	    new GirihRhombus( new Vertex(-68,-127.5), edgeLength, 0.0 ),
	    new GirihPenroseRhombus( new Vertex(-24,-28), edgeLength, 0.0, true )
	    ]; */
	
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
	// The index of the tile the mouse is hovering on or nearby (in the tiles-array)
	var hoverTileIndex = -1;
	// The index of the closest edge to the mouse pointer
	var hoverEdgeIndex = -1;
	// The set of all Girih tiles in scene
	var tiles = [];
	// If the mouse hovers over an edge the next possible adjacent Girih tile will be this
	var previewTile = null;

	var initTiles = function() {
	    var decagon = new GirihDecagon( new Vertex(-200,-100), edgeLength, 0.0 ); // Positions don't matter here
	    var pentagon = new GirihPentagon( new Vertex(-77,-60), edgeLength, 0.0 );
	    var hexagon = new GirihHexagon( new Vertex(25,-0.5), edgeLength, 0.0 );
	    var bowtie = new GirihBowtie( new Vertex(-232,0), edgeLength, 0.0 );
	    var rhombus = new GirihRhombus( new Vertex(-68,-127.5), edgeLength, 0.0 );
	    var penrose = new GirihPenroseRhombus( new Vertex(-24,-28), edgeLength, 0.0, true );

	    // Add tiles to array and put them in the correct adjacency position.
	    TILE_TEMPLATES.push( decagon );
	    TILE_TEMPLATES.push( applyAdjacentTile( decagon, 2, pentagon ) );
	    TILE_TEMPLATES.push( applyAdjacentTile( pentagon, 1, penrose ) );
	    TILE_TEMPLATES.push( applyAdjacentTile( penrose, 3, hexagon ) );
	    TILE_TEMPLATES.push( applyAdjacentTile( decagon, 5, bowtie ) );
	    TILE_TEMPLATES.push( applyAdjacentTile( pentagon, 4, rhombus ) );
	    
	    for( var i in TILE_TEMPLATES ) {
		tiles.push( TILE_TEMPLATES[i].clone() );
	    }
	};

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



	// +---------------------------------------------------------------------------------
	// | Find contrast color.
	// | Found at
	// |    https://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y/38542#38542
	// | Thanks to Martin Sojka
	// +-------------------------------
	var BLACK = Color.makeRGB( 0, 0, 0 );
	var WHITE = Color.makeRGB( 255, 255, 255 );
	var getContrastColor = function( color ) {
	    // console.log( color );
	    // r,g,b in [0..1]
	    var gamma = 2.2;
	    var L = 0.2126 * Math.pow( color.r, gamma )
		+ 0.7152 * Math.pow( color.g, gamma )
		+ 0.0722 * Math.pow( color.b, gamma );
	    var use_black = ( L > Math.pow( 0.5, gamma ) );
	    // console.log( 'use_black', use_black );
	    return use_black ? BLACK.cssRGB() : WHITE.cssRGB();
	};
	
	// +---------------------------------------------------------------------------------
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    // Draw the preview polygon first
	    if( previewTile ) {
		//template.move( adjacency.offset );
		// drawTile( previewTile, -1 );
		pb.draw.polygon( previewTile, 'rgba(128,128,128,0.5)', 1.0 ); // Polygon is not open
	    }
	    
	    // Draw all tiles
	    for( var i in tiles ) {
		var tile = tiles[i];
		// Fill polygon when highlighted (mouse hover)
		if( hoverTileIndex == i ) 
		    pb.fill.polygon( tile, 'rgba(128,128,128,0.12)' );
		drawTile( tile, i );
	    }

	    if( hoverTileIndex != -1 && hoverEdgeIndex != -1 ) {
		var tile = tiles[ hoverTileIndex ];
		var edge = new Line( tile.vertices[ hoverEdgeIndex ],
				     tile.vertices[ (hoverEdgeIndex+1) % tile.vertices.length ]
				   ); 
		pb.draw.line( edge.a, edge.b, Red.cssRGB(), 2.0 );
	    }
	};

	// +---------------------------------------------------------------------------------
	// | Draw the given tile.
	// |
	// | @param {GirihTile} tile - The tile itself.
	// | @param {number} index - The index in the tiles-array (to highlight hover).
	// +-------------------------------
	var drawTile = function( tile, index ) {
	    if( config.drawOutlines )
		pb.draw.polygon( tile, Green.cssRGB(), 2.0 ); // Polygon is not open
	    // Draw all inner polygons?
	    if( config.drawInnerPolygons ) {
		for( var j = 0; j < tile.innerTilePolygons.length; j++ ) {
		    pb.draw.polygon( tile.innerTilePolygons[j], DeepPurple.cssRGB(), 1.0 );
		}
	    }
	    // Draw all outer polygons?
	    if( config.drawOuterPolygons ) {
		for( var j = 0; j < tile.outerTilePolygons.length; j++ ) {
		    pb.draw.polygon( tile.outerTilePolygons[j], Teal.cssRGB(), 1.0 );
		}
	    }
	    // Draw a crosshair at the center
	    if( config.drawCenters )
		drawFancyCrosshair( tile.position, hoverTileIndex == i );

	    // Draw corner numbers?
	    if( config.drawCornerNumbers ) {
		var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor));
		for( var i = 0; i < tile.vertices.length; i++ ) {		
		    var pos = tile.vertices[i].clone().scale( 0.85, tile.position );
		    pb.fill.text( ""+i, pos.x, pos.y, { color : contrastColor } );
		}
	    }
	};

	
	// +---------------------------------------------------------------------------------
	// | Draw a fancy crosshair. The default one is useful but boring.
	// +-------------------------------
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
	// | Turn the tile the mouse is hovering over.
	// | The turnCount is ab abstract number: -1 for one turn left, +1 for one turn right.
	// +-------------------------------
	var handleTurnTile = function( turnCount ) {
	    if( hoverTileIndex == -1 )
		return;
	    var tile = tiles[hoverTileIndex];
	    tile.rotate( turnCount * Math.PI/tile.symmetry );
	    pb.redraw();
	};


	// +---------------------------------------------------------------------------------
	// | Move that tile the mouse is hovering over.
	// | The move amounts are abstract numbers, 1 indicating one unit along each axis.
	// +-------------------------------
	var handleMoveTile = function( moveXAmount, moveYAmount ) {
	    if( hoverTileIndex == -1 )
		return;
	    var tile = tiles[hoverTileIndex];
	    tile.move( { x: moveXAmount*10, y : moveYAmount*10 } );
	    pb.redraw();
	};


	// +---------------------------------------------------------------------------------
	// | Find the adjadent tile and location (offset).
	// | 
	// +-------------------------------
	var findAdjacentTile = function() {
	    previewTile = null;
	    if( hoverTileIndex != -1 && hoverEdgeIndex != -1 ) {
		var template = TILE_TEMPLATES[ templatePointer ].clone();
		// Find a rotation for that tile to match
		previewTile = applyAdjacentTile( tiles[hoverTileIndex], hoverEdgeIndex, template );
	    }  
	};


	// +---------------------------------------------------------------------------------
	// | Apply adjacent tile position. 
	// +-------------------------------
	var applyAdjacentTile = function( baseTile, baseEdgeIndex, adjacentTile ) {
	    // Find a rotation for that tile to match
	    var i = 0;
	    while( i < adjacentTile.symmetry ) {
		// { edgeIndex:number, offset:XYCoords }
		var adjacency =
		    baseTile.findAdjacentTilePosition(
			baseEdgeIndex,
			adjacentTile
		    );
		if( adjacency && !previewTile ) {
		    return adjacentTile; // previewTile = template;
		} else {
		    adjacentTile.rotate( (Math.PI*2)/adjacentTile.symmetry );
		}
		i++
	    }
	    return null;
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
	    } )
	    .click( function(e) {
		console.log( 'clicked' );
		if( previewTile ) {
		    tiles.push( previewTile );
		    pb.redraw();
		}
	    } );

	// +---------------------------------------------------------------------------------
	// | Add a key listener.
	// +-------------------------------
	var keyHandler = new KeyHandler( { trackAll : true } )
 	    .down('q',function() { handleTurnTile(-1); } )
	    .down('e',function() { handleTurnTile(1); } )
	    .down('w',function(e) { if( keyHandler.isDown('shift') ) {
		    handleMoveTile(0,-1);
	    } } )
	    .down('a',function(e) { if( keyHandler.isDown('shift') ) {
		handleMoveTile(-1,0);
	    } } )
	    .down('s',function(e) { if( keyHandler.isDown('shift') ) {
		handleMoveTile(0,1);
	    } } )
	    .down('d',function(e) { if( keyHandler.isDown('shift') ) {
		handleMoveTile(1,0);
	    } } )
	    .down('o',function() { config.drawOutlines = !config.drawOutlines; pb.redraw(); } )
	    .down('n',function() { config.drawCornerNumbers = !config.drawCornerNumbers; pb.redraw(); } )
	    .down('c',function() { config.drawCenters = !config.drawCenters; pb.redraw(); } )
	    .down('p',function() { config.drawOuterPolygons = !config.drawOuterPolygons; pb.redraw(); } )
	    .down('i',function() { config.drawInnerPolygons = !config.drawInnerPolygons; pb.redraw(); } )
	    .down('rightarrow',function() {
		templatePointer = (templatePointer+1)%TILE_TEMPLATES.length;
		findAdjacentTile();
		pb.redraw();
	    } )
	    .down('leftarrow',function() {
		templatePointer--;
		if(templatePointer < 0 )
		    templatePointer = TILE_TEMPLATES.length-1;
		findAdjacentTile();
		pb.redraw();
	    } )
 	;


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
		var tmpPos = relPos; // tile.position.clone().add( relPos );
		// May be -1
		hoverEdgeIndex = tile.locateEdgeAtPoint( tmpPos, edgeLength/2 );
		if( hoverEdgeIndex != -1 )
		    hoverTileIndex = i;
		i++;
	    } while( i < tiles.length && containedTileIndex == -1 && hoverEdgeIndex == -1 );
	    if( hoverTileIndex == -1 )
		hoverTileIndex = containedTileIndex;
	    
	    if( oldHoverTileIndex == hoverTileIndex && oldHoverEdgeIndex == hoverEdgeIndex ) 
		return;

	    // Find the next possible tile to place?
	    previewTile = null;
	    findAdjacentTile();
	    pb.redraw();
	};
	
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    drawOutlines : true,
	    drawCenters : true,
	    drawCornerNumbers : false,
	    drawOuterPolygons : true,
	    drawInnerPolygons : true
	}, GUP );
	


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'drawCornerNumbers').listen().onChange( function() { pb.redraw(); } ).name("drawCornerNumbers").title("Draw the number of each tile corner?");
	    gui.add(config, 'drawOutlines').listen().onChange( function() { pb.redraw(); } ).name("drawOutlines").title("Draw the tile outlines?");
	    gui.add(config, 'drawCenters').listen().onChange( function() { pb.redraw(); } ).name("drawCenters").title("Draw the center points?");
	    gui.add(config, 'drawOuterPolygons').listen().onChange( function() { pb.redraw(); } ).name("drawOuterPolygons").title("Draw the outer polygons?");
	    gui.add(config, 'drawInnerPolygons').listen().onChange( function() { pb.redraw(); } ).name("drawInnerPolygons").title("Draw the inner polygons?");
	}

	    initTiles();
	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


