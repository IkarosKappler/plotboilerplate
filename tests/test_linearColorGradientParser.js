/**
 * Test the LinearColorGradientParser class.
 *
 * @requires lil-gui LinearColorGradientParser
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2025-09-02
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
      "linear-gradient(90deg, #FF0000 0%, #00FF00 50%, rgb(0, 0, 255) 100%)",
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
    var buffer = [];
    for (var i = 0; i < inputs.length; i++) {
      console.log("input", i, inputs[i]);
      buffer.push("<li>Testing input: <code>" + inputs[i] + "</code>");
      buffer.push("<ul>");
      buffer.push(
        '<li><div style="width: 100px; height: 1.5em; border: 1px solid grey; background: ' + inputs[i] + '"></div></li>'
      );

      try {
        result = parser.parseRaw(inputs[i]);
        buffer.push('<li><span class="green">Result:</span> <code>' + JSON.stringify(result) + "</code></li>");
      } catch (e) {
        buffer.push('<li><span class="green">ERROR</span> <code>' + JSON.stringify(e) + "</code></li>");
      }
      if (result) {
        try {
          const colorGradientInstance = LinearColorGradientParser.parseResultToColorGradient(result);
          console.log(colorGradientInstance);
          buffer.push(
            '<li><span class="green">Instantiated as ColorGradient: </span> <code>' +
              JSON.stringify(colorGradientInstance) +
              "</code></li>"
          );
          buffer.push(
            '<li><div style="width: 100px; height: 1.5em; border: 1px solid grey; background: ' +
              colorGradientInstance.toColorGradientString() +
              '"></div></li>'
          );
        } catch (e) {
          console.log(e);
          buffer.push('<li><span class="red">Cannot instantiate as ColorGradient</span> <code>' + e.message + "</code></li>");
        }
      }
      buffer.push("</ul>");
      buffer.push("</li>");

      outputList.innerHTML += buffer.join("");
      buffer = [];
    }
  });
})(window);
