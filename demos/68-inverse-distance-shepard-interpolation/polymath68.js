/**
 * @date 2025-12-15
 */

(function (_context) {
  _context.PolyMath68 = function (viewport, config, points) {
    this.viewport = viewport;
    this.config = config;
    this.points = points;
  };

  _context.PolyMath68.prototype.IDW = function () {
    const _self = this;
    return function (x) {
      var pow = _self.config.pow; // 2.0
      var numerator = 0.0;
      var denominator = 0.0;
      for (var j = 0; j < _self.points.length; j++) {
        var distanceJSquared = Math.pow(Math.abs(_self.points[j].x - x), pow);
        numerator += (_self.lagrange(j)(x) * _self.points[j].y) / distanceJSquared;
        denominator += 1.0 / distanceJSquared;
      }
      return numerator / denominator;
    };
  };

  _context.PolyMath68.prototype.naiveIDW = function () {
    const _self = this;
    return function (x) {
      var sum = 0.0;
      for (var j = 0; j < _self.points.length; j++) {
        sum += _self.scaleY(_self.points[j].y, _self.distanceWeight(j, _self.lagrange(j)))(x);
      }
      return sum;
    };
  };

  _context.PolyMath68.prototype.linearInterpolation = function () {
    const _self = this;
    return function (x) {
      var sum = 0.0;
      for (var j = 0; j < _self.points.length; j++) {
        sum += _self.linearSegmentInterpolation(j)(x);
      }
      return sum;
    };
  };

  _context.PolyMath68.prototype.linearSegmentInterpolation = function (segmentIndex) {
    const _self = this;
    return function (x) {
      if (segmentIndex < 0 || segmentIndex + 1 >= _self.points.length) {
        return 0.0;
      }
      var segmentStart = _self.points[segmentIndex];
      var segmentEnd = _self.points[segmentIndex + 1];
      var ratio = (x - segmentStart.x) / (segmentEnd.x - segmentStart.x);
      if (segmentStart.x < x || segmentEnd.x >= x) {
        console.log("Viewport", _self.viewport.min.x, _self.viewport.max.x, "ratio", ratio, "x", x);
        if (ratio > 0.3 && ratio <= 0.6) {
          console.log("Jo", "segmentIndex", segmentIndex, "segmentStart.x", segmentStart.x, "segmentEnd.x", segmentEnd.x);
        }
        return 0.0;
      }
      console.log("JAAAAAA", ratio);
      return segmentStart.y + (segmentEnd.y - segmentStart.y) * ratio;
    };
  };

  _context.PolyMath68.prototype.distanceWeight = function (k, func) {
    const _self = this;
    return function (x) {
      // var relX = (x - viewport.min.x) / viewport.width;
      // var relkX = (points[k].x - viewport.min.x) / viewport.width;
      // return (1 / (1 + Math.pow(relkX - relX, 2))) * func(x);
      var pow = _self.config.pow; // 2.0
      var width = _self.viewport.width / 2.0; // 20.0;
      return (width / (width + Math.pow(Math.abs(_self.points[k].x - x), pow))) * func(x);
    };
  };

  _context.PolyMath68.prototype.sin = function (box) {
    return function (x) {
      return (Math.sin((x / box.width) * Math.PI * 2) * box.height) / 2;
    };
  };

  _context.PolyMath68.prototype.scaleY = function (yFactor, func) {
    return function (x) {
      return yFactor * func(x);
    };
  };

  _context.PolyMath68.prototype.lagrange = function (j) {
    const _self = this;

    return function (x) {
      var result = 1.0;
      for (var m = 0; m < _self.points.length; m++) {
        if (m != j) {
          result *= (x - _self.points[m].x) / (_self.points[j].x - _self.points[m].x);
        }
      }
      return result;
    };
  };

  // var orthonormal0 = function (x) {
  //   var result = 0.0;
  //   for (var j = 0; j < points.length; j++) {
  //     result += points[j].y * lagrange(j)(x);
  //   }
  //   return result;
  // };

  // var lagrange = function (j, x) {
  //   var result = 1.0;
  //   // var n = 3;
  //   for (var m = 0; m < points.length; m++) {
  //     if (m != j) {
  //       result *= (x - points[m].x) / (points[j].x - points[m].x);
  //     }
  //   }
  //   return result;
  // };
})(globalThis);
