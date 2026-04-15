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
    // `AppContext`: this is an experimental approach to make future event handling easier.
    var appContext = new AppContext(pb, {
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
      randomizeFuzzy: function () {
        appContext.rebuildAllFuzzyPaths();
      },
      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
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

      if (appContext.config.showLinear) {
        for (var i = 0; i < appContext.freedrawLines.length; i++) {
          draw.polyline(appContext.freedrawLines[i].vertices, true, "blue", 1.0); // isOpen=true
        }
      }

      // Draw fuzzy?
      if (appContext.config.isFuzzyDrawEnabled) {
        for (var h = 0; h < fuzzyPaths.length; h++) {
          for (var f = 0; f < fuzzyPaths[h].length; f++) {
            var pathData = convertBezierPathToPathData(fuzzyPaths[h][f]);
            draw.cubicBezierPath(pathData, "rgba(128,128,128,0.5)", appContext.config.fuzzyLineWidth, { lineCap: "butt" }, true); // isOpen=true
          }
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      if (!appContext.config.showHobbyCurves) {
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
        draw.cubicBezierPath(pathData, appContext.config.lineColor, appContext.config.lineWidth, { lineCap: "round" }, true); // isOpen=true
        if (appContext.config.showHobbyTangents) {
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
      var amplituteFactor = appContext.config.fuzzyAmplitudeFactor / appContext.config.fuzzySamplePointDistance;
      var fuzzyGenerator = new FuzzyLineDraw(appContext.config.fuzzySamplePointDistance, amplituteFactor);
      var fuzzyPaths = []; // Array< BezierPath >
      for (var f = 0; f < appContext.config.fuzzLineCount; f++) {
        fuzzyGenerator.samplePointDistance = appContext.config.fuzzySamplePointDistance * (0.5 + Math.random() * 0.5);
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
    appContext.rebuildAllFuzzyPaths = function () {
      for (var h = 0; h < hobbyPaths.length; h++) {
        var updatedFuzzyPaths = buildFuzzyPaths(hobbyPaths[h]);
        fuzzyPaths.splice(h, 1, updatedFuzzyPaths);
        pb.redraw();
      }
    };

    new InputHandler(appContext);

    appContext.toggleVertexVisibility = function () {
      appContext.freedrawLines.forEach(function (polyline) {
        polyline.vertices.forEach(function (vertex) {
          vertex.attr.visible = appContext.config.showVertices;
        });
      });
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // | See `initDemoUI` for details.
    // +-------------------------------
    initDemoUI(appContext);

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    pb.redraw();

    humane.log("Draw a line with your mouse / finger");
  });
})(globalThis);
