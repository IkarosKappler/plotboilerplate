/**
 * A demo about rendering SVG path data with PlotBoilerplate.
 *
 * @requires PlotBoilerplate 
 * @requires MouseHandler 
 * @requires gup
 * @requires dat.gui
 * @requires draw
 * 
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-02-22
 * @version     1.0.0
 **/


(function(_context) {
    "use strict";

    // Fetch the GET params
    let GUP = gup();
    
    window.addEventListener(
	'load',
	function() {
	    // All config params are optional.
	    // console.log( 'init. canvas: ', document.getElementById('my-canvas') );
	    var pb = new PlotBoilerplate(
		PlotBoilerplate.utils.safeMergeByKeys(
		    { canvas                 : document.getElementById('my-canvas'),
		      fullSize               : true,
		      fitToParent            : true,
		      scaleX                 : 1.0,
		      scaleY                 : 1.0,
		      rasterGrid             : true,
		      drawOrigin             : false,
		      rasterAdjustFactor     : 2.0,
		      redrawOnResize         : true,
		      defaultCanvasWidth     : 1024,
		      defaultCanvasHeight    : 768,
		      canvasWidthFactor      : 1.0,
		      canvasHeightFactor     : 1.0,
		      cssScaleX              : 1.0,
		      cssScaleY              : 1.0,
		      drawBezierHandleLines  : true,
		      drawBezierHandlePoints : true,
		      cssUniformScale        : true,
		      autoAdjustOffset       : false, // true,
		      offsetAdjustXPercent   : 50,
		      offsetAdjustYPercent   : 50,
		      backgroundColor        : '#ffffff',
		      enableMouse            : true,
		      enableTouch            : true,
		      enableKeys             : true,
		      enableSVGExport        : false
		    }, GUP
		)
	    );

	    pb.config.postDraw = function() { 
		redraw();
	    };

	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		lineWidth             : 2.0,
		fitToRange            : function() { setView( viewRangeX, viewRangeY ); }
	    }, GUP );

	    var time = 0;

	    var randColor = function( i ) {
		return WebColorsContrast[ i % WebColorsContrast.length ].cssRGB();
	    };

	    // Define a shape with SVG path data attributes only with _absolute_
	    // path commands.
	    var svgDataAbsolute = [
		'M', -10, -7.5,
		    'V', -10, 
		    'L', 0, -10,
		    'C', -5, -15, 10, -15, 5, -10,
		    'H', 10,
		    'C', 5, -7.5, 5, -7.5, 10, -5,
		    'S', 15, 0, 10, 0,
		    'Q', 5, 5, 0, 0,
		    'T', -10, 0,
		    'A', 5, 4, 0, 1, 1, -10, -5,    
		    'Z'
	    ];
	    
	    // Now define the same shape. But only y with _relative_
	    // path commands.
	    var svgDataRelative = [
		'M', -10, -7.5,
		'v', -2.5, 
		'l', 10, 0,
		'c', -5, -5, 10, -5, 5, 0,
		'h', 5,
		'c', -5, 2.5, -5, 2.5, 0, 5,
		's', 5, 5, 0, 5,
		'q', -5, 5, -10, 0,
		't', -10, 0,
		'a', 5, 4, 0, 1, 1, 0, -5,    
		'z'
	    ];
	    drawutilssvg.transformPathData( svgDataRelative, {x:25,y:0}, {x:1,y:1} );

	    var viewRangeX = new Interval( -11, 52 );
	    var viewRangeY = new Interval( -11, 22 );
   
	    var setView = function( rangeX, rangeY ) {
		pb.config.scaleX = pb.draw.scale.x = pb.fill.scale.x = pb.canvasSize.width / rangeX.length();
		pb.config.scaleY = pb.draw.scale.y = pb.fill.scale.y = pb.canvasSize.height / rangeY.length();
		pb.config.offsetX = pb.draw.offset.x = pb.fill.offset.x = pb.canvasSize.width / 3;
		pb.config.offsetY = pb.draw.offset.y = pb.fill.offset.y = pb.canvasSize.height / 1.5;
		//pb.adjustOffset( true ); // redraw=true
		pb.redraw();
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | This is the part where the magic happens
	    // +-------------------------------
	     
	    var redraw = function() {
		// Print and draw on the canvas.
		console.log('svgTestData', svgDataAbsolute );	
		// drawutilssvg.transformPathData( svgDataAbsolute, pb.draw.offset, pb.draw.scale );
		pb.draw.path( svgDataAbsolute, 'rgb(255,0,0)', config.lineWidth, false );

		// Print and draw on the canvas (and move 25 units to see them better)
		console.log('svgTestDataRelative', svgDataRelative );
		// drawutilssvg.transformPathData( svgDataRelative, pb.draw.offset, pb.draw.scale );
		pb.draw.path( svgDataRelative, 'rgb(0,255,0)', config.lineWidth, false );
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
	    

	    var stats = {
		mouseX : 0,
		mouseY : 0
	    }
	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI();
		var f0 = gui.addFolder('Points');

		f0.add(config, 'lineWidth').min(1).max(20).title('The line with to use.').onChange( function() { pb.redraw(); } );
		f0.add(config, 'fitToRange').title('Reset view to best range fit.');	
		f0.open();

		// Add stats
		var uiStats = new UIStats( stats );
		stats = uiStats.proxy;
		uiStats.add( 'mouseX' );
		uiStats.add( 'mouseY' );
	    }

	    		
	    // Will stop after first draw if config.animate==false
	    if( config.animate ) {
		startAnimation();
	    } else {
		setView( viewRangeX, viewRangeY );
		pb.redraw();
	    }
	    
	} );
    
})(window); 

