/**
 * Draw the texture for the given tile.
 *
 * @author Ikaros Kappler
 * @date   2020-11-25
 **/

(function(_context) {
    "use strict";
    
    var drawTileTexture = function( pb, tile, imageObject ) {		
	pb.draw.ctx.save();

	var tileBounds = tile.getBounds();
	var scale = pb.draw.scale;
	var offset = pb.draw.offset;

	// The source bounds from the tile, scaled up to the given image's size.
	var srcBounds = new Bounds(
	    new Vertex( tile.textureSource.min.x * imageObject.width,
			tile.textureSource.min.y * imageObject.height
		      ),
	    new Vertex( tile.textureSource.max.x * imageObject.width,
			tile.textureSource.max.y * imageObject.height
		      )
	);

	// The destination bounds, scaled up to the current zoom level.
	var destBounds = new Bounds(
	    new Vertex( tile.baseBounds.min.x * scale.x,
			tile.baseBounds.min.y * scale.y 
		      ),
	    new Vertex( tile.baseBounds.max.x * scale.x,
			tile.baseBounds.max.y * scale.y 
		      )
	);

	clipPoly( pb.draw.ctx, pb.draw.offset, pb.draw.scale, tile.vertices );
	
	// Set offset and translation here.
	// Other ways we will not be able to rotate textures properly around the tile center.
	pb.draw.ctx.translate( offset.x + tile.position.x,
			       offset.y + tile.position.y
			     );
	pb.draw.ctx.rotate( tile.rotation );
	pb.draw.ctx.drawImage(
	    imageObject,
	    
	    srcBounds.min.x,  // source x
	    srcBounds.min.y,  // source y
	    srcBounds.width,  // source w
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
    var clipPoly = function( ctx, offset, scale, vertices ) {
	ctx.beginPath();
	// Set clip mask
	ctx.moveTo( offset.x + vertices[0].x * scale.x,
		    offset.y + vertices[0].y * scale.y );
	for( var i = 1; i < vertices.length; i++ ) {
	    var vert = vertices[i];
	    ctx.lineTo( offset.x + vert.x * scale.x,
			offset.y + vert.y * scale.y
		      );
	}
	ctx.closePath();
	ctx.clip();
    };

    _context.drawTileTexture = drawTileTexture;

})(globalThis || window);
