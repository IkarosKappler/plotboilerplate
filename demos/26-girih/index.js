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
	    console.log( 'tiles', girih.tiles );
	};

	var addTile = function( tile ) {
	    tile.position.listeners.addClickListener( (function(vertex) {
		return function(clickEvent) {
		    console.log('clicked', clickEvent );
		    vertex.attr.isSelected = !vertex.attr.isSelected;
		    pb.redraw();
		} })(tile.position)
						    );
	    tile.position.attr.draggable = false;
	    tile.position.attr.visible = false;
	    pb.add( tile.position );
	    girih.addTile( tile ); 
	};

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
	    }
	    
	    // Draw all tiles
	    for( var i in girih.tiles ) {
		var tile = girih.tiles[i];
		// Fill polygon when highlighted (mouse hover)
		if( hoverTileIndex == i ) 
		    pb.fill.polygon( tile, 'rgba(128,128,128,0.12)' );
		drawTile( tile, i );
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
		drawTileTexture( tile, textureImage );
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
	    if( config.drawCenters )
		drawFancyCrosshair( tile.position, hoverTileIndex == i, tile.position.attr.isSelected );

	    // Draw corner numbers?
	    if( config.drawCornerNumbers ) {
		var contrastColor = toContrastColor(Color.parse(pb.config.backgroundColor));
		for( var i = 0; i < tile.vertices.length; i++ ) {		
		    var pos = tile.vertices[i].clone().scale( 0.85, tile.position );
		    pb.fill.text( ""+i, pos.x, pos.y, { color : contrastColor } );
		}
	    }
	};

	
	// +---------------------------------------------------------------------------------
	// | Draw a fancy crosshair. The default one is useful but boring.
	// +-------------------------------
	var drawFancyCrosshair = function( position, isHighlighted, isSelected ) {
	    var color = isSelected ? 'red' : isHighlighted ? 'rgba(192,0,0,0.5)' : 'rgba(0,192,192,0.5)';
	    var lineWidth = isSelected ? 2.0 : 1.0;
	    var crossRadius = 2;
	    var arcRadius = 3;
	    var s = Math.sin(Math.PI/4)*crossRadius;
	    var c = Math.cos(Math.PI/4)*crossRadius;
	    pb.draw.line( new Vertex( position.x + c,
				      position.y + s ),
			  new Vertex( position.x - c,
				      position.y - s ),
			  color, lineWidth );
	    pb.draw.line( new Vertex( position.x + c,
				      position.y - s ),
			  new Vertex( position.x - c,
				      position.y + s ),
			  color, lineWidth );
	    for( var i = 0; i < 4; i++ ) {
		pb.draw.circleArc( position,
				   arcRadius,
				   Math.PI/2 * (i+1) + Math.PI*2*0.2,
				   Math.PI/2 * (i+1) + Math.PI*2*0.3,
				   color, lineWidth );
	    }
	};
	
	var drawTileTexture = function( tile, imageObject ) {		
	    pb.draw.ctx.save();

	    var tileBounds = tile.getBounds();
	    var scale = pb.draw.scale;
	    var offset = pb.draw.offset;

	    var srcBounds = new Bounds(
		new Vertex( tile.textureSource.min.x * imageObject.width,
			    tile.textureSource.min.y * imageObject.height
			  ),
		new Vertex( tile.textureSource.max.x * imageObject.width,
			    tile.textureSource.max.y * imageObject.height
			  )
	    );

	    var destBounds = new Bounds(
		new Vertex( tile.baseBounds.min.x * scale.x,
			    tile.baseBounds.min.y * scale.y 
			  ),
		new Vertex( tile.baseBounds.max.x * scale.x,
			    tile.baseBounds.max.y * scale.y 
			  )
	    );

	    clipPoly( pb.draw.ctx, pb.draw.offset, pb.draw.scale, tile.vertices );
  
	    // Set offset and translation here.
	    // Other ways we will not be able to rotate textures properly around the tile center.
	    pb.draw.ctx.translate( offset.x + tile.position.x,
				   offset.y + tile.position.y
				 );
	    pb.draw.ctx.rotate( tile.rotation );
	    pb.draw.ctx.drawImage(
		imageObject,
		
		srcBounds.min.x,  // source x
		srcBounds.min.y,  // source y
		srcBounds.width,  // source w
		srcBounds.height, // source h
		
		destBounds.min.x - tile.position.x, // dest x,
		destBounds.min.y - tile.position.y, // dest y,
		destBounds.width, // dest w
		destBounds.height // dest h
	    );
		 
	    pb.draw.ctx.restore();
	};


	var clipPoly = function( ctx, offset, scale, vertices ) {
	    ctx.beginPath();
	    // Set clip mask
	    ctx.moveTo( offset.x + vertices[0].x * scale.x,
			offset.y + vertices[0].y * scale.y );
	    for( var i = 1; i < vertices.length; i++ ) {
		var vert = vertices[i];
		ctx.lineTo( offset.x + vert.x * scale.x,
			    offset.y + vert.y * scale.y
			  );
	    }
	    ctx.closePath();
	    pb.draw.ctx.clip();
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
	    if( hoverTileIndex == -1 )
		return;
	    girih.moveTile( hoverTileIndex, moveXAmount, moveYAmount );
	    pb.redraw();
	};

	var findSelectedTileIndices = function() {
	    var selectedTileIndices = [];
	    for( var i in girih.tiles ) {
		if( girih.tiles[i].position.attr.isSelected )
		    selectedTileIndices.push( i );
	    }
	    return selectedTileIndices;
	};
	
	var handleDeleteTile = function() {
	    // Find selected tiles
	    var selectedTileIndices = findSelectedTileIndices();
	    for( var i = selectedTileIndices.length-1; i >= 0; i-- ) {
		pb.remove( girih.tiles[ selectedTileIndices[i] ].position );
		girih.removeTileAt( selectedTileIndices[i] ); 
	    }
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
		console.log( 'clicked' );
		var clickedVert = pb.getVertexNear( e.params.pos, PlotBoilerplate.DEFAULT_CLICK_TOLERANCE );
		console.log( clickedVert, previewTilePointer, 'of', previewTiles.length );
		if( !clickedVert && previewTilePointer < previewTiles.length ) {
		    addTile( previewTiles[previewTilePointer].clone() );
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
	    .down('t',function() { config.drawTextures = !config.drawTextures; pb.redraw(); } )
	    .down('rightarrow',function() {
		previewTilePointer = (previewTilePointer+1)%previewTiles.length;
		highlightPreviewTile( previewTilePointer );
		if( hoverTileIndex != -1 & hoverEdgeIndex != -1 )
		    pb.redraw();
	    } )
	    .down('leftarrow',function() {
		previewTilePointer--;
		if( previewTilePointer < 0 )
		    previewTilePointer = previewTiles.length-1;
		highlightPreviewTile( previewTilePointer );
		if( hoverTileIndex != -1 && hoverEdgeIndex != -1 )
		    pb.redraw();
	    } )
	    .down('delete',function() {
		console.log('delete');
		handleDeleteTile();
	    } )
 	;


	// @param {XYCoords} relPos
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
		    var tmpPos = relPos; // tile.position.clone().add( relPos );
		    // May be -1
		    hoverEdgeIndex = tile.locateEdgeAtPoint( tmpPos, girih.edgeLength/2 );
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
		    previewTiles = girih.findAdjacentTiles( hoverTileIndex, hoverEdgeIndex );
		    // Set pointer to save range
		    previewTilePointer = Math.min( Math.max(previewTiles.length-1, previewTilePointer), previewTilePointer );
		}
	    }
	    pb.redraw();
	    if( previewTiles.length != 0 )
		createAdjacentTilePreview( previewTiles, previewTilePointer );
	};
	
	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    drawOutlines : true,
	    drawCenters : true,
	    drawCornerNumbers : false,
	    drawOuterPolygons : true,
	    drawInnerPolygons : true,
	    lineJoin  : "round",     // [ "bevel", "round", "miter" ]
	    drawTextures : false
	}, GUP );


	// +---------------------------------------------------------------------------------
	// | Build a preview of all available tiles.
	// +-------------------------------
	var createAdjacentTilePreview = function( tiles, pointer ) {
	    var container = document.querySelector('.wrapper-bottom');
	    while(container.firstChild){
		container.removeChild( container.firstChild );
	    }

	    var svgBuilder = new SVGBuilder();
	    for( var i in tiles ) {
		var tile = tiles[i].clone();
		tile.move( tile.position.clone().inv() );
		var bounds = tile.getBounds();
		
		var svgString = svgBuilder.build( [tile],
						  { canvasSize : { width : bounds.width/2, height : bounds.height/2 },
						    zoom : { x:0.333, y:0.333 },
						    offset: { x:bounds.width*0.666 , y:bounds.height * 0.666 }
						  }
						);
		var node = document.createElement('div');
		node.classList.add('preview-wrapper');
		node.dataset.tileIndex = i;
		node.addEventListener('click', (function(tileIndex) {
		    return function(event) {
			previewTilePointer = tileIndex;
			highlightPreviewTile(tileIndex);
		    };
		})(i) );
		node.innerHTML = svgString;
		container.appendChild( node );
	    }

	    highlightPreviewTile( pointer );
	};

	var highlightPreviewTile = function( pointer ) {
	    var nodes = document.querySelectorAll('.wrapper-bottom .preview-wrapper');
	    for( var i = 0; i < nodes.length; i++ ) {
		var node = nodes[i];
		if( node.dataset && node.dataset.tileIndex == pointer ) {
		    node.classList.add( 'highlighted-preview-tile' );
		} else {
		    node.classList.remove( 'highlighted-preview-tile' );
		}
	    }
	};


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
	    gui.add(config, 'lineJoin', [ "bevel", "round", "miter" ] ).onChange( function() { pb.redraw(); } ).name("lineJoin").title("The shape of the line joins.");
	    gui.add(config, 'drawTextures').listen().onChange( function() { pb.redraw(); } ).name("drawTextures").title("Draw the Girih textures?");
	}

	    initTiles();
	pb.config.preDraw = drawAll;
	pb.redraw();
	pb.canvas.focus();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


