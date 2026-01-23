/**
 * Wrapping a lot of Girih helper stuff together here.
 *
 * @require addPolygonJitter
 *
 * @date    2026-01-15
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
  // +---------------------------------------------------------------------------------
  // | Constructor.
  // |
  // | @param {PlotBoilerplate} pb - The pb instance to  work on.
  // | @param {Girih} girih - The girih instance to  work on.
  // | @param {object} stats - (optional) The stats instance to use.
  // +-------------------------------
  var TilingHelper = function (pb, girih, stats) {
    this.pb = pb;
    this.girih = girih;
    this.stats = stats;
    // The index of the tile the mouse is hovering on or nearby (in the tiles-array)
    this.hoverTileIndex = -1;
    // The index of the closest edge to the mouse pointer
    this.hoverEdgeIndex = -1;

    // If the mouse hovers over an edge the next possible adjacent Girih tile will be this
    this.previewTiles = [];
    this.previewTilePointer = 0;

    this.previewIntersectionPolygons = [];
    this.previewIntersectionAreas = [];
  };

  // +---------------------------------------------------------------------------------
  // | Add a tile and install listeners.
  // +-------------------------------
  TilingHelper.prototype.addTile = function (tile) {
    var _self = this;
    tile.position.listeners.addClickListener(
      (function (vertex) {
        return function (_clickEvent) {
          console.log("click");
          vertex.attr.isSelected = !vertex.attr.isSelected;
          console.log("vertex.attr.isSelected", vertex.attr.isSelected);
          _self.pb.redraw();
        };
      })(tile.position)
    );
    tile.position.attr.draggable = false;
    tile.position.attr.visible = false;
    this.girih.addTile(tile);
    this.pb.add(tile.position);
  };

  // +---------------------------------------------------------------------------------
  // | Remove the tile at the given index.
  // +-------------------------------
  TilingHelper.prototype.removeTile = function (tileIndex) {
    // Don't remove last tile
    if (this.girih.tiles.length <= 1) {
      console.log("Removing the last tile is not allowed.");
      if (humane) {
        humane.log("Removing the last tile is not allowed.");
      }
      return;
    }
    // Remove listeners?
    this.pb.remove(this.girih.tiles[tileIndex].position);
    this.girih.removeTileAt(tileIndex);
    this.hoverTileIndex = -1;
    this.hoverEdgeIndex = -1;
  };

  // +---------------------------------------------------------------------------------
  // | Remove the tile at the given index.
  // +-------------------------------
  TilingHelper.prototype.removeAllTiles = function () {
    // Remove listeners?
    this.pb.removeAll(false, false); // keepVertices=false, triggerRedraw=false
    this.girih.removeAllTiles();
    this.hoverTileIndex = -1;
    this.hoverEdgeIndex = -1;
  };

  // +---------------------------------------------------------------------------------
  // | Turn the tile the mouse is hovering over.
  // | The turnCount is ab abstract number: -1 for one turn left, +1 for one turn right.
  // +-------------------------------
  TilingHelper.prototype.handleTurnTile = function (turnCount) {
    if (this.hoverTileIndex == -1) {
      return;
    }
    this.girih.turnTile(this.hoverTileIndex, turnCount);
    this.pb.redraw();
  };

  // +---------------------------------------------------------------------------------
  // | Move that tile the mouse is hovering over.
  // | The move amounts are abstract numbers, 1 indicating one unit along each axis.
  // +-------------------------------
  TilingHelper.prototype.handleMoveTile = function (moveXAmount, moveYAmount) {
    var selectedTileIndices = this.findSelectedTileIndices();
    for (var i = selectedTileIndices.length - 1; i >= 0; i--) {
      this.girih.moveTile(selectedTileIndices[i], moveXAmount, moveYAmount);
    }
    this.pb.redraw();
  };

  // +---------------------------------------------------------------------------------
  // | A helper function to find all tiles (indices) that are selected.
  // +-------------------------------
  TilingHelper.prototype.findSelectedTileIndices = function () {
    var selectedTileIndices = [];
    for (var i in this.girih.tiles) {
      if (this.girih.tiles[i].position.attr.isSelected) {
        selectedTileIndices.push(i);
      }
    }
    return selectedTileIndices;
  };

  // +---------------------------------------------------------------------------------
  // | Set the currently highlighted preview tile from the preview set.
  // +-------------------------------
  TilingHelper.prototype.setPreviewTilePointer = function (pointer) {
    this.previewTilePointer = pointer;
    this.findPreviewIntersections();
    this.pb.redraw();
  };

  // +---------------------------------------------------------------------------------
  // | Delete all selected tiles.
  // +-------------------------------
  TilingHelper.prototype.handleDeleteTile = function () {
    // Find selected tiles
    var selectedTileIndices = this.findSelectedTileIndices();
    for (var i = selectedTileIndices.length - 1; i >= 0; i--) {
      this.removeTile(selectedTileIndices[i]);
    }
    this.pb.redraw();
  };

  // +---------------------------------------------------------------------------------
  // | Find all intersections of the Girih tiles and the
  // | currently selected preview polygon.
  // |
  // | Following global vars will be updated:
  // |  * previewIntersectionPolygons
  // |  * previewIntersectionAreas
  // +-------------------------------
  TilingHelper.prototype.findPreviewIntersections = function () {
    this.previewIntersectionPolygons = [];
    this.previewIntersectionAreas = [];
    if (
      this.hoverTileIndex == -1 ||
      this.hoverEdgeIndex == -1 ||
      this.previewTilePointer < 0 ||
      this.previewTilePointer >= this.previewTiles.length
    ) {
      this.stats && (this.stats.intersectionArea = 0.0);
      return;
    }
    var totalArea = 0.0;
    var currentPreviewTile = this.previewTiles[this.previewTilePointer];
    for (var i = 0; i < this.girih.tiles.length; i++) {
      if (i == this.hoverTileIndex) {
        continue;
      }
      var intersections = findPreviewIntersectionsFor(currentPreviewTile, this.girih.tiles[i]);
      for (var j = 0; j < intersections.length; j++) {
        var poly = new Polygon(cloneVertexArray(intersections[j]), false);
        var area = poly.area();
        this.previewIntersectionAreas.push(area);
        this.previewIntersectionPolygons.push(poly);
        totalArea += area;
      }
    }
    this.stats && (this.stats.intersectionArea = totalArea);
  };

  // +---------------------------------------------------------------------------------
  // | Find the polygon intersections for the given preview tile and
  // | girih tile.
  // |
  // | @param {Polygon} previewTile - The tile you want to place.
  // | @param {Polygon} girihTile - The tile currently on the canvas.
  // | @return {Vertex[][]} A set of intersection polygons.
  // +-------------------------------
  var findPreviewIntersectionsFor = function (previewTile, girihTile) {
    // Check if there are intersec
    var intersection = greinerHormann.intersection(
      // This is a workaround about a colinearity problem with greiner-hormann:
      // ... add some random jitter.
      addPolygonJitter(cloneVertexArray(girihTile.vertices), 0.0001), // Source
      addPolygonJitter(cloneVertexArray(previewTile.vertices), 0.0001) // Clip
    );
    if (!intersection) {
      return [];
    }

    // Only one single polygon returned?
    if (typeof intersection[0][0] === "number") intersection = [intersection];

    // Calculate size or triangulation here?
    return intersection;
  };

  _context.TilingHelper = TilingHelper;
})(globalThis);
