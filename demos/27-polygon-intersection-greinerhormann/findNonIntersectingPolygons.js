/**
 * This function cuts a given self-intersecting polygon into sub polygons.
 *
 * Each sub polygon in the returned array is non-self intersecting.
 *
 * Please note that the union set of the sub polygons themselves may _not_ be disjunct!
 *
 *
 * @requires Line
 * @requires Vertex
 * @requires greinerHormann
 * 
 * @date 2020-12-04
 */

(function(_context) {

    /**
     * @param {Array<Vertex>} vertices
     * @param {boolean=true} noOverlaps
     * @param {number=10} maxDepth
     */  
    var findNonIntersectingPolygons = function( vertices, allowOverlaps, maxDepth ) {

	console.log( 'findNonIntersectingPolygons' );

	if( typeof maxDepth === "undefined" )
	    maxDepth = 10;

	if( typeof allowOverlaps === "undefined" )
	    allowOverlaps = true;


	var polygons = _findNonIntersectingPolygons( vertices, maxDepth );
	if( allowOverlaps ) {
	    return polygons;
	} else {
	    var resultPolys = [];
	    for( var i = 0; i < polygons.length; i++ ) {
		// var intersection = greinerHormann.intersection(sourcePolygon.vertices, clipPolygon.vertices);
		// These can be remove but they are there for fun :)
		// var union        = greinerHormann.union(sourcePolygon.vertices, clipPolygon.vertices);
		for( var j = 0; j < polygons.length; j++ ) {
		    // Clip off from polygon i everything that's inside polygon j
		    var diff         = greinerHormann.diff( polygons[i], polygons[j] );
		    if( diff ) { // intersection ) {
			if( typeof diff[0][0] === 'number' ) { // single linear ring
			    diff = [diff];
			}
			//console.log( intersection );
			//for( var i = 0, len = intersection.length; i < len; i++ ){
			    // console.log( intersection[i] );  
			//}
			resultPolys = resultPolys.concat( diff );
		    }
		}
	    }
	    return resultPolys;
	}
    };

    
    var _findNonIntersectingPolygons = function( vertices, maxDepth ) {

	if( maxDepth <= 0 ) {
	    console.log('aborting at max depth');
	    return [ vertices ];
	}

	if( vertices.length <= 3 ) {
	    // No intersections possible
	    return [ vertices ];
	}

	// var pointList = [];
	var n = vertices.length;
	var lineA = new Line( new Vertex(), new Vertex() );
	var lineB = new Line( new Vertex(), new Vertex() );
	for( var a = 0; a < vertices.length; a++ ) {
	    lineA.a.set( vertices[a] );
	    lineA.b.set( vertices[(a+1) % n] );
	    for( var b = 0; b < vertices.length; b++ ) {
		// Equal or neighbour edges intersect by definition.
		// We ignore them.
		if( a == b || a+1 == b || a == b+1 || (a==0&&b+1==vertices.length) || (b==0&&a+1==vertices.length) )
		    continue;
		lineB.a.set( vertices[b] );
		lineB.b.set( vertices[(b+1) % n] );

		const intersectionPoint = lineA.intersection(lineB);
		// console.log( 'intersectionPoint', intersectionPoint );
		if( intersectionPoint && lineA.hasPoint(intersectionPoint) && lineB.hasPoint(intersectionPoint) ) {
		    console.log( 'intersection found' );
		    // pointList.push( intersectionPoint );
		    // Cut polygon into two here
		    var split = splitPolygonAt( vertices, a, b, intersectionPoint );
		    
		    // Split has 2 elements.
		    var leftCleaned = _findNonIntersectingPolygons( split[0], maxDepth-1 );
		    var rightCleaned =  _findNonIntersectingPolygons( split[1], maxDepth-1 );

		    return leftCleaned.concat( rightCleaned );
		}
	    }	
	}
	// console.log( 'intersectionPoints', pointList );

	// No intersection found:
	//    just return a list with the original
	//    polygon as its only element.
	return [ vertices ];
    };


    // Pre: edgeIndexA < edgeIndexB && vertices.length >= 4
    var splitPolygonAt = function( vertices, edgeIndexA, edgeIndexB, intersectionPoint ) {

	// console.log( 'split', edgeIndexA, edgeIndexB );
	
	var first = [];
	var second = [];
	for( var i = 0; i < vertices.length; i++ ) {
	    if( i <= edgeIndexA )
		first.push( vertices[i] );

	    if( i == edgeIndexA )  {
		first.push( intersectionPoint );
		second.push( intersectionPoint ); // clone???
	    }

	    if( i > edgeIndexA && i <= edgeIndexB )
		second.push( vertices[i] );

	    if( i > edgeIndexB )
		first.push( vertices[i] );
	    
	}

	// console.log( 'split', first, second );

	return [ first, second ];
    };

    _context.findNonIntersectingPolygons = findNonIntersectingPolygons;

})(globalThis || window);
