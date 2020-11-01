/**
 * @classdesc The penrose rhombus tile from the Girih set.
 * The penrose rhombus (angles 36° and 144°) is NOT part of the actual girih tile set!
 *
 * But it fits perfect into the girih as the angles are the same. 
 * *
 * @author Ikaros Kappler
 * @date 2013-12-11
 * @date 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date 2015-03-19 Ikaros Kappler (added toSVG()).
 * @date 2020-10-31 Refactored to work with PlotBoilerplate.
 * @version 2.0.0-alpha
 * @file GirihPenroseRhombus
 * @public
 **/


/**
 * @constructor
 * @extends GirihTile
 * @name GirihPenroseRhombus
 * @param {Vertex} position
 * @param {number} size
 * @param {number} angle
 */
var GirihPenroseRhombus = function( position, size, angle, opt_addCenterPolygon ) {
    
    GirihTile.call( this, position, size, angle, GirihTile.TYPE_PENROSE_RHOMBUS  );


    if( typeof opt_addCenterPolygon == "undefined" )
	opt_addCenterPolygon = true;  // Add by default

    
    // Init the actual decahedron shape with the passed size
    var pointA = new Vertex(0,0);
    var pointB = pointA;
    this.addVertex( pointB );

    var angles = [ 0.0,
		   36.0,  // 72.0,
		   144.0  // 108.0
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

    
    // Move to center and position
    var bounds = Bounds.computeFromVertices( this.vertices );
    console.log( bounds );
    var move   = new Vertex( bounds.width/2.0 - (bounds.width-size), //  - size/2.0, 
			     bounds.height/2.0
			   );
    for( var i = 0; i < this.vertices.length; i++ ) {	
	this.vertices[i].add( move ).add( position );		
    }

    
    this.imageProperties = {
	source: { x:      2/500.0,
		  y:      8/460.0,
		  width:  173/500.0, 
		  height: 56/460.0
		},
	destination: { xOffset: 0.0,
		       yOffset: 0.0
		     }
    };
				 
    
    this._buildInnerPolygons( size, opt_addCenterPolygon );
    this._buildOuterPolygons( size, opt_addCenterPolygon );
};

GirihPenroseRhombus.prototype._buildInnerPolygons = function( edgeLength, addCenterPolygon ) {
    var indices              = [ 0, 2 ];
    // var innerPointIndexLeft  = -1;
    // var innerPointIndexRight = -1;
    var centerTile           = new Polygon();
    for( var i = 0; i < indices.length; i++ ) {

	var innerTile = new Polygon();
	var index = indices[i];
	var left   = this.getVertexAt( index   ).clone().scale( 0.5, this.getVertexAt(index+1) );
	var right  = this.getVertexAt( index+1 ).clone().scale( 0.5, this.getVertexAt(index+2) );
	// var innerA = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.28 );
	// var innerB = this.getVertexAt( index+1 ).clone().multiplyScalar( 0.55 );
	var innerA = this.getVertexAt( index+1 ).clone().scale( 0.28, this.position );
	var innerB = this.getVertexAt( index+1 ).clone().scale( 0.55, this.position );
	
	innerTile.addVertex( left );
	innerTile.addVertex( innerA );
	innerTile.addVertex( right );
	innerTile.addVertex( innerB );

	// if( i == 0 ) {
	    centerTile.addVertex( this.getVertexAt( index ).clone().scale( 0.1775, this.getVertexAt(index+2) ) );
	    centerTile.addVertex( innerA );
	// } else { // if( i == 1 ) {
	//    centerTile.addVertex( this.getVertexAt( index ).clone().scale( 0.1775, this.getVertexAt(index+2) ) );
	//    centerTile.addVertex( innerA );
	//}

	this.innerTilePolygons.push( innerTile );
    }
    
    if( addCenterPolygon )
	this.innerTilePolygons.push( centerTile );
};

GirihPenroseRhombus.prototype._buildOuterPolygons = function( centerPolygonExists ) {

    // Add left and right 'spikes'.
    var indices = [ 0, 2 ];
    for( var i = 0; i < indices.length; i++ ) {

	var outerTile = new Polygon();
	var index = indices[i];
	var left   = this.getVertexAt( index   ).clone().scale( 0.5, this.getVertexAt(index+1) );
	var right  = this.getVertexAt( index+1 ).clone().scale( 0.5, this.getVertexAt(index+2) );
	var innerA = this.getVertexAt( index+1 ).clone().scale( 0.28, this.position ); // multiplyScalar( 0.28 );
	var innerB = this.getVertexAt( index+1 ).clone().scale( 0.55, this.position ); // multiplyScalar( 0.55 );

	outerTile.addVertex( left.clone() );
	outerTile.addVertex( this.getVertexAt( index+1 ).clone() );
	outerTile.addVertex( right.clone() );
	outerTile.addVertex( innerB.clone() );
	
	this.outerTilePolygons.push( outerTile );
	   
    }
   
    // If the center polygon exists then the last outer polygon is split into two.
    if( centerPolygonExists ) {
	// Two polygons
	
	var indices = [ 0, 2 ];
	for( var i = 0; i < indices.length; i++ ) {
	    var outerTile = new Polygon();
	    var index = indices[i];
	    outerTile.addVertex( this.getVertexAt(index).clone() );
	    outerTile.addVertex( this.getVertexAt(index).clone().scale(0.5,this.getVertexAt(index+1)) );
	    outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(1).clone() );
	    outerTile.addVertex( this.getVertexAt(index).clone().scale(0.1775, this.getVertexAt(index+2)) );
	    outerTile.addVertex( this.innerTilePolygons[(i+1)%2].getVertexAt(1).clone() );
	    outerTile.addVertex( this.getVertexAt(index-1).clone().scale( 0.5, this.getVertexAt(index)) );
	    
	    this.outerTilePolygons.push( outerTile );
	}

    } else {
	// One polygon
	
    }

};

