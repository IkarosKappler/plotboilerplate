/**
 *
 * @requires Bounds
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2013-11-27
 * @date     2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date     2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-30 Refactored to work with PlotBoilerplate.
 * @version  2.0.0-alpha
 **/


var GirihDecagon = function( position, angle, size ) {

    // console.log("before");
    GirihTile.call( this, size, position, angle, GirihTile.TYPE_DECAGON );
    //console.log("after");
    
    // Init the actual decahedron shape with the passed size   
    var pointA = new Vertex(0,0);
    var pointB = pointA;
    this._addVertex( pointB );

    var theta = Math.PI/2 * (144.0 / 360.0);
    for( var i = 1; i <= 9; i++ ) {
	pointA = pointB; // center of rotation
	pointB = pointB.clone();
	pointB.x += size;
	pointB.rotate( i*theta, pointA );
	this._addVertex( pointB );
    }

    // Move to center
    var bounds = Bounds.computeFromVertices( this.vertices );
    var move   = new Vertex( size/2.0, 
			     -bounds.height/2.0
			   );
    for( var i = 0; i < this.vertices.length; i++ ) {	
	this.vertices[i].add( move );		
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
    this._buildOuterPolygons();       // Important: call AFTER inner polygons were created!
  
};

GirihDecagon.prototype._buildInnerPolygons = function( edgeLength ) {
    
    var centralStar = new Polygon();
    for( var i = 0; i < 10; i++ ) {
	var innerTile = new Polygon();
	// Make polygon
	var topPoint    = this.getVertexAt( i ).clone().scale( 0.5, this.getVertexAt(i+1) );
	var bottomPoint = topPoint.clone().multiplyScalar( 0.615 );
	var leftPoint   = this.getVertexAt( i ).clone().multiplyScalar( 0.69 );
	var rightPoint  = this.getVertexAt( i+1 ).clone().multiplyScalar( 0.69 );
	
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


GirihDecagon.prototype._buildOuterPolygons = function( edgeLength ) {

    // DON'T include the inner star here!
    for( var i = 0; i < 10; i++ ) {

	//if( i > 0 )
	//    continue;
	
	//window.alert( this.getInnerTilePolygonAt );

	var outerTile = new Polygon();
	outerTile.addVertex( this.getVertexAt(i).clone() );
	outerTile.addVertex( this.innerTilePolygons[i].vertices[0].clone() );
	outerTile.addVertex( this.innerTilePolygons[i].vertices[3].clone() );
	outerTile.addVertex( this.getInnerTilePolygonAt( i==0 ? 9 : i-1 ).vertices[0].clone() );
	

	this.outerTilePolygons.push( outerTile );
    }
    
};


// This is totally shitty. Why object inheritance when I still
// have to inherit object methods manually??!
GirihDecagon.prototype.computeBounds         = GirihTile.prototype.computeBounds;
GirihDecagon.prototype._addVertex            = GirihTile.prototype._addVertex;
GirihDecagon.prototype._translateVertex      = GirihTile.prototype._translateVertex;
GirihDecagon.prototype._polygonToSVG         = GirihTile.prototype._polygonToSVG;
GirihDecagon.prototype.getInnerTilePolygonAt = GirihTile.prototype.getInnerTilePolygonAt;
GirihDecagon.prototype.getOuterTilePolygonAt = GirihTile.prototype.getOuterTilePolygonAt;
GirihDecagon.prototype.getTranslatedVertex   = GirihTile.prototype.getTranslatedVertex;
GirihDecagon.prototype.containsPoint         = GirihTile.prototype.containsPoint;
GirihDecagon.prototype.locateEdgeAtPoint     = GirihTile.prototype.locateEdgeAtPoint;
GirihDecagon.prototype.locateAdjacentEdge    = GirihTile.prototype.locateAdjacentEdge;
GirihDecagon.prototype.getVertexAt           = GirihTile.prototype.getVertexAt;
GirihDecagon.prototype.toSVG                 = GirihTile.prototype.toSVG;

GirihDecagon.prototype.constructor           = GirihDecagon;
