/**
 * @author   Ikaros Kappler
 * @date     2020-11-24
 * @modified 2020-11-25 Ported to TypeScript from vanilla JS.
 * @version  1.0.1
 * @file     Girih
 **/
import { Vertex } from "../../Vertex";
import { GirihBowtie } from "./GirihBowtie";
import { GirihDecagon } from "./GirihDecagon";
import { GirihHexagon } from "./GirihHexagon";
import { GirihPenroseRhombus } from "./GirihPenroseRhombus";
import { GirihPentagon } from "./GirihPentagon";
import { GirihRhombus } from "./GirihRhombus";
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
 */
export class Girih {
    /**
     * Create a new empty Girih pattern.
     *
     * @constructor
     * @memberof Girih
     * @param {number} edgeLength
     */
    constructor(edgeLength) {
        this.edgeLength = edgeLength;
        // Initialize templates, one for each Girih tile type.
        // The template array will be filled on initialization (see below).
        this.TILE_TEMPLATES = [];
        // The set of all Girih tiles in scene
        this.tiles = [];
        this.initTemplates(edgeLength);
    }
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
    initTemplates(edgeLength) {
        // Positions actually don't matter here.
        // Tiles will be moved to correct position conerning adjacency.
        var decagon = new GirihDecagon(new Vertex(0, 0), edgeLength);
        var pentagon = new GirihPentagon(new Vertex(0, 0), edgeLength);
        var hexagon = new GirihHexagon(new Vertex(0, 0), edgeLength);
        var bowtie = new GirihBowtie(new Vertex(0, 0), edgeLength);
        var rhombus = new GirihRhombus(new Vertex(0, 0), edgeLength);
        var penrose = new GirihPenroseRhombus(new Vertex(0, 0), edgeLength, true); // Add center polygon
        // Add tiles to array and put them in the correct adjacency position.
        this.TILE_TEMPLATES.push(decagon);
        this.TILE_TEMPLATES.push(decagon.transformTilePositionToAdjacency(2, pentagon));
        this.TILE_TEMPLATES.push(pentagon.transformTilePositionToAdjacency(1, penrose));
        this.TILE_TEMPLATES.push(penrose.transformTilePositionToAdjacency(3, hexagon));
        this.TILE_TEMPLATES.push(decagon.transformTilePositionToAdjacency(5, bowtie));
        this.TILE_TEMPLATES.push(pentagon.transformTilePositionToAdjacency(4, rhombus));
    }
    /**
     * Add a new tile to this Girih pattern.
     *
     * @name addTile
     * @memberof Girih
     * @instance
     * @param {GirihTile} tile - The tile to add (instance must not already be part of this pattern).
     * @return {void}
     */
    addTile(tile) {
        this.tiles.push(tile);
    }
    /**
     * Remove the tile at given array position. The index must be inside valid bounds.
     *
     * @name removeTile
     * @memberof Girih
     * @instance
     * @param {number} index - The index in the `tiles` Array.
     * @return {void}
     */
    removeTileAt(index) {
        this.tiles.splice(index, 1);
    }
    /**
     *
     * @param tiles
     */
    replaceTiles(tiles) {
        this.tiles.splice(0, this.tiles.length);
        for (var i in tiles) {
            this.addTile(tiles[i]);
        }
    }
    /**
     * Find that tile (index) which contains the given position. First match will be returned.
     *
     * @name locateContainingTile
     * @memberof Girih
     * @instance
     * @param {Vertex} position
     * @return {number} The index of the containing tile or -1 if none was found.
     **/
    locateConatiningTile(position) {
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].containsVert(position))
                return i;
        }
        return -1;
    }
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
    turnTile(tileIndex, turnCount) {
        if (tileIndex == -1)
            // TODO: still required?
            return;
        const tile = this.tiles[tileIndex];
        tile.rotate((turnCount * Math.PI * 2) / tile.symmetry);
    }
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
    moveTile(tileIndex, moveXAmount, moveYAmount) {
        if (tileIndex == -1)
            // TODO: still required?
            return;
        const tile = this.tiles[tileIndex];
        tile.move({ x: moveXAmount * 10, y: moveYAmount * 10 });
    }
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
    findPossibleAdjacentTiles(tileIndex, edgeIndex) {
        var adjTiles = [];
        if (tileIndex == -1 || edgeIndex == -1)
            // TODO: still required?
            return [];
        let template = null;
        for (var i in this.TILE_TEMPLATES) {
            template = this.TILE_TEMPLATES[i].clone();
            // Find all rotations and positions for that tile to match
            const foundTiles = this.tiles[tileIndex].transformTileToAdjacencies(edgeIndex, template);
            if (foundTiles.length != 0) {
                adjTiles = adjTiles.concat(foundTiles);
            }
        }
        // Set pointer to save range.
        // previewTilePointer = Math.min( adjTiles.length-1, previewTiilePointer );
        return adjTiles;
    }
} // END class Girih
//# sourceMappingURL=Girih.js.map