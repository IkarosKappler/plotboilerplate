/**
 * Create the voronoi diagram from the given delaunay triangulation (they are dual graphs).
 *
 * @requires VoronoiCell, Triangle
 *
 * @author   Ikaros Kappler
 * @date     2018-04-07
 * @modified 2018-04-11 Using VoronoiCells now (was array before).
 * @version  1.0.1
 **/

(function(context) {
    "strict mode";

    context.delaunay2voronoi = function( pointList, triangles ) {

	this.failedTriangleSets = [];
	this.hasErrors          = false;
	let _self               = this;

	// +---------------------------------------------------------------------------------
	// | Convert the triangle set to the Voronoi diagram.
	// +-------------------------------
	this.build = function() {
	    var voronoiDiagram = [];	    
	    for( var p in pointList ) {
		var point = pointList[p];
		// Find adjacent triangles for first point
		var adjacentSubset = []; 
		for( var t in triangles ) {
		    if( triangles[t].a.equals(point) || triangles[t].b.equals(point) || triangles[t].c.equals(point) ) 
			adjacentSubset.push( triangles[t] );
		    
		}
		var path = subsetToPath(adjacentSubset);
		if( path ) // There may be errors
		    voronoiDiagram.push( new VoronoiCell(path,point) ); 
	    }
	    return voronoiDiagram;
	};


	// +---------------------------------------------------------------------------------
	// | Re-order a tiangle subset so the triangle define a single path.
	// |
	// | It is required that all passed triangles are connected to a
	// | path. Otherwise this function will RAISE AN EXCEPTION.
	// |
	// | The function has a failsafe recursive call for the case the first
	// | element in the array is inside the path (no border element).
	// +-------------------------------
	var subsetToPath = function( triangleSet, startPosition, tryOnce ) {
	    if( triangleSet.length == 0 )
		return [];

	    if( typeof startPosition === 'undefined' )
		startPosition = 0;
	    
	    var t       = startPosition;
	    var result  = [ triangleSet[t] ];
	    var visited = [ t ];
	    var i = 0;
	    while( result.length < triangleSet.length && i < triangleSet.length ) {
		var u = (startPosition+i)%triangleSet.length;
		if( t != u && visited.indexOf(u) == -1 && triangleSet[t].isAdjacent(triangleSet[u]) ) {
		    result.push(triangleSet[u]);
		    visited.push(u);
		    t = u;
		    i = 0;
		} else {
		    i++;
		}
	    }
	    // If not all triangles were used the passed set is NOT CIRCULAR.
	    // But in this case the triangle at position t is at one end of the path :)
	    // -> Restart with t.
	    if( result.length < triangleSet.length ) {
		if( tryOnce ) {
		    // Possibility A (try to fix this): split the triangle set into two arrays and restart with each.
		    // Possibility B (no fix for this): throw an error and terminate.
		    // Possibility C (temp solution): Store the error for later reporting and continue.
		    _self.failedTriangleSets.push( triangleSet );
		    _self.hasErrors = true;
		    // throw "Error: this triangle set is not connected: " + JSON.stringify(triangleSet);
		    return null;
		} else {
		    // Triangle inside path found. Rearrange.
		    return subsetToPath( triangleSet, t, true );
		}
	    } else {	    
		return result;
	    }
	};

    }; // END voronoi
    
})( window ? window : module.export );
