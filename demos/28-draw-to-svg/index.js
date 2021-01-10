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
	// | Use a helper function to build all demo-drawables.
	// +-------------------------------
	var drawables = createDemoDrawables( pb.viewport(), // canvasSize,
					     '../../example-image.png',
					     function() { pb.redraw(); }
					   );
	pb.add( drawables );


	var drawAll = function() {
	    // TODO: draw everything to SVG
	    try {
		var svgNode = document.getElementById('preview-svg');
		// clearChildren( svgNode );
		var tosvg = new drawutilssvg( svgNode, pb.draw.offset, pb.draw.scale,
					      pb.canvasSize, /* pb.viewport(), */ false );
		tosvg.clear();
		// tosvg.label('My Label', 0, 0, 45/180*Math.PI );

		pb.drawAll( new Date().getMilliseconds(), tosvg, tosvg );

	    } catch( e ) {
		console.error( e );
	    }
	};

	
	// +---------------------------------------------------------------------------------
	// | Experimental: export SVG files by serializing SVG nodes from the DOM.
	// +-------------------------------
	var exportSVG = function() {
	    var svgNode = document.getElementById('preview-svg');
	    // Full support in all browsers \o/
	    //    https://caniuse.com/xml-serializer
	    var serializer = new XMLSerializer();
	    var svgCode = serializer.serializeToString(svgNode);

	    var blob = new Blob([svgCode], { type: "image/svg;charset=utf-8" } );
	    // See documentation for FileSaver.js for usage.
	    //    https://github.com/eligrey/FileSaver.js
	    if( typeof globalThis["saveAs"] != "function" )
		throw "Cannot save file; did you load the ./utils/savefile helper function and the eligrey/SaveFile library?";
	    var _saveAs = globalThis["saveAs"];
	    _saveAs(blob, "svg-demo.svg");   
	};

	// +---------------------------------------------------------------------------------
	// | Install a mouse handler to display current pointer position.
	// +-------------------------------
	new MouseHandler(pb.canvas,'drawsvg-demo')
	    .move( function(e) {
		// Display the mouse position
		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
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
	    drawSectorLines        : false,
	    // TODO: when working this should replace the default SVG export function
	    svgDownload            : function() { exportSVG(); }
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
	    gui.add(config, 'svgDownload').onChange( function() { pb.redraw(); } ).name('svgDownload').title('Download the SVG node as an *.svg file.');

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


