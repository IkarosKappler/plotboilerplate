/**
 * @classdesc The decagon tile from the Girih set.
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2013-11-27
 * @date     2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date     2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-30 Refactored to work with PlotBoilerplate.
 * @version  2.0.0-alpha
 * @file GirihDecacon
 * @public
 **/

/**
 * @constructor
 * @extends GirihTile
 * @name GirihDecagon
 * @param {Vertex} position
 * @param {number} size
 */
var GirihDecagon = function( position, size ) {

    GirihTile.call( this, position, size, GirihTile.TYPE_DECAGON );

    // Overwrite the default symmetries:
    //    the decagon tile has a 36° symmetry (1/10 * 360°)
    this.uniqueSymmetries     = 1;
    
    // Init the actual decahedron shape with the passed size:
    // Divide the full circle into 10 sections (we want to make a regular decagon).
    var theta = (Math.PI*2) / 10.0;
    // Compute the 'radius' using pythagoras
    var radius = Math.sqrt(
	Math.pow(size/2,2)
	    +
	    Math.pow( 1/Math.tan(theta/2) * size/2, 2 )
    );
    for( var i = 0; i < 10; i++ ) {
	this.addVertex( position.clone().addY( -radius ).rotate( theta/2 + i*theta, position ) );
    }
    
    this.imageProperties = {
	source: { x:      169/500.0,
		  y:      140/460.0,
		  width:  313/500.0,
		  height: 297/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };


    this._buildInnerPolygons( size );
    this._buildOuterPolygons( size );       // Important: call AFTER inner polygons were created!
};

Object.assign( GirihDecagon.prototype, Polygon.prototype );
Object.assign( GirihDecagon.prototype, GirihTile.prototype );
GirihDecagon.prototype.constructor = GirihDecagon;


/**
 * @abstract Subclasses must override this.
 */
GirihDecagon.prototype.clone = function() {
    return new GirihDecagon( this.position.clone(), this.size, this.rotation ).rotate( this.rotation );
};


/**
 * Build the inner polygons.
 *
 * @name _buildInnerPolygons
 * @memberof GirihDecagon
 * @private
 * @param {number} edgeLength
 */
GirihDecagon.prototype._buildInnerPolygons = function( edgeLength ) {
    var centralStar = new Polygon();
    for( var i = 0; i < 10; i++ ) {
	var innerTile = new Polygon();
	// Make polygon
	var topPoint    = this.getVertexAt( i ).clone().scale( 0.5, this.getVertexAt(i+1) );
	var bottomPoint = topPoint.clone().scale( 0.615, this.position );
	var leftPoint   = this.getVertexAt( i ).clone().scale( 0.69, this.position );
	var rightPoint  = this.getVertexAt( i+1 ).clone().scale( 0.69, this.position );
	
	innerTile.addVertex( topPoint );
	innerTile.addVertex( rightPoint );
	innerTile.addVertex( bottomPoint );
	innerTile.addVertex( leftPoint );

	this.innerTilePolygons.push( innerTile );


	centralStar.addVertex( leftPoint.clone() );
	centralStar.addVertex( bottomPoint.clone() );
    }
    
    this.innerTilePolygons.push( centralStar );
};


/**
 * Build the outer polygons.
 *
 * @name _buildOuterPolygons
 * @memberof GirihDecagon
 * @private
 * @param {number} edgeLength
 */
GirihDecagon.prototype._buildOuterPolygons = function( edgeLength ) {
    // DON'T include the inner star here!
    for( var i = 0; i < 10; i++ ) {
	var outerTile = new Polygon();
	outerTile.addVertex( this.getVertexAt(i).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].vertices[0].clone() );
	outerTile.addVertex( this.innerTilePolygons[i].vertices[3].clone() );
	outerTile.addVertex( this.getInnerTilePolygonAt( i==0 ? 9 : i-1 ).vertices[0].clone() );
	this.outerTilePolygons.push( outerTile );
    }
};

