/**
 * @classdesc The bow tie tile from the Girih set.
 *
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @date 2020-10-31 Refactored to work with PlotBoilerplate.
 * @version 2.0.0-alpha
 * @file GirihBowtie
 * @public
 **/


/**
 * @constructor
 * @extends GirihTile
 * @name GirihBowtie
 * @param {Vertex} position
 * @param {number} size
 * @param {number} angle
 */
var GirihBowtie = function( position, size, angle ) {
    
    GirihTile.call( this, position, size, angle, GirihTile.TYPE_BOW_TIE );
    
    // Init the actual decahedron shape with the passed size
    var pointA          = new Vertex(0,0);
    var pointB          = pointA;
    var startPoint      = pointA;
    var oppositePoint   = null;
    this.addVertex( pointB );

    // TODO: notate in radians
    var angles = [ 0.0,
		   72.0,
		   72.0,
		   216.0,
		   72.0
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

    // Move to center and position 
    var bounds = Bounds.computeFromVertices( this.vertices );
    var move   = new Vertex( (oppositePoint.x - startPoint.x)/2.0, // bounds.getWidth()/2.0,
				  (oppositePoint.y - startPoint.y)/2.0  // -size/2.0
				);
    for( var i = 0; i < this.vertices.length; i++ ) {
	
	this.vertices[i].add( position ).sub( move );
		
    }

    this.imageProperties = {
	source: { x:      288/500.0, // 287,
		  y:      7/460.0,
		  width:  206/500.0,
		  height: 150/460.0
		  //angle:  0.0   // IKRS.Girih.MINIMAL_ANGLE
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
    
    this._buildInnerPolygons( size );
    this._buildOuterPolygons( size );       // Only call AFTER the inner polygons were created!
  
};

/**
 * @abstract Subclasses must override this.
 */
GirihBowtie.prototype.clone = function() {
    return new GirihBowtie( this.position.clone(), this.size, this.rotation );
};

GirihBowtie.prototype._buildInnerPolygons = function( edgeLength ) {

    var indices = [ 1, 4 ];
    for( var i = 0; i < indices.length; i++ ) {

	var index       = indices[i];

	var middlePoint = this.getVertexAt( index ).clone().scale( 0.5, this.getVertexAt(index+1) );
	var leftPoint   = this.getVertexAt( index-1 ).clone().scale( 0.5, this.getVertexAt(index) );
	var rightPoint  = this.getVertexAt( index+1 ).clone().scale( 0.5, this.getVertexAt(index+2) );
	var innerPoint  = middlePoint.clone().scale( 0.38, this.position ); // multiplyScalar( 0.38 );
	
	var innerTile = new Polygon( [] );
	innerTile.addVertex( middlePoint );
	innerTile.addVertex( rightPoint );
	innerTile.addVertex( innerPoint );
	innerTile.addVertex( leftPoint );


	this.innerTilePolygons.push( innerTile );
    }
};

GirihBowtie.prototype._buildOuterPolygons = function( edgeLength ) {

    // Add the outer four 'edges'
    var indices = [ 0, 3 ];
    for( var i = 0; i < indices.length; i++ ) {

	var index       = indices[i];
	
	// The first/third triangle
	var outerTileA   = new Polygon(); 
	outerTileA.addVertex( this.innerTilePolygons[i].getVertexAt(0).clone() );
	outerTileA.addVertex( this.getVertexAt(index+2).clone() );
	outerTileA.addVertex( this.innerTilePolygons[i].getVertexAt(1).clone()) ;
	this.outerTilePolygons.push( outerTileA );

	// The second/fourth triangle
	var outerTileB = new Polygon();
	outerTileB.addVertex( this.innerTilePolygons[i].getVertexAt(0).clone() );
	outerTileB.addVertex( this.getVertexAt(index+1).clone() );
	outerTileB.addVertex( this.innerTilePolygons[i].getVertexAt(3).clone()) ;
	this.outerTilePolygons.push( outerTileB );
		
    }

    // Add the center polygon
    var centerTile = new Polygon();
    centerTile.addVertex( this.getVertexAt(0).clone() );
    centerTile.addVertex( this.innerTilePolygons[0].getVertexAt(3).clone() );
    centerTile.addVertex( this.innerTilePolygons[0].getVertexAt(2).clone() );
    centerTile.addVertex( this.innerTilePolygons[0].getVertexAt(1).clone() );
    centerTile.addVertex( this.getVertexAt(3).clone() );
    centerTile.addVertex( this.innerTilePolygons[1].getVertexAt(3).clone() );
    centerTile.addVertex( this.innerTilePolygons[1].getVertexAt(2).clone() );
    centerTile.addVertex( this.innerTilePolygons[1].getVertexAt(1).clone() );
    this.outerTilePolygons.push( centerTile );
};

// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
// GirihBowtie.prototype.computeBounds         = GirihTile.prototype.computeBounds;
//GirihBowtie.prototype.           = Polygon.prototype.addVertex;
GirihBowtie.prototype.addVertex            = Polygon.prototype.addVertex; // GirihTile.prototype.addVertex;
GirihBowtie.prototype.translateVertex      = GirihTile.prototype.translateVertex;
GirihBowtie.prototype._polygonToSVG         = GirihTile.prototype._polygonToSVG;
GirihBowtie.prototype.getInnerTilePolygonAt = GirihTile.prototype.getInnerTilePolygonAt;
GirihBowtie.prototype.getOuterTilePolygonAt = GirihTile.prototype.getOuterTilePolygonAt;
GirihBowtie.prototype.getTranslatedVertex   = GirihTile.prototype.getTranslatedVertex;
//GirihBowtie.prototype.containsPoint         = GirihTile.prototype.containsPoint;
GirihBowtie.prototype.containsVert         = Polygon.prototype.containsVert;
GirihBowtie.prototype.rotate         = GirihTile.prototype.rotate;
GirihBowtie.prototype.locateEdgeAtPoint     = GirihTile.prototype.locateEdgeAtPoint;
GirihBowtie.prototype.locateAdjacentEdge    = GirihTile.prototype.locateAdjacentEdge;
GirihBowtie.prototype.getVertexAt           = Polygon.prototype.getVertexAt; // GirihTile.prototype.getVertexAt;
GirihBowtie.prototype.toSVG                 = GirihTile.prototype.toSVG;
GirihBowtie.prototype.move         = GirihTile.prototype.move;
GirihBowtie.prototype.findAdjacentTilePosition = GirihTile.prototype.findAdjacentTilePosition;

GirihBowtie.prototype.constructor           = GirihBowtie;
