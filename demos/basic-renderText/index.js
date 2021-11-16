/**
 * A script for demonstrating how to render text.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2021-11-13
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var DEG_TO_RAD = Math.PI / 180;

  window.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), fullSize: true, drawOrigin: true },
        GUP
      )
    );

    var anchorPosition = new Vertex(0, 0);
    pb.add(anchorPosition);

    var TEXT_ALIGN_OPTIONS = ["left", "right", "center", "start", "end"];
    var FONT_FAMILY_OPTIONS = [
      "Arial", // (sans-serif)
      "Arial Black", // (sans-serif)
      "Verdana", // (sans-serif)
      "Tahoma", // (sans-serif)
      "Trebuchet MS", // (sans-serif)
      "Impact", // (sans-serif)
      "Times New Roman", // (serif)
      "Didot", // (serif)
      "Georgia", // (serif)
      "American Typewriter", // (serif)
      "Andalé Mono", // (monospace)
      "Courier", // (monospace)
      "Lucida Console", // (monospace)
      "Monaco", // (monospace)
      "Bradley Hand", // (cursive)
      "Brush Script MT", // (cursive)
      "Luminari", // (fantasy)
      "Comic Sans MS" // (cursive)
    ];
    var FONT_STYLES = ["normal", "italic", "oblique"];
    var FONT_WEIGHTS = ["normal", "bold", "bolder", "lighter", 100, 200, 300, 400, 500, 600, 700, 800, 900];

    var config = {
      guiDoubleSize: false,
      x: 0,
      y: 0,
      color: "#000000",
      fontFamily: "Arial",
      fontSize: 12,
      fontStyle: "normal", // "normal", "italics", "oblique"
      fontWeight: "normal", // "normal", "bold", "bolder", "lighter", 100, 200, ... 900
      lineHeight: 12,
      rotation: 0.0,
      text: "Test text",
      // Value according to https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign
      //    "left" || "right" || "center" || "start" || "end"
      textAlign: "left"
    };

    pb.config.postDraw = function () {
      pb.fill.point({ x: config.x, y: config.y }, "rgba(192,0,128,0.5)");
      pb.fill.text(config.text, config.x, config.y, {
        color: config.color,
        fontFamily: config.fontFamily,
        fontSize: config.fontSize,
        fontStyle: config.fontStyle,
        fontWeight: config.fontWeight,
        lineHeight: config.lineHeight,
        rotation: config.rotation * DEG_TO_RAD, // Convert degrees to radians
        textAlign: config.textAlign
      });
    };

    var updateTextPosition = function () {
      anchorPosition.x = config.x;
      anchorPosition.y = config.y;
      redraw();
    };

    anchorPosition.listeners.addDragEndListener(function (event) {
      config.x = anchorPosition.x;
      config.y = anchorPosition.y;
      redraw();
    });

    var redraw = function () {
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui for this demo.
    // +-------------------------------
    var gui = new dat.gui.GUI();
    gui.remember(config);
    var toggleGuiSize = function () {
      // TODO: put into separate function
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
    // prettier-ignore
    gui.add(config, "guiDoubleSize").title("Double size GUI?").onChange(toggleGuiSize);
    // prettier-ignore
    gui.add(config, "x").listen().title("The x position of the text.").onChange( function() { 
      updateTextPosition(); 
      redraw(); 
    } );
    // prettier-ignore
    gui.add(config, "y").listen().title("The y position of the text.").onChange( function() { 
      updateTextPosition(); 
      redraw(); 
    } );
    // prettier-ignore
    gui.addColor(config, "color").title("The color to use").onChange(redraw);
    // prettier-ignore
    gui.add(config, "fontFamily", FONT_FAMILY_OPTIONS).title("The font family to use.").onChange(redraw);
    // prettier-ignore
    gui.add(config, "fontSize").min(1).max(64).step(1).title("The font size to use.").onChange(redraw);
    // prettier-ignore
    gui.add(config, "lineHeight").min(1).max(64).step(1).title("The line height to use.").onChange(redraw);
    // prettier-ignore
    gui.add(config, "fontStyle", FONT_STYLES).title("The font size to use.").onChange(redraw);
    // prettier-ignore
    gui.add(config, "fontWeight", FONT_WEIGHTS).title("The font size to use.").onChange(redraw);
    // prettier-ignore
    gui.add(config, "rotation").min(0).max(360).step(1).title("The rotation to use in degrees.").onChange(redraw);
    // prettier-ignore
    gui.add(config, "textAlign", TEXT_ALIGN_OPTIONS).title("The text align to use.").onChange(redraw);
    // prettier-ignore
    gui.add(config, "text").title("The text to draw.").onChange(redraw);

    redraw();
  });
})(window);
