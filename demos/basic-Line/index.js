/**
 * A script for demonstrating the basic usage of the Line class.
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

	    // Create two new vertices
	    var vert_a = new Vertex( 50, 50 );
	    var vert_b = new Vertex( -50, -50 );

	    // Create the line
	    var line = new Line( vert_a, vert_b );

	    // Now add it to your canvas
	    pb.add( line );

	    // Note: the line's end points are draggable now :)

	} );
    
})(window); 
