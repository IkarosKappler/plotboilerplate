/**
 * Test the Color class.
 *
 * @requires lil-gui
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-11-08
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  window.addEventListener("load", function () {
    var GUP = gup();
    var config = {
      guiDoubleSize: false,
      color: GUP["color"] || "rgba(0,167,185,1)"
    };

    var showColor = function () {
      document.getElementsByTagName("body")[0].style.backgroundColor = config.color;
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = new dat.gui.GUI();
    var toggleGuiSize = function () {
      gui.domElement.style["transform-origin"] = "100% 0%";
      if (config.guiDoubleSize) {
        gui.domElement.style["transform"] = "scale(2.0)";
      } else {
        gui.domElement.style["transform"] = "scale(1.0)";
      }
    };
    if (isMobileDevice()) {
      config.guiDoubleSize = true;
      toggleGuiSize();
    }
    gui.add(config, "guiDoubleSize").title("Double size GUI?").onChange(toggleGuiSize);

    gui.addColor(config, "color").title("The general color.").onChange(showColor);
    // gui.addColor(config, "lifeColor").title("The color of living cells").onChange(visualizeCreatures);
    // gui.addColor(config, "traceColor").title("The color of traces.").onChange(visualizeCreatures);
    // gui.addColor(config, "borderColor").title("The color of borders.").onChange(visualizeCreatures);

    var applyModifier = function (modifierName, value, colorDisplayElem) {
      // Convert color string to color instance.
      var color = Color.parse(config.color);
      // Apply modifier
      var modifierFunction = Color.prototype[modifierName];
      if (!modifierFunction) {
        console.log(Color);
        console.warn("The modifier " + modifierName + " was not found in the Color class.");
        // TODO: show an error indicator?
        return;
      }
      console.log("Apply modifier", modifierName, value);
      modifierFunction.call(color, value);
      colorDisplayElem.innerHTML = color.cssRGBA();
      colorDisplayElem.style["background-color"] = color.cssRGBA();
      colorDisplayElem.style["color"] = getContrastColor(color).cssRGBA();
      console.log("newColor", color.cssRGBA());
      console.log("contrastColor", getContrastColor(color).cssRGBA());
    };

    // Install listeners
    [].forEach.call(document.getElementsByClassName("color-wrapper"), function (elem) {
      console.log("elem", elem);
      var modifierName = elem.dataset["modifier"];
      console.log("modifierName", modifierName);
      elem.addEventListener("change", function (event) {
        applyModifier(modifierName, Number(event.target.value), elem.getElementsByClassName("color-display")[0]);
      });
      console.log("elem,", elem.value);
      applyModifier(
        modifierName,
        Number(elem.getElementsByTagName("input")[0].value),
        elem.getElementsByClassName("color-display")[0]
      );
    });

    // // Test Color parser:
    var colorStrings = [
      "rgba(0,0,0,0.5)",
      "rgba(255,255,255,1.0)",
      "rgba(0,28,64,0)",
      "rgba(1,2,3,1)",
      "rgba( 1 , 2 , 3 , 0.5 )",
      "rgba( 2, 3,4, .5)",

      "rgb(0,0,0)",
      "rgb(255,255,255)",
      "rgb(0,28,64)",
      "rgb(1,2,3)",
      "rgb( 1 , 2 , 3  )",
      "rgb( 2, 3,4)"
    ];
    for (var i = 0; i < colorStrings.length; i++) {
      console.log("string: " + colorStrings[i]);
      console.log("color:" + Color.parse(colorStrings[i]));
    }

    showColor();
  });
})(window);
