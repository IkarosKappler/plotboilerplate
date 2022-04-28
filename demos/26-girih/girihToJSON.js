/**
 * @author   Ikaros Kappler
 * @date     2022-02-04
 * @modified 2022-02-25 Fixed the whole fromJSON part.
 * @version  1.0.1
 */

globalThis.girihToJSON =
  globalThis.girihToJSON ||
  (function () {
    var gtj = function (girihTiles) {
      // Convert Girih tiles to a JSON object

      var data = girihTiles.map(function (tile) {
        // Convert
        return {
          tileType: tile.tileType,
          position: { x: tile.position.x, y: tile.position.y },
          rotation: tile.rotation,
          edgeLength: tile.edgeLength // Must be equal for all tiles!
        };
      });

      return JSON.stringify(data);
    };

    return gtj;
  })();

globalThis.girihFromJSON =
  globalThis.girihFromJSON ||
  (function () {
    function createFromDataElement(elem) {
      // Convert the JSON position to a plotboilerplate.Vertex
      var pos = new Vertex(elem.position);
      switch (elem.tileType) {
        case TileType.DECAGON:
          return new GirihDecagon(pos, elem.edgeLength);
        case TileType.PENTAGON:
          return new GirihPentagon(pos, elem.edgeLength);
        case TileType.IRREGULAR_HEXAGON:
          return new GirihHexagon(pos, elem.edgeLength);
        case TileType.RHOMBUS:
          return new GirihRhombus(pos, elem.edgeLength);
        case TileType.BOW_TIE:
          return new GirihBowtie(pos, elem.edgeLength);
        case TileType.PENROSE_RHOMBUS:
          return new GirihPenroseRhombus(pos, elem.edgeLength);
        default:
          return null;
      }
    }

    // Data should be an array of girih settings
    var gfj = function (data) {
      // Convert Girih tiles to a JSON object

      var girihTiles = data.map(function (elem) {
        var tile = createFromDataElement(elem);
        if (tile) {
          tile.rotate(elem.rotation);
        }
        return tile;
      });

      return girihTiles;
    };

    return gfj;
  })();
