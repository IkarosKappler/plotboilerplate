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
	    

	    var step = 0.003;
	    

	    
	    // +---------------------------------------------------------------------------------
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
				   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
				 );
	    };

	    // +---------------------------------------------------------------------------------
	    // | Add some elements to draw (demo).
	    // +-------------------------------
	    var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/2.5;
	    var radius   = diameter*0.5;
	    var hypo     = Math.sqrt( radius*radius*2 );

	

	    // +---------------------------------------------------------------------------------
	    // | Add a circular bezier path.
	    // +-------------------------------
	    var numCurves = 3;
	    var bpath = [];	    
	    for( var i = 0; i < numCurves; i++ ) {
		bpath[i] = [ randomVertex(), randomVertex(), randomVertex(), randomVertex() ];
	    }
	    
	    var path = BezierPath.fromArray( bpath );
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

	    
	    // On each mouse move:
	    // find the closest curve point to the mouse position.
	    pb.canvas.addEventListener('mousemove', function(e) {
		var point = pb.transformMousePosition( e.clientX - pb.canvas.offsetLeft,
						       e.clientY - pb.canvas.offsetTop );
		line.b.x = point.x;
		line.b.y = point.y;
		var t = path.getClosestT( point );
		var closestPoint = path.getPointAt( t );
		line.a.x = closestPoint.x;
		line.a.y = closestPoint.y;
		pb.redraw();
	    } );


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


