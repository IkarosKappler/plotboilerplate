/**
 * A script to demonstrate how to construct 2D metaballs with PlotBoilerplate.
 *
 * Note there are some edge cases where the calculation is locally not working correctly.
 *
 * @requires PlotBoilerplate
 * @requires Color
 * @requires gup
 * @requires lil-gui
 *
 * @author   Ikaros Kappler
 * @date     2024-02-06
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Do this BEFORE the main script is triggered by the LOAD event
  // var urlParams = new URLSearchParams(window.location.search);
  // urlParams.set("filter:blur", "10");
  // document.location.search = urlParams;

  globalThis["cssBackdropfilterValues"] = {
    blur: 10,
    isBlurEnabled: true,
    brightness: 0.75,
    isBrightnessEnabled: true,
    saturate: 9.0,
    isSaturateEnabled: true
  };

  window.addEventListener("load", function () {
    // Create a custom config for the after effects

    globalThis.demoInitializationObserver
      .waitForInitialized()
      .then(function (_initializedPB) {
        console.log(globalThis.utils["cssBackdropEffects"]);
        globalThis.utils["cssBackdropEffects"].cssBackdropFolder.open();
        // globalThis.utils["cssBackdropEffects"].filterValues.blur = 10;
        // globalThis.utils["cssBackdropEffects"].filterValues.isBlurEnabled = true;
        // Usually we would add backdrop filters explicitly with the following code.
        // But just by adding the required
        //
        //  * function `createCssBackdropFilterSelector` and
        //  * class `CSSBackdropEffects`
        // the filter will be automatically available!
        // var backdropEffects = new CSSBackdropEffects(
        //   initializedPB,
        //   initializedPB.getGUI(),
        //   { isBackdropFiltersEnabled: false } // CSSBackdropEffects.DEFAULT_FILTER_VALUES
        // );
        //
        //
        // Filter values may look like this (interface `CSSBackdropFilterParams`)
        // var initialFilterValues = {
        //   // This is just for the global effect color
        //   effectFilterColor: "#204a87",
        //   isEffectsColorEnabled: true,
        //   // These are real filter values
        //   opacity: 0.5,
        //   isOpacityEnabled: false,
        //   invert: 0.8,
        //   isInvertEnabled: false,
        //   sepia: 0.9,
        //   isSepiaEnabled: false,
        //   blur: 2, // px
        //   isBlurEnabled: false,
        //   brightness: 0.6,
        //   isBrightnessEnabled: false,
        //   contrast: 0.9,
        //   isContrastEnabled: false,
        //   dropShadow: 4, // px
        //   dropShadowColor: "#00ffff", // HOW TO DISABLE THIS PROPERLY
        //   isDropShadowEnabled: false,
        //   grayscale: 0.3,
        //   isGrayscaleEnabled: false,
        //   hueRotate: 120, // deg
        //   isHueRotateEnabled: false,
        //   saturate: 2.0,
        //   isSaturateEnabled: false
        // };
      })
      .catch(function (error) {
        console.error("Failed to retrieve PB instance from parent demo.", error);
      });
  });
})(window);
