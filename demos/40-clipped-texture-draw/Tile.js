/**
 * Just a simple testing class for geometric tiles.
 *
 * @author  Ikaros Kappler
 * @date    2022-03-28
 * @version 1.0.0
 */

globalThis.Tile = (function () {
  var Tile = function (basePolygon, center) {
    this.basePolygon = basePolygon;
    this.center = center;
    this.rotation = 0.0;
  };

  return Tile;
})();
