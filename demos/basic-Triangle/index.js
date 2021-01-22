/**
 * A script for demonstrating the basic usage of the Triangle class.
 *
 * @requires PlotBoilerplate, gup, dat.gui, 
 * 
 * @author   Ikaros Kappler
 * @date     2020-05-18
 * @version  1.0.0
 **/


(function(_context) {
    "use strict";

    // Fetch the GET params
    let GUP = gup();

    window.addEventListener(
	'load',
	function() {
	    // All config params except the canvas are optional.
	    var pb = new PlotBoilerplate(
		PlotBoilerplate.utils.safeMergeByKeys(
		    { canvas                : document.getElementById('my-canvas'),					    
		      fullSize              : true
		    }, GUP
		)
	    );

	    // Create three new vertices
	    var a = new Vertex( -100,  86.6025 );
	    var b = new Vertex(  100,  86.6025 );
	    var c = new Vertex(    0, -86.6025 );

	    // Create the triangle from that three vetices
	    var triangle = new Triangle( a, b, c );

	    // Now add it to your canvas
	    pb.add( triangle );

	    // Note: the triangle's points are draggable now :)

	    
	    // Want to display the incircle?
	    pb.config.postDraw = function() {
		var circumcircle = triangle.getCircumcircle();
		var incircle = triangle.getIncircle();
		pb.draw.circle( circumcircle.center, circumcircle.radius, 'rgba(0,192,128,0.5)', 1.0 );
		pb.fill.circle( incircle.center, incircle.radius, 'rgba(128,128,128,0.333)' );
	    };
	    pb.redraw();
	} );
    
})(window); 
