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
    let GUP = {}; // gup();
    
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
		      drawOrigin            : true,
		      rasterAdjustFactor    : 2.0,
		      redrawOnResize        : true, // false,
		      defaultCanvasWidth    : 1024,
		      defaultCanvasHeight   : 768,
		      cssScaleX             : 1.0,
		      cssScaleY             : 1.0,
		      autoAdjustOffset      : true,
		      offsetAdjustXPercent  : 0, // 100,   // auto-adjust to left- ...
		      offsetAdjustYPercent  : 0, // 100,  // ... -lower corner
		      drawBezierHandleLines : false,
		      drawBezierHandlePoints : false,
		      backgroundColor       : '#ffffff',
		      enableMouse           : true, // false,
		      enableKeys            : true // false
		    }, GUP
		)
	    );
	    pb.config.autoAdjustOffset = true; // Only once at initialization
	    pb.config.preDraw = function() {
		// pre draw
		// drawPlotLabel();
	    };
	    var rand = function(min,max) {
		return min + Math.random()*(max-min);
	    };
	    pb.config.postDraw = function() {
		// post draw
		//console.log('post redraw');
	    };

	    var xSize = 25;
	    var ySize = 50;

	    for( var y = 0; y < pb.canvasSize.height; y+= ySize ) {
		var curves = [];
		for( var x = 0; x < pb.canvasSize.width; x+= xSize ) {

		    var curve = [ new Vertex(rand(x,x+xSize), rand(y,y+ySize)),
				  new Vertex(rand(x,x+xSize), rand(y,y+ySize)),
				  new Vertex(rand(x,x+xSize), rand(y,y+ySize)),
				  new Vertex(rand(x,x+xSize), rand(y,y+ySize)) ];
		    curves.push( curve );
		    // console.log( 'Added curve' );
		    var curve = [ new Vertex(rand(x,x+xSize), rand(y,y+ySize)),
				  new Vertex(rand(x,x+xSize), rand(y,y+ySize)),
				  new Vertex(rand(x,x+xSize), rand(y,y+ySize)),
				  new Vertex(rand(x,x+xSize), rand(y,y+ySize)) ];
		    curves.push( curve );
		    //console.log( 'Added curve' );

		    // Stop word?
		    if( Math.random() < 0.1 && x+xSize < pb.canvasSize.width ) {
			pb.add( BezierPath.fromArray( curves ));
			curves = [];
		    }
		    
		    //pb.add( BezierPath.fromArray( curves )); // new BezierPath([curves]) );
		}
		
		//console.log( 'Adding curves', curves.length );
		//pb.add( new BezierPath(curves) );
		pb.add( BezierPath.fromArray( curves )); 
	    }
		

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    var gui = pb.createGUI();

	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		bufferData            : false
	    }, GUP );
	    
	    console.log( JSON.stringify(config) );
	    var fold2 = gui.addFolder('Plot settings');
	    

	    function rebuild() {
		//bp.clear();
		//bufferedFeigenbaum = [];
		//plotFeigenbaum();
	    }


	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    /*var rect = document.getElementById('drag-rect');
	    var rectBounds = { xMin : 0, yMin : 0, xMax : 0, yMax : 0 };
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
		} );


	    // Initialize the dialog
	    window.dialog = new overlayDialog('dialog-wrapper');

	    // Init
	    dialog.show( 'Click <button id="_btn_rebuild">Rebuild</button> to plot the curves.', 'Hint', null, {} );
	    document.getElementById('_btn_rebuild').addEventListener('click', rebuild);

	    if( config.autostart  )
		rebuild();
	   */
	} );
    
})(window); 



