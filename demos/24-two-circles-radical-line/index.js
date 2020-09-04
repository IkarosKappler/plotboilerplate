/**
 * A script for finding the intersection points of two circles (the 'radical line').
 *
 * Based on the C++ implementation by Robert King
 * https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
 * and the 'Circles and spheres' article by Paul Bourke.
 * http://paulbourke.net/geometry/circlesphere/
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

	pb.add( circleA );
	pb.add( circleB );
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

	var calcRadicalLine = function( circleA, circleB ) {
	    if( circleA.center.distance(circleB.center) > circleA.radius+circleB.radius ) {
		return null;
	    }
	    /*
	    pair<Point, Point> intersections(Circle c) {
            Point P0(x, y);
            Point P1(c.x, c.y);
            float d, a, h;
            d = P0.distance(P1);
            a = (r*r - c.r*c.r + d*d)/(2*d);
            h = sqrt(r*r - a*a);
            Point P2 = P1.sub(P0).scale(a/d).add(P0);
            float x3, y3, x4, y4;
            x3 = P2.x + h*(P1.y - P0.y)/d;
            y3 = P2.y - h*(P1.x - P0.x)/d;
            x4 = P2.x - h*(P1.y - P0.y)/d;
            y4 = P2.y + h*(P1.x - P0.x)/d;

            return pair<Point, Point>(Point(x3, y3), Point(x4, y4));
        } */
	    // Point P0(x, y);
            // Point P1(c.x, c.y);
	    var p0 = circleA.center.clone();
	    var p1 = circleB.center.clone();
            // float d, a, h;
            // d = P0.distance(P1);
            // a = (r*r - c.r*c.r + d*d)/(2*d);
            // h = sqrt(r*r - a*a);
	    var d = p0.distance(p1);
	    var a = (circleA.radius*circleA.radius - circleB.radius*circleB.radius + d*d)/(2*d);
	    var h = Math.sqrt( circleA.radius*circleA.radius - a*a );
            //Point P2 = P1.sub(P0).scale(a/d).add(P0);
	    var p2 = p1.clone().sub(p0).scale(a/d).add(p0); // Todo: This can be expressed as a scaling from p0
            //float x3, y3, x4, y4;
            //x3 = P2.x + h*(P1.y - P0.y)/d;
            //y3 = P2.y - h*(P1.x - P0.x)/d;
            //x4 = P2.x - h*(P1.y - P0.y)/d;
            //y4 = P2.y + h*(P1.x - P0.x)/d;
	    var x3 = p2.x + h*(p1.y - p0.y)/d;
	    var y3 = p2.y - h*(p1.x - p0.x)/d;
            var x4 = p2.x - h*(p1.y - p0.y)/d;
            var y4 = p2.y + h*(p1.x - p0.x)/d;
	    
            // return pair<Point, Point>(Point(x3, y3), Point(x4, y4));
	    return new Line( new Vertex(x3,y3), new Vertex(x4,y4) );
	};
	
	var drawAll = function() {
	    var radLine = calcRadicalLine( circleA, circleB );
	    if( radLine !== null )
		pb.draw.line( radLine.a, radLine.b, 'rgba(0,128,192,1.0)', 2.0 );
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
	    pointCount            : 6,
	    drawConvexHull        : true,
	    animate               : false,
	}, GUP );
	

	// +---------------------------------------------------------------------------------
	// | Some animation stuff.
	// +-------------------------------
	/*var animator = null;
	function renderAnimation() {
	    if( config.animate )
		window.requestAnimationFrame( renderAnimation );
	    else // Animation stopped
		; 
	};
	
	function toggleAnimation() {
	    if( config.animate ) {
		if( animator )
		    animator.start();
		renderAnimation();
	    } else {
		if( animator )
		    animator.stop();
		pb.redraw();
	    }
	};*/ 

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'pointCount').min(3).max(96).step(1).onChange( function() { updatePointList(); } ).name("Point count").title("Point count");
	    gui.add(config, 'drawConvexHull').onChange( function() { pb.redraw(); } ).name('Draw Convex Hull').title('Draw the Convex Hull.');
	    gui.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate points').title('Animate points.');
	}

	//toggleAnimation();
	//updatePointList();

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


