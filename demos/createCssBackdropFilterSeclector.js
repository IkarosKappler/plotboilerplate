/**
 *
 * Requires number-with-checkbox extension.
 *
 * @date 2024-07-14
 */

(function (_context) {
  var ratio2pct = function (ratio) {
    return "" + ratio * 100.0 + "%";
  };

  var getBackdropFilterString = function (config, onBackdropStringChange) {
    // console.log("getOpacityPct", ratio2pct(config.opacity));
    // console.log("config", config);
    var buffer = [];
    if (config.isBlurEnabled) {
      buffer.push("invert(" + ratio2pct(config.invert) + ")");
    }
    if (config.isSepiaEnabled) {
      buffer.push("sepia(" + ratio2pct(config.sepia) + ")");
    }
    if (config.isBlurEnabled) {
      buffer.push("blur(" + config.blur + "px)");
    }
    if (config.isBrightnessEnabled) {
      buffer.push("brightness(" + ratio2pct(config.brightness) + ")");
    }
    if (config.isContrastEnabled) {
      buffer.push("contrast(" + ratio2pct(config.contrast) + ")");
    }
    if (config.isDropShaowEnabled) {
      // TODO: use more elaborate version of drop-shadow?
      buffer.push("drop-shadow(" + config.dropShadow + "px " + config.dropShadow + "px)");
    }
    if (config.isGrayscaleEnabled) {
      buffer.push("grayscale(" + ratio2pct(config.grayscale) + ")");
    }
    if (config.isHueRotateEnabled) {
      buffer.push("hue-rotate(" + config.hueRotate + "deg)");
    }
    if (config.isInvertEnabled) {
      buffer.push("invert(" + ratio2pct(config.invert) + ")");
    }
    if (config.isOpacityEnabled) {
      buffer.push("opacity(" + ratio2pct(config.opacity) + ")");
    }
    if (config.isSaturateEnabled) {
      buffer.push("saturate(" + ratio2pct(config.saturate) + ")");
    }

    return buffer.length === 0 ? "none" : buffer.join(" ");
  };

  var fireBackdropStringChange = function (config, onBackdropStringChange) {
    var newBackdropString = getBackdropFilterString(config, onBackdropStringChange);
    onBackdropStringChange(newBackdropString, config);
  };

  var createDefaultConfig = function () {
    return {
      opacity: 0.5,
      isOpacityEnabled: false,
      invert: 0.8,
      isInvertEnabled: false,
      sepia: 0.9,
      isSepiaEnabled: false,
      blur: 2, // px
      isBlurEnabled: false,
      brightness: 0.6,
      isBrightnessEnabled: false,
      contrast: 0.9,
      isContrastEnabled: false,
      dropShadow: 4, // px
      dropShadowColor: "#00ffff", // HOW TO DISABLE THIS PROPERLY
      isDropShadowEnabled: false,
      grayscale: 0.3,
      isGrayscaleEnabled: false,
      hueRotate: 120, // deg
      isHueRotateEnabled: false,
      invert: 0.7,
      isInvertEnabled: false,
      saturate: 1.0,
      isSaturateEnabled: false
    };
  };

  _context.createCssBackdropFilterSelector = function (guiFolder, onBackdropStringChange) {
    var config = createDefaultConfig();

    var handleChange = function (newValue, filterEnabled) {
      //   console.log("New value", newValue, filterEnabled);
      fireBackdropStringChange(config, onBackdropStringChange);
    };

    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "opacity", "isOpacityEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("opacity").title("opacity");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "invert", "isInvertEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("invert").title("invert");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "sepia", "isSepiaEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("sepia").title("sepia");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "blur", "isBlurEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("blur").title("blur");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "brightness", "isBrightnessEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("brightness").title("brightness");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "contrast", "isContrastEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("contrast").title("contrast");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "dropShadow", "isDropShadowEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("dropShadow").title("dropShadow");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "grayscale", "isGrayscaleEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("grayscale").title("grayscale");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "hueRotate", "isHueRotateEnabled").onChange(handleChange)
        .min(0).max(360).step(1).name("hueRotate").title("hueRotate");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "invert", "isInvertEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("invert").title("invert");
    // prettier-ignore
    guiFolder
        .addNumberWithCheckbox(config, "saturate", "isSaturateEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("saturate").title("saturate");

    return handleChange;
  }; // END funcition createCssBackdropFilterSelector

  console.log("createCssBackdropFilterSelector", createCssBackdropFilterSelector);
})(globalThis);
