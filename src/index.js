/**
 * The main script of the generic plotter.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2018-10-23
 * @modified 2018-11-09 Refactored the old code.
 * @modified 2018-12-17 Added the config.redrawOnResize param.
 * @version  1.0.2
 **/


(function(_context) {
    "use strict";

    // Fetch the GET params
    let GUP = gup();
    
    window.addEventListener(
	'load',
	function() {
	    // All config params are optional.
	    var bp = new PlotBoilerplate(
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
		      cssScaleX             : 1.0,
		      cssScaleY             : 1.0,
		      cssUniformScale       : true,
		      autoAdjustOffset      : true,
		      offsetAdjustXPercent  : 50,
		      offsetAdjustYPercent  : 50,
		      backgroundColor       : '#ffffff',
		      enableMouse           : true,
		      enableKeys            : true
		    }, GUP
		)
	    );

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    bp.createGUI(); 
	    // END init dat.gui
	    

	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    new MouseHandler(bp.canvas)
		.move( function(e) {
		    var relPos = bp.transformMousePosition( e.params.pos.x, e.params.pos.y );
		    var cx = document.getElementById('cx');
		    var cy = document.getElementById('cy');
		    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
		} );


	    // +---------------------------------------------------------------------------------
	    // | Add some elements to draw (demo).
	    // +-------------------------------
	    var diameter = Math.min(bp.canvasSize.width,bp.canvasSize.height)/3.5;
	    var radius   = diameter*0.5;
	    var hypo     = Math.sqrt( radius*radius*2 );

	    // +---------------------------------------------------------------------------------
	    // | Add some Lines.
	    // +-------------------------------
	    bp.add( new Line( new Vertex(-diameter,-diameter), new Vertex(-hypo,-hypo) ) );
	    bp.add( new Line( new Vertex(-diameter,diameter), new Vertex(-hypo,hypo) ) );
	    bp.add( new Line( new Vertex(diameter,-diameter), new Vertex(hypo,-hypo) ) );
	    bp.add( new Line( new Vertex(diameter,diameter), new Vertex(hypo,hypo) ) );

	    // +---------------------------------------------------------------------------------
	    // | Add some Vectors.
	    // +-------------------------------
	    bp.add( new Vector( new Vertex(-diameter*1.6,0), new Vertex(-diameter*1.2,0) ) );
	    bp.add( new Vector( new Vertex(diameter*1.6,0), new Vertex(diameter*1.2,0) ) );
	    bp.add( new Vector( new Vertex(0,-diameter*1.6), new Vertex(0,-diameter*1.2) ) );
	    bp.add( new Vector( new Vertex(0,diameter*1.6), new Vertex(0,diameter*1.2) ) );

	    // +---------------------------------------------------------------------------------
	    // | Add square.
	    // +-------------------------------
	    var squareSize = 32;
	    var squareVerts = [ new Vertex(-squareSize,-squareSize), new Vertex(squareSize,-squareSize), new Vertex(squareSize,squareSize), new Vertex(-squareSize,squareSize) ];
	    var square = new Polygon( squareVerts );
	    bp.add( square );

	    // +---------------------------------------------------------------------------------
	    // | Add two circles.
	    // +-------------------------------
	    var circle1 = new VEllipse( new Vertex(0,0), new Vertex(radius,radius) );
	    bp.add( circle1 );
	    var circle2 = new VEllipse( new Vertex(0,0), new Vertex(diameter,diameter) );
	    bp.add( circle2 );

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
	    bp.add( path );
	} );
    
})(window); 




