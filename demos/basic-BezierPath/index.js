/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui, 
 * 
 * @author   Ikaros Kappler
 * @date     2019-02-06
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
	        
	    var pathPoints = [
		[ new Vertex( -300, 0 ),
		  new Vertex(    0, 0 ),
		  new Vertex( -200, -200 ),
		  new Vertex( -100, -200 )
		],
		[ new Vertex(    0, 0 ),
		  new Vertex(  300, 0 ),
		  new Vertex(  100, 200 ),
		  new Vertex(  200, 200 )
		]
	    ];
	    var path = BezierPath.fromArray( pathPoints );
	    pb.add( path );

	} );
    
})(window); 
