/**
 * A simple double click / tap handler.
 *
 * NOTE: THIS CLASS IS CURRENTLY NOT IN USE.
 *
 * @require AlloyFinger
 *
 * @author  Ikaros Kappler
 * @date    2020-07-24
 * @version 1.0.0
 **/

(function() {
    
    /**
     * @param {PlotBoilerplate} pb
     * @param {function} handleDoubleclick - A callback function(position:XYCoords, event:MouseEvent|TouchEvent, pb:PlotBoilerplate).
     **/
    var DoubleclickHandler = function( pb, handleDoubleclick ) {
	
	// @param {XYCoords} clickPos
	// @return Vertex
	var clickPositionToPoint = function(clickPos) {
	    var relPos = { x : clickPos.x - pb.canvas.offsetLeft,
			   y : clickPos.y - pb.canvas.offsetTop
			 };
	    return pb.transformMousePosition(relPos.x, relPos.y)
	}  ;
	
	pb.config.canvas.addEventListener('dblclick', function(e) {
	    var point = clickPositionToPoint( { x : e.clientX, y : e.clientY } );
	    console.log("dblclicked", point, e);
	    handleDoubleclick( point, e, pb );
	} );
	new AlloyFinger( pb.config.canvas, { tap: function (e) {
	    console.log( e );
	    if( e.touches.length != 0 ) {
		var point = clickPositionToPoint( { x : e.touches[0].clientX, y : e.touches[0].clientY } );
		console.log('tapped', point, e);
		handleDoubleclick( point, e, pb );
	    } else if( e.changedTouches.length != 0 ) {
		var point = clickPositionToPoint( { x : e.changedTouches[0].clientX, y : e.changedTouches[0].clientY } );
		console.log('tapped', point, e);
		handleDoubleclick( point, e, pb );
	    }
	} } );
    };

    window.DoubleclickHandler = DoubleclickHandler;

})();
