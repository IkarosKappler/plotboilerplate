/**
 * A quick and dirty hack for a preview component (showing all possible adjacent tile options).
 *
 * @requires SVGBuilder
 *
 * @author Ikaros Kappler
 * @date   2020-11-25
 */

(function(_context) {
    
    // +---------------------------------------------------------------------------------
    // | Build a preview of all available tiles.
    // |
    // | @param {GirihTile[]} tiles - An array containing all possible adjacent tiles.
    // | @param {number} pointer - The current tile pointer (index of highlighted preview tile).
    // | @param {function} setPreviewTilePointer - A function expecting the new highlighted preview tile index.
    // +-------------------------------
    var createAdjacentTilePreview = function( tiles, pointer, setPreviewTilePointer ) {
	var container = document.querySelector('.wrapper-bottom');
	while(container.firstChild){
	    container.removeChild( container.firstChild );
	}

	var svgBuilder = new SVGBuilder();
	for( var i in tiles ) {
	    var tile = tiles[i].clone();
	    tile.move( tile.position.clone().inv() );
	    var bounds = tile.getBounds();
	    
	    var svgString = svgBuilder.build( [tile],
					      { canvasSize : { width : bounds.width/2, height : bounds.height/2 },
						zoom : { x:0.333, y:0.333 },
						offset: { x:bounds.width*0.666 , y:bounds.height * 0.666 }
					      }
					    );
	    var node = document.createElement('div');
	    node.classList.add('preview-wrapper');
	    node.dataset.tileIndex = i;
	    node.addEventListener('click', (function(tileIndex) {
		return function(event) {
		    // previewTilePointer = tileIndex;
		    setPreviewTilePointer(tileIndex);
		    highlightPreviewTile(tileIndex);
		};
	    })(i) );
	    node.innerHTML = svgString;
	    container.appendChild( node );
	}

	highlightPreviewTile( pointer );
    };

    var highlightPreviewTile = function( pointer ) {
	var nodes = document.querySelectorAll('.wrapper-bottom .preview-wrapper');
	for( var i = 0; i < nodes.length; i++ ) {
	    var node = nodes[i];
	    if( node.dataset && node.dataset.tileIndex == pointer ) {
		node.classList.add( 'highlighted-preview-tile' );
	    } else {
		node.classList.remove( 'highlighted-preview-tile' );
	    }
	}
    };

    _context.createAdjacentTilePreview = createAdjacentTilePreview;
    _context.highlightPreviewTile = highlightPreviewTile;

})(globalThis || window );
