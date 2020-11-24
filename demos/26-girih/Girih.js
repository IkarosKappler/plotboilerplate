/**
 * The Girih datastructure for generating patterns.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2020-11-24
 * @version  1.0.0
 **/


(function(_context) {
    "use strict";


    var Girih = function( edgeLength ) {

	this.edgeLength = edgeLength;
	
	// Initialize templates, one for each Girih tile type.
	// The template array will be filled on initialization (see below).
	this.TILE_TEMPLATES = [];

	// The set of all Girih tiles in scene
	this.tiles = [];

	this.initTemplates( edgeLength );
    };

    // @private
    Girih.prototype.initTemplates = function( edgeLength ) {
	var decagon = new GirihDecagon( new Vertex(-200,-100), edgeLength, 0.0 ); // Positions don't matter here
	var pentagon = new GirihPentagon( new Vertex(-77,-60), edgeLength, 0.0 );
	var hexagon = new GirihHexagon( new Vertex(25,-0.5), edgeLength, 0.0 );
	var bowtie = new GirihBowtie( new Vertex(-232,0), edgeLength, 0.0 );
	var rhombus = new GirihRhombus( new Vertex(-68,-127.5), edgeLength, 0.0 );
	var penrose = new GirihPenroseRhombus( new Vertex(-24,-28), edgeLength, 0.0, true );

	// Add tiles to array and put them in the correct adjacency position.
	this.TILE_TEMPLATES.push( decagon );
	this.TILE_TEMPLATES.push( decagon.transformTilePositionToAdjacency( 2, pentagon ) );
	this.TILE_TEMPLATES.push( pentagon.transformTilePositionToAdjacency( 1, penrose ) );
	this.TILE_TEMPLATES.push( penrose.transformTilePositionToAdjacency( 3, hexagon ) );
	this.TILE_TEMPLATES.push( decagon.transformTilePositionToAdjacency( 5, bowtie ) );
	this.TILE_TEMPLATES.push( pentagon.transformTilePositionToAdjacency( 4, rhombus ) );

	/*
	for( var i in this.TILE_TEMPLATES ) {
	    var tile = this.TILE_TEMPLATES[i].clone();
	    // TODO: move click listener somewhere else
	    tile.position.listeners.addClickListener( (function(vertex) {
		return function(clickEvent) {
		    console.log('clicked', clickEvent );
		    vertex.attr.isSelected = !vertex.attr.isSelected;
		    pb.redraw();
		} })(tile.position)
						    );
	    tile.position.attr.draggable = false;
	    pb.add( tile.position );
	    
	    this.tiles.push( tile );
	}

	console.log( 'tiles', this.tiles );
	*/
    };

    Girih.prototype.addTile = function( tile ) {
	this.tiles.push( tile );
    };

    Girih.prototype.removeTileAt = function( index ) {
	this.tiles.splice( index, 1 );
    };

    /**
     * Find that tile (index) which contains the given position. First match will be returned.
     *
     * @name locateContainingTile
     * @param {Vertex} position
     * @return {number} The index of the containing tile or -1 if none was found.
     **/
    Girih.prototype.locateConatiningTile = function( position ) {
	for( var i in this.tiles ) {
	    if( this.tiles[i].containsVert( position ) )
		return i;
	}
	return -1;
    };


    // +---------------------------------------------------------------------------------
    // | Turn the tile the mouse is hovering over.
    // | The turnCount is ab abstract number: -1 for one turn left, +1 for one turn right.
    // +-------------------------------
    Girih.prototype.turnTile = function( tileIndex, turnCount ) {
	if( tileIndex == -1 ) // TODO: still required?
	    return;
	var tile = this.tiles[tileIndex];
	tile.rotate( turnCount * Math.PI*2/tile.symmetry );
	// pb.redraw();
    };


    // +---------------------------------------------------------------------------------
    // | Move that tile the mouse is hovering over.
    // | The move amounts are abstract numbers, 1 indicating one unit along each axis.
    // +-------------------------------
    GirihTile.prototype.handleMoveTile = function( tileIndex, moveXAmount, moveYAmount ) {
	if( tileIndex == -1 ) // TODO: still required?
	    return;
	var tile = tiles[tileIndex];
	tile.move( { x: moveXAmount*10, y : moveYAmount*10 } );
	// pb.redraw();
    };


    // +---------------------------------------------------------------------------------
    // | Find all possible adjadent tiles and their locations (type, rotation and offset).
    // +-------------------------------
    Girih.prototype.findAdjacentTiles = function( tileIndex, edgeIndex ) {
	var adjTiles = [];
	if( tileIndex == -1 ||  edgeIndex == -1 ) // TODO: still required
	    return [];
	
	var template = null; 
	for( var i in this.TILE_TEMPLATES ) {
	    template = this.TILE_TEMPLATES[ i ].clone();
	    // Find all rotations and positions for that tile to match
	    var foundTiles = this.tiles[tileIndex].transformTileToAdjacencies( 
		edgeIndex,
		template
	    );
	    if( foundTiles.length != 0 ) {
		adjTiles = adjTiles.concat( foundTiles );
	    }
	}
	// Set pointer to save range.
	// previewTilePointer = Math.min( adjTiles.length-1, previewTiilePointer );
	return adjTiles;
    };

    _context.Girih = Girih;
    
})(window); 


