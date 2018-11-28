/**
 * The main script of the generic plotter.
 *
 * @author   Ikaros Kappler
 * @date     2018-10-23
 * @modified 2018-11-09 Refactored the old code.
 * @version  1.0.1
 **/


(function(_context) {
    "use strict";

    // Fetch the GET params
    let GUP = gup();
    
    window.addEventListener(
	'load',
	function() {
	    var bp = new PlotBoilerplate();

	    // +---------------------------------------------------------------------------------
	    // | Merge GET params into config.
	    // +-------------------------------
	    for( var k in bp.config ) {
		if( !GUP.hasOwnProperty(k) )
		    continue;
		var type = typeof bp.config[k];
		if( type == 'boolean' ) bp.config[k] = !!JSON.parse(GUP[k]);
		else if( type == 'number' ) bp.config[k] = JSON.parse(GUP[k])*1;
		else if( type == 'function' ) ;
		else bp.config[k] = GUP[k];
	    }

	    // +---------------------------------------------------------------------------------
	    // | Initialize dat.gui
	    // +-------------------------------
	    var gui = new dat.gui.GUI();
	    gui.remember(bp.config);
	    
	    gui.add(bp.config, 'rebuild').name('Rebuild all').title('Rebuild all.');
	    
	    var fold0 = gui.addFolder('Editor settings');
	    fold0.add(bp.config, 'fullSize').onChange( function() { bp.resizeCanvas(); } ).title("Toggles the fullpage mode.");
	    fold0.add(bp.config, 'fitToParent').onChange( function() { bp.resizeCanvas(); } ).title("Toggles the fit-to-parent mode to fit to parent container (overrides fullsize).");
	    fold0.add(bp.config, 'scaleX').title("Scale x.").min(0.0).max(10.0).step(0.01).onChange( function() { console.log('changed'); bp.draw.scale.x = bp.fill.scale.x = bp.config.scaleX; bp.redraw(); console.log('scaleX',bp.config.scaleX); } ).listen();
	    fold0.add(bp.config, 'scaleY').title("Scale y.").min(0.0).max(10.0).step(0.01).onChange( function() { console.log('changed'); bp.draw.scale.y = bp.fill.scale.y = bp.config.scaleY; bp.redraw(); console.log('scaleY',bp.config.scaleY); } ).listen();
	    fold0.addColor(bp.config, 'backgroundColor').onChange( function() { bp.redraw(); } ).title("Choose a background color.");
	    // fold0.add(bp.config, 'loadImage').name('Load Image').title("Load a background image to pick triangle colors from.");
	    
	    var fold1 = gui.addFolder('Export');
	    fold1.add(bp.config, 'saveFile').name('Save a file').title("Save a file.");	 
	    // END init dat.gui
	} );
    
})(window); 




