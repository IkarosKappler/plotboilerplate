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
import { GirihTile } from "./GirihTile";
import { Vertex } from "../../Vertex";
export declare class GirihPenroseRhombus extends GirihTile {
    /**
     * @constructor
     * @extends GirihTile
     * @name GirihPenroseRhombus
     * @param {Vertex} position
     * @param {number} size
     */
    constructor(position: Vertex, size: number, addCenterPolygon?: boolean);
    /**
     * @abstract Subclasses must override this.
     */
    clone(): GirihTile;
    _buildInnerPolygons(edgeLength: number, addCenterPolygon: boolean): void;
    _buildOuterPolygons(edgeLength: number, centerPolygonExists: boolean): void;
    /**
     * If you want the center polygon not to be drawn the canvas handler needs to
     * know the respective polygon index (inside the this.innerTilePolygons array).
     **/
    getCenterPolygonIndex(): number;
}
