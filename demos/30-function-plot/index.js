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
		animate               : false,
		phaseX                : 0.0,
		scaleY                : 0.25,
		// stepSizeX             : 0.05,
		stepCount             : 512,
		lineWidth             : 2.0,
		fitToRange            : function() { setView( viewRangeX, viewRangeY ); }
	    }, GUP );

	    var time = 0;

	    var randColor = function( i ) {
		return WebColorsContrast[ i % WebColorsContrast.length ].cssRGB();
	    };

	    document.getElementById('addFnBtn').addEventListener( 'click', function() {
		installInputListeners( addFunction('cos(x)') );
		pb.redraw();
	    } );

	    // Array of { id : number, color : string, inputElement : HTMLInputElement, parsedFunction : matjhs.function }
	    var functionCache = [];

	    var locateFnById = function( id ) {
		for( var i = 0; i < functionCache.length; i++ ) {
		    if( functionCache[i].id == id )
			return i;
		}
		return -1;
	    };

	    // +---------------------------------------------------------------------------------
	    // | Add a new function to the input panel.
	    // +-------------------------------
	    var addFunction = function( expression ) {
		var input = document.createElement('input');
		var id = functionCache.length;
		var color = randColor(id);
		input.style.borderLeft = "3px solid " + color;
		input.setAttribute('value', expression );
		var left = document.getElementById('function-wrapper');
		// left.appendChild( input );

		var container = document.createElement('div');
		container.setAttribute('class','container');
		container.setAttribute('id','container-'+id);
		var button = document.createElement('button');
		button.innerHTML = "-";
		button.addEventListener( 'click', function() { removeFunction(id); } );
		container.appendChild( input );
		container.appendChild( button );
		left.insertBefore( container, // input,
				   document.getElementById('addFnBtn') );
		

		var parsed = math.parse(expression);
		var fnElement = {
		    id : id,
		    parsedFunction : function(x) { return parsed.evaluate({ x : x }) },
		    color : color,
		    inputElement : input
		};
		functionCache.push( fnElement );
		return fnElement; // input;
	    };

	    var removeFunction = function( id ) {
		var index = locateFnById(id);
		functionCache.splice(index,1);
		var element = document.getElementById('container-'+id);
		console.log(element);
		element.remove();
		pb.redraw();
	    };

	    // +---------------------------------------------------------------------------------
	    // | Install input listeners to the given input element and function.
	    // +-------------------------------
	    var installInputListeners = function( fnElement ) {
		// Add input function
		fnElement.inputElement.addEventListener('change', function(event) {
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
			var index = locateFnById( fnElement.id );
			functionCache[index].parsedFunction = function(x) { return parsed.evaluate({ x : x }) };
			pb.redraw();
		    } catch( err ) {
			console.log( err.message );
			if( humane )
			    humane.log('Parse Error: "' + term + '". ' + err.message  );
		    }
		} );
		fnElement.inputElement.addEventListener('keyup', function(e) {
		    console.log('new term', e.target.value );
		    
		} );
	    };

	    installInputListeners( addFunction('sin(x*10)') );
	    installInputListeners( addFunction('sin(x*20)*x') );
	    installInputListeners( addFunction('sin(x)') );
	    installInputListeners( addFunction('x') );
	    

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
		rulerV.draw( pb.draw, 'white' );
		rulerH.draw( pb.draw, 'green' );

		functionDraw();
	    };

	    var functionDraw = function() {
		var viewport = pb.viewport();
		// Crop the input range left and right (do not draw stuff outside the viewport)
		var croppedInputRangeX = new Interval( Math.max(inputRangeX.min, viewport.min.x),
						       Math.min(inputRangeX.max, viewport.max.x)
						    );
		for( var i = 0; i < functionCache.length; i++ ) { 
		    evalFunction( functionCache[i].parsedFunction,
				  croppedInputRangeX,
				  functionCache[i].color
				);
		}
	    };

	    var evalFunction = function( fn, inputRangeX, color ) {
		var svgData = [];

		for( var i = 0; i <= config.stepCount; i++ ) {
		    var tX = i/config.stepCount;
		    var xVal = inputRangeX.valueAt( tX );
		    var yVal = -fn( xVal ) * config.scaleY;
		    svgData.push( i==0 ? 'M' : 'L', xVal, yVal ); 
		}

		pb.draw.path( svgData, color, config.lineWidth );
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

		f0.add(config, 'stepCount').min(1).max(1028).step(10).title('Number of steps on the x axis.').onChange( function() { pb.redraw(); } );
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

