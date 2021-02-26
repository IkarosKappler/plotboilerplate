/**
 * A script for demonstrating the basic usage of the VEllipseSector class.
 *
 * @requires PlotBoilerplate, gup, dat.gui, 
 * 
 * @author   Ikaros Kappler
 * @date     2021-02-24
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

	    // Create center vertex and radius (a non-negative number)
	    var center = new Vertex( 10, 10 );
	    var radiusH = 150;
	    var radiusV = 200;
	    var _medRadius = ((radiusH+radiusV)/2)*0.5;
	    var _circle = new Circle( center, _medRadius );
	    pb.add( _circle );

	    // Create the ellipse
	    var ellipse = new VEllipse( center, new Vertex(center.x+radiusH, center.y+radiusV) );

	    // Now create a sector from the circle
	    var startAngle    = 12 / 180 * Math.PI; // Math.PI*0.3; // in radians
	    var endAngle      = 89 / 180 * Math.PI; // Math.PI*1.6;
	    console.log('Initial: startAngle', startAngle, 'endAngle', endAngle );
	    var ellipseSector = new VEllipseSector( ellipse, startAngle, endAngle );

	    var startControlPoint = ellipse.vertAt( startAngle ); //  new Vertex( ellipse.center.x + radiusH,  ellipse.center.y );
	    var endControlPoint = ellipse.vertAt( endAngle ); // new Vertex( ellipse.center.x,  ellipse.center.y + radiusV );

	    // Now add the sector to your canvas
	    pb.add( ellipse ); // circleSector );
	    pb.add( [startControlPoint, endControlPoint] );

	    var startControlLine = new Line( ellipse.center, startControlPoint );
	    var endControlLine = new Line( ellipse.center, endControlPoint );


	    startControlPoint.listeners.addDragListener( function(event) {
	//	pb.redraw();
		
	    } );

	    
	    // https://stackoverflow.com/questions/4633177/c-how-to-wrap-a-float-to-the-interval-pi-pi
	    var wrapMax = function( x, max ) {
		/* integer math: `(max + x % max) % max` */
		// return fmod(max + fmod(x, max), max);
		return (max + (x%max)) % max;
	    };

	    var wrapMinMax = function( x, min, max ) {		
		// return min + wrapMax(x - min, max - min);
		return min + wrapMax( x - min, max -min );
	    };

	    pb.config.postDraw = function() {
		// console.log('postDraw');
		pb.draw.line( startControlLine.a, startControlLine.b, 'rgba(128,128,128,0.5)', 1.0 );
		pb.draw.line( endControlLine.a, endControlLine.b, 'rgba(128,128,128,0.5)', 1.0 );

		var newStartAngle = startControlLine.angle();
		var newEndAngle = endControlLine.angle();
		// console.log( "newStartAngle", newStartAngle, "newEndAngle", newEndAngle );

		newStartAngle = wrapMax( newStartAngle, Math.PI*2 );
		newEndAngle = wrapMax( newEndAngle, Math.PI*2 );
		// if( newStartAngle < 0 ) newStartAngle = newStartAngle+Math.PI*2;
		// if( newEndAngle < 0 ) newEndAngle = newEndAngle+Math.PI*2;

		var newStartPoint = ellipse.vertAt( newStartAngle );
		var newEndPoint = ellipse.vertAt( newEndAngle );

		// console.log( "newStartPoint", newStartPoint );
		pb.draw.diamondHandle( newStartPoint, 7, 'rgba(128,64,128,0.5)' );
		pb.draw.diamondHandle( newEndPoint, 7, 'rgba(128,64,128,0.5)' );

		// Draw the arc
		var pathData =
		    VEllipseSector.ellipseSectorUtils.describeSVGArc(
			ellipse.center.x, ellipse.center.y,
			ellipse.radiusH(), ellipse.radiusV(), // radiusH, radiusV,
			newStartAngle, newEndAngle,
			{ moveToStart : true } );
		pb.draw.path( pathData, 'rgba(255,0,0,0.5)', 1 );

		// Draw labels (start/end)
		pb.fill.text( "start", newStartPoint.x, newStartPoint.y  ); // , 0, 'black' );
		pb.fill.text( "end", newEndPoint.x, newEndPoint.y ); // , 0, 'black' );

		drawCircleStuff( newStartAngle, newEndAngle );
	    };
	  
	    var drawCircleStuff = function(newStartAngle,newEndAngle) {
		var a = _circle.vertAt(newStartAngle);
		var b = _circle.vertAt(newEndAngle);
		pb.draw.diamondHandle( a, 7, 'rgba(128,64,128,0.5)' );
		pb.draw.diamondHandle( b, 7, 'rgba(128,64,128,0.5)' );

		var sector = CircleSector.circleSectorUtils.describeSVGArc( _circle.center.x, _circle.center.y, _circle.radius, newStartAngle, newEndAngle );
		pb.draw.path( sector, 'rgba(255,0,0,0.5)', 1 );
	    };

	    pb.redraw();
	    
	    // Further: add a circle sector helper to edit angles and radius manually (mouse or touch)
	    /* var controlPointA = circleSector.circle.vertAt( circleSector.startAngle );
	    var controlPointB = circleSector.circle.vertAt( circleSector.endAngle );
	    new CircleSectorHelper( circleSector, controlPointA, controlPointB, pb );
	    pb.add( [controlPointA, controlPointB] );
	    */
	} );
    
})(window); 
