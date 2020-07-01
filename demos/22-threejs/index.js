/**
 * A script for testing the lib with three.js.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui, three.js
 * 
 * @author   Ikaros Kappler
 * @date     2019-07-01
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

	    var dildoGeneration = new DildoGeneration('dildo-canvas');

	    // Refactored from dildo-generator
	    var DEFAULT_BEZIER_JSON         = "[ { \"startPoint\" : [-122,77.80736634304651], \"endPoint\" : [-65.59022229786551,21.46778533702511], \"startControlPoint\": [-121.62058129515852,25.08908859418696], \"endControlPoint\" : [-79.33419353770395,48.71529293460728] }, { \"startPoint\" : [-65.59022229786551,21.46778533702511], \"endPoint\" : [-65.66917273472913,-149.23537680826058], \"startControlPoint\": [-52.448492057756646,-4.585775770903305], \"endControlPoint\" : [-86.1618869001374,-62.11613821618976] }, { \"startPoint\" : [-65.66917273472913,-149.23537680826058], \"endPoint\" : [-61.86203591980055,-243.8368165606738], \"startControlPoint\": [-53.701578771473564,-200.1123697454778], \"endControlPoint\" : [-69.80704300441666,-205.36451303641783] }, { \"startPoint\" : [-61.86203591980055,-243.8368165606738], \"endPoint\" : [-21.108966092052256,-323], \"startControlPoint\": [-54.08681426887413,-281.486963896856], \"endControlPoint\" : [-53.05779349623559,-323] } ]";

	    var dragListener = function( dragEvent ) {
		// Uhm, well, some curve point moved.
		rebuild();
	    };

	    var rebuild = function() {
		dildoGeneration.rebuild( outline );
	    };
	    
	    var outline = BezierPath.fromJSON( DEFAULT_BEZIER_JSON );
	    for( var i = 0; i < outline.bezierCurves.length; i++ ) {
		var curve = outline.bezierCurves[i];
		curve.startPoint.listeners.addDragListener( dragListener );
		curve.startControlPoint.listeners.addDragListener( dragListener );
		curve.endControlPoint.listeners.addDragListener( dragListener );
		if( i > 0 )
		    curve.startPoint.attr.bezierAutoAdjust = true;
		if( i+1 == outline.bezierCurves.length )
		    curve.endPoint.listeners.addDragListener( dragListener );
	    }
	    
	    // +---------------------------------------------------------------------------------
	    // | Draw some stuff before rendering?
	    // +-------------------------------
	    var preDraw = function() {
		
	
	    };
	    


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
		pointCount   : 3
	    }, GUP );
	    


	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();

		/* var f0 = gui.addFolder('Colors');
		f0.addColor(config.colors.trisectors, 0).onChange( function() { pb.redraw(); } ).name('Trisector A').title('The first trisector');
		f0.addColor(config.colors.trisectors, 1).onChange( function() { pb.redraw(); } ).name('Trisector B').title('The second trisector');
		f0.addColor(config.colors.trisectors, 2).onChange( function() { pb.redraw(); } ).name('Trisector C').title('The third trisector');
		f0.addColor(config.colors, 'hexagon').onChange( function() { pb.redraw(); } ).name('Hexagon').title('The hexagon color');
		f0.addColor(config.colors, 'triangle').onChange( function() { pb.redraw(); } ).name('Triangle').title('The triangle color');
		
		var f1 = gui.addFolder('Points');
		f1.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate points').title('Animate points.');
		f1.open();
		*/
	    }

	    pb.config.preDraw = preDraw;
	    pb.add( outline ); // This will trigger the initial postDraw/draw/redraw call
	    rebuild();
	    
	} );
    
})(window); 


