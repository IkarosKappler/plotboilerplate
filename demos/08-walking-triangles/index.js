/**
 * A script for making simple animations.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2019-04-11
 * @version  1.0.0
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

	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		animate         : true,
		pointCount      : (pb.canvas.width*pb.canvas.height)/20000,
		maxDistance     : 100,
		drawLines       : true,
		lineColor       : '#004488',
		maxArea         : 1200,
		smoothLines     : false,
		fillTriangles   : false,
		triangleColor   : '#000000',
		smoothTriangles : true,
		triangleScale   : 1.0
	    }, GUP );
	    
	    // Color instances (this is what my renderer here is working with)
	    var lineColor = Color.makeHEX( config.lineColor );
	    var triangleColor = Color.makeHEX( config.triangleColor );

	  
	    pb.config.postDraw = function() {
		let count = pb.vertices.length;
		let triangle = new Triangle(new Vertex(0,0), new Vertex(0,0), new Vertex(0,0));
		for( var a = 0; a < count; a++ ) {
		    let A = pb.vertices[a];
		    //for( var b in pb.vertices ) {
		    for( var b = 0; b < a; b++ ) {
			let B = pb.vertices[b];
			let dist = A.distance( B );
			if( dist < config.maxDistance && config.drawLines ) {
			    lineColor.a = config.smoothLines ? 1.0-dist/config.maxDistance : 1.0;
			    pb.draw.line( pb.vertices[a], pb.vertices[b], lineColor.cssRGBA() );
			}
			if( config.fillTriangles ) {
			    // BAD PERFORMANCE!
			    for( var c = 0; c < count; c++ ) {
				let C = pb.vertices[c];
				if( dist < config.maxDistance &&
				    B.distance(C) < config.maxDistance &&
				    C.distance(A) < config.maxDistance ) {
				    let area = Math.abs( A.x*(B.y-C.y) + B.x*(C.y-A.y) + C.x*(A.y-B.y) ) / 2.0;
				    // if( a == 0 ) console.log( area );
				    if( area < config.maxArea ) {
					triangleColor.a = config.smoothTriangles ? 1.0-area/config.maxArea : 1.0;
					triangleColor.a *= lineColor.a;
					triangle.a.set(A); triangle.b.set(B); triangle.c.set(C);
					triangle.scaleToCentroid( config.triangleScale );
					pb.fill.polygon( new Polygon([triangle.a,triangle.b,triangle.c],false), triangleColor.cssRGBA() );
				    }
				}
			    }
			}
		    }
		}
	    }
	    

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

	    /**
	     * Called when the desired number of points changes.
	     **/
	    var updatePointCount = function() {
		if( config.pointCount > pb.vertices.length )
		    randomPoints(false,false,true); // Do not clear ; no full cover ; do rebuild
		else if( config.pointCount < pb.vertices.length ) {
		    // Remove n-m points
		    for( var i = config.pointCount; i < pb.vertices.length; i++ )
			pb.remove( pb.vertices[i] );
		    updateAnimator();
		}
		
	    };

	    /**
	     * Add or remove n random points; depends on the config settings.
	     *
	     * I have no idea how tired I was when I wrote this function but it seems working pretty well.
	     */
	    var randomPoints = function( clear, fullCover, doRebuild ) {
		if( clear ) {
		    for( var i in pointList )
			pb.remove( pointList[i], false );
		    //pointList = [];
		}
		// Generate random points on image border?
		if( fullCover ) {
		    var remainingPoints = config.pointCount-pointList.length;
		    var borderPoints    = Math.sqrt(remainingPoints);
		    var ratio           = pb.canvasSize.height/pb.canvasSize.width;
		    var hCount          = Math.round( (borderPoints/2)*ratio );
		    var vCount          = (borderPoints/2)-hCount;
		    
		    while( vCount > 0 ) {
			addVertex( new Vertex(-pb.canvasSize.width/2, randomInt(pb.canvasSize.height/2)-pb.canvasSize.height/2) );
			addVertex( new Vertex(pb.canvasSize.width/2, randomInt(pb.canvasSize.height/2)-pb.canvasSize.height/2) );		    
			vCount--;
		    }
		    
		    while( hCount > 0 ) {
			addVertex( new Vertex(randomInt(pb.canvasSize.width/2)-pb.canvasSize.width/2,0) );
			addVertex( new Vertex(randomInt(pb.canvasSize.width/2)-pb.canvasSize.width/2,pb.canvasSize.height/2) );
			hCount--;
		    }

		    // Additionally add 4 points to the corners
		    addVertex( new Vertex(0,0) );
		    addVertex( new Vertex(pb.canvasSize.width/2,0) );
		    addVertex( new Vertex(pb.canvasSize.width/2,pb.canvasSize.height/2) );
		    addVertex( new Vertex(0,pb.canvasSize.height/2) );	
		}
		
		// Generate random points.
		for( var i = pb.vertices.length; i < config.pointCount; i++ ) {
		    addRandomPoint();
		}
		updateAnimator();
	    };

	    // +---------------------------------------------------------------------------------
	    // | Adds a random point to the point list. Needed for initialization.
	    // +-------------------------------
	    var addRandomPoint = function() {
		addVertex( randomVertex() );	
	    };

	    var addVertex = function( vert ) {
		pb.add( vert );
		vert.listeners.addDragListener( function() { rebuild(); } );
	    };

	    /**
	     * Unfortunately the animator is not smart, so we have to create a new
	     * one (and stop the old one) each time the vertex count changes.
	     **/
	    var updateAnimator = function() {
		if( animator )
		    animator.stop();
		// animator = null;
		if( config.animate ) {
		    animator = new VertexAnimator( pb.vertices, pb.viewport(), updateTriangles );
		    animator.start();
		} else {
		    animator = null;
		}
	    };

	    
	    // +---------------------------------------------------------------------------------
	    // | Add some interactive elements: point sets (triangles) and circles.
	    // +-------------------------------
	    function updateTriangles() {
		pb.redraw();
	    };
	    
	    var pA = randomVertex();
	    var pB = randomVertex();
	    pb.add( pA );
	    pb.add( pB );
	    pA.listeners.addDragListener( function() { updateCircles() } );
	    pB.listeners.addDragListener( function() { updateCircles() } );

	    for( var i = 0; i < config.pointCount; i++ ) {
		var p = randomVertex();
		pb.add( p );
		p.listeners.addDragListener( updateTriangles ); 
	    }

	    // Animate the vertices: make them bounce around and reflect on the walls.
	    var animator = null;

	    /**
	     * This function is called if the point set changed.
	     *
	     * As the animator class is a disposable class, the old one needs to be
	     * stopped and destroyed and a new one needs to be instantiated.
	     */
	    var toggleAnimation = function() {
		if( config.animate ) {
		    animator = new VertexAnimator( pb.vertices, pb.viewport(), updateTriangles );
		    animator.start();
		} else {
		    animator.stop();
		    animator = null;
		}
	    };
	    toggleAnimation();

	    

	    /**
	     * This function switches the existing animator on/off.
	     **/
	    var toggleAnimationPaused = function() {
		if( config.animate ) {
		    if( animator ) 
			animator.start();
		    else
			toggleAnimation();
		} else {
		    if( animator )
			animator.stop();
		}
	    }

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		
		var gui = pb.createGUI(); 
		// END init dat.gui

		var f0 = gui.addFolder('Distance walk');
		f0.add(config, 'pointCount').min(3).max(200).onChange( function() { config.pointCount = Math.round(config.pointCount); updatePointCount(); } ).title("The total number of points.");
		f0.add(config, 'smoothLines').name('Smooth lines').title('Set if you want smooth lines.');
		f0.add(config, 'maxDistance').name('Max distance').min(1).max(1000).title('Defines the max distance for vertices before they connect.');
		f0.add(config, 'drawLines').name('Draw Lines').title('Draw lines?');
		f0.addColor(config, 'lineColor').name('Line color').onChange( function() { lineColor=Color.makeHEX(config.lineColor); console.log(config.lineColor,lineColor.cssRGB()); } ).title("Choose a line color.");
		f0.add(config, 'fillTriangles').name('Fill triangles').title('This might affect your performance.');
		f0.add(config, 'maxArea').name('Max area').min(0).title('This might affect your performance.');
		f0.addColor(config, 'triangleColor').name('Triangle color').onChange( function() { triangleColor=Color.makeHEX(config.triangleColor); console.log(config.triangleColor); } ).title("Choose a triangle color.");
		f0.add(config, 'smoothTriangles').name('Smooth triangles').title('Render triangles with smooth alpha.');
		f0.add(config, 'triangleScale').min(-2.0).max(2.0).step(0.05).name('Triangle Scale').title("Scale each triangle towards its centroid.");
		f0.add(config, 'animate').onChange( function() { toggleAnimationPaused(); } ).name('Animate').title('Toggle animation on/off.');
		f0.open();
	
	    }

	} );
    
})(window); 
