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
 * @date        2021-02-01
 * @version     1.0.0
 **/


// TODOs:
//  * colors for function inputs
//  * crop renderer to visible area (performance)
//  * fix grid for extreme large zoom levels


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
		      autoAdjustOffset       : true,
		      offsetAdjustXPercent   : 2, // 2%
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
		animate               : true,
		phaseX                : 0.0,
		scaleY                : 0.25, // 25.0,
		stepSizeX             : 0.05,
		lineWidth             : 2.0,
		fitToRange            : function() { setView( viewRangeX, viewRangeY ); }
	    }, GUP );

	    var time = 0;

	    var randColor = function( i ) {
		return WebColorsContrast[ i % WebColorsContrast.length ].cssRGB();
	    };
	    
	    var _x = function(x) { return pb.draw.offset.x + x * pb.draw.scale.x; };
	    var _y = function(y) { return pb.draw.offset.y + y * pb.draw.scale.y; };

	    // var modal = new Modal();

	    // Array of { color : string, inputElement : HTMLInputElement, parsedFunction : matjhs.function }
	    var functionCache = [];

	    // +---------------------------------------------------------------------------------
	    // | Add a new function to the input panel.
	    // +-------------------------------
	    var addFunction = function( expression ) {
		var input = document.createElement('input');
		var index = functionCache.length;
		var color = randColor(index);
		input.style.borderLeft = "3px solid " + color;
		input.setAttribute('value', expression );
		var left = document.getElementById('function-wrapper');
		left.appendChild( input );

		var parsed = math.parse(expression);
		functionCache.push( {
		    parsedFunction : function(x) { return parsed.evaluate({ x : x }) },
		    color : color,
		    inputElement : input
		} );
		return input;
	    };


	    // +---------------------------------------------------------------------------------
	    // | Install input listeners to the given input element and function.
	    // +-------------------------------
	    var installInputListeners = function( index, inputElement ) {
		// Add input function
		inputElement.addEventListener('change', function(event) {
		    var term = event.target.value;
		    console.log('new term', term  );
		    try {
			var parsed = math.parse(term);
			console.log( 'parsed', parsed );
			if( !parsed ) {
			    if( humane )
				humane.log('Parse Error: ' + term );
			    return;
			}
			functionCache[index].parsedFunction = function(x) { return parsed.evaluate({ x : x }) };
			pb.redraw();
		    } catch( err ) {
			console.log( err.message );
			if( humane )
			    humane.log('Parse Error: "' + term + '". ' + err.message  );
		    }
		} );
		inputElement.addEventListener('keyup', function(e) {
		    console.log('new term', e.target.value );
		    
		} );
	    };

	    installInputListeners( 0, addFunction('sin(x*10)') );
	    installInputListeners( 1, addFunction('sin(x*20)*x') );
	    installInputListeners( 2, addFunction('sin(x)' ));
	    installInputListeners( 3, addFunction('x') );
	    

	    var inputRangeX = new Interval(0, Math.PI*2);
	    var inputRangeY = new Interval(-1, 1);
	    
	    var viewRangeX = new Interval( inputRangeX.min -0.1, inputRangeX.max +0.1);
	    var viewRangeY = new Interval( inputRangeY.min -0.1, inputRangeY.max +0.1);
    
	    var rulerV     = new Ruler( inputRangeX.min,
					inputRangeY.min, inputRangeY.max,
					0.0, 0.25, "vertical", 20 );
	    var rulerH     = new Ruler( inputRangeY.min + inputRangeY.length()/2, // middle of interval?
					inputRangeX.min, inputRangeX.max,
					0.0, 0.25, "horizontal", 20 );
	    
	    // var mapX
	    var setView = function( rangeX, rangeY ) {
		pb.config.scaleX = pb.draw.scale.x = pb.fill.scale.x = pb.canvasSize.width / rangeX.length();
		pb.config.scaleY = pb.draw.scale.y = pb.fill.scale.y = pb.canvasSize.height / rangeY.length();
		console.log( "setView", pb.config.scaleX, pb.config.scaleY );
		pb.adjustOffset( true ); // redraw=true
		// pb.redraw();
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | This is the part where the magic happens
	    // +-------------------------------
	     
	    var redraw = function() {
		// Draw rulers
		// rulerV.draw( pb.draw, 'white' );
		// rulerH.draw( pb.draw, 'green' );

		// functionDraw();
		drawScalingTestPath();
	    };

	    var functionDraw = function() {
		var viewport = pb.viewport();
		/* var drawRangeX = new Interval( _x( 0 ), // -pb.canvasSize.width/2 ),
					       _x( pb.canvasSize.width ) //  pb.canvasSize.width/2 )
					       ); */
		// Crop the input range left and right (do not draw stuff outside the viewport)
		var croppedInputRangeX = new Interval( Math.max(inputRangeX.min, viewport.min.x),
						       Math.min(inputRangeX.max, viewport.max.x)
						    );
		for( var i = 0; i < functionCache.length; i++ ) {
		    evalFunction( functionCache[i].parsedFunction,
				  croppedInputRangeX, // inputRangeX,
				  // drawRangeX,
				  functionCache[i].color
				);
		}
	    };

	    var evalFunction = function( fn, inputRangeX, /*outputRangeX,*/ color ) {
		var stepCount = 512;
		var svgData = [];

		for( var i = 0; i <= stepCount; i++ ) {
		    var tX = i/stepCount;
		    var xVal = inputRangeX.valueAt( tX );
		    var yVal = -fn( xVal ) * config.scaleY;

		    // svgData.push( i==0 ? 'M' : 'L', _x(xVal), _y(yVal) );
		    svgData.push( i==0 ? 'M' : 'L', xVal, yVal ); 
		}

		drawutilssvg.transformPathData( svgData, pb.draw.offset, pb.draw.scale );
		
		pb.draw.ctx.strokeStyle = color;
		pb.draw.ctx.lineWidth = config.lineWidth;
		pb.draw.ctx.stroke( new Path2D(svgData.join(" ")) );
	    };

	    var drawScalingTestPath = function() {
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
		// Print and draw on the canvas.
		console.log('svgTestData', svgDataAbsolute );	
		drawutilssvg.transformPathData( svgDataAbsolute, pb.draw.offset, pb.draw.scale );
		pb.draw.ctx.strokeStyle = 'rgb(255,0,0)';
		pb.draw.ctx.lineWidth = 2;
		pb.draw.ctx.stroke( new Path2D(svgDataAbsolute.join(" ")) );

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
		// Print and draw on the canvas (and move 25 units to see them better)
		console.log('svgTestDataRelative', svgDataRelative );
		drawutilssvg.transformPathData( svgDataRelative, {x:25,y:0}, {x:1,y:1} );
		drawutilssvg.transformPathData( svgDataRelative, pb.draw.offset, pb.draw.scale );
		pb.draw.ctx.strokeStyle = 'rgb(0,255,0)';
		pb.draw.ctx.lineWidth = 2;
		pb.draw.ctx.stroke( new Path2D(svgDataRelative.join(" ")) );
	    };

	    /* 
	    var oldFunctionDraw = function() {
		
		var viewport = pb.viewport();
		var drawRangeX = new Interval( _x( 0 ), // -pb.canvasSize.width/2 ),
					       _x( pb.canvasSize.width ) //  pb.canvasSize.width/2 )
					     );
		var tmpInput = new Interval( Math.max( viewport.min.x, inputRangeX.min ),
					     Math.min( viewport.max.x, inputRangeX.max) );
		
		console.log( "input", tmpInput, "drawRangeX", drawRangeX );

		for( var i = 0; i < functionCache.length; i++ ) {
		    var coords = evalFunction( functionCache[i].parsedFunction,
					       tmpInput,
					       drawRangeX,
					       functionCache[i].color
					     );
		}
		// var dist = 0.2;
	    }; */

	    /*
	    var old_evalFunction = function( fn, inputRangeX, outputRangeX, color ) {
		var x = inputRangeX.min;
		console.log('inputRangeX.min', inputRangeX.min);
		var svgData = [];
		var coords = [];

		var zoomedStepSize = (config.stepSizeX / inputRangeX.length()) / pb.draw.scale.x;
		var i = 0;
		while( x < inputRangeX.max ) {
		    var xPct = (x-inputRangeX.min) / inputRangeX.length();
		    var xVal = config.phaseX + x; 
		    var yVal = -fn( xVal ) * config.scaleY;
		    var xCoord = outputRangeX.min + xPct * outputRangeX.length();
		    svgData.push( i==0 ? 'M' : 'L', xCoord, _y(yVal) );
		    coords.push( { x : xCoord, y : _y(yVal) } );
		    
		    x += zoomedStepSize;
		    i++;
		}
	
		pb.draw.ctx.strokeStyle = color;
		pb.draw.ctx.lineWidth = config.lineWidth;
		pb.draw.ctx.stroke( new Path2D(svgData.join(" ")) );

		return coords;
	    }; 
	    */

	
	    var renderLoop = function(_time) {
		if( !config.animate ) {
		    time = 0;
		    pb.redraw();
		    return;
		}
		time = _time;
		// Animate inside inputRangeX
		var width = inputRangeX[1]-inputRangeX[0];
		config.phaseX = inputRangeX[0] + ((time/50000)*width)%(width);
		pb.redraw();
		window.requestAnimationFrame( renderLoop );
	    }
	    
	    
	    var startAnimation = function() {
		window.requestAnimationFrame(renderLoop);
		// pb.redraw();
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

		f0.add(config, 'stepSizeX').min(0.05).max(5.0).step(0.05).title('Value step size on the x axis.').onChange( function() { pb.redraw(); } );
		f0.add(config, 'scaleY').min(0.25).max(2.0).step(0.05).title('Vertical scale.').onChange( function() { pb.redraw(); } );
		f0.add(config, 'lineWidth').min(1).max(20).title('The line with to use.').onChange( function() { pb.redraw(); } );
		f0.add(config, 'animate').title('Toggle phase animation on/off.').onChange( startAnimation );
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

