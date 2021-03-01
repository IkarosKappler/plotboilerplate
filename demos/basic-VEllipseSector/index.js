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

	    var ROTATION_CONTROL_OFFSET = -Math.PI/2.0;
	    
	    // Create center vertex and radius (a non-negative number)
	    var center = new Vertex( 10, 10 );
	    var radiusH = 150;
	    var radiusV = 200;
	    var rotation = 0.0; // Math.PI/2; // 0.0;
	    var _medRadius = ((radiusH+radiusV)/2)*0.5;
	    var _circle = new Circle( center, _medRadius );
	    pb.add( _circle );

	    // Create the ellipse
	    var ellipse = new VEllipse( center, new Vertex(center.x+radiusH, center.y+radiusV) );

	    // Now create a sector from the circle
	    var startAngle    = 12 / 180 * Math.PI;
	    var endAngle      = 89 / 180 * Math.PI;
	    // console.log('Initial: startAngle', startAngle, 'endAngle', endAngle );
	    var ellipseSector = new VEllipseSector( ellipse, startAngle, endAngle );

	    var startControlPoint = ellipse.vertAt( startAngle );
	    var endControlPoint = ellipse.vertAt( endAngle );
	    var rotationControlPoint = ellipse.vertAt( rotation ).scale( 1.2, ellipse.center );
	    console.log( rotationControlPoint );

	    // Now add the sector to your canvas
	    pb.add( ellipse );
	    pb.add( [startControlPoint, endControlPoint] );
	    pb.add( rotationControlPoint );

	    var startControlLine = new Line( ellipse.center, startControlPoint );
	    var endControlLine = new Line( ellipse.center, endControlPoint );
	    var rotationControlLine = new Line( ellipse.center, rotationControlPoint );

	    ellipseSector.ellipse.center.listeners.addDragListener( function(event) {
		startControlPoint.add( event.params.dragAmount );
		endControlPoint.add( event.params.dragAmount );
		rotationControlPoint.add( event.params.dragAmount );
	    } );

	    rotationControlPoint.listeners.addDragListener( function(event) {
		var newRotation = rotationControlLine.angle();
		var rDiff = newRotation-rotation;
		// ellipse.axis.rotate( rDiff, ellipseSector.ellipse.center );
		startControlPoint.rotate( rDiff, ellipseSector.ellipse.center );
		endControlPoint.rotate( rDiff, ellipseSector.ellipse.center );
		rotation = newRotation;
		// console.log('newRotation', newRotation );
	    } );
	    
	    // https://stackoverflow.com/questions/4633177/c-how-to-wrap-a-float-to-the-interval-pi-pi
	    /* var wrapMax = function( x, max ) {
		return (max + (x%max)) % max;
	    };
	    var wrapMinMax = function( x, min, max ) {		
		return min + wrapMax( x - min, max -min );
		}; */

	    pb.config.postDraw = function() {
		pb.draw.line( startControlLine.a, startControlLine.b, 'rgba(128,128,128,0.5)', 1.0 );
		pb.draw.line( endControlLine.a, endControlLine.b, 'rgba(128,128,128,0.5)', 1.0 );
		pb.draw.line( rotationControlLine.a, rotationControlLine.b, 'rgba(128,128,255,0.5)', 1.0 );

		var newStartAngle = startControlLine.angle() - rotation;
		var newEndAngle = endControlLine.angle() - rotation;

		newStartAngle = geomutils.wrapMax( newStartAngle, Math.PI*2 );
		newEndAngle = geomutils.wrapMax( newEndAngle, Math.PI*2 );

		var newStartPoint = ellipse.vertAt( newStartAngle );
		var newEndPoint = ellipse.vertAt( newEndAngle );

		pb.draw.diamondHandle( newStartPoint, 7, 'rgba(128,64,128,0.5)' );
		pb.draw.diamondHandle( newEndPoint, 7, 'rgba(128,64,128,0.5)' );

		// Draw the arc
		var pathData =
		    VEllipseSector.ellipseSectorUtils.describeSVGArc(
			ellipse.center.x, ellipse.center.y,
			ellipse.radiusH(), ellipse.radiusV(),
			newStartAngle, newEndAngle,
			rotation,
			{ moveToStart : true } );
		pb.draw.path( pathData, 'rgba(255,0,0,0.5)', 2 );

		// Draw labels (start/end)
		pb.fill.text( "start", newStartPoint.x, newStartPoint.y  );
		pb.fill.text( "end", newEndPoint.x, newEndPoint.y );

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
	} );
    
})(window); 
