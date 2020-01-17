/**
 * A script for testing vector fields.
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

	    var drawTraces = function() {
		if( !config.drawTraces )
		    return;
		console.log('drawTraces');
		for( var i in pointList.pointList ) {
		    let point = pointList.pointList[i];
		    // if( i == 0 ) console.log( point.attr.trace );
		    for( var e = 1; e < point.attr.trace.length; e++ ) {
			pb.draw.line( point.attr.trace[e-1], point.attr.trace[e], 'rgba(192,192,192,0.8)' );
		    }
		}
	    };

	    var pointList = new CanvasPointList( pb, function(vert) {
		// Add a 'trace' attribute to new vertices.
		vert.attr.trace = [];
	    } );
	    // Fill the full area with points.
	    pointList.verticalFillRatio = 1.0;
	    pointList.horizontalFillRatio = 1.0;

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
		pointCount            : 64,
		drawTraces            : false,
		animate               : false
	    }, GUP );
	    

	    var updatePointList = function() {
		pointList.updatePointCount(config.pointCount,false); // Full cover?
	    };

	    var updatePursuitPoints = function( threshold ) {
		// Each point moves towards its successor
		for( var i = 0; i < pointList.pointList.length; i++ ) {
		    let pursuer = pointList.pointList[ i ];
		    pursuer.attr.trace.push( pursuer.clone() );
		    let pursuee = pointList.pointList[ (i+1)%pointList.pointList.length ];
		    let diff = pursuer.difference( pursuee );
		    pursuer.addXY(
			diff.x * threshold,
			diff.y * threshold
		    );
		}
		pb.redraw();
	    };


	    function renderAnimation() {
		updatePursuitPoints(0.1);
		if( config.animate )
		    window.requestAnimationFrame( renderAnimation );
		else // Animation stopped
		    drawTraces();
	    };
	    
	    function toggleAnimation() {
		if( config.animate ) {
		    renderAnimation();
		} else {
		    pb.redraw();
		}
	    }

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI(); 
		var f0 = gui.addFolder('Points');
		f0.add(config, 'pointCount').onChange( function() { updatePointList(); pb.redraw(); } ).min(4).name('Change point count').title('Change point count.');
		f0.add(config, 'drawTraces').onChange( function() { pb.redraw(); if( config.drawTraces ) drawTraces() } ).name('Draw trace').title('Draw trace.');
		f0.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate a point cloud').title('Animate a point cloud.');
		f0.open();
	    }

	    toggleAnimation();
	    updatePointList();

	    pb.config.preDraw = drawTraces;

	} );
    
})(window); 


