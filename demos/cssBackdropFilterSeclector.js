/**
 *
 * Requires number-with-checkbox extension.
 *
 * @date 2024-07-14
 */

(function (_context) {
  _context.createBackdropFilterSelector = function (guiFolder) {
    var config = {
      opactiy: 0.5,
      opacityEnabled: false,
      invert: 0.8,
      invertEnabled: false,
      sepia: 0.9,
      sepiaEnabled: false,
      blur: 2, // px
      blurEnabled: false,
      brightness: 0.6,
      brightnessEnabled: false,
      dropShadow: 4, // px
      dropShadowColor: "#00ffff", // HOW TO DISABLE THIS PROPERLY
      dropShaowEnabled: false,
      grayscale: 0.3,
      grayscaleEnabled: false,
      hueRotate: 120, // deg
      hueRotateEnabled: false,
      invert: 0.7,
      invertEnabled: false,
      saturate: 1.0,
      saturateEnabled: false
    };
    // console.log("getOpacityPct", getOpacityPct());
    // var buffer = [];
    // // buffer.push("blur(5px)");
    // buffer.push("invert(80%)");
    // buffer.push("sepia(90%)");
    // buffer.push("blur(2px)");
    // // buffer.push("brightness(60%)");
    // buffer.push("contrast(90%)");
    // // buffer.push("drop-shadow(4px 4px 10px blue)");
    // // buffer.push("grayscale(30%)");
    // // buffer.push("hue-rotate(120deg)");
    // // buffer.push("invert(70%)");
    // // buffer.push("opacity(20%)");
    // buffer.push("opacity(" + getOpacityPct() + ")");
    // // buffer.push("sepia(90%)");
    // buffer.push("saturate(100%)");

    // return buffer.join(" ");
    // }
  };
})(globalThis);
