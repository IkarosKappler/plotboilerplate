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

	    var line = new Line( new Vertex(0,0), new Vertex(0,0) );
	    var t = 0.0;

	    pb.config.postDraw = function() {
		// Draw the line connecting the mouse position with the closest curve point.
		pb.draw.line( line.a, line.b, 'rgb(255,192,0)', 2 );
		pb.fill.circleHandle( line.a, 3.0, 'rgb(255,192,0)' );
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
	    // | A helper function for properly adding paths to the canvas.
	    // +-------------------------------
	    /*var addPath = function( path ) {
		for( var i = 0; i < path.bezierCurves.length; i++ ) {
		    var curve = path.bezierCurves[i];
		    path.adjustPredecessorControlPoint( i,     
							true,  // obtainHandleLength
							false   // updateArcLength  (we will do this after the loop)
						      );
		    if( i > 0 )
			curve.startPoint.attr.bezierAutoAdjust = true;

		    // Add listeners to the curve points to re-calculate the min distance
		    // on changes.
		    curve.startPoint.listeners.addDragListener( updateMinDistance );
		    curve.startControlPoint.listeners.addDragListener( updateMinDistance );
		    curve.endControlPoint.listeners.addDragListener( updateMinDistance );
		    if( i+1 == path.bezierCurves.length )
			curve.endPoint.listeners.addDragListener( updateMinDistance ); 
		} 
		path.updateArcLengths(); 
		BezierPathInteractionHelper.setPathAutoAdjust( path );
		pb.add( path );
	    } */

	    
	    // +---------------------------------------------------------------------------------
	    // | Handle any move event (mouse or touch) if there are no dragged elements involved.
	    // +-------------------------------
	    /* var handleMoveEvent = function(posX,posY) {
		var point = pb.transformMousePosition( posX, 
						       posY );
		line.b.x = point.x;
		line.b.y = point.y;
		updateMinDistance();
	    }; */

	    
	    // +---------------------------------------------------------------------------------
	    // | Update the min distance from point `line.b` to the curve. And redraw.
	    // +-------------------------------
	    /* var updateMinDistance = function() {
		t = path.getClosestT( line.b ); // point );
		var closestPoint = path.getPointAt( t );
		line.a.x = closestPoint.x;
		line.a.y = closestPoint.y;
		pb.redraw();
	    }; */

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
	    new BezierPathInteractionHelper( pb, paths, function(newA,newB,newT,_pathIndex) {
		// console.log('min dist changed');
		t = newT;
		line.a.set( newA );
		line.b.set( newB );
	    } );
	    
	    // var draggedVertex 
	    /* new AlloyFinger( pb.canvas, {
		touchMove: function (e) {
		    if( pb.getDraggedElementCount() == 0 && e.touches.length > 0 ) {
			handleMoveEvent( e.touches[0].clientX, e.touches[0].clientY );
		    }
		}
	    } );
	    new MouseHandler(pb.canvas)
		.up( function(e) {
		    if( e.params.wasDragged )
			return;
		    console.log('Clicked', e.params.wasDragged);
		    var vertex = pb.getVertexNear( e.params.pos, // pb.transformMousePosition(e.params.pos.x,e.params.pos.y),
						   PlotBoilerplate.DEFAULT_CLICK_TOLERANCE
						 );
		    console.log( 'Vertex', vertex );
		    if( vertex )
			return;
		    // Check if there is already a path point at the given split position
		    var pathPoint = path.getPointAt(t)
		    var pointNear = pb.getVertexNear( pb.revertMousePosition(pathPoint.x,pathPoint.y), 6.0 );
		    console.log( "pathPoint", pathPoint, pointNear );
		    if( pointNear ) {
			for( var i = 0; i < path.bezierCurves.length; i++ ) {
			    if( path.bezierCurves[i].startPoint.distance(pointNear) <= 6.0 || path.bezierCurves[i].endPoint.distance(pointNear) <= 6.0 ) {
				console.log("There is already a path point near this position.");
				return;
			    }
			}
		    }
		    console.log('Inserting vertex at', t );
		    var leftPath = path.getSubPathAt( 0.0, t );
		    var rightPath = path.getSubPathAt( t, 1.0 );
		    var newCurves = [];
		    for( var i = 0; i < leftPath.bezierCurves.length; i++ ) {
			newCurves.push( leftPath.bezierCurves[i] );		
		    }
		    for( var i = 0; i < rightPath.bezierCurves.length; i++ ) {
			newCurves.push( rightPath.bezierCurves[i] );		
		    }
		    pb.remove( path, false, true ); // Remove with vertices
		    path = BezierPath.fromArray( newCurves );
		    addPath( path );
		})
		.move( function(e) {
		    // console.log('moved');
		    if( pb.getDraggedElementCount() == 0 )
			handleMoveEvent( e.params.pos.x, e.params.pos.y );
		} );

	    new KeyHandler( { trackAll : true } )
		.down('delete',function() {
		    console.log('delete');
		    var newCurves = [ ];
		    // Find first non-selected path point
		    var curveIndex = 0;
		    while( curveIndex < path.bezierCurves.length && path.bezierCurves[curveIndex].startPoint.attr.isSelected ) {
			curveIndex++;
		    }
		    // Only keep those curves that have no selected path point (=delete selected)
		    var curStart = path.bezierCurves[curveIndex].startPoint;
		    var curStartControl = path.bezierCurves[curveIndex].startControlPoint;
		    for( var i = curveIndex; i < path.bezierCurves.length; i++ ) {
			if( !path.bezierCurves[i].endPoint.attr.isSelected ) {
			    newCurves.push( [ curStart.clone(),
					      path.bezierCurves[i].endPoint.clone(),
					      curStartControl.clone(),
					      path.bezierCurves[i].endControlPoint.clone() ] );
			    curStart = path.bezierCurves[i].endPoint;
			    curStartControl = path.bezierCurves[i].endControlPoint;
			}
		    }
		    // Do not remove the whole path
		    if( newCurves.length != 0 ) {
			pb.remove( path, false, true ); // Remove with vertices
			path = BezierPath.fromArray( newCurves );
			addPath( path );
		    }
		} );
	    */

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
	    }
	    
	} );
    
})(window); 


