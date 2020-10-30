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
		  drawGrid              : false,
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
	var hoverTileIndex = -1;
	var hoverEdgeIndex = -1;
	var tiles = [];
	var edgeLength = GirihTile.DEFAULT_EDGE_LENGTH;
	// Todo for all tiles: `position` should be first param
	var decagon = new GirihDecagon( new Vertex(0,0), 0.0, edgeLength );
	tiles.push( decagon );

	// +---------------------------------------------------------------------------------
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    
	    for( var i in tiles ) {
		pb.draw.polygon( tiles[i], false ); // Polygon is not open
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
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'girih-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);

		// Find Girih edge nearby ...
		hoverTileIndex = -1;
		hoverEdgeIndex = -1;
		for( var i in tiles ) {
		    var tile = tiles[i];
		    var edgeIndex = tile.locateEdgeAtPoint( relPos, edgeLength/2 ); // location, tolerance
		    // console.log( "edgeIndex", edgeIndex );

		    if( edgeIndex != -1 ) {
			// highlight edge
			/* var edge = new Line( tile.vertices[ edgeIndex ],
					     tile.vertices[ (edgeIndex+1) % tile.vertices.length ]
					   ); 
			console.log( edge ); */
			// pb.draw.line( edge.a, edge.b, 'rgba(255,128,0,1.0)', 2.0 );
			hoverTileIndex = i;
			hoverEdgeIndex = edgeIndex;

			pb.redraw();
		    }
		}
	    } );  


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


