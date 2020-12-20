/**
 * @classdesc The pentagon tile from the Girih set.
 * 
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @date 2013-11-27
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihPentagon
 * @public
 **/



import { Bounds } from "../../Bounds";
import { Circle } from "../../Circle";
import { GirihTile, TileType } from "./GirihTile";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";


export class GirihPentagon extends GirihTile {

    /**
     * @constructor
     * @extends GirihTile
     * @name GirihPentagon
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    constructor( position:Vertex, edgeLength?:number ) {
	
	super( position, edgeLength, TileType.PENTAGON );

	// Overwrite the default symmetries:
	//    the pentagon tile has a 72° symmetry (2/10 * 360°)
	this.uniqueSymmetries     = 2;
	
	// Init the actual pentagon shape with the passed size:
	// Divide the full circle into 5 sections (we want to make a regular pentagon).
	const theta:number = (Math.PI*2) / 5.0;
	// Compute the 'radius' using pythagoras
	const radius:number = Math.sqrt(
	    Math.pow(this.edgeLength/2,2)
		+
		Math.pow( 1/Math.tan(theta/2) * this.edgeLength/2, 2 )
	);
	for( var i = 0; i < 5; i++ ) {
	    this.addVertex(
		position.clone().addY( -radius ).rotate( theta/2 + i*theta, position )
	    );
	}

	this.textureSource.min.x = 7/500.0;
	this.textureSource.min.y = (303)/460.0;
	this.textureSource.max.x = this.textureSource.min.x + 157/500.0;
	this.textureSource.max.y = this.textureSource.min.y + (150)/460.0;
	
	this.baseBounds = this.getBounds();

	this._buildInnerPolygons( this.edgeLength );
	this._buildOuterPolygons( this.edgeLength );       // Only call AFTER the inner polygons were built!
    };


    /**
     * @override
     */
    clone() : GirihTile {
	return new GirihPentagon( this.position.clone(), this.edgeLength ).rotate( this.rotation );
    };


    private _buildInnerPolygons( edgeLength:number ) : void {
	// Connect all edges half-the-way
	const innerTile:Polygon = new Polygon(); 
	for( var i = 0; i < this.vertices.length; i++ ) {
	    innerTile.addVertex( this.getVertexAt(i).clone().scale( 0.5, this.getVertexAt(i+1) ) );
	    // ... make linear approximation instead
	    innerTile.addVertex( this.getVertexAt(i+1).clone().scale( 0.5, this.position ) );
	}
	this.innerTilePolygons.push( innerTile );
    };


    private _buildOuterPolygons( edgeLength:number ) : void {
	for( var i = 0; i < this.vertices.length; i++ ) {
	    const indexA:number     = i;
	    const indexB:number     = i*2;
	    // The triangle
	    const outerTile:Polygon = new Polygon();
	    outerTile.addVertex( this.getVertexAt(indexA+1).clone() );
	    outerTile.addVertex( this.innerTilePolygons[0].getVertexAt(indexB).clone() );
	    outerTile.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+1).clone() );
	    outerTile.addVertex( this.innerTilePolygons[0].getVertexAt(indexB+2).clone() );
	    this.outerTilePolygons.push( outerTile );	
	}
    };
}

