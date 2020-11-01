/**
 * @classdesc The rhombus tile from the Girih set.
 *
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @date 2020-10-31 Refactored to work with PlotBoilerplate.
 * @version 2.0.0-alpha
 * @file GirihRhombus
 * @public
 **/


/**
 * @constructor
 * @extends GirihTile
 * @name GirihRhombus
 * @param {Vertex} position
 * @param {number} size
 * @param {number} angle
 */
var GirihRhombus = function( position, size, angle ) {
    
    GirihTile.call( this, position, size, angle, GirihTile.TYPE_RHOMBUS );
    
    // Init the actual rhombus shape with the passed size
    var pointA = new Vertex(0,0);
    var pointB = pointA;
    this.addVertex( pointB );

    var angles = [ 0.0,
		   72.0,
		   108.0
		   // 72.0
		 ];
    
    var theta = 0.0;
    for( var i = 0; i < angles.length; i++ ) {
	theta += (180.0 - angles[i]);
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( theta * (Math.PI/180.0), pointA );
	this.addVertex( pointB );	

    }

    
    // Move to center    
    var bounds = Bounds.computeFromVertices( this.vertices );
    var move   = new Vertex( bounds.width/2.0 - (bounds.width-size), 
			     bounds.height/2.0
			   );
    for( var i = 0; i < this.vertices.length; i++ ) {
	this.vertices[i].add( move ).add( this.position );
    }

    this.imageProperties = {
	source: { x:      32/500.0,
		  y:      188/460.0,
		  width:  127/500.0, // 127,
		  height: 92/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
    
    this._buildInnerPolygons();
    this._buildOuterPolygons();  // Call only AFTER the inner polygons were built!
};

GirihRhombus.prototype._buildInnerPolygons = function() {

       // Connect all edges half-the-way
    var innerTile = new Polygon(); // [];
    innerTile.addVertex( this.vertices[0].clone().scale( 0.5, this.vertices[1] ) );
    innerTile.addVertex( this.vertices[1].clone().scale( 0.5, this.vertices[2] ) );

    // Compute the next inner polygon vertex by the intersection of two circles
    var circleA = new Circle( innerTile.vertices[1], innerTile.vertices[0].distance(innerTile.vertices[1])*0.73 );
    var circleB = new Circle( this.vertices[2].clone().scale( 0.5, this.vertices[3] ), circleA.radius );
    
    // There is definitely an intersection
    var intersection = circleA.circleIntersection( circleB );
    // One of the two points is inside the tile, the other is outside.
    // Locate the inside point.
    if( this.containsVert(intersection.a) ) innerTile.addVertex(intersection.b);
    else                                    innerTile.addVertex(intersection.a);
    
    innerTile.addVertex( circleB.center );
    innerTile.addVertex( this.vertices[3].clone().scale( 0.5,this.vertices[0] ) );
    
    // Move circles
    circleA.center = innerTile.vertices[4];
    circleB.center = innerTile.vertices[0];
    //window.alert( "circleA=" + circleA + ", circleB=" + circleB );
    intersection   = circleA.circleIntersection( circleB );
    // There are two points again (one inside, one outside the tile)
    if( this.containsVert(intersection.a) ) innerTile.addVertex(intersection.b);
    else                                    innerTile.addVertex(intersection.a);

    this.innerTilePolygons.push( innerTile );

};

GirihRhombus.prototype._buildOuterPolygons = function() {

    var indicesA = [ 0, 2 ];  // 4:2
    var indicesB = [ 0, 3 ];  // 6:2
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
    }
};


GirihRhombus.prototype.addVertex            = Polygon.prototype.addVertex; // GirihTile.prototype.addVertex;
GirihRhombus.prototype.translateVertex      = GirihTile.prototype.translateVertex;
GirihRhombus.prototype._polygonToSVG         = GirihTile.prototype._polygonToSVG;
GirihRhombus.prototype.getInnerTilePolygonAt = GirihTile.prototype.getInnerTilePolygonAt;
GirihRhombus.prototype.getOuterTilePolygonAt = GirihTile.prototype.getOuterTilePolygonAt;
GirihRhombus.prototype.getTranslatedVertex   = GirihTile.prototype.getTranslatedVertex;
GirihRhombus.prototype.containsVert         = Polygon.prototype.containsVert; // GirihTile.prototype.containsPoint;
GirihRhombus.prototype.locateEdgeAtPoint     = GirihTile.prototype.locateEdgeAtPoint;
GirihRhombus.prototype.locateAdjacentEdge    = GirihTile.prototype.locateAdjacentEdge;
GirihRhombus.prototype.getVertexAt           = Polygon.prototype.getVertexAt; // GirihTile.prototype.getVertexAt;
GirihRhombus.prototype.toSVG                 = GirihTile.prototype.toSVG;

GirihRhombus.prototype.constructor           = GirihRhombus;
