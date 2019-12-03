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
		    { canvas                : document.getElementById('my-canvas'),					    
		      fullSize              : true,
		      fitToParent           : true,
		      scaleX                : 1.0,
		      scaleY                : 1.0,
		      rasterGrid            : true,
		      drawOrigin            : true,
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
		      backgroundColor       : '#000',
		      enableMouse           : true,
		      enableTouch           : true,
		      enableKeys            : true,
		      enableGL              : false // experimental
		    }, GUP
		)
	    );


	    pb.config.postDraw = function() {
		// In this demo the PlotBoilerplate only draws the vertices.
		// Everything else is drawn by this script, with the help of some PB functions.
		path.updateArcLengths();
		redraw();
	    };


	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		animate               : false
	    }, GUP );
	    

	    var step = 0.01;
	    var redraw = function() {
		var vec = new Vector();
		
		var t = 0.0;
		while( t <= 1.0 ) {
		    vec.a = path.bezierCurves[0].getPointAt(t);
		    vec.b = path.bezierCurves[0].getPerpendicularAt(t);
		    //vec.setLength(40);
		    //vec.b = path.getTangentAt(t);
		    vec.b.add( vec.a );
		    vec.scale( 0.1 ); // 100 ); // 0.05 );   
		    pb.draw.line( vec.a, vec.b );
		    t += step;
		}


		/*
		//var curve = new Bezier(100,25 , 10,90 , 110,100 , 150,195);
		var firstC = path.bezierCurves[0];
		var curve = new Bezier(
		    firstC.startPoint.x, firstC.startPoint.y,
		    firstC.startControlPoint.x, firstC.startControlPoint.y,
		    firstC.endControlPoint.x, firstC.endControlPoint.y,
		    firstC.endPoint.x, firstC.endPoint.y
		);
		var draw = function() {
		    //drawSkeleton(curve);
		    //drawCurve(curve);
		    //setColor("red");
		    var pt, nv, d=20;
		    for(var t=0; t<=1; t+=0.1) {
			var pt = curve.get(t);
			var nv = curve.normal(t);
			//drawLine(pt, { x: pt.x + d*nv.x, y: pt.y + d*nv.y} );
			pb.draw.line( pt, { x: pt.x + d*nv.x, y: pt.y + d*nv.y} );
		    }
		}
		draw();
		*/


		/*
		var pDistance = 6; // px
		var i = 0;
		while( i*pDistance <= path.bezierCurves[0].getLength() ) {
		    var t             = (i*pDistance)/path.bezierCurves[0].getLength();
		    var point         = path.bezierCurves[0].getPointAt( t );
		    // Draw inner or outer perpendicular???
		    var perp = path.bezierCurves[0].getPerpendicularAt( t );
		    pb.draw.line( point, perp );
		    i++;
		}
		*/
		

		/*
		var u = 0.0;
		var step = path.totalArcLength/1000;
		while( u <= path.totalArcLength ) {
		    vec.a = path.getPoint(u);
		    vec.b = path.getPerpendicular(u);
		    vec.scale( 0.05 ); // 100 ); // 0.05 );
		    
		    pb.draw.line( vec.a, vec.b );

		    u += step;
		}
		*/
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
	    var fract = 0.5;
	    var bpath = [];
	    fract *= 0.66;
	    bpath[0] = [ randomVertex(), randomVertex(), randomVertex(), randomVertex() ];
	    var path = BezierPath.fromArray( bpath );

	    pb.add( path );




	    // Animate the vertices: make them bounce around and reflect on the walls.
	    var animator = null;
	    var toggleAnimation = function() {
		if( config.animate ) {
		    if( animator )
			animator.stop();
		    if( config.animationType=='radial' )
			animator = new CircularVertexAnimator( pb.vertices, pb.viewport(), function() { pb.redraw(); } );
		    else // 'linear'
			animator = new LinearVertexAnimator( pb.vertices, pb.viewport(), function() { pb.redraw(); } );
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


