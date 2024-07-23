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

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    // Create a custom config for the after effects
    var canvas = document.getElementById("my-canvas");
    var canvasParent = canvas.parentElement;
    var effectsNode = document.createElement("div");
    effectsNode.style["position"] = "absolute";
    effectsNode.style["left"] = "0px";
    effectsNode.style["top"] = "0px";
    effectsNode.style["width"] = "100%";
    effectsNode.style["height"] = "100%";
    // This is very important so the backdrop-filter element does not block input events.
    effectsNode.style["pointer-events"] = "none";

    canvasParent.appendChild(effectsNode);

    var updateBackdropFilter = function (newBackdropFilterString, config) {
      // console.log("backdropFilter", newBackdropFilterString);
      if (config.isEffectsColorEnabled) {
        var colorParsed = Color.parse(config.effectFilterColor);
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

        var initialFilterValues = {};

        // +---------------------------------------------------------------------------------
        // | Initialize dat.gui
        // +-------------------------------
        try {
          var cssBackdropFolder = gui.addFolder("CSS Backdrop Filters");
          var triggerUpdateBackdropFilters = createCssBackdropFilterSelector(
            cssBackdropFolder,
            updateBackdropFilter,
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
