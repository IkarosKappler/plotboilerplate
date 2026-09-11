/**
 * A script for generating power center and power circle of three given circles.
 *
 * @author   Ikaros Kappler
 * @date     2026-07-31
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  _context.addEventListener("load", function () {
    var DEG_TO_RAD = Math.PI / 180.0;
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

    // Create a config: we want to have control about the arrow head size in this demo
    // `AppContext`: this is an experimental approach to make future event handling easier.
    var SPIRAL_TYPES = ["Ulam", "Archimedean-Sack"];
    var AVAILABLE_SPURS = {
      "none": null,
      "Euler n^2 + n + 17": "n^2 + n + 17",
      "n^2 - n + 41": "n^2 - n + 41",
      "2n^2 + 796n - 79003": "2n^2 + 796n - 79003"
    };
    var appContext = new AppContext(pb, {
      startingNumber: params.getNumber("startingNumber", 1),
      angleStepDeg: params.getNumber("angleStepDeg", 180.0),
      stepInUnits: params.getNumber("stepInUnits", 60.0),
      ulamRadiusStep: params.getNumber("ulamRadiusStep", 18.0),
      circleRadius: params.getNumber("circleRadius", 6.0),
      iterations: params.getNumber("iterations", 100),
      arcThreshold: params.getNumber("arcThreshold", 0.312), // 0.41), // 0.157),
      showSpiralTangents: params.getBoolean("showSpiralTangents", false),
      trimSpiralSegments: params.getBoolean("trimSpiralSegments", true),
      spiralType: params.getString("spiralType", SPIRAL_TYPES[1]),
      lineColorSpiral: params.getString("lineColorSpiral", "#3584e4"),
      lineWidthSpiral: params.getNumber("lineWidthPiral", 1.0),
      spiralLinearSegments: params.getBoolean("spiralLinearSegments", false),
      lineColorPrimeMarker: params.getString("lineColorPrimeMarker", "#ff8800"),
      lineWidthPrimeMarker: params.getNumber("lineWidthPrimeMarker", 1.0),

      showSpiralPath: params.getBoolean("showSpiralPath", true),
      showAllNumbers: params.getBoolean("showAllNumbers", false),
      showSpiralBezierHandles: params.getBoolean("showSpiralBezierHandles", false),
      spiralBezierControlThreshold: params.getNumber("spiralBezierControlThreshold", 0.4),
      showSpiralBezierControlsPoints: params.getBoolean("showSpiralBezierControlsPoints", false),
      showPrimeLabel: params.getBoolean("showPrimeLabel", true),
      showPrimeCircle: params.getBoolean("showPrimeCircle", true),

      selectedSpur: params.getString("selectedSpur", null),

      readme: function () {
        globalThis.displayDemoMeta();
      }
    });
    appContext.isMobile = isMobile;

    // +---------------------------------------------------------------------------------
    // | Global vars
    // +-------------------------------
    var ulamSpiral = new UlamSpiral(appContext, pb);
    var archimedeanSpiral = new ArchimedeanSacksSpiral(appContext, pb);

    // +---------------------------------------------------------------------------------
    // | Triggered after the main draw routine.
    // +-------------------------------
    var postDraw = function (draw, fill) {
      if (appContext.config.spiralType == "Ulam") {
        // drawUlamSpiral(draw, fill);
        ulamSpiral.draw(draw, fill);
      } else if (appContext.config.spiralType == "Archimedean-Sack") {
        // drawRoundEquidistantSpiral(draw, fill);
        archimedeanSpiral.draw(draw, fill);
      }
    };

    // +---------------------------------------------------------------------------------
    // | This method is called before the library starts to draw anything.
    // +-------------------------------
    var preDraw = function (draw, fill) {
      // NOOP
    }; // END preDraw

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // | See `initDemoUI` for details.
    // +-------------------------------
    initDemoUI(appContext, SPIRAL_TYPES, AVAILABLE_SPURS);

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    // var contentList = new PBContentList(pb);

    pb.config.preDraw = preDraw;
    pb.config.postDraw = postDraw;
    // updateHelperCircle();
    pb.redraw();
    humane.log("Chose from different sytles of Ulam spirals.");
  });
})(globalThis);
