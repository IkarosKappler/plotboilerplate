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
import { GirihTile } from "./GirihTile";
import { Vertex } from "../../Vertex";
export declare class GirihRhombus extends GirihTile {
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihRhombus
     * @param {Vertex} position
     * @param {number} size
     */
    constructor(position: Vertex, size: number);
    /**
     * @override
     */
    clone(): GirihTile;
    _buildInnerPolygons(): void;
    _buildOuterPolygons(): void;
}
