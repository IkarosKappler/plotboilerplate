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
    return function (x) {
      // return box.max.y - box.height * 0.5 - Math.sin(((x - box.min.x) / box.width) * Math.PI * 2) * box.height * 0.5;
      return (
        box.max.y -
        box.height * 0.5 -
        Math.sin(((x - box.min.x) / box.width) * Math.PI * 2 + _self.config.horizontalOffset * RAD2DEG) * box.height * 0.5
      );
    };
  };

  _context.Math70.prototype.sinVertical = function (box) {
    var _self = this;
    return function (y) {
      return (
        box.max.x -
        box.width * 0.5 -
        Math.sin(((y - box.min.y) / box.height) * Math.PI * 2 + _self.config.verticalOffset * RAD2DEG) * box.width * 0.5
      );
    };
  };

  // _context.Math70.prototype.rotate = function (func, box) {
  //   return function (x) {
  //     return box.min.y + func(((x - box.x) / box.width) * box.height);
  //   };
  // };
})(globalThis);
