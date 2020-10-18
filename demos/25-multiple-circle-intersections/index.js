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

	var circles = [];
	
	for( var i = 0; i < 7; i++ ) {
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

	    new CircleHelper( circle, radiusPoint, pb );
	}

	var drawAll = function() {
	    if( circles.length == 0 ) return;

	    for( var i = 0; i < circles.length; i++ ) {
		if( config.alwaysDrawFullCircles ) {
		    pb.draw.circle( circles[i].center, circles[i].radius, 'rgba(34,168,168,0.333)', 1.0 );
		}
		var intervalSet = new CircularIntervalSet( 0, 2*Math.PI );
		for( var j = 0; j < circles.length; j++ ) {
		    if( i == j )
			continue;
		    var radLine = circles[i].circleIntersection( circles[j] );
		    if( radLine !== null ) {
			handleCircleSection( circles[i], radLine, intervalSet, i, j );
			if( config.drawRadicalLines ) {
			    pb.draw.line( radLine.a, radLine.b, 'rgba(34,168,168,0.333)', 1.0 );
			}
		    } else if( circles[j].containsCircle(circles[i]) ) {
			intervalSet.clear();
		    }
		}
		drawCircleSections( circles[i], intervalSet );
		if( config.drawCircleNumbers ) {
		    pb.fill.text( ''+i, circles[i].center.x, circles[i].center.y );
		}
	    }
	};


	var handleCircleSection = function( circle, radLine, intervalSet, index, indexWith ) {
	    // Get angle sections in the circles
	    var lineAa = new Line( circle.center, radLine.a );
	    var lineAb = new Line( circle.center, radLine.b );

	    var anglea = lineAa.angle();
	    var angleb = lineAb.angle();

	    if( anglea < 0 ) anglea = Math.PI*2 + anglea;
	    if( angleb < 0 ) angleb = Math.PI*2 + angleb;

	    if( config.drawCircleSections ) {
		var pointa = circle.vertAt(anglea);
		var pointb = circle.vertAt(angleb);
		pb.draw.line( circle.center, pointa, 1.0, 'rgba(0,192,192,0.25)' );
		pb.draw.line( circle.center, pointb, 1.0, 'rgba(0,192,192,0.25)' );
	    }
	    intervalSet.intersect( angleb, anglea );
	};

	var drawCircleSections = function( circle, intervalSet ) {
	    for( var i = 0; i < intervalSet.intervals.length; i++ ) {
		var interval = intervalSet.intervals[i];
		pb.draw.circleArc( circle.center, circle.radius, interval[0], interval[1], 'rgba(34,168,168,1.0)', 2.0 );
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
	    alwaysDrawFullCircles  : true,
	    drawCircleSections     : false,
	    drawRadicalLines       : false,
	    drawCircleNumbers      : false
	}, GUP );
	


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'alwaysDrawFullCircles').onChange( function() { pb.redraw(); } ).name("alwaysDrawFullCircles").title("Always draw full circles?");
	    gui.add(config, 'drawCircleSections').onChange( function() { pb.redraw(); } ).name("drawCircleSections").title("Draw the circle sections separately?");
	    gui.add(config, 'drawRadicalLines').onChange( function() { pb.redraw(); } ).name("drawRadicalLines").title("Draw the radical lines?");
	    gui.add(config, 'drawCircleNumbers').onChange( function() { pb.redraw(); } ).name("drawCircleNumbers").title("Draw circle numbers?");
	}

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


