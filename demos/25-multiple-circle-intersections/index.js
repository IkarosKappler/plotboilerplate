/**
 * A script for finding the intersection points of two circles (the 'radical line').
 *
 * The intersection outline can be drawn/filled in two ways:
 *  + canvas.ellipse(...)
 *  + SVG path (arc command)
 *
 * Based on the C++ implementation by Robert King
 *    https://stackoverflow.com/questions/3349125/circle-circle-intersection-points
 * and the 'Circles and spheres' article by Paul Bourke.
 *    http://paulbourke.net/geometry/circlesphere/
 *
 * Is actual implementation of the circle intersection algorithm is located at 
 * ./src/ts/utils/algoriths/CircleIntersections.ts
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires path2d-polyfill (IE only)
 *
 * 
 * @author   Ikaros Kappler
 * @date     2020-10-05
 * @modified 2020-11-13 Fixed the drawing of sector lines.
 * @modified 2020-12-17 Added basic SVG export (experimental).
 * @version  1.1.0
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
		  drawGrid              : false,
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
	// | Pick a color from the WebColors array.
	// +-------------------------------
	var randomWebColor = function(index) {
	    switch( config.colorSet ) {
	    case "Malachite" : return WebColorsMalachite[ index % WebColorsMalachite.length ].cssRGB();
	    case "Mixed": return WebColorsContrast[ index % WebColorsContrast.length ].cssRGB();
	    case "Mixed":
	    default: return WebColors[ index % WebColors.length ].cssRGB();
	    }
	};

	
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
	var numCircles = Math.max( 1, PlotBoilerplate.utils.fetch.num(GUP,'numCircles',7) );
	var centerPoints = [];
	var radiusPoints = [];
	var circles = [];
	for( var i = 0; i < numCircles; i++ ) {
	    var center = randomVertex();
	    var randomRadius = Math.random() * pb.canvasSize.height * 0.25;
	    var circle = new Circle( center, randomRadius );
	    var radiusPoint = new Vertex( center.clone().addXY(circle.radius*Math.sin(Math.PI/4),circle.radius*Math.cos(Math.PI/4)) );
	    pb.add( circle.center );
	    pb.add( radiusPoint );

	    circles[i] = circle;
	    centerPoints[i] = circle.center;
	    radiusPoints[i] = radiusPoint;

	    new CircleHelper( circle, radiusPoint, pb );
	}

	// +---------------------------------------------------------------------------------
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    if( circles.length == 0 ) return;
	    var iteration = 0;
	    var visibleCircles = drawCircleSet( circles, config.drawRadicalLines, iteration++ );
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
		    visibleCircles = drawCircleSet( scaledCircles, false, iteration++ );
		    iteration++;
		}
	    }
	};

	// +---------------------------------------------------------------------------------
	// | Draw the intersection outline(s) for the given circles.
	// +-------------------------------
	var drawCircleSet = function( circles, drawRadicalLines, iteration ) {
	    // Find intersections, radical lines and interval 
	    var innerCircleIndices   = CircleIntersections.findInnerCircles( circles ); 
	    var radicalLineMatrix    = CircleIntersections.buildRadicalLineMatrix( circles );
	    var intervalSets         = CircleIntersections.findOuterCircleIntervals( circles, radicalLineMatrix );
	    var pathList             = CircleIntersections.findOuterPartitions( circles, intervalSets );

	    // Draw what is required to be drawn
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
		if( config.sectionDrawPct != 100 ) {
		    drawOpenCircleIntervals( circles[i], intervalSets[i] );
		}
		if( config.drawCircleNumbers ) {
		    pb.fill.text( ''+i, circles[i].center.x, circles[i].center.y );
		}
	    }

	    // Draw connected paths?
	    if( config.sectionDrawPct == 100 ) {
		for( var i = 0; i < pathList.length; i++ ) {
		    drawConnectedPath( circles, pathList[i], intervalSets, iteration, i );
		}
	    }

	    var affectedCircles = [];
	    for( var i = 0; i < circles.length; i++ ) {
		if( !innerCircleIndices.includes(i) )
		    affectedCircles.push( circles[i] );
	    }
	    return affectedCircles;
	};

	// +---------------------------------------------------------------------------------
	// | Draw the inner angles of intersecions.
	// +-pb.add( radiusPoint );------------------------------
	var drawCircleSections = function( circle, radicalLines ) {
	    for( var r = 0; r < radicalLines.length; r++ ) {
		if( radicalLines[r] == null )
		    continue;
		pb.draw.line( circle.center, radicalLines[r].a, 'rgba(0,192,192,0.25)', 1.0 );
		pb.draw.line( circle.center, radicalLines[r].b, 'rgba(0,192,192,0.25)', 1.0 );
	    }
	};

	
	// +---------------------------------------------------------------------------------
	// | This is kind of a hack to draw connected arc paths (which is currently not directly
	// | supported by the `draw` library).
	// |
	// | The function switches between canvas.ellipse draw or SVG path draw.
	// |
	// | pre: circles.length > 0
	// +-------------------------------
	var drawConnectedPath = function( circles, path, intervalSets, iteration, pathNumber ) {
	    var color = randomWebColor( iteration + pathNumber );
	    var draw = config.fillNestedCircles ? pb.fill : pb.draw;

	    if( config.drawAsSVGArcs ) 
		drawConnectedPathAsSVGArcs( circles, path, intervalSets, color, draw );
	    else
		drawConnectedPathAsEllipses( circles, path, intervalSets, color, draw );
	};


	// +---------------------------------------------------------------------------------
	// | Draw the given path as ellipses (using canvs.ellipse function).
	// |
	// | @param {Cirle[]} circles
	// | @param {IndexPair[]} path
	// | @param {CircularIntervalSet[]} intervalSets
	// | @param {string} color
	// | @param {drawutils} draw
	// +-------------------------------
	var drawConnectedPathAsEllipses = function( circles, path, intervalSets, color, draw ) {
	    draw.ctx.save();
	    draw.ctx.beginPath();
	    for( var i = 0; i < path.length; i++ ) {
		var circleIndex = path[i].i;
		var circle = circles[ circleIndex ];
		var center = circle.center;
		var radius = circle.radius;
		var interval = intervalSets[ path[i].i ].intervals[ path[i].j ];
		pb.draw.ctx.ellipse( draw.offset.x+center.x*draw.scale.x,
				     draw.offset.y+center.y*draw.scale.y,
				     radius*draw.scale.x,
				     radius*draw.scale.y,
				     0.0,
				     interval[0], // startAngle,
				     interval[1], // endAngle,
				     false );
	    }
	    draw.ctx.closePath();
	    draw.ctx.lineWidth = config.lineWidth;
	    draw.ctx.lineJoin = config.lineJoin;
	    draw._fillOrDraw( color ); 
	};

	// +---------------------------------------------------------------------------------
	// | Draw the given path as ellipses (using canvs.ellipse function).
	// |
	// | @param {Cirle[]} circles
	// | @param {IndexPair[]} path
	// | @param {CircularIntervalSet[]} intervalSets
	// | @param {string} color
	// | @param {drawutils} draw
	// +-------------------------------
	var drawConnectedPathAsSVGArcs = function( circles, path, intervalSets, color, draw ) {
	    var svgData = pathToSVGData( circles, path, intervalSets, color, draw.offset, draw.scale );	      
	    // console.log( svgData );
	    draw.ctx.save();
	    draw.ctx.beginPath();
	    draw.ctx.lineWidth = config.lineWidth;
	    draw.ctx.lineJoin = config.lineJoin;
	    if( config.fillNestedCircles ) {
		draw.ctx.fillStyle = color;
		draw.ctx.fill( new Path2D(svgData.join(" ")) );
	    } else {
		draw.ctx.strokeStyle = color;
		draw.ctx.stroke( new Path2D(svgData.join(" ")) );
	    }
	    draw.ctx.restore();    
	};

	// +---------------------------------------------------------------------------------
	// | Convert the given circle arc path (must be connected to look good) to
	// | SVG path data.
	// |
	// | @param {Cirle[]} circles
	// | @param {IndexPair[]} path
	// | @param {CircularIntervalSet[]} intervalSets
	// | @param {string} color
	// | @param {XYCoords} offs - The draw offset to use.
	// | @param {XYCoords} scale - The zoom to use.
	// +-------------------------------
	var pathToSVGData = function( circles, path, intervalSets, color, offs, scale ) {
	    // Build the SVG path data 
	    // https://www.w3.org/TR/SVG/paths.html

	    var svgData = [];
	    var lastArc = null;
	    
	    for( var i = 0; i < path.length; i++ ) {
		var circleIndex = path[i].i;
		var circle = circles[ circleIndex ];
		var center = circle.center;
		var radius = circle.radius;
		var interval = intervalSets[ path[i].i ].intervals[ path[i].j ];

		if( i == 0 ) {
		    // At the beginning add the inital position
		    var startPoint = circle.vertAt( interval[0] );
		    svgData.push( "M", offs.x + scale.x * startPoint.x, offs.y + scale.y * startPoint.y );
		}
		lastArc = CircleSector.circleSectorUtils.describeSVGArc(
		    offs.x + center.x * scale.x,
		    offs.y + center.y * scale.y,
		    radius  * (scale.x), // scal.y??
		    interval[0],
		    interval[1]
		);
		svgData = svgData.concat( lastArc );
	    }
	    // Close the path
	    svgData.push( "Z" );

	    return svgData;
	};

	
	// +---------------------------------------------------------------------------------
	// | Draw the outer circle sectors of intersections (as separate segments).
	// |
	// | This is quick and easy, but the intersection points might not be rendered
	// | properly as the path is not drawn in one single line.
	// +-------------------------------
	var drawOpenCircleIntervals = function( circle, intervalSet ) {
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
	new MouseHandler(pb.canvas,'circle-intersection-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);
	    } );


	// +---------------------------------------------------------------------------------
	// | After circles were moved their radius control points must be updated
	// | to match the circles' radii again.
	// +-------------------------------
	var updateRadiusPoints = function() {
	    for( var i in circles ) {
		radiusPoints[i].set( circles[i].center.x + circle.radius*Math.sin(Math.PI/4),
				     circles[i].center.y + circle.radius*Math.cos(Math.PI/4)
				   );
	    }
	    pb.redraw();
	};

	// +---------------------------------------------------------------------------------
	// | Build and export the outer paths a an SVG file.
	// | This is a really dirty and quick hack.
	// +-------------------------------
	var exportSVG = function() {
	    // Do the same as in the draw function (refactor?)
	    var innerCircleIndices   = CircleIntersections.findInnerCircles( circles ); 
	    var radicalLineMatrix    = CircleIntersections.buildRadicalLineMatrix( circles );
	    var intervalSets         = CircleIntersections.findOuterCircleIntervals( circles, radicalLineMatrix );
	    var pathList             = CircleIntersections.findOuterPartitions( circles, intervalSets );
	    
	    var canvasSize = pb.canvasSize;
	    var offset = pb.draw.offset;
	    var scale = pb.draw.scale;
	    // TODO: writer a better SVGBuilder so we do not have to write pure SVG code here.
	    var svgBuffer = [ '<svg width="'+canvasSize.width+'" height="'+canvasSize.height+'" xmlns="http://www.w3.org/2000/svg"><defs><style>.main-g { transform: scale('+scale.x+','+scale.y+') translate('+offset.x+'px,'+offset.y+'px) } .CircleArcPath { fill : none; stroke : green; stroke-width : 2px; } </style></defs>   <g class="main-g">' ];
	    for( var i = 0; i < pathList.length; i++ ) {
		var pathData = pathToSVGData( circles, pathList[i], intervalSets, 'rgb(0,0,0)', pb.draw.offset, pb.draw.scale );
		svgBuffer.push( '<path class="CircleArcPath" d="' + pathData.join(" ") + '" />' );
	    }	    
	    svgBuffer.push( '</g></svg>' );

	    var svgString = svgBuffer.join("");
	    // console.log( svgString );
	    saveAs( new Blob( [ svgString ], { type: 'image/svg' } ), 'circles.svg' );
	};
	

	// +---------------------------------------------------------------------------------
	// | Animate the vertices: make them bounce around and reflect on the walls.
	// +-------------------------------
	var animator = null;
	var toggleAnimation = function() {
	    if( config.animate ) {
		if( animator )
		    animator.stop();
		if( config.animationType=='radial' )
		    animator = new CircularVertexAnimator( centerPoints, pb.viewport(), updateRadiusPoints );
		else // 'linear'
		    animator = new LinearVertexAnimator( centerPoints, pb.viewport(), updateRadiusPoints );
		animator.start();
	    } else {
		if( animator )
		    animator.stop();
		animator = null;
	    }
	};


	// +---------------------------------------------------------------------------------
	// | Unfortunately the animator is not smart, so we have to create a new
	// | one (and stop the old one) each time the vertex count changes.
	// +-------------------------------
	var updateAnimator = function() {
	    if( !animator )
		return;
	    animator.stop();
	    animator = null;
	    toggleAnimation(); 
	};


	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    alwaysDrawFullCircles  : false,
	    drawCircleSections     : false,
	    lineWidth              : 3.0,
	    lineJoin               : "round",     // [ "bevel", "round", "miter" ]
	    drawAsSVGArcs          : false,
	    drawRadicalLines       : false,
	    drawCircleNumbers      : false,
	    sectionDrawPct         : 100,         // [0..100]
	    drawNestedCircles      : true,
	    nestedCircleStep       : 25,
	    fillNestedCircles      : false,
	    colorSet               : "WebColors", // [ "WebColors", "Mixed", "Malachite" ]
	    animate                : false,
	    animationType          : 'radial',     // 'linear' or 'radial'
	    exportSVG              : function() { exportSVG(); }
	}, GUP );
	


	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'lineWidth').min(1).max(100).step(1).onChange( function() { pb.redraw(); } ).name("lineWidth").title("The line width of circle sections.");
	    gui.add(config, 'lineJoin', [ "bevel", "round", "miter" ] ).onChange( function() { pb.redraw(); } ).name("lineJoin").title("The shape of the line joins.");
	    gui.add(config, 'alwaysDrawFullCircles').onChange( function() { pb.redraw(); } ).name("alwaysDrawFullCircles").title("Always draw full circles?");
	    gui.add(config, 'drawCircleSections').onChange( function() { pb.redraw(); } ).name("drawCircleSections").title("Draw the circle sections separately?");
	    gui.add(config, 'drawAsSVGArcs').onChange( function() { pb.redraw(); } ).name("drawAsSVGArcs").title("Draw the circle sections using SVG arcs instead of canvas ellipses?");
	    gui.add(config, 'drawRadicalLines').onChange( function() { pb.redraw(); } ).name("drawRadicalLines").title("Draw the radical lines?");
	    gui.add(config, 'drawCircleNumbers').onChange( function() { pb.redraw(); } ).name("drawCircleNumbers").title("Draw circle numbers?");
	    gui.add(config, 'sectionDrawPct').min(0).max(100).step(1).onChange( function() { pb.redraw(); } ).name("sectionDrawPct").title("How much to draw?");
	    gui.add(config, 'drawNestedCircles').onChange( function() { pb.redraw(); } ).name("drawNestedCircles").title("Draw nested (inner) circles?");
	    gui.add(config, 'nestedCircleStep').min(2).max(100).step(1).onChange( function() { pb.redraw(); } ).name("nestedCircleStep").title("Distance of nested circles.");
	    gui.add(config, 'fillNestedCircles').onChange( function() { pb.redraw(); } ).name("fillNestedCircles").title("Fill circles?");
	    gui.add(config, 'colorSet', [ "WebColors", "Mixed", "Malachite" ] ).onChange( function() { pb.redraw(); } ).name("colorSet").title("Which color set to use.");
	    gui.add(config, 'animate').onChange( toggleAnimation ).title("Toggle point animation on/off.");
	    gui.add(config, 'animationType', { Linear: 'linear', Radial : 'radial' } ).onChange( function() { toggleAnimation(); } );
	    gui.add(config, 'exportSVG' ).name('exportSVG').title('Export the current view as an SVG file');
	}

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


