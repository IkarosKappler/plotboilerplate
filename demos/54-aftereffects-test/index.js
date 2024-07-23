/**
 * A script to demonstrate how to construct 2D metaballs with PlotBoilerplate.
 *
 * Note there are some edge cases where the calculation is locally not working correctly.
 *
 * @requires PlotBoilerplate
 * @requires Bounds
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 * @author   Ikaros Kappler
 * @date     2024-02-06
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    // Create a custom config for the after effects?
    var effectsConfig = {
      effectFilterColor: "#204a87",
      isEffectsColorEnabled: true
    };

    var canvas = document.getElementById("my-canvas");
    var canvasParent = canvas.parentElement;
    var effectsNode = document.createElement("div");
    effectsNode.style["position"] = "absolute";
    effectsNode.style["left"] = "0px";
    effectsNode.style["top"] = "0px";
    effectsNode.style["width"] = "100%";
    effectsNode.style["height"] = "100%";
    effectsNode.style["pointer-events"] = "none";

    canvasParent.appendChild(effectsNode);

    var updateBackdropFilter = function (newBackdropFilterString, config) {
      // console.log("backdropFilter", newBackdropFilterString);
      if (effectsConfig.isEffectsColorEnabled) {
        var colorParsed = Color.parse(effectsConfig.effectFilterColor);
        colorParsed.setAlpha(config.opacity);
        effectsNode.style["background-color"] = colorParsed.cssRGBA();
      } else {
        effectsNode.style["background-color"] = "";
      }
      effectsNode.style["backdrop-filter"] = newBackdropFilterString;
    };
    // ----- /NEW

    globalThis.demoInitializationObserver
      .waitForInitialized()
      .then(function (initializedPB) {
        console.log("initializedPB", initializedPB);
        var pb = initializedPB;
        var gui = pb.getGUI();

        // +---------------------------------------------------------------------------------
        // | Initialize dat.gui
        // +-------------------------------
        try {
          var cssBackdropFolder = gui.addFolder("CSS Backdrop Filters");
          cssBackdropFolder
            .addColorWithCheckbox(effectsConfig, "effectFilterColor", "isEffectsColorEnabled")
            .onChange(function (newValue, isEnabled) {
              console.log("New color-with-checkbox value", newValue, "isEnabled", isEnabled);
              triggerUpdateBackdropFilters();
            });
          var triggerUpdateBackdropFilters = createCssBackdropFilterSelector(cssBackdropFolder, updateBackdropFilter);
          triggerUpdateBackdropFilters();
        } catch (exc) {
          console.error(exc);
        }

        // pb.config.postDraw = redraw;
        // init();
        // rebuildMetaballs();
        // pb.redraw();
      })
      .catch(function (error) {
        console.error("Failed to retrieve PB instance.", error);
      });
  });
})(window);
