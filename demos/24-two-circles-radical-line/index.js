/**
 * A script for finding the intersection points of two circles (the 'radical line').
 *
 * Based on the C++ implementation by Robert King
 *    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
 * and the 'Circles and spheres' article by Paul Bourke.
 *    http://paulbourke.net/geometry/circlesphere/
 *
 * @require PlotBoilerplate
 * @require MouseHandler
 * @require gup
 * @require dat.gui
 *
 * 
 * @author   Ikaros Kappler
 * @date     2020-09-04
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

	var centerA = randomVertex();
	var centerB = randomVertex();
	var circleA = new Circle( centerA, centerA.distance(centerB)*Math.random()*1.5 );
	var circleB = new Circle( centerB, centerA.distance(centerB)*Math.random()*1.5 );
	var radiusPointA = new Vertex( centerA.clone().addXY(circleA.radius*Math.sin(Math.PI/4),circleA.radius*Math.cos(Math.PI/4)) );
	var radiusPointB = new Vertex( centerB.clone().addXY(circleB.radius*Math.sin(Math.PI/4),circleB.radius*Math.cos(Math.PI/4)) );

	pb.add( circleA.center );
	pb.add( circleB.center );
	pb.add( radiusPointA );
	pb.add( radiusPointB );

	centerA.listeners.addDragListener( function(e) {
	    radiusPointA.add( e.params.dragAmount );
	    pb.redraw();
	} );
	centerB.listeners.addDragListener( function(e) {
	    radiusPointB.add( e.params.dragAmount );
	    pb.redraw();
	} );
	radiusPointA.listeners.addDragListener( function(e) {
	    circleA.radius = centerA.distance( radiusPointA );
	    pb.redraw();
	} );
	radiusPointB.listeners.addDragListener( function(e) {
	    circleB.radius = centerB.distance( radiusPointB );
	    pb.redraw();
	} );

	var drawAll = function() {
	    var radLine = circleA.circleIntersection( circleB );	    
	    if( config.alwaysDrawFullCircles || radLine == null ) {
		pb.draw.circle( circleA.center, circleA.radius, 'rgba(34,168,168,0.5)', 1.0 );
		pb.draw.circle( circleB.center, circleB.radius, 'rgba(34,168,168,0.5)', 1.0 );
	    }

	    if( radLine !== null ) {
		if( config.drawRadicalLine )
		    pb.draw.line( radLine.a, radLine.b, 'rgba(34,168,168,0.5)', 1.0 );
		if( config.drawIntersectionPoints ) {
		    pb.draw.diamondHandle( radLine.a, 9, 'rgba(0,192,0,1.0)' );
		    pb.draw.diamondHandle( radLine.b, 9, 'rgba(0,192,0,1.0)' );
		}
		if( config.drawCircleSections ) {
		    drawCircleSection( circleA, radLine );
		    drawCircleSection( circleB, new Line(radLine.b,radLine.a) );
		}
	    }
	};

	var drawCircleSection = function( circle, radLine ) {
	    // Get angle sections in the circles
	    var lineAa = new Line( circle.center, radLine.a );
	    var lineAb = new Line( circle.center, radLine.b );

	    var anglea = lineAa.angle();
	    var angleb = lineAb.angle();

	    var pointa = circle.vertAt(anglea);
	    var pointb = circle.vertAt(angleb);

	    pb.draw.circleArc( circle.center, circle.radius, angleb, anglea, 'rgba(34,168,168,1.0)', 2.0 );
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


