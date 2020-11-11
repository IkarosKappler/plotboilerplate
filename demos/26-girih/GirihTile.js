/**
 * @class
 * @classdesc This is a general tile superclass. All other tile classes extends this one.
 *
 * Rule:
 *  * the outer and the inner sub polygons must be inside the main polygon's bounds.
 *
 * @requires Bounds
 * @requires Polyon
 * @requires Vertex
 * 
 * @author   Ikaros Kappler
 * @date     2013-11-27
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-30 Refactored the this super class to work with PlotBoilerplate.
 * @version  2.0.0-alpha
 * @name GirihTile
 **/


/**
 * @constructor
 * @abstract class
 * @param {Vertex} position - The position of the tile.
 * @param {number} size     - The edge size (usually IKRS.Girih.DEFAULT_EDGE_LENGTH).
 * @param {string} tileType - One of GirihTile.TILE_TYPE_*.
 **/
var GirihTile = function( position,
			  size,
			  tileType
			) {

    Polygon.call( this, [], false ); // ..., vertices, isOpen

    // if( typeof angle == "undefined" )
    //angle = 0.0;
    if( typeof tileType == "unknown" )
	tileType = GirihTile.TYPE_UNKNOWN;
    
    this.size                 = size;
    this.position             = position;
    this.rotation             = 0.0; // angle;
    this.symmetry             = 10;
    this.uniqueSymmetries     = 10;

    // An array of polygons.
    // The inner tile polygons are those that do not share edges with the outer
    // tile bounds (vertices are OK).
    this.innerTilePolygons    = []; 

    // A second array of polygons.
    // The outer tile polygons are those that make up the whole tile area
    // _together with the inner tile polygons (!)_; the union of the
    // inner tile polygons and the outer tile polygons covers exactly
    // the whole tile polygon.
    // The intersection of both sets is empty.
    // Outer tile polygon share at least one (partial) edge with the complete
    // tile polygon (length > 0).
    this.outerTilePolygons    = [];  
    this.imageProperties      = null;

    this.tileType             = tileType;
    this.epsilon              = 0.001;

};

GirihTile.TYPE_UNKNOWN            = "UNKNOWN";
GirihTile.TYPE_DECAGON            = "DECAGON";
GirihTile.TYPE_PENTAGON           = "PENTAGON";
GirihTile.TYPE_IRREGULAR_HEXAGON  = "IRREGULAR_HEXAGON";
GirihTile.TYPE_RHOMBUS            = "RHOMBUS";
GirihTile.TYPE_BOW_TIE            = "BOW_TIE";
// This is not part of the actual girih tile set!
GirihTile.TYPE_PENROSE_RHOMBUS    = "PENROSE_RHOMBUS";


// Prepare the tile alignment matrix:
// [ actual_tile ] x [ edge_index ] x [ successor_index ] = tile_align
// GirihTile.TILE_ALIGN              = Array();
GirihTile.DEFAULT_EDGE_LENGTH     = 58;


/**
 * @abstract Subclasses must override this.
 */
GirihTile.prototype.clone = function() {
    throw "Subclasses must override the clone() function.";
};

/**
 * @param {XYCoords} amount
 */
GirihTile.prototype.move = function( amount ) {
    Polygon.prototype.move.call( this, amount );
    for( var i in this.innerTilePolygons )
	this.innerTilePolygons[i].move( amount );
    for( var i in this.outerTilePolygons )
	this.outerTilePolygons[i].move( amount );
    this.position.add( amount );
};

// Find the adjacent tile (given by the template tile)
// Note that the tile itself will be modified (rotated and moved to the correct position).
GirihTile.prototype.findAdjacentTilePosition = function( edgeIndex, tile ) {
    var edgeA = new Line( this.vertices[ edgeIndex % this.vertices.length ],
			  this.vertices[ (edgeIndex+1) % this.vertices.length ] );
    // Find adjacent edge
    for( var i = 0; i < tile.vertices.length; i++ ) {
	var edgeB = new Line( tile.vertices[ i % tile.vertices.length ].clone(),
			      tile.vertices[ (i+1) % tile.vertices.length ].clone() );
	// Goal: edgeA.a==edgeB.b && edgeA.b==edgeB.a
	// So move edgeB
	var offset = edgeB.b.difference(edgeA.a);
	edgeB.add( offset );
	if( edgeB.a.distance(edgeA.b) < this.epsilon ) {
	    return { edgeIndex : i, offset : offset };
	} 	
    }
    return null;
};


