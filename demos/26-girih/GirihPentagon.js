/**
 * @classdesc The pentagon tile from the Girih set.
 * 
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @date 2020-10-31 Refactored to work with PlotBoilerplate.
 * @version 2.0.0-alpha
 * @file GirihPentagon
 * @public
 **/


/**
 * @constructor
 * @extends GirihTile
 * @name GirihPentagon
 * @param {Vertex} position
 * @param {number} size
 * @param {number} angle
 */
var GirihPentagon = function( position, size, angle ) {
    
    GirihTile.call( this, position, size, angle, GirihTile.TYPE_PENTAGON );
    // Init the actual pentagon shape with the passed size:
    // Divide the full circle into 5 sections (we want to make a regular pentagon).
    var theta = (Math.PI*2) / 5.0;
    // Compute the 'radius' using pythagoras
    var radius = Math.sqrt(
	Math.pow(size/2,2)
	    +
	    Math.pow( 1/Math.tan(theta/2) * size/2, 2 )
    );
    for( var i = 0; i < 5; i++ ) {
	this.addVertex( position.clone().addY( -radius ).rotate( theta/2 + i*theta, position ) );
    }
    
    this.imageProperties = {
	source: {	x:      7/500.0,
			y:      (303-15)/460.0, // -16
			width:  157/500.0, 
			height: (150+15)/460.0  // +16
		},
	destination: { xOffset: 0.0,
		       yOffset: -18/460.0 // -16
		     }
		     
    };

    this._buildInnerPolygons( size );
    this._buildOuterPolygons( size );       // Only call AFTER the inner polygons were built!
};

GirihPentagon.prototype._buildInnerPolygons = function( edgeLength ) {
    // Connect all edges half-the-way
    var innerTile = new Polygon(); 
    for( var i = 0; i < this.vertices.length; i++ ) {
	innerTile.addVertex( this.getVertexAt(i).clone().scale( 0.5, this.getVertexAt(i+1) ) );
	// ... make linear approximation instead
	innerTile.addVertex( this.getVertexAt(i+1).clone().scale( 0.5, this.position ) );
    }
    this.innerTilePolygons.push( innerTile );
};


GirihPentagon.prototype._buildOuterPolygons = function( edgeLength ) {
    console.log( this.innerTilePolygons );
    for( var i = 0; i < this.vertices.length; i++ ) {
	var indexA     = i;
	var indexB     = i*2;
	// The triangle
	var outerTile = new Polygon();
	outerTile.addVertex( this.getVertexAt(indexA+1).clone() );
	outerTile.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	outerTile.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	outerTile.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	this.outerTilePolygons.push( outerTile );	
    }
};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
GirihPentagon.prototype.computeBounds         = GirihTile.prototype.computeBounds;
GirihPentagon.prototype.addVertex            = Polygon.prototype.addVertex; // GirihTile.prototype.addVertex;
GirihPentagon.prototype.translateVertex      = GirihTile.prototype.translateVertex;
GirihPentagon.prototype._polygonToSVG         = GirihTile.prototype._polygonToSVG;
GirihPentagon.prototype.getInnerTilePolygonAt = GirihTile.prototype.getInnerTilePolygonAt;
GirihPentagon.prototype.getOuterTilePolygonAt = GirihTile.prototype.getOuterTilePolygonAt;
GirihPentagon.prototype.getTranslatedVertex   = GirihTile.prototype.getTranslatedVertex;
GirihPentagon.prototype.containsPoint         = GirihTile.prototype.containsPoint;
GirihPentagon.prototype.locateEdgeAtPoint     = GirihTile.prototype.locateEdgeAtPoint;
GirihPentagon.prototype.locateAdjacentEdge    = GirihTile.prototype.locateAdjacentEdge;
GirihPentagon.prototype.getVertexAt           = Polygon.prototype.getVertexAt; // GirihTile.prototype.getVertexAt;
GirihPentagon.prototype.toSVG                 = GirihTile.prototype.toSVG;

GirihPentagon.prototype.constructor           = GirihPentagon;
