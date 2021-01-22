/**
 * A script for demonstrating the basic usage of the Circle class.
 *
 * @requires PlotBoilerplate, gup, dat.gui, 
 * 
 * @author   Ikaros Kappler
 * @date     2020-12-18
 * @modified 2021-01-22 Added the circle sector helper.
 * @version  1.1.0
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

	    // Create center vertex and radius (a non-negative number)
	    var center = new Vertex( 10, 10 );
	    var radius = 150;

	    // Create the circle
	    var circle = new Circle( center, radius );

	    // Now create a sector from the circle
	    var startAngle   = Math.PI*0.3; // in radians
	    var endAngle     = Math.PI*1.6;
	    var circleSector = new CircleSector( circle, startAngle, endAngle );

	    // Now add the sector to your canvas
	    pb.add( circleSector );

	    // Note: the center point is draggable now :)


	    
	    // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
	    var controlPointA = circleSector.circle.vertAt( circleSector.startAngle );
	    var controlPointB = circleSector.circle.vertAt( circleSector.endAngle );
	    new CircleSectorHelper( circleSector, controlPointA, controlPointB, pb );
	    pb.add( [controlPointA, controlPointB] );
	} );
    
})(window); 
