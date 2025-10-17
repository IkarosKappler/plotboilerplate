/**
 * A script for calculating polygon angles and line intersection angles.
 *
 * @author   Ikaros Kappler
 * @date     2025-09-12
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  // TODO: GUI scrollable?!

  // Fetch the GET params
  let GUP = gup();
  const RAD_TO_DEG = 180.0 / Math.PI;
  const DEG_TO_RAD = Math.PI / 180.0;
  _context.addEventListener("load", function () {
    var params = new Params(GUP);
    var isDarkmode = detectDarkMode(GUP);

    // All config params except the canvas are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        { canvas: document.getElementById("my-canvas"), backgroundColor: isDarkmode ? "#000000" : "#ffffff", fullSize: true },
        GUP
      )
    );

    var matrix = null;
    var paths = null;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // animate: params.getBoolean("animate", true),
      matrixWidth: 16,
      matrixHeight: 16,
      curveFactor: 0.666
    };

    var squareSize = 20;
    var gapSize = 2;
    var origin;

    var init = function () {
      // NOOP
      matrix = new DataGrid2dArrayMatrix(config.matrixWidth, config.matrixHeight, false);
      matrix.set(3, 5, true);
      matrix.set(4, 5, true);
      matrix.set(5, 6, true);
      matrix.set(5, 7, true);
      matrix.set(5, 8, true);
      matrix.set(6, 8, true);
      matrix.set(7, 8, true);
      matrix.set(9, 8, true);
      matrix.set(5, 9, true);
      matrix.set(5, 10, true);
      matrix.set(4, 11, true);
      matrix.set(3, 11, true);

      origin = {
        x: (-(squareSize + gapSize) * matrix.xSegmentCount - gapSize) / 2,
        y: (-(squareSize + gapSize) * matrix.ySegmentCount - gapSize) / 2
      };

      paths = [];
      findPaths(matrix);
    };

    var findPaths = function (matrix) {
      var visitedMatrix = new DataGrid2dArrayMatrix(matrix.xSegmentCount, matrix.ySegmentCount, false);

      var condition = function (value, x, y) {
        return value === true && visitedMatrix.get(x, y) === false;
      };
      var nonVisitedPosition = matrix.find(condition);
      console.log("nonVisitedPosition", nonVisitedPosition);

      if (nonVisitedPosition) {
        constructPath(matrix, nonVisitedPosition);
      }
    };

    var lerp = function (a, b, ratio) {
      return a + (b - a) * ratio;
    };

    var constructPath = function (matrix, initialPosition) {
      var squareBox = getSquareBox(initialPosition.xIndex, initialPosition.yIndex);
      var pathData = [
        // Start point
        "M",
        squareBox.getWestPoint().x,
        squareBox.getWestPoint().y,
        // first bezier curve
        "C",
        squareBox.min.x,
        squareBox.min.y,
        squareBox.min.x,
        squareBox.min.y,
        squareBox.getNorthPoint().x,
        squareBox.getNorthPoint().y,
        // second bezier curve
        "C",
        squareBox.max.x,
        squareBox.min.y,
        squareBox.max.x,
        squareBox.min.y,
        squareBox.getEastPoint().x,
        squareBox.getEastPoint().y,
        // second bezier curve
        "C",
        squareBox.max.x,
        squareBox.max.y,
        squareBox.max.x,
        squareBox.max.y,
        squareBox.getSouthPoint().x,
        squareBox.getSouthPoint().y,
        // third bezier curve
        "C",
        squareBox.min.x,
        squareBox.max.y,
        squareBox.min.x,
        squareBox.max.y,
        squareBox.getWestPoint().x,
        squareBox.getWestPoint().y,
        "Z"
      ];
      var lineData = [
        "M",
        squareBox.min.x,
        squareBox.min.y,
        "L",
        squareBox.max.x,
        squareBox.min.y,
        "L",
        squareBox.max.x,
        squareBox.max.y,
        "L",
        squareBox.min.x,
        squareBox.max.y,
        "Z"
      ];
      paths.push(pathData);
      paths.push(lineData);
    };

    var postDraw = function (draw, fill) {
      console.log("postDraw");
      console.log("origin", origin);
      draw.crosshair(origin, squareSize / 2, "grey", 1);
      for (var x = 0; x < matrix.xSegmentCount; x++) {
        console.log("x", x);
        for (var y = 0; y < matrix.ySegmentCount; y++) {
          var value = matrix.get(x, y);
          var squareBox = getSquareBox(x, y);
          fill.square(
            { x: squareBox.min.x + squareSize / 2, y: squareBox.min.y + squareSize / 2 },
            squareBox.width,
            value ? "rgba(0,128,128,0.5)" : "rgba(0,128,128,0.15)"
          );
        }
      }

      for (var i = 0; i < paths.length; i++) {
        var pathData = paths[i];
        draw.path(pathData, "red", 1);
      }
    }; // END postDraw

    var getSquareBox = function (x, y) {
      return new Bounds(
        {
          x: origin.x + x * (squareSize + gapSize),
          y: origin.y + y * (squareSize + gapSize)
        },
        {
          x: origin.x + x * (squareSize + gapSize) + squareSize,
          y: origin.y + y * (squareSize + gapSize) + squareSize
        }
      );
    };

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      // gui.add(config, "animate").name("animate").title("Animate the ray?")
      //   .onChange( function() { toggleAnimation(); });
      // prettier-ignore
      // gui.add(config, "wrapStartEnd").name("wrapStartEnd").title("Wrap around (swap) if start angle is larger than end angle.")
      //   .onChange( function() { pb.redraw() });
    }
    pb.config.postDraw = postDraw;

    // +---------------------------------------------------------------------------------
    // | This renders a content list component on top, allowing to delete or add
    // | new shapes.
    // |
    // | You should add `contentList.drawHighlighted(draw, fill)`  to your draw
    // | routine to see what's currently highlighted.
    // +-------------------------------
    var contentList = new PBContentList(pb);

    // Filter shapes; keep only those of interest here
    pb.addContentChangeListener(function (_shapesAdded, _shapesRemoved) {
      // NOOP
    });

    init();
    pb.redraw();
  });
})(globalThis);
