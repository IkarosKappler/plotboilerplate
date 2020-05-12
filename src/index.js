/**
 * The main script of the generic plotter.
 *
 * @requires PlotBoilerplate, MouseHandler, gup, dat.gui, draw
 * 
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2018-10-23
 * @modified    2018-11-09 Refactored the old code.
 * @modified    2018-12-17 Added the config.redrawOnResize param.
 * @modified    2019-03-20 Added the 'projectname' tag.
 * @modified    2019-11-18 Added the triangle demo.
 * @version     1.0.4
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
		  drawOrigin            : true,
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
		  enableTouch           : true,
		  enableKeys            : true,
		  enableGL              : false // experimental
		}, GUP
	    )
	);

	if( typeof humane != 'undefined' ) {
	    pb.setConsole( { warn : function() {
		console.warn(arguments);
		humane.log(arguments[0]);
	    }, 
			     log : function() {
				 console.log(arguments);
				 // humane.log(arguments[0]);
			     },
			     error : function() {
				 console.error(arguments);
				 humane.log(arguments[0]);
			     }
			   } );
	}
	humane.log('plotboilerplate');
	
	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
	pb.createGUI(); 
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
	// | Add a touch listener to track the touch position.
	// +-------------------------------
	new Touchy( pb.canvas,
		    { one : function( hand, finger ) {
			var relPos = pb.transformMousePosition( finger.lastPoint.x, finger.lastPoint.y ); //e.params.pos.x, e.params.pos.y );
			var cx = document.getElementById('cx');
			var cy = document.getElementById('cy');
			if( cx ) cx.innerHTML = relPos.x.toFixed(2);
			if( cy ) cy.innerHTML = relPos.y.toFixed(2);
			
			hand.on('move', function (points) {
			    relPos = pb.transformMousePosition( points[0].x, points[0].y ); //e.params.pos.x, e.params.pos.y );
			    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
			    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
			} );
		    }
		    }
		  );

	// +---------------------------------------------------------------------------------
	// | Add some elements to draw (demo).
	// +-------------------------------
	var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/3.5;
	var radius   = diameter*0.5;
	var hypo     = Math.sqrt( radius*radius*2 );

	// +---------------------------------------------------------------------------------
	// | Add an image.
	// +-------------------------------
	var img = new Image(50,50);
	pb.add( new PBImage(img, new Vertex(-25,-25), new Vertex(25,25)), false );
	
	// +---------------------------------------------------------------------------------
	// | Add some Lines.
	// +-------------------------------
	pb.add( new Line( new Vertex(-diameter,-diameter), new Vertex(-hypo,-hypo) ), false );
	pb.add( new Line( new Vertex(-diameter,diameter), new Vertex(-hypo,hypo) ), false );
	pb.add( new Line( new Vertex(diameter,-diameter), new Vertex(hypo,-hypo) ), false );
	pb.add( new Line( new Vertex(diameter,diameter), new Vertex(hypo,hypo) ), false );

	// +---------------------------------------------------------------------------------
	// | Add some Vectors.
	// +-------------------------------
	pb.add( new Vector( new Vertex(-diameter*1.6,0), new Vertex(-diameter*1.2,0) ), false );
	pb.add( new Vector( new Vertex(diameter*1.6,0), new Vertex(diameter*1.2,0) ), false );
	pb.add( new Vector( new Vertex(0,-diameter*1.6), new Vertex(0,-diameter*1.2) ), false );
	pb.add( new Vector( new Vertex(0,diameter*1.6), new Vertex(0,diameter*1.2) ), false );

	// +---------------------------------------------------------------------------------
	// | Add polygon (here a hexagon).
	// +-------------------------------
	let n = 6;
	var polygonRadius = radius;
	var polygonVerts = [];
	for( var i = 0; i < n; i++ ) {
	    let vert = new Vertex(polygonRadius,0).rotate( (Math.PI*2/n)*i );
	    vert.attr.draggable = vert.attr.selectable = false;
	    polygonVerts.push( vert );
	}
	var polygon = new Polygon( polygonVerts );
	pb.add( polygon, false );

	// +---------------------------------------------------------------------------------
	// | Add an ellipse, intitially drawn as circle.
	// +-------------------------------
	var ellipse = new VEllipse( new Vertex(0,0), new Vertex(radius,radius) );
	pb.add( ellipse, false );

	// +---------------------------------------------------------------------------------
	// | Add a circle.
	// +-------------------------------
	var circle = new Circle( new Vertex(0,0), diameter );
	pb.add( circle, false );

	
	
	// +---------------------------------------------------------------------------------
	// | Add a circular connected bezier path.
	// +-------------------------------
	var fract = 0.5;
	var bpath = [];
	bpath[0] = [ new Vertex( 0, -diameter ),
		     new Vertex( diameter, 0 ),
		     new Vertex( diameter*fract, -diameter ),
		     new Vertex( diameter*fract, 0 ) ];
	bpath[1] = [ bpath[0][1], // Use same reference
		     new Vertex( 0, diameter ),
		     new Vertex( diameter, diameter*fract ),
		     new Vertex( 0, diameter*fract ) ];
	bpath[2] = [ bpath[1][1], // Use same reference
		     new Vertex( -diameter, 0 ),
		     new Vertex( -diameter*fract, diameter ),
		     new Vertex( -diameter*fract, 0 ) ];
	bpath[3] = [ bpath[2][1], // Use same reference
		     bpath[0][0], // Use same reference
		     new Vertex( -diameter, -diameter*fract ),
		     new Vertex( 0, -diameter*fract )
		   ];
	// Construct
	var path = BezierPath.fromArray( bpath );
	path.adjustCircular = true;
	pb.add( path, false );

	// +---------------------------------------------------------------------------------
	// | Add four equilateral triangles.
	// +-------------------------------
	let triangles = [
	    new Triangle( new Vertex(-hypo*1.5,-diameter*1.45), new Vertex(-diameter*1.45,-hypo*1.5),
			  new Vertex(-diameter*1.6,-diameter*1.6) ),
	    new Triangle( new Vertex(diameter*1.45,-hypo*1.5), new Vertex(hypo*1.5,-diameter*1.45),
			  new Vertex(diameter*1.6,-diameter*1.6) ),
	    new Triangle( new Vertex(-diameter*1.45,hypo*1.5), new Vertex(-hypo*1.5,diameter*1.45),
			  new Vertex(-diameter*1.6,diameter*1.6) ),
	    new Triangle( new Vertex(hypo*1.5,diameter*1.45), new Vertex(diameter*1.45,hypo*1.5),
			  new Vertex(diameter*1.6,diameter*1.6) ) 
	];
	var setEquilateral = function( triangle ) {
	    const vec  = new Vector(triangle.a,triangle.b);
	    const mid  = vec.vertAt(0.5);
	    const perp = vec.perp().add( mid ).sub( vec.a );
	    perp.setLength( vec.length() * Math.sqrt(3) / 2 ); // The height of a equilateral triangle
	    triangle.c.set( perp.b ); 
	};
	// TODO: var adjustCircumCircle = function( triangle ) { };
	for( var i in triangles ) {
	    let tri = triangles[i];
	    tri.c.attr.draggable = tri.c.attr.selectable = false;
	    tri.a.listeners.addDragListener( function(e) { setEquilateral(tri) } );
	    tri.b.listeners.addDragListener( function(e) { setEquilateral(tri) } );
	}
	pb.add( triangles );


	// +---------------------------------------------------------------------------------
	// | Add an auto-adjusting bezier path.
	// +-------------------------------
	var bpath2 = [];
	fract *= 0.66;
	bpath2[0] = [ new Vertex( 0, -diameter ),
		      new Vertex( diameter, 0 ),
		      new Vertex( diameter*fract, -diameter ),
		      new Vertex( diameter, -diameter*fract ) ];
	bpath2[1] = [ bpath2[0][1], // Use same reference
		      new Vertex( 0, diameter ),
		      new Vertex( diameter, diameter*fract ),
		      new Vertex( diameter*fract, diameter ) ];
	bpath2[2] = [ bpath2[1][1], // Use same reference
		      new Vertex( -diameter, -0 ),
		      new Vertex( -diameter*fract, diameter ),
		      new Vertex( -diameter, diameter*fract ) ];
	bpath2[3] = [ bpath2[2][1], // Use same reference
		      bpath2[0][0], // Use same reference
		      new Vertex( -diameter, -diameter*fract ),
		      new Vertex( -diameter*fract, -diameter )
		    ]; 
	// Construct
	var path2 = BezierPath.fromArray( bpath2 ); 
	path2.adjustCircular = true;
	path2.scale( new Vertex(0,0), 1.6 );
	path2.rotate( Math.PI/4 );
	for( var i in path2.bezierCurves ) {
	    path2.bezierCurves[i].startPoint.attr.bezierAutoAdjust = true;
	    path2.bezierCurves[i].endPoint.attr.bezierAutoAdjust = true;
	}
	pb.add( path2 );
	

	// +---------------------------------------------------------------------------------
	// | Finally load an image.
	// +-------------------------------
	img.addEventListener('load', function() { pb.redraw(); } );
	img.src = 'example-image.png';


	
	function animate(time) { 
	    polygon.rotate(0.01);
	    pb.redraw();
	    window.requestAnimationFrame( animate );
	}
	animate(0);

	pb.config.postDraw = function() {
	    for( var i in triangles ) {
		var circle = triangles[i].getIncircle();
		pb.fill.circle( circle.center, circle.radius, 'rgba(192,192,192,0.33)',1.0 );
	    }
	};
	
    }; // End initializePB

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );

    
})(window); 




