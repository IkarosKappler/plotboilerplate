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

// TODOs
//  * detect polygon intersection (avoid displaced tiles)
//  * build auto-generation (random)
//  * build grid of all possible positions (centers only)
//  * detect connecting lines (inner polygons to max paths)

(function(_context) {
    "use strict";


    window.initializePB = function() {
	if( window.pbInitialized )
	    return;
	window.pbInitialized = true;

	// Fetch the GET params
	let GUP = gup();

	var textureImage = null;

	// Initialize templates, one for each Girih tile type.
	var girih = new Girih( GirihTile.DEFAULT_EDGE_LENGTH );
	
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
	// If the mouse hovers over an edge the next possible adjacent Girih tile will be this
	var previewTiles = [];
	var previewTilePointer = 0;
	var initTiles = function() {
	    for( var i in girih.TILE_TEMPLATES ) {
		var tile = girih.TILE_TEMPLATES[i].clone();
		addTile( tile );
	    }
	};

	var previewIntersectionPolygons = [];
	var previewIntersectionAreas = [];

	
	// +---------------------------------------------------------------------------------
	// | Add a tile and install listeners.
	// +-------------------------------
	var addTile = function( tile ) {
	    tile.position.listeners.addClickListener( (function(vertex) {
		return function(clickEvent) {
		    vertex.attr.isSelected = !vertex.attr.isSelected;
		    pb.redraw();
		} })(tile.position)
						    );
	    tile.position.attr.draggable = false;
	    tile.position.attr.visible = false;
	    pb.add( tile.position );
	    girih.addTile( tile ); 
	};

	// +---------------------------------------------------------------------------------
	// | Remove the tile at the given index.
	// +-------------------------------
	var removeTile = function( tileIndex ) {
	    // Remove listeners?
	    pb.remove( girih.tiles[ tileIndex ].position );
	    girih.removeTileAt( tileIndex );
	};

	
	// +---------------------------------------------------------------------------------
	// | Get the contrast color (string) for the given color (object).
	// +-------------------------------
	var toContrastColor = function( color ) {
	    return getContrastColor(color).cssRGB();
	};
	
	// +---------------------------------------------------------------------------------
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    pb.draw.ctx.lineJoin = config.lineJoin;
	    // Draw the preview polygon first
	    if( hoverTileIndex != -1 && hoverEdgeIndex != -1
		&& 0 <= previewTilePointer && previewTilePointer < previewTiles.length ) {
		
		pb.draw.polygon( previewTiles[previewTilePointer], 'rgba(128,128,128,0.5)', 1.0 ); // Polygon is not open

		// Draw intersection polygons (if there are any)
		if( config.showPreviewOverlaps ) {
		    for( var i = 0; i < previewIntersectionPolygons.length; i++ ) {
			pb.fill.polygon( previewIntersectionPolygons[i], 'rgba(255,0,0,0.25)' );
		    }
		}
	    }
	    
	    // Draw all tiles
	    for( var i in girih.tiles ) {
		var tile = girih.tiles[i];
		// Fill polygon when highlighted (mouse hover)
		drawTile( tile, i );
	    }

	    // Draw intersection polygons? (if there are any)
	    if( config.showPreviewOverlaps
		&& hoverTileIndex != -1 && hoverEdgeIndex != -1
		&& 0 <= previewTilePointer && previewTilePointer < previewTiles.length ) {
		for( var i = 0; i < previewIntersectionPolygons.length; i++ ) {
		    pb.fill.polygon( previewIntersectionPolygons[i], 'rgba(255,0,0,0.25)' );
		}
	    }

	    if( hoverTileIndex != -1 && hoverEdgeIndex != -1 ) {
		var tile = girih.tiles[ hoverTileIndex ];
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
	    if( config.drawTextures && textureImage.complete && textureImage.naturalHeight !== 0 ) {
		drawTileTexture( pb, tile, textureImage );
	    }
	    if( config.drawOutlines ) {
		pb.draw.polygon( tile, Green.cssRGB(), 2.0 ); // Polygon is not open
	    }
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
	    var isHighlighted = (index == hoverTileIndex);
	    if( config.drawCenters ) {
		drawFancyCrosshair(
		    pb, tile.position,
		    tile.position.attr.isSelected ? 'red' : isHighlighted ? 'rgba(192,0,0,0.5)' : 'rgba(0,192,192,0.5)',
		    tile.position.attr.isSelected ? 2.0 : 1.0,
		    3.0
		);
	    }

	    var contrastColor = toContrastColor(Color.parse(pb.config.backgroundColor));
	    // Draw corner numbers?
	    if( config.drawCornerNumbers ) {
		for( var i = 0; i < tile.vertices.length; i++ ) {		
		    var pos = tile.vertices[i].clone().scale( 0.85, tile.position );
		    pb.fill.text( ""+i, pos.x, pos.y, { color : contrastColor } );
		}
	    }

	    if( config.drawTileNumbers ) {
		pb.fill.text( ""+index, tile.position.x, tile.position.y, { color : contrastColor } );
	    }
	}; 
	

	// +---------------------------------------------------------------------------------
	// | Turn the tile the mouse is hovering over.
	// | The turnCount is ab abstract number: -1 for one turn left, +1 for one turn right.
	// +-------------------------------
	var handleTurnTile = function( turnCount ) {
	    if( hoverTileIndex == -1 )
		return;
	    girih.turnTile( hoverTileIndex, turnCount );
	    pb.redraw();
	};


	// +---------------------------------------------------------------------------------
	// | Move that tile the mouse is hovering over.
	// | The move amounts are abstract numbers, 1 indicating one unit along each axis.
	// +-------------------------------
	var handleMoveTile = function( moveXAmount, moveYAmount ) {
	    console.log('move');
	    if( hoverTileIndex == -1 )
		return;
	    girih.moveTile( hoverTileIndex, moveXAmount, moveYAmount );
	    pb.redraw();
	};

	// +---------------------------------------------------------------------------------
	// | A helper function to find all tiles (indices) that are selected.
	// +-------------------------------
	var findSelectedTileIndices = function() {
	    var selectedTileIndices = [];
	    for( var i in girih.tiles ) {
		if( girih.tiles[i].position.attr.isSelected )
		    selectedTileIndices.push( i );
	    }
	    return selectedTileIndices;
	};

	// +---------------------------------------------------------------------------------
	// | Delete all selected tiles.
	// +-------------------------------
	var handleDeleteTile = function() {
	    // Find selected tiles
	    var selectedTileIndices = findSelectedTileIndices();
	    for( var i = selectedTileIndices.length-1; i >= 0; i-- ) {
		removeTile( selectedTileIndices[i] );
	    }
	    pb.redraw();
	};

	
	// +---------------------------------------------------------------------------------
	// | Set the currently highlighted preview tile from the preview set.
	// +-------------------------------
	var setPreviewTilePointer = function( pointer ) {
	    previewTilePointer = pointer;
	    pb.redraw();
	};


	var addPreviewTile = function() {
	    console.log('area', stats, stats.intersectionArea );
	    
	    // Avoid overlaps?
	    if( !config.allowOverlaps && stats.intersectionArea > 1 ) {
		console.log('Adding overlapping tiles not allowed.');
		if( humane )
		    humane.log('Adding overlapping tiles not allowed.');
		return;
	    }
	    
	    addTile( previewTiles[previewTilePointer].clone() );
	    pb.redraw();
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
		var clickedVert = pb.getVertexNear( e.params.pos, PlotBoilerplate.DEFAULT_CLICK_TOLERANCE );
		if( !clickedVert && previewTilePointer < previewTiles.length ) {
		    // Touch and mouse devices handle this differently
		    if( e.params.isTouchEvent
			|| (!e.params.isTouchEvent && hoverTileIndex != -1 && hoverEdgeIndex != -1) ) {
			/* 
			// Avoid overlaps?
			if( !config.allowOverlaps && stats.intersectionArea > 1 ) {
			    console.log('Adding overlapping tiles not allowed.');
			    return;
			}
			
			addTile( previewTiles[previewTilePointer].clone() );
			pb.redraw();
			*/
			addPreviewTile();
		    }
		}
	    } );

	// +---------------------------------------------------------------------------------
	// | Add a key listener.
	// +-------------------------------
	var keyHandler = new KeyHandler( { trackAll : true } )
 	    .down('q',function() { handleTurnTile(-1); } )
	    .down('e',function() { handleTurnTile(1); } )
	    .down('uparrow',function(e) {
		    handleMoveTile(0,-1);
	     } )
	    .down('leftarrow',function(e) {
		handleMoveTile(-1,0);
	    } )
	    .down('downarrow',function(e) { 
		handleMoveTile(0,1);
	    } )
	    .down('rightarrow',function(e) { 
		handleMoveTile(1,0);
	    } )
	    .down('o',function() { config.drawOutlines = !config.drawOutlines; pb.redraw(); } )
	    .down('n',function() { config.drawCornerNumbers = !config.drawCornerNumbers; pb.redraw(); } )
	    .down('c',function() { config.drawCenters = !config.drawCenters; pb.redraw(); } )
	    .down('p',function() { config.drawOuterPolygons = !config.drawOuterPolygons; pb.redraw(); } )
	    .down('i',function() { config.drawInnerPolygons = !config.drawInnerPolygons; pb.redraw(); } )
	    .down('t',function() { config.drawTextures = !config.drawTextures; pb.redraw(); } )
	    .down('d',function() {
		previewTilePointer = (previewTilePointer+1)%previewTiles.length;
		highlightPreviewTile( previewTilePointer );
		if( hoverTileIndex != -1 & hoverEdgeIndex != -1 ) {
		    findPreviewIntersections();
		    pb.redraw();
		}
	    } )
	    .down('a',function() {
		previewTilePointer--;
		if( previewTilePointer < 0 )
		    previewTilePointer = previewTiles.length-1;
		highlightPreviewTile( previewTilePointer );
		if( hoverTileIndex != -1 && hoverEdgeIndex != -1 ) {
		    findPreviewIntersections();
		    pb.redraw();
		}
	    } )
	    .down('enter', function() {
		if( previewTilePointer < previewTiles.length ) {
		    // addTile( previewTiles[previewTilePointer].clone() );
		    // pb.redraw();
		    addPreviewTile();
		}
	    } )
	    .down('delete',function() {
		console.log('delete');
		handleDeleteTile();
	    } )
 	;


	// +---------------------------------------------------------------------------------
	// | @param {XYCoords} relPos
	// +-------------------------------
	var handleMouseMove = function( relPos ) {
	    var containedTileIndex = girih.locateConatiningTile(relPos);

	    // Reset currently highlighted tile/edge (if re-detected nothing changed in the end)
	    var oldHoverTileIndex = hoverTileIndex;
	    var oldHoverEdgeIndex = hoverEdgeIndex;
	    hoverTileIndex = -1;
	    hoverEdgeIndex = -1;
	    
	    // Find Girih edge nearby ...
	    if( containedTileIndex != -1 ) {
		var i = containedTileIndex == -1 ? 0 : containedTileIndex;
		do {
		    var tile = girih.tiles[i];
		    // May be -1
		    hoverEdgeIndex = tile.locateEdgeAtPoint( relPos, girih.edgeLength/2 );
		    if( hoverEdgeIndex != -1 )
			hoverTileIndex = i;
		    i++;
		} while( i < girih.tiles.length && containedTileIndex == -1 && hoverEdgeIndex == -1 );
		if( hoverTileIndex == -1 )
		    hoverTileIndex = containedTileIndex;
		
		if( oldHoverTileIndex == hoverTileIndex && oldHoverEdgeIndex == hoverEdgeIndex ) 
		    return;

		// Find the next possible tile to place?
		if( hoverTileIndex != -1 ) {
		    previewTiles = girih.findPossibleAdjacentTiles( hoverTileIndex, hoverEdgeIndex );
		    // Set pointer to save range
		    previewTilePointer = Math.min( Math.max(previewTiles.length-1, previewTilePointer), previewTilePointer );
		    // Find any intersections for the new preview tile
		    findPreviewIntersections();
		}
	    }
	    pb.redraw();
	    if( previewTiles.length != 0 )
		createAdjacentTilePreview( previewTiles, previewTilePointer, setPreviewTilePointer );
	};


	// +---------------------------------------------------------------------------------
	// | Find all intersections of the Girih tiles and the
	// | currently selected preview polygon.
	// |
	// | Following global vars will be updated:
	// |  * previewIntersectionPolygons
	// |  * previewIntersectionAreas
	// +-------------------------------
	var findPreviewIntersections = function() {
	    previewIntersectionPolygons = [];
	    previewIntersectionAreas = [];
	    if( hoverTileIndex == -1 || hoverEdgeIndex == -1 || previewTilePointer < 0 || previewTilePointer >= previewTiles.length ) {
		stats.intersectionArea = 0.0;
		return;
	    }
	    var totalArea = 0.0;
	    var currentPreviewTile = previewTiles[ previewTilePointer ];
	    for( var i = 0; i < girih.tiles.length; i++ ) {
		if( i == hoverTileIndex )
		    continue;
		var intersections = findPreviewIntersectionsFor( currentPreviewTile, girih.tiles[i] );
		for( var j = 0; j < intersections.length; j++ ) {
		    var poly = new Polygon(cloneVertexArray(intersections[j]), false);
		    var area = calculatePolygonArea( poly.vertices );
		    // if( area === NaN )
		    //	area = 0.0;
		    previewIntersectionAreas.push( area );
		    previewIntersectionPolygons.push( poly );
		    totalArea += area;
		}
	    }
	    stats.intersectionArea = totalArea;
	};


	// +---------------------------------------------------------------------------------
	// | Find the polygon intersections for the given preview tile and
	// | girih tile.
	// |
	// | @param {Polygon} previewTile - The tile you want to place.
	// | @param {Polygon} girihTile - The tile currently on the canvas.
	// | @return {Vertex[][]} A set of intersection polygons.
	// +-------------------------------
	var findPreviewIntersectionsFor = function( previewTile, girihTile ) {
	    // Check if there are intersec
	    var intersection = greinerHormann.intersection(
		// This is a workaround about a colinearity problem with greiner-hormann:
		    // ... add some random jitter.
		addPolygonJitter(cloneVertexArray(girihTile.vertices),0.0001), // Source
		addPolygonJitter(cloneVertexArray(previewTile.vertices),0.0001)  // Clip
	    );
	    if( !intersection ) {
		return [];
	    }

	    // Only one single polygon returned?
	    if( typeof intersection[0][0] === "number" )
		intersection = [intersection];

	    // Calculate size or triangulation here?
	    return intersection;
	};

	
	
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    drawOutlines : true,
	    drawCenters : true,
	    drawCornerNumbers : false,
	    drawTileNumbers: false,
	    drawOuterPolygons : true,
	    drawInnerPolygons : true,
	    lineJoin  : "round",     // [ "bevel", "round", "miter" ]
	    drawTextures : false,
	    showPreviewOverlaps : true,
	    allowOverlaps : false
	}, GUP );


	// Keep track of loaded textures
	var textureStore = new Map();
	var loadTextureImage = function( path, onLoad ) {
	    var texture = textureStore.get(path); 
	    if( !texture ) {
		texture = new Image();
		texture.onload = onLoad;
		texture.src = path;
		textureStore.set(path,texture);
	    }
	    return texture;
	};
	textureImage = loadTextureImage('girihtexture-500px-2.png', function() { console.log('Texture loaded'); pb.redraw(); });

	var stats = {
	    intersectionArea : 0.0
	};

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	   
	    
	    var gui = pb.createGUI();
	    gui.add(config, 'drawCornerNumbers').listen().onChange( function() { pb.redraw(); } ).name("drawCornerNumbers").title("Draw the number of each tile corner?");
	    gui.add(config, 'drawTileNumbers').listen().onChange( function() { pb.redraw(); } ).name("drawTileNumbers").title("Draw the index of each tile?");
	    gui.add(config, 'drawOutlines').listen().onChange( function() { pb.redraw(); } ).name("drawOutlines").title("Draw the tile outlines?");
	    gui.add(config, 'drawCenters').listen().onChange( function() { pb.redraw(); } ).name("drawCenters").title("Draw the center points?");
	    gui.add(config, 'drawOuterPolygons').listen().onChange( function() { pb.redraw(); } ).name("drawOuterPolygons").title("Draw the outer polygons?");
	    gui.add(config, 'drawInnerPolygons').listen().onChange( function() { pb.redraw(); } ).name("drawInnerPolygons").title("Draw the inner polygons?");
	    gui.add(config, 'lineJoin', [ "bevel", "round", "miter" ] ).onChange( function() { pb.redraw(); } ).name("lineJoin").title("The shape of the line joins.");
	    gui.add(config, 'drawTextures').listen().onChange( function() { pb.redraw(); } ).name("drawTextures").title("Draw the Girih textures?");
	    gui.add(config, 'showPreviewOverlaps').listen().onChange( function() { pb.redraw(); } ).name('showPreviewOverlaps').title('Detect and show preview overlaps?');
	    gui.add(config, 'allowOverlaps').listen().onChange( function() { pb.redraw(); } ).name('allowOverlaps').title('Allow placement of intersecting tiles?');

	    // Add stats
	    var uiStats = new UIStats( stats );
	    stats = uiStats.proxy;
	    uiStats.add( 'intersectionArea' ).precision( 3 ).suffix(' spx');
	}

	initTiles();
	pb.config.preDraw = drawAll;
	pb.redraw();
	pb.canvas.focus();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


