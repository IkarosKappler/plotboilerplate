/**
 * Generates a set of GUI input options for backdrop-filter CSS options.
 *
 * Requires lil-gui's number-with-checkbox and color-with-checkbox extension.
 *
 * @author  Ikaros Kappler
 * @date    2024-07-14
 * @version 1.0.0
 */

(function (_context) {
  // +---------------------------------------------------------------------------------
  // | Convert values in [0..1] to [0..100].
  // +-------------------------------
  var ratio2pct = function (ratio) {
    return "" + ratio * 100.0 + "%";
  };

  // +---------------------------------------------------------------------------------
  // | Generate a CSS backdrop-filter string from the given values.
  // | Consult the docs for possible values:
  // |    https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
  // +-------------------------------
  var getBackdropFilterString = function (config) {
    if (!config.isBackdropFiltersEnabled) {
      // Just return an empty string if all elements are globally disabled (by checkbox)
      return "";
    }
    var buffer = [];
    if (config.isOpacityEnabled) {
      buffer.push("opacity(" + ratio2pct(config.opacity) + ")");
    }
    if (config.isInvertEnabled) {
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
    if (config.isDropShadowEnabled) {
      // TODO: use more elaborate version of drop-shadow?
      buffer.push("drop-shadow(" + config.dropShadow + "px " + config.dropShadow + "px 4px " + config.dropShadowColor + ")");
      console.log(
        "dsc",
        "drop-shadow(" + config.dropShadow + "px " + config.dropShadow + "px 4px " + config.dropShadowColor + ")"
      );
    }
    if (config.isGrayscaleEnabled) {
      buffer.push("grayscale(" + ratio2pct(config.grayscale) + ")");
    }
    if (config.isHueRotateEnabled) {
      buffer.push("hue-rotate(" + config.hueRotate + "deg)");
    }
    if (config.isSaturateEnabled) {
      buffer.push("saturate(" + ratio2pct(config.saturate) + ")");
    }

    return buffer.length === 0 ? "none" : buffer.join(" ");
  };

  // +---------------------------------------------------------------------------------
  // | Fire the callback on changes.
  // +-------------------------------
  var fireBackdropStringChange = function (config, onBackdropStringChange) {
    var newBackdropString = getBackdropFilterString(config);
    onBackdropStringChange(newBackdropString, config);
  };

  // +---------------------------------------------------------------------------------
  // | Try to get a string value or fallback from an object.
  // +-------------------------------
  var _getString = function (config, name, fallback) {
    return typeof config[name] === "string" ? config[name] : fallback;
  };

  // +---------------------------------------------------------------------------------
  // | Try to get a boolean value or fallback from an object.
  // +-------------------------------
  var _getBoolean = function (config, name, fallback) {
    return typeof config[name] === "boolean" ? config[name] : fallback;
  };

  // +---------------------------------------------------------------------------------
  // | Try to get a numeric value or fallback from an object.
  // +-------------------------------
  var _getNumber = function (config, name, fallback) {
    return typeof config[name] == "number" ? config[name] : fallback;
  };

  // +---------------------------------------------------------------------------------
  // | Initialize the config and try to retrieve initial values passed by the user.
  // +-------------------------------
  var createDefaultConfig = function (initialFilterValues) {
    // return {
    //   isBackdropFiltersEnabled: _getBoolean(initialFilterValues, "isBackdropFiltersEnabled", false),
    //   // This is just for the global effect color
    //   effectFilterColor: _getString(initialFilterValues, "effectFilterColor", "#204a87"),
    //   isEffectsColorEnabled: _getBoolean(initialFilterValues, "isEffectsColorEnabled", false),
    //   // These are real filter values
    //   opacity: _getNumber(initialFilterValues, "opacity", 0.5),
    //   isOpacityEnabled: _getBoolean(initialFilterValues, "isOpacityEnabled", false),
    //   invert: _getNumber(initialFilterValues, "invert", 0.8),
    //   isInvertEnabled: _getBoolean(initialFilterValues, "isInvertEnabled", false),
    //   sepia: _getNumber(initialFilterValues, "sepia", 0.9),
    //   isSepiaEnabled: _getBoolean(initialFilterValues, "isSepiaEnabled", false),
    //   blur: _getNumber(initialFilterValues, "blur", 2), // px
    //   isBlurEnabled: _getBoolean(initialFilterValues, "isBlurEnabled", false),
    //   brightness: _getNumber(initialFilterValues, "brightness", 0.6),
    //   isBrightnessEnabled: _getBoolean(initialFilterValues, "isBrightnessEnabled", false),
    //   contrast: _getNumber(initialFilterValues, "contrast", 0.9),
    //   isContrastEnabled: _getBoolean(initialFilterValues, "isContrastEnabled", false),
    //   dropShadow: _getNumber(initialFilterValues, "dropShadow", 4), // px
    //   dropShadowColor: "#00ffff", // HOW TO DISABLE THIS PROPERLY
    //   isDropShadowEnabled: _getBoolean(initialFilterValues, "isDropShadowEnabled", false),
    //   grayscale: _getNumber(initialFilterValues, "grayscale", 0.3),
    //   isGrayscaleEnabled: _getBoolean(initialFilterValues, "isGrayscaleEnabled", false),
    //   hueRotate: _getNumber(initialFilterValues, "hueRotate", 120), // deg
    //   isHueRotateEnabled: _getBoolean(initialFilterValues, "isHueRotateEnabled", false),
    //   saturate: _getNumber(initialFilterValues, "saturate", 2.0),
    //   isSaturateEnabled: _getBoolean(initialFilterValues, "isSaturateEnabled", false)
    // };
    initialFilterValues.isBackdropFiltersEnabled = _getBoolean(initialFilterValues, "isBackdropFiltersEnabled", false);
    // This is just for the global effect color
    initialFilterValues.effectFilterColor = _getString(initialFilterValues, "effectFilterColor", "#204a87");
    initialFilterValues.isEffectsColorEnabled = _getBoolean(initialFilterValues, "isEffectsColorEnabled", false);
    // These are real filter values
    initialFilterValues.opacity = _getNumber(initialFilterValues, "opacity", 0.5);
    initialFilterValues.isOpacityEnabled = _getBoolean(initialFilterValues, "isOpacityEnabled", false);
    initialFilterValues.invert = _getNumber(initialFilterValues, "invert", 0.8);
    initialFilterValues.isInvertEnabled = _getBoolean(initialFilterValues, "isInvertEnabled", false);
    initialFilterValues.sepia = _getNumber(initialFilterValues, "sepia", 0.9);
    initialFilterValues.isSepiaEnabled = _getBoolean(initialFilterValues, "isSepiaEnabled", false);
    initialFilterValues.blur = _getNumber(initialFilterValues, "blur", 2); // px
    initialFilterValues.isBlurEnabled = _getBoolean(initialFilterValues, "isBlurEnabled", false);
    initialFilterValues.brightness = _getNumber(initialFilterValues, "brightness", 0.6);
    initialFilterValues.isBrightnessEnabled = _getBoolean(initialFilterValues, "isBrightnessEnabled", false);
    initialFilterValues.contrast = _getNumber(initialFilterValues, "contrast", 0.9);
    initialFilterValues.isContrastEnabled = _getBoolean(initialFilterValues, "isContrastEnabled", false);
    initialFilterValues.dropShadow = _getNumber(initialFilterValues, "dropShadow", 4); // px
    initialFilterValues.dropShadowColor = "#00ffff"; // HOW TO DISABLE THIS PROPERLY
    initialFilterValues.isDropShadowEnabled = _getBoolean(initialFilterValues, "isDropShadowEnabled", false);
    initialFilterValues.grayscale = _getNumber(initialFilterValues, "grayscale", 0.3);
    initialFilterValues.isGrayscaleEnabled = _getBoolean(initialFilterValues, "isGrayscaleEnabled", false);
    initialFilterValues.hueRotate = _getNumber(initialFilterValues, "hueRotate", 120); // deg
    initialFilterValues.isHueRotateEnabled = _getBoolean(initialFilterValues, "isHueRotateEnabled", false);
    initialFilterValues.saturate = _getNumber(initialFilterValues, "saturate", 2.0);
    initialFilterValues.isSaturateEnabled = _getBoolean(initialFilterValues, "isSaturateEnabled", false);
    return initialFilterValues;
  };

  // +---------------------------------------------------------------------------------
  // | This is the actual exported function.
  // | @param {lil-gui.GUI} guiFolder - The folder to add the controls to.
  // | @param {function(newBackdropFilterString, config)} onBackdropStringChange - A callback to retrieve changes.
  // | @param {object} initialFilterValues - [optional] An object with initial backdrop-filter values.
  // +-------------------------------
  _context.createCssBackdropFilterSelector = function (guiFolder, onBackdropStringChange, initialFilterValues) {
    var config = createDefaultConfig(initialFilterValues || {});

    var inputElements = []; // Array<Controller>
    var inputElementsEnabledKeys = []; // Array<String>

    var handleChange = function (_newValue, _filterEnabled) {
      //   console.log("New value", newValue, filterEnabled);
      fireBackdropStringChange(config, onBackdropStringChange);
    };

    var handleEnableDisableAll = function (isBackdropFiltersEnabled) {
      // console.log("New enabled?", isBackdropFiltersEnabled);
      for (var i = 0; i < inputElements.length; i++) {
        // var keyName = inputElementsEnabledKeys[i];
        if (isBackdropFiltersEnabled) {
          inputElements[i].enable();
        } else {
          inputElements[i].disable();
        }
      }
      handleChange(false, false);
    };

    // GLOBAL ON/OFF SWITCH
    // prettier-ignore
    guiFolder
      .add(config, "isBackdropFiltersEnabled", "isBackdropFiltersEnabled")
      .onChange(handleEnableDisableAll);

    // prettier-ignore
    var cntrlr = guiFolder
      .addColorWithCheckbox(config, "effectFilterColor", "isEffectsColorEnabled")
      .onChange(handleChange);
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isEffectsColorEnabled");
    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "opacity", "isOpacityEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("opacity").title("opacity");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isOpacityEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "invert", "isInvertEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("invert").title("invert");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isInvertEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "sepia", "isSepiaEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("sepia").title("sepia");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isSepiaEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "blur", "isBlurEnabled").onChange(handleChange)
        .min(0.0).max(10.0).step(0.01).name("blur px").title("blur px");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isBlurEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "brightness", "isBrightnessEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("brightness").title("brightness");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isBrightnessEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "contrast", "isContrastEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("contrast").title("contrast");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isContrastEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "dropShadow", "isDropShadowEnabled").onChange(handleChange)
        .min(0).max(20).step(1).name("dropShadow px").title("dropShadow px").disable();
    // inputElements.push(cntrlr);

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "grayscale", "isGrayscaleEnabled").onChange(handleChange)
        .min(0.0).max(1.0).step(0.01).name("grayscale").title("grayscale");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isGrayscaleEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "hueRotate", "isHueRotateEnabled").onChange(handleChange)
        .min(0).max(360).step(1).name("hueRotate °").title("hueRotate °");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isHueRotateEnabled");

    // prettier-ignore
    cntrlr = guiFolder
        .addNumberWithCheckbox(config, "saturate", "isSaturateEnabled").onChange(handleChange)
        .min(0.0).max(10.0).step(0.01).name("saturate").title("saturate");
    inputElements.push(cntrlr);
    inputElementsEnabledKeys.push("isSaturateEnabled");

    handleEnableDisableAll(config.isBackdropFiltersEnabled);

    return handleChange;
  }; // END funcition createCssBackdropFilterSelector
})(globalThis);
