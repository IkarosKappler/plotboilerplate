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

	var verticesA = [];
	var verticesB = [];
	// Two points for moving whole polygons :)
	var controlPointA = new Vertex(0,0);
	var controlPointB = new Vertex(0,0);
	// The polygons themselves
	var polygonA = null;
	var polygonB = null;

	
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
	    // polygonA = new Polygon( config.useConvexHullA ? getConvexHull(verticesA) : verticesA, false ); 
	    // polygonB = new Polygon( config.useConvexHullB ? getConvexHull(verticesB) : verticesB, false ); // new Polygon(verticesB);
	    adjustPolygons();
	    installPolygonControlPoint( controlPointA, polygonA );
	    installPolygonControlPoint( controlPointB, polygonB );
	    pb.redraw();
	};


	var adjustPolygons = function() {
	    // Bind all polygon points to their respective control point
	    polygonA = new Polygon( config.useConvexHullA ? getConvexHull(verticesA) : verticesA, false ); 
	    polygonB = new Polygon( config.useConvexHullB ? getConvexHull(verticesB) : verticesB, false ); // new Polygon(verticesB);
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
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    if( polygonA == null || polygonB == null )
		return;
	    pb.draw.polygon( polygonA, Teal.cssRGB(), 1.0 );
	    pb.draw.polygon( polygonB, Orange.cssRGB(), 1.0 );

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
		var contrastColor = getContrastColor( Color.parse(pb.config.backgroundColor) ).cssRGB();
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
	    var area = 0;

	    if( intersection ) {
		if( typeof intersection[0][0] === 'number' ) { // single linear ring
		    intersection = [intersection];
		}
		
		for( var i = 0, len = intersection.length; i < len; i++ ) {
		    // Warning intersection polygons may have duplicate vertices (beginning and end).
		    // Remove duplicate vertices from the intersection polygons.
		    // These may also occur if two vertices of the clipping and the source polygon are congruent.
		    var intrsctn = intersection[i]; 
		    // var intrsctn = clearPolygonDuplicateVertices( intersection[i] );

		    var clearedPolys = config.clearSelfIntersections 
			? splitPolygonToNonIntersecting( intrsctn, 10 )
			: [ intrsctn ];

		    for( var j = 0; j < clearedPolys.length; j++ ) {
			pb.fill.polyline( clearedPolys[j],
					  false,
					  randomWebColor(0.25, i*intersection.length+j), 
					  2.0 ); // Polygon is not open

			if( config.triangulate ) {
			    if( config.triangulationMethod === "Delaunay" ) {
				drawTriangulation_delaunay( pb, new Polygon(clearedPolys[j]), sourcePolygon, clipPolygon, config.drawDelaunayCircles );
			    } else if( config.triangulationMethod === "Earcut" ) {
				drawTriangulation_earcut( pb, new Polygon(clearedPolys[j]), sourcePolygon, clipPolygon );

			    }
			}
			area += calcPolygonArea( clearedPolys[j] );
		    } // END for
		} // END for
	    } // END if

	    // Update the stats (experimental)
	    stats.area = area;
	    stats.polygonsIntersect = (intersection !== null && typeof intersection !== 'undefined' && intersection.length > 0 );
	};

	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'girih-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		stats.positionInA = (polygonA != null && relPos != null && polygonA.containsVert(relPos));
		stats.positionInB = (polygonB != null && relPos != null && polygonB.containsVert(relPos));
		stats.mouseX = relPos.x;
		stats.mouseY = relPos.y;
	    } )
	    .drag( function(e) {
		// When vertices are moved, the convex hull might change
		if( config.useConvexHullA || config.useConvexHullB )
		    adjustPolygons();
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
	

	// https://stackoverflow.com/questions/16285134/calculating-polygon-area
	function calcPolygonArea(vertices) {
	    var total = 0;

	    for (var i = 0, l = vertices.length; i < l; i++) {
		var addX = vertices[i].x;
		var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
		var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
		var subY = vertices[i].y;

		total += (addX * addY * 0.5);
		total -= (subX * subY * 0.5);
	    }

	    return Math.abs(total);
	}

	var stats = {
	    area : 0.0,
	    polygonsIntersect : false,
	    positionInA : false,
	    positionInB : false,
	    mouseX : 0,
	    mouseY : 0
	};
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
	    gui.add(config, 'useConvexHullA').listen().onChange( function() { setVertices(verticesA,verticesB); pb.redraw(); } ).name('useConvexHullA').title('Use the convex hull of polygon A?');
	    gui.add(config, 'useConvexHullB').listen().onChange( function() { setVertices(verticesA,verticesB); pb.redraw(); } ).name('useConvexHullB').title('Use the convex hull of polygon B?');
	    gui.add(config, 'triangulate').listen().onChange( function() { pb.redraw(); } ).name('triangulate').title('Tringulate the result?');
	    gui.add(config, 'clearSelfIntersections').listen().onChange( function() { pb.redraw(); } ).name('clearSelfIntersections').title('Clear polygons of self intersections before triangulating?');
	    gui.add(config, 'triangulationMethod', ['Delaunay','Earcut']).listen().onChange( function() { pb.redraw(); } ).name('triangulationMethod').title('The triangulation method to use (Delaunay is not safe here; might result in ivalid triangulations)');
	    gui.add(config, 'drawDelaunayCircles').listen().onChange( function() { pb.redraw(); } ).name('drawDelaunayCircles').title('Draw triangle circumcircles when in Delaunay mode?');

	    // Add stats
	    var uiStats = new UIStats( stats );
	    stats = uiStats.proxy;
	    uiStats.add( 'area' ).precision( 3 ).suffix(' spx');
	    uiStats.add( 'polygonsIntersect' );
	    uiStats.add( 'positionInA' );
	    uiStats.add( 'positionInB' );
	    uiStats.add( 'mouseX' );
	    uiStats.add( 'mouseY' );
	}

	// +---------------------------------------------------------------------------------
	// | Initialize 
	// +-------------------------------
	pb.config.preDraw = drawAll;
	loadRandomTestCase(pb, setVertices);
	pb.redraw();
    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


