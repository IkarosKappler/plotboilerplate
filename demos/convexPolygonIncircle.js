/**
 * Compute a max incircle for the given polygon.
 *
 * @requires Circle, Line, Vertex, Triangle, nsectAngle, geomutils.
 *
 * https://observablehq.com/@mbostock/convex-polygon-incircle
 * https://observablehq.com/@mbostock/circle-tangent-to-three-lines
 */

(function() {

    /**
     * For circle-polygon-intersection-count detection we need an epsilon to
     * eliminate smaller precision errors.
     */
    var EPS = 0.000001;
    

    /**
     * Compute the max sized inlying circle in the given convex (!) polygon - also called the
     * convex-polygon incircle.
     *
     * The function will return an object with either: the circle, and the triangle that defines
     * the three tangent points where the circle touches the polygon.
     *
     * @param {Polygon} convexHull - The actual convex polygon.
     * @return { circle: circle, tringle: triangle }
     */
    var convexPolygonIncircle = function( convexHull ) {
	var n = convexHull.vertices.length;
	var bestCircle = undefined;
	var bestTriangle = undefined;
	for( var a = 0; a < n; a++ ) {
	    for( var b = a+1; b < n; b++ ) {
		for( var c = b+1; c < n; c++ ) {
		    // As these lines are part of the convex hull, we know that
		    //  * line a preceeds line b and
		    //  * line b preceeds line c :)
		    var lineA = new Line( convexHull.vertices[a], convexHull.vertices[(a+1)%n] );
		    var lineB = new Line( convexHull.vertices[b], convexHull.vertices[(b+1)%n] );
		    var lineC = new Line( convexHull.vertices[c], convexHull.vertices[(c+1)%n] );

		    // Find intersections by expanding the lines
		    var vertB = lineA.intersection(lineB);
		    var vertC = lineB.intersection(lineC);

		    // An object: { center: Vertex, radius: number }
		    var triangle = getTangentTriangle4( lineA.a, vertB, vertC, lineC.b );
		    // Workaround. There will be a future version where the 'getCircumCircle()' functions
		    // returns a real Circle instance.
		    var _circle = triangle.getCircumcircle();
		    var circle = new Circle( _circle.center, _circle.radius );

		    // Count the number of intersections with the convex hull:
		    // If there are exactly three, we have found an in-lying circle.
		    //  * Check if this one is better (bigger) than the old one.
		    //  * Also check if the circle is located inside the polygon;
		    //    The construction can, in some cases, produce an out-lying circle.
		    if( !convexHull.containsVert(circle.center) ) {
			continue;
		    }
		    var circleIntersections = findCircleIntersections( convexHull, circle );
		    if( circleIntersections.length == 3 && (bestCircle == undefined || bestCircle.radius < circle.radius) ) {
			bestCircle = circle;
			bestTriangle = triangle;
		    }
		}
	    }
	}
	return { circle : bestCircle, triangle : bestTriangle };
    };


    /**
     * This function computes the three points for the inner maximum circle 
     * lying tangential to the three subsequential lines (given by four points).
     *
     * Compute the circle from that triangle by using Triangle.getCircumcircle().
     *
     * Not all three lines should be parallel, otherwise the circle might have infinite radius.
     *
     * LineA = [vertA, vertB]
     * LineB = [vertB, vertC]
     * LineC = [vertC, vertD]
     *
     * @param {Vertex} vertA - The first point of the three connected lines.
     * @param {Vertex} vertB - The second point of the three connected lines.
     * @param {Vertex} vertC - The third point of the three connected lines.
     * @param {Vertex} vertD - The fourth point of the three connected lines.
     * @return {Triangle}
     */
    var getTangentTriangle4 = function( vertA, vertB, vertC, vertD ) {
	var lineA = new Line(vertA,vertB);
	var lineB = new Line(vertB,vertC);
	var lineC = new Line(vertC,vertD);

	var bisector1 = geomutils.nsectAngle( vertB, vertA, vertC, 2 )[0]; // bisector of first triangle
	var bisector2 = geomutils.nsectAngle( vertC, vertB, vertD, 2 )[0]; // bisector of second triangle
	var intersection = bisector1.intersection( bisector2 );

	// Find the closest points on one of the polygon lines (all have same distance by construction)
	var circleIntersA = lineA.getClosestPoint( intersection );
	var circleIntersB = lineB.getClosestPoint( intersection );
	var circleIntersC = lineC.getClosestPoint( intersection );

	var triangle = new Triangle(circleIntersA, circleIntersB, circleIntersC);

	// Unfortunately the returned Circle is just a wrapper, not a real class instance.
	// The Triangle class does not yet know the Circle class.
	return triangle; 
    };


    var findCircleIntersections = function( convexHull, circle ) {
	var result = [];
	for( var i = 0; i < convexHull.vertices.length; i++ ) {
	    var line = new Line( convexHull.vertices[i], convexHull.vertices[(i+1)%convexHull.vertices.length] );
	    // Use an epsilon here because circle coordinates can be kind of unprecise in the detail.
	    if( circle.lineDistance(line) < EPS ) {
		result.push( i );
	    }
	}
	return result;
    };

    window.convexPolygonIncircle = convexPolygonIncircle;
    
})();
