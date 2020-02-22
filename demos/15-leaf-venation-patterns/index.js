/**
 * A script for testing vector fields.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2019-02-03
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
		      offsetAdjustYPercent  : 45, // !!!
		      backgroundColor       : '#ffffff',
		      enableMouse           : true,
		      enableKeys            : true,
		      enableTouch           : true
		    }, GUP
		)
	    );

	    
	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		startT                : 0.25,
		endT                  : 0.98,
		leafScale             : 1.0,
		auxinCount            : 8,
		drawAuxins            : false,
		animateGrowth         : false,
		growthSize            : 6 // Size of each growth step
	    }, GUP );

	    var auxinPositions = [];
	    var currentAuxins = [];
	    var mainVenePosition = null;
	    
	    // Get the sub path
	    var leafShape = null;
	    var auxinSources = null;

	    var startAuxin = null;
	    
	    var postDraw = function() {
		pb.fill.polygon( leafShape.boundingPolygon, 'rgba(192,192,192,0.2)' );
		var scaledPath = leafShape.path.clone().scale( startAuxin, config.leafScale ); 
		var scaledSubPath = scaledPath.getSubPathAt( config.startT, config.endT );
		// console.log('postDraw');
		pb.draw.label( "Sorry, not yet finished.", pb.canvasSize.width/2-60, pb.canvasSize.height/2 );
		// Draw a normal and a mirrored clone
		drawBezierPath( scaledPath, 'rgba(128,128,128,.5)', 1, function(v) { return v; } );
		drawBezierPath( scaledPath, 'rgba(128,128,128,.5)', 1, function(v) { return v.clone().invX(); } );
		// Mark start point
		pb.draw.circle( scaledPath.bezierCurves[0].startPoint, 20 );

		if( config.drawAuxins ) {
		    // Draw current auxins
		    for( a in currentAuxins ) {
			pb.fill.circle( currentAuxins[a], config.growthSize, 'rgb(255,96,0)' );
		    }
		    // Draw the auxins along the path
		    for( var a in auxinPositions ) {
			var auxin = scaledSubPath.getPointAt( auxinPositions[a] );
			pb.fill.circle( auxin, 4, 'rgb(255,96,0)' );
		    }

		    for( var a in auxinSources.vertices ) {
			var auxin = auxinSources.vertices[a];
			if( leafShape.containsVert(auxin) )
			    pb.fill.circle( auxin, config.growthSize, 'rgba(255,96,0,0.25)' );
		    }
		}
		
		// Draw the path and mark sub path's start and end point
		pb.draw.circle( scaledSubPath.bezierCurves[0].startPoint.clone().invX(), 10 );
		pb.draw.circle( scaledSubPath.bezierCurves[scaledSubPath.bezierCurves.length-1].endPoint.clone().invX(), 6 );
		
		// Draw the sub path
		drawBezierPath( scaledSubPath, 'rgba(0,0,255,0.5)', 2, function(v) { return v.clone().invX(); } );
	    }; // END postDraw


	    var drawBezierPath = function( path, color, lineWidth, vertexTransform ) {
		for( var c in path.bezierCurves ) {
		    pb.draw.cubicBezier( vertexTransform( path.bezierCurves[c].startPoint ), 
					 vertexTransform( path.bezierCurves[c].endPoint ),
					 vertexTransform( path.bezierCurves[c].startControlPoint ),
					 vertexTransform( path.bezierCurves[c].endControlPoint ),
					 color,
					 lineWidth );
		}
	    };

	    // +---------------------------------------------------------------------------------
	    // | This function is called whenever the main leaf shape (the outer path) changed.
	    // +-------------------------------
	    var updatePathInfo = function() {
		currentAuxins = [];
	    };

	    // +---------------------------------------------------------------------------------
	    // | This function is called whenever the main leaf shape (the outer path) changed.
	    // +-------------------------------
	    var updateAuxinInfo = function() {
		var bounds = leafShape.getBounds();
		console.log( config.growthSize, bounds, bounds.getWidth(), bounds.getHeight(), bounds.getArea() );
		auxinSources = new RandomRect( bounds.min,
					       bounds.getWidth(), bounds.getHeight(),
					       bounds.getArea()*(1/Math.pow(config.growthSize,2)), // Imagine a growthSize*growthSize raster for possible auxin positions
					       config.growthSize*2  // minDist ist twice the growthSize, so auxins cannot overlap
					     );
	    };

	    // +---------------------------------------------------------------------------------
	    // | Initialize the outline of the leaf (a Bézier path).
	    // +-------------------------------
	    let height = Math.min( pb.canvasSize.height, pb.canvasSize.width )*0.35;
	    leafShape = new GrowableShape( height, function() { updatePathInfo(); }, null, function() { updateAuxinInfo(); } );
	    pb.add( leafShape.path );

	    // +---------------------------------------------------------------------------------
	    // | Set path auto-adjustable
	    // +-------------------------------
	    for( var i in leafShape.path.bezierCurves ) {
		if( i > 0 )
		    leafShape.path.bezierCurves[i].startPoint.attr.bezierAutoAdjust = true;
		if( i+1 < leafShape.path.bezierCurves.length )
		    leafShape.path.bezierCurves[i].endPoint.attr.bezierAutoAdjust = true;
	    }
	    
	
	    // +---------------------------------------------------------------------------------
	    // | Add a mouse listener to track the mouse position.
	    // +-------------------------------
	    new MouseHandler(pb.canvas)
		.move( function(e) {
		    var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
		    var cx = document.getElementById('cx');
		    var cy = document.getElementById('cy');
		    if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		    if( cy ) cy.innerHTML = relPos.y.toFixed(2);
		} );

	    

	    // +---------------------------------------------------------------------------------
	    // | Update the number and positions of the outer auxins.
	    // +-------------------------------
	    var randomizeAuxinPositions = function() {
		auxinPositions = [];
		for( var a = 0; a < config.auxinCount; a++ ) {
		    auxinPositions.push( Math.random() ); // A value betwenn 0.0 and 1.0
		}
	    };


	    // +---------------------------------------------------------------------------------
	    // | Move each outer auxin a little my.
	    // +-------------------------------
	    /*var mystificeAuxinPositions = function() {
		for( var p in auxinPositions ) {
		    var pos = auxinPositions[p] + (0.02 - Math.random()*0.04);
		    auxinPositions[p] = Math.min(1.0, Math.max(0.0, pos) );
		}
	    };*/


	    var locateClosestOuterAuxin = function( pos ) {
		if( auxinPositions.length == 0 )
		    return -1;
		var closesti = 0;
		var smallestDist = Number.MAX_VALUE;
		for( var i in auxinPositions ) {
		    var auxin = scaledSubPath.getPointAt( auxinPositions[i] );
		    if( pos.distance(auxin) < smallestDist ) {
			closesti = i;
			smallestDist = pos.distance(auxin);
		    }
		}
		return closesti;
	    };

	    var iterno = 0;
	    
	    function renderAnimation() {
		growVenes();
		if( config.animateGrowth )
		    window.requestAnimationFrame( renderAnimation );
		else // Animation stopped
		    ; 
	    };
	    
	    function toggleAnimation() {
		if( config.animateGrowth ) {
		    renderAnimation();
		} else {
		    pb.redraw();
		}
	    }

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI(); 
		var f0 = gui.addFolder('Points');
		f0.add(config, 'startT').min(0.0).max(1.0).step(0.01).onChange( function() { updatePathInfo(); pb.redraw(); } ).name('Set start T').title('Set start T.');
		f0.add(config, 'endT').min(0.0).max(1.0).step(0.01).onChange( function() { updatePathInfo(); pb.redraw(); } ).name('Set end T').title('Set end T.');
		f0.add(config, 'leafScale').min(0.0).max(1.0).step(0.01).onChange( function() { updatePathInfo(); pb.redraw(); } ).name('Leaf Scale').title('Scale the leaf path.');
		f0.add(config, 'auxinCount').min(1).max(1000).step(1).onChange( function() { randomizeAuxinPositions(); pb.redraw(); } ).name('#Auxins').title('Change auxin count.');
		f0.add(config, 'drawAuxins').onChange( function() { pb.redraw(); } ).name('Draw auxins').title('Draw auxins.');
		f0.add(config, 'animateGrowth').onChange( function() { toggleAnimation(); } ).name('Animate').title('Animate.');
		f0.add(config, 'growthSize').onChange( function() { pb.redraw(); } ).name('Growth size').title('The amount of growth in each step.');
		f0.open();
	    }

	    toggleAnimation();
	    randomizeAuxinPositions();
	    updatePathInfo();
	    updateAuxinInfo();
	    pb.config.preDraw = postDraw;
	    pb.redraw();

	} );
    
})(window); 


