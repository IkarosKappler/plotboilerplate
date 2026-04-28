/**
 * @date 2026-04-15
 */

(function (_context) {
  var RAD2DEG = Math.PI / 180;

  _context.Math70 = function (config) {
    this.config = config;
  };

  _context.Math70.prototype.sin = function (box) {
    var _self = this;
    return function (x, _y) {
      // return box.max.y - box.height * 0.5 - Math.sin(((x - box.min.x) / box.width) * Math.PI * 2) * box.height * 0.5;
      // Map absolute to relative
      var relX = ((x - box.min.x) / box.width) * Math.PI * 2 + _self.config.horizontalOffset * RAD2DEG;
      // Calculate function
      var relY = Math.sin(relX) * Math.cos(relX * 0.25);
      // Map back to absolute
      return box.max.y - box.height * 0.5 - relY * box.height * 0.5;
      // return box.max.y - box.height * 0.5 - Math.sin(relX) * Math.cos(relX * 0.25) * box.height * 0.5;
    };
  };

  _context.Math70.prototype.scale = function (scaleFactorX, scaleFactorY, func) {
    return function (x, y) {
      return func(x * scaleFactorX, scaleFactorY * y);
    };
  };

  _context.Math70.prototype.sinVertical = function (box) {
    var _self = this;
    return function (_x, y) {
      // Map absolute to relative
      var relY = ((y - box.min.y) / box.height) * Math.PI * 2 + _self.config.verticalOffset * RAD2DEG;
      // Calculate function
      var relX = Math.sin(relY) * Math.cos(relY * 0.5);
      // Map back to absolute
      return box.max.x - box.width * 0.5 - relX * box.width * 0.5;
      // return box.max.x - box.width * 0.5 - Math.sin(relY) * Math.cos(relY * 0.5) * box.width * 0.5;
    };
  };
})(globalThis);
