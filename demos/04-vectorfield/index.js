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
	    // | Add some interactive control Vectors.
	    // +-------------------------------
	    var cv0, cv1, cv2, cv3, cv4;
	    var controlOffset = diameter*0.8;
	    pb.add( cv0 = new Vector( new Vertex(0,0), new Vertex(diameter*0.8,0) ), false );
	    pb.add( cv1 = new Vector( new Vertex(-controlOffset,-controlOffset), new Vertex(-controlOffset-diameter*0.6,-controlOffset-diameter*0.6) ), false );
	    pb.add( cv2 = new Vector( new Vertex(-controlOffset,controlOffset), new Vertex(-controlOffset-diameter*0.6,controlOffset+diameter*0.6) ), false );
	    pb.add( cv3 = new Vector( new Vertex(controlOffset,-controlOffset), new Vertex(controlOffset+diameter*0.6,-controlOffset-diameter*0.6) ), false );
	    pb.add( cv4 = new Vector( new Vertex(controlOffset,controlOffset), new Vertex(controlOffset+diameter*0.6,controlOffset+diameter*0.6) ), false );
	    var controlVectors = [ cv0, cv1, cv2, cv3, cv4 ];
	    var field = [];
	    
	    
	    // +--------------------------------------------------------------------------------
	    // | Add a grid of display vectors.
	    // +-------------------------------
	    var vert = function(x,y) { return new Vertex(x,y); };
	    var vec = function(a,b) { return new Vector(a,b); };
	    var displayStep = 25;
	    function addFieldVector( v ) {
		v.a.attr.selectable = false;
		v.b.attr.selectable = false;
		pb.add( v, false );
		field.push( v );
	    }
	    for( var x = 0; x < pb.canvasSize.width/2; x+=displayStep ) {
		for( var y = 0; y < pb.canvasSize.height/2; y+=displayStep ) {
		    addFieldVector( vec( vert(x,y), vert(x*0.9, y*0.9) ) );
		    addFieldVector( vec( vert(-x,y), vert(-x*0.9, y*0.9) ) );
		    addFieldVector( vec( vert(x,-y), vert(x*0.9, -y*0.9) ) );
		    addFieldVector( vec( vert(-x,-y), vert(-x*0.9, -y*0.9) ) );
		}
	    }

	    function adjustVectorField() {
		 for( var fi in field ) {
		     var anyVector = field[fi];
		     // Set to length 0
		     anyVector.b.set(anyVector.a);
		     
		     for( var ci in controlVectors ) {
			 var controlVector = controlVectors[ci];
			 var strength = controlVector.length();
			 adjustVector_radial( controlVector, strength, anyVector );

		     }
		}
		pb.redraw();
	    }

	    /*
	      // Some test which still looks nice
	    function adjustVector_radial( controlVector, strength, anyVector ) {
		var t = controlVector.getClosestT(anyVector.a);
		// t = Math.max(0, Math.min(1,t));
		var pointOnControlVector = controlVector.vertAt(t);
		var dist = pointOnControlVector.distance( anyVector.a );
		// Is the vertex inside the strengh area of thi control Vector?
		if( dist < strength ) {
		    // console.log('x');

		    // dist -= strength;
		    anyVector.b.x += (anyVector.a.x-controlVector.a.x)*(strength/dist);
		    anyVector.b.y += (anyVector.a.y-controlVector.a.y)*(strength/dist);
		    //anyVector.b.x += (anyVector.a.x-controlVector.a.x)*(dist/strength);
		    //anyVector.b.y += (anyVector.a.y-controlVector.a.y)*(dist/strength);
		}
	    }
	    */

	    function adjustVector_radial( controlVector, strength, anyVector ) {
		var dist = controlVector.a.distance( anyVector.a );
		if( dist > strength )
		    return;
		var influence = dist-strength;
		anyVector.b.x += (controlVector.a.x-controlVector.b.x)*(influence/strength);
		anyVector.b.y += (controlVector.a.y-controlVector.b.y)*(influence/strength);
		
	    }

	    // Install listeners
	    for( var i in controlVectors ) {
		controlVectors[i].a.listeners.addDragListener( function(e) { adjustVectorField(); } );
		controlVectors[i].b.listeners.addDragListener( function(e) { adjustVectorField(); } );
	    }
	    adjustVectorField();

	} );
    
})(window); 


