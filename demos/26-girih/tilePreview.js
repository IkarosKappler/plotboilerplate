/**
 * A quick and dirty hack for a preview component (showing all possible adjacent tile options).
 *
 * @author   Ikaros Kappler
 * @modified 2022-02-04 Replaced SVGBuilder by proper svg drawing. (SVGBuilder was dropped on feb 4 2022)
 * @date     2020-11-25
 */

(function (_context) {
  // +---------------------------------------------------------------------------------
  // | Build a preview of all available tiles.
  // |
  // | @param {GirihTile[]} tiles - An array containing all possible adjacent tiles.
  // | @param {number} pointer - The current tile pointer (index of highlighted preview tile).
  // | @param {function} setPreviewTilePointer - A function expecting the new highlighted preview tile index.
  // +-------------------------------
  var createAdjacentTilePreview = function (tiles, pointer, setPreviewTilePointer, pb) {
    var container = document.querySelector(".wrapper-bottom");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    for (var i in tiles) {
      var tile = tiles[i].clone();
      tile.move(tile.position.clone().inv());
      var bounds = tile.getBounds();

      // Create a new SVG renderer.
      var svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      var tosvgDraw = new drawutilssvg(
        svgNode,
        { x: bounds.width / 4, y: bounds.height / 4 }, // offset,
        { x: 0.333, y: 0.333 }, // scale,
        { width: bounds.width / 2, height: bounds.height / 2 }, // canvasSize,
        false, // fillShapes=false
        pb.drawConfig
      );
      var tosvgFill = tosvgDraw.copyInstance(true); // fillShapes=true
      var drawCycle = 0;

      var drawCycle = 0;
      tosvgDraw.beginDrawCycle(drawCycle);
      tosvgFill.beginDrawCycle(drawCycle);
      tosvgDraw.clear(pb.config.backgroundColor);
      // Add a background for highlight the selected
      tosvgFill.curClassName = "tile-background";
      tosvgFill.rect(bounds.min, bounds.width, bounds.height, "rgba(0,255,0," + (pointer == i ? 0.25 : 0.0) + ")", 2);
      tosvgFill.curClassName = null;
      tosvgDraw.polygon(tile, "green", 2);
      tosvgDraw.endDrawCycle(drawCycle);
      tosvgFill.endDrawCycle(drawCycle);

      var node = document.createElement("div");
      node.classList.add("preview-wrapper");
      node.dataset.tileIndex = i;
      node.addEventListener(
        "click",
        (function (tileIndex) {
          return function (_event) {
            setPreviewTilePointer(tileIndex);
            highlightPreviewTile(tileIndex, pb);
          };
        })(i)
      );
      //   node.innerHTML = svgString;
      node.appendChild(svgNode);
      container.appendChild(node);
    }

    highlightPreviewTile(pointer, pb);
  };

  // +---------------------------------------------------------------------------------
  // | Helper function: highlight the preview tile at the given index.
  // |
  // | @param {number} pointer - The tile pointer (index of highlighted preview tile).
  // +-------------------------------
  var highlightPreviewTile = function (pointer, pb) {
    var nodes = document.querySelectorAll(".wrapper-bottom .preview-wrapper");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.dataset && Number(node.dataset["tileIndex"]) === pointer) {
        node.classList.add("highlighted-preview-tile");
        node.querySelectorAll(".tile-background")[0].setAttribute("fill", "rgba(0,255,0,0.25)");
      } else {
        node.classList.remove("highlighted-preview-tile");
        node.querySelectorAll(".tile-background")[0].setAttribute("fill", pb.config.backgroundColor);
      }
    }
  };

  _context.createAdjacentTilePreview = createAdjacentTilePreview;
  _context.highlightPreviewTile = highlightPreviewTile;
})(globalThis || window);
