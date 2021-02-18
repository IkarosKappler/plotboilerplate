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
		animate               : true,
		phaseX                : 0.0,
		scaleY                : 25.0,
		stepSizeX             : 0.5,
		lineWidth             : 2.0
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
	    installInputListeners( 1, addFunction('sin(x*20)*2') );
	    installInputListeners( 2, addFunction('sin(x)' ));
	    installInputListeners( 3, addFunction('x') );
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | This is the part where the magic happens
	    // +-------------------------------
	    var inputRangeX = new Interval(0, Math.PI*2); 
	    var redraw = function() {

		var viewport = pb.viewport();
		var drawRangeX = new Interval( _x( -pb.canvasSize.width/2 ), _x( pb.canvasSize.width/2 ) );
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
	    };

	    var evalFunction = function( fn, inputRangeX, outputRangeX, color ) {
		var x = inputRangeX.min; 
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
		f0.add(config, 'scaleY').min(0.25).max(200.0).step(0.25).title('Vertical scale.').onChange( function() { pb.redraw(); } );
		f0.add(config, 'lineWidth').min(1).max(20).title('The line with to use.').onChange( function() { pb.redraw(); } );
		f0.add(config, 'animate').title('Toggle phase animation on/off.').onChange( startAnimation );
		
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
		pb.redraw();
	    }
	    
	} );
    
})(window); 

