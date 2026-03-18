/**
 * A 1/2/3 dimensional color gradient? – experimental implementation.
 *
 * @require Color
 * @require ColorGraidient
 *
 * @date 2025-11-26
 * @author Ika
 */

(function (_context) {
  var ColorSpace2d = function (bounds3d) {
    this.bounds = bounds3d;
    this.colorGradient = new ColorGradient(ColorGradient.DEFAULT_COLORSET);
  };

  ColorSpace2d.prototype.getColorAt = function (x, y, z) {
    var ratio = (this.bounds.max.z - z) / (this.bounds.max.z - this.bounds.min.z);
    var ratio_wrapped = Math.min(1.0, Math.max(0.0, ratio));
    // console.log(
    //   "min",
    //   this.bounds.min,
    //   "max",
    //   this.bounds.max,
    //   "ratio_wrapped",
    //   ratio_wrapped,
    //   "ratio",
    //   ratio,
    //   "z",
    //   z,
    //   this.colorGradient.getColorAt(ratio).cssRGB()
    // );
    return this.colorGradient.getColorAt(ratio_wrapped);
  };

  _context.ColorSpace2d = ColorSpace2d;
})(globalThis);
