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
	    pb.config.preDraw = function() { preDraw(); };

	    // A list of vectors (position plus velocity)
	    var pointlist = [];
	    
	    var resetPointCloud = function() {
		pointlist = [];
		var v;
		for( var i = 0; i < 100; i++ ) {
		    v = Vertex.randomVertex(pb.viewport());
		    pointlist.push( new Vector(v, v.clone()) );
		}
	    }
	    resetPointCloud();
	    

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
	    // | A global config that's attached to the dat.gui control interface.
	    // +-------------------------------
	    var config = PlotBoilerplate.utils.safeMergeByKeys( {
		showFieldVectors      : true,
		animate               : false,
		resetPointCloud       : function() { resetPointCloud(); }
	    }, GUP );
	    

	    // +---------------------------------------------------------------------------------
	    // | Add some interactive control Vectors.
	    // +-------------------------------
	    var diameter = Math.min(pb.canvasSize.width,pb.canvasSize.height)/3.5;
	    var cv0, cv1, cv2, cv3, cv4;
	    var controlOffset = diameter*0.8;
	    pb.add( cv0 = new Vector( new Vertex(0,0), new Vertex(diameter*0.8,0) ), false );
	    pb.add( cv1 = new Vector( new Vertex(-controlOffset,-controlOffset), new Vertex(-controlOffset-diameter*0.6,-controlOffset-diameter*0.6) ), false );
	    pb.add( cv2 = new Vector( new Vertex(-controlOffset,controlOffset), new Vertex(-controlOffset-diameter*0.6,controlOffset+diameter*0.6) ), false );
	    pb.add( cv3 = new Vector( new Vertex(controlOffset,-controlOffset), new Vertex(controlOffset+diameter*0.6,-controlOffset-diameter*0.6) ), false );
	    pb.add( cv4 = new Vector( new Vertex(controlOffset,controlOffset), new Vertex(controlOffset+diameter*0.6,controlOffset+diameter*0.6) ), false );
	    var controlVectors = [ cv0, cv1, cv2, cv3, cv4 ];
	    
	    
	    // +--------------------------------------------------------------------------------
	    // | Add a grid of display vectors.
	    // +-------------------------------
	    var vert = function(x,y) { return new Vertex(x,y); };
	    var vec = function(a,b) { return new Vector(a,b); };
	    var displayStep = 25;

	    function drawFieldVectorAt( vertex ) {
		var vector = new Vector( vertex, vertex.clone() );
		for( var ci in controlVectors ) {
		    var controlVector = controlVectors[ci];
		    var strength = controlVector.length();
		    
		    adjustVector_radial( controlVector, strength, vector );
		}
		if( vector.length() > 0 )
		    pb.draw.arrow( vector.a, vector.b, '#e888e8' );
		else
		    pb.draw.dot( vector.a, '#e800e8' );
	    }
	    function preDraw() {
		if( config.showFieldVectors ) {
		    for( var x = 0; x < pb.canvasSize.width/2; x+=displayStep ) {
			for( var y = 0; y < pb.canvasSize.height/2; y+=displayStep ) {
			    drawFieldVectorAt( vert(x,y) );
			    drawFieldVectorAt( vert(-x,y) );
			    drawFieldVectorAt( vert(x,-y) );
			    drawFieldVectorAt( vert(-x,-y) );
			}
		    }
		}
		if( config.animate ) {
		    for( var i in pointlist ) {
			pb.draw.arrow( pointlist[i].a, pointlist[i].b, 'black' );
			pb.fill.circle( pointlist[i].a, 2, 'black' );
		    }
		}
		    
	    };

	    function adjustPointList( stepFactor ) {
		for( var fi in pointlist ) {
		    var pointWithVelocity = pointlist[fi];
		    var anyVector = pointWithVelocity.clone();
		    anyVector.b.set( anyVector.a );
		    
		    for( var ci in controlVectors ) {
			var controlVector = controlVectors[ci];
			var strength = controlVector.length();
			adjustVector_radial( controlVector, strength, anyVector );

		    }

		    // Relocate vector to a=(0,0), but keep an only copy.
		    pointWithVelocity.a.add( anyVector.clone().sub(anyVector.a).b.multiplyScalar(stepFactor) );
		    pointWithVelocity.b.set( anyVector.b );
		}
		pb.redraw();
	    }

	    function adjustVector_radial( controlVector, strength, anyVector ) {
		var dist = controlVector.a.distance( anyVector.a );
		if( dist > strength )
		    return;
		var influence = dist-strength;
		anyVector.b.x += (controlVector.a.x-controlVector.b.x)*(influence/strength);
		anyVector.b.y += (controlVector.a.y-controlVector.b.y)*(influence/strength);
		
	    }

	    function renderAnimation() {
		//adjustVectorField();
		adjustPointList( 0.01 );
		//pb.redraw();
		if( config.animate )
		    window.requestAnimationFrame( renderAnimation );
	    };
	    
	    function toggleAnimation() {
		if( config.animate ) {
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
		f0.add(config, 'showFieldVectors').onChange( function() { pb.redraw(); } ).name('Show field vectors').title('Show field vectors.');
		f0.add(config, 'animate').onChange( function() { toggleAnimation(); } ).name('Animate a point cloud').title('Animate a point cloud.');
		f0.add(config, 'resetPointCloud').name('Reset point cloud').title('Reset point cloud.');
		f0.open();
	    }

	    toggleAnimation();

	} );
    
})(window); 


