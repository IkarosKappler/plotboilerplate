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
		pb.draw.line( line.a, line.b, 'rgb(255,192,0)', 2 );
		pb.fill.circleHandle( line.a, 3.0, 'rgb(255,192,0)' );
	    };


	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		animate               : false
	    }, GUP );
	    

	    // var step = 0.003;
	    

	    
	    // +---------------------------------------------------------------------------------
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
				   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
				 );
	    };
	    

	    var addPath = function( path ) {
		for( var i = 0; i < path.bezierCurves.length; i++ ) {
		    var curve = path.bezierCurves[i];
		    if( i > 0 )
			curve.startPoint.attr.bezierAutoAdjust = true;
		    path.adjustPredecessorControlPoint( i,     
							true,  // obtainHandleLength
							false   // updateArcLength  (we will do this after the loop)
						      );
		}
		path.updateArcLengths();
		pb.add( path );
	    }

	    // +---------------------------------------------------------------------------------
	    // | Add a circular bezier path.
	    // +-------------------------------
	    var numCurves = 3;
	    var bpath = [];	    
	    for( var i = 0; i < numCurves; i++ ) {
		bpath[i] = [ randomVertex(), randomVertex(), randomVertex(), randomVertex() ];
	    }
	    var path = BezierPath.fromArray( bpath );
	    addPath( path );
	    
	    // On each mouse move:
	    // find the closest curve point to the mouse position.
	    pb.canvas.addEventListener('mousemove', function(e) {
		var point = pb.transformMousePosition( e.clientX - pb.canvas.offsetLeft,
						       e.clientY - pb.canvas.offsetTop );
		line.b.x = point.x;
		line.b.y = point.y;
		t = path.getClosestT( point );
		var closestPoint = path.getPointAt( t );
		line.a.x = closestPoint.x;
		line.a.y = closestPoint.y;
		pb.redraw();
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
		});

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
		//var f0 = gui.addFolder('Points');
		//f0.open();

	    }
	    
	} );
    
})(window); 


