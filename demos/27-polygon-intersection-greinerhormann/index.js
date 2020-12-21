/**
 * A script for testing the Greiner-Hormann polygon intersection algorithm with PlotBoilerplate.
 *
 * @requires delaunay
 * @requires earcut
 * @requires findSelfIntersectingPoints
 * @requires getContrastColor
 * @requires greinerHormann
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires greiner-hormann
 *
 * @author   Ikaros Kappler
 * @date     2020-11-29
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
	let Orange = Color.makeRGB( 255, 128, 0 );

	// All config params are optional.
	var pb = new PlotBoilerplate(
	    PlotBoilerplate.utils.safeMergeByKeys(
		{ canvas                : document.getElementById('my-canvas'),
		  fullSize              : true,
		  fitToParent           : true,
		  scaleX                : 1.0,
		  scaleY                : 1.0,
		  rasterGrid            : true,
		  drawGrid              : true,
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

	var mousePosition = { x : Number.MAX_VALUE, y : Number.MAX_VALUE }; // XYCoords
	var verticesA = [];
	var verticesB = [];
	// Two points for moving whole polygons :)
	var controlPointA = new Vertex(0,0);
	var controlPointB = new Vertex(0,0);

	
	// +---------------------------------------------------------------------------------
	// | Pick a color from the WebColors array.
	// +-------------------------------
	var randomWebColor = function(alpha,index) {
	    if( typeof index === "undefined" )
		index = Math.floor( Math.random() * WebColors.length );
	    var clone = WebColors[ index % WebColors.length ].clone();
	    clone.a = alpha;
	    return clone.cssRGBA();
	};

	
	// +---------------------------------------------------------------------------------
	// | Set the source and clipping polygons (as vertices).
	// |
	// | PB drawables will not be cleared.
	// |
	// | @param {Vertex[]} sourcesVertices
	// | @param {Vertex[]} clipVertices
	// +-------------------------------
	var setVertices = function( sourceVertices, clipVertices ) {
	    verticesA = sourceVertices;
	    verticesB = clipVertices;
	    // Compute bounds to determie a 'middle' point (used to move whole polygons)
	    var boundsA = Bounds.computeFromVertices(sourceVertices);
	    var boundsB = Bounds.computeFromVertices(clipVertices);
	    // Use center of polygon as control points
	    pb.add( controlPointA = new Vertex(boundsA.min).scale(0.5,boundsA.max) ); 
	    pb.add( controlPointB = new Vertex(boundsB.min).scale(0.5,boundsB.max) );
	    controlPointA.attr.visible = false;
	    controlPointB.attr.visible = false;
	    for( var i in verticesA )
		pb.add( verticesA[i], false ); // Do not redraw here
	    for( var i in verticesB )
		pb.add( verticesB[i], false );
	    // Bind all polygon points to their respective control point
	    installPolygonControlPoint( controlPointA, new Polygon(verticesA) );
	    installPolygonControlPoint( controlPointB, new Polygon(verticesB) );
	    pb.redraw();
	};


	// +---------------------------------------------------------------------------------
	// | Install a drag handler that moves all polygon points with the given control point.
	// +-------------------------------
	var installPolygonControlPoint = function( controlPoint, polygon ) {
	    controlPoint.listeners.addDragListener( function(dragEvent) {
		polygon.move( dragEvent.params.dragAmount );
	    } );
	};

	// +---------------------------------------------------------------------------------
	// | Initialize 
	// +-------------------------------
	loadRandomTestCase(pb, setVertices);
	
	
	// +---------------------------------------------------------------------------------
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    var polygonA = new Polygon( config.useConvexHullA ? getConvexHull(verticesA) : verticesA, false ); // Polygons are not open
	    var polygonB = new Polygon( config.useConvexHullB ? getConvexHull(verticesB) : verticesB, false );

	    pb.draw.polygon( polygonA, Teal.cssRGB(), 1.0 );
	    pb.draw.polygon( polygonB, Orange.cssRGB(), 1.0 );

	    var mouseInA = mousePosition != null && polygonA.containsVert(mousePosition);
	    var mouseInB = mousePosition != null && polygonB.containsVert(mousePosition);

	    pb.fill.label( 'polygonA.contains(mouse)=' + mouseInA, 3, 10, 0, 'black' );
	    pb.fill.label( 'polygonB.contains(mouse)=' + mouseInB, 3, 20, 0, 'black' );
	    // pb.fill.label( 'polygonsIntersect=' + intersect, 3, 30, 0, 'black' );

	    // Array<Vertex>
	    var intersectionPoints =
		drawGreinerHormannIntersection(
		    // This is a workaround about a colinearity problem with greiner-hormann:
		    // ... add some random jitter.
		    new Polygon( addPolygonJitter(cloneVertexArray(polygonA.vertices),0.001) ),
		    new Polygon( addPolygonJitter(cloneVertexArray(polygonB.vertices),0.001) )
		);
	    
	    // Draw both control points
	    drawFancyCrosshair( pb, controlPointA, Teal.cssRGB(), 2.0, 4.0 );
	    drawFancyCrosshair( pb, controlPointB, Orange.cssRGB(), 2.0, 4.0 );

	    if( config.drawPointNumbers ) {
		var contrastColor = getContrastColor( pb.config.backgroundColor ).cssRGB();
		for( var i = 0; i < polygonA.vertices.length; i++ ) {
		    pb.fill.text( ''+i, polygonA.vertices[i].x, polygonA.vertices[i].y, { color : contrastColor } );
		}
		for( var i = 0; i < polygonB.vertices.length; i++ ) {
		    pb.fill.text( ''+i, polygonB.vertices[i].x, polygonB.vertices[i].y, { color : contrastColor } );
		}
	    }
	};

	/**
	 * Draw the intersection polygon as the result of the Greiner-Horman
	 * clipping algorihm.
	 *
	 * @param {Polygon} sourcePolygon
	 * @param {Polygon} clipPolygon
	 */
	var drawGreinerHormannIntersection = function( sourcePolygon, clipPolygon ) {
	    // Array<Vertex> | Array<Array<Vertex>>
	    // TODO: the algorithm should be more clear here. Just return an array of Polygons.
	    //       If there is only one intersection polygon, there should be a returned
	    //       array with length 1. (or 0 if there is none; currently the result is null then).
	    var intersection = greinerHormann.intersection(sourcePolygon.vertices, clipPolygon.vertices);

	    if( intersection ) {
		if( typeof intersection[0][0] === 'number' ) { // single linear ring
		    intersection = [intersection];
		}
		
		for( var i = 0, len = intersection.length; i < len; i++ ) {
		    // Warning intersection polygons may have duplicate vertices (beginning and end).
		    // Remove duplicate vertices from the intersection polygons.
		    // These may also occur if two vertices of the clipping and the source polygon are congruent.
		    // var intrsctn = clearPolygonDuplicateVertices( intersection[i] );
		    var intrsctn = intersection[i]; // clearPolygonDuplicateVertices( intersection[i] );

		    var clearedPolys = config.clearSelfIntersections 
			? splitPolygonToNonIntersecting( intrsctn, 10 )
			: [ intrsctn ];

		    for( var j = 0; j < clearedPolys.length; j++ ) {
			// console.log('intersctn', j, clearedPolys[j].length, clearedPolys[j] );
			pb.fill.polyline( clearedPolys[j],
					  false,
					  randomWebColor(0.25, i*intersection.length+j), // 'rgba(0,192,192,0.25)',
					  2.0 ); // Polygon is not open

			if( config.triangulate ) {
			    if( config.triangulationMethod === "Delaunay" ) {
				drawTriangulation_delaunay( new Polygon(clearedPolys[j]), sourcePolygon, clipPolygon );
			    } else if( config.triangulationMethod === "Earcut" ) {
				drawTriangulation_earcut( new Polygon(clearedPolys[j]), sourcePolygon, clipPolygon );

			    }
			}
		    }
		}
	    }
	};


	/**
	 * This will only work if non-self-overlapping polygons.
	 *
	 * * Concave polygons work
	 * * Convex polygons are fine
	 * * Self intersections are fine
	 *
	 * @param {Polygon} intersectionPolygon
	 * @param {Polygon} sourcePolygon
	 * @param {Polygon} clipPolygon
	 */
	var drawTriangulation_earcut = function( intersectionPolygon, sourcePolygon, clipPolygon ) {
	    // Convert vertices into a sequence of coordinates for the earcut algorithm
	    var earcutVertices = [];
	    for( var i = 0; i < intersectionPolygon.vertices.length; i++ ) {
		earcutVertices.push( intersectionPolygon.vertices[i].x );
		earcutVertices.push( intersectionPolygon.vertices[i].y );
	    }

	    var triangleIndices = earcut( earcutVertices,
					  [], // holeIndices
					  2   // dim
					);

	    var triangles = [];
	    for( var i = 0; i+2 < triangleIndices.length; i+= 3 ) {
		var a = triangleIndices[i];
		var b = triangleIndices[i+1];
		var c = triangleIndices[i+2];
		var tri = new Triangle( intersectionPolygon.vertices[a],
					intersectionPolygon.vertices[b],
					intersectionPolygon.vertices[c] );
		triangles.push( tri );
		pb.draw.polyline( [tri.a, tri.b, tri.c], false, 'rgba(0,128,255,0.5)', 1 );
	    }
	    
	};

	
	/**
	 * This will only work if non-self-overlapping polygons.
	 *
	 * * Concave polygons work
	 * * Convex polygons are fine
	 * * Self intersections are fine
	 *
	 * @param {Polygon} intersectionPolygon
	 * @param {Polygon} sourcePolygon
	 * @param {Polygon} clipPolygon
	 */
	var drawTriangulation_delaunay = function( intersectionPolygon, sourcePolygon, clipPolygon ) {
	    var selfIntersectionPoints = findPolygonSelfIntersections( intersectionPolygon );
	    var extendedPointList = intersectionPolygon.vertices.concat( selfIntersectionPoints );

	    var delaunay = new Delaunay( extendedPointList, {} );
	    // Array<Triangle>
	    var triangles = delaunay.triangulate();

	    // Find real intersections with the triangulations and the polygon
	    // extendedPointList    

	    // Remember: delaunay returns an array with lots of empty slots.
	    //           So don't use triangles.length to access the triangles.
	    for( var i in triangles ) {
		var tri = triangles[i];
		// Check if triangle belongs to the polygon or is outside
		if( !sourcePolygon.containsVert( tri.getCentroid() ) )
		    continue;
		if( !clipPolygon.containsVert( tri.getCentroid() ) )
		    continue;

		// Cool, triangle is part of the intersection.
		pb.draw.polyline( [tri.a, tri.b, tri.c], false, 'rgba(0,128,255,0.5)', 1 );
		// drawFancyCrosshair( pb, tri.a, false, false );
		// drawFancyCrosshair( pb, tri.b, false, false );
		// drawFancyCrosshair( pb, tri.c, false, false );
		if( config.drawDelaunayCircles ) {
		    var circumCircle = tri.getCircumcircle();
		    pb.draw.crosshair( circumCircle.center, 5, 'rgba(255,0,0,0.25)' );
		    pb.draw.circle(  circumCircle.center, circumCircle.radius, 'rgba(255,0,0,0.25)',1.0 );
		}
	    }
	};


	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'girih-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);
	    } )
	    .click( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		mousePosition = relPos;
		pb.redraw();
		
	    } );

	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    drawPointNumbers : false,
	    useConvexHullA : true,
	    useConvexHullB : true,
	    triangulate : false,
	    triangulationMethod : "Delaunay", // [ "Delaunay", "Earcut" ]
	    clearSelfIntersections : true,
	    drawDelaunayCircles : false,

	    test_random : function() { loadRandomTestCase(pb,setVertices); },
	    test_squares : function() { loadSquareTestCase(pb,setVertices); },
	    test_girih : function() { loadGirihTestCase(pb,setVertices); }
	}, GUP );

	var liveStats = { message : "Init" };
	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();

	    var fold0 = gui.addFolder('Test Cases');
	    fold0.add(config, 'test_random').name('Random').title('Load the \'Random\' test case.');
	    fold0.add(config, 'test_squares').name('Squares').title('Load the \'Squares\' test case.');
	    fold0.add(config, 'test_girih').name('Girih').title('Load the \'Girih\' test case.');

	    gui.add(config, 'drawPointNumbers').listen().onChange( function() { pb.redraw(); } ).name('drawPointNumbers').title('Tringulate the result?');
	    gui.add(config, 'useConvexHullA').listen().onChange( function() { pb.redraw(); } ).name('useConvexHullA').title('Use the convex hull of polygon A?');
	    gui.add(config, 'useConvexHullB').listen().onChange( function() { pb.redraw(); } ).name('useConvexHullB').title('Use the convex hull of polygon B?');
	    gui.add(config, 'triangulate').listen().onChange( function() { pb.redraw(); } ).name('triangulate').title('Tringulate the result?');
	    gui.add(config, 'clearSelfIntersections').listen().onChange( function() { pb.redraw(); } ).name('clearSelfIntersections').title('Clear polygons of self intersections before triangulating?');
	    gui.add(config, 'triangulationMethod', ['Delaunay','Earcut']).listen().onChange( function() { pb.redraw(); } ).name('triangulationMethod').title('The triangulation method to use (Delaunay is not safe here; might result in ivalid triangulations)');
	    gui.add(config, 'drawDelaunayCircles').listen().onChange( function() { pb.redraw(); } ).name('drawDelaunayCircles').title('Draw triangle circumcircles when in Delaunay mode?');

	    // Add stats
	    
	    liveStats = new LiveStats( liveStats, [ "message" ] );
	    window.setTimeout( function() {
		console.log('timeout message change');
		liveStats["message"] = "blaaaa";
	    }, 1000 );
	}

	pb.config.preDraw = drawAll;
	pb.redraw();
    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


