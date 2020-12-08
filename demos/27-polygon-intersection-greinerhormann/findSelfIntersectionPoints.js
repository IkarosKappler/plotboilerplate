/**
 * @requires Line
 * @requires Polygon
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date   2020-12-04
 */


/**
 * Collect all self-intersection points of the given polygon.
 *
 * @param {Polygon} polygon
 * @return Array<Vertex>
 */
var findSelfIntersectionPoints = function( polygon ) {
    var pointList = [];
    var lineA = new Line( new Vertex(), new Vertex() );
    var lineB = new Line( new Vertex(), new Vertex() );
    for( var a = 0; a < polygon.vertices.length; a++ ) {
	lineA.a.set( polygon.getVertexAt(a) );
	lineA.b.set( polygon.getVertexAt(a+1) );
	for( var b = 0; b < polygon.vertices.length; b++ ) {
	    // Same edge or neighbour edges intersect by definition.
	    // Skip them.
	    if( a == b || a+1 == b || a == b+1
		|| (a==0&&b+1==polygon.vertices.length) || (b==0&&a+1==polygon.vertices.length) )
		continue;
	    lineB.a.set( polygon.getVertexAt(b) );
	    lineB.b.set( polygon.getVertexAt(b+1) );

	    // Commpute the intersection point of the (infinite) lines.
	    // The point is undefined if and only if both line are parallel (co-linear).
	    const intersectionPoint = lineA.intersection(lineB);

	    // Check if the intersection point is on both (finite) edges of the polygon.
	    if( intersectionPoint
		&& lineA.hasPoint(intersectionPoint) && lineB.hasPoint(intersectionPoint) ) {
		pointList.push( intersectionPoint );
	    }
	}	
    }
    return pointList;
};
