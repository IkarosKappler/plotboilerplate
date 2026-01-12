/**
 * @require getContrastColor
 *
 * @date 2026-01-07 Refactored the render methods to this class.
 * @author Ikaros Kappler
 */

(function (_context) {
  var GirihRenderer = function (pb, girih, config) {
    this.girih = girih;
    this.pb = pb;
    this.config = config;
  };

  // +---------------------------------------------------------------------------------
  // | Get the contrast color (string) for the given color (object).
  // +-------------------------------
  var toContrastColorString = function (color) {
    return getContrastColor(color).cssRGB();
  };

  // +---------------------------------------------------------------------------------
  // | Draw the given tile.
  // |
  // | @param {GirihTile} tile - The tile itself.
  // | @param {number} index - The index in the tiles-array (to highlight hover).
  // +-------------------------------
  GirihRenderer.prototype.drawPreviewIntersectionPolygons = function (
    draw,
    fill,
    previewTiles,
    previewIntersectionPolygons,
    hoverTileIndex,
    hoverEdgeIndex,
    previewTilePointer
  ) {
    // Draw the preview polygon first
    if (hoverTileIndex != -1 && hoverEdgeIndex != -1 && 0 <= previewTilePointer && previewTilePointer < previewTiles.length) {
      draw.polygon(previewTiles[previewTilePointer], "rgba(128,128,128,0.5)", this.config.previewPolygonLineWidth); // Polygon is not open

      // Draw intersection polygons (if there are any)
      if (this.config.showPreviewOverlaps) {
        for (var i = 0; i < previewIntersectionPolygons.length; i++) {
          this.pb.fill.polygon(previewIntersectionPolygons[i], "rgba(255,0,0,0.25)");
        }
      }
    }
  };

  GirihRenderer.prototype.drawAllTiles = function (draw, fill, hoverTileIndex, textureImage) {
    // Draw all tiles
    for (var i in this.girih.tiles) {
      var tile = this.girih.tiles[i];
      // Fill polygon when highlighted (mouse hover)
      // drawTile(draw, fill, tile, i);
      this.drawTile(draw, fill, tile, i, i == hoverTileIndex, textureImage);
    }
  };

  GirihRenderer.prototype.drawIntersectionPolygons = function (
    draw,
    fill,
    hoverTileIndex,
    hoverEdgeIndex,
    previewTiles,
    previewTilePointer,
    previewIntersectionPolygons
  ) {
    // Draw intersection polygons? (if there are any)
    if (
      this.config.showPreviewOverlaps &&
      hoverTileIndex != -1 &&
      hoverEdgeIndex != -1 &&
      0 <= previewTilePointer &&
      previewTilePointer < previewTiles.length
    ) {
      for (var i = 0; i < previewIntersectionPolygons.length; i++) {
        fill.polygon(previewIntersectionPolygons[i], "rgba(255,0,0,0.25)");
      }
    }

    if (hoverTileIndex != -1 && hoverEdgeIndex != -1) {
      var tile = this.girih.tiles[hoverTileIndex];
      var edge = new Line(tile.vertices[hoverEdgeIndex], tile.vertices[(hoverEdgeIndex + 1) % tile.vertices.length]);
      draw.line(edge.a, edge.b, Red.cssRGB(), 2.0);
    }
  };

  // +---------------------------------------------------------------------------------
  // | Draw the given tile.
  // |
  // | @param {GirihTile} tile - The tile itself.
  // | @param {number} index - The index in the tiles-array (to highlight hover).
  // +-------------------------------
  GirihRenderer.prototype.drawTile = function (draw, fill, tile, index, isHighlighted, textureImage) {
    if (this.config.drawTextures && textureImage.complete && textureImage.naturalHeight !== 0) {
      drawTileTexture(this.pb, tile, textureImage, this.config.drawFullImages, this.config.drawBoundingBoxes);
    }

    if (this.config.drawOutlines) {
      // draw.polygon(tile, pb.drawConfig.polygon.color, pb.drawConfig.polygon.lineWidth); // Polygon is not open
      draw.polygon(tile, this.config.outlineLineColor, this.config.outlineLineWidth, { lineJoin: this.config.lineJoin }); // Polygon is not open
    }

    // Draw all inner polygons?
    for (var j = 0; j < tile.innerTilePolygons.length; j++) {
      // draw.polygon(tile.innerTilePolygons[j], DeepPurple.cssRGB(), 1.0);
      if (this.config.fillInnerPolygons) {
        fill.polygon(tile.innerTilePolygons[j], this.config.innerPolygonFillColor);
      }
      if (this.config.drawInnerPolygons) {
        draw.polygon(tile.innerTilePolygons[j], this.config.innerPolygonLineColor, this.config.innerPolygonLineWidth, {
          lineJoin: this.config.lineJoin
        });
      }
    }

    // Draw all outer polygons?
    for (var j = 0; j < tile.outerTilePolygons.length; j++) {
      // draw.polygon(tile.outerTilePolygons[j], Teal.cssRGB(), 1.0);
      if (this.config.fillOuterPolygons) {
        fill.polygon(tile.outerTilePolygons[j], this.config.outerPolygonFillColor);
      }
      if (this.config.drawOuterPolygons) {
        draw.polygon(tile.outerTilePolygons[j], this.config.outerPolygonLineColor, this.config.outerPolygonLineWidth, {
          lineJoin: this.config.lineJoin
        });
      }
    }

    // Draw a crosshair at the center
    // var isHighlighted = index == hoverTileIndex;
    if (this.config.drawCenters) {
      drawFancyCrosshair(
        draw,
        fill,
        tile.position,
        tile.position.attr.isSelected ? "red" : isHighlighted ? "rgba(192,0,0,0.5)" : "rgba(0,192,192,0.5)",
        tile.position.attr.isSelected ? 2.0 : 1.0,
        3.0
      );
    }

    var contrastColor = toContrastColorString(Color.parse(this.pb.config.backgroundColor));
    // Draw corner numbers?
    if (this.config.drawCornerNumbers) {
      for (var i = 0; i < tile.vertices.length; i++) {
        var pos = tile.vertices[i].clone().scale(0.85, tile.position);
        fill.text("" + i, pos.x, pos.y, { color: contrastColor });
      }
    }

    if (this.config.drawTileNumbers) {
      fill.text("" + index, tile.position.x, tile.position.y, { color: contrastColor });
    }

    // Selected?
    if (tile.position.attr.isSelected) {
      // draw.polygon(tile, pb.drawConfig.polygon.color, pb.drawConfig.polygon.lineWidth); // Polygon is not open
      fill.polygon(tile, "rgba(255,128,0,0.333)", 2, { lineJoin: this.config.lineJoin }); // Polygon is not open
    }
  };

  _context.GirihRenderer = GirihRenderer;
})(globalThis);
