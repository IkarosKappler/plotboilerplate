/**
 * @requires Line
 * 
 * @date 2020-12-04
 */

/**
 * @param {Array<Vertex>} vertices
 */  
var findNonIntersectingPolygons = function( vertices, depth ) {

    if( typeof depth === "undefined" )
	depth = 0;

    if( depth > 10 ) {
	console.log('aborting at depth 10');
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
		// pointList.push( intersectionPoint );
		// Cut polygon into two here
		var split = splitPolygonAt( vertices, a, b, intersectionPoint );
		
		// Have each 1 or 2 elements.
		var leftCleaned = findNonIntersectingPolygons( split[0], depth+1 );
		var rightCleaned =  findNonIntersectingPolygons( split[1], depth+1 );

		return leftCleaned.concat( rightCleaned );
	    }
	}	
    }
    // console.log( 'intersectionPoints', pointList );
    
    return [ vertices ];
};


// Pre: edgeIndexA < edgeIndexB
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