// +---------------------------------------------------------------------------------
// | Apply adjacent tile position to `neighbourTile`. 
// +-------------------------------
GirihTile.prototype.transformTileToAdjacencies = function( // baseTile,
							   baseEdgeIndex,
							   neighbourTile ) {
    // Find a rotation for that tile to match
    var i = 0;
    var foundAlignments = [];
    var positionedTile = null;
    while( i < neighbourTile.uniqueSymmetries ) {
	positionedTile = this.transformTilePositionToAdjacency( /* baseTile,*/ baseEdgeIndex, neighbourTile );
	if( positionedTile != null ) {
	    // console.log('Found?', adjacency );
	    positionedTile = positionedTile.clone();
	    // positionedTile.rotate( (Math.PI*2)/positionedTile.symmetry );
	    foundAlignments.push( positionedTile );
	} // else {
	neighbourTile.rotate( (Math.PI*2)/neighbourTile.symmetry );
	// }
	i++
    }
    return foundAlignments;
};


// +---------------------------------------------------------------------------------
// | Apply adjacent tile position to `neighbourTile`. 
// +-------------------------------
GirihTile.prototype.transformTilePositionToAdjacency = function( // baseTile,
								 baseEdgeIndex,
								 neighbourTile ) {
    // Find the position for that tile to match (might not exist)
    // { edgeIndex:number, offset:XYCoords }
    var adjacency = this.findAdjacentTilePosition( baseEdgeIndex, neighbourTile );
    if( adjacency != null ) {
	neighbourTile.move( adjacency.offset );
	return neighbourTile;
    }
    return null;
};


/**
 * This function applies MOD to the index.
 **/
GirihTile.prototype.getInnerTilePolygonAt = function( index ) {
    if( index < 0 ) 
	return this.innerTilePolygons[ this.innerTilePolygons.length - (Math.abs(index)%this.innerTilePolygons.length) ];
    else
	return this.innerTilePolygons[ index % this.innerTilePolygons.length ];
};

/**
 * This function applies MOD to the index.
 **/
GirihTile.prototype.getOuterTilePolygonAt = function( index ) {
    if( index < 0 ) 
	return this.outerTilePolygons[ this.outerTilePolygons.length - (Math.abs(index)%this.outerTilePolygons.length) ];
    else
	return this.outerTilePolygons[ index % this.outerTilePolygons.length ];
};

 
GirihTile.prototype.getTranslatedVertex = function( index ) {
    // Rotate around the absolut center!
    // (the position is applied later)
    return this.translateVertex( this.vertices[index % this.vertices.length ] );
};

// Note: this function behaves a bitdifferent than the genuine Polygon.rotate function!
// Polygon has the default center of rotation at (0,0).
// The GirihTile rotates around its center (position) by default.
GirihTile.prototype.rotate = function( angle, center ) {
    if( typeof center === "undefined" )
	center = this.position;
    Polygon.prototype.rotate.call( this, angle, center );
    for( var i in this.innerTilePolygons ) {
	this.innerTilePolygons[i].rotate( angle, center );
    }
    for( var i in this.outerTilePolygons ) {
	this.outerTilePolygons[i].rotate( angle, center );
    }
    this.rotation += angle;
    return this;
};


/**
 * This is a special get* function that modulates the index and also
 * allows negative values.
 * 
 * For k >= 0:
 *  - getVertexAt( vertices.length )     == getVertexAt( 0 )
 *  - getVertexAt( vertices.length + k ) == getVertexAt( k )
 *  - getVertexAt( -k )                  == getVertexAt( vertices.length -k )
 *
 * So this function always returns a point for any index.
 **/
// THIS IS NOW PART OF THE POLYGON CLASS
/* GirihTile.prototype.getVertexAt = function( index ) {
    return this.vertices[ index % this.vertices.length ];
} */

/**
 * This function checks if the passed point is within this tile's polygon.
 *
 * @param point The point to be checked.
 * @retrn true|false
 **/
// THIS IS NOW PART OF THE POLYGON CLASS
/*
GirihTile.prototype.containsPoint = function( point ) {    
    // Thanks to
    // http://stackoverflow.com/questions/2212604/javascript-check-mouse-clicked-inside-the-circle-or-polygon/2212851#2212851
    var i, j = 0;
    var c = false;
    for (i = 0, j = this.polygon.vertices.length-1; i < this.polygon.vertices.length; j = i++) {
	vertI = this.getTranslatedVertex( i ); 
	vertJ = this.getTranslatedVertex( j ); 
    	if ( ((vertI.y>point.y) != (vertJ.y>point.y)) &&
    	     (point.x < (vertJ.x-vertI.x) * (point.y-vertI.y) / (vertJ.y-vertI.y) + vertI.x) )
    	    c = !c;
    }
    return c;

} */

/**
 * This function locates the closest tile edge (polygon edge)
 * to the passed point.
 *
 * Currently the edge distance to a point is measured by the
 * euclidian distance from the edge's middle point.
 *
 * @param point     The point to detect the closest edge for.
 * @param tolerance The tolerance (=max distance) the detected edge
 *                  must be inside.
 * @return the edge index (index of the start vertice) or -1 if not
 *         found.
 **/
