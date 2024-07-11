/**
 * Test the Color class.
 *
 * @requires dat.gui
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-11-08
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  window.addEventListener("load", function () {
    var config = {
      color: "#ff0000",
      alpha: 0.5
    };

    var showColor = function () {
      document.getElementById("color-display").style.backgroundColor = config.color;
      document.getElementById("color-display").style.opacity = config.alpha;
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = new lil.GUI();
    gui.addColor(config, "color").onChange(showColor);
    gui.addColorWithAlpha(config, "color", "alpha").name("color & alpha").onChange(showColor);

    showColor();
  });
})(window);
