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

  window.addEventListener("load", function () {
    // Create a custom config for the after effects

    var updateBackdropFilter = function (effectsNode) {
      return function (newBackdropFilterString, config) {
        console.log("backdropFilter", newBackdropFilterString);
        if (config.isEffectsColorEnabled) {
          var colorParsed = Color.parse(config.effectFilterColor);
          colorParsed.setAlpha(config.opacity);
          effectsNode.style["background-color"] = colorParsed.cssRGBA();
        } else {
          effectsNode.style["background-color"] = "";
        }
        effectsNode.style["backdrop-filter"] = newBackdropFilterString;
      };
    };
    // ----- /NEW

    globalThis.demoInitializationObserver
      .waitForInitialized()
      .then(function (initializedPB) {
        // console.log("initializedPB", initializedPB);
        var pb = initializedPB;
        var effectsNode = createCanvasCover(pb.canvas);
        var gui = pb.getGUI();

        var initialFilterValues = {
          // This is just for the global effect color
          effectFilterColor: "#204a87",
          isEffectsColorEnabled: true,
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

        // +---------------------------------------------------------------------------------
        // | Initialize dat.gui
        // +-------------------------------
        try {
          var cssBackdropFolder = gui.addFolder("CSS Backdrop Filters");
          var triggerUpdateBackdropFilters = createCssBackdropFilterSelector(
            cssBackdropFolder,
            updateBackdropFilter(effectsNode),
            initialFilterValues
          );
          triggerUpdateBackdropFilters();
        } catch (exc) {
          console.error(exc);
        }
      })
      .catch(function (error) {
        console.error("Failed to retrieve PB instance from parent demo.", error);
      });
  });
})(window);
