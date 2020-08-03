/**
 * A demo to show thsi minmal distance between a point and Bézier path.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, draw
 * 
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2020-07-24
 * @version     1.0.0
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
		    { canvas                 : document.getElementById('my-canvas'),					    
		      fullSize               : true,
		      fitToParent            : true,
		      scaleX                 : 1.0,
		      scaleY                 : 1.0,
		      rasterGrid             : true,
		      drawOrigin             : false,
		      rasterAdjustFactor     : 2.0,
		      redrawOnResize         : true,
		      defaultCanvasWidth     : 1024,
		      defaultCanvasHeight    : 768,
		      canvasWidthFactor      : 1.0,
		      canvasHeightFactor     : 1.0,
		      cssScaleX              : 1.0,
		      cssScaleY              : 1.0,
		      drawBezierHandleLines  : true,
		      drawBezierHandlePoints : true, 
		      cssUniformScale        : true,
		      autoAdjustOffset       : true,
		      offsetAdjustXPercent   : 50,
		      offsetAdjustYPercent   : 50,
		      backgroundColor        : '#fff',
		      enableMouse            : true,
		      enableTouch            : true,
		      enableKeys             : true
		    }, GUP
		)
	    );

	    var line = null; // new Line( new Vertex(0,0), new Vertex(0,0) );
	    var t = 0.0;

	    pb.config.postDraw = function() {
		// The connecting line might be null if mouse/touch pointer is out of bounds.
		if( line ) {
		    // Draw the line connecting the mouse/touch position with the closest curve point.
		    pb.draw.line( line.a, line.b, 'rgb(255,192,0)', 2 );
		    pb.fill.circleHandle( line.a, 3.0, 'rgb(255,192,0)' );
		}
	    };


	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		// additional attributes here
	    }, GUP );
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
				   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
				 );
	    };
	    

	    // +---------------------------------------------------------------------------------
	    // | Add some bezier paths.
	    // +-------------------------------
	    var paths = [];
	    var numPaths = 2;
	    for( var p = 0; p < numPaths; p++ ) {
		var numCurves = 3;
		var bpath = [];	    
		for( var i = 0; i < numCurves; i++ ) {
		    // 0: startPoint
		    // 1: endPoint
		    // 2: startControlPoint
		    // 3: endControlPoint
		    bpath[i] = [ randomVertex(), randomVertex(), randomVertex(), randomVertex() ];
		}
		var path = BezierPath.fromArray( bpath );
		// addPath( path );
		paths.push( path );
	    }
	    pb.add( paths );

	    var i = 0;
	    new BezierPathInteractionHelper(
		pb,
		paths,
		{
		    maxDetectDistance : 32.0,
		    autoAdjustPaths : true,
		    allowPathRemoval : true,
		    onPointerMoved : function(pathIndex,newA,newB,newT) {
			if( pathIndex == -1 ) {
			    line = null;
			} else {
			    line = new Line( newA, newB );
			    t = newT;
			}
		    },
		    onVertexInserted : function(pathIndex,insertAfterIndex,newPath,oldPath) {
			console.log('[pathIndex='+pathIndex+'] Vertex inserted after '+ insertAfterIndex );
		    },
		    onVerticesDeleted : function(pathIndex,deletedVertIndices,newPath,oldPath) {
			console.log('[pathIndex='+pathIndex+'] vertices deleted', deletedVertIndices );
		    },
		    onPathDeleted : function(pathIndex,oldPath) {
			console.log('[pathIndex='+pathIndex+'] path deleted' );
		    }
		}
	    );
	    
	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
	    }
	    
	} );
    
})(window); 


