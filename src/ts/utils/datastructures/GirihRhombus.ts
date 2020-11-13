/**
 * @classdesc The rhombus tile from the Girih set.
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 *
 * @author Ikaros Kappler
 * @date 2013-11-28
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihRhombus
 * @public
 **/



import { Bounds } from "../../Bounds";
import { Circle } from "../../Circle";
import { GirihTile, TileType } from "./GirihTile";
import { Line } from "../../Line";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";


export class GirihRhombus extends GirihTile {

    /**
     * @constructor
     * @extends GirihTile
     * @name GirihRhombus
     * @param {Vertex} position
     * @param {number} size
     */
    constructor( position:Vertex, size:number ) {
	
	super( position, size, TileType.TYPE_RHOMBUS );

	// Overwrite the default symmetries:
	//    the rhombus tile has a 180° symmetry (5/10 * 360°)
	this.uniqueSymmetries     = 5;
	
	// Init the actual rhombus shape with the passed size
	let pointA:Vertex = new Vertex(0,0);
	let pointB:Vertex = pointA;
	this.addVertex( pointB );

	const angles:Array<number> = [ 0.0,
				       72.0,
				       108.0
				       // 72.0
				     ];
	
	let theta:number = 0.0;
	for( var i = 0; i < angles.length; i++ ) {
	    theta += (180.0 - angles[i]);
	    pointA = pointB; // center of rotation
	    pointB = pointB.clone();
	    pointB.x += size;
	    pointB.rotate( theta * (Math.PI/180.0), pointA );
	    this.addVertex( pointB );	
	}

	
	// Move to center    
	const bounds:Bounds = Bounds.computeFromVertices( this.vertices );
	const move:Vertex   = new Vertex( bounds.width/2.0 - (bounds.width-size), 
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

    
    /**
     * @override
     */
    clone() : GirihTile {
	return new GirihRhombus( this.position.clone(), this.size ).rotate( this.rotation );
    };



    _buildInnerPolygons() : void {

	// Connect all edges half-the-way
	const innerTile:Polygon = new Polygon(); // [];
	innerTile.addVertex( this.vertices[0].clone().scale( 0.5, this.vertices[1] ) );
	innerTile.addVertex( this.vertices[1].clone().scale( 0.5, this.vertices[2] ) );

	// Compute the next inner polygon vertex by the intersection of two circles
	const circleA:Circle = new Circle( innerTile.vertices[1], innerTile.vertices[0].distance(innerTile.vertices[1])*0.73 );
	const circleB:Circle = new Circle( this.vertices[2].clone().scale( 0.5, this.vertices[3] ), circleA.radius );
	
	// There is definitely an intersection
	let intersection:Line = circleA.circleIntersection( circleB );
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

    _buildOuterPolygons() {

	const indicesA:Array<number> = [ 0, 2 ];  // 4:2
	const indicesB:Array<number> = [ 0, 3 ];  // 6:2
	
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
	}
    };

}

