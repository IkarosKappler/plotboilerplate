/**
 * A script to demonstrate SVG draw and export.
 *
 * @require PlotBoilerplate
 * @require MouseHandler
 * @require gup
 * @require dat.gui
 *
 * 
 * @author   Ikaros Kappler
 * @date     2021-01-04
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
		  enableTouch           : true,

		  enableSVGExport       : false
		}, GUP
	    )
	);

	// +---------------------------------------------------------------------------------
	// | Create a random vertex inside the canvas viewport.
	// +-------------------------------
	/* var randomVertex = function() {
	    return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
			       Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
			     );
			     }; */

	// Use a helper function to build all demo-drawables.
	var drawables = createDemoDrawables( pb.viewport(), // canvasSize,
					     '../../example-image.png',
					     function() { pb.redraw(); }
					   );
	pb.add( drawables );

	var clearChildren = function( node ) {
	    while (node.firstChild) {
		node.removeChild(node.lastChild);
	    }
	};


	var drawAll = function() {
	    // TODO: draw everything to SVG
	    try {
		var svgNode = document.getElementById('preview-svg');
		clearChildren( svgNode );
		var tosvg = new drawutilssvg( svgNode, pb.canvasSize, pb.viewport(), false );
		pb.drawDrawables( new Date().getMilliseconds(), tosvg, tosvg );
	    } catch( e ) {
		console.error( e );
	    }
	};

	new MouseHandler(pb.canvas,'drawsvg-demo')
	    .move( function(e) {
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		/* var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);
		*/
		stats.mouseX = relPos.x;
		stats.mouseY = relPos.y;
	    } );  


	// +---------------------------------------------------------------------------------
	// | A global config that's attached to the dat.gui control interface.
	// +-------------------------------
	var config = PlotBoilerplate.utils.safeMergeByKeys( {
	    alwaysDrawFullCircles  : false,
	    drawCircleSections     : true,
	    drawRadicalLine        : true,
	    drawIntersectionPoints : false,
	    drawSectorLines        : false
	}, GUP );
	

	var stats = {
	    mouseX : 0,
	    mouseY : 0
	};

	// +---------------------------------------------------------------------------------
	// | Initialize dat.gui
	// +-------------------------------
        {
	    var gui = pb.createGUI();
	    gui.add(config, 'alwaysDrawFullCircles').onChange( function() { pb.redraw(); } ).name("alwaysDrawFullCircles").title("Always draw full circles?");
	    gui.add(config, 'drawCircleSections').onChange( function() { pb.redraw(); } ).name("drawCircleSections").title("Draw the circle sections separately?");
	    gui.add(config, 'drawRadicalLine').onChange( function() { pb.redraw(); } ).name("drawRadicalLine").title("Draw the radical line?");
	    gui.add(config, 'drawIntersectionPoints').onChange( function() { pb.redraw(); } ).name("drawIntersectionPoints").title("Draw the intersection points?");
	    gui.add(config, 'drawSectorLines').onChange( function() { pb.redraw(); } ).name("drawSectorLines").title("Draw the sector lines of circle sections?");

	    // Add stats
	    var uiStats = new UIStats( stats );
	    stats = uiStats.proxy;
	    uiStats.add( 'mouseX' );
	    uiStats.add( 'mouseY' );
	}

	pb.config.preDraw = drawAll;
	pb.redraw();

    }

    if( !window.pbPreventAutoLoad )
	window.addEventListener('load', window.initializePB );
    
    
})(window); 


