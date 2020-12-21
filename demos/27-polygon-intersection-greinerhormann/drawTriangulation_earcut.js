/**
 * This will only work if non-self-overlapping polygons.
 *
 * * Concave polygons work
 * * Convex polygons are fine
 * * Self intersections are fine
 *
 * @param {Polygon} intersectionPolygon
 * @param {Polygon} sourcePolygon
 * @param {Polygon} clipPolygon
 */
var drawTriangulation_earcut = function( pb, intersectionPolygon, sourcePolygon, clipPolygon ) {
    // Convert vertices into a sequence of coordinates for the earcut algorithm
    var earcutVertices = [];
    for( var i = 0; i < intersectionPolygon.vertices.length; i++ ) {
	earcutVertices.push( intersectionPolygon.vertices[i].x );
	earcutVertices.push( intersectionPolygon.vertices[i].y );
    }

    var triangleIndices = earcut( earcutVertices,
				  [], // holeIndices
				  2   // dim
				);

    var triangles = [];
    for( var i = 0; i+2 < triangleIndices.length; i+= 3 ) {
	var a = triangleIndices[i];
	var b = triangleIndices[i+1];
	var c = triangleIndices[i+2];
	var tri = new Triangle( intersectionPolygon.vertices[a],
				intersectionPolygon.vertices[b],
				intersectionPolygon.vertices[c] );
	triangles.push( tri );
	pb.draw.polyline( [tri.a, tri.b, tri.c], false, 'rgba(0,128,255,0.5)', 1 );
    }
    
};
