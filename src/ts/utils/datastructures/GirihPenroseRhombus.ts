/**
 * @classdesc The penrose rhombus tile from the Girih set.
 * The penrose rhombus (angles 36° and 144°) is NOT part of the actual girih tile set!
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 *
 * But it fits perfect into the girih as the angles are the same. 
 * *
 * @author Ikaros Kappler
 * @date 2013-12-11
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihPenroseRhombus
 * @public
 **/


import { Bounds } from "../../Bounds";
import { GirihTile, TileType } from "./GirihTile";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";


export class GirihPenroseRhombus extends GirihTile {

    /**
     * @constructor
     * @extends GirihTile
     * @name GirihPenroseRhombus
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    constructor( position:Vertex, edgeLength?:number, addCenterPolygon?:boolean ) {
	
	super( position, edgeLength, TileType.PENROSE_RHOMBUS  );

	// Overwrite the default symmetries:
	//    the penrose-rhombus tile has a 180° symmetry (5/10 * 360°)
	this.uniqueSymmetries     = 5;

	if( typeof addCenterPolygon == "undefined" )
	    addCenterPolygon = true;  // Add by default

	
	// Init the actual decahedron shape with the passed size
	let pointA:Vertex = new Vertex(0,0);
	let pointB:Vertex = pointA;
	this.addVertex( pointB );

	const angles:Array<number> = [ 0.0,
				       36.0,  // 72.0,
				       144.0  // 108.0
				     ];
	
	let theta:number = 0.0;
	for( var i = 0; i < angles.length; i++ ) {
	    theta += (180.0 - angles[i]);
	    pointA = pointB; // center of rotation
	    pointB = pointB.clone();
	    pointB.x += this.edgeLength;
	    pointB.rotate( theta * (Math.PI/180.0), pointA );
	    this.addVertex( pointB );	
	}

	
	// Move to center and position
	const bounds:Bounds = Bounds.computeFromVertices( this.vertices );
	const move:Vertex   = new Vertex( bounds.width/2.0 - (bounds.width-this.edgeLength),
					  bounds.height/2.0
					);
	for( var i = 0; i < this.vertices.length; i++ ) {	
	    this.vertices[i].add( move ).add( position );		
	}

	this.textureSource.min.x = 2/500.0,
	this.textureSource.min.y = 8/460.0;
	this.textureSource.max.x = this.textureSource.min.x + 173/500.0
	this.textureSource.max.y = this.textureSource.min.y + 56/460.0;;
	
	this.baseBounds = this.getBounds();
		
	this._buildInnerPolygons( this.edgeLength, addCenterPolygon );
	this._buildOuterPolygons( this.edgeLength, addCenterPolygon );
    };


    /**
     * @override
     */
    clone() : GirihTile {
	return new GirihPenroseRhombus( this.position.clone(), this.edgeLength, true ).rotate( this.rotation );
    };


    private _buildInnerPolygons( edgeLength:number, addCenterPolygon:boolean ) : void {
	const indices:Array<number> = [ 0, 2 ];
	const centerTile:Polygon    = new Polygon();
	
	for( var i = 0; i < indices.length; i++ ) {
	    const innerTile:Polygon = new Polygon();
	    const index:number   = indices[i];
	    const left:Vertex   = this.getVertexAt( index   ).clone().scale( 0.5, this.getVertexAt(index+1) );
	    const right:Vertex  = this.getVertexAt( index+1 ).clone().scale( 0.5, this.getVertexAt(index+2) );
	    const innerA:Vertex = this.getVertexAt( index+1 ).clone().scale( 0.28, this.position );
	    const innerB:Vertex = this.getVertexAt( index+1 ).clone().scale( 0.55, this.position );
	    
	    innerTile.addVertex( left );
	    innerTile.addVertex( innerA );
	    innerTile.addVertex( right );
	    innerTile.addVertex( innerB );
	    
	    centerTile.addVertex( this.getVertexAt( index ).clone().scale( 0.1775, this.getVertexAt(index+2) ) );
	    centerTile.addVertex( innerA.clone() );

	    this.innerTilePolygons.push( innerTile );
	}
	
	if( addCenterPolygon )
	    this.innerTilePolygons.push( centerTile );
    };

    private _buildOuterPolygons( edgeLength:number, centerPolygonExists:boolean ) : void {
	// Add left and right 'spikes'.
	const indices:Array<number> = [ 0, 2 ];
	
	for( var i = 0; i < indices.length; i++ ) {
	    const outerTile:Polygon = new Polygon();
	    const index:number = indices[i];
	    const left:Vertex   = this.getVertexAt( index   ).clone().scale( 0.5, this.getVertexAt(index+1) );
	    const right:Vertex  = this.getVertexAt( index+1 ).clone().scale( 0.5, this.getVertexAt(index+2) );
	    // const innerA:Vertex = this.getVertexAt( index+1 ).clone().scale( 0.28, this.position );
	    const innerB:Vertex = this.getVertexAt( index+1 ).clone().scale( 0.55, this.position );

	    outerTile.addVertex( left.clone() );
	    outerTile.addVertex( this.getVertexAt( index+1 ).clone() );
	    outerTile.addVertex( right.clone() );
	    outerTile.addVertex( innerB.clone() );
	    
	    this.outerTilePolygons.push( outerTile );
	}
	
	// If the center polygon exists then the last outer polygon is split into two.
	if( centerPolygonExists ) {
	    // Two polygons
	    
	    const indices:Array<number> = [ 0, 2 ];
	    for( var i = 0; i < indices.length; i++ ) {
		const outerTile:Polygon = new Polygon();
		const index:number = indices[i];
		outerTile.addVertex( this.getVertexAt(index).clone() );
		outerTile.addVertex( this.getVertexAt(index).clone().scale(0.5,this.getVertexAt(index+1)) );
		outerTile.addVertex( this.innerTilePolygons[i].getVertexAt(1).clone() );
		outerTile.addVertex( this.getVertexAt(index).clone().scale(0.1775, this.getVertexAt(index+2)) );
		outerTile.addVertex( this.innerTilePolygons[(i+1)%2].getVertexAt(1).clone() );
		outerTile.addVertex( this.getVertexAt(index-1).clone().scale( 0.5, this.getVertexAt(index)) );
		
		this.outerTilePolygons.push( outerTile );
	    }

	}

    };

    /**
     * If you want the center polygon not to be drawn the canvas handler needs to
     * know the respective polygon index (inside the this.innerTilePolygons array).
     **/
    // TODO: IS THIS STILL REQUIRED
    getCenterPolygonIndex() : number {
	return 2;
    };

};
