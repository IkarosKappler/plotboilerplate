/**
 * @date 2026-04-15
 */

(function (_context) {
  var RAD2DEG = Math.PI / 180;

  _context.Math70 = function (config, inputPoints) {
    this.config = config;
    this.inputPoints = inputPoints;
  };

  /**
   * Convert an absolute X value to a relative horizontal box value.
   * Return value will be inside [-PI, PI] (if input point is inside box).
   *
   * @param {Bounds} box
   * @param {number} x
   * @returns
   */
  _context.Math70.prototype._absToRelX = function (box, x) {
    return (
      ((x - box.min.x) / box.width) * this.config.horizontalScale * Math.PI * 2 + this.config.horizontalOffset * RAD2DEG - Math.PI
    );
  };

  /**
   * Convert an absolute Y value to a relative vertical box value.
   * Return value will be inside [-PI, PI] (if input point is inside box).
   *
   * @param {Bounds} box
   * @param {number} y
   * @returns
   */
  _context.Math70.prototype._absToRelY = function (box, _y) {
    return (
      ((_y - box.min.y) / box.height) * this.config.verticalScale * Math.PI * 2 + this.config.verticalOffset * RAD2DEG - Math.PI
    );
  };

  /**
   * Convert an absolute point value to a relative box values.
   *
   * @param {Bounds} box
   * @param {Vertex} y
   * @returns
   */
  _context.Math70.prototype._absToRel = function (box, point) {
    return { x: this._absToRelX(box, point.x), y: this._absToRelY(box, point.y) };
  };

  /**
   * Build an object of function args compatible with Mathjs.
   * @param {*} box
   * @param {*} x
   * @param {*} y
   * @returns
   */
  _context.Math70.prototype.__mkFnArgs = function (box, x, y) {
    var relX = this._absToRelX(box, x);
    var relY = this._absToRelY(box, y);
    var fnArgs = {
      x: relX,
      y: relY,
      p: [relX, relY],
      horizontalScale: this.config.horizontalScale,
      verticalScale: this.config.verticalScale
    };
    for (var i = 0; i < this.inputPoints.length; i++) {
      var relInputPoint = this._absToRel(box, this.inputPoints[i]);
      fnArgs["x" + i] = relInputPoint.x;
      fnArgs["y" + i] = relInputPoint.y;
      fnArgs["p" + i] = [relInputPoint.x, relInputPoint.y];
    }
    return fnArgs;
  };

  _context.Math70.prototype.sinHorizontal = function (box) {
    var _self = this;
    var fn = this.__parseHorizontalFn();
    return function (x, _y) {
      // Map absolute to relative
      var fnArgs = _self.__mkFnArgs(box, x, _y);
      var relOut = fn.evaluate(fnArgs);
      // Map back to absolute
      return box.max.y - box.height * 0.5 - relOut * box.height * 0.5;
    };
  };

  _context.Math70.prototype.scale = function (scaleFactorX, scaleFactorY, func) {
    return function (x, y) {
      return func(x * scaleFactorX, scaleFactorY * y);
    };
  };

  _context.Math70.prototype.sinVertical = function (box) {
    var _self = this;
    var fn = this.__parseVerticalFn();
    return function (_x, y) {
      // Map absolute to relative
      var fnArgs = _self.__mkFnArgs(box, _x, y);
      var relOut = fn.evaluate(fnArgs);
      // Map back to absolute
      return box.max.x - box.width * 0.5 - relOut * box.width * 0.5;
    };
  };

  _context.Math70.prototype.__parseVerticalFn = function () {
    var parsed = math.parse(this.config.verticalFnTerm);
    return parsed;
  };

  _context.Math70.prototype.__parseHorizontalFn = function () {
    // console.log("Parse hori", this.config.horizontalFnTerm);
    var parsed = math.parse(this.config.horizontalFnTerm);
    return parsed;
  };
})(globalThis);
