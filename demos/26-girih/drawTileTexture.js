/**
 * Draw the texture for the given tile.
 *
 * @author   Ikaros Kappler
 * @date     2020-11-25
 * @modified 2022-07-29 Completely refactored for the new `DrawLib.texturePoly` function.
 * @version  2.0.0
 **/

(function (_context) {
  "use strict";

  var drawTileTexture = function (pb, tile, textureImage, drawFullImages, drawBoundingBoxes) {
    var draw = pb.draw;
    var fill = pb.fill;
    var basePolygonBounds = tile.getBounds();
    var imageWidth = 500.0; // TODO: read from image (naturalWidth?)
    var imageHeight = 460.0;
    var tileBounds = tile.baseBounds;
    var ratio = tile.baseBounds.width / (imageWidth * tile.textureSource.max.x - imageWidth * tile.textureSource.min.x);

    var upperLeftTextureBound = new Vertex(tileBounds.min).addXY(
      -tile.textureSource.min.x * imageWidth * ratio,
      -tile.textureSource.min.y * imageHeight * ratio
    );
    var textureSize = new Bounds(
      upperLeftTextureBound,
      upperLeftTextureBound.clone().addXY(imageWidth * ratio, imageHeight * ratio)
    );

    var rotation = tile.rotation;
    if (drawFullImages) {
      fill.image(textureImage, upperLeftTextureBound, { x: textureSize.width, y: textureSize.height }, 0.1);
    }

    var polygonPosition = tile.position.clone();
    // TODO: add this to the GirihTile class?
    //       Tiles are not really rotated in this way, especially not the pentagon
    //       tile, which would be the only critical one.
    var polygonCenterOffset = { x: 0, y: 0 };
    var polygonRotationCenter = polygonPosition.clone().add(polygonCenterOffset);

    // REFACTOR?
    var rotationalOffset = basePolygonBounds.getCenter().difference(polygonRotationCenter);
    var rotationalOffsetInv = rotationalOffset.inv();
    var positionOffset = basePolygonBounds.getCenter().difference(polygonPosition);

    // Scale around center
    var clonedTextureSize = new Bounds(textureSize.min.clone(), textureSize.max.clone());
    var scaledTextureSize = new Bounds(
      textureSize.min.clone().add(rotationalOffsetInv).add(positionOffset),
      textureSize.max.clone().add(rotationalOffsetInv).add(positionOffset)
    );

    if (drawBoundingBoxes) {
      var boundsPolygon = clonedTextureSize
        .toPolygon()
        .move(rotationalOffsetInv)
        .move(positionOffset)
        .rotate(rotation, polygonPosition);
      var _localRotationCenter = polygonPosition.clone().add(rotationalOffset);
      draw.polygon(boundsPolygon, "orange", 1.0);
      draw.polygon(scaledTextureSize.toPolygon(), "yellow", 1.0);
      draw.polygon(clonedTextureSize.toPolygon(), "green", 1.0);
      draw.crosshair(_localRotationCenter, 4, "green");
    }

    var scaledPolygon = tile.clone().move(rotationalOffset).move(positionOffset);

    var rotatedPolygon = scaledPolygon.clone(); // Is already rotated by the tile

    fill.texturedPoly(textureImage, scaledTextureSize, rotatedPolygon, polygonPosition, rotation);

    // draw.polygon(tile, "rgba(192,192,192,0.5)", 2.0);
    // draw.polygon(scaledPolygon, "rgba(255,192,0,0.75)", 1.0); // orange
    // draw.polygon(rotatedPolygon, "rgb(0,128,192)", 1.0);
  };

  _context.drawTileTexture = drawTileTexture;
})(globalThis || window);
