/**
 * @author   Ikaros Kappler
 * @date     2013-11-27
 * @modified 2014-04-05 Ikaros Kappler (member array outerTilePolygons added).
 * @modified 2015-03-19 Ikaros Kappler (added toSVG()).
 * @modified 2020-10-30 Refactored the this super class to work with PlotBoilerplate.
 * @modified 2020-11-11 Ported the class from vanilla JS to TypeScript.
 * @version  2.0.1-alpha
 * @name GirihTile
 **/
import { Bounds } from "../../Bounds";
import { Polygon } from "../../Polygon";
import { Vertex } from "../../Vertex";
import { XYCoords } from "../../interfaces";
export declare enum TileType {
    UNKNOWN = "UNKNOWN",
    DECAGON = "DECAGON",
    PENTAGON = "PENTAGON",
    IRREGULAR_HEXAGON = "IRREGULAR_HEXAGON",
    RHOMBUS = "RHOMBUS",
    BOW_TIE = "BOW_TIE",
    PENROSE_RHOMBUS = "PENROSE_RHOMBUS"
}
export interface IAdjacency {
    edgeIndex: number;
    offset: XYCoords;
}
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
 */
export declare abstract class GirihTile extends Polygon {
    /**
     * The center of this tile.
     *
     * @name position
     * @member {Vertex}
     * @memberof GirihTile
     * @type {Vertex}
     * @instance
     */
    position: Vertex;
    /**
     * The edge length of this tile (all edges of a Girih tile have same length).
     *
     * @name edgeLength
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @readonly
     * @instance
     */
    readonly edgeLength: number;
    /**
     * The rotation of this tile. This is stored to make cloning easier.
     *
     * @name rotation.
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @instance
     */
    rotation: number;
    /**
     * The symmetry (=order) of this tile. This is the number of steps used for a full
     * rotation (in this Girih case: 10). Future Girih implementations might have other symmetries.
     *
     * @name symmetry
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @instance
     */
    symmetry: number;
    /**
     * The unique symmetries. This must be an nth part of the global `symmetry`.
     * Rotating this tile `uniqueSymmetries' times results in the same visual tile (flipped around
     * a symmetry axis).
     *
     * @name uniqueSymmetries
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @instance
     */
    uniqueSymmetries: number;
    /**
     * The inner tile polygons.
     *
     * @name innerTilePolygons
     * @member {Array<Polygon>}
     * @memberof GirihTile
     * @type {Array<Polygon>}
     * @instance
     */
    innerTilePolygons: Array<Polygon>;
    /**
     * The outer tile polygons.
     *
     * @name outerTilePolygons
     * @member {Array<Polygon>}
     * @memberof GirihTile
     * @type {Array<Polygon>}
     * @instance
     */
    outerTilePolygons: Array<Polygon>;
    /**
     * An identifier for the tile type.
     *
     * @name tileType
     * @member {TileType}
     * @memberof GirihTile
     * @type {TileType}
     * @instance
     */
    tileType: TileType;
    /**
     * The initial bounds (of the un-rotated tile). These are required to calculate the
     * correct texture mapping.
     *
     * @name baseBounds
     * @member {Bounds}
     * @memberof GirihTile
     * @type {Bounds}
     * @instance
     */
    baseBounds: Bounds;
    /**
     * A rectangle on the shipped texture image (`girihtexture-500px.png`) marking the
     * texture position. The bounds are relative, so each component must be in [0..1].
     * The texture is a square.
     *
     * @name textureSource
     * @member {Bounds}
     * @memberof GirihTile
     * @type {Bounds}
     * @instance
     */
    readonly textureSource: Bounds;
    /**
     * An epsilon to use for detecting adjacent edges. 0.001 seems to be a good value.
     * Adjust if needed.
     *
     * @name epsilon
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @static
     */
    static epsilon: number;
    /**
     * The default edge length.
     *
     * @name DEFAULT_EDGE_LENGTH
     * @member {number}
     * @memberof GirihTile
     * @type {number}
     * @readonly
     * @static
     */
    static readonly DEFAULT_EDGE_LENGTH: number;
    /**
     * @constructor
     * @memberof GirihTile
     * @abstract class
     * @param {Vertex} position   - The position of the tile.
     * @param {number} edgeLength - The edge length (usually GirihTile.DEFAULT_EDGE_LENGTH).
     * @param {TileType} tileType - One of `TileType.*` enum members.
     **/
    constructor(position: Vertex, edgeLength: number, tileType?: TileType);
    /**
     * @abstract Subclasses must override this.
     */
    abstract clone(): GirihTile;
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
