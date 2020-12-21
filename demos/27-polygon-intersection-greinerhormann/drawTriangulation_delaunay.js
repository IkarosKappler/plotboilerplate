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
var drawTriangulation_delaunay = function( pb, intersectionPolygon, sourcePolygon, clipPolygon, drawDelaunayCircles ) {
    var selfIntersectionPoints = findPolygonSelfIntersections( intersectionPolygon );
    var extendedPointList = intersectionPolygon.vertices.concat( selfIntersectionPoints );

    var delaunay = new Delaunay( extendedPointList, {} );
    // Array<Triangle>
    var triangles = delaunay.triangulate();

    // Find real intersections with the triangulations and the polygon
    // extendedPointList    

    // Remember: delaunay returns an array with lots of empty slots.
    //           So don't use triangles.length to access the triangles.
    for( var i in triangles ) {
	var tri = triangles[i];
	// Check if triangle belongs to the polygon or is outside
	if( !sourcePolygon.containsVert( tri.getCentroid() ) )
	    continue;
	if( !clipPolygon.containsVert( tri.getCentroid() ) )
	    continue;

	// Cool, triangle is part of the intersection.
	pb.draw.polyline( [tri.a, tri.b, tri.c], false, 'rgba(0,128,255,0.5)', 1 );
	// drawFancyCrosshair( pb, tri.a, false, false );
	// drawFancyCrosshair( pb, tri.b, false, false );
	// drawFancyCrosshair( pb, tri.c, false, false );
	if( drawDelaunayCircles ) {
	    var circumCircle = tri.getCircumcircle();
	    pb.draw.crosshair( circumCircle.center, 5, 'rgba(255,0,0,0.25)' );
	    pb.draw.circle(  circumCircle.center, circumCircle.radius, 'rgba(255,0,0,0.25)',1.0 );
	}
    }
};
