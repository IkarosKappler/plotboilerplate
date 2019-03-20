/**
 * The main script of the generic plotter.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2018-10-23
 * @modified    2018-11-09 Refactored the old code.
 * @modified    2018-12-17 Added the config.redrawOnResize param.
 * @modified    2019-03-20 Added the 'projectname' tag.
 * @version     1.0.3
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
		      enableKeys            : true
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
				     humane.log(arguments[0]);
				 },
				 error : function() {
				     console.error(arguments);
				     humane.log(arguments[0]);
				 }
			       } );
	    }
	    humane.log('PlotBoilerplate');
	    
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
	    // | Add polygon (here a square).
	    // +-------------------------------
	    var squareSize = diameter*0.35;
	    var squareVerts = [ new Vertex(-squareSize,-squareSize), new Vertex(squareSize,-squareSize), new Vertex(squareSize,squareSize), new Vertex(-squareSize,squareSize) ];
	    var square = new Polygon( squareVerts );
	    pb.add( square, false );

	    // +---------------------------------------------------------------------------------
	    // | Add two circles.
	    // +-------------------------------
	    var circle1 = new VEllipse( new Vertex(0,0), new Vertex(radius,radius) );
	    pb.add( circle1, false );
	    var circle2 = new VEllipse( new Vertex(0,0), new Vertex(diameter,diameter) );
	    pb.add( circle2, false );

	    // +---------------------------------------------------------------------------------
	    // | Add a circular connected bezier path
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


	    // Finally load the image
	    img.addEventListener('load', function() { pb.redraw(); } );
	    img.src = 'example-image.png';
	} );
    
})(window); 




