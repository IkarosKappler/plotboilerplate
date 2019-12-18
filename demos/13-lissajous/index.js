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
		      drawOrigin             : false,
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
		      backgroundColor        : '#fff',
		      enableMouse            : true,
		      enableTouch            : true,
		      enableKeys             : true,
		      enableGL               : false // experimental
		    }, GUP
		)
	    );

	    if( typeof humane != 'undefined' )
		humane.log("Click, hold and drag your mouse or click 'animate' in the controls.");

	    pb.config.postDraw = function() {
		redraw();
	    };


	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		offsetA               : 0.0,
		offsetB               : 0.0,
		phaseA                : 2, // 0.0, // 2.0,
		phaseB                : 3, // 0.0, // 3.0,
		stepSize              : 0.1,
		closeGap              : true,
		animate               : false
	    }, GUP );
	    

	    
	    // +---------------------------------------------------------------------------------
	    // | This is the part where the Bézier magic happens
	    // +-------------------------------
	    var step = 0.003;
	    var t = 0.0;
	    var redraw = function() {

		//var a = 2, b = 3, c= 0.3;
		
		function lissajous(a, b, c) {
		    var str = "M";
		    let dt  = c;
		    var polyLine = [];
		    let offsetA = config.offsetA;
		    let offsetB = config.offsetB;
		    let pA = new Vertex(0,0);

		    for (var t = 0; t <= 2*Math.PI; t += dt) {

			let x = Math.sin(a*t);
			let y = Math.sin(b*t);
			
			pA.set( 10+200.*x, 10-(200.*y) );
			polyLine.push( pA.clone() );
	
		    }
		    pb.draw.polyline( polyLine, config.drawGap, 'rgba(192,0,192,0.333)' );
		    let x1=0; let y1=0;
		    let dx1=a; let dy1=b;
		    pA.set(offsetA + a*dt, offsetB + b*dt);
		    let pB = new Vertex(0,0);
		    let x2, y2, dx2, dy2, det, x3, y3;
		    var i = 0;
		    for (var t=dt; t <= 2*Math.PI+2*dt; t += dt) {
			x2 = Math.sin(offsetA + a*t); // + Math.cos(offsetB + b*t);
			y2 = Math.sin(offsetB + b*t); //  + Math.cos(offsetA + a*t);
			dx2 = a*Math.cos(offsetA + a*t); // + b*Math.sin(offsetB + b*t);
			dy2 = b*Math.cos(offsetB + b*t); // + a*Math.sin(offsetA + a*t);
			det = dx1*dy2-dy1*dx2;
			if (Math.abs(det)>0.1) {
			    x3=((x2*dy2-y2*dx2)*dx1-(x1*dy1-y1*dx1)*dx2)/det;
			    y3=((x2*dy2-y2*dx2)*dy1-(x1*dy1-y1*dx1)*dy2)/det;
			    //str+= "Q" + (250. + 200.*x3) + " " + (250. - 200.*y3) + " " + (250. + 200.*x2) + " " +(250. - 200.*y2)
			    pB.set( (200.*x2), (-200.*y2) );
			    if( i > 0 )
				pb.draw.quadraticBezier( pA, new Vertex((200.*x3), (-200.*y3)), pB, 'rgba(0,108,255,1.0)', 1 ); 
			} else {
			    //str+= "L" + (250. + 200.*x2) + " " + (250. - 200.*y2)
			    pB.set( 200.*x2, -200.*y2 );
			    if( i > 0 )
				pb.draw.line( pA, pB, 'rgba(0,192,192,0.8)' );
			};
			x1=x2;
			y1=y2;
			dx1=dx2;
			dy1=dy2;
			pA.set( pB );
			i++;
		    }
		    
		}
		function Coeffs() {
		    let a = config.phaseA;
		    let b = config.phaseB;
		    let c = config.stepSize; 
		    lissajous(a, b, c)
		}

		Coeffs();
		
		t+=step;
		if( t >= 1.0 )
		    t = 0.0; // Reset t after each rendering loop
	    };
	    

	   

	    // +---------------------------------------------------------------------------------
	    // | Add some elements to draw (demo).
	    // +-------------------------------
	    var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/2.5;
	    var radius   = diameter*0.5;
	    var hypo     = Math.sqrt( radius*radius*2 );

	
	    var renderLoop = function(time) {
		pb.redraw();
		window.requestAnimationFrame( renderLoop );
	    }
	    renderLoop();


	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
		var f0 = gui.addFolder('Points');
		f0.add(config, 'offsetA').onChange( function() { pb.redraw(); } ).min(-Math.PI).max(Math.PI).step(0.01).listen().title("Offset A.");
		//f0.add(config, 'offsetB').onChange( function() { pb.redraw(); } ).min(-Math.PI).max(Math.PI).step(0.1).listen().title("Offset B.");
		f0.add(config, 'phaseA').onChange( function() { pb.redraw(); } ).min(1).max(10).step(1).listen().title("The first phase.");
		f0.add(config, 'phaseB').onChange( function() { pb.redraw(); } ).min(1).max(10).step(1).listen().title("The second phase.");
		f0.add(config, 'stepSize').onChange( function() { pb.redraw(); } ).min(0.05).max(1.0).step(0.05).listen().title("The second phase.");
		f0.add(config, 'closeGap').onChange( function() { pb.redraw(); } ).listen().title("Close the draw gap between begin and and of curve.");
		//f0.add(config, 'animate').onChange( toggleAnimation ).title("Toggle point animation on/off.");
		f0.open();
		
		//if( config.animate )
		//    toggleAnimation();
	    }
	    
	} );
    
})(window); 


