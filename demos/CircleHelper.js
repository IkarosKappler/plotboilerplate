/**
 * @author Ikaros Kappler
 * @date 2020-09-07
 * @version 0.0.1
 **/

var CircleHelper= function( circle, radiusPoint, pb ) {
    circle.center.listeners.addDragListener( function(e) {
	radiusPoint.add( e.params.dragAmount );
	pb.redraw();
    } );
    radiusPoint.listeners.addDragListener( function(e) {
	circle.radius = circle.center.distance( radiusPoint );
	pb.redraw();
    } );
};

window.CircleHelper = CircleHelper;
