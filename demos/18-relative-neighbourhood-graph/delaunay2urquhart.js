/**
 * The Urquhart graph of a point set can be used as a good approximation 
 * of the  Relative Neighbourhood graph (which connects all points that
 * do not have a third point up close).
 *
 * https://en.wikipedia.org/wiki/Urquhart_graph
 * https://en.wikipedia.org/wiki/Relative_neighborhood_graph
 * https://en.wikipedia.org/wiki/Delaunay_triangulation
 *
 * It can be computed pretty easy by removing each 'longest edge'
 * from each triangle in the Delaunay triangulation. The latter
 * can be computed very quickly in O(n log n);
 *
 * @author  Ikaros Kappler
 * @date    2020-04-28
 * @version 1.0.0
 **/

(function() {

    /**
     * Try to set (or un-set) a field in a boolean false-first-matrix:
     *  - only undefined elements can be set to true.
     *
     * The matrix will be constructed symmetrically, so that
     * matrix[i][j] == matrix[j][i] for all i and j.
     *
     * @param {boolean[][]} matrix - The matrix itself (an array or object).
     * @param {number} i - The column index.
     * @param {number} j - The row index.
     * @param {boolean} value - Clear or set the matrix element.
     * @return {void}
     **/
    var trySetMatrix = function( matrix, i, j, value ) {
	if( typeof matrix[i] == 'undefined' )
	    matrix[i] = {};
	if( typeof matrix[j] == 'undefined' )
	    matrix[j] = {};
	if( typeof matrix[i][j] == 'undefined' || value == false ) {
	    matrix[i][j] = value;
	    matrix[j][i] = value;
	}
    };


    /**
     * This function converts a Delaunay triangulation to a set of
     * Urquhart graph edges.
     *
     * Note: your VertexAttr model must have a 'pointListIndex' (number)
     *       attribute that addresses the array index. Otherwise there
     *       would be no mapping from the triangle corners to the point
     *       list indices.
     *
     * @param {Triangle[]} delaunayTriangles
     * @param {Vertex[]} vertices
     * @return { a:Vertex, b:Vertex }[]
     **/
    var delaunay2urquhart = function( delaunayTriangles, vertices ) {
	// Step 0: clean up old stuff
	var urquhartEdges = [];
	
	// Step 1/3: initialize the matrix.
	
	// Set matrix[i][j]=false (symmetric) if there was an edge (i,j) in the delaunay
	// triangulation and it was deleted by the urquhart algorithm.
	// Otherwise set true. Non-edge pairs are kept undefined.
	var matrix = {};
	var n = vertices.length;
	for( var i = 0; i < n; i++ ) {
	    matrix[i] = {};
	}

	// Step 2/3: fill the matrix with egdes to be deleted (false) and edges to be kept (true).
	for( var t in delaunayTriangles ) {
	    var tri = delaunayTriangles[t];
	    // Set the two non-longest edges (if not deleted before)
	    var a = tri.a;
	    var b = tri.b;
	    var c = tri.c;

	    var ab = a.distance(b);
	    var bc = b.distance(c);
	    var ca = c.distance(a);
	    // Find the longest edge.
	    if( ab > bc && ab > ca ) {
		// ab is longest
		trySetMatrix( matrix, a.attr.pointListIndex, b.attr.pointListIndex, false );
		trySetMatrix( matrix, b.attr.pointListIndex, c.attr.pointListIndex, true );
		trySetMatrix( matrix, c.attr.pointListIndex, a.attr.pointListIndex, true );
	    } else if( bc > ab && bc > ca ) {
		// bc is longest
		trySetMatrix( matrix, a.attr.pointListIndex, b.attr.pointListIndex, true );
		trySetMatrix( matrix, b.attr.pointListIndex, c.attr.pointListIndex, false );
		trySetMatrix( matrix, c.attr.pointListIndex, a.attr.pointListIndex, true );
	    } else {
		// ca is longest
		trySetMatrix( matrix, a.attr.pointListIndex, b.attr.pointListIndex, true );
		trySetMatrix( matrix, b.attr.pointListIndex, c.attr.pointListIndex, true );
		trySetMatrix( matrix, c.attr.pointListIndex, a.attr.pointListIndex, false );
	    }
	}

	// Step 3/3: build a list of edges
	for( var a = 0; a < n; a++ ) {
	    for( var b = 0; b < a; b++ ) {
		if( matrix[a][b] === true )
		    urquhartEdges.push( { a : vertices[a], b : vertices[b] } );
	    }
	}

	return urquhartEdges;
    };

    window.delaunay2urquhart = delaunay2urquhart;

})();
