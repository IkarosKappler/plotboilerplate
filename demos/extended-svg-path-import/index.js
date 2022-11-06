/**
 * A script for demonstrating how to import SVG path data.
 *
 * @requires PlotBoilerplate, gup, dat.gui,
 *
 * @author   Ikaros Kappler
 * @date     2022-11-06
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();
  var isDarkmode = detectDarkMode(GUP);

  _context.addEventListener("load", function () {
    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("my-canvas"),
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          fullSize: true
        },
        GUP
      )
    );
    pb.drawConfig.origin.color = isDarkmode ? "#ffffff" : "#000000";

    var config = {
      t: 0.5
    };

    var initialViewport = pb.viewport();

    var modal = new Modal();

    var data1 =
      "m 51.076662,93.800013 c 1e-6,-16.933333 8.466667,-25.399999 25.399994,-25.399999 h 25.400004 c 16.93334,0 25.4,8.466666 25.4,25.399999 v 16.933337 c 0,16.93333 16.93334,33.86666 33.86667,33.86666 h 16.93333 c 16.93333,0 25.4,8.46667 25.4,25.4 v 25.4 c 0,16.93333 -8.46667,25.4 -25.4,25.4 h -16.93333 c -16.93333,0 -33.86667,16.93332 -33.86667,33.86666 V 271.6 c 0,16.93334 -8.46666,25.4 -25.4,25.4 H 76.476656 c -16.933327,0 -25.399993,-8.46666 -25.399994,-25.4 z";

    var loadPathData = function (data) {
      console.log("data", data);
      var elements = parseSVGPathData(data);
      console.log("elements", elements);
    };

    var insertPathJSON = function () {
      var textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.height = "50vh";
      textarea.innerHTML = data1; // outline.toJSON(true);
      modal.setTitle("Insert Path data (the 'd' string)");
      modal.setFooter("");
      modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Load data",
          action: function () {
            loadPathData(textarea.value);
            modal.close();
          }
        }
      ]);
      modal.setBody(textarea);
      modal.open();
    };
    insertPathJSON();

    // On redrawing determine the orthogonal vector at the given position
    pb.config.postDraw = function (draw, fill) {
      var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).cssRGB();
      console.log("contrastColor", contrastColor);
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 't').min(-2.0).max(2.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("t").title("The relative value on the line (relative to the distance between start and end point).");
    }

    pb.redraw();
  });
})(globalThis);
