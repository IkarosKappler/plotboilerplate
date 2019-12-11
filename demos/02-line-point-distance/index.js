/**
 * A script for demonstrating the line-point-distance.
 *
 * @require PlotBoilerplate, MouseHandler, gup, dat.gui
 * 
 * @author   Ikaros Kappler
 * @date     2019-02-06
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
		      offsetAdjustYPercent  : 50,
		      backgroundColor       : '#ffffff',
		      enableMouse           : true,
		      enableKeys            : true,
		      enableTouch           : true,
		      enableMouseWheel      : true
		    }, GUP
		)
	    );
	    

	    // +---------------------------------------------------------------------------------
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		showBarkBeetleTunnels       : false
	    }, GUP );


	    pb.config.postDraw = function() {
		if( !config.showBarkBeetleTunnels )
		    return;
		let _line = null;
		let pdist = 10;
		let leftElements = {};
		let rightElements = {};
		var t = -10000;
		var minT = Number.MAX_VALUE;
		var maxT = Number.MIN_VALUE;
		for( var i in pb.drawables ) { 
		    if( !(pb.drawables[i] instanceof Line ) )
			continue;

		    _line = pb.drawables[i];
		    if( _line == line )
			continue;
		    // line.a is the end point, line.b is the intersection point
		    let vec = new Vector(_line.b, _line.a);
		    let perpStart = vec.perp().setLength(pdist);
		    perpStart.add( vec.clone().setLength(pdist).sub(vec.a).b );
		    let perpEnd = perpStart.clone().add( vec.clone().setLength(vec.length()-2*pdist).sub(vec.a).b );

		    // console.log(perp);
		    pb.draw.line( perpStart.b, perpEnd.b, 'grey', 2 );
		    pb.draw.line( perpStart.clone().inv().b, perpEnd.clone().inv().b, 'grey', 2 );

		    let tipVec = vec.clone().setLength( vec.length()+1.5*pdist );
		    let tipPerp = tipVec.perp().setLength(2*pdist).sub( tipVec.a ).add( tipVec.b );
		    let tipHandleA = perpEnd.clone().setLength( 2*pdist );
		    

		    pb.draw.cubicBezier( perpEnd.b, tipVec.b, tipHandleA.b, tipPerp.b, 'grey' );
		    pb.draw.cubicBezier( perpEnd.clone().inv().b, tipVec.b, tipHandleA.clone().inv().b, tipPerp.clone().inv().b, 'grey' );

		    let t = line.getClosestT(_line.a);
		    var tri = new Triangle( perpStart.b, perpStart.clone().inv().b, _line.b ); // vec.b );
		    
		    let det = new Triangle(line.a, line.b, _line.a).determinant();
		    pb.fill.polyline( [tri.a, tri.b, tri.c], false, det<0 ? 'rgba(0,255,0,0.5)' : 'rgba(255,0,255,0.5)' );
		    
		    if( det<0 ) leftElements[ t ]  = { t : t, tri : tri };
		    else        rightElements[ t ] = { t : t, tri : tri };

		    minT = Math.min( minT, t );
		    maxT = Math.max( maxT, t );
		}

		
		var drawConnectingElements = function( elements, l2r ) {
		    // This is really bad code: converting the object keys to numbers
		    // because I know they represent numbers.
		    // Better: use a real sorted map here.
		    var keys = Object.keys(elements).sort(
			function(a,b) {
			    // Here we know that the keys represent floats!
			    return parseFloat(a) > parseFloat(b);
			}
		    );
		    if( !l2r ) keys = keys.reverse();
		    //console.log( l2r?'l2r':'non-ltr', keys );
		    
		    var firstKey = null;
		    var lastKey = null;
		    var last = null;
		    for( var k = 0; k < keys.length; k++ ) {
			// console.log( 'key'+k, keys[k] );
			var next = elements[ keys[k] ];
			if( last != null ) {
			    if( l2r ) pb.draw.line( last.tri.b, next.tri.a, 'grey', 2 );
			    else      pb.draw.line( next.tri.a, last.tri.b, 'grey', 2 );
			} else {
			    firstKey = keys[k];
			}
			//pb.fill.text( (l2r?'l':'r')+k+'['+next.t+']', next.tri.c.x, next.tri.c.y, { color : 'black' } );
			last = next;
			lastKey = keys[k];
		    }
		    return { first: firstKey?elements[firstKey].t:(l2r?0.0:1.0), last : lastKey?elements[lastKey].t:(l2r?1.0:0.0) }; 
		}
		var leftEndTs  = drawConnectingElements( leftElements, true );
		var rightEndTs = drawConnectingElements( rightElements, false );

		//var leftVec = new Vector( line.vertAt(leftEndTs.first), line.vertAt(leftEndTs.last) );
		//var rightVec = new Vector( line.vertAt(rightEndTs.first), line.vertAt(rightEndTs.last) );
		//pb.draw.line( leftVec.a, leftVec.b, 'red', 3 );
		//pb.draw.line( rightVec.a, rightVec.b, 'orange', 3 );
	    };
	    

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
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		return new Vertex( Math.random()*pb.canvasSize.width*0.5 - pb.canvasSize.width/2*0.5,
				   Math.random()*pb.canvasSize.height*0.5 - pb.canvasSize.height/2*0.5
				 );
	    };
	    
	    // +---------------------------------------------------------------------------------
	    // | Add some interactive elements: a line and a point.
	    // +-------------------------------
	    var line = new Line( randomVertex(), randomVertex() );
	    pb.add( line );

	    function newPerp( line ) {
		var point = randomVertex();
		pb.add( point );

		// +---------------------------------------------------------------------------------
		// | Add the perpendicular and the intersection point (not selectable
		// | nor draggable). 
		// +-------------------------------
		var perpendicular = new Line( randomVertex(), randomVertex() );
		perpendicular.a.attr.selectable = perpendicular.a.attr.draggable = false;
		perpendicular.b.attr.selectable = perpendicular.b.attr.draggable = false;
		pb.add( perpendicular );
		var intersection = randomVertex();
		intersection.attr.selectable = perpendicular.a.attr.draggable = false;
		pb.add( intersection );


		// +---------------------------------------------------------------------------------
		// | Compute the position of the intersection and the perpendicular on
		// | each vertex change.
		// +-------------------------------
		var update = function() {
		    intersection.set( line.vertAt(line.getClosestT(point)) );
		    perpendicular.a.set( point );
		    perpendicular.b.set( intersection );
		    pb.redraw();
		};
		line.a.listeners.addDragListener( function() { update(); } );
		line.b.listeners.addDragListener( function() { update(); } );
		point.listeners.addDragListener( function() { update(); } );
		update();
	    }
	    for( var i = 0; i < 7; i++ ) {
		newPerp(line);
	    }



	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
            {
		var gui = pb.createGUI(); 
		gui.add(config, 'showBarkBeetleTunnels').onChange( function() { pb.redraw(); } ).title("Show bark beetle tunnels :)");
	    }

	} );
    
})(window); 
