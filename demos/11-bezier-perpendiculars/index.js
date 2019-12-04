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
		      drawBezierHandleLines  : false,
		      drawBezierHandlePoints : false, 
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
		animate               : true
	    }, GUP );
	    

	    var step = 0.005;
	    var redraw = function() {
		var vec = new Vector();
		var t = 0.0;
		while( t <= 1.0 ) {
		    vec.a = path.getPointAt(t);
		    vec.b = path.getPerpendicularAt(t);
		    // The perpendicular (vec.b) is relative. Make absolute.
		    vec.b.add( vec.a );
		    // And scale down a bit. It might be pretty long. Not that long is bad, but
		    // it might be a bit unhandy here.
		    vec.scale( 0.1 );   
		    pb.draw.line( vec.a, vec.b, 'rgba(0,108,192,0.75)' );
		    vec.inv().scale(0.333);
		    pb.draw.line( vec.a, vec.b, 'rgba(255,108,32,1.0)' );
		    t += step;
		}
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
	    var numCurves = 2;
	    var bpath = [];
	    var animatableVertices = [];	    
	    for( var i = 0; i < numCurves; i++ ) {
		bpath[i] = [ randomVertex(), randomVertex(), randomVertex(), randomVertex() ];
		animatableVertices.push( bpath[i][0] ); // start point
		animatableVertices.push( bpath[i][1] ); // end point
		animatableVertices.push( bpath[i][2] ); // start control point
		// Do not add the end control point here. It will be animated corresponding to
		// the succeeding path curve (to keep the path smooth)
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
		//f0.add(config, 'animationType', { Linear: 'linear', Radial : 'radial' } ).onChange( function() { toggleAnimation(); } );
		f0.open();
		
		if( config.animate )
		    toggleAnimation();
	    }
	    
	} );
    
})(window); 


