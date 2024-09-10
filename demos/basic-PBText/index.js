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
  var isDarkmode = detectDarkMode(GUP);
  var DEG_TO_RAD = Math.PI / 180;

  window.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: "#ffffff", fullSize: true, drawOrigin: true },
        GUP
      )
    );

    // We put all possible font options into a config (use this to create a tiny GUI).
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

    // Create the text element and add is to the canvas.
    var text = new PBText(config.text, new Vertex(config.x, config.y), config);
    pb.add(text);

    // Apply the config settings to the font (called when some input has changed).
    var updateTextProperties = function () {
      text.anchor.x = config.x;
      text.anchor.y = config.y;
      text.color = config.color;
      text.fontFamily = config.fontFamily;
      text.fontSize = config.fontSize;
      text.fontStyle = config.fontStyle;
      text.fontWeight = config.fontWeight;
      text.lineHeight = config.lineHeight;
      text.rotation = config.rotation * DEG_TO_RAD;
      text.text = config.text;
      text.textAlign = config.textAlign;
      pb.redraw();
    };

    // Install a Drag-and-drop listener to the text anchor
    text.anchor.listeners.addDragEndListener(function (event) {
      config.x = text.anchor.x;
      config.y = text.anchor.y;
      pb.redraw();
    });

    pb.config.postDraw = function (draw, fill) {
      var backgroundColor = Color.parse(pb.config.backgroundColor);
      var contrastColor = getContrastColor(backgroundColor).cssRGB();
      fill.label("Label", 30, 20, 0.0, contrastColor);
      fill.label("Label", 23, 34, Math.PI / 4.0, contrastColor);
      fill.label("Label", 8, 34, Math.PI / 2.0, contrastColor);
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui for this demo.
    // +-------------------------------
    var gui = pb.createGUI();
    // prettier-ignore
    gui.add(config, "x").listen().title("The x position of the text.").onChange( updateTextProperties);
    // prettier-ignore
    gui.add(config, "y").listen().title("The y position of the text.").onChange( updateTextProperties );
    // prettier-ignore
    gui.addColor(config, "color").title("The color to use").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "fontFamily", FONT_FAMILY_OPTIONS).title("The font family to use.").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "fontSize").min(1).max(64).step(1).title("The font size to use.").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "lineHeight").min(1).max(64).step(1).title("The line height to use.").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "fontStyle", FONT_STYLES).title("The font size to use.").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "fontWeight", FONT_WEIGHTS).title("The font size to use.").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "rotation").min(0).max(360).step(1).title("The rotation to use in degrees.").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "textAlign", TEXT_ALIGN_OPTIONS).title("The text align to use.").onChange(updateTextProperties);
    // prettier-ignore
    gui.add(config, "text").title("The text to draw.").onChange(updateTextProperties);

    pb.redraw();
  });
})(window);
