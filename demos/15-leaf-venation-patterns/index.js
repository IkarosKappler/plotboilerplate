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
	    var leafPath = null;
	    var scaledPath = null;
	    var scaledSubPath = null;

	    var startAuxin = null;
	    
	    var postDraw = function() {
		// console.log('postDraw');
		pb.draw.label( "Sorry, not yet finished.", pb.canvasSize.width/2, pb.canvasSize.height/2 );
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
		startAuxin = leafPath.getPointAt(0).setX(0);
		scaledPath = leafPath.clone().scale( startAuxin, config.leafScale ); // Scale??!!
		scaledSubPath = scaledPath.getSubPathAt( config.startT, config.endT );
		mainVenePosition = startAuxin.clone();
		currentAuxins = [];
		currentAuxins.push( startAuxin );
	    };

	    // +---------------------------------------------------------------------------------
	    // | Initialize the outline of the leaf (a Bézier path).
	    // +-------------------------------
	    let height = Math.min( pb.canvasSize.height, pb.canvasSize.width )*0.7;
	    leafPath = makeLeafShape( height*0.5, function() { updatePathInfo(); } );
	    pb.add( leafPath );

	    // +---------------------------------------------------------------------------------
	    // | Set path auto-adjustable
	    // +-------------------------------
	    for( var i in leafPath.bezierCurves ) {
		if( i > 0 )
		    leafPath.bezierCurves[i].startPoint.attr.bezierAutoAdjust = true;
		if( i+1 < leafPath.bezierCurves.length )
		    leafPath.bezierCurves[i].endPoint.attr.bezierAutoAdjust = true;
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
	    var mystificeAuxinPositions = function() {
		for( var p in auxinPositions ) {
		    var pos = auxinPositions[p] + (0.02 - Math.random()*0.04);
		    auxinPositions[p] = Math.min(1.0, Math.max(0.0, pos) );
		}
	    };


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
	    var growVenes = function() {
		// console.log('grow venes');
		// For each growth auxin find the outer auxin with the smalles distance
		var newAuxins = [];
		iterno++;
		if( iterno%10 == 5 ) {
		    mystificeAuxinPositions();
		}
		// Grow main vene?
		if( mainVenePosition.y > scaledPath.getPointAt(1).y ) {
		    var vene = new Line( mainVenePosition, mainVenePosition.clone().addXY(0, -config.growthSize ) );
		    vene.a.attr.selectable = vene.b.attr.selectable = false;
		    if( iterno%10 == 0 ) {
			// Add child vene
			currentAuxins.push( vene.b.clone() );
		    }
		    pb.add( vene );
		    mainVenePosition = vene.b.clone();
		}
		// Grow child venes
		for( var i in currentAuxins ) {
		    var cur = currentAuxins[i];
		    var closest = scaledSubPath.getPointAt( auxinPositions[ locateClosestOuterAuxin(cur) ] );
		    if( closest.distance(cur) > config.growthSize*1.1 ) {
			// Stop growth when outer auxin is reached
			var vene = new Line(cur.clone(),closest.clone()).setLength( config.growthSize );
			vene.a.attr.selectable = vene.b.attr.selectable = false;
			pb.add( vene );
			newAuxins.push( vene.b );

			// Copy
			vene = new Line( vene.a.clone().invX(), vene.b.clone().invX() );
			vene.a.attr.selectable = vene.b.attr.selectable = false;
			pb.add( vene );
		    }
		}
		currentAuxins = newAuxins;
	    };
	    
	    function renderAnimation() {
		growVenes();
		if( config.animateGrowth )
		    window.requestAnimationFrame( renderAnimation );
		else // Animation stopped
		    ; // drawTraces();
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
	    pb.config.preDraw = postDraw;
	    pb.redraw();

	} );
    
})(window); 


