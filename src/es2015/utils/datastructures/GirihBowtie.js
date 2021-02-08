/**
 * @classdesc The bow tie tile from the Girih set.
 *
 * @requires Bounds
 * @requires GirihTile
 * @requires Polygon
 * @requires TileType
 * @requires Vertex
 *
 * @author Ikaros Kappler
 * @modified 2013-11-28
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-31 Refactored to work with PlotBoilerplate.
 * @modified 2020-11-13 Ported from vanilla JS to TypeScript.
 * @version 2.0.1-alpha
 * @file GirihBowtie
 * @public
 **/
import { Bounds } from "../../Bounds";
import { GirihTile, TileType } from "./GirihTile";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";
export class GirihBowtie extends GirihTile {
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihBowtie
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    constructor(position, edgeLength) {
        super(position, edgeLength, TileType.BOW_TIE);
        // Overwrite the default symmetries:
        //    the bow-tie tile has a 180° symmetry (5/10 * 360°)
        this.uniqueSymmetries = 5;
        // Init the actual decahedron shape with the passed size
        let pointA = new Vertex(0, 0);
        let pointB = pointA;
        const startPoint = pointA;
        let oppositePoint = null;
        this.addVertex(pointB);
        // TODO: notate in radians
        var angles = [0.0,
            72.0,
            72.0,
            216.0,
            72.0
        ];
        var theta = 0.0;
        for (var i = 0; i < angles.length; i++) {
            theta += (180.0 - angles[i]);
            pointA = pointB; // center of rotation
            pointB = pointB.clone();
            pointB.x -= this.edgeLength;
            pointB.rotate(theta * (Math.PI / 180.0), pointA);
            this.addVertex(pointB);
            if (i == 2)
                oppositePoint = pointB;
        } // END for
        // Move to center and position 
        const bounds = Bounds.computeFromVertices(this.vertices);
        const move = new Vertex((oppositePoint.x - startPoint.x) / 2.0, (oppositePoint.y - startPoint.y) / 2.0);
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].add(position).sub(move);
        }
        this.textureSource.min.x = 288 / 500.0;
        this.textureSource.min.y = 7 / 460.0;
        this.textureSource.max.x = this.textureSource.min.x + 206 / 500.0;
        this.textureSource.max.y = this.textureSource.min.y + 150 / 460.0;
        this.baseBounds = this.getBounds();
        this._buildInnerPolygons(this.edgeLength);
        this._buildOuterPolygons(this.edgeLength); // Only call AFTER the inner polygons were created!
    }
    ;
    /**
     * @override
     */
    clone() {
        return new GirihBowtie(this.position.clone(), this.edgeLength).rotate(this.rotation);
    }
    ;
    _buildInnerPolygons(edgeLength) {
        const indices = [1, 4];
        for (var i = 0; i < indices.length; i++) {
            const index = indices[i];
            const middlePoint = this.getVertexAt(index).clone().scale(0.5, this.getVertexAt(index + 1));
            const leftPoint = this.getVertexAt(index - 1).clone().scale(0.5, this.getVertexAt(index));
            const rightPoint = this.getVertexAt(index + 1).clone().scale(0.5, this.getVertexAt(index + 2));
            const innerPoint = middlePoint.clone().scale(0.38, this.position); // multiplyScalar( 0.38 );
            const innerTile = new Polygon([]);
            innerTile.addVertex(middlePoint);
            innerTile.addVertex(rightPoint);
            innerTile.addVertex(innerPoint);
            innerTile.addVertex(leftPoint);
            this.innerTilePolygons.push(innerTile);
        }
    }
    ;
    _buildOuterPolygons(edgeLength) {
        // Add the outer four 'edges'
        const indices = [0, 3];
        for (var i = 0; i < indices.length; i++) {
            const index = indices[i];
            // The first/third triangle
            const outerTileA = new Polygon();
            outerTileA.addVertex(this.innerTilePolygons[i].getVertexAt(0).clone());
            outerTileA.addVertex(this.getVertexAt(index + 2).clone());
            outerTileA.addVertex(this.innerTilePolygons[i].getVertexAt(1).clone());
            this.outerTilePolygons.push(outerTileA);
            // The second/fourth triangle
            const outerTileB = new Polygon();
            outerTileB.addVertex(this.innerTilePolygons[i].getVertexAt(0).clone());
            outerTileB.addVertex(this.getVertexAt(index + 1).clone());
            outerTileB.addVertex(this.innerTilePolygons[i].getVertexAt(3).clone());
            this.outerTilePolygons.push(outerTileB);
        }
        // Add the center polygon
        const centerTile = new Polygon();
        centerTile.addVertex(this.getVertexAt(0).clone());
        centerTile.addVertex(this.innerTilePolygons[0].getVertexAt(3).clone());
        centerTile.addVertex(this.innerTilePolygons[0].getVertexAt(2).clone());
        centerTile.addVertex(this.innerTilePolygons[0].getVertexAt(1).clone());
        centerTile.addVertex(this.getVertexAt(3).clone());
        centerTile.addVertex(this.innerTilePolygons[1].getVertexAt(3).clone());
        centerTile.addVertex(this.innerTilePolygons[1].getVertexAt(2).clone());
        centerTile.addVertex(this.innerTilePolygons[1].getVertexAt(1).clone());
        this.outerTilePolygons.push(centerTile);
    }
    ;
}
//# sourceMappingURL=GirihBowtie.js.map