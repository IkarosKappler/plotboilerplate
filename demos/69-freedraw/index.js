/**
 * A script for freedrawing line shapes.
 *
 * @author   Ikaros Kappler
 * @date     2026-03-18
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  _context.addEventListener("load", function () {
    let GUP = gup();
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);
    var isMobile = isMobileDevice();

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
    // pb.drawConfig.drawHandlePoints = false;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      showVertices: params.getBoolean("showVertices", true),
      lineColor: params.getString("lineColor", "rgb(255,128,0)"),
      lineWidth: params.getNumber("lineWidth", 7.0),
      showHobbyCurves: params.getBoolean("showHobbyCurves", true),
      showLinear: params.getBoolean("showLinear", false),
      showHobbyTangents: params.getBoolean("showHobbyTangents", false),
      isFuzzyDrawEnabled: params.getBoolean("isFuzzyDrawEnabled", false),
      fuzzySamplePointDistance: params.getNumber("fuzzySamplePointDistance", 20.0),
      fuzzyAmplitudeFactor: params.getNumber("fuzzyAmplitudeFactor", 10.0),
      fuzzLineCount: params.getNumber("fuzzLineCount", 10),
      fuzzyLineWidth: params.getNumber("fuzzyLineWidth", 0.5),
      readme: function () {
        globalThis.displayDemoMeta();
      }
    };

    // This is an experimental approach to make future event handling easier.
    var appContext = new AppContext(pb, config);
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    // Define a new appContext attribute 'curPolyline'
    appContext.freedrawLines = []; // Array<Polygon>
    // Define a new appContext attribute 'curPolyline'
    appContext.curPolyline = null; // Polygon
    // var hobbyCurves = []; // Array< Array<CubicBezierPath> >
    var hobbyPaths = []; // Array< BezierPath >
    // i -> mapping from hobby path to set of Bézier paths (fuzzy bundle)
    var fuzzyPaths = []; // Array< BezierPath[] >

    var postDraw = function (draw, _fill) {
      if (appContext.curPolyline) {
        draw.polyline(appContext.curPolyline.vertices, true, "orange", 2.0); // isOpen=true
      }

      if (config.showLinear) {
        for (var i = 0; i < appContext.freedrawLines.length; i++) {
          draw.polyline(appContext.freedrawLines[i].vertices, true, "blue", 1.0); // isOpen=true
        }
      }

      // Draw fuzzy?
      if (config.isFuzzyDrawEnabled) {
        for (var h = 0; h < fuzzyPaths.length; h++) {
          for (var f = 0; f < fuzzyPaths[h].length; f++) {
            var pathData = convertBezierPathToPathData(fuzzyPaths[h][f]);
            draw.cubicBezierPath(pathData, "rgba(128,128,128,0.5)", config.fuzzyLineWidth, { lineCap: "butt" }, true); // isOpen=true
          }
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      if (!config.showHobbyCurves) {
        return;
      }
      for (var p = 0; p < hobbyPaths.length; p++) {
        // console.log("hobbyCurves[p]", p, hobbyCurves[p]);
        if (hobbyPaths[p].bezierCurves.length === 0) {
          // Empty curve
          return;
        }
        // Convert sequence of CubicBezierCurve to bezier path data for direct draw.
        // This avoid ugly visible micro-gaps between any segments.
        var pathData = convertBezierPathToPathData(hobbyPaths[p]);
        // console.log("pathData", pathData);
        draw.cubicBezierPath(pathData, config.lineColor, config.lineWidth, { lineCap: "round" }, true); // isOpen=true
        if (config.showHobbyTangents) {
          for (var i = 0; i < hobbyPaths[p].bezierCurves.length; i++) {
            var curve = hobbyPaths[p].bezierCurves[i];
            draw.line(curve.startPoint, curve.startControlPoint, "rgba(0,255,255,1.0)", 2.0);
            draw.line(curve.endPoint, curve.endControlPoint, "rgba(0,255,255,1.0)", 2.0);
          }
        }
      }
    }; // END postDraw

    // +---------------------------------------------------------------------------------
    // | The name says all.
    // +-------------------------------
    var convertBezierPathToPathData = function (bezierPath) {
      return bezierPath.bezierCurves.reduce(
        function (accu, nextCubicCurve) {
          accu.push(nextCubicCurve.startControlPoint, nextCubicCurve.endControlPoint, nextCubicCurve.endPoint);
          return accu;
        },
        [bezierPath.bezierCurves[0].startPoint]
      );
    };

    // +---------------------------------------------------------------------------------
    // | Adds a new Hobby path from the given poly line.
    // | polyline: Array<Vertex>
    // +-------------------------------
    appContext.addHobbyPath = function (polyline) {
      if (!polyline || polyline.vertices.length <= 1) {
        console.log("Not adding Hobby path. polyline is null or empty.");
        return;
      }
      console.log("Add Hobby path", polyline);
      var path = convertPolylineToHobbyPath(polyline);
      var hobbyIndex = hobbyPaths.push(path) - 1;
      console.log("hobbyIndex", hobbyIndex);
      installHobbyMoveListeners(polyline, hobbyIndex);

      const fuzzyPath = buildFuzzyPaths(path);
      fuzzyPaths.push(fuzzyPath);
    };

    // +---------------------------------------------------------------------------------
    // | When points are dragged re-calculate the affectd Hobby path.
    // +-------------------------------
    var installHobbyMoveListeners = function (polyline, hobbyIndex) {
      // Todo: update the hobby path when an input vertex changed
      for (var i = 0; i < polyline.vertices.length; i++) {
        polyline.vertices[i].listeners.addDragEndListener(function (event) {
          console.log("hobby curve changes", hobbyIndex);
          recaululateHobbyPath(polyline, hobbyIndex);
        });
      }
    };

    // +---------------------------------------------------------------------------------
    // | Re-calculate the hobby path at the given index.
    // +-------------------------------
    var recaululateHobbyPath = function (polyline, hobbyIndex) {
      var updatedPath = convertPolylineToHobbyPath(polyline);
      hobbyPaths.splice(hobbyIndex, 1, updatedPath);
      var updatedFuzzyPaths = buildFuzzyPaths(updatedPath);
      fuzzyPaths.splice(hobbyIndex, 1, updatedFuzzyPaths);
      pb.redraw();
    };

    // +---------------------------------------------------------------------------------
    // | The name says all.
    // +-------------------------------
    var convertPolylineToHobbyPath = function (polyline) {
      // Hobby curve generation will fail if the vertex list contains duplicates.
      var cleanVertices = clearDuplicateVertices(polyline.vertices, 2.0); // epsilon=2.0
      var hobbyPath = new HobbyPath(cleanVertices);
      // Array<CubicBezierCurve>
      var curves = hobbyPath.generateCurve(false, 0.0); // isCircular=false, hobbyOmega=0.0
      // Convert to BezierPath object
      var path = BezierPath.fromArray(curves);
      return path;
    };

    // +---------------------------------------------------------------------------------
    // | The name says all.
    // +-------------------------------
    var buildFuzzyPaths = function (bezierPath) {
      // var samplePointDistance = 20.0;
      // Adjust amplitude factor to grow/decrease disproportional to the sample distance.
      // (means: visual amplitude should not grow when sample distance is increased)
      var amplituteFactor = config.fuzzyAmplitudeFactor / config.fuzzySamplePointDistance;
      var fuzzyGenerator = new FuzzyLineDraw(config.fuzzySamplePointDistance, amplituteFactor);
      var fuzzyPaths = []; // Array< BezierPath >
      for (var f = 0; f < config.fuzzLineCount; f++) {
        fuzzyGenerator.samplePointDistance = config.fuzzySamplePointDistance * (0.5 + Math.random() * 0.5);
        // Returns a new BézierPath
        var fuzzyCurve = fuzzyGenerator.variationFromBezierPath(bezierPath);
        fuzzyPaths.push(fuzzyCurve);
      }
      // }
      return fuzzyPaths;
    };

    // +---------------------------------------------------------------------------------
    // | The name says all.
    // +-------------------------------
    var rebuildAllFuzzyPaths = function () {
      for (var h = 0; h < hobbyPaths.length; h++) {
        var updatedFuzzyPaths = buildFuzzyPaths(hobbyPaths[h]);
        fuzzyPaths.splice(h, 1, updatedFuzzyPaths);
        pb.redraw();
      }
    };

    new InputHandler(appContext);

    var toggleVertexVisibility = function () {
      appContext.freedrawLines.forEach(function (polyline) {
        polyline.vertices.forEach(function (vertex) {
          vertex.attr.visible = config.showVertices;
        });
      });
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      var foldFreedraw = gui.addFolder("Free draw");
      // prettier-ignore
      foldFreedraw.add(config, "showVertices").title("Draw the vertices?").onChange(function () { toggleVertexVisibility(); pb.redraw(); });
      // prettier-ignore
      foldFreedraw.addColor(config, "lineColor").title("The line's color to draw with.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      foldFreedraw.add(config, "lineWidth").min(0).max(20.0).step(0.5).title("The lines' with.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      foldFreedraw.add(config, "showHobbyCurves").title("Draw the respective hobby curves.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      foldFreedraw.add(config, "showLinear").title("Draw the linear elements?").onChange(function () { pb.redraw(); } );
      // prettier-ignore
      foldFreedraw.add(config, "showHobbyTangents").title("Draw the linear Hobby curve tangents?").onChange(function () { pb.redraw(); } );
      // prettier-ignore
      var foldFuzzy = gui.addFolder("Fuzzy draw settings");
      // prettier-ignore
      foldFuzzy.add(config, "isFuzzyDrawEnabled").title("Enable/disable experimental fuzzy draw.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      foldFuzzy.add(config, "fuzzySamplePointDistance").min(5).max(100).step(5).title("The average sample point distance.").onChange(function () { rebuildAllFuzzyPaths(); });
      // prettier-ignore
      foldFuzzy.add(config, "fuzzyAmplitudeFactor").min(0).max(20.0).step(0.5).title("The amplitude amplification factor – depending the sampling length.").onChange(function () {rebuildAllFuzzyPaths(); });
      // prettier-ignore
      foldFuzzy.add(config, "fuzzLineCount").min(1).max(100).step(1).title("Number of fuzzy lines to use.").onChange(function () { rebuildAllFuzzyPaths(); });
      // prettier-ignore
      foldFuzzy.add(config, "fuzzyLineWidth").min(0).max(20.0).step(0.5).title("The line width of the fuzzy components.").onChange(function () { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "readme").title("Show readme.md");
    }

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    // reinit();
    // updateGUI();
    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();

    humane.log("Draw a line with your mouse / finger");
  });
})(globalThis);
