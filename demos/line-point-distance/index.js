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
		      drawOrigin            : true,
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
		      enableTouch           : true
		    }, GUP
		)
	    );

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    pb.createGUI(); 
	    // END init dat.gui
	    

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
	    // | Add some elements to draw (demo).
	    // +-------------------------------
	    var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/3.5;
	    var radius   = diameter*0.5;
	    var hypo     = Math.sqrt( radius*radius*2 );

	    // +---------------------------------------------------------------------------------
	    // | Create a random vertex inside the canvas viewport.
	    // +-------------------------------
	    var randomVertex = function() {
		//return new Vertex( Math.random()*pb.canvasSize.width/3,
		//		   Math.random()*pb.canvasSize.height/3
		//		 );
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
		    // console.log('update');
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

	    /*
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
		// console.log('update');
		intersection.set( line.vertAt(line.getClosestT(point)) );
		perpendicular.a.set( point );
		perpendicular.b.set( intersection );
		pb.redraw();
	    };
	    line.a.listeners.addDragListener( function() { update(); } );
	    line.b.listeners.addDragListener( function() { update(); } );
	    point.listeners.addDragListener( function() { update(); } );
	    update();
	    */

	} );
    
})(window); 
