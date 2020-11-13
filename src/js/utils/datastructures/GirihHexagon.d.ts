/**
 * @classdesc The irregular hexagon tile from the Girih set.
 *
 * @requires Bounds
 * @requires Circle
 * @requires GirihTile
 * @requires Lines
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
import { GirihTile } from "./GirihTile";
import { Vertex } from "../../Vertex";
export declare class GirihHexagon extends GirihTile {
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihHexagon
     * @param {Vertex} position
     * @param {number} size
     */
    constructor(position: Vertex, size: number);
    /**
     * @override
     */
    clone(): GirihTile;
    _buildInnerPolygons(edgeLength: number): void;
    _buildOuterPolygons(edgeLength: number): void;
}
