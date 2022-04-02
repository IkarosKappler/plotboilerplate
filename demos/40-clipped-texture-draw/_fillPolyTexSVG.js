"use strict";
/**
 * @author Ikaros Kappler
 * @date 2022-03-25
 * @version 1.0.0
 */

globalThis.fillPolyTexSVG = (function () {
  // A helper function to define the clipping path.
  // This could be a candidate for the draw library.
  var clipPoly = function (ctx, offset, scale, vertices) {
    ctx.beginPath();
    // Set clip mask
    ctx.moveTo(offset.x + vertices[0].x * scale.x, offset.y + vertices[0].y * scale.y);
    for (var i = 1; i < vertices.length; i++) {
      var vert = vertices[i];
      ctx.lineTo(offset.x + vert.x * scale.x, offset.y + vert.y * scale.y);
    }
    ctx.closePath();
    ctx.clip();
  };

  function fillPolyTexSVG(fill, textureImage, textureSize, polygon, polygonPosition, rotation, isNoClip) {
    var basePolygonBounds = polygon.getBounds(); // Only required on editable polygons
    var targetCenterDifference = polygonPosition.clone().difference(basePolygonBounds.getCenter());
    var tileCenter = basePolygonBounds.getCenter().sub(targetCenterDifference);

    // Get the position offset of the polygon
    var targetTextureSize = new Vertex(textureSize.width, textureSize.height);
    var targetTextureOffset = new Vertex(-textureSize.width / 2, -textureSize.height / 2).sub(targetCenterDifference);

    fill.ctx.save();

    fill.ctx.translate(fill.offset.x + tileCenter.x * fill.scale.x, fill.offset.y + tileCenter.y * fill.scale.y);
    fill.ctx.rotate(rotation);

    if (!isNoClip) {
      clipPoly(
        fill.ctx,
        {
          x: (-targetCenterDifference.x - tileCenter.x) * fill.scale.x,
          y: (-targetCenterDifference.y - tileCenter.y) * fill.scale.y
        },
        fill.scale,
        polygon.vertices
      );
    }
    fill.ctx.drawImage(
      textureImage,
      0,
      0,
      textureImage.naturalWidth - 1, // There is this horrible Safari bug (fixed in newer versions)
      textureImage.naturalHeight - 1, // To avoid errors substract 1 here.
      (-polygonPosition.x + targetTextureOffset.x) * fill.scale.x,
      (-polygonPosition.y + targetTextureOffset.y) * fill.scale.y,
      targetTextureSize.x * fill.scale.x,
      targetTextureSize.y * fill.scale.y
    );

    fill.ctx.restore();
  }

  return fillPolyTexSVG;
})();
