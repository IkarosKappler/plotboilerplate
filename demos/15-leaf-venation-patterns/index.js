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
		      offsetAdjustYPercent  : 45, // !!!
		      backgroundColor       : '#ffffff',
		      enableMouse           : true,
		      enableKeys            : true,
		      enableTouch           : true
		    }, GUP
		)
	    );

	    var postDraw = function() {
		// console.log('postDraw');
		pb.draw.label( "Sorry, not yet finished.", pb.canvasSize.width/2, pb.canvasSize.height/2 );
		// Draw a mirrored clone
		 for( var c in path.bezierCurves ) {
		    pb.draw.cubicBezier( path.bezierCurves[c].startPoint.clone().invX(),
					 path.bezierCurves[c].endPoint.clone().invX(),
					 path.bezierCurves[c].startControlPoint.clone().invX(),
					 path.bezierCurves[c].endControlPoint.clone().invX(),
					 'rgba(0,0,0,0.5)',
					 1 );
		}
		// Mark start point
		pb.draw.circle( path.bezierCurves[0].startPoint, 20 );



		// Draw a single sub curve (test)
		var subCurve = path.bezierCurves[0].getSubCurveAt( config.startT, config.endT );
		//console.log("subCurve", subCurve);
		/*pb.draw.cubicBezier( subCurve.startPoint.clone().invX(),
				     subCurve.endPoint.clone().invX(),
				     subCurve.startControlPoint.clone().invX(),
				     subCurve.endControlPoint.clone().invX(),
				     'rgba(2550,0,0,1)',
				     2 );*/
		
		// Draw a sub path
		var subPath = path.getSubPathAt( config.startT, config.endT );
		// Mark sub path's start and end point
		pb.draw.circle( subPath.bezierCurves[0].startPoint.clone().invX(), 10 );
		pb.draw.circle( subPath.bezierCurves[subPath.bezierCurves.length-1].endPoint.clone().invX(), 6 );
		for( var c in subPath.bezierCurves ) {
		    pb.draw.cubicBezier( subPath.bezierCurves[c].startPoint.clone().invX(),
					 subPath.bezierCurves[c].endPoint.clone().invX(),
					 subPath.bezierCurves[c].startControlPoint.clone().invX(),
					 subPath.bezierCurves[c].endControlPoint.clone().invX(),
					 'rgba(0,0,255,0.5)',
					 2 );
		}

		//path.updateArcLengths();
		//console.log('total arc length', path.totalArcLength );
		
		
	    }; // END postDraw

	    let height = Math.min( pb.canvasSize.height, pb.canvasSize.width )*0.7;
	    let width  = height*1.4;
	    let size = height*0.5;

	    var path = makeLeafShape( height*0.5 );
	    pb.add( path );
	    
	    // Set path auto-adjustable
	    for( var i in path.bezierCurves ) {
		if( i > 0 )
		    path.bezierCurves[i].startPoint.attr.bezierAutoAdjust = true;
		if( i+1 < path.bezierCurves.length )
		    path.bezierCurves[i].endPoint.attr.bezierAutoAdjust = true;
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
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		startT                : 0.2,
		endT                  : 0.8,
		//pointCount            : 64,
		//drawTraces            : false,
		//animate               : false
	    }, GUP );
	    

	    var updatePointList = function() {
	
	    };

	    var updatePursuitPoints = function( threshold ) {
	
	    };


	    function renderAnimation() {
		updatePursuitPoints(0.1);
		if( config.animate )
		    window.requestAnimationFrame( renderAnimation );
		else // Animation stopped
		    ; // drawTraces();
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
		f0.add(config, 'startT').min(0.0).max(1.0).step(0.01).onChange( function() { pb.redraw(); } ).name('Set start T.').title('Set start T.');
		f0.add(config, 'endT').min(0.0).max(1.0).step(0.01).onChange( function() { pb.redraw(); } ).name('Set end T.').title('Set end T.');
		//f0.add(config, 'pointCount').onChange( function() { updatePointList(); pb.redraw(); } ).min(4).name('Change point count').title('Change point count.');
		//f0.add(config, 'drawTraces').onChange( function() { pb.redraw(); } ).name('Draw trace').title('Draw trace.');
		//f0.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate a point cloud').title('Animate a point cloud.');
		f0.open();
	    }

	    toggleAnimation();
	    updatePointList();

	    pb.config.preDraw = postDraw;
	    pb.redraw();

	} );
    
})(window); 


