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

	// +---------------------------------------------------------------------------------
	// | Initialize n random circles and store them in the array.
	// +-------------------------------
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

	// +---------------------------------------------------------------------------------
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    if( circles.length == 0 ) return;
	    var visibleCircles = drawCircleSet( circles, config.drawRadicalLines );
	    if( config.drawNestedCircles ) {
		// Scale down visible circles
		while( visibleCircles.length > 0 ) {
		    // Scale down
		    var scaledCircles = [];
		    for( var i = 0; i < visibleCircles.length; i++ ) {
			var scaledCircle = new Circle( visibleCircles[i].center, visibleCircles[i].radius - config.nestedCircleStep );
			if( scaledCircle.radius > 0 ) 
			    scaledCircles.push( scaledCircle );
		    }
		    visibleCircles = drawCircleSet( scaledCircles, false );
		}
	    }
	};

	// +---------------------------------------------------------------------------------
	// | Draw the intersection outline(s) for the given circles.
	// +-------------------------------
	var drawCircleSet = function( circles, drawRadicalLines ) {
	    // Find intersections, radical lines and interval 
	    var innerCircleIndices   = CircleIntersections.findInnerCircles( circles ); 
	    var radicalLineMatrix    = CircleIntersections.buildRadicalLineMatrix( circles );
	    var angleMatrix          = CircleIntersections.convertRadicalLinesToAngles( circles, radicalLineMatrix );
	    var intervalSets         = CircleIntersections.findOuterCircleIntervals( circles, radicalLineMatrix );
	    // Todo: put into separate file
	    var usedMatrixRecords    = CircleIntersections.matrixFill( circles.length, circles.length, false );
	    console.log("drawCircleSet", "radicalLineMatrix", radicalLineMatrix );
	    console.log("drawCircleSet", "angleMatrix", angleMatrix );
	    for( var i = 0; i < circles.length; i++ ) {
		if( config.alwaysDrawFullCircles ) {
		    pb.draw.circle( circles[i].center, circles[i].radius, 'rgba(34,168,168,0.333)', 1.0 );
		}
		if( drawRadicalLines ) {
		    for( var j = 0; j < circles.length; j++ ) {
			if( radicalLineMatrix[i][j] )
			    pb.draw.line( radicalLineMatrix[i][j].a, radicalLineMatrix[i][j].b, 'rgba(34,168,168,0.333)', 1.0 );
		    }
		}
		if( config.drawCircleSections ) {
		    drawCircleSections( circles[i], radicalLineMatrix[i] );
		}
		_drawCircleIntervals( circles[i], intervalSets[i] );
		if( config.drawCircleNumbers ) {
		    pb.fill.text( ''+i, circles[i].center.x, circles[i].center.y );
		}
	    }

	    console.log( "Draw paths" );
	    var path = null;
	    while( (path = findPartitions(circles,radicalLineMatrix,angleMatrix,usedMatrixRecords,intervalSets)) != null && path.length > 0 ) {
		drawConnectedPath(circles,path);
	    }
	    //drawCircleIntervals( circles, radicalLines, intervalSets );

	    var affectedCircles = [];
	    for( var i = 0; i < circles.length; i++ ) {
		if( !innerCircleIndices.includes(i) )
		    affectedCircles.push( circles[i] );
	    }
	    return affectedCircles;
	};

	var findMatrixRecordByStart = function( radicalLineMatrix, _angleMatrix, usedMatrixRecords, point, epsilon ) {
	    for( var i = 0; i < radicalLineMatrix.length; i++ ) {
		for( var j = 0; j < radicalLineMatrix[i].length; j++ ) {
		    if( i == j )
			continue;
		    if( !radicalLineMatrix[i][j] )
			continue;
		    // console.log( "findMatrixRecordByStart", i, j, point, radicalLineMatrix[i][j], radicalLineMatrix[i][j] ? radicalLineMatrix[i][j].a.distance(point) : "na" );
		    if( usedMatrixRecords[i][j] )
			continue;
		    if( radicalLineMatrix[i][j].a.distance(point) <= epsilon )
			return { i : i, j : j };
		}	
	    }
	    return null;
	};

	var randomInterval = function( angleMatrix, usedMatrixRecords ) { // intervalSets ) {
	    /* var i = 0;
	    while( i < intervalSets.length && intervalSets[i].intervals.length == 0 ) {
		// console.log( i, "intervalSets["+i+"].intervals.length=", intervalSets[i].intervals.length, 'i++' );
		i++;
	    }
	    return i < intervalSets.length ? { i : i, j : 0 } : null; */
	    // var i = 0;
	    for( var i = 0; i < angleMatrix.length; i++ ) {
		for( var j = 0; j < angleMatrix[i].length; j++ ) {
		    // console.log( i, "intervalSets["+i+"].intervals.length=", intervalSets[i].intervals.length, 'i++' );
		    if( angleMatrix[i][j] != null && !usedMatrixRecords[i][j] )
			return { i : i, j : j };
		}
	    }
	    return null; 
	};

	var findPartitions = function( circles, intersectionMatrix, angleMatrix, usedMatrixRecords, intervalSets ) {
	    // Find first non-empty interval set
	    // { i, j }
	    var intLocation = randomInterval( angleMatrix, usedMatrixRecords ); // intervalSets );
	    if( intLocation == null )
		return null; // No more intervals available

	    var path = [];
	    // var result = null;
	    // var count = 0;
	    do {		
		// var interval = intervalSets[ intLocation.i ].intervals[ intLocation.j ];
		var interval = angleMatrix[ intLocation.i ][ intLocation.j ];
		console.log( "interval", interval, JSON.stringify(intLocation), intervalSets );
		if( !interval ) {
		    console.warn('Error, interval ', intLocation.i, intLocation.j, " is missing" );
		    // continue;
		}
		var endPoint = circles[ intLocation.i ].vertAt( interval[1] );

		path.push( { index : intLocation.i, interval : interval } );
		
		// Clear interval from sets
		// intervalSets[ intLocation.i ].removeAt( intLocation.j );
		intervalSets[ intLocation.i ].intersect( interval[1], interval[0] );
		usedMatrixRecords[ intLocation.i ][ intLocation.j ] = true;
		// { i, j }
		intLocation = findMatrixRecordByStart( intersectionMatrix, angleMatrix, usedMatrixRecords, endPoint, 0.1 );
		console.log( 'result', intLocation );
		// remove

		// count++;
	    } while( intLocation != null ); 

	    // Array< {i:number, interval:[a,b]} >
	    return path.length == 0 ? null : path;
	}
	

	// +---------------------------------------------------------------------------------
	// | Draw the inner angles of intersecions.
	// +-------------------------------
	var drawCircleSections = function( circle, radicalLines ) {
	    for( var r = 0; r < radicalLines.length; r++ ) {
		if( radicalLines[r] == null )
		    continue;
		pb.draw.line( circle.center, radicalLines[r].a, 1.0, 'rgba(0,192,192,0.25)' );
		pb.draw.line( circle.center, radicalLines[r].b, 1.0, 'rgba(0,192,192,0.25)' );
	    }
	};

	var drawConnectedPath = function( circles, path ) {
	    console.log( "drawConnectedPath", JSON.stringify(path) );
	    var randomColor = 'rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+')';
	    pb.draw.ctx.save();
	    pb.draw.ctx.beginPath();
	    for( var i = 0; i < path.length; i++ ) {
		var circleIndex = path[i].index;
		var circle = circles[ circleIndex ];
		var center = circle.center;
		var radius = circle.radius;
		var interval = path[i].interval;
		/* var radicalLine = intersectionMatrix[ intLocation.i ][ intLocation.j ];
		var lineAa = new Line( circle.center, radicalLine.a );
		var lineAb = new Line( circle.center, radicalLine.b );

		var anglea = lineAa.angle();
		var angleb = lineAb.angle(); */

		pb.draw.ctx.ellipse( pb.draw.offset.x+center.x*pb.draw.scale.x,
				     pb.draw.offset.y+center.y*pb.draw.scale.y,
				     radius*pb.draw.scale.x,
				     radius*pb.draw.scale.y,
				     0.0,
				     interval[0], // startAngle,
				     interval[1], // endAngle,
				     false );
	    }
	    pb.draw.ctx.lineWidth = 1;
	    pb.draw._fillOrDraw( randomColor ); // 'rgba(192,128,0,1.0)' );
	};

	// +---------------------------------------------------------------------------------
	// | Draw the outer circle sectors of intersecions.
	// +-------------------------------
	var _drawCircleIntervals = function( circle, intervalSet ) {
	    for( var i = 0; i < intervalSet.intervals.length; i++ ) {
		var interval = intervalSet.intervals[i];
		if( config.fillNestedCircles ) {
		    pb.fill.circleArc( circle.center,
				       circle.radius,
				       interval[0],
				       interval[0]+(interval[1]-interval[0])*(config.sectionDrawPct/100),
				       'rgba(34,168,168,1.0)',
				       config.lineWidth );
		} else {
		    pb.draw.circleArc( circle.center,
				       circle.radius,
				       interval[0],
				       interval[0]+(interval[1]-interval[0])*(config.sectionDrawPct/100),
				       'rgba(34,168,168,1.0)',
				       config.lineWidth );
		}
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
	    lineWidth              : 2.0,
	    drawRadicalLines       : false,
	    drawCircleNumbers      : false,
	    sectionDrawPct         : 100, // [0..100]
	    drawNestedCircles      : true,
	    nestedCircleStep       : 25,
	    fillNestedCircles      : false
	}, GUP );
	


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'lineWidth').min(1).max(100).step(1).onChange( function() { pb.redraw(); } ).name("lineWidth").title("The line width of circle sections.");
	    gui.add(config, 'alwaysDrawFullCircles').onChange( function() { pb.redraw(); } ).name("alwaysDrawFullCircles").title("Always draw full circles?");
	    gui.add(config, 'drawCircleSections').onChange( function() { pb.redraw(); } ).name("drawCircleSections").title("Draw the circle sections separately?");
	    gui.add(config, 'drawRadicalLines').onChange( function() { pb.redraw(); } ).name("drawRadicalLines").title("Draw the radical lines?");
	    gui.add(config, 'drawCircleNumbers').onChange( function() { pb.redraw(); } ).name("drawCircleNumbers").title("Draw circle numbers?");
	    gui.add(config, 'sectionDrawPct').min(0).max(100).step(1).onChange( function() { pb.redraw(); } ).name("sectionDrawPct").title("How much to draw?");
	    gui.add(config, 'drawNestedCircles').onChange( function() { pb.redraw(); } ).name("drawNestedCircles").title("Draw nested (inner) circles?");
	    gui.add(config, 'nestedCircleStep').min(2).max(100).step(1).onChange( function() { pb.redraw(); } ).name("nestedCircleStep").title("Distance of nested circles.");
	    gui.add(config, 'fillNestedCircles').onChange( function() { pb.redraw(); } ).name("fillNestedCircles").title("Fill circles?");
	}

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


