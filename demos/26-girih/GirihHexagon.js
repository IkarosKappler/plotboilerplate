/**
 * @classdesc The irregular hexagon tile from the Girih set.
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @date 2020-10-31 Refactored to work with PlotBoilerplate.
 * @version 2.0.0-alpha
 * @file GirihHexagon
 * @public
 **/


/**
 * @constructor
 * @extends GirihTile
 * @name GirihHexagon
 * @param {Vertex} position
 * @param {number} size
 * @param {number} angle
 */
var GirihHexagon = function( position, size, angle ) {
    
    GirihTile.call( this, position, size, angle, GirihTile.TYPE_IRREGULAR_HEXAGON );

    // Overwrite the default symmetries:
    //    the hexagon tile has a 180° symmetry (5/10 * 360°)
    this.uniqueSymmetries     = 5;
    
    // Init the actual decahedron shape with the passed size
    var pointA        = new Vertex(0,0);
    var pointB        = pointA;
    var startPoint    = pointA;
    var oppositePoint = null;
    this.addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   144.0,
		   144.0,
		   72.0
		   // 144.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {
	theta += (180.0 - angles[i]);
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x -= size;
	pointB.rotate( theta * (Math.PI/180.0), pointA );
	this.addVertex( pointB );	

	if( i == 2 )
	    oppositePoint = pointB;

    }

    // Center and move to desired position    
    var move   = new Vertex( (oppositePoint.x - startPoint.x)/2.0, 
			     (oppositePoint.y - startPoint.y)/2.0
			   );
    for( var i = 0; i < this.vertices.length; i++ ) {
	this.vertices[i].add( position ).sub( move );
    }

    this.imageProperties = {
	source: { x:      77/500.0, // 75,
		  y:      11/460.0,
		  width:  205/500.0, // 207,
		  height: 150/460.0  // 150
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };

    this._buildInnerPolygons( size );
    this._buildOuterPolygons( size );   // Only call AFTER the inner polygons were created!
};


/**
 * @abstract Subclasses must override this.
 */
GirihHexagon.prototype.clone = function() {
    return new GirihHexagon( this.position.clone(), this.size, this.rotation ).rotate( this.rotation );
};


GirihHexagon.prototype._buildInnerPolygons = function( edgeLength) {

    
    // Connect all edges half-the-way
    var innerTile = new Polygon(); // []
    innerTile.addVertex( this.vertices[0].clone().scale( 0.5, this.vertices[1] ) );
    innerTile.addVertex( this.vertices[1].clone().scale( 0.5, this.vertices[2] ) );

    // Compute the next inner polygon vertex by the intersection of two circles
    var circleA = new Circle( innerTile.vertices[1], innerTile.vertices[0].distance(innerTile.vertices[1]) );
    var circleB = new Circle( this.vertices[2].clone().scale( 0.5, this.vertices[3] ), circleA.radius );

    // TODO: the following piece of code occurs exactly four times.
    // -> refactor! (DRY)
    
    // There is definitely an intersection
    var intersection = circleA.circleIntersection( circleB );
    // The intersection is definitely not empty (by construction)
    // One of the two points is inside the tile, the other is outside.
    // Locate the inside point.
    // Use the point that is closer to the center
    if( this.position.distance(intersection.a) < this.position.distance(intersection.b) ) innerTile.addVertex(intersection.a);
    else                                                              innerTile.addVertex(intersection.b);
    
    innerTile.addVertex( circleB.center.clone() );
        
    var i = 3;
    // Move circles
    circleA.center = circleB.center;
    circleB.center = this.vertices[3].clone().scale( 0.5, this.vertices[4] );
    intersection   = circleA.circleIntersection( circleB );
    // The intersection is definitely not empty (by construction)
    // There are two points again (one inside, one outside the tile)
    // Use the point that is closer to the center
    if( this.position.distance(intersection.a) < this.position.distance(intersection.b) ) innerTile.addVertex(intersection.a);
    else                                                              innerTile.addVertex(intersection.b);
    innerTile.addVertex( circleB.center.clone() );

    innerTile.addVertex( this.vertices[4].clone().scale( 0.5, this.vertices[5] ) );


    
    // Move circles  
    circleA.center = innerTile.vertices[ innerTile.vertices.length-1 ];  
    circleB.center = this.vertices[5].clone().scale( 0.5, this.vertices[0] );  
    intersection   = circleA.circleIntersection( circleB );
    // The intersection is definitely not empty (by construction)
    // There are two points again (one inside, one outside the tile)
    // Use the point that is closer to the center
    if( this.position.distance(intersection.a) < this.position.distance(intersection.b) ) innerTile.addVertex(intersection.a);
    else                                                              innerTile.addVertex(intersection.b);    
    innerTile.addVertex( circleB.center.clone() );
  


    
    // Move circles  
    circleA.center = innerTile.vertices[ innerTile.vertices.length-1 ];  
    circleB.center = innerTile.vertices[ 0 ]; 
    intersection   = circleA.circleIntersection( circleB );
    // The intersection is definitely not empty (by construction)
    // There are two points again (one inside, one outside the tile)
    // Use the point that is closer to the center
    if( this.position.distance(intersection.a) < this.position.distance(intersection.b) ) innerTile.addVertex(intersection.a);
    else                                                              innerTile.addVertex(intersection.b);
    innerTile.addVertex( circleB.center.clone() );
    this.innerTilePolygons.push( innerTile );	
};


