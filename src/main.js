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
    
   window.addEventListener( 'load',
			 function() {
			     var bp = new PlotBoilerplate();

			     // +---------------------------------------------------------------------------------
			     // | Initialize dat.gui
			     // +-------------------------------
			     { 
				 var gui = new dat.gui.GUI();
				 gui.remember(bp.config);
				 
				 gui.add(bp.config, 'rebuild').name('Rebuild all').title('Rebuild all.');
				 
				 var fold0 = gui.addFolder('Editor settings');
				 fold0.add(bp.config, 'fullSize').onChange( bp.resizeCanvas ).title("Toggles the fullpage mode.");
				 fold0.add(bp.config, 'fitToParent').onChange( bp.resizeCanvas ).title("Toggles the fit-to-parent mode (overrides fullsize).");
				 fold0.add(bp.config, 'scaleX').onChange( function() { console.log('changed'); bp.draw.scale.x = bp.fill.scale.x = bp.config.scaleX; bp.redraw(); } ).title("Scale x.").min(0.0).max(10.0).step(0.1);
				 fold0.add(bp.config, 'drawEditorOutlines').onChange( bp.redraw ).title("Toggle if editor outlines should be drawn.");
				 fold0.addColor(bp.config, 'backgroundColor').onChange( bp.redraw ).title("Choose a background color.");
				 fold0.add(bp.config, 'loadImage').name('Load Image').title("Load a background image to pick triangle colors from.");
				 
				 var fold1 = gui.addFolder('Export');
				 fold1.add(bp.config, 'saveFile').name('Save a file').title("Save a file.");	 
			     } // END init dat.gui
			 } );
    
})(window); 




