/**
 * A demo to render function graphs.
 *
 * @requires PlotBoilerplate
 * @requires PlotBoilerplate 
 * @requires MouseHandler 
 * @requires gup
 * @requires dat.gui
 * @requires draw
 * 
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-10-04
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
	    // var pb = new PlotBoilerplate(
		// PlotBoilerplate.utils.safeMergeByKeys(
		//     { canvas                 : document.getElementById('my-canvas'),
		//       fullSize               : true,
		//       fitToParent            : true,
		//       scaleX                 : 1.0,
		//       scaleY                 : 1.0,
		//       rasterGrid             : true,
		//       drawOrigin             : false,
		//       rasterAdjustFactor     : 2.0,
		//       redrawOnResize         : false, // !!! true,
		//       defaultCanvasWidth     : 1024,
		//       defaultCanvasHeight    : 768,
		//       canvasWidthFactor      : 1.0,
		//       canvasHeightFactor     : 1.0,
		//       cssScaleX              : 1.0,
		//       cssScaleY              : 1.0,
		//       drawBezierHandleLines  : true,
		//       drawBezierHandlePoints : true,
		//       cssUniformScale        : true,
		//       autoAdjustOffset       : true,
		//       offsetAdjustXPercent   : 0,
		//       offsetAdjustYPercent   : 0,
		//       backgroundColor        : '#ffffff',
		//       enableMouse            : true,
		//       enableTouch            : true,
		//       enableKeys             : true,
		//       enableSVGExport        : false
		//     }, GUP
		// )
	    // );

	    // pb.config.postDraw = function() { 
		// 	console.log("Post draw");


	    // };

		// Create fake SVG node
		// const svgNode : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		var svgNode = document.getElementById("my-canvas");
		// // var svgNode = document.getElementById('preview-svg');
		// // Draw everything to fake node.
		var canvasSize = getAvailableContainerSpace(svgNode);
		console.log( getAvailableContainerSpace(svgNode) );
		var tosvgDraw = new drawutilssvg( 
						svgNode, 
						{ x: 0, y: 0 }, // pb.draw.offset, 
						{ x : 1, y : 1 }, // pb.draw.scale,
						canvasSize, // pb.canvasSize,
						false, // fillShapes=false
						{} // pb.drawConfig
						);
		var tosvgFill = tosvgDraw.copyInstance( true ); // fillShapes=true

		// tosvgDraw.beginDrawCycle(0);
		// tosvgFill.beginDrawCycle(0);
		// tosvgDraw.clear( pb.config.backgroundColor );

		var initMaze = function() {
			var squareSize = { 
				w : canvasSize.width/config.mazeWidth,
				h : canvasSize.height/config.mazeHeight 
			};
			tosvgDraw.beginDrawCycle();
			tosvgFill.beginDrawCycle();
			for( var i = 0; i < config.mazeWidth; i++ ) {
				for( var j = 0; j < config.mazeHeight; j++ ) {
					// Make square
					tosvgFill.rect( { x: i*squareSize.w, y: j*squareSize.h }, squareSize.w+1, squareSize.h+1, '#000000', 1 );
				}
			}
			tosvgDraw.endDrawCycle();
			tosvgFill.endDrawCycle();
		};

	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
			animate               : true,
			phaseX                : 0.0,
			scaleY                : 25.0,
			stepSizeX             : 2.0,
			lineWidth             : 2.0,

			mazeWidth             : 30,
			mazeHeight            : 20
	    }, GUP );

	    var time = 0;
   
	
	    // var renderLoop = function(_time) {
		// 	if( !config.animate ) {
		// 		time = 0;
		// 		pb.redraw();
		// 		return;
		// 	}
		// 	time = _time;
		// 	// Animate here
		// 	// ...

		// 	pb.redraw();
		// 	window.requestAnimationFrame( renderLoop );
	    // }
	    
	    
	    var startAnimation = function() {
			window.requestAnimationFrame(renderLoop);
	    };


	    // +---------------------------------------------------------------------------------
	    // | Install a mouse handler to display current pointer position.
	    // +-------------------------------
	    // new MouseHandler(pb.eventCatcher,'drawsvg-demo')
		// 	.move( function(e) {
		// 		// Display the mouse position
		// 		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		// 		stats.mouseX = relPos.x;
		// 		stats.mouseY = relPos.y;
		// } ); 
	    

	    var stats = {
			mouseX : 0,
			mouseY : 0
	    }
	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
		// {
		// 	var gui = pb.createGUI();
		// 	var f0 = gui.addFolder('Points');

		// 	f0.add(config, 'stepSizeX').min(0.25).max(12).step(0.25).title('Value step size on the x axis.').onChange( function() { pb.redraw(); } );
		// 	f0.add(config, 'scaleY').min(0.25).max(200.0).step(0.25).title('Vertical scale.').onChange( function() { pb.redraw(); } );
		// 	f0.add(config, 'lineWidth').min(1).max(20).title('The line with to use.').onChange( function() { pb.redraw(); } );
		// 	f0.add(config, 'animate').title('Toggle phase animation on/off.').onChange( startAnimation );
			
		// 	f0.open();

		// 	// Add stats
		// 	var uiStats = new UIStats( stats );
		// 	stats = uiStats.proxy;
		// 	uiStats.add( 'mouseX' );
		// 	uiStats.add( 'mouseY' );
	    // }

		initMaze();
	    		
	    // // Will stop after first draw if config.animate==false
	    // if( config.animate ) {
		// 	startAnimation();
	    // } else {
		// 	pb.redraw();
	    // }
	    
	} );
    
})(window); 

