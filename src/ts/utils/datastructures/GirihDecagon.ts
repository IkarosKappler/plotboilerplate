/**
 * @classdesc The decagon tile from the Girih set.
 *
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 * @author   Ikaros Kappler
 * @date     2013-11-27
 * @date     2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @date     2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-30 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version  2.0.1-alpha
 * @file GirihDecacon
 * @public
 **/

import { GirihTile, TileType } from "./GirihTile";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";

export class GirihDecagon extends GirihTile {

    /**
     * @constructor
     * @extends GirihTile
     * @name GirihDecagon
     * @param {Vertex} position
     * @param {number} size
     */
    constructor( position:Vertex, size:number ) {

	super( position, size, TileType.TYPE_DECAGON );

	// Overwrite the default symmetries:
	//    the decagon tile has a 36° symmetry (1/10 * 360°)
	this.uniqueSymmetries     = 1;
	
	// Init the actual decahedron shape with the passed size:
	// Divide the full circle into 10 sections (we want to make a regular decagon).
	const theta = (Math.PI*2) / 10.0;
	// Compute the 'radius' using pythagoras
	const radius = Math.sqrt(
	    Math.pow(size/2,2)
		+
		Math.pow( 1/Math.tan(theta/2) * size/2, 2 )
	);
	for( var i = 0; i < 10; i++ ) {
	    this.addVertex(
		position.clone().addY( -radius ).rotate( theta/2 + i*theta, position )
	    );
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
	this.baseBounds = this.getBounds();


	this._buildInnerPolygons( size );
	this._buildOuterPolygons( size ); // Important: call AFTER inner polygons were created!
    };


    /**
     * @override
     */
    clone() : GirihTile {
	return new GirihDecagon( this.position.clone(), this.size ).rotate( this.rotation );
    };


    /**
     * Build the inner polygons.
     *
     * @name _buildInnerPolygons
     * @memberof GirihDecagon
     * @private
     * @param {number} edgeLength
     */
    _buildInnerPolygons( edgeLength:number ) {
	const centralStar = new Polygon();
	for( var i = 0; i < 10; i++ ) {
	    const innerTile = new Polygon();
	    // Make polygon
	    const topPoint    = this.getVertexAt( i ).clone().scale( 0.5, this.getVertexAt(i+1) );
	    const bottomPoint = topPoint.clone().scale( 0.615, this.position );
	    const leftPoint   = this.getVertexAt( i ).clone().scale( 0.69, this.position );
	    const rightPoint  = this.getVertexAt( i+1 ).clone().scale( 0.69, this.position );
	    
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
    _buildOuterPolygons( edgeLength:number ) {
	// DON'T include the inner star here!
	for( var i = 0; i < 10; i++ ) {
	    const outerTile = new Polygon();
	    outerTile.addVertex( this.getVertexAt(i).clone() );
	    outerTile.addVertex( this.innerTilePolygons[i].vertices[0].clone() );
	    outerTile.addVertex( this.innerTilePolygons[i].vertices[3].clone() );
	    outerTile.addVertex( this.getInnerTilePolygonAt( i==0 ? 9 : i-1 ).vertices[0].clone() );
	    this.outerTilePolygons.push( outerTile );
	}
    };

};
