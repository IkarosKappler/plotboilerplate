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
	    // Remove old vertices
	    removeVertices(verticesA);
	    removeVertices(verticesB);
	    
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
	    adjustPolygons();
	    installPolygonControlPoint( controlPointA, polygonA );
	    installPolygonControlPoint( controlPointB, polygonB );
	    pb.redraw();
	};


	// +---------------------------------------------------------------------------------
	// | Construct polygon: regular or convex hull?
	// +-------------------------------
	var adjustPolygons = function() {
	    // Bind all polygon points to their respective control point
	    polygonA = new Polygon( config.useConvexHullA ? getConvexHull(verticesA) : verticesA, false ); 
	    polygonB = new Polygon( config.useConvexHullB ? getConvexHull(verticesB) : verticesB, false );
	};


	// +---------------------------------------------------------------------------------
	// | Pick a color from the WebColors array.
	// +-------------------------------
	var removeVertices = function(vertices) {
	    if( !vertices || !vertices.length )
		return;
	    for( var i = 0; i < vertices.length; i++ ) {
		pb.remove( vertices[i], false );
	    }
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
	// | This is the actual render function.
	// +-------------------------------
	var drawAll = function() {
	    if( polygonA == null || polygonB == null )
		return;
	    pb.draw.polygon( polygonA, Teal.cssRGB(), 1.0 );
	    pb.draw.polygon( polygonB, Orange.cssRGB(), 1.0 );

	    if( config.useConvexAlgorithm ) {
		drawConvexIntersection(polygonA, polygonB);
	    } else {
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
	    }
	};

	/* 
	var drawConvexIntersection = function( polygonA, polygonB ) {
	    console.log('drawConvexIntersection');
	    
	    // Check if both are clockwise or both are counter clockwise
	    if( !polygonA.isClockwise() && polygonB.isClockwise() || polygonA.isClockwise() && !polygonB.isClockwise() ) {
		// Note: Array.reverse operates in-place
		polygonA = new Polygon( cloneVertexArray(polygonA.vertices.reverse()) );
	    }

	    var EPS = 0.00001;
	    // { edgeA:number, edgeB:number, position:{x,y} }
	    var intersectionPoints = [];
	    // var intersectionMapA = new Array(polygonA.vertices.length);
	    // var intersectionMapB = new Array(polygonB.vertices.length);

	    for( var a = 0; a < polygonA.vertices.length; a++ ) {
		var edgeA = new Line( polygonA.vertices[a], polygonA.vertices[(a+1)%polygonA.vertices.length] );
		 for( var b = 0; b < polygonB.vertices.length; b++ ) {
		     var edgeB = new Line( polygonB.vertices[b], polygonB.vertices[(b+1)%polygonB.vertices.length] );

		     var intersection = edgeA.intersection( edgeB );
		     if( edgeA.hasPoint(intersection) && edgeB.hasPoint(intersection) ) {
			 console.log( intersection );
			 intersectionPoints.push( { edgeIndexA : a, edgeIndexB : b, position: intersection } );
			 pb.draw.diamondHandle( 'rgba(255,0,0,1)' );
		     }
		 }
	    }

	    // Now check all pairs of intersections if their inner line is inside both polygons
	    for( var i = 0; i < intersectionPoints.length; i++ ) {
		for( var j  = i+1; j < intersectionPoints.length; j++ ) {
		    var connection = new Line( intersectionPoints[i].position, intersectionPoints[j].position );
		    var center = connection.vertAt( 0.5 );
		    if( polygonA.containsVert(center) ) {
			// This is an inside connection
			// ...

			pb.draw.line( connection.a, connection.b, 'rgb(255,0,0)', 2.0 );
		    }
		}	
	    }
	    
	}; 
	*/

	var drawConvexIntersection = function(  polygonA, polygonB ) {

	    var pA = [];
	    var pB = [];

	    for( var i = 0; i < polygonA.vertices.length; i++ ) {
		pA.push( [ polygonA.vertices[i].x, polygonA.vertices[i].y ] );
	    }

	    for( var i = 0; i < polygonB.vertices.length; i++ ) {
		pB.push( [ polygonB.vertices[i].x, polygonB.vertices[i].y ] );
	    }

	    
	    var result = sutherlandHodgman( pA, pB );
	    // console.log( result );

	    for( var i = 0; i < result.length; i++ ) {
		pb.draw.line( { x : result[i][0], y : result[i][1] },
			      { x : result[(i+1)%result.length][0], y : result[(i+1)%result.length][1] },
			      'rgb(255,0,0)',
			      2.0
			    );
	    }
	}
	
	function sutherlandHodgman (subjectPolygon, clipPolygon) {
 
            var cp1, cp2, s, e;
            var inside = function (p) {
                return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
            };
            var intersection = function () {
                var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
                    dp = [ s[0] - e[0], s[1] - e[1] ],
                    n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
                    n2 = s[0] * e[1] - s[1] * e[0], 
                    n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
                return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
            };
            var outputList = subjectPolygon;
            cp1 = clipPolygon[clipPolygon.length-1];
            for (var j in clipPolygon) {
                var cp2 = clipPolygon[j];
                var inputList = outputList;
                outputList = [];
                s = inputList[inputList.length - 1]; //last on the input list
                for (var i in inputList) {
                    var e = inputList[i];
                    if (inside(e)) {
                        if (!inside(s)) {
                            outputList.push(intersection());
                        }
                        outputList.push(e);
                    }
                    else if (inside(s)) {
                        outputList.push(intersection());
                    }
                    s = e;
                }
                cp1 = cp2;
            }
            return outputList
        }

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
	    var area = 0.0;
	    var triangleArea = 0.0;

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
			    var triangles = null;
			    if( config.triangulationMethod === "Delaunay" ) {
				triangles = drawTriangulation_delaunay( pb, new Polygon(clearedPolys[j]), sourcePolygon, clipPolygon, config.drawDelaunayCircles );
			    } else if( config.triangulationMethod === "Earcut" ) {
				triangles = drawTriangulation_earcut( pb, new Polygon(clearedPolys[j]), sourcePolygon, clipPolygon );
			    }
			    // Add triangle area
			    triangleArea += calculateTrianglesArea(triangles);
			}
			area += Polygon.utils.area( clearedPolys[j] );
		    } // END for
		} // END for
	    } // END if

	    // Update the stats (experimental)
	    stats.area = area;
	    stats.triangleArea = config.triangulate ? triangleArea : NaN;
	    // TODO: think about these areas
	    stats.areaA = sourcePolygon.area();
	    stats.areaB = clipPolygon.area();
	    stats.signedAreaA = sourcePolygon.signedArea();
	    stats.signedAreaB = clipPolygon.signedArea();
	    stats.polygonsIntersect = (intersection !== null && typeof intersection !== 'undefined' && intersection.length > 0 );
	};

	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'polygon-demo')
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
	    useConvexAlgorithm : false,
	    triangulate : false,
	    triangulationMethod : "Delaunay", // [ "Delaunay", "Earcut" ]
	    clearSelfIntersections : true,
	    drawDelaunayCircles : false,

	    test_random : function() { loadRandomTestCase(pb,setVertices); },
	    test_squares : function() { loadSquareTestCase(pb,setVertices); },
	    test_girih : function() { loadGirihTestCase(pb,setVertices); }
	}, GUP );

	var stats = {
	    area : 0.0,
	    triangleArea : NaN,
	    signedAreaA : 0.0,
	    areaA : 0.0,
	    signedAreaB : 0.0,
	    areaB : 0.0,
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
	    gui.add(config, 'useConvexHullA').onChange( function() { setVertices(verticesA,verticesB); pb.redraw(); } ).name('useConvexHullA').title('Use the convex hull of polygon A?');
	    gui.add(config, 'useConvexHullB').onChange( function() { setVertices(verticesA,verticesB); pb.redraw(); } ).name('useConvexHullB').title('Use the convex hull of polygon B?');
	    gui.add(config, 'useConvexAlgorithm' ).onChange( function() { pb.redraw() } ).name('useConvexAlgorithm').title('Force use of regular convex polygon algorithm. Will fail if any of the polygons is not convex.');
	    gui.add(config, 'triangulate').listen().onChange( function() { pb.redraw(); } ).name('triangulate').title('Tringulate the result?');
	    gui.add(config, 'clearSelfIntersections').listen().onChange( function() { pb.redraw(); } ).name('clearSelfIntersections').title('Clear polygons of self intersections before triangulating?');
	    gui.add(config, 'triangulationMethod', ['Delaunay','Earcut']).listen().onChange( function() { pb.redraw(); } ).name('triangulationMethod').title('The triangulation method to use (Delaunay is not safe here; might result in ivalid triangulations)');
	    gui.add(config, 'drawDelaunayCircles').listen().onChange( function() { pb.redraw(); } ).name('drawDelaunayCircles').title('Draw triangle circumcircles when in Delaunay mode?');

	    // Add stats
	    var uiStats = new UIStats( stats );
	    stats = uiStats.proxy;
	    uiStats.add( 'area' ).precision( 3 ).suffix(' spx');
	    uiStats.add( 'triangleArea' ).precision( 3 ).suffix(' spx');
	    uiStats.add( 'areaA' ).precision( 3 ).suffix(' spx');
	    uiStats.add( 'areaB' ).precision( 3 ).suffix(' spx');
	    uiStats.add( 'signedAreaA' ).precision( 3 ).suffix(' spx');
	    uiStats.add( 'signedAreaB' ).precision( 3 ).suffix(' spx');
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


