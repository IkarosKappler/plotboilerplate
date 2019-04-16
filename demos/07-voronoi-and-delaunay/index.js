/**
 * A simple 2d point set and image triangulation (color fill).
 *
 * @requires Vertex, Triangle, Polygon, VoronoiCell, delaunay, delaunay2voronoi
 *
 * @author   Ikaros Kappler
 * @date     2017-07-31
 * @modified 2018-04-03 Added the voronoi-from-delaunay computation.
 * @modified 2018-04-11 Added the option to draw circumcircles.
 * @modified 2018-04-14 Added quadratic bezier Voronoi cells.
 * @modified 2018-04-16 Added cubic bezier Voronoi cells.
 * @modified 2018-04-22 Added SVG export for cubic and quadratic voronoi cells.
 * @modified 2018-04-28 Added a better mouse handler.
 * @modified 2018-04-29 Added web colors.
 * @modified 2018-05-04 Drawing voronoi cells by their paths now, not the triangles' circumcenters.
 * @version  1.0.9
 **/



(function(_context) {
    "use strict";

    // Fetch the GET params
    let GUP = gup();
    
    window.addEventListener(
	'load',
	function() {
	    // All config params are optional.
	    var pb = new PlotBoilerplate(
		PlotBoilerplate.utils.safeMergeByKeys(
		    { canvas                : document.getElementById('my-canvas'),					    
		      fullSize              : true,
		      fitToParent           : true,
		      scaleX                : 1.0,
		      scaleY                : 1.0,
		      drawGrid              : false,
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
		      drawHandleLines       : false,
		      drawHandlePoints      : false,
		      enableMouse           : true,
		      enableKeys            : true,
		      enableTouch           : true
		    }, GUP
		)
	    );

	    pb.config.postDraw = function() {
		redraw();
	    };

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    var gui = pb.createGUI(); 
	    // END init dat.gui
	    

	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    new MouseHandler(pb.canvas)
		.move( function(e) {
		    var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		    var cx = document.getElementById('cx');
		    var cy = document.getElementById('cy');
		    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
		} );

	    // +---------------------------------------------------------------------------------
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
				   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
				 );
	    };
	    var randomPoint = randomVertex;

	    
	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		fillTriangles         : true,
		trianglesInGreyscale  : false,
		makeVoronoiDiagram    : true,
		//fillAlphaOnly         : false,
		drawPoints            : true,
		drawEdges             : true,
		drawCircumCircles     : false,
		//drawQuadraticCurves   : false,
		drawCubicCurves       : false,
		voronoiCubicThreshold : 1.0,
		optimizeGaps          : false,
		pointCount            : 25,
		triangulate           : true,
		autoUpdateOnChange    : true,
		backgroundColor       : '#ffffff',
		rebuild               : function() { rebuild(); },
		//loadImage             : function() { var elem = document.getElementById('file'); elem.setAttribute('data-type','image-upload'); triggerClickEvent(elem); },
		//fitImage              : true,
		clear                 : function() { pointList = []; triangles = []; voronoiDiagram = []; redraw(); },
		randomize             : function() { randomPoints(true,false,false); trianglesPointCount = -1; rebuild(); },
		fullCover             : function() { randomPoints(true,true,false); trianglesPointCount = -1; pb.rebuild(); },
		fullCoverExtended     : function() { randomPoints(true,true,false); trianglesPointCount = -1; rebuild() }
		//exportSVG             : function() { exportSVG(); },
		//exportPointset        : function() { exportPointset(); },
		//importPointset        : function() { var elem = document.getElementById('file'); elem.setAttribute('data-type','pointset-upload'); triggerClickEvent(elem); } 
	    }, GUP );


	    var triangles           = [];
	    var trianglesPointCount = -1;   // Keep track of the number of points when the triangles were generated.
	    var voronoiDiagram      = [];   // An array of VoronoiCells.

	    
	    // A list of points.
	    var pointList            = [];

	    // +---------------------------------------------------------------------------------
	    // | Adds a random point to the point list. Needed for initialization.
	    // +-------------------------------
	    var addRandomPoint = function() {
		addVertex( randomPoint() );
		
	    };

	    var addVertex = function( vert ) {
		pointList.push( vert );
		pb.add( vert );
		vert.listeners.addDragListener( function() { rebuild(); } );
	    };
	    

	    // +---------------------------------------------------------------------------------
	    // | Removes a random point from the point list.
	    // +-------------------------------
	    var removeRandomPoint = function() {
		if( pointList.length > 1 ) 
		    pb.remove( pointList.pop() );
	    };

	    // +---------------------------------------------------------------------------------
	    // | A negative-numbers friendly max function (determines the absolute max and
	    // | preserves the signum).
	    // +-------------------------------
	    var absMax = function(value,max) {
		if( Math.abs(value) < max ) return Math.sign(value)*max;
		return value;
	    };


	    // +---------------------------------------------------------------------------------
	    // | Generates a random int value between 0 and max (both inclusive).
	    // +-------------------------------
	    var randomInt = function(max) {
		return Math.round( Math.random()*max );
	    };

	    // +---------------------------------------------------------------------------------
	    // | Generates a random color object.
	    // +-------------------------------
	    var randomColor = function() {
		return Color.makeRGB( randomInt(255), randomInt(255), randomInt(255) );
	    };

	    // +---------------------------------------------------------------------------------
	    // | Generates a random color object with r=g=b.
	    // +-------------------------------
	    var randomGreyscale = function() {
		var v = 32 + randomInt(255-32);
		return Color.makeRGB( v, v, v );
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | Draw the given triangle with the specified (CSS-) color.
	    // +-------------------------------
	    var drawTriangle = function( t, color ) {
		pb.draw.line( t.a, t.b, color );
		pb.draw.line( t.b, t.c, color );
		pb.draw.line( t.c, t.a, color );
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | Get average color in triangle.
	    // | @param imageBuffer:canvas
	    // +-------------------------------
	    var getAverageColorInTriangle = function( imageBuffer, tri ) {
		return randomColor();
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | The re-drawing function.
	    // +-------------------------------
	    var redraw = function() {
		// Draw triangles
		drawTriangles();

		// Draw circumcircles
		if( config.drawCircumCircles )
		    drawCircumCircles();
		
		// Draw voronoi diagram?
		if( config.makeVoronoiDiagram )
		    drawVoronoiDiagram();
		
		// Draw quadratic curves?
		if( config.drawQuadraticCurves )
		    drawQuadraticBezierVoronoi();

		// Draw cubic curves
		if( config.drawCubicCurves )
		    drawCubicBezierVoronoi();
	    };

	    var drawTriangles = function() {
		for( var i in triangles ) {
		    var t = triangles[i];
		    drawTriangle( t, config.makeVoronoiDiagram ? 'rgba(0,128,224,0.33)' : '#0088d8' );
		}
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | Draw the stored voronoi diagram.
	    // +-------------------------------	
	    var drawVoronoiDiagram = function() {
		for( var v in voronoiDiagram ) {
		    var cell = voronoiDiagram[v];
		    var path = cell.toPathArray();
		    for( var t = 1; t < path.length; t++ ) {
			pb.draw.line( path[t-1], path[t], '#00a828' );
		    }
		    if( !cell.isOpen() )
			pb.draw.line( path[0], path[path.length-1], '#00a828' );
		}
	    };

	    
	    // +---------------------------------------------------------------------------------
	    // | Draw the circumcircles of all triangles.
	    // +-------------------------------
	    var drawCircumCircles = function() {
		for( var t in triangles ) {
		    var cc = triangles[t].getCircumcircle();
		    pb.draw.circle( cc.center, cc.radius, '#e86800' );
		}
	    };

	    // +---------------------------------------------------------------------------------
	    // | Draw the voronoi cells as quadratic bezier curves.
	    // +-------------------------------
	    var drawCubicBezierVoronoi = function() {
		for( var c in voronoiDiagram ) {
		    var cell = voronoiDiagram[c];
		    if( cell.isOpen() || cell.triangles.length < 3 )
			continue;
		    var cbezier = new Polygon(cell.toPathArray(),cell.isOpen()).toCubicBezierData( config.voronoiCubicThreshold );
		    pb.draw.cubicBezierPath( cbezier, '#0048e8' );
		}
		
	    }; // END drawCubicBezierVoronoi
	    

	    // +---------------------------------------------------------------------------------
	    // | Handle a dropped JSON file (pointset data).
	    // |
	    // | The required data format is a JSON string representing array:{x,y}
	    // |
	    // | Example:
	    // |  '[ { x : 5, y : 6 }, { x : 100, y : 20 }, { x : 23.5, y : -10 } ]'
	    // +-------------------------------
	    /*var handlePointset = function(e) {
		var reader = new FileReader();
		reader.onload = function(event){
		    var json = event.target.result;
		    try {
			var pointset = JSON.parse(json);		    
			pointList = [];
			for( var i in pointset ) {
			    var tuple = pointset[i];
			    pointList.push( new Vertex(tuple.x,tuple.y) );
			}
			if( config.autoUpdateOnChange ) rebuild();
			else                            redraw();
		    } catch( e ) {
			console.log( JSON.stringify(pointset) );
			console.log( e );		    
		    }
		}
		reader.readAsText(e.target.files[0]);     
	    }*/

	    
	    // +---------------------------------------------------------------------------------
	    // | Decide which file type should be handled:
	    // |  - image for the background or
	    // |  - JSON for the point set)
	    // +-------------------------------
	    /*var handleFile = function(e) {
		var type = document.getElementById('file').getAttribute('data-type');
		if( type == 'image-upload' ) {
		    handleImage(e);
		} else if( type == 'pointset-upload' ) {
		    handlePointset(e);
		} else {
		    console.warn('Unrecognized upload type: ' + type );
		}   
	    }
	    document.getElementById( 'file' ).addEventListener('change', handleFile );
	    */

	    
	    // +---------------------------------------------------------------------------------
	    // | The rebuild function just evaluates the input and
	    // |  - triangulate the point set?
	    // |  - build the voronoi diagram?
	    // +-------------------------------
	    var rebuild = function() {
		// Only re-triangulate if the point list changed.
		var draw = true;
		if( (config.triangulate || config.makeVoronoiDiagram) ) // && trianglesPointCount != pointList.length )
		    triangulate();
		if( config.makeVoronoiDiagram )
		    draw = makeVoronoiDiagram();

		if( draw )
		    redraw();
	    };

	    
	    // +---------------------------------------------------------------------------------
	    // | Make the triangulation (Delaunay).
	    // +-------------------------------
	    var triangulate = function() {
		//console.log( window.Delaunay );
		var delau = new Delaunay( pointList, {} );
		triangles  = delau.triangulate();

		// Optimize triangles?
		if( config.optimizeGaps > 0 ) {
		    for( var i in triangles ) {
			var tri = triangles[i];
			var circumCircle = tri.getCircumcircle(); // { center:Vertex, radius:Number }
			var scaleFactor = (circumCircle.radius+0.1) / circumCircle.radius;
			
			tri.a = tri.a.clone().scale( scaleFactor, circumCircle.center );
			tri.b = tri.b.clone().scale( scaleFactor, circumCircle.center );
			tri.c = tri.c.clone().scale( scaleFactor, circumCircle.center );
		    }
		}

		trianglesPointCount = pointList.length;
		voronoiDiagram = [];
		redraw();
	    };


	    // +---------------------------------------------------------------------------------
	    // | Convert the triangle set to the Voronoi diagram.
	    // +-------------------------------
	    var makeVoronoiDiagram = function() {
		var voronoiBuilder = new delaunay2voronoi(pointList,triangles);
		voronoiDiagram = voronoiBuilder.build();
		redraw();
		if( voronoiBuilder.failedTriangleSets.length != 0 ) {
		    console.log( 'The error report contains '+voronoiBuilder.failedTriangleSets.length+' unconnected set(s) of triangles:' );
		    // Draw illegal triangle sets?
		    for( var s = 0; s < voronoiBuilder.failedTriangleSets.length; s++ ) {
			console.log( 'Set '+s+': ' + JSON.stringify(voronoiBuilder.failedTriangleSets[s]) );
			var n = voronoiBuilder.failedTriangleSets[s].length;
			for( var i = 0; i < n; i++ ) {
			    console.log('highlight triangle ' + i );
			    var tri = voronoiBuilder.failedTriangleSets[s][i];
			    drawTriangle( tri, 'rgb(255,'+Math.floor(255*(i/n))+',0)' );
			    draw.circle( tri.center, tri.radius, 'rgb(255,'+Math.floor(255*(i/n))+',0)' );
			}
		    }
		    // throw e;
		    return false;
		} else {
		    return true;
		}
	    };

	    
	    // +---------------------------------------------------------------------------------
	    // | Add n random points.
	    // +-------------------------------
	    var randomPoints = function( clear, fullCover, doRedraw ) {
		if( clear )
		    pointList = [];
		// Generate random points on image border?
		if( fullCover ) {
		    var remainingPoints = config.pointCount-pointList.length;
		    var borderPoints    = Math.sqrt(remainingPoints);
		    var ratio           = canvasSize.height/canvasSize.width;
		    var hCount          = Math.round( (borderPoints/2)*ratio );
		    var vCount          = (borderPoints/2)-hCount;
		    
		    while( vCount > 0 ) {
			pointList.push( new Vertex(0, randomInt(canvasSize.height)) );
			pointList.push( new Vertex(canvasSize.width, randomInt(canvasSize.height)) );		    
			vCount--;
		    }
		    
		    while( hCount > 0 ) {
			pointList.push( new Vertex(randomInt(canvasSize.width),0) );
			pointList.push( new Vertex(randomInt(canvasSize.width),canvasSize.height) );		    
			hCount--;
		    }

		    // Additionally add 4 points to the corners
		    pointList.push( new Vertex(0,0) );
		    pointList.push( new Vertex(canvasSize.width,0) );
		    pointList.push( new Vertex(canvasSize.width,canvasSize.height) );
		    pointList.push( new Vertex(0,canvasSize.height) );	
		}
		
		// Generate random points.
		for( var i = pointList.length; i < config.pointCount; i++ ) {
		    addRandomPoint();
		}
		if( doRedraw )
		    redraw();
	    };

	    // +---------------------------------------------------------------------------------
	    // | Called when the desired number of points changes.
	    // +-------------------------------
	    var updatePointCount = function() {
		if( config.pointCount > pointList.length )
		    randomPoints(false,false,true); // Do not clear ; no full cover ; do redraw
		else if( config.pointCount < pointList.length ) {
		    // Remove n-m points
		    pointList = pointList.slice( 0, config.pointCount );
		    redraw();
		}
		
	    };
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | This function exports the point set as a JSON string.
	    // +-------------------------------
	    var exportPointset = function() {
		var json = JSON.stringify(pointList);
		var blob = new Blob([json], {
		    type: 'application/json;charset=utf-8'
		});
		saveAs(blob,'pointset.json');	    
	    };
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            { 

		gui.add(config, 'rebuild').name('Rebuild all').title("Rebuild all.");

		var f0 = gui.addFolder('Points');
		f0.add(config, 'pointCount').min(3).max(200).onChange( function() { config.pointCount = Math.round(config.pointCount); updatePointCount(); } ).title("The total number of points.");
		f0.add(config, 'randomize').name('Randomize').title("Randomize the point set.");
		f0.add(config, 'fullCover').name('Full Cover').title("Randomize the point set with full canvas coverage.");
		f0.add(config, 'clear').name('Clear all').title("Clear all.");
		f0.add(config, 'drawPoints').onChange( redraw ).title("If checked the points will be drawn.");
		f0.open();
		
		var f1 = gui.addFolder('Delaunay');
		f1.add(config, 'triangulate').onChange( rebuild ).title("Triangulate the point set?");
		f1.add(config, 'fillTriangles').onChange( redraw ).title("If selected the triangles will be filled."); 
		//f1.add(config, 'fillAlphaOnly').onChange( redraw ).title("Only the alpha channel from the image will be applied.");
		//f1.add(config, 'trianglesInGreyscale').onChange( reassignTriangleColors ).title("If selected the triangles will be filled in greyscale only.");
		f1.add(config, 'drawEdges').onChange( redraw ).title("If checked the triangle edges will be drawn.");
		f1.add(config, 'drawCircumCircles').onChange( pb.redraw ).title("If checked the triangles circumcircles will be drawn.");
		//f1.add(config, 'optimizeGaps').onChange( pb.rebuild ).title("If checked the triangles are scaled by 0.15 pixels to optimize gaps.");

		var f2 = gui.addFolder('Voronoi');
		f2.add(config, 'makeVoronoiDiagram').onChange( rebuild ).title("Make voronoi diagram from the triangle set.");
		f2.add(config, 'drawCubicCurves').onChange( pb.redraw ).title("If checked the Voronoi's cubic curves will be drawn.");
		f2.add(config, 'voronoiCubicThreshold').min(0.0).max(1.0).onChange( pb.redraw ).title("(Experimental) Specifiy the cubic coefficients.");
		
		/*
		  var f4 = gui.addFolder('Import & Export');
		  f4.add(config, 'exportSVG').name('Export SVG').title("Export the current triangulation as a vector image.");
		  f4.add(config, 'exportPointset').name('Export point set').title("Export the point set as JSON.");
		  f4.add(config, 'importPointset').name('Import point set').title("Import the point set from JSON.");	    
		*/
	    }


	    // Init
	    randomPoints(true,false,false); // clear ; no full cover ; do not redraw
	    rebuild();
	    pb.redraw();
	    
	} ); // END document.ready / window.onload
    
})(null); // Removed jQuery in version 1.0.7