/**
 * If you want the center polygon not to be drawn the canvas handler needs to
 * know the respective polygon index (inside the this.innerTilePolygons array).
 **/
GirihPenroseRhombus.prototype.getCenterPolygonIndex = function() {
    return 2;
};



GirihPenroseRhombus.prototype.addVertex            = Polygon.prototype.addVertex; // GirihTile.prototype.addVertex;
GirihPenroseRhombus.prototype.translateVertex      = GirihTile.prototype.translateVertex;
GirihPenroseRhombus.prototype._polygonToSVG         = GirihTile.prototype._polygonToSVG;
GirihPenroseRhombus.prototype.getInnerTilePolygonAt = GirihTile.prototype.getInnerTilePolygonAt;
GirihPenroseRhombus.prototype.getOuterTilePolygonAt = GirihTile.prototype.getOuterTilePolygonAt;
GirihPenroseRhombus.prototype.getTranslatedVertex   = GirihTile.prototype.getTranslatedVertex;
GirihPenroseRhombus.prototype.containsVert         = Polygon.prototype.containsVert; // GirihTile.prototype.containsPoint;
GirihPenroseRhombus.prototype.locateEdgeAtPoint     = GirihTile.prototype.locateEdgeAtPoint;
GirihPenroseRhombus.prototype.locateAdjacentEdge    = GirihTile.prototype.locateAdjacentEdge;
GirihPenroseRhombus.prototype.getVertexAt           = Polygon.prototype.getVertexAt; // GirihTile.prototype.getVertexAt;
//GirihPenroseRhombus.prototype.getVertexAt           = GirihTile.prototype.getVertexAt;
GirihPenroseRhombus.prototype.toSVG                 = GirihTile.prototype.toSVG;

GirihPenroseRhombus.prototype.constructor           = GirihPenroseRhombus;
