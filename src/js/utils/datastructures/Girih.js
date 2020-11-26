"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Girih = void 0;
var Vertex_1 = require("../../Vertex");
var GirihBowtie_1 = require("./GirihBowtie");
var GirihDecagon_1 = require("./GirihDecagon");
var GirihHexagon_1 = require("./GirihHexagon");
var GirihPenroseRhombus_1 = require("./GirihPenroseRhombus");
var GirihPentagon_1 = require("./GirihPentagon");
var GirihRhombus_1 = require("./GirihRhombus");
var Girih = /** @class */ (function () {
    /**
     * Create a new empty Girih pattern.
     *
     * @constructor
     * @memberof Girih
     * @param {number} edgeLength
     */
    function Girih(edgeLength) {
        this.edgeLength = edgeLength;
        // Initialize templates, one for each Girih tile type.
        // The template array will be filled on initialization (see below).
        this.TILE_TEMPLATES = [];
        // The set of all Girih tiles in scene
        this.tiles = [];
        this.initTemplates(edgeLength);
    }
    ;
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
    Girih.prototype.initTemplates = function (edgeLength) {
        // Positions actually don't matter here.
        // Tiles will be moved to correct position conerning adjacency.
        var decagon = new GirihDecagon_1.GirihDecagon(new Vertex_1.Vertex(0, 0), edgeLength);
        var pentagon = new GirihPentagon_1.GirihPentagon(new Vertex_1.Vertex(0, 0), edgeLength);
        var hexagon = new GirihHexagon_1.GirihHexagon(new Vertex_1.Vertex(0, 0), edgeLength);
        var bowtie = new GirihBowtie_1.GirihBowtie(new Vertex_1.Vertex(0, 0), edgeLength);
        var rhombus = new GirihRhombus_1.GirihRhombus(new Vertex_1.Vertex(0, 0), edgeLength);
        var penrose = new GirihPenroseRhombus_1.GirihPenroseRhombus(new Vertex_1.Vertex(0, 0), edgeLength, true); // Add center polygon
        // Add tiles to array and put them in the correct adjacency position.
        this.TILE_TEMPLATES.push(decagon);
        this.TILE_TEMPLATES.push(decagon.transformTilePositionToAdjacency(2, pentagon));
        this.TILE_TEMPLATES.push(pentagon.transformTilePositionToAdjacency(1, penrose));
        this.TILE_TEMPLATES.push(penrose.transformTilePositionToAdjacency(3, hexagon));
        this.TILE_TEMPLATES.push(decagon.transformTilePositionToAdjacency(5, bowtie));
        this.TILE_TEMPLATES.push(pentagon.transformTilePositionToAdjacency(4, rhombus));
    };
    ;
    /**
     * Add a new tile to this Girih pattern.
     *
     * @name addTile
     * @memberof Girih
     * @instance
     * @param {GirihTile} tile - The tile to add (instance must not already be part of this pattern).
     * @return {void}
     */
    Girih.prototype.addTile = function (tile) {
        this.tiles.push(tile);
    };
    ;
    /**
     * Remove the tile at given array position. The index must be inside valid bounds.
     *
     * @name removeTile
     * @memberof Girih
     * @instance
     * @param {number} index - The index in the `tiles` Array.
     * @return {void}
     */
    Girih.prototype.removeTileAt = function (index) {
        this.tiles.splice(index, 1);
    };
    ;
    /**
     * Find that tile (index) which contains the given position. First match will be returned.
     *
     * @name locateContainingTile
     * @memberof Girih
     * @instance
     * @param {Vertex} position
     * @return {number} The index of the containing tile or -1 if none was found.
     **/
    Girih.prototype.locateConatiningTile = function (position) {
        for (var i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].containsVert(position))
                return i;
        }
        return -1;
    };
    ;
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
    Girih.prototype.turnTile = function (tileIndex, turnCount) {
        if (tileIndex == -1) // TODO: still required?
            return;
        var tile = this.tiles[tileIndex];
        tile.rotate(turnCount * Math.PI * 2 / tile.symmetry);
    };
    ;
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
    Girih.prototype.moveTile = function (tileIndex, moveXAmount, moveYAmount) {
        if (tileIndex == -1) // TODO: still required?
            return;
        var tile = this.tiles[tileIndex];
        tile.move({ x: moveXAmount * 10, y: moveYAmount * 10 });
    };
    ;
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
    Girih.prototype.findPossibleAdjacentTiles = function (tileIndex, edgeIndex) {
        var adjTiles = [];
        if (tileIndex == -1 || edgeIndex == -1) // TODO: still required?
            return [];
        var template = null;
        for (var i in this.TILE_TEMPLATES) {
            template = this.TILE_TEMPLATES[i].clone();
            // Find all rotations and positions for that tile to match
            var foundTiles = this.tiles[tileIndex].transformTileToAdjacencies(edgeIndex, template);
            if (foundTiles.length != 0) {
                adjTiles = adjTiles.concat(foundTiles);
            }
        }
        // Set pointer to save range.
        // previewTilePointer = Math.min( adjTiles.length-1, previewTiilePointer );
        return adjTiles;
    };
    ;
    return Girih;
}());
exports.Girih = Girih;
; // END class Girih
//# sourceMappingURL=Girih.js.map