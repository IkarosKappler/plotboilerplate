/**
 * Approximate circles with sequence of n circular arranged cubic Bézier curves.
 *
 * @author  Ikaros Kappler
 * @date    2020-05-25
 * @version 1.0.0
 *
 * @param {Circle} circle - The circle to convert.
 * @param {number} pointCount - The number of outer points for the circular Bézier path.
 * @param {number} startAngle - The circle angle to start with.
 * @param {function} tangentCallback - A function(tangentVector,i) that will be called for each outer circle vertex.
 * @return {Vertex[]} A sequence of path points and (for each of them two) control points [p, c, c, p, c, c, p ..., c, c, p, c]
 **/
var circle2bezier = function( circle, pointCount, startAngle, tangentCallback ) {
    // Approximate circle with n Bézier curves:
    // https://stackoverflow.com/questions/1734745/how-to-create-circle-with-b%C3%A9zier-curves
    //   (4/3)*tan(pi/(2n))
    var bPathPoints = [];
    var lastTangent = null;
    for( var i = 0; i <= pointCount; i++ ) {
	var tangent = circle.tangentAt( startAngle + i*Math.PI*2/pointCount );
	tangent.setLength( 4.0/3.0 * Math.tan( Math.PI/(2*pointCount) )* circle.radius );

	if( typeof tangentCallback == "function" )
	    tangentCallback( tangent, i );

	if( !lastTangent ) {
	    bPathPoints.push( tangent.a );
	} else {
	    bPathPoints.push( lastTangent.b );
	    var tmp = tangent.clone().inv();
	    bPathPoints.push( tmp.b );
	    bPathPoints.push( tmp.a );
	}
	
	lastTangent = tangent;
    }
    return bPathPoints;
};
