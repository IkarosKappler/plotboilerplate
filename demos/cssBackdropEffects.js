/**
 * Refactored from demo 54 and put into a global function.
 * @author   Ikaros Kappler
 * @date     2024-08-24
 * @modified 2024-10-08 Adding `cssBackdropFolder` as a class attribute.
 * @version  1.0.1
 *
 * @require createCanvasCover
 */

(function (_context) {
  // +---------------------------------------------------------------------------------
  // | A private function to update the css backdrop filter attribute.
  // +-------------------------------
  var updateBackdropFilter = function (effectsNode) {
    return function (newBackdropFilterString, config) {
      //   console.log("backdropFilter", newBackdropFilterString);
      if (config.isBackdropFiltersEnabled && config.isEffectsColorEnabled) {
        var colorParsed = Color.parse(config.effectFilterColor);
        colorParsed.setAlpha(config.opacity);
        effectsNode.style["background-color"] = colorParsed.cssRGBA();
      } else {
        effectsNode.style["background-color"] = "";
      }
      effectsNode.style["backdrop-filter"] = newBackdropFilterString;
    };
  };
  // END PRIVATE

  // +---------------------------------------------------------------------------------
  // | The exported constructor.
  // |
  // | @param {PlotBoilerplate} pb - The PlotboilerPlate instance to cover.
  // | @param {dat.GUI | lil-gui} initializingGUI - The GUI instance (might still be initializing inside pb).
  // | @param {CSSBackdropFilterParams} initialFilterValues
  // +-------------------------------
  var CSSBackdropEffects = function (pb, initializingGUI, initialFilterValues) {
    this.pb = pb;
    this.gui = initializingGUI;
    this.filterValues = null;
    this.cssBackdropFolder = null;
    this._initialize(initialFilterValues);
  };

  // Create a custom config for the after effects
  CSSBackdropEffects.DEFAULT_FILTER_VALUES = {
    // A global switch to enable/disable all filters
    isBackdropFiltersEnabled: true,
    // This is just for the global effect color
    effectFilterColor: "#204a87",
    isEffectsColorEnabled: false, // true,
    // These are real filter values
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
    saturate: 2.0,
    isSaturateEnabled: false
  };
  CSSBackdropEffects.prototype._initialize = function (initialFilterValues) {
    //   var pb = initializedPB;
    if (!createCanvasCover || typeof createCanvasCover === "undefined") {
      console.error(
        "[CSSBackdropEffects._initialize] Cannot create canvas cover: function `createCanvasCover` must be global (not found)."
      );
    }
    var effectsNode = createCanvasCover(this.pb.canvas);
    this.filterValues = initialFilterValues ? initialFilterValues : CSSBackdropEffects.DEFAULT_FILTER_VALUES;

    // +---------------------------------------------------------------------------------
    // | Initialize filter selector
    // +-------------------------------
    try {
      this.cssBackdropFolder = this.gui.addFolder("CSS Backdrop Filters");
      this.cssBackdropFolder.close();
      var triggerUpdateBackdropFilters = createCssBackdropFilterSelector(
        this.cssBackdropFolder,
        updateBackdropFilter(effectsNode),
        this.filterValues
      );
      triggerUpdateBackdropFilters();
    } catch (exc) {
      console.error(exc);
    }
  }; // END initialize

  globalThis.CSSBackdropEffects = CSSBackdropEffects;
})(globalThis);
