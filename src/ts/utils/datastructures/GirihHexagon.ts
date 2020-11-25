/**
 * @classdesc The irregular hexagon tile from the Girih set.
 *
 * @requires Bounds
 * @requires Circle
 * @requires GirihTile
 * @requires Line
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihHexagon
 * @public
 **/


import { Bounds } from "../../Bounds";
import { Circle } from "../../Circle";
import { GirihTile, TileType } from "./GirihTile";
import { Line } from "../../Line";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";


export class GirihHexagon extends GirihTile {

    /**
     * @constructor
     * @extends GirihTile
     * @name GirihHexagon
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    constructor( position:Vertex, edgeLength:number ) {
	
	super( position, edgeLength, TileType.IRREGULAR_HEXAGON );

	// Overwrite the default symmetries:
	//    the hexagon tile has a 180° symmetry (5/10 * 360°)
	this.uniqueSymmetries     = 5;
	
	// Init the actual decahedron shape with the passed size
	let pointA:Vertex        = new Vertex(0,0);
	let pointB:Vertex        = pointA;
	const startPoint:Vertex  = pointA;
	let oppositePoint:Vertex = null;
	this.addVertex( pointB );

	// TODO: use radians here
	const angles:Array<number> = [ 0.0,
				       72.0,
				       144.0,
				       144.0,
				       72.0
				       // 144.0
				     ];
	
	let theta:number = 0.0;
	for( var i = 0; i < angles.length; i++ ) {
	    theta += (180.0 - angles[i]);
	    pointA = pointB; // center of rotation
	    pointB = pointB.clone();
	    pointB.x -= edgeLength;
	    pointB.rotate( theta * (Math.PI/180.0), pointA );
	    this.addVertex( pointB );	
	    if( i == 2 )
		oppositePoint = pointB;
	}

	// Center and move to desired position    
	const move:Vertex = new Vertex( (oppositePoint.x - startPoint.x)/2.0, 
					(oppositePoint.y - startPoint.y)/2.0
				      );
	for( var i = 0; i < this.vertices.length; i++ ) {
	    this.vertices[i].add( position ).sub( move );
	}

	this.textureSource.min.x = 77/500.0;
	this.textureSource.min.y = 11/460.0;
	this.textureSource.max.x = this.textureSource.min.x + 205/500.0;
	this.textureSource.max.y = this.textureSource.min.y + 150/460.0;
	
	this.baseBounds = this.getBounds();

	this._buildInnerPolygons( edgeLength );
	this._buildOuterPolygons( edgeLength );   // Only call AFTER the inner polygons were created!
    };


    /**
     * @override
     */
    clone() : GirihTile {
	return new GirihHexagon( this.position.clone(), this.edgeLength ).rotate( this.rotation );
    };


    private _buildInnerPolygons( edgeLength:number ) : void {
	// Connect all edges half-the-way
	const innerTile:Polygon = new Polygon();
	innerTile.addVertex( this.vertices[0].clone().scale( 0.5, this.vertices[1] ) );
	innerTile.addVertex( this.vertices[1].clone().scale( 0.5, this.vertices[2] ) );

	// Compute the next inner polygon vertex by the intersection of two circles
	const circleA:Circle = new Circle( innerTile.vertices[1], innerTile.vertices[0].distance(innerTile.vertices[1]) );
	const circleB :Circle= new Circle( this.vertices[2].clone().scale( 0.5, this.vertices[3] ), circleA.radius );

	// TODO: the following piece of code occurs exactly four times.
	// -> refactor! (DRY)
	
	// There is definitely an intersection
	let intersection:Line|null = circleA.circleIntersection( circleB );
	// The intersection is definitely not empty (by construction)
	// One of the two points is inside the tile, the other is outside.
	// Locate the inside point.
	// Use the point that is closer to the center
	if( this.position.distance(intersection.a) < this.position.distance(intersection.b) ) innerTile.addVertex(intersection.a);
	else                                                              innerTile.addVertex(intersection.b);
	
	innerTile.addVertex( circleB.center.clone() );
        
	// var i = 3;
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


    private _buildOuterPolygons( edgeLength:number ) : void {
	// First add the two triangles at the 'ends' of the shape.
	const indicesA:Array<number> = [ 0, 3 ];  //  6:2
	const indicesB:Array<number> = [ 0, 5 ];  // 10:2
	
	for( var i = 0; i < indicesA.length; i++ ) {
	    const indexA:number     = indicesA[i];
	    const indexB:number     = indicesB[i];
	    // The triangle
	    const outerTileX:Polygon = new Polygon();
	    outerTileX.addVertex( this.getVertexAt(indexA+1).clone() );
	    outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	    outerTileX.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	    this.outerTilePolygons.push( outerTileX );
	    
	    // The first 'kite'
	    const outerTileY:Polygon = new Polygon();
	    outerTileY.addVertex( this.getVertexAt(indexA+2).clone() );
	    outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	    outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	    outerTileY.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	    this.outerTilePolygons.push( outerTileY );

	    // The second 'kite'
	    const outerTileZ:Polygon = new Polygon();
	    outerTileZ.addVertex( this.getVertexAt(indexA+3).clone() );
	    outerTileZ.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+3).clone() );
	    outerTileZ.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+4).clone() );
	    outerTileZ.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+5).clone() );
	    this.outerTilePolygons.push( outerTileZ );
	}

    };

}
