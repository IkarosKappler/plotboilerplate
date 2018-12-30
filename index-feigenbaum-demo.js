/**
 * A demo script for the feigenbaum demo plot.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2018-12-09
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
	     var bp = new PlotBoilerplate(
		PlotBoilerplate.utils.safeMergeByKeys(
		    { canvas                : document.getElementById('my-canvas'),					    
		      fullSize              : true,
		      fitToParent           : true,
		      scaleX                : 1.0,
		      scaleY                : 1.0,
		      rasterGrid            : true,
		      drawOrigin            : true,
		      rasterAdjustFactor    : 2.0,
		      redrawOnResize        : false,
		      defaultCanvasWidth    : 1024,
		      defaultCanvasHeight   : 768,
		      cssScaleX             : 1.0,
		      cssScaleY             : 1.0,
		      autoAdjustOffset      : true,
		      offsetAdjustXPercent  : 0,   // auto-adjust to left- ...
		      offsetAdjustYPercent  : 100, // ... -lower corner
		      backgroundColor       : '#ffffff',
		      enableMouse           : false,
		      enableKeys            : false
		    }, GUP
		)
	    );
	    bp.config.autoCenterOffset = false; // Only once at initialization
	    bp.config.preDraw = function() {
		// pre draw
		// drawPlotLabel();
	    };
	    bp.config.postDraw = function() {
		// post draw
		drawBufferedFeigenbaum();
	    };

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    var gui = bp.createGUI();

	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		plotX0                : 0.2,
		plotIterations        : 500,
		plotStart             : 3.2,
		plotEnd               : 3.83,
		plotStep              : 0.1,
		plotChunkSize         : 1.0,
		bufferData            : false,
		drawLabel             : false,
		normalizePlot         : true,
		normalizeToMin        : 0.0,
		normalizeToMax        : 1.0, 
		alphaThreshold        : 0.05,	

		rebuild               : function() { console.log('Rebuilding ... '); rebuild(); },
		stampLabel            : function() { drawPlotLabel(); }
	    }, GUP );
	    
	    console.log( JSON.stringify(config) );
	    var fold2 = gui.addFolder('Plot settings');
	    fold2.add(config, 'plotX0').title('Set the x0 value to start the logistic function at.').min(0.01).max(2.0).step(0.01);
	    fold2.add(config, 'plotIterations').title('Set the number of max iterations for the logistic function.').min(1).max(10000).step(1);
	    fold2.add(config, 'plotStart').title('Set the lambda value to start at.').min(3.0).max(4.2).step(0.001).listen();
	    fold2.add(config, 'plotEnd').title('Set to lambda value to stop at.').min(3.2).max(20.0).step(0.001).listen();
	    fold2.add(config, 'plotStep').title('Set the plot step. 1 means one lambda step per pixel.').min(0.0001).max(1.0).step(0.0001);
	    fold2.add(config, 'plotChunkSize').title('What chunk size should be used for updating. 1 means each pixel.').min(0.001).max(1.0).step(0.0001);
	    fold2.add(config, 'bufferData').title('If data is buffered more space is needed, if no buffers are used no redraw is possible.');
	    fold2.add(config, 'stampLabel').name('Stamp settings').title('Stamp a label with the current plot settings.');
	    
	    var fold22 = fold2.addFolder('Normalization');
	    fold22.add(config, 'normalizePlot').title('Scale the range [min..max6 to the full viewport height.').listen();
	    fold22.add(config, 'normalizeToMin').title('The minimal value for the normalization (default is 0.0).').step(0.005).listen();
	    fold22.add(config, 'normalizeToMax').title('The maximal value for the normalization (default is 1.0).').step(0.005).listen();
	    fold2.add(config, 'alphaThreshold').title('Specify the alhpa minimum to plot weighted samples (0: full transparency allowed, 1: no transparency at all).').min(0.0).max(1.0).step(0.05);
	    fold2.add(config, 'rebuild').name('Rebuild all').title('Rebuild all.');
	    // END init dat.gui
	    



	    // +---------------------------------------------------------------------------------
	    // | Here comes comes the Feigenbaum/Logistic-Map demo.
	    // +-------------------------------

	    // +---------------------------------------------------------------------------------
	    // | ================================================================================
	    // | | BEGIN: the math.
	    // | ==============================
	    // +-------------------------------
	    var bufferedFeigenbaum = [];
	    var plotFeigenbaum = function() {
		var startTime = new Date();
		bp.drawGrid();
		drawPlotLabel();
		dialog.show( 'Starting ...', 'Calculating', [ { label : 'Cancel', action : function() { console.log('cancel'); timeoutKey = null; dialog.hide(); } }], {} );
		bufferedFeigenbaum = [];
		iterativeFeigenbaum( [ Math.min(config.plotStart,config.plotEnd), Math.max(config.plotStart,config.plotEnd) ],
				     0, // currentX
				     0, // Start at left canvas border
				     bp.canvasSize.width, // Stop at right canvas border
				     config.plotStep,
				     config.plotChunkSize,
				     config.plotIterations,
				     config.plotX0,
				     config.plotScale,
				     function() {
					 var endTime = new Date();
					 // On really large canvases this fails in Firefox! (NS_ERROR_FAILURE)
					 if( config.drawPlotLabel ) 
					     drawLabel();	
					 console.log('Elapsed plotting time: ' + (endTime-startTime)/1000 + 's' );
				     }
				   );	    
	    }

	    // +---------------------------------------------------------------------------------
	    // | Draw a label with the current plot settings into the image.
	    // +-------------------------------
	    var drawPlotLabel = function() {
		bp.fill.ctx.font = '6pt Monospace';
		var label = 'range=['+Math.min(config.plotStart,config.plotEnd)+','+Math.max(config.plotStart,config.plotEnd)+'], normalizeTo=['+config.normalizeToMin+','+config.normalizeToMax+'], plotStep='+config.plotStep+', iterations='+config.plotIterations+', x0='+config.plotX0+', normalize='+config.normalizePlot+', alphaThreshold='+config.alphaThreshold;
		bp.fill.label(label,
			      (bp.canvasSize.width-bp.fill.ctx.measureText(label).width)/2, // 15,
			      10);

		// bp.fill.ctx.font = '6pt Monospace'
		// label = 'plotEnd=' + config.plotEnd;
		//label = 'normalizeToMax=' + config.normalizeToMax;
		label = 'normalizeToMin=' + config.normalizeToMin;
		bp.fill.label(label, 15, bp.canvasSize.height - 3 );
		
		//label = 'plotStart=' + config.plotStart;
		//label = 'normalizeToMin=' + config.normalizeToMin;
		label = 'normalizeToMax=' + config.normalizeToMax;
		//bp.fill.label(label, bp.canvasSize.width-bp.fill.ctx.measureText(label).width-3, bp.canvasSize.height - 3 );
		bp.fill.label(label, 3, 10 );

		//label = 'normalizeToMax=' + config.normalizeToMax;
		// label = 'plotEnd=' + config.plotEnd;
		label = 'plotStart=' + config.plotStart;
		bp.fill.label(label, 12, bp.canvasSize.height-12, -Math.PI/2 );
;
		//label = 'normalizeToMin=' + config.normalizeToMin;
		// label = 'plotStart=' + config.plotStart;
		label = 'plotEnd=' + config.plotEnd;
		// bp.fill.label(label, 12, bp.fill.ctx.measureText(label).width+12, -Math.PI/2 );
		bp.fill.label(label, bp.canvasSize.width-3, bp.canvasSize.height-3, -Math.PI/2 );
	    };
	    drawPlotLabel();

	    // +---------------------------------------------------------------------------------
	    // | A random key for the cancel button (iteration stops when timeoutKey==null).
	    // +-------------------------------
	    var timeoutKey = null;
	    
	    // +---------------------------------------------------------------------------------
	    // | An iterative, sequential implementation of the feigenbaum bifurcation calculation.
	    // +-------------------------------
	    var iterativeFeigenbaum = function( range, curX, minX, maxX, xStep, xChunkSize, plotIterations, x0, scaleFactor, onFinish ) {
		dialog.setMessage( 'curX=' + curX + ', maxX='+maxX + ', '+(((curX-minX)/(maxX-minX))*100).toPrecision(2)+'% complete<br>&lambda;='+ (range[0] + (range[1] - range[0])*(curX/(maxX-minX))).toPrecision(6)+'&hellip;' );
		var lambda;
		for( var x = curX; x < curX+xChunkSize; x += xStep ) {
		    lambda = range[0] + (range[1] - range[0])*(x/(maxX-minX));
		    //var result = logisticMap( x0, lambda, plotIterations, new WeightedCollection(), 0 );
		    var result = logisticMap( x0, lambda, plotIterations, new WeightedBalancedCollection(), 0 );
		    if( config.bufferData )
			bufferedFeigenbaum.push( { x : x, lambda : lambda, data : result } );
		    plotBalancedCollection( x, lambda, result, result.tree.root );
		}
		if( curX+xChunkSize < maxX ) {
		    timeoutKey = Math.random();
		    window.setTimeout( function() {
			if( timeoutKey == null )
			    return;
			timeoutKey = null;
			iterativeFeigenbaum( range, curX+xChunkSize, minX, maxX, xStep, xChunkSize, plotIterations, x0, scaleFactor, onFinish );
		    }, 1 );
		} else {	    
		    console.log('Done.');
		    if( typeof onFinish == 'function' ) onFinish();
		    dialog.hide();
		}
	    };

	    // +---------------------------------------------------------------------------------
	    // | The actual logistic function (recursive implementation).
	    // +-------------------------------
	    var logisticMap = function( value, lambda, iterations, collection ) {
		var next_value = lambda * value * ( 1 - value );
		// console.log( next_value );
		if( next_value == null || next_value == undefined || isNaN(next_value) || !isFinite(next_value) || typeof next_value == 'undefined' || iterations-- <= 0 )
		    return collection;
		collection.add( next_value );
		return logisticMap( next_value, lambda, iterations, collection );
	    }
	    // +---------------------------------------------------------------------------------
	    // | ==============================
	    // | | END: the math.
	    // | ==============================
	    // +-------------------------------

	    function drawBufferedFeigenbaum() {
		if( !config.bufferData )
		    return;
		console.log( 'Rendering buffered plot ...' );
		bp.drawGrid();
		var record = null;
		// Note: this for loop times out on really large sample sets!
		//   --> implement async drawing!
		for( var k in bufferedFeigenbaum ) {
		    record = bufferedFeigenbaum[k];
		    plotCollection( record.x, record.lambda, record.data );
		}
		console.log( 'Finished rendering.' );
	    }
	    
	    function plotBalancedCollection( x, lambda, data, node ) {
		if( !node || node.isNull() )
		    return;
		var value = node.key;
		var alpha = (config.alphaThreshold)+(node.value/data.tree.size)*(1-config.alphaThreshold);
		alpha = Math.max(0.0, Math.min(1.0, alpha));		
		if( config.normalizePlot )
		    value = normalizeYValue(value);		
		bp.draw.dot( { x : x, y : value }, 'rgba(0,127,255,'+alpha+')' );
		plotBalancedCollection( x, lambda, data, node.left );
		plotBalancedCollection( x, lambda, data, node.right );
	    }

	    function normalizeYValue(value) {
		return ((value-config.normalizeToMin)/(config.normalizeToMax-config.normalizeToMin)) * (1-bp.canvasSize.height);
	    }

	    // NOT IN USE AS x IS CALCULATED DIRECTLY IN THE PLOT LOOP
	    //function normalizeXValue(value) {
	    //	return ((value-config.plotStart)/(config.plotEnd-config.plotStart)) * (1-bp.canvasSize.width);
	    //}

	    function unNormalizeYValue(value) {
		return -(config.normalizeToMin + (config.normalizeToMax-config.normalizeToMin)/bp.canvasSize.height * value);
	    }

	    function unNormalizeXValue(value) {
		return config.plotStart + (config.plotEnd-config.plotStart)/bp.canvasSize.width * value;
	    }

	    function wrapToArea( bounds ) {
		config.plotStart = Math.min( bounds.xMax, bounds.xMin );
		config.plotEnd = Math.max( bounds.xMax, bounds.xMin );
		// Huh, yMin and yMax should never be negative
		config.normalizeToMin = Math.min( Math.abs(bounds.yMin), Math.abs(bounds.yMax) );
		config.normalizeToMax = Math.max( Math.abs(bounds.yMin), Math.abs(bounds.yMax) );
		config.normalizePlot = true;
		if( window.confirm('Plot again with new settings?') )
		    rebuild();
	    };

	    function rebuild() {
		bp.clear();
		bufferedFeigenbaum = [];
		plotFeigenbaum();
	    }


	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    var rect = document.getElementById('drag-rect');
	    var rectBounds = { xMin : 0, yMin : 0, xMax : 0, yMax : 0 };
	    /*new MouseHandler(rect).up( function(e) {
		rect.style.display = 'none';
		console.log('xMin',rectBounds.xMin,'yMin',rectBounds.yMin,'xMax',rectBounds.xMax,'yMax',rectBounds.yMax);
		wrapToArea( rectBounds );
	    } );
	    */
	    new PlotBoilerplate.RectSelector( bp,
					      'drag-rect',
					      { normalizeY : normalizeYValue, unNormalizeX : unNormalizeXValue, unNormalizeY : unNormalizeYValue },
					      wrapToArea
					    );
	    
	    var mouseHandler = new MouseHandler(bp.canvas)
		.move( function(e) {
		    var relPos = bp.transformMousePosition( e.params.pos.x, e.params.pos.y );
		    relPos.x = unNormalizeXValue(relPos.x);
		    relPos.y = unNormalizeYValue(relPos.y);
		    var cx = document.getElementById('cx');
		    var cy = document.getElementById('cy');
		    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
		} )
	    ;
	    /*
		.down( function(e) {
		    rect.style.display = 'inherit';
		    rect.style.left = e.clientX+'px';
		    rect.style.top = e.clientY+'px';
		    rect.style.width = '1px';
		    rect.style.height = '1px';
		    var relPos = bp.transformMousePosition(e.params.mouseDownPos.x,e.params.mouseDownPos.y);
		    rectBounds.xMin = unNormalizeXValue(relPos.x);
		    rectBounds.yMin = unNormalizeYValue(relPos.y);
		} )
		.up( function(e) {
		    console.log('up');
		    rect.style.display = 'none';
		    console.log('xMin',rectBounds.xStart,'yMin',rectBounds.yStart,'xMax',rectBounds.xEnd,'yMax',rectBounds.yEnd);
		    wrapToArea( rectBounds );
		} )
		.drag( function(e) {
		    var bounds = {
			xStart : e.params.mouseDownPos.x,
			yStart : e.params.mouseDownPos.y,
			xEnd   : e.params.pos.x,
			yEnd   : e.params.pos.y
		    };
		    var relPos = bp.transformMousePosition(e.params.pos.x,e.params.pos.y);
		    rectBounds.xMax = unNormalizeXValue(relPos.x);
		    rectBounds.yMax = unNormalizeYValue(relPos.y);
		    rect.style.width = (bounds.xEnd-bounds.xStart)+'px';
		    rect.style.height = (bounds.yEnd-bounds.yStart)+'px';
		} )
	    ;
	    */


	    // Initialize the dialog
	    window.dialog = new overlayDialog('dialog-wrapper');

	    // Init
	    dialog.show( 'Click <button id="_btn_rebuild">Rebuild</button> to plot the curves.', 'Hint', null, {} );
	    document.getElementById('_btn_rebuild').addEventListener('click', rebuild);
	    
	   
	} );
    
})(window); 