GirihTile.prototype.locateEdgeAtPoint = function( point,
						  tolerance
						) {
    if( this.vertices.length == 0 )
	return -1;

    var middle         = new Vertex( 0, 0 );
    var tmpDistance    = 0;
    var resultDistance = tolerance*2;   // definitely outside the tolerance :)
    var resultIndex    = -1;
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	// var vertI = this.getTranslatedVertex( i ); 
	// var vertJ = this.getTranslatedVertex( i+1 );

	var vertI = this.getVertexAt( i ); 
	var vertJ = this.getVertexAt( i+1 ); 

	// Create a point in the middle of the edge	
	middle.x = vertI.x + (vertJ.x - vertI.x)/2.0;
	middle.y = vertI.y + (vertJ.y - vertI.y)/2.0;
	tmpDistance = middle.distance(point);
	if( tmpDistance <= tolerance && (resultIndex == -1 || tmpDistance < resultDistance) ) {
	    resultDistance = tmpDistance;
	    resultIndex    = i;
	}

    }

    return resultIndex;

}

/**
 * Find the adjacent edge from this tile's polygon.
 *
 * This function will check all egdges and return the one with
 * the minimal distance (its index).
 *
 * Only forward edges (i -> i+1) are detected. If you wish backward
 * edges to be detected too, swap the point parameters pointA and 
 * pointB.
 *
 * @param pointA    The first point of the desired edge.
 * @param pointB    The second point the desired edge.
 * @param tolerance The tolerance of the detection (radius).
 * @return The index of the edge's first vertex (if detected) or
 *         -1 if not edge inside the tolerance was found.
 * 
 * @pre tolerance >= 0
 **/  
GirihTile.prototype.locateAdjacentEdge = function( pointA,
						   pointB,
						   tolerance
						 ) {
    
    if( this.polygon.vertices.length == 0 )
	return -1;

    var result = -1;
    var resultDistance = 2*tolerance+1;   // Definitely larger than the tolerance :)
    //var tmpDistance;
    for( var i = 0; i <= this.polygon.vertices.length; i++ ) {

	var vertCur = this.getTranslatedVertex( i );   // this.getVertexAt( i );
	var vertSuc = this.getTranslatedVertex( i+1 ); // this.getVertexAt( i+1 );

	// Current edge matches?	
	var avgDistanceFwd = (vertCur.distanceTo(pointA) + vertSuc.distanceTo(pointB))/2.0;
	//var avgDistanceBwd = (vertSuc.distanceTo(pointA) + vertCur.distanceTo(pointB))/2.0;

	// Measure only in one direction. Otherwise the return value would be ambigous.
	if( avgDistanceFwd < tolerance &&
	    (result == -1 || (result != -1 && avgDistanceFwd < resultDistance)) 
	  ) {	    
	    // Check ALL edges to find the minimum
	    result = i;
	    resultDistance = avgDistanceFwd;
	}
    }
    

    return result;

};

GirihTile.prototype.toSVG = function( options,
				      polygonStyle,
				      buffer
				    ) {
    
    var returnBuffer = false;
    if( typeof buffer == "undefined" || !buffer ) {
	buffer = [];
	returnBuffer = true;
    }

    // Export outer shape?
    for( var i = 0; i < this.innerTilePolygons.length; i++ ) {
	this._polygonToSVG( this.innerTilePolygons[i],
			    options,
			    polygonStyle,
			    buffer );
    }
    if( returnBuffer )
	return buffer;
    else
	return buffer.join( "" );
};

GirihTile.prototype._polygonToSVG = function( polygon,
					      options,
					      polygonStyle,
					      buffer 
					      ) {
    if( typeof options != "undefined" && typeof options.indent != "undefined" )
	buffer.push( options.indent );
    
    buffer.push( "<polygon points=\"" );
    var vert;
    for( var i = 0; i < polygon.vertices.length; i++ ) {
	vert = this._translateVertex( polygon.getVertexAt(i) ); // getTranslatedVertex(i);
	if( i > 0 )
	    buffer.push( " " );
	buffer.push( vert.x );
	buffer.push( "," );
	buffer.push( vert.y );
    }    
    buffer.push( "\"" );
    
    if( typeof polygonStyle != "undefined" ) {
	buffer.push( " style=\"" );
	buffer.push( polygonStyle );
	buffer.push( "\"" );
    }
    
    buffer.push( " />\n" );
};

// TODO: Move this to Polygon?
/* GirihTile.prototype.computeBounds = function() {
    return Bounds.computeFromVertices( this.vertices );
}; */

/* GirihTile.prototype.translateVertex = function( vertex ) {
    return vertex.clone().rotate( this.angle, new Vertex(0,0) ).add( this.position );   
}; */

GirihTile.prototype.addVertex = function( vertex ) {
    this.vertices.push( vertex );
};

GirihTile.prototype.constructor = GirihTile;
