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
 * @date     2019-07-01
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
	    }, GUP );

	    var dildoGeneration = new DildoGeneration('dildo-canvas');
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
		    dildoGeneration.generateSTL( {
			onComplete : function(stlData) {
			    window.setTimeout( function() {
				modal.setBody( "File ready." ); 
				modal.setActions( [ Modal.ACTION_CLOSE ] );
				saveFile(stlData,'dildomodel.stl');
			    }, 500 );
			    // modal.close();
			}
		    } );
		} catch( e ) {
		    modal.setBody( "Error: " + e ); 
		    modal.setActions( [ Modal.ACTION_CLOSE ] );
		}
	    };


	    var showPathJSON = function() {
		modal.setTitle( "Show Path JSON" );
		modal.setFooter( "" );
		modal.setActions( [ Modal.ACTION_CLOSE ] );
		modal.setBody( outline.toJSON(true) ); 
		modal.open();
	    };


	    var insertPathJSON = function() {
		var textarea = document.createElement('textarea');
		textarea.style.width = "100%";
		textarea.style.height = "50vh";
		textarea.innerHTML = outline.toJSON(true);
		modal.setTitle( "Insert Path JSON" );
		modal.setFooter( "" );
		modal.setActions( [ Modal.ACTION_CANCEL, { label : "Load JSON", action : function() { loadPathJSON(textarea.value); modal.close(); } }] );
		modal.setBody( textarea ); 
		modal.open();
	    };

	    var loadPathJSON = function( jsonData ) {
		var newOutline = BezierPath.fromJSON( jsonData );
		// pb.remove( outline );
		// TODO: add a removeVertices() function to PB
		// pb.vertices = [];
		// outline = newOutline;
		// addPathListeners( outline );
		// pb.add( newOutline );
		setPathInstance( newOutline );
		rebuild();
	    };

	    
	    // +---------------------------------------------------------------------------------
	    // | Delay the build a bit. And cancel stale builds.
	    // | This avoids too many rebuilds (pretty expensive) on mouse drag events.
	    // +-------------------------------
	    var buildId = null;
	    var rebuild = function() {
		var buildId = new Date().getTime();
		window.setTimeout( (function(bId) {
		    return function() {
			if( bId == buildId ) {
			    // console.log('rebuild', outline );
			    dildoGeneration.rebuild( Object.assign( { outline : outline }, config ) );
			}
		    };
		})(buildId), 50 );
	    };
	    
	    // new DoubleclickHandler( pb, handleDoubleclick );

	    
	    // +---------------------------------------------------------------------------------
	    // | Each outline vertex requires a drag (end) listener. Wee need this to update
	    // | the 3d mesh on changes.
	    // +-------------------------------
	    var dragListener = function( dragEvent ) {
		// Uhm, well, some curve point moved.
		rebuild();
	    };
	    var addPathListeners = function( path ) {
		BezierPathInteractionHelper.addPathVertexDragListeners( path, dragListener );
	    };
	    var removePathListeners = function( path ) {
		BezierPathInteractionHelper.removePathVertexDragListeners( path, dragListener );
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | Draw some stuff before rendering?
	    // +-------------------------------
	    var preDraw = function() {
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
	    };

	    // +---------------------------------------------------------------------------------
	    // | Draw the split-indicator (if split position ready).
	    // +-------------------------------
	    var postDraw = function() {
		if( bezierDistanceLine != null ) {
		    pb.draw.line( bezierDistanceLine.a, bezierDistanceLine.b, 'rgb(255,192,0)', 2 );
		    pb.fill.circleHandle( bezierDistanceLine.a, 3.0, 'rgb(255,192,0)' );
		}
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
	    // | Scale a given Bounds instance to a new size (from its center).
	    // +-------------------------------
	    var scaleBounds = function( bounds, scaleFactor ) {
		var center = new Vertex( bounds.min.x + bounds.width/2.0, bounds.min.y + bounds.height/2.0 );
		return new Bounds( new Vertex(bounds.min).scale( scaleFactor, center ),
				   new Vertex(bounds.max).scale( scaleFactor, center ) );
	    };


	    var setPathInstance = function( newOutline ) {
		if( typeof outline != "undefined" ) {
		    pb.remove( outline );
		    // TODO: add a removeVertices() function to PB
		    pb.vertices = [];
		}
		outline = newOutline;	
		addPathListeners( outline );
		pb.add( newOutline );
		
		// +---------------------------------------------------------------------------------
		// | Install a Bézier interaction helper.
		// +-------------------------------
		var helper = new BezierPathInteractionHelper(
		    pb,
		    [outline],
		    {
			maxDetectDistance : 32.0,
			autoAdjustPaths : true,
			allowPathRemoval : false, // It is not alowed to remove the outline path
			onPointerMoved : function(pathIndex,newA,newB,newT) {
			    if( pathIndex == -1 ) {
				bezierDistanceLine = null;
			    } else {
				bezierDistanceLine = new Line( newA, newB );
				bezierDistanceT = newT;
			    }
			},
			onVertexInserted : function(pathIndex,insertAfterIndex,newPath,oldPath) {
			    console.log('[pathIndex='+pathIndex+'] Vertex inserted after '+ insertAfterIndex );
			    console.log('oldPath', oldPath, 'newPath', newPath );
			    removePathListeners( outline );
			    outline = newPath;
			    addPathListeners( outline );
			    rebuild();
			},
			onVerticesDeleted : function(pathIndex,deletedVertIndices,newPath,oldPath) {
			    console.log('[pathIndex='+pathIndex+'] vertices deleted', deletedVertIndices );
			    removePathListeners( outline );
			    outline = newPath;
			    addPathListeners( outline );
			    rebuild();
			}
		    }
		);
	    }; // END setPathInstance


	    // +---------------------------------------------------------------------------------
	    // | Create the outline: a Bézier path.
	    // +-------------------------------
	    var outline = null;
	    // This will trigger the first initial postDraw/draw/redraw call
	    setPathInstance( BezierPath.fromJSON( DEFAULT_BEZIER_JSON ) );

	    

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
	    }

	    pb.config.preDraw = preDraw;
	    pb.config.postDraw = postDraw;
	    pb.fitToView( scaleBounds(outline.getBounds(),1.6) );
	    rebuild();
	    
	} );
    
})(window); 


