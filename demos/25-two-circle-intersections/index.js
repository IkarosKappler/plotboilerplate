/**
 * A script for finding the intersection points of two circles (the 'radical line').
 *
 * Based on the C++ implementation by Robert King
 *    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
 * and the 'Circles and spheres' article by Paul Bourke.
 *    http://paulbourke.net/geometry/circlesphere/
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 * 
 * @author   Ikaros Kappler
 * @date     2020-10-05
 * @version  1.0.0
 **/


(function(_context) {
    "use strict";


    window.initializePB = function() {
	if( window.pbInitialized )
	    return;
	window.pbInitialized = true;
	
	// Fetch the GET params
	let GUP = gup();
	
	// All config params are optional.
	var pb = new PlotBoilerplate(
	    PlotBoilerplate.utils.safeMergeByKeys(
		{ canvas                : document.getElementById('my-canvas'),					    
		  fullSize              : true,
		  fitToParent           : true,
		  scaleX                : 1.0,
		  scaleY                : 1.0,
		  rasterGrid            : true,
		  drawOrigin            : false,
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
		  backgroundColor       : '#ffffff',
		  enableMouse           : true,
		  enableKeys            : true,
		  enableTouch           : true,

		  enableSVGExport       : false
		}, GUP
	    )
	);

	// +---------------------------------------------------------------------------------
	// | Create a random vertex inside the canvas viewport.
	// +-------------------------------
	var randomVertex = function() {
	    return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
			       Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
			     );
	};

	var R2D = 180/Math.PI;
	var D2R = Math.PI/180;

	var circles = [];


	var CircleHandler = function( circle, radiusPoint ) {
	    circle.center.listeners.addDragListener( function(e) {
		radiusPoint.add( e.params.dragAmount );
		pb.redraw();
	    } );
	    radiusPoint.listeners.addDragListener( function(e) {
		circle.radius = circle.center.distance( radiusPoint );
		pb.redraw();
	    } );
	};
	
	for( var i = 0; i < 3; i++ ) {
	    var center = randomVertex();
	    var circle = new Circle( center,
				     i==0
				     ? Math.abs(randomVertex().x)
				     : circles[i-1].center.distance(center)*Math.random()*1.2
				   );
	    circles[i] = circle;
	    var radiusPoint = new Vertex( center.clone().addXY(circle.radius*Math.sin(Math.PI/4),circle.radius*Math.cos(Math.PI/4)) );
	    pb.add( circle.center );
	    pb.add( radiusPoint );

	    new CircleHandler( circle, radiusPoint );
	}

	var drawAll = function() {
	    if( circles.length == 0 ) return;
	    
	    // var radLine = circles[0].circleIntersection( circles[1] );
	    for( var i = 0; i < circles.length; i++ ) {
		if( true || config.alwaysDrawFullCircles ) {
		    pb.draw.circle( circles[i].center, circles[i].radius, 'rgba(34,168,168,0.333)', 1.0 );
		    // pb.draw.circle( circles[1].center, circles[1].radius, 'rgba(34,168,168,0.5)', 1.0 );
		}
		// var intervalSet = new IntervalSet( 0, Math.PI*2 ); 
		// var intervalSet = new IntervalSet( -Math.PI, Math.PI );
		var intervalSet = new IntervalSet( 0, 2*Math.PI*R2D, true );
		// var intervalSet = new IntervalSet( -Math.PI*R2D, Math.PI*R2D, true );
		for( var j = 0; j < circles.length; j++ ) {
		    if( i == j )
			continue;
		    var radLine = circles[i].circleIntersection( circles[j] );
		    if( radLine !== null ) {
			handleCircleSection( circles[i], radLine, intervalSet, i, j );
			if( config.drawRadicalLine ) {
			    pb.draw.line( radLine.a, radLine.b, 'rgba(34,168,168,0.333)', 1.0 );
			}
			if( config.drawIntersectionPoints ) {
			    pb.draw.diamondHandle( radLine.a, 9, 'rgba(0,192,0,1.0)' );
			    pb.draw.diamondHandle( radLine.b, 9, 'rgba(0,192,0,1.0)' );
			}
		    } else if( circles[j].containsCircle(circles[i]) ) {
			intervalSet.clear();
		    }
		}
		drawCircleSections( circles[i], intervalSet );
		pb.draw.text( ''+i, circles[i].center.x, circles[i].center.y );
		// console.log( intervalSet );
	    }
	};


	var handleCircleSection = function( circle, radLine, intervalSet, index, indexWith ) {
	    // Get angle sections in the circles
	    var lineAa = new Line( circle.center, radLine.a );
	    var lineAb = new Line( circle.center, radLine.b );

	    var anglea = lineAa.angle() * R2D; //  % (Math.PI);
	    var angleb = lineAb.angle() * R2D; // % (Math.PI);

	    // console.log( index, indexWith, "before, anglea", anglea, "angleb", angleb );
	    if( anglea < 0 ) anglea = Math.PI*2*R2D + anglea;
	    if( angleb < 0 ) angleb = Math.PI*2*R2D + angleb;

	    var pointa = circle.vertAt(anglea * D2R);
	    var pointb = circle.vertAt(angleb * D2R);

	    // pb.draw.circleArc( circle.center, circle.radius, angleb, anglea, 'rgba(34,168,168,1.0)', 2.0 );
	    pb.draw.line( circle.center, pointa, 1.0, 'rgba(0,192,192,0.25)' );
	    pb.draw.line( circle.center, pointb, 1.0, 'rgba(0,192,192,0.25)' );
	    // console.log( index, indexWith, "anglea", anglea, "angleb", angleb, intervalSet.toString() );
	    // intervalSet.removeInterval( anglea, angleb );
	    // intervalSet.intersect( angleb+Math.PI, anglea+Math.PI );
	    intervalSet.intersect( angleb, anglea );
	    // console.log( index, indexWith, "after intersection", intervalSet.toString() );
	};

	var drawCircleSections = function( circle, intervalSet ) {
	    for( var i = 0; i < intervalSet.intervals.length; i++ ) {
		var interval = intervalSet.intervals[i];
		// pb.draw.circleArc( circle.center, circle.radius, interval[1]-Math.PI, interval[0]-Math.PI, 'rgba(34,168,168,1.0)', 2.0 );
		//pb.draw.circleArc( circle.center, circle.radius, interval[1]*D2R, interval[0]*D2R, 'rgba(34,168,168,1.0)', 2.0 );
		pb.draw.circleArc( circle.center, circle.radius, interval[0]*D2R, interval[1]*D2R, 'rgba(34,168,168,1.0)', 2.0 );
	    }
	};
	

	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'convexhull-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);
	    } );  


	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    alwaysDrawFullCircles  : false,
	    drawCircleSections     : true,
	    drawRadicalLine        : true,
	    drawIntersectionPoints : false
	}, GUP );
	


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'alwaysDrawFullCircles').onChange( function() { pb.redraw(); } ).name("alwaysDrawFullCircles").title("Always draw full circles?");
	    gui.add(config, 'drawCircleSections').onChange( function() { pb.redraw(); } ).name("drawCircleSections").title("Draw the circle sections separately?");
	    gui.add(config, 'drawRadicalLine').onChange( function() { pb.redraw(); } ).name("drawRadicalLine").title("Draw the radical line?");
	    gui.add(config, 'drawIntersectionPoints').onChange( function() { pb.redraw(); } ).name("drawIntersectionPoints").title("Draw the intersection points?");
	}

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


