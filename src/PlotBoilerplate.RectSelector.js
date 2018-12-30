/**
 * A rectangular-selector tool for the plot-boilerplate using DIVs.
 * 
 * This is to avoid redraw-events to be fired during the selection process (for large content 
 * that takes long to redraw).
 *
 * @require PlotBoilerplate, MouseHandler
 *
 * @author  Ikaros Kappler
 * @date    2018-12-30
 * @version 1.0.0
 **/

(function(_context) {

    PlotBoilerplate.RectSelector = function( bp, divID, normalization, callback ) {
	
	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	var rect = document.getElementById(divID); // 'drag-rect');
	var rectBounds = { xMin : 0, yMin : 0, xMax : 0, yMax : 0 };
	new MouseHandler(rect).up( function(e) {
	    rect.style.display = 'none';
	    console.log('xMin',rectBounds.xMin,'yMin',rectBounds.yMin,'xMax',rectBounds.xMax,'yMax',rectBounds.yMax);
	    if( rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax )
		callback( rectBounds );
	} );
	var mouseHandler = new MouseHandler(bp.canvas)
	    /*.move( function(e) {
		var relPos = bp.transformMousePosition( e.params.pos.x, e.params.pos.y );
		relPos.x = normalization.unNormalizeX(relPos.x);
		relPos.y = normalization.unNormalizeY(relPos.y);
		var cx = document.getElementById('cx');
		var cy = document.getElementById('cy');
		if( cx ) cx.innerHTML = relPos.x.toFixed(2);
		if( cy ) cy.innerHTML = relPos.y.toFixed(2);
	    } )*/
	    .down( function(e) {
		rect.style.display = 'inherit';
		rect.style.left = e.clientX+'px';
		rect.style.top = e.clientY+'px';
		rect.style.width = '1px';
		rect.style.height = '1px';
		var relPos = bp.transformMousePosition(e.params.mouseDownPos.x,e.params.mouseDownPos.y);
		rectBounds.xMin = rectBounds.xMax = normalization.unNormalizeX(relPos.x);
		rectBounds.yMin = rectBounds.yMax = normalization.unNormalizeY(relPos.y);
	    } )
	    .up( function(e) {
		console.log('up');
		rect.style.display = 'none';
		console.log('xMin',rectBounds.xStart,'yMin',rectBounds.yStart,'xMax',rectBounds.xEnd,'yMax',rectBounds.yEnd);
		//if( e.wasDragged )
		if( rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax )
		    callback( rectBounds );
	    } )
	    .drag( function(e) {
		var bounds = {
		    xStart : e.params.mouseDownPos.x,
		    yStart : e.params.mouseDownPos.y,
		    xEnd   : e.params.pos.x,
		    yEnd   : e.params.pos.y
		};
		var relPos = bp.transformMousePosition(e.params.pos.x,e.params.pos.y);
		rectBounds.xMax = normalization.unNormalizeX(relPos.x);
		rectBounds.yMax = normalization.unNormalizeY(relPos.y);
		rect.style.width = (bounds.xEnd-bounds.xStart)+'px';
		rect.style.height = (bounds.yEnd-bounds.yStart)+'px';
	    } )
	;
    };
})(typeof module != 'undefined' ? module.export : window );
