/**
 * Test the Color class.
 *
 * @requires lil-gui
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2025-08-08
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  var GUP = gup();
  var params = new Params(GUP);
  var isMobile = isMobileDevice();
  if (params.hasParam("isMobile")) {
    if (params.getBoolean("isMobile", true) === false) {
      isMobile = false;
    } else if (params.getBoolean("isMobile", false) === true) {
      isMobile = true;
    }
  }

  window.addEventListener("load", function () {
    var config = {
      gradient: ColorGradient.createDefault()
    };

    var showColorGradient = function () {
      console.log("showColorGradient", config.gradient);
      document.getElementById("color-display").style["background"] = config.gradient.toColorGradientString();
    };

    const colorGradientDialog = new ColorGradientPickerDialog(new Modal({ closeOnBackdropClick: true }), {
      isMobileMode: isMobile
    });

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = new lil.GUI();
    gui.addColorGradient(config, "gradient", colorGradientDialog).onChange(showColorGradient);

    showColorGradient();
  });
})(window);
