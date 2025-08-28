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
    // var GUP = gup();
    // var config = {};

    if (isMobileDevice()) {
      toggleGuiSize();
    }

    var inputs = Array(
      "linear-gradient(to right bottom, #FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%)",
      "linear-gradient(to right bottom, rgba(255, 0, 0, .1) 0%, rgba(0, 255, 0, 0.9) 20px)",
      "radial-gradient(rgb(102, 126, 234), rgb(118, 75, 162))",
      "linear-gradient(#FF0000 0%, #00FF00 20px, rgb(0, 0, 255) 100%)",
      "linear-gradient(45deg, red, blue)",
      "linear-gradient(135deg, orange, orange 60%, cyan)",
      "linear-gradient(to right, red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%)",
      "radial-gradient(rgb(102, 126, 234), rgb(118, 75, 162))",
      "radial-gradient(circle at 100%, #333, #333 50%, #eee 75%, #333 75%)",
      "radial-gradient(ellipse farthest-side at 16% 35%, #ff0000 0%, #00ff00 80%)",
      "radial-gradient(circle farthest-side at 28% 50%, #ff0000 0%, #00ff00 80%)",
      "radial-gradient(circle farthest-corner at 28% 50%, #ff0000 0%, #00ff00 80%)"
    );

    const parser = new LinearColorGradientParser();
    const outputList = document.getElementById("output-list");
    var result;
    for (var i = 0; i < inputs.length; i++) {
      console.log("input", i, inputs[i]);
      outputList.innerHTML += "<li>Testing input: <code>" + inputs[i] + "</code></li>";
      try {
        result = parser.parseRaw(inputs[i]);
        outputList.innerHTML += "<li>Result: <code>" + JSON.stringify(result) + "</code></li>";
      } catch (e) {
        outputList.innerHTML += "<li>ERROR <code>" + JSON.stringify(e) + "</code></li>";
      }
      if (result) {
        try {
          console.log(LinearColorGradientParser.parseResultToColorGradient(result));
        } catch (e) {
          console.log(e);
        }
      }
    }
  });
})(window);
