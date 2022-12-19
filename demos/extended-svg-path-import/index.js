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

    // Define a shape with SVG path data attributes only with _absolute_
    // path commands.
    // prettier-ignore
    var _svgDataAbsolute_ = [
      'M', -10, -7.5,
      'V', -10, 
      'L', 0, -10,
      'C', -5, -15, 10, -15, 5, -10,
      'H', 10,
      'C', 5, -7.5, 5, -7.5, 10, -5,
      'S', 15, 0, 10, 0,
      'Q', 5, 5, 0, 0,
      'T', -10, 0,
      'A', 5, 4, 0, 1, 1, -10, -5,    
      'Z'
    ];
    // prettier-ignore
    var svgDataAbsolute = [
      'M', -10, -7.5,
      'V', -10, 
      'L', 0, -10,
      'C', -5, -15, 10, -15, 5, -10,
      'H', 10,
      'C', 5, -7.5, 5, -7.5, 10, -5,
      'S', 15, 0, 10, 0,
      'Q', 5, 5, 0, 0,
      'T', -10, 0,
      'A', 5, 4, 0, 1, 1, -10, -5,
      'Z'
    ]; // .join(" ");
    console.log("svgDataAbsolute", svgDataAbsolute);

    // Now define the same shape. But only y with _relative_
    // path commands.
    // prettier-ignore
    var svgDataRelative = [
      'M', -10, -7.5,
      'v', -2.5, 
      'l', 10, 0,
      'c', -5, -5, 10, -5, 5, 0,
      'h', 5,
      'c', -5, 2.5, -5, 2.5, 0, 5,
      's', 5, 5, 0, 5,
      'q', -5, 5, -10, 0,
      't', -10, 0,
      'a', 5, 4, 0, 1, 1, 0, -5,    
      'z'
    ]; //.join(" ");

    var shortHandStart = new Vertex(0, 0);
    var shortHandControl = new Vertex(0, 300);
    var shortHandEnd = new Vertex(300, 0);
    // var svgDataShorthand = ["M", 0, 0, "S", 0, 300, 300, 0];
    pb.add([shortHandStart, shortHandControl, shortHandEnd]);

    var sourceData = null;
    var pathSegments = [];

    var loadPathData = function (data) {
      console.log("data", data);
      pathSegments = parseSVGPathData(data);
      sourceData = data;
      console.log("Setting sourceData", sourceData);
      console.log("pathSegments", pathSegments);

      pb.redraw();
    };

    var insertPathJSON = function () {
      var textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.height = "50vh";
      // textarea.innerHTML = svgDataAbsolute.join(" ");
      textarea.innerHTML = svgDataRelative.join(" ");
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
      // console.log("contrastColor", contrastColor);

      var svgDataShorthand = [
        "M",
        shortHandStart.x,
        shortHandStart.y,
        "S",
        shortHandControl.x,
        shortHandControl.y,
        shortHandEnd.x,
        shortHandEnd.y
      ];
      draw.path(svgDataShorthand, "orange", 2);
      var parsedShorthand = parseSVGPathData(svgDataShorthand.join(" "))[0];
      // console.log(parsedShorthand);
      draw.cubicBezier(
        parsedShorthand.startPoint,
        parsedShorthand.endPoint,
        parsedShorthand.startControlPoint,
        parsedShorthand.endControlPoint,
        "rgba(255,255,0,0.5)",
        8
      );
      draw.line(parsedShorthand.startPoint, parsedShorthand.startControlPoint, "red", 1);
      draw.line(parsedShorthand.endPoint, parsedShorthand.endControlPoint, "red", 1);

      // draw.path(svgDataAbsolute, "rgba(192,0,0,0.5)", 6);
      draw.path(svgDataRelative, "rgba(192,0,0,0.5)", 6);
      // console.log("sourceData", sourceData);
      if (sourceData) {
        var sourceDataElements = splitSVGPathData(sourceData);
        var sourceDataElements = sourceDataElements.reduce(function (buf, elem) {
          buf = buf.concat(elem);
          return buf;
        });
        // console.log("Split Sourc Data Elements", sourceDataElements);
        draw.path(sourceDataElements, "rgba(128,128,128,0.5)", 3);
      }

      for (var i = 0; i < pathSegments.length; i++) {
        var segment = pathSegments[i];
        if (segment instanceof Line) {
          pb.draw.line(segment.a, segment.b, "green", 2);
        } else if (segment instanceof CubicBezierCurve) {
          pb.draw.cubicBezier(
            segment.startPoint,
            segment.endPoint,
            segment.startControlPoint,
            segment.endControlPoint,
            "green",
            2
          );
        } else if (segment instanceof VEllipse) {
          // console.log("Ellipse", segment);
          pb.draw.ellipse(segment.center, segment.radiusH(), segment.radiusV(), "green", 2);
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    new MouseHandler(pb.canvas, "drawsvg-demo").move(function (e) {
      // Display the mouse position
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseX = relPos.x;
      stats.mouseY = relPos.y;
    });

    var stats = {
      mouseX: 0,
      mouseY: 0
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      // gui.add(config, 't').min(-2.0).max(2.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("t").title("The relative value on the line (relative to the distance between start and end point).");

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    pb.redraw();
  });
})(globalThis);
