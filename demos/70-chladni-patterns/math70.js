/**
 * @date 2026-04-15
 */

(function (_context) {
  _context.Math70 = function (config) {
    this.config = config;
  };

  _context.Math70.prototype.sin = function (box) {
    return function (x) {
      return box.max.y - box.height * 0.5 - Math.sin(((x - box.min.x) / box.width) * Math.PI * 2) * box.height * 0.5;
    };
  };

  _context.Math70.prototype.sinVertical = function (box) {
    return function (y) {
      return box.max.x - box.width * 0.5 - Math.sin(((y - box.min.y) / box.height) * Math.PI * 2) * box.width * 0.5;
    };
  };

  // _context.Math70.prototype.rotate = function (func, box) {
  //   return function (x) {
  //     return box.min.y + func(((x - box.x) / box.width) * box.height);
  //   };
  // };
})(globalThis);
