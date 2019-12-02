/**
 * The tween test script of the generic plotter.
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

	    
	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    pb.createGUI(); 
	    // END init dat.gui
	    

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
	    var bpath = [];
	    fract *= 0.66;
	    bpath[0] = [ new Vertex( 0, -diameter ),
			  new Vertex( diameter, 0 ),
			  new Vertex( diameter*fract, -diameter ),
			  new Vertex( diameter, -diameter*fract ) ];
	    bpath[1] = [ bpath[0][1].clone(), // Use same reference
			  new Vertex( 0, diameter ),
			  new Vertex( diameter, diameter*fract ),
			  new Vertex( diameter*fract, diameter ) ];
	    bpath[2] = [  bpath[1][1].clone(), // Use same reference
			  new Vertex( -diameter, 0 ),
			  new Vertex( -diameter*fract, diameter ),
			  new Vertex( -diameter, diameter*fract ) ];
	    bpath[3] = [ bpath[2][1].clone(), // Use same reference
			 bpath[0][0].clone(), // Use same reference
			  new Vertex( -diameter, -diameter*fract ),
			  new Vertex( -diameter*fract, -diameter )
			]; 
	    // Construct
	    var path = BezierPath.fromArray( bpath );
	    for( var i in path.bezierCurves ) {
		// Set un-draggable and un-selectable
		path.bezierCurves[i].startPoint.attr.selectable = path.bezierCurves[i].startPoint.attr.draggable = false;
		path.bezierCurves[i].endPoint.attr.selectable = path.bezierCurves[i].endPoint.attr.draggable = false;
		path.bezierCurves[i].startControlPoint.attr.selectable = path.bezierCurves[i].startControlPoint.attr.draggable = false;
		path.bezierCurves[i].endControlPoint.attr.selectable = path.bezierCurves[i].endControlPoint.attr.draggable = false;
	    }
	    pb.add( path );

	    const timeline = new TimelineMax( {delay:0.5, repeat:-1, repeatDelay:0.0, onUpdate:function(){pb.redraw();} } );
	    // Map point to other points locations.
	    const map      = { 0 : 0,   1 : 1,   2 : 3,   3 : 2   };
	    // Define different scale factors for different points.
	    const scale    = { 0 : 1.0, 1 : 1.0, 2 : 0.2, 3 : 0.2 };
	    // Define different animation durations.
	    const duration = { 0 : 4.0, 1 : 4.0, 2 : 3.0, 3 : 3.0 };
	    for( var i = 0; i < bpath.length; i++ ) {
		for( var e = 0; e < 4; e++ ) {
		    timeline
			.fromTo( bpath[i][e],
				 duration[e],
				 { x : bpath[i][e].x, y : bpath[i][e].y },
				 { x : bpath[(i+2)%4][map[e]].x*scale[e], y : bpath[(i+2)%4][map[e]].y*scale[e], yoyo : true, repeat : 1, ease : Power2.easeInOut },
				 0 // i+4*e*0.1
			       );
		}
	    }
	    
	    
	} );
    
})(window); 


