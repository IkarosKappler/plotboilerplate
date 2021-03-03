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
	    pb.drawConfig.circle.lineWidth = 1;
	    
	    // First create an ellipse to start with:
	    //  center vertex, radius (a non-negative number) and rotation.
	    // INPUT:
	    var center   = new Vertex( 10, 10 );
	    var radiusH  = 150.0;
	    var radiusV  = 200.0;
	    var rotation = 0.0;
	    

	    // Create the ellipse
	    var ellipse = new VEllipse( center, new Vertex(center.x+radiusH, center.y+radiusV), rotation );

	    // Now create a sector from the circle
	    var startAngle    = 12 / 180 * Math.PI;
	    var endAngle      = 89 / 180 * Math.PI;
	    var ellipseSector = new VEllipseSector( ellipse, startAngle, endAngle );

	    // We want to change the ellipse's radii and rotation by dragging points around
	    var startControlPoint    = ellipse.vertAt( startAngle );
	    var endControlPoint      = ellipse.vertAt( endAngle );
	    var rotationControlPoint = ellipse.vertAt( rotation ).scale( 1.2, ellipse.center );

	    
	    // Now add the sector to your canvas
	    pb.add( ellipse );
	    pb.add( [startControlPoint, endControlPoint] );
	    pb.add( rotationControlPoint );

	    var startControlLine = new Line( ellipse.center, startControlPoint );
	    var endControlLine = new Line( ellipse.center, endControlPoint );
	    var rotationControlLine = new Line( ellipse.center, rotationControlPoint );

	    
	    // +---------------------------------------------------------------------
	    // | Listen for the center to be moved.
	    // +-------------------------------------------
	    ellipseSector.ellipse.center.listeners.addDragListener( function(event) {
		startControlPoint.add( event.params.dragAmount );
		endControlPoint.add( event.params.dragAmount );
		rotationControlPoint.add( event.params.dragAmount );
	    } );

	    
	    // +---------------------------------------------------------------------
	    // | Listen for rotation changes.
	    // +-------------------------------------------
	    rotationControlPoint.listeners.addDragListener( function(event) {
		var newRotation = rotationControlLine.angle();
		var rDiff = newRotation-ellipse.rotation;
		ellipse.rotation = newRotation;
		ellipseSector.ellipse.axis.rotate( rDiff, ellipseSector.ellipse.center );
		startControlPoint.rotate( rDiff, ellipseSector.ellipse.center );
		endControlPoint.rotate( rDiff, ellipseSector.ellipse.center );
	    } );

	    // +---------------------------------------------------------------------
	    // | Listen for start angle changes.
	    // +-------------------------------------------
	    startControlPoint.listeners.addDragListener( function(event) {
		ellipseSector.startAngle = startControlLine.angle() - ellipse.rotation;
	    } );

	    // +---------------------------------------------------------------------
	    // | Listen for end angle changes.
	    // +-------------------------------------------
	    endControlPoint.listeners.addDragListener( function(event) {
		ellipseSector.endAngle = endControlLine.angle() - ellipse.rotation;
	    } );
	    
	    
	    // +---------------------------------------------------------------------
	    // | Draw additional lines to visualize what's happening.
	    // +-------------------------------------------
	    pb.config.postDraw = function() {
		pb.draw.line( startControlLine.a, startControlLine.b, 'rgba(192,128,128,0.5)', 1.0 );
		pb.draw.line( endControlLine.a, endControlLine.b, 'rgba(192,128,128,0.5)', 1.0 );
		pb.draw.line( rotationControlLine.a, rotationControlLine.b, 'rgba(64,192,128,0.333)', 1.0 );

		// Draw the arc
		var pathData =
		    VEllipseSector.ellipseSectorUtils.describeSVGArc(
			ellipseSector.ellipse.center.x, ellipseSector.ellipse.center.y,
			ellipseSector.ellipse.radiusH(), ellipseSector.ellipse.radiusV(),
			ellipseSector.startAngle, ellipseSector.endAngle,
			ellipseSector.ellipse.rotation,
			{ moveToStart : true } );
		pb.draw.path( pathData, 'rgba(255,0,0,0.5)', 2 );

		
		// Draw intersection point and labels (start/end)
		var newStartPoint = ellipse.vertAt( ellipseSector. startAngle );
		var newEndPoint = ellipse.vertAt( ellipseSector.endAngle );
		pb.draw.diamondHandle( newStartPoint, 7, 'rgba(128,64,128,0.5)' );
		pb.draw.diamondHandle( newEndPoint, 7, 'rgba(128,64,128,0.5)' );
		pb.fill.text( "start", newStartPoint.x, newStartPoint.y  );
		pb.fill.text( "end", newEndPoint.x, newEndPoint.y );

		drawCircle( startAngle, endAngle );
	    };


	    /**
	     * For comparison draw a circle inside the ellipse.
	     */
	    var drawCircle = function(newStartAngle,newEndAngle) {
		var a = _circle.vertAt( ellipseSector.startAngle + ellipse.rotation );
		var b = _circle.vertAt( ellipseSector.endAngle + ellipse.rotation );
		pb.draw.diamondHandle( a, 7, 'rgba(128,64,128,0.5)' );
		pb.draw.diamondHandle( b, 7, 'rgba(128,64,128,0.5)' );

		var sector = CircleSector.circleSectorUtils.describeSVGArc(
		    _circle.center.x, _circle.center.y, _circle.radius,
		    ellipseSector.startAngle + ellipseSector.ellipse.rotation,
		    ellipseSector.endAngle + ellipseSector.ellipse.rotation
		);
		pb.draw.path( sector, 'rgba(255,0,0,0.25)', 2 );
	    };
	    var _circle = new Circle( center, ((radiusH+radiusV)/2)*0.5 );
	    pb.add( _circle );

	    pb.redraw();
	} );
    
})(window); 