GirihHexagon.prototype._buildOuterPolygons = function( edgeLength ) {
    // First add the two triangles at the 'ends' of the shape.
    var indicesA = [ 0, 3 ];  //  6:2
    var indicesB = [ 0, 5 ];  // 10:2
    for( var i = 0; i < indicesA.length; i++ ) {

	var indexA     = indicesA[i];
	var indexB     = indicesB[i];
	// The triangle
	var outerTileX = new Polygon();
	outerTileX.addVertex( this.getVertexAt(indexA+1).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	this.outerTilePolygons.push( outerTileX );
	
	// The first 'kite'
	var outerTileY = new Polygon();
	outerTileY.addVertex( this.getVertexAt(indexA+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	this.outerTilePolygons.push( outerTileY );

	// The second 'kite'
	var outerTileZ = new Polygon();
	outerTileZ.addVertex( this.getVertexAt(indexA+3).clone() );
	outerTileZ.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	outerTileZ.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+4).clone() );
	outerTileZ.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+5).clone() );
	this.outerTilePolygons.push( outerTileZ );
    }

};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
GirihHexagon.prototype.computeBounds         = GirihTile.prototype.computeBounds;
GirihHexagon.prototype.addVertex            = Polygon.prototype.addVertex; // IKRS.Tile.prototype._addVertex;
GirihHexagon.prototype.translateVertex      = GirihTile.prototype.translateVertex;
GirihHexagon.prototype._polygonToSVG         = GirihTile.prototype._polygonToSVG;
GirihHexagon.prototype.getInnerTilePolygonAt = GirihTile.prototype.getInnerTilePolygonAt;
GirihHexagon.prototype.getOuterTilePolygonAt = GirihTile.prototype.getOuterTilePolygonAt;
GirihHexagon.prototype.getTranslatedVertex   = GirihTile.prototype.getTranslatedVertex;
// GirihHexagon.prototype.containsPoint         = GirihTile.prototype.containsPoint;
GirihHexagon.prototype.containsVert         = Polygon.prototype.containsVert;
GirihHexagon.prototype.getBounds         = Polygon.prototype.getBounds;
GirihHexagon.prototype.rotate         = GirihTile.prototype.rotate;
GirihHexagon.prototype.locateEdgeAtPoint     = GirihTile.prototype.locateEdgeAtPoint;
GirihHexagon.prototype.locateAdjacentEdge    = GirihTile.prototype.locateAdjacentEdge;
GirihHexagon.prototype.getVertexAt           = Polygon.prototype.getVertexAt; // IKRS.Tile.prototype.getVertexAt;
// GirihHexagon.prototype.toSVG                 = GirihTile.prototype.toSVG;
GirihHexagon.prototype.toSVGString                 = Polygon.prototype.toSVGString;
GirihHexagon.prototype.move         = GirihTile.prototype.move;
GirihHexagon.prototype.findAdjacentTilePosition = GirihTile.prototype.findAdjacentTilePosition;

GirihHexagon.prototype.constructor           = GirihHexagon;
