/**
 * Draw a fancy crosshair. The default one is useful but boring.
 *
 * @author Ikaros Kappler
 * @date   2020-11-25
 **/

var drawFancyCrosshair = function( pb, position, isHighlighted, isSelected ) {
    var color = isSelected ? 'red' : isHighlighted ? 'rgba(192,0,0,0.5)' : 'rgba(0,192,192,0.5)';
    var lineWidth = isSelected ? 2.0 : 1.0;
    var crossRadius = 2;
    var arcRadius = 3;
    var s = Math.sin(Math.PI/4)*crossRadius;
    var c = Math.cos(Math.PI/4)*crossRadius;
    pb.draw.line( new Vertex( position.x + c,
			      position.y + s ),
		  new Vertex( position.x - c,
			      position.y - s ),
		  color, lineWidth );
    pb.draw.line( new Vertex( position.x + c,
			      position.y - s ),
		  new Vertex( position.x - c,
			      position.y + s ),
		  color, lineWidth );
    for( var i = 0; i < 4; i++ ) {
	pb.draw.circleArc( position,
			   arcRadius,
			   Math.PI/2 * (i+1) + Math.PI*2*0.2,
			   Math.PI/2 * (i+1) + Math.PI*2*0.3,
			   color, lineWidth );
    }
};
