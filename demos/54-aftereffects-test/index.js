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
      effectFilterColor: "#ff0000",
      isEffectsColorEnabled: true,
      color: "#ff0000",
      isColorEnabled: true,

      // colorAlpha: 0.95,
      // myNumber: 0.5,
      // myNumberEnabled: true
      booleanValue: false,
      isBooleanEnabled: true
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
      console.log("backdropFilter", newBackdropFilterString);
      // effectsNode.style["background-color"] = effectsConfig.effectFilterColor;
      if (config.isOpacityEnabled) {
        effectsNode.style["background-color"] = "rgba(255,0,0,0.5)";
      } else {
        effectsNode.style["background-color"] = "none";
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
          gui.addColor(effectsConfig, "color").onChange(function (newValue) {
            console.log("New color", newValue);
          });
          gui
            .addColorWithCheckbox(effectsConfig, "effectFilterColor", "isEffectsColorEnabled")
            .onChange(function (newValue, isEnabled) {
              console.log("New color-with-checkbox value", newValue, "isEnabled", isEnabled);
            });
          gui.addWithCheckbox(effectsConfig, "booleanValue", "isBooleanEnabled").onChange(function (newValue, isEnabled) {
            console.log("New boolean (0)", newValue, "isEnabled", isEnabled);
          });
          // gui
          //   .addColorWithAlpha(effectsConfig, "color", "colorAlpha")
          //   .onChange(function (newColorValue, newAlphaValue) {
          //     console.log("New value (1)", newColorValue, newAlphaValue);
          //     updateBackdropFilter();
          //   })
          //   .name("TEST")
          //   .title("test");
          // gui
          //   .addNumberWithCheckbox(effectsConfig, "myNumber", "myNumberEnabled")
          //   .onChange(function (newColorValue, newAlphaValue) {
          //     console.log("New value (1)", newColorValue, newAlphaValue);
          //     updateBackdropFilter();
          //   })
          //   .min(0.0)
          //   .max(1.0)
          //   .step(0.01)
          //   .name("myNumber")
          //   .title("myNumber");

          var cssBackdropFolder = gui.addFolder("CSS Backdrop Filters");
          var result = createCssBackdropFilterSelector(cssBackdropFolder, updateBackdropFilter);
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
