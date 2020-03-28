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
 * @modified 2020-03-28 Ported this vanilla-JS class to Typescript.
 * @version 1.0.1
 **/

interface XBounds {
    xMin : number;
    xMax : number;
    yMin : number;
    yMax : number;
}

interface Normalization {
    unNormalizeX: (x:number)=>number;
    unNormalizeY: (y:number)=>number;
}

class PlotBoilerpate$RectSelector {

    // Todo: rename callback to onRectSelected
    constructor( bp:PlotBoilerplate,
		 divID:string,
		 normalization:Normalization,
		 callback:(bounds:XBounds)=>void
	       ) {
	
	// +---------------------------------------------------------------------------------
	// | Add a mouse listener to track the mouse position.
	// +-------------------------------
	let rect : HTMLDivElement = (document.getElementById(divID) as HTMLDivElement);
	let rectBounds : XBounds = { xMin : 0, yMin : 0, xMax : 0, yMax : 0 };
	new MouseHandler(rect).up( (e:XMouseEvent) => {
	    if( e.button != 0 ) // Left mouse button?
		return;
	    rect.style.display = 'none';
	    // console.log('xMin',rectBounds.xMin,'yMin',rectBounds.yMin,'xMax',rectBounds.xMax,'yMax',rectBounds.yMax);
	    if( rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax )
		callback( rectBounds );
	} );
	var mouseHandler : MouseHandler = new MouseHandler(bp.canvas)
	    .down( (e:XMouseEvent) => {
		if( e.button != 0 ) // Left mouse button?
		    return;
		rect.style.display = 'inherit';
		rect.style.left    = e.clientX+'px';
		rect.style.top     = e.clientY+'px';
		rect.style.width   = '1px';
		rect.style.height  = '1px';
		var relPos : XYCoords = bp.transformMousePosition(e.params.mouseDownPos.x,e.params.mouseDownPos.y);
		rectBounds.xMin = rectBounds.xMax = normalization.unNormalizeX(relPos.x);
		rectBounds.yMin = rectBounds.yMax = normalization.unNormalizeY(relPos.y);
	    } )
	    .up( (e:XMouseEvent) => {
		if( e.button != 0 ) // Left mouse button?
		    return;
		// console.log('up');
		rect.style.display = 'none';
		// console.log('xMin',rectBounds.xStart,'yMin',rectBounds.yStart,'xMax',rectBounds.xEnd,'yMax',rectBounds.yEnd);
		//if( e.wasDragged )
		if( rectBounds.xMin != rectBounds.xMax && rectBounds.yMin != rectBounds.yMax )
		    callback( rectBounds );
	    } )
	    .drag( (e:XMouseEvent) => {
		if( e.button != 0 ) // Left mouse button?
		    return;
		var bounds : XBounds = {
		    xMin : e.params.mouseDownPos.x,
		    yMin : e.params.mouseDownPos.y,
		    xMax   : e.params.pos.x,
		    yMax   : e.params.pos.y
		};
		var relPos : XYCoords = bp.transformMousePosition(e.params.pos.x,e.params.pos.y);
		rectBounds.xMax = normalization.unNormalizeX(relPos.x);
		rectBounds.yMax = normalization.unNormalizeY(relPos.y);
		rect.style.width = (bounds.xMax-bounds.xMin)+'px';
		rect.style.height = (bounds.yMax-bounds.yMin)+'px';
	    } )
	;
    }; // END constructor
}
