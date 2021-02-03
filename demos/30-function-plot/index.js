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

	    /* var colors = [
		'rgb(0,192,192)',
		'rgb(192,0,192)',
		'rgb(192,192,0)'
	    ]; */

	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		animate               : true,
		phaseX                : 0.0,
		scaleY                : 25.0,
		stepSizeX             : 2.0,
		lineWidth             : 2.0
	    }, GUP );

	    var time = 0;

	    var randColor = function( i ) {
		return WebColorsContrast[ i % WebColorsContrast.length ].cssRGB();
	    };
	    
	    var _x = function(x) { return pb.draw.offset.x + x * pb.draw.scale.x; };
	    var _y = function(y) { return pb.draw.offset.y + y * pb.draw.scale.y; };

	    var modal = new Modal();

	    // +---------------------------------------------------------------------------------
	    // | ...
	    // +-------------------------------
	    /* var showModal = function() {
		function saveFile( data, filename ) {
		    // saveAs( new Blob( [ data ], { type: 'application/sla' } ), filename );
		    console.log('xxx');
		}
		modal.setTitle( "Export STL" );
		modal.setFooter( "" );
		modal.setActions( [ { label : 'Cancel', action : function() { modal.close(); console.log('canceled'); } } ] );
		modal.setBody( "Loading ..." ); 
		modal.open(); 
		// modal.setActions( [ Modal.ACTION_CLOSE ] );
	    }; */

	    var functionCache = [];

	    var addFunction = function( expression ) {
		var input = document.createElement('input');
		input.setAttribute('value', expression );
		var left = document.getElementById('function-wrapper');
		left.appendChild( input );

		var parsed = math.parse(expression);
		functionCache.push( function(x) { return parsed.evaluate({ x : x }) } );
		return input;
	    };
	    addFunction('sin(x*10)');
	    addFunction('sin(x*20)*2');
	    addFunction('sin(x*2)');

	    
	    // Add input function
	    var index = functionCache.length;
	    var input = addFunction('x');
	    input.addEventListener('change', function(e) {
		console.log('new term', e.target.value );
		var parsed = math.parse(e.target.value);
		console.log( 'parsed', parsed );
		if( !parsed ) {
		    console.log("ERROR");
		    return;
		}
		functionCache[index] = function(x) { return parsed.evaluate({ x : x }) };
		pb.redraw();
	    } );
	    input.addEventListener('keyup', function(e) {
		console.log('new term', e.target.value );
		
	    } );
	    
	    
	    // +---------------------------------------------------------------------------------
	    // | This is the part where the magic happens
	    // +-------------------------------
	    var inputRangeX = [0, Math.PI*2];
	    var redraw = function() {

		var viewport = pb.viewport();
		var outputRangeX = [ _x( -pb.canvasSize.width/2 ), _x(  pb.canvasSize.width/2 ) ];

		for( var i = 0; i < functionCache.length; i++ ) {
		    var coords = calcFunction( functionCache[i], inputRangeX, outputRangeX, randColor(i) );
		}

		var dist = 0.2;
		/* for( var i = 0; i < coordsA.length; i++ ) {
		    var cA = coordsA[i];
		    // console.log( cA );
		    for( var j = i-10; j < i+10; j++ ) {
			if( j < 0 || j >= coordsB.length )
			    continue;
			var cB = coordsB[j];

			if( Math.sqrt( (cB.x-cA.x)*(cB.x-cA.x) + (cB.y-cA.y)*(cB.y-cA.y)) < 1 ) {
			    pb.draw.line( cA, cB, 'rgba(192,192,192)', 1.0 ); 
			}
		    }
		} */
	    };

	    var calcFunction = function( fn, inputRangeX, outputRangeX, color ) {
		var x = outputRangeX[0];
		var svgData = [];
		var coords = [];

		var i = 0;
		while( x < outputRangeX[1] ) {
		    var xPct = (x-outputRangeX[0]) / (outputRangeX[1]-outputRangeX[0]);
		    var xVal = config.phaseX + xPct * (inputRangeX[1]-inputRangeX[0]);
		    var yVal = fn( xVal ) * config.scaleY;
		    svgData.push( i==0 ? 'M' : 'L', x, _y(yVal) );
		    coords.push( { x : x, y : _y(yVal) } );
		    
		    x += config.stepSizeX;
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

		f0.add(config, 'stepSizeX').min(0.25).max(12).step(0.25).title('Value step size on the x axis.').onChange( function() { pb.redraw(); } );
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

