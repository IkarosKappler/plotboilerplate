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


	    // +---------------------------------------------------------------------
	    // | Define some lines to read angles from.
	    // +-------------------------------------------
	    var startControlLine    = new Line( ellipse.center, startControlPoint );
	    var endControlLine      = new Line( ellipse.center, endControlPoint );
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
		drawNormal();
		// drawTangent();
		// normalAt( ellipse, ellipseSector.startAngle + ellipseSector.ellipse.rotation );
		drawFoci();
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

	    function drawFoci() {
		var foci = ellipse.getFoci();
		pb.fill.circleHandle( foci[0], 3, 'orange' );
		pb.fill.circleHandle( foci[1], 3, 'orange' );
	    };
	    
	    /* function getFoci() {
		// https://www.mathopenref.com/ellipsefoci.html
		var rh = ellipse.radiusH();
		var rv = ellipse.radiusV();
		var sdiff = rh*rh - rv*rv;
		var f = Math.sqrt( Math.abs(sdiff) );
		// console.log( sdiff, f );
		if( sdiff < 0 ) {
		    return [
			ellipse.center.clone().addY( f/2).rotate( ellipse.rotation, ellipse.center ),
			ellipse.center.clone().addY(-f/2).rotate( ellipse.rotation, ellipse.center )
		    ];
		} else {
		    return [
			ellipse.center.clone().addX( f/2).rotate( ellipse.rotation, ellipse.center ),
			ellipse.center.clone().addX(-f/2).rotate( ellipse.rotation, ellipse.center )
		    ];
		}
		}; */

	    function drawNormal() {
		//var normal = normalAt( ellipseSector.startAngle ); // + ellipseSector.ellipse.rotation );
		 var normal = ellipse.normalAt( ellipseSector.startAngle, 50 );
		pb.draw.line( normal.a, normal.b, 'red', 1 );

		// var tangent = ellipse.tangentAt( ellipseSector.startAngle, 50 );
		// pb.draw.line( tangent.a, tangent.b, 'orange', 1 );

		var foci = ellipse.getFoci();
		pb.draw.line( normal.a, foci[0], 'rgba(192,192,0,0.5)', 1 );
		pb.draw.line( normal.a, foci[1], 'rgba(192,192,0,0.5)', 1 );
	    };

	    function normalAt( angle ) {
		var r2d = 180/Math.PI;
		var point = ellipse.vertAt( angle );
		var foci = ellipse.getFoci();
		// Calculate the angle between [point,focusA] and [point,focusB]
		var angleA = new Line(point,foci[0]).angle();
		var angleB = new Line(point,foci[1]).angle();
		// var angleA = geomutils.wrapMinMax(angleA, -Math.PI, Math.PI);
		// var angleB = geomutils.wrapMinMax(angleB, -Math.PI, Math.PI);
		//var angleA = geomutils.wrapMinMax(angleA, 0, Math.PI*2);
		//var angleB = geomutils.wrapMinMax(angleB, 0, Math.PI*2)
		var angle = angleA + (angleB-angleA)/2.0;
		//var angle = Math.min(angleA,angleB) + Math.abs(angleB-angleA)/2.0;
		//var angle = geomutils.wrapMinMax( angle, 0, Math.PI*2 );
		console.log( angleA*r2d, angleB*r2d, angle * r2d );

		pb.draw.line( point, foci[0], 'rgba(192,192,0,0.5)', 1 );
		pb.draw.line( point, foci[1], 'rgba(192,192,0,0.5)', 1 );
		
		var endPointA = point.clone().addX(50).clone().rotate( angle, point );
		var endPointB = point.clone().addX(50).clone().rotate( Math.PI+angle, point );
		if( ellipse.center.distance(endPointA) < ellipse.center.distance(endPointB) ) {
		    return new Vector( point, endPointB );
		} else {
		    return new Vector( point, endPointA );
		}
		// pb.draw.line( point, endPoint, 'red', 1 );
		
	    };
	    
	    function _normalAt( angle ) {
		var point = ellipse.vertAt( angle );
		var slope =
		    (ellipse.radiusH() * Math.sin( angle )) / ( ellipse.radiusV() * Math.cos(angle));
		console.log('slope', slope );

		var len = 200;
		var end = new Vertex( point.x + len, point.y + len*slope );
		// if( 
		pb.draw.line( point, end );
	    };
	    // Create a gui for testing with scale
	    var gui = pb.createGUI();	    

	    pb.redraw();



	} );
    
})(window); 
