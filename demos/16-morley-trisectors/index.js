/**
 * A script for testing the morley triangle.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2019-02-03
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
		      enableTouch           : true
		    }, GUP
		)
	    );

	    
	    // +---------------------------------------------------------------------------------
	    // | This is the triangle instance we will work on.
	    // +-------------------------------
	    var triangle = new Triangle( new Vertex(), new Vertex(), new Vertex() );

	    
	    // +---------------------------------------------------------------------------------
	    // | Compute and draw the Morley triangle.
	    // +-------------------------------
	    var drawMorley = function() {
		var trisectionA = trisectAngle( triangle.a, triangle.b, triangle.c );
		var trisectionB = trisectAngle( triangle.b, triangle.c, triangle.a );
		var trisectionC = trisectAngle( triangle.c, triangle.a, triangle.b );

		var hexagon = new Polygon( [ trisectionA.sectorLines[1].intersection( trisectionB.sectorLines[2] ),
					     trisectionA.sectorLines[1].intersection( trisectionC.sectorLines[2] ),
					     
					     trisectionB.sectorLines[1].intersection( trisectionC.sectorLines[2] ),
					     trisectionB.sectorLines[1].intersection( trisectionA.sectorLines[2] ),
					     
					     trisectionC.sectorLines[1].intersection( trisectionA.sectorLines[2] ),
					     trisectionC.sectorLines[1].intersection( trisectionB.sectorLines[2] )
					   ] );

		
		// Draw hexa-polygon
		pb.fill.polygon( hexagon, config.colors.hexagon );

		// Draw sector lines
		pb.draw.line( trisectionA.sectorLines[1].a, trisectionA.sectorLines[1].b, config.colors.trisectors[0] );
		pb.draw.line( trisectionA.sectorLines[2].a, trisectionA.sectorLines[2].b, config.colors.trisectors[0] );

		pb.draw.line( trisectionB.sectorLines[1].a, trisectionB.sectorLines[1].b, config.colors.trisectors[1] );
		pb.draw.line( trisectionB.sectorLines[2].a, trisectionB.sectorLines[2].b, config.colors.trisectors[1] );

		pb.draw.line( trisectionC.sectorLines[1].a, trisectionC.sectorLines[1].b, config.colors.trisectors[2] );
		pb.draw.line( trisectionC.sectorLines[2].a, trisectionC.sectorLines[2].b, config.colors.trisectors[2] );

		// Draw the equilateral triangle that's predicted by Morley's Trisector Theorem :)
		var morleyTriangle = new Triangle( hexagon.vertices[0], hexagon.vertices[2], hexagon.vertices[4] );
		pb.fill.polygon( morleyTriangle.toPolygon(), config.colors.triangle );
	
	    };
	    

	    // +---------------------------------------------------------------------------------
	    // | Compute the trisection of the angle in point A.
	    // +-------------------------------
	    var trisectAngle = function( pA, pB, pC ) {
		var result = {};
		result.triangle    = new Triangle( pA, pB, pC );
		result.lineAB      = new Line( pA, pB );
		result.lineAC      = new Line( pA, pC );
		// Compute the slope (theta) of line AB and line AC
		result.thetaAB     = result.lineAB.angle();
		result.thetaAC     = result.lineAC.angle();
		// Compute the difference; this is the angle between AB and AC
		result.insideAngle = result.lineAB.angle( result.lineAC );
		// We want the inner angles of the triangle, not the outer angle;
		//   which one is which depends on the triangle 'direction'
		result.clockwise   = result.triangle.determinant() > 0;
		
		// For convenience convert the angle [-PI,PI] to [0,2*PI]
		if( result.insideAngle < 0 )
		    result.insideAngle = 2*Math.PI + result.insideAngle;
		if( !result.clockwise )
		    result.insideAngle = (2*Math.PI - result.insideAngle) * (-1);  

		// Scale the rotated lines to the max leg length (looks better)
		var lineLength  = Math.max( result.lineAB.length(), result.lineAC.length() );
		var scaleFactor = lineLength/result.lineAB.length();
		
		result.sectorLines = [ result.lineAB,
				       new Line( pA.clone(), pB.clone().rotate((-result.insideAngle/3.0), pA) ).scale(scaleFactor),   // left sector line
				       new Line( pA.clone(), pB.clone().rotate((-result.insideAngle/3.0)*2, pA) ).scale(scaleFactor), // right sector line
				       result.lineAC 
				     ];
		return result;
	    };


	    // +---------------------------------------------------------------------------------
	    // | Let a poinst list manager do the randomization of the three points.
	    // +-------------------------------
	    var pointList = new CanvasPointList( pb );
	    // Keep a safe border to the left/right and top/bottom (0.1 each)
	    pointList.verticalFillRatio = 0.8;
	    pointList.horizontalFillRatio = 0.8;
	    

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
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		pointCount            : 3,
		animate               : false,
		colors                : {
		    trisectors : [ 'rgba(0,164,0,0.5)', 'rgba(255,128,0,0.5)', 'rgba(0,96,255,0.5)' ],
		    hexagon : 'rgba(0,164,255,0.7)',
		    triangle : 'rgba(255,128,0,1.0)'
		}
	    }, GUP );
	    

	    var updatePointList = function() {
		pointList.updatePointCount(config.pointCount,false); // No full cover
		triangle.a = pointList.pointList[0];
		triangle.b = pointList.pointList[1];
		triangle.c = pointList.pointList[2];
		animator = new LinearVertexAnimator( pointList.pointList, pb.viewport(), function() { pb.redraw(); } );
	    };



	    var animator = null;
	    function renderAnimation() {
		if( config.animate )
		    window.requestAnimationFrame( renderAnimation );
		else // Animation stopped
		    ; 
	    };
	    
	    function toggleAnimation() {
		if( config.animate ) {
		    if( animator )
			animator.start();
		    renderAnimation();
		} else {
		    if( animator )
			animator.stop();
		    pb.redraw();
		}
	    }

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();

		var f0 = gui.addFolder('Colors');
		f0.addColor(config.colors.trisectors, 0).onChange( function() { pb.redraw(); } ).name('Trisector A').title('The first trisector');
		f0.addColor(config.colors.trisectors, 1).onChange( function() { pb.redraw(); } ).name('Trisector B').title('The second trisector');
		f0.addColor(config.colors.trisectors, 2).onChange( function() { pb.redraw(); } ).name('Trisector C').title('The third trisector');
		f0.addColor(config.colors, 'hexagon').onChange( function() { pb.redraw(); } ).name('Hexagon').title('The hexagon color');
		f0.addColor(config.colors, 'triangle').onChange( function() { pb.redraw(); } ).name('Triangle').title('The triangle color');
		
		var f1 = gui.addFolder('Points');
		f1.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate points').title('Animate points.');
		f1.open();
	    }

	    toggleAnimation();
	    updatePointList();

	    pb.config.preDraw = drawMorley;
	    pb.add( triangle ); // This will trigger the initial postDraw/draw/redraw call

	} );
    
})(window); 


