/**
 * @classdesc This is a general tile superclass. All other tile classes extends this one.
 *
 * Rule:
 *  * the outer and the inner sub polygons must be inside the main polygon's bounds.
 *
 * @requires Bounds
 * @requires Polyon
 * @requires Vertex
 * @requires XYCoords
 *
 * @author   Ikaros Kappler
 * @date     2013-11-27
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-30 Refactored the this super class to work with PlotBoilerplate.
 * @modified 2020-11-11 Ported the class from vanilla JS to TypeScript.
 * @version  2.0.1-alpha
 * @name GirihTile
 **/
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";
import { XYCoords } from "../../interfaces";
export declare enum TileType {
    TYPE_UNKNOWN = "UNKNOWN",
    TYPE_DECAGON = "DECAGON",
    TYPE_PENTAGON = "PENTAGON",
    TYPE_IRREGULAR_HEXAGON = "IRREGULAR_HEXAGON",
    TYPE_RHOMBUS = "RHOMBUS",
    TYPE_BOW_TIE = "BOW_TIE",
    TYPE_PENROSE_RHOMBUS = "PENROSE_RHOMBUS"
}
export interface ImageProperties {
    source: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    destination: {
        xOffset: number;
        yOffset: number;
    };
}
export interface IAdjacency {
    edgeIndex: number;
    offset: XYCoords;
}
export declare abstract class GirihTile extends Polygon {
    position: Vertex;
    size: number;
    rotation: number;
    symmetry: number;
    uniqueSymmetries: number;
    innerTilePolygons: Array<Polygon>;
    outerTilePolygons: Array<Polygon>;
    imageProperties: ImageProperties;
    tileType: TileType;
    static epsilon: number;
    static DEFAULT_EDGE_LENGTH: number;
    /**
     * @constructor
     * @memberof GirihTile
     * @abstract class
     * @param {Vertex} position - The position of the tile.
     * @param {number} size     - The edge size (usually IKRS.Girih.DEFAULT_EDGE_LENGTH).
     * @param {TileType} tileType - One of GirihTile.TILE_TYPE_*.
     **/
    constructor(position: Vertex, size: number, tileType?: TileType);
    /**
     * @abstract Subclasses must override this.
     */
    abstract clone(): any;
    /**
     * Move this tile around (together will all inner polygons).
     * As this function overrides Polygon.move(...), the returned
     * instance (this) must be of type `Polygon`.
     *
     * @name move
     * @instance
     * @override
     * @memberof GirihTile
     * @param {XYCoords} amount
     * @return {Polygon} this
     */
    move(amount: XYCoords): Polygon;
    /**
     * Find the adjacent tile (given by the template tile)
     * Note that the tile itself will be modified (rotated and moved to the correct position).
     *
     * @name findAdjacentTilePosition
     * @memberof GirihTile
     * @instance
     * @param {number} edgeIndex - The edge number of the you you want to find adjacency for.
     * @param {Polygon} tile - The polygon (or tile) you want to find adjacency for at the specified edge.
     * @return {IAdjacency|null} Adjacency information or null if the passed tile does not match.
     */
    findAdjacentTilePosition(edgeIndex: number, tile: Polygon): IAdjacency | null;
    /**
     * Find all possible adjacent tile positions (and rotations) for `neighbourTile`.
     *
     * @name transformTileToAdjacencies
     * @memberof GirihTile
     * @instance
     * @param {number} baseEdgeIndex - The edge number of the you you want to find adjacencies for.
     * @param {GirihTile} neighbourTile - The polygon (or tile) you want to find adjacencies for at the specified edge.
     * @return {IAdjacency|null} Adjacency information or null if the passed tile does not match.
     */
    transformTileToAdjacencies(baseEdgeIndex: number, neighbourTile: GirihTile): Array<GirihTile>;
    /**
     * Apply adjacent tile position to `neighbourTile`.
     *
     * @name transformTilePositionToAdjacencies
     * @memberof GirihTile
     * @instance
     * @param {number} baseEdgeIndex - The edge number of the you you want to apply adjacent position for.
     * @param {Polygon} neighbourTile - The polygon (or tile) you want to find adjacency for at the specified edge.
     * @return {Polygon|null} the passed tile itself if adjacency was found, null otherwise.
     */
    transformTilePositionToAdjacency<P extends Polygon>(baseEdgeIndex: number, neighbourTile: P): P;
    /**
     * Get the inner tile polygon at the given index.
     * This function applies MOD to the index.
     *
     * @name getInnerTilePolygonAt
     * @instance
     * @memberof GirihTile
     * @param {number} index
     * @return {Polygon} The sub polygon (inner tile) at the given index.
     **/
    getInnerTilePolygonAt(index: number): Polygon;
    /**
     * Get the outer tile polygon at the given index.
     * This function applies MOD to the index.
     *
     * @name getOuterTilePolygonAt
     * @instance
     * @memberof GirihTile
     * @param {number} index
     * @return {Polygon} The sub polygon (outer tile) at the given index.
     **/
    getOuterTilePolygonAt(index: number): Polygon;
    /**
     * Rotate this tile
     * Note: this function behaves a bitdifferent than the genuine Polygon.rotate function!
     *       Polygon has the default center of rotation at (0,0).
     *       The GirihTile rotates around its center (position) by default.
     *
     * @name rotate
     * @instance
     * @memberof GirihTile
     * @param {number} angle - The angle to use for rotation.
     * @param {Vertex?} center - The center of rotation (default is this.position).
     * @return {Polygon} this
     **/
    rotate(angle: number, center?: Vertex): GirihTile;
    /**
     * This function locates the closest tile edge (polygon edge)
     * to the passed point.
     *
     * Currently the edge distance to a point is measured by the
     * euclidian distance from the edge's middle point.
     *
     * Idea: move this function to Polygon?
     *
     * @name locateEdgeAtPoint
     * @instance
     * @memberof GirihTile
     * @param {XYCoords} point     - The point to detect the closest edge for.
     * @param {number}   tolerance - The tolerance (=max distance) the detected edge
     *                               must be inside.
     * @return {nmber} the edge index (index of the starting vertex, so [index,index+1] is the edge ) or -1 if not found.
     **/
    locateEdgeAtPoint(point: XYCoords, tolerance: number): number;
}
