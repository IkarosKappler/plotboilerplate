/**
 * @classdesc The Girih datastructure for generating patterns.
 *
 * @requires Vertex
 * @requires GirihTile
 * @requires GirihBowtie
 * @requires GirihDecagon
 * @requires GirihHexagon
 * @requires GirihPenroseRhombus
 * @requires GirihPentagon
 * @requires GirihRhombus
 *
 * @author   Ikaros Kappler
 * @date     2020-11-24
 * @modified 2020-11-25 Ported to TypeScript from vanilla JS.
 * @version  1.0.1
 * @file     Girih
 **/
import { Vertex } from "../../Vertex";
import { GirihTile } from "./GirihTile";
export declare class Girih {
    /**
     * The edge length to use in this Girih pattern.
     *
     * @member {number}
     * @memberof Girih
     * @type {number}
     * @instance
     */
    readonly edgeLength: number;
    /**
     * An array of all available Girih tiles. Use them as templates for copy-and-paste.
     *
     * @member {Array<GirihTile>}
     * @memberof Girih
     * @type {Array<GirihTile>}
     * @instance
     */
    readonly TILE_TEMPLATES: Array<GirihTile>;
    /**
     * The actual set of Girih tiles used in this Girih pattern.
     *
     * @member {Array<GirihTile>}
     * @memberof Girih
     * @type {Array<GirihTile>}
     * @instance
     */
    readonly tiles: Array<GirihTile>;
    /**
     * Create a new empty Girih pattern.
     *
     * @constructor
     * @memberof Girih
     * @param {number} edgeLength
     */
    constructor(edgeLength: number);
    /**
     * Initialize the TILE_TEMPLATES array.
     *
     * @name initTemplates
     * @private
     * @memberof Girih
     * @instance
     * @param {number} edgeLength - The edge length to use for the template tiles.
     * @return {void}
     */
    private initTemplates;
    /**
     * Add a new tile to this Girih pattern.
     *
     * @name addTile
     * @memberof Girih
     * @instance
     * @param {GirihTile} tile - The tile to add (instance must not already be part of this pattern).
     * @return {void}
     */
    addTile(tile: GirihTile): void;
    /**
     * Remove the tile at given array position. The index must be inside valid bounds.
     *
     * @name removeTile
     * @memberof Girih
     * @instance
     * @param {number} index - The index in the `tiles` Array.
     * @return {void}
     */
    removeTileAt(index: number): void;
    /**
     * Find that tile (index) which contains the given position. First match will be returned.
     *
     * @name locateContainingTile
     * @memberof Girih
     * @instance
     * @param {Vertex} position
     * @return {number} The index of the containing tile or -1 if none was found.
     **/
    locateConatiningTile(position: Vertex): number;
    /**
     * Turn the tile the mouse is hovering over.
     * The turnCount is ab abstract number: -1 for one turn left, +1 for one turn right.
     * The turning angle is defined by the tile with the lowest turn symmetry: the Decagon,
     * so angle is 36°.
     *
     * @name turnTile
     * @memberof Girih
     * @instance
     * @param {number} tileIndex - The index of the tile to rotate.
     * @param {number} turnCount - A discrete number indicating the number of turn steps.
     * @return {void}
     */
    turnTile(tileIndex: number, turnCount: number): void;
    /**
     * Move that tile the mouse is hovering over.
     * The move amounts are abstract numbers, 1 indicating one unit along each axis.
     *
     * @name moveTile
     * @memberof Girih
     * @instance
     * @param {number} tileIndex - The index of the tile to rotate.
     * @param {number} moveXAmount - The amount to move along the x axis (in pixels).
     * @param {number} moveYAmount - The amount to move along the y axis (in pixels).
     * @return {void}
     */
    moveTile(tileIndex: number, moveXAmount: number, moveYAmount: number): void;
    /**
     * Find all possible adjadent tiles and their locations (type, rotation and offset). The
     * function will return an array of all possible tiles matching at the given tile and edge.
     *
     * @name findPossibleAdjacentTiles
     * @memberof Girih
     * @instance
     * @param {number} tileIndex - The index of the tile to rotate.
     * @param {number} edgeIndex - The index of the tile's edge.
     * @return {Array<GirihTile>} - An array of possible adjecent tiles (already positioned and rotated).
     */
    findPossibleAdjacentTiles(tileIndex: number, edgeIndex: number): Array<GirihTile>;
}
