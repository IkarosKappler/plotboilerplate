/**
 * A script for testing the lib with three.js.
 *
 * @require PlotBoilerplate, Bounds, MouseHandler, gup, dat.gui, three.js
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
	    
	    
	    var textureImage = new Image();
	    textureImage.onload = function() {
		console.log('Texture loaded.');
		rebuild()
	    };
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		outlineSegmentCount   : 128,
		shapeSegmentCount     : 64,
		showNormals           : false,
		normalsLength         : 10.0,
		useTextureImage       : true,
		textureImage          : textureImage
	    }, GUP );

	    var dildoGeneration = new DildoGeneration('dildo-canvas');

	    
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
	    // | Create the outline: a Bézier path.
	    // +-------------------------------
	    var outline = BezierPath.fromJSON( DEFAULT_BEZIER_JSON );

	    
	    // +---------------------------------------------------------------------------------
	    // | Each outline vertex requires a drag (end) listener. Wee need this to update
	    // | the 3d mesh on changes.
	    // +-------------------------------
	    var dragListener = function( dragEvent ) {
		// Uhm, well, some curve point moved.
		rebuild();
	    };
	    /*
	    for( var i = 0; i < outline.bezierCurves.length; i++ ) {
		var curve = outline.bezierCurves[i];
		curve.startPoint.listeners.addDragEndListener( dragListener );
		curve.startControlPoint.listeners.addDragEndListener( dragListener );
		curve.endControlPoint.listeners.addDragEndListener( dragListener );
		if( i > 0 )
		    curve.startPoint.attr.bezierAutoAdjust = true;
		if( i+1 == outline.bezierCurves.length )
		    curve.endPoint.listeners.addDragEndListener( dragListener );
		    } */
	    var addPathListeners = function( path ) {
		BezierPathInteractionHelper.addPathVertexDragListeners( path, dragListener );
	    };
	    var removePathListeners = function( path ) {
		BezierPathInteractionHelper.removePathVertexDragListeners( path, dragListener );
	    };
	    addPathListeners( outline );
	    
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


	    pb.add( outline ); // This will trigger the first initial postDraw/draw/redraw call
	    
	    
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
	    

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
		gui.add(config, "outlineSegmentCount").min(3).max(512).onChange( function() { rebuild() } ).name('#outline').title('The number of segments on the outline.');
		gui.add(config, "shapeSegmentCount").min(3).max(256).onChange( function() { rebuild() } ).name('#shape').title('The number of segments on the shape.');
		gui.add(config, "showNormals").onChange( function() { rebuild() } ).name('Normals').title('Show the vertex normals.');
		gui.add(config, "normalsLength").min(1.0).max(20.0).onChange( function() { rebuild() } ).name('Normals length').title('The length of rendered normals.');
		gui.add(config, "useTextureImage").onChange( function() { rebuild() } ).name('Use texture').title('Use a texture image.');
	    }

	    pb.config.preDraw = preDraw;
	    pb.config.postDraw = postDraw;
	    pb.fitToView( scaleBounds(outline.getBounds(),1.6) );
	    rebuild();

	    textureImage.src = 'wood.png';
	    
	} );
    
})(window); 


