/**
 * A demo to show Bézier perpendiculars.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, draw
 * 
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2018-11-22
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
		      drawOrigin             : true,
		      rasterAdjustFactor     : 2.0,
		      redrawOnResize         : true,
		      defaultCanvasWidth     : 1024,
		      defaultCanvasHeight    : 768,
		      canvasWidthFactor      : 1.0,
		      canvasHeightFactor     : 1.0,
		      cssScaleX              : 1.0,
		      cssScaleY              : 1.0,
		      drawBezierHandleLines  : true, // false,
		      drawBezierHandlePoints : true, // false, 
		      cssUniformScale        : true,
		      autoAdjustOffset       : true,
		      offsetAdjustXPercent   : 50,
		      offsetAdjustYPercent   : 50,
		      backgroundColor        : '#000',
		      enableMouse            : true,
		      enableTouch            : true,
		      enableKeys             : true,
		      enableGL               : false // experimental
		    }, GUP
		)
	    );

	    pb.drawConfig.bezier.handleLine.color = 'rgba(180,180,180,0.25)';

	    if( typeof humane != 'undefined' )
		humane.log("Click, hold and drag your mouse or click 'animate' in the controls.");

	    pb.config.postDraw = function() {
		// In this demo the PlotBoilerplate only draws the vertices.
		// Everything else is drawn by this script, with the help of some PB functions.
		path.updateArcLengths();
		// Adjust all bezier control points to keep the path smooth
		for( var i in path.bezierCurves ) {
		    path.adjustPredecessorControlPoint(i,false,true);
		}
		redraw();
	    };


	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		animate               : false
	    }, GUP );
	    

	    
	    // +---------------------------------------------------------------------------------
	    // | This is the part where the Bézier magic happens
	    // +-------------------------------
	    var step = 0.003;
	    var t = 0.0;
	    var redraw = function() {
		// Each redraw loop determines the current start vector and the current
		// end vector on the curve.
		var startVec = new Vector(
		    path.bezierCurves[0].getPointAt(0),
		    path.bezierCurves[0].getTangentAt(0)
		);
		var endVec = new Vector(
		    path.bezierCurves[0].getPointAt(t),
		    path.bezierCurves[0].getTangentAt(t).inv()
		);

		// Tangents are relative. Make absolute.
		startVec.b.add( startVec.a )
		endVec.b.add( endVec.a );

		// This 'splits' the curve at the given point at t.
		startVec.scale(0.33333333*t);
		endVec.scale(0.33333333*t);

		// Draw the bezier curve
		pb.draw.cubicBezier( startVec.a, endVec.a, startVec.b, endVec.b, '#8800ff', 2 );
		// And for better visualization draw the fake control handles (=the tangents).
		pb.draw.line( startVec.a, startVec.b, '#a8a800', 1 );
		pb.draw.line( endVec.a, endVec.b, '#a8a800', 1 );
		// And draw the current position on the curve as a grey point.
		pb.fill.circle( endVec.a, 3, 'rgba(255,255,255,0.5)' );

		t+=step;
		if( t >= 1.0 )
		    t = 0.0; // Reset t after each rendering loop
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
	    // | Add some elements to draw (demo).
	    // +-------------------------------
	    var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/2.5;
	    var radius   = diameter*0.5;
	    var hypo     = Math.sqrt( radius*radius*2 );

	

	    // +---------------------------------------------------------------------------------
	    // | Add a circular connected bezier path.
	    // +-------------------------------
	    var numCurves = 1;
	    var bpath = [];
	    var animatableVertices = [];	    
	    for( var i = 0; i < numCurves; i++ ) {
		bpath[i] = [ randomVertex(), randomVertex(), randomVertex(), randomVertex() ];
		animatableVertices.push( bpath[i][0] ); // start point
		animatableVertices.push( bpath[i][1] ); // end point
		animatableVertices.push( bpath[i][2] ); // start control point
		// Do not add the end control point here if there are more than one curve. It will
		// be animated corresponding to the succeeding path curve (to keep the path smooth).
		if( numCurves == 1 )
		    animatableVertices.push( bpath[i][3] ); // end control point
	    }
	    
	    var path = BezierPath.fromArray( bpath );
	    pb.add( path );


	    // Animate the vertices: make them bounce around and reflect on the walls.
	    var animator = null;
	    var toggleAnimation = function() {
		if( config.animate ) {
		    if( animator )
			animator.stop();
		    if( config.animationType=='radial' )
			animator = new CircularVertexAnimator( animatableVertices, pb.viewport(), function() { pb.redraw(); } );
		    else // 'linear'
			animator = new LinearVertexAnimator( animatableVertices, pb.viewport(), function() { pb.redraw(); } );
		    animator.start();
		} else {
		    animator.stop();
		    animator = null;
		}
	    };

	    /**
	     * Unfortunately the animator is not smart, so we have to create a new
	     * one (and stop the old one) each time the vertex count changes.
	     **/
	    var updateAnimator = function() {
		if( !animator )
		    return;
		animator.stop();
		animator = null;
		toggleAnimation(); 
	    };



	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
		var f0 = gui.addFolder('Points');
		f0.add(config, 'animate').onChange( toggleAnimation ).title("Toggle point animation on/off.");
		f0.open();
		
		if( config.animate )
		    toggleAnimation();
	    }
	    
	} );
    
})(window); 


