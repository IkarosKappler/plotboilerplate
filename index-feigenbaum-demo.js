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
		PlotBoilerplate.utils.saveMergeByKeys(
		    { canvas                : document.getElementById('my-canvas'),					    
		      fullSize              : true,
		      fitToParent           : true,
		      scaleX                : 1.0,
		      scaleY                : 1.0,
		      rasterGrid            : true,
		      rasterAdjustFactor    : 2.0,
		      redrawOnResize        : true,
		      defaultCanvasWidth    : 1024,
		      defaultCanvasHeight   : 768,
		      autoCenterOffset      : true,
		      backgroundColor       : '#ffffff'
		    }, GUP
		)
	    );
	    bp.config.autoCenterOffset = false; // Only once at initialization
	    bp.config.preDraw = function() {
		// pre draw
		bp.draw.offset.x = bp.fill.offset.x = bp.grid.center.x = 0;
		bp.draw.offset.y = bp.fill.offset.y = bp.grid.center.y = bp.canvasSize.height-1;
	    };
	    bp.config.postDraw = function() {
		// post draw
		drawBufferedFeigenbaum();
	    };

	    // +---------------------------------------------------------------------------------
	    // | Merge GET params into config.
	    // +-------------------------------
	    /*
	    for( var k in bp.config ) {
		if( !GUP.hasOwnProperty(k) )
		    continue;
		var type = typeof bp.config[k];
		if( type == 'boolean' ) bp.config[k] = !!JSON.parse(GUP[k]);
		else if( type == 'number' ) bp.config[k] = JSON.parse(GUP[k])*1;
		else if( type == 'function' ) ;
		else bp.config[k] = GUP[k];
	    }
	    */

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    var gui = bp.createGUI();

	    var config = PlotBoilerplate.utils.saveMergeByKeys( {
		plotX0                : 0.2,
		plotIterations        : 500,
		plotStart             : 3.2,
		plotEnd               : 3.83,
		plotStep              : 0.1,
		plotChunkSize         : 1.0,
		bufferData            : false,
		plotScale             : 1.0,
		normalizePlot         : true,
		normalizeToMin        : 0.0,
		normalizeToMax        : 1.0, 
		alphaThreshold        : 0.05,	

		rebuild               : function() { console.log('Rebuilding ... '); rebuild(); }
	    }, GUP );
	    console.log( JSON.stringify(config) );
	    var fold2 = gui.addFolder('Plot settings');
	    fold2.add(config, 'plotX0').title('Set the x0 value to start the logistic function at.').min(0.01).max(2.0).step(0.01);
	    fold2.add(config, 'plotIterations').title('Set the number of max iterations for the logistic function.').min(1).max(10000).step(1);
	    fold2.add(config, 'plotStart').title('Set the lambda value to start at.').min(3.0).max(4.2).step(0.01);
	    fold2.add(config, 'plotEnd').title('Set to lambda value to stop at.').min(3.2).max(20.0).step(0.01);
	    fold2.add(config, 'plotStep').title('Set the plot step. 1 means one lambda step per pixel.').min(0.0001).max(1.0).step(0.0001);
	    fold2.add(config, 'plotChunkSize').title('What chunk size should be used for updating. 1 means each pixel.').min(0.001).max(1.0).step(0.0001);
	    fold2.add(config, 'bufferData').title('If data is buffered more space is needed, if no buffers are used no redraw is possible.');	    
	    var fold22 = fold2.addFolder('Normalization');
	    fold2.add(config, 'plotScale').title('Scale the calculated values by this factor.').min(0.01).max(1000.0).step(0.01);
	    fold22.add(config, 'normalizePlot').title('Scale the range [min..max6 to the full viewport height.');
	    fold22.add(config, 'normalizeToMin').title('The minimal value for the normalization (default is 0.0).').step(0.025);
	    fold22.add(config, 'normalizeToMax').title('The maximal value for the normalization (default is 1.0).').step(0.025);
	    fold2.add(config, 'alphaThreshold').title('Specify the alhpa minimum to plot weighted samples (0: full transparency allowed, 1: no transparency at all).').min(0.0).max(1.0).step(0.05);
	    fold2.add(config, 'rebuild').name('Rebuild all').title('Rebuild all.');
	    // END init dat.gui
	    

	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    new MouseHandler(bp.canvas)
		.move( function(e) {
		    var relPos = bp.transformMousePosition( e.params.pos.x, e.params.pos.y );
		    var cx = document.getElementById('cx');
		    var cy = document.getElementById('cy');
		    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
		} );


	    // +---------------------------------------------------------------------------------
	    // | Here comes comes the faigenbaum demo.
	    // +-------------------------------

	    // +---------------------------------------------------------------------------------
	    // | ================================================================================
	    // | | BEGIN: the math.
	    // | ==============================
	    // +-------------------------------
	    var bufferedFeigenbaum = [];
	    var plotFeigenbaum = function() {
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
					 // On really large canvases this failes! (NS_ERROR_FAILURE)
					 //bp.fill.ctx.font = '8pt Monospace';
					 //bp.fill.label('range=['+Math.min(config.plotStart,config.plotEnd)+','+Math.max(config.plotStart,config.plotEnd)+'], xStep='+config.plotStep+', iterations='+config.plotIterations+', x0='+config.plotX0+', scale='+config.plotScale+',normalize='+config.normalizePlot+',threshold='+config.alphaThreshold,5,10);  
				     }
				   );	    
	    }

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
		    var result = logisticMap( x0, lambda, plotIterations, new WeightedCollection(), 0 );
		    if( config.bufferData )
			bufferedFeigenbaum.push( { x : x, lambda : lambda, data : result } );
		    plotCollection( x, lambda, result );
		}
		if( curX+xChunkSize < maxX ) {
		    timeoutKey = Math.random();
		    window.setTimeout( function() {
			if( timeoutKey == null )
			    return;
			timeoutKey = null;
			iterativeFeigenbaum( range, curX+xChunkSize, minX, maxX, xStep, xChunkSize, plotIterations, x0, scaleFactor, onFinish );
		    }, 10 );
		} else {	    
		    console.log('Done.');
		    if( typeof onFinish == 'function' ) onFinish();
		    dialog.hide();
		}
	    };

	    // +---------------------------------------------------------------------------------
	    // | A simple numeric collection implementation working with epsilon.
	    // +-------------------------------
	    (function(_context) {
		_context.Collection = (function() {
		    var Collection = function( tolerance ) {
			this.elements = [];
			this.tolerance = tolerance | Collection.EPS;
		    };
		    Collection.EPS = 0.0000000001;
		    Collection.prototype.contains = function( num ) {
			for( var i in this.elements ) {
			    if( Math.abs(this.elements[i]-num) <= this.tolerance )
				return true;
			}
			return false;
		    };
		    Collection.prototype.add = function( num ) {
			if( this.contains(num) )
			    return false;
			this.elements.push(num);
			return true;
		    };	
		    return Collection;
		})();
	    })(window);

	    // +---------------------------------------------------------------------------------
	    // | A weighted numeric collection implementation working with epsilon.
	    // +-------------------------------
	    (function(_context) {
		_context.WeightedCollection = (function() {
		    var WeightedCollection = function( tolerance ) {
			this.elements = [];
			this.maxWeight = 0;
			this.tolerance = tolerance | Collection.EPS;
		    };
		    WeightedCollection.EPS = 0.0000000001;
		    WeightedCollection.prototype.locate = function( num ) {
			for( var i in this.elements ) {
			    if( Math.abs(this.elements[i].v-num) <= this.tolerance )
				return i;
			}
			return -1;
		    };
		    WeightedCollection.prototype.add = function( num ) {
			var index = this.locate(num);
			if( index == -1 ) {
			    this.elements.push( { v : num, w : 1 } );
			    this.maxWeight = Math.max(this.maxWeight,1);
			} else {
			    this.elements[index].w++;
			    this.maxWeight = Math.max(this.maxWeight,this.elements[index].w);
			}
			return true;
		    };	
		    return WeightedCollection;
		})();
	    })(window);

	    // +---------------------------------------------------------------------------------
	    // | A weighted & balanced numeric collection implementation working with epsilon.
	    // +-------------------------------
	    (function(_context) {
		_context.WeightedBalancedCollection = (function() {
		    var WeightedBalancedCollection = function() {
			// this.elements = [];
			this.tree = new BBTree();
			this.maxWeight = 0;
			this.size = 0;
			// this.tolerance = tolerance | Collection.EPS;
		    };
		    // WeightedBalancedCollection.EPS = 0.0000000001;
		    WeightedBalancedCollection.prototype.add = function( num ) {
			var record = this.tree.find(num);
			if( !record ) {
			    this.tree.insert( num, { v : num, w : 1 } );
			    this.maxWeight = Math.max(this.maxWeight,1);
			} else {
			    record.w++;
			    this.maxWeight = Math.max(this.maxWeight,record.w);
			}
			this.size++;
			return true;
		    };
		    return WeightedBalancedCollection;
		})();
	    })(window);

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
		if( true ) return;
		console.log( 'Rendering buffered plot ...' );
		var record = null;
		// Note: this for loop times out on really large sample sets!
		//   --> implement async drawing!
		for( var k in bufferedFeigenbaum ) {
		    record = bufferedFeigenbaum[k];
		    plotCollection( record.x, record.lambda, record.data );
		}
		console.log( 'Finished rendering.' );
	    }

	    function plotCollection( x, lambda, data ) {
		bp.draw.offset.x = bp.fill.offset.x = bp.grid.center.x = 0;
		bp.draw.offset.y = bp.fill.offset.y = bp.grid.center.y = 0;
		if( data instanceof WeightedBalancedCollection ) {
		    plotBalancedCollection( x, lambda, data, data.root );
		} else {
		    // Collection or WeightedCollection
		    var value;
		    for( var i in data.elements ) {
			value = data.elements[i].v;
			var alpha = config.alphaThreshold + (data.elements[i].w/data.elements.length)*(1-config.alphaThreshold);
			alpha = Math.max(0.0, Math.min(1.0, alpha));
			value *= config.plotScale;
			// console.log( config.normalizeToMin );
			if( config.normalizePlot ) 
			    value = ((value-config.normalizeToMin)/(config.normalizeToMax-config.normalizeToMin)) * (bp.canvasSize.height);
			//bp.draw.dot( { x : x, y : data.elements[i].v * config.plotScale * (config.normalizePlot?bp.canvasSize.height:1) }, 'rgba(0,127,255,'+alpha+')' );
			bp.draw.dot( { x : x, y : value }, 'rgba(0,127,255,'+alpha+')' );
		    }
		}
	    }

	    function plotBalancedCollection( x, lambda, data, node ) {
		bp.draw.offset.x = bp.fill.offset.x = bp.grid.center.x = 0;
		bp.draw.offset.y = bp.fill.offset.y = bp.grid.center.y = 0;
		if( !node )
		    return;

		value = node.value.v;
		var alpha = (config.alphaThreshold)+(node.value.w/data.size)*(1-config.alphaThreshold);
		alpha = Math.max(0.0, Math.min(1.0, alpha));
		
		if( config.normalizePlot )
		    value = ((value-config.normalizeToMin)/(config.normalizeToMax-config.normalizeToMin)) * (bp.canvasSize.height);
		// bp.draw.dot( { x : x, y : node.value.v * config.plotScale * (config.normalizePlot?bp.canvasSize.height:1) }, 'rgba(0,127,255,'+alpha+')' );
		bp.draw.dot( { x : x, y : value }, 'rgba(0,127,255,'+alpha+')' );
		plotBalancedCollection( x, lambda, data, node.left );
		plotBalancedCollection( x, lambda, data, node.right );
	    }

	    function rebuild() {
		bp.clear();
		bufferedFeigenbaum = [];
		plotFeigenbaum();
	    }


	    // Initialize the dialog
	    window.dialog = new overlayDialog('dialog-wrapper');
	    // window.dialog.show( 'Inhalt', 'Test' );

	    // Init
	    dialog.show( 'Click <button id="_btn_rebuild">Rebuild</button> to plot the curves.', 'Hint', null, {} );
	    document.getElementById('_btn_rebuild').addEventListener('click', rebuild);
	    
	   
	} );
    
})(window); 



