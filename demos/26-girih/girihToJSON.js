/**
 * @author  Ikaros Kappler
 * @date    2022-02-04
 * @version 1.0.0
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

      console.log("toJson", data);
      return JSON.stringify(data);
    };

    return gtj;
  })();

//   export enum TileType {
//     UNKNOWN            = "UNKNOWN",
//     DECAGON            = "DECAGON",
//     PENTAGON           = "PENTAGON",
//     IRREGULAR_HEXAGON  = "IRREGULAR_HEXAGON",
//     RHOMBUS            = "RHOMBUS",
//     BOW_TIE            = "BOW_TIE",
//     // This is not part of the actual girih tile set!
//     PENROSE_RHOMBUS    = "PENROSE_RHOMBUS"
// };

globalThis.girihFromJSON =
  globalThis.girihFromJSON ||
  (function () {
    function createFromDataElement(elem) {
      switch (elem.tileType) {
        case TileType.DECAGON:
          return new GirihDecagon(elem.position, elem.edgeLength);
        case TileType.PENTAGON:
          return new Girihtagon(elem.position, elem.edgeLength);
        case TileType.IRREGULAR_HEXAGON:
          return new GirihHexagon(elem.position, elem.edgeLength);
        case TileType.RHOMBUS:
          return new GirihRhombus(elem.position, elem.edgeLength);
        case TileType.BOW_TIE:
          return new GirihBowtie(elem.position, elem.edgeLength);
        case TileType.PENROSE_RHOMBUS:
          return new GirihRhombus(elem.position, elem.edgeLength);
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
          tile.rotation = elem.rotation;
        }
        return tile;
      });

      return girihTiles;
    };

    return gfj;
  })();
