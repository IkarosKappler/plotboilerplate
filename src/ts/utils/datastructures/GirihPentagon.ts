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
     * @param {number} size
     */
    constructor( position:Vertex, size:number ) {
	
	super( position, size, TileType.TYPE_PENTAGON );

	// Overwrite the default symmetries:
	//    the pentagon tile has a 72° symmetry (2/10 * 360°)
	this.uniqueSymmetries     = 2;
	
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


    /**
     * @override
     */
    clone() {
	return new GirihPentagon( this.position.clone(), this.size ).rotate( this.rotation );
    };


    _buildInnerPolygons( edgeLength:number ) {
	// Connect all edges half-the-way
	var innerTile = new Polygon(); 
	for( var i = 0; i < this.vertices.length; i++ ) {
	    innerTile.addVertex( this.getVertexAt(i).clone().scale( 0.5, this.getVertexAt(i+1) ) );
	    // ... make linear approximation instead
	    innerTile.addVertex( this.getVertexAt(i+1).clone().scale( 0.5, this.position ) );
	}
	this.innerTilePolygons.push( innerTile );
    };


    _buildOuterPolygons( edgeLength:number ) {
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
}

