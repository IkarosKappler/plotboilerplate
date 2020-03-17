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
		growthSize            : 6, // Size of each growth step,
		randomizeAuxins       : function() { randomizeAuxins(); pb.redraw(); },
		animateStep           : function() { animateStep(); }
	    }, GUP );

	    var auxinPositions = [];
	    var currentAuxins = [];
	    var mainVenePosition = null;
	    
	    // Get the sub path
	    var leafShape = null;
	    var auxinSources = null;

	    var scaledPath = null; // leafShape.path.clone().scale( leafShape.petiole, config.leafScale ); 
	    var scaledSubPath = null; // scaledPath.getSubPathAt( config.startT, config.endT );
	    var scaledBoundingPolygon = null;

	    
	    var postDraw = function() {
		pb.fill.polygon( leafShape.boundingPolygon, 'rgba(192,192,192,0.2)' );
		
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
			//if( !auxin )
			//    return;
			if( scaledBoundingPolygon.containsVert(auxin) )
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
		scaledPath = leafShape.path.clone().scale( leafShape.petiole, config.leafScale ); 
		scaledSubPath = scaledPath.getSubPathAt( config.startT, config.endT );
		scaledBoundingPolygon = pbutils.BezierPath.toPolygon( scaledPath, 0.05 );
	    };

	    // +---------------------------------------------------------------------------------
	    // | This function is called whenever the main leaf shape (the outer path) changed.
	    // +-------------------------------
	    var updateAuxinInfo = function() {
		var bounds = leafShape.getBounds();
		console.log( config.growthSize, bounds, bounds.getWidth(), bounds.getHeight(), bounds.getArea() );
		auxinSources = new RandomRect( bounds.min,
					       bounds.getWidth(), bounds.getHeight(),
					       bounds.getArea()*(1/Math.pow(config.growthSize*2,2)), // Imagine a growthSize*growthSize raster for possible auxin positions
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
	    /* var randomizeAuxinPositions = function() {
		auxinPositions = [];
		for( var a = 0; a < config.auxinCount; a++ ) {
		    auxinPositions.push( Math.random() ); // A value betwenn 0.0 and 1.0
		}
	    }; */


	    // +---------------------------------------------------------------------------------
	    // | Randomize Auxins
	    // +-------------------------------
	    var randomizeAuxins = function() {
		auxinSources.randomize();
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

	    /*
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
	    */

	    var nodeList = [];
	    var minScale = 0.0; // 1;
	    var growthSteps = 100;
	    var auxinClosestNode = {};
	    var nodeAffectingAuxins = {};
	    var initGrowth = function() {
		iterno = 0;
		nodeList = [ leafShape.petiole.clone() ];
	    };
	    
	    var iterno = 0;

	    var clearAuxinsFromNodes = function() {
		var newAuxinList = [];
		for( var a in auxinSources.vertices ) {
		    var auxin = auxinSources.vertices[a];
		    var remove = false;
		    for( var i in nodeList ) {
			var node = nodeList[i];
			if( node.distance(auxin) < config.growthSize )
			    remove = true;
		    }
		    if( !remove )
			newAuxinList.push(auxin);
		}
		auxinSources.vertices = newAuxinList;
	    };

	    var auxinListToNormalizedSum = function( node, auxinIndexList ) {
		if( auxinIndexList.length == 0 )
		    return null;
		var vector = new Vector( node.clone(), node.clone() );
		for( var a in auxinIndexList ) {
		    var auxinIndex = auxinIndexList[a];
		    var auxin = auxinSources.vertices[auxinIndex];
		    vector.b.add( node.difference(auxin) );
		}
		// Move to origin
		vector.sub( vector.a );
		console.log('vector', vector );
		return vector; // .setLength( config.growthSize );
	    };

	    // Find the closest node for each auxin
	    var mapAuxinsToClosestNodes = function() {
		for( var a in auxinSources.vertices ) {
		    var auxin = auxinSources.vertices[a];
		    // Auxin out of current scale rate?
		    if( !scaledBoundingPolygon.containsVert(auxin) )
			continue;
		    // Find the closest node to this auxin
		    var closestn = 0;
		    for( var n in nodeList ) {
			if( nodeList[n].distance(auxin) < nodeList[closestn].distance(auxin) )
			    closestn = n;
		    }
		    auxinClosestNode[a] = closestn;
		    if( !(closestn in nodeAffectingAuxins) || typeof nodeAffectingAuxins[closestn] == "undefined" )
			nodeAffectingAuxins[closestn] = [];
		    nodeAffectingAuxins[closestn].push(parseInt(a));
		}
	    };
	    
	    var growVenes = function() {
		var scaleFactor = minScale + (iterno/growthSteps) * (1.0-minScale);
		config.leafScale = scaleFactor;
		updatePathInfo();
		randomizeAuxins();
		auxinClosestNode = {};
		nodeAffectingAuxins = {};
		clearAuxinsFromNodes();
		mapAuxinsToClosestNodes();

		// Now for each node:
		//  * take the associated list of affecting auxins
		//  * determine the normalized vector sum
		//  * grow the node into that direction by one unit
		var newNodeList = [];
		for( var n in nodeList ) {
		    if( typeof nodeAffectingAuxins[n] == "undefined" || nodeAffectingAuxins[n].length == 0 )
			continue;
		    console.log('auxins affecting node', n, nodeAffectingAuxins[n] );
		    var vector = auxinListToNormalizedSum( nodeList[n], nodeAffectingAuxins[n] );
		    if( vector == null )
			continue;
		    var vene = new Line(nodeList[n].clone(), vector.b.clone());
		    // var vene = new Line(nodeList[n].clone(), nodeList[n].clone().add(vector.b));
		    vene.a.attr.selectable = vene.b.attr.selectable = false;
		    vene.a.attr.draggable = vene.b.attr.draggable = false;
		    console.log('new vene', vene );
		    pb.add( vene  );
		    newNodeList.push( vector.b.clone() ); // Clone???
		    // newNodeList.push( vene.b.clone() ); // vector.b.clone() ); // Clone???
		}

		for( var n in newNodeList ) {
		    console.log('adding new nodes', newNodeList.length );
		    nodeList.push( newNodeList[n] );
		}

		iterno++;
		pb.redraw();
	    };
	    
	    function renderAnimation() {
		console.log(' === ITERATION step', iterno, 'nodeList.length', nodeList.length);
		growVenes();
		// if( iterno >= 2 ) config.animateGrowth = false;
		if( config.animateGrowth && iterno <= growthSteps )
		    window.requestAnimationFrame( renderAnimation );
		else // Animation stopped
		    config.animateGrowth = false;
	    };

	    function animateStep() {
		if( nodeList.length == 0 )
		    initGrowth();
		growVenes();
	    };
	    
	    function toggleAnimation() {
		if( config.animateGrowth ) {
		    initGrowth();
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
		f0.add(config, 'leafScale').min(0.0).max(1.0).step(0.01).onChange( function() { updatePathInfo(); pb.redraw(); } ).listen().name('Leaf Scale').title('Scale the leaf path.');
		f0.add(config, 'auxinCount').min(1).max(1000).step(1).onChange( function() { randomizeAuxinPositions(); pb.redraw(); } ).name('#Auxins').title('Change auxin count.');
		f0.add(config, 'drawAuxins').onChange( function() { pb.redraw(); } ).name('Draw auxins').title('Draw auxins.');
		f0.add(config, 'animateGrowth').onChange( function() { toggleAnimation(); } ).name('Animate').title('Animate.').listen().arrowBounce('Click here',{fadeDelay:5000,detachAfter:6000});
		f0.add(config, 'animateStep').name('Animate Step').title('Animate next step.');
		f0.add(config, 'growthSize').onChange( function() { pb.redraw(); } ).name('Growth size').title('The amount of growth in each step.');
		f0.add(config, 'randomizeAuxins').name('Rand Auxins').title('Randomize the auxin sources.');
		f0.open();
	    }

	    toggleAnimation();
	    // randomizeAuxinPositions();
	    updatePathInfo();
	    updateAuxinInfo();
	    pb.config.preDraw = postDraw;
	    pb.redraw();

	} );
    
})(window); 


