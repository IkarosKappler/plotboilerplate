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
          fullSize: true,
          scaleX: 5.0,
          scaleY: 5.0
        },
        GUP
      )
    );
    pb.drawConfig.origin.color = isDarkmode ? "#ffffff" : "#000000";

    var config = {
      useRelativePath: false,
      drawAbsoluteExamplePath: false,
      drawRelativeExamplePath: false,
      drawSourcePathParsed: true,
      drawSourcePathNative: true
    };

    var modal = new Modal();

    // var data1 =
    //   "m 51.076662,93.800013 c 1e-6,-16.933333 8.466667,-25.399999 25.399994,-25.399999 h 25.400004 c 16.93334,0 25.4,8.466666 25.4,25.399999 v 16.933337 c 0,16.93333 16.93334,33.86666 33.86667,33.86666 h 16.93333 c 16.93333,0 25.4,8.46667 25.4,25.4 v 25.4 c 0,16.93333 -8.46667,25.4 -25.4,25.4 h -16.93333 c -16.93333,0 -33.86667,16.93332 -33.86667,33.86666 V 271.6 c 0,16.93334 -8.46666,25.4 -25.4,25.4 H 76.476656 c -16.933327,0 -25.399993,-8.46666 -25.399994,-25.4 z";

    // From the official logo
    var data2 =
      "M51.077 102.267c0-16.934 16.933-33.867 33.866-33.867h8.467c16.933 0 33.867 16.933 33.867 33.867v8.466c-16.934 25.4 8.466 50.8 33.866 33.867h8.467c16.933 0 33.867 16.933 33.867 33.867v8.466c0 16.934-16.934 33.867-33.867 33.867h-8.467c-25.4-16.933-50.8 8.467-33.866 33.867v8.466c0 16.934-16.934 33.867-33.867 33.867h-8.467c-16.933 0-33.866-16.933-33.866-33.867l-.277-8.466c16.933-33.867 16.933-110.067 0-143.934z";

    // Define a shape with SVG path data attributes only with _absolute_
    // path commands.
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
    ];
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
    ];

    // The input data 'd' (from SVG path element): a string
    var sourceData = null;
    // The result array. All path commands will be converted to:
    //    Array<Line | CubicBezierCurve>
    var pathSegments = [];

    // +---------------------------------------------------------------------------------
    // | This is the callback function that's invoked when the user wants
    // | to load inserted data (from the dialog/modal).
    // +-------------------------------
    var loadPathData = function (data) {
      console.log("data", data);
      pathSegments = parseSVGPathData(data);
      sourceData = data;
      console.log("Setting sourceData", sourceData);
      console.log("pathSegments", pathSegments);
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | This is the callback to use when the user wants to insert
    // | path data into the dialog (modal).
    // +-------------------------------
    var insertPathJSON = function () {
      var textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.height = "50vh";
      textarea.innerHTML = config.useRelativePath ? svgDataRelative.join(" ") : svgDataAbsolute.join(" ");
      // textarea.innerHTML = data2;
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

    // +---------------------------------------------------------------------------------
    // | Show a dialog to select a path from an SVG document.
    // +-------------------------------
    var selectPathFromSvgDocument = function (svgDocument) {
      var pathNodes = svgDocument.getElementsByTagName("path");
      // console.log("pathNodes", pathNodes);
      var container = document.createElement("div");
      var title = document.createElement("div");
      title.innerText = "" + pathNodes.length + " path elements found";
      container.appendChild(title);
      var selectList = document.createElement("select");
      container.appendChild(selectList);
      selectList.style.width = "100%";
      for (var i = 0; i < pathNodes.length; i++) {
        //
        var option = document.createElement("option");
        option.innerText = pathNodes[i].getAttribute("d");
        selectList.appendChild(option);
      }

      // textarea.innerHTML = data2;
      modal.setTitle("Insert Path data (the 'd' string)");
      modal.setFooter("");
      modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Load data",
          action: function () {
            // var selectedOptionValue = selectList.options[selectList.selectedIndex].value;
            var selectedOptionValue = selectList.value;
            if (selectedOptionValue) {
              loadPathData(selectedOptionValue);
              modal.close();
            }
          }
        }
      ]);
      modal.setBody(container);
      modal.open();
    };

    // +---------------------------------------------------------------------------------
    // | This is our default redraw function here.
    // +-------------------------------
    pb.config.postDraw = function (draw, fill) {
      if (config.drawRelativeExamplePath) {
        drawRelativeExamplePath(draw, fill);
      }
      if (config.drawAbsoluteExamplePath) {
        drawAbsoluteExamplePath(draw, fill);
      }
      if (config.drawSourcePathNative) {
        drawSourcePathNative(draw, fill);
      }
      if (config.drawSourcePathParsed) {
        drawSourcePathParsed(draw, fill);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw the relative example path that was predefined for this demo.
    // +-------------------------------
    var drawRelativeExamplePath = function (draw, fill) {
      draw.path(svgDataRelative, "rgba(192,0,0,0.5)", 6);
    };

    // +---------------------------------------------------------------------------------
    // | Draw the absolute example path that was predefined for this demo.
    // +-------------------------------
    var drawAbsoluteExamplePath = function (draw, fill) {
      draw.path(svgDataAbsolute, "rgba(192,0,0,0.5)", 6);
    };

    // +---------------------------------------------------------------------------------
    // | Draw the original input path.
    // | As the original path is only an SVG data string we need to split this and
    // | convert to a sequence of native SVG path commands and params (array).
    // +-------------------------------
    var drawSourcePathNative = function (draw, fill) {
      if (sourceData) {
        // Array<SVGPathCommand> which is acually Array<string[]> of a particular format
        var sourceDataElements = splitSVGPathData(sourceData);
        // Convert to pure Array<string> by concatenating all commands.
        var dataElementsPlain = sourceDataElements.reduce(function (buf, elem) {
          buf = buf.concat(elem);
          return buf;
        });
        // Choose a high contrast color
        var contrastColor = getContrastColor(Color.parse(pb.config.backgroundColor)).setAlpha(0.5).cssRGB();
        draw.path(dataElementsPlain, contrastColor, 4);
      }
    };

    // +---------------------------------------------------------------------------------
    // | Draw the final parsed path – which consists of Lines, Curves and Ellipses.
    // +-------------------------------
    var drawSourcePathParsed = function (draw, fill) {
      for (var i = 0; i < pathSegments.length; i++) {
        var segment = pathSegments[i];
        if (segment instanceof Line) {
          draw.line(segment.a, segment.b, "green", 2);
        } else if (segment instanceof CubicBezierCurve) {
          draw.cubicBezier(segment.startPoint, segment.endPoint, segment.startControlPoint, segment.endControlPoint, "green", 2);
        } /* else if (segment instanceof VEllipse) {
          draw.ellipse(segment.center, segment.radiusH(), segment.radiusV(), "green", 2);
        } */
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

    // Install DnD
    var fileDrop = new FileDrop(pb.eventCatcher);
    fileDrop.onFileSVGDropped(function (svgDocument) {
      // TODO
      // console.log("Document:", svgDocument);
      // var pathNodes = svgDocument.getElementsByTagName("path");
      // console.log("pathNodes", pathNodes);
      selectPathFromSvgDocument(svgDocument);
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
      gui.add(config, 'useRelativePath').listen().onChange(function() { pb.redraw() }).name("useRelativePath").title("Which example path variant to use: relative or absolute?");
      // prettier-ignore
      gui.add(config, 'drawAbsoluteExamplePath').listen().onChange(function() { pb.redraw() }).name("drawAbsoluteExamplePath").title("Test draw the absolute example path for comparison?");
      // prettier-ignore
      gui.add(config, 'drawRelativeExamplePath').listen().onChange(function() { pb.redraw() }).name("drawRelativeExamplePath").title("Test draw the relative example path for comparison?");
      // prettier-ignore
      gui.add(config, 'drawSourcePathNative').listen().onChange(function() { pb.redraw() }).name("drawSourcePathNative").title("Draw the native path?");
      // prettier-ignore
      gui.add(config, 'drawSourcePathParsed').listen().onChange(function() { pb.redraw() }).name("drawSourcePathParsed").title("Draw the parsed path segments?");

      // Add stats
      var uiStats = new UIStats(stats);
      stats = uiStats.proxy;
      uiStats.add("mouseX");
      uiStats.add("mouseY");
    }

    pb.redraw();
  });
})(globalThis);
