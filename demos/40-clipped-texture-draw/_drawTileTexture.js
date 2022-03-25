/**
 * Draw the texture for the given tile.
 *
 * @author Ikaros Kappler
 * @date   2020-11-25
 **/

(function (_context) {
  "use strict";

  var BoundingBox2 = function (xMin, xMax, yMin, yMax) {
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
  };

  // TODO: the drawTexture function is somehow broken

  var _drawTileTexture = function (pb, tile, imageObject) {
    pb.draw.ctx.save();

    var originalBounds = tile.baseBounds;

    // pb.draw.ctx.beginPath();
    var point = tile.vertices[0].clone();
    point.rotate(tile.rotation);
    var startPoint = point.clone();
    // pb.draw.ctx.moveTo(
    //   point.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor,
    //   point.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
    // );

    // var bounds = new IKRS.BoundingBox2(point.x, point.y, point.x, point.y);
    var bounds = { xMin: point.x, yMin: point.y, xMax: point.x, yMax: point.y };

    for (var i = 1; i < tile.vertices.length; i++) {
      point.set(tile.vertices[i]);
      point.rotate(tile.rotation);
      //window.alert( "point=(" + point.x + ", "+ point.y + ")" );
      //   pb.draw.ctx.lineTo(
      //     point.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor,
      //     point.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
      //   );

      bounds.xMin = Math.min(point.x, bounds.xMin);
      bounds.xMax = Math.max(point.x, bounds.xMax);
      bounds.yMin = Math.min(point.y, bounds.yMin);
      bounds.yMax = Math.max(point.y, bounds.yMax);
    }
    // Close path
    // pb.draw.ctx.lineTo(
    //   startPoint.x * this.zoomFactor + this.drawOffset.x + position.x * this.zoomFactor,
    //   startPoint.y * this.zoomFactor + this.drawOffset.y + position.y * this.zoomFactor
    // );
    // pb.draw.ctx.closePath();

    if (true) {
      // this.drawProperties.drawTextures && imgProperties && imageObject) {
      // Build absolute image bounds from relative
      //   var imgBounds = new BoundingBox2(
      //     imgProperties.source.x * imageObject.width,
      //     (imgProperties.source.x + imgProperties.source.width) * imageObject.width,
      //     imgProperties.source.y * imageObject.height,
      //     (imgProperties.source.y + imgProperties.source.height) * imageObject.height
      //   );
      var imgBounds = new BoundingBox2(
        tile.textureSource.min.x * imageObject.width,
        tile.textureSource.max.x * imageObject.width,
        tile.textureSource.min.y * imageObject.height,
        tile.textureSource.max.y * imageObject.height
      );
      var polyImageRatio = new Vertex(originalBounds.width / imgBounds.width, originalBounds.height / imgBounds.height);
      //window.alert( "polyImageRatio=" + polyImageRatio );

      pb.draw.ctx.clip();
      var imageX = pb.draw.offset.x + tile.position.x * pb.draw.scale.x + originalBounds.xMin * pb.draw.scale.x;
      var imageY = pb.draw.offset.y + tile.position.y * pb.draw.scale.y + originalBounds.yMin * pb.draw.scale.y;
      var imageW = originalBounds.width * pb.draw.scale.x; //  + imgProperties.destination.xOffset * imageObject.width * polyImageRatio.x) * pb.draw.scale.x;
      var imageH = originalBounds.height * pb.draw.scale.y; // + imgProperties.destination.yOffset * imageObject.height * polyImageRatio.y) * pb.draw.scale.y;

      pb.draw.ctx.translate(imageX + imageW / 2.0, imageY + imageH / 2.0);
      //   pb.draw.ctx.translate(-pb.draw.offset.x + imageX + imageW / 2.0, -pb.draw.offset.y + imageY + imageH / 2.0);

      pb.draw.ctx.rotate(tile.rotation);

      var drawStartX = (-originalBounds.width / 2.0) * pb.draw.scale.x;
      var drawStartY = (-originalBounds.height / 2.0) * pb.draw.scale.y;
      console.log("drawTexture");
      pb.draw.ctx.drawImage(
        imageObject,
        tile.textureSource.min.x * imageObject.width, // source x
        tile.textureSource.min.y * imageObject.height, // source y
        (tile.textureSource.max.x - tile.textureSource.min.x) * imageObject.width, // source width
        (tile.textureSource.max.y - tile.textureSource.min.y) * imageObject.height, // source height
        drawStartX, //  + imgProperties.destination.xOffset * imageObject.width * polyImageRatio.x * 0.5 * this.zoomFactor, // destination x
        drawStartY, //  + imgProperties.destination.yOffset * imageObject.height * polyImageRatio.y * 0.5 * this.zoomFactor, // destination y
        originalBounds.width * pb.draw.scale.x, // destination width
        originalBounds.height * pb.draw.scale.y // destination height
      );
      console.log(
        // imageObject,
        tile.textureSource.min.x * imageObject.width, // source x
        tile.textureSource.min.y * imageObject.height, // source y
        (tile.textureSource.max.x - tile.textureSource.min.x) * imageObject.width, // source width
        (tile.textureSource.max.y - tile.textureSource.min.y) * imageObject.height, // source height
        drawStartX, //  + imgProperties.destination.xOffset * imageObject.width * polyImageRatio.x * 0.5 * this.zoomFactor, // destination x
        drawStartY, //  + imgProperties.destination.yOffset * imageObject.height * polyImageRatio.y * 0.5 * this.zoomFactor, // destination y
        originalBounds.width * pb.draw.scale.x, // destination width
        originalBounds.height * pb.draw.scale.y // destination height
      );
    }

    // Fill polygon with color (eventually additional to texture)?
    // if (colors.fillColor) {
    //   //window.alert( "fillColor=" + colors.fillColor );

    //   pb.draw.ctx.fillStyle = colors.fillColor;
    //   pb.draw.ctx.fill();
    // }

    // // Draw outlines?
    // if (drawOutlines && colors.unselectedEdgeColor) {
    //   pb.draw.ctx.lineWidth = 1.0;
    //   pb.draw.ctx.strokeStyle = colors.unselectedEdgeColor;
    //   pb.draw.ctx.stroke();
    // }

    pb.draw.ctx.restore();
  };

  var drawTileTexture = function (pb, tile, imageObject) {
    pb.draw.ctx.save();

    // var tileBounds = tile.getBounds();
    var scale = pb.draw.scale;
    var offset = pb.draw.offset;

    // The source bounds from the tile, scaled up to the given image's size.
    var srcBounds = new Bounds(
      new Vertex(tile.textureSource.min.x * imageObject.width, tile.textureSource.min.y * imageObject.height),
      new Vertex(tile.textureSource.max.x * imageObject.width, tile.textureSource.max.y * imageObject.height)
    );

    // The destination bounds, scaled up to the current zoom level.
    var destBounds = new Bounds(
      new Vertex(tile.baseBounds.min.x * scale.x, tile.baseBounds.min.y * scale.y),
      new Vertex(tile.baseBounds.max.x * scale.x, tile.baseBounds.max.y * scale.y)
    );
    // if (tile.tileType === "PENROSE_RHOMBUS") {
    //   console.log("PENROSE_RHOMBUS", "rotation", tile.rotation, "baseBounds", tile.baseBounds);
    // }
    // var destBounds = new Bounds(
    //   new Vertex(tileBounds.min.x * scale.x, tileBounds.min.y * scale.y),
    //   new Vertex(tileBounds.max.x * scale.x, tileBounds.max.y * scale.y)
    // );

    clipPoly(pb.draw.ctx, pb.draw.offset, pb.draw.scale, tile.vertices);

    // Set offset and translation here.
    // Other ways we will not be able to rotate textures properly around the tile center.
    pb.draw.ctx.translate(offset.x + tile.position.x, offset.y + tile.position.y);
    pb.draw.ctx.rotate(tile.rotation);
    pb.draw.ctx.drawImage(
      imageObject,

      srcBounds.min.x, // source x
      srcBounds.min.y, // source y
      srcBounds.width, // source w
      srcBounds.height, // source h

      destBounds.min.x - tile.position.x, // dest x,
      destBounds.min.y - tile.position.y, // dest y,
      destBounds.width, // dest w
      destBounds.height // dest h
    );

    pb.draw.ctx.restore();
  };

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

  _context.drawTileTexture = drawTileTexture;
})(globalThis || window);
