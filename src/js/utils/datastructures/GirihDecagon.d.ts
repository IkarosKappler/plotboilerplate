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
import { GirihTile } from "./GirihTile";
import { Vertex } from "../../Vertex";
export declare class GirihDecagon extends GirihTile {
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihDecagon
     * @param {Vertex} position
     * @param {number} edgeLength
     */
    constructor(position: Vertex, edgeLength: number);
    /**
     * @override
     */
    clone(): GirihTile;
    /**
     * Build the inner polygons.
     *
     * @name _buildInnerPolygons
     * @memberof GirihDecagon
     * @private
     * @param {number} edgeLength
     */
    private _buildInnerPolygons;
    /**
     * Build the outer polygons.
     *
     * @name _buildOuterPolygons
     * @memberof GirihDecagon
     * @private
     * @param {number} edgeLength
     */
    private _buildOuterPolygons;
}
