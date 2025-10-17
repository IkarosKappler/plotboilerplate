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

    var LEFT_BORDER = 0;
    var TOP_BORDER = 1;
    var RIGHT_BORDER = 2;
    var BOTTOM_BORDER = 3;

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
      matrix.set(3, 4, true);
      matrix.set(4, 4, true);
      matrix.set(6, 4, true);
      matrix.set(7, 3, true);
      matrix.set(5, 5, true);
      matrix.set(6, 5, true);

      matrix.set(6, 6, true);
      matrix.set(6, 7, true);
      matrix.set(6, 8, true);
      matrix.set(7, 8, true);
      matrix.set(8, 8, true);

      // 'Circle'
      matrix.set(1, 7, true);
      matrix.set(2, 7, true);
      matrix.set(3, 7, true);
      matrix.set(1, 8, true);
      matrix.set(3, 8, true);
      matrix.set(1, 9, true);
      matrix.set(2, 9, true);
      matrix.set(3, 9, true);

      matrix.set(10, 7, true);
      matrix.set(11, 8, true);
      matrix.set(10, 9, true);
      matrix.set(12, 7, true);
      matrix.set(12, 9, true);

      matrix.set(6, 9, true);
      matrix.set(6, 10, true);

      matrix.set(6, 11, true);
      matrix.set(5, 11, true);
      matrix.set(4, 12, true);
      matrix.set(3, 12, true);
      matrix.set(6, 12, true);
      matrix.set(7, 13, true);

      origin = {
        x: (-(squareSize + gapSize) * matrix.xSegmentCount - gapSize) / 2,
        y: (-(squareSize + gapSize) * matrix.ySegmentCount - gapSize) / 2
      };

      paths = [];
      findPaths(matrix);
    };

    var findPaths = function (matrix) {
      var visitedMatrix = new DataGrid2dArrayMatrix(matrix.xSegmentCount, matrix.ySegmentCount, false);

      // Find an unvisited pixel with a free left neighbour
      var condition = function (value, x, y, _matrix) {
        return (
          value === true &&
          visitedMatrix.get(x, y) === false &&
          // is left neighbour free?
          (x - 1 < 0 || _matrix.get(x - 1, y) === false)
        );
      };

      var nonVisitedPosition;
      var safetyLimit = matrix.xSegmentCount * matrix.ySegmentCount + 1;
      var i = 0;
      while ((nonVisitedPosition = matrix.find(condition)) && i++ < safetyLimit) {
        console.log("nonVisitedPosition", nonVisitedPosition);

        // if (nonVisitedPosition) {
        // Condition: if a point was found then its left neighbour is empty.
        //            So by this the current pixel's left bound is definitely a path start.
        var squareBox = getSquareBox(nonVisitedPosition.xIndex, nonVisitedPosition.yIndex);
        var west = squareBox.getWestPoint();
        var pathData = [
          // Start point
          "M",
          west.x,
          west.y
        ];
        __constructPath(pathData, matrix, visitedMatrix, nonVisitedPosition, LEFT_BORDER);
        paths.push(pathData);
        console.log("pathData", pathData);
        // }
      }
    };

    // Lerp between these two numbers using the lerp amount from the config.
    var lerp = function (a, b) {
      return a + (b - a) * config.curveFactor;
    };

    var addRoundCorner = function (pathData, start, corner, end) {
      pathData.push(
        "C",
        lerp(start.x, corner.x),
        lerp(start.y, corner.y),
        lerp(end.x, corner.x),
        lerp(end.y, corner.y),
        end.x,
        end.y
      );
    };

    var addStraightLine = function (pathData, target) {
      pathData.push("L", target.x, target.y);
    };

    var __constructPath = function (pathData, matrix, visitedMatrix, startingPosition, startingBorderDirection) {
      // Pre: position's neighbour pixel at ehe given border direction is unset.
      var isPathComplete = false;
      var maxInterations = matrix.xSegmentCount * matrix.ySegmentCount * 4 + 1;
      var i = 0;
      var position = startingPosition;
      var borderDirection = startingBorderDirection;

      while (!isPathComplete && i++ < maxInterations) {
        var x = position.xIndex;
        var y = position.yIndex;
        visitedMatrix.set(x, y, true);
        // Get the pixel's box bounds.
        var squareBox = getSquareBox(x, y);
        // Find next step when walking 'clockwise'
        if (borderDirection === LEFT_BORDER) {
          // We want to expand the left border
          var west = squareBox.getWestPoint();
          // Pixel in the north?
          if (y - 1 < 0 || matrix.get(x, y - 1) === false) {
            // Northwise pixel is empty
            //  -> construct round corner to right
            addRoundCorner(pathData, west, squareBox.getNorthWestPoint(), squareBox.getNorthPoint());
            borderDirection = TOP_BORDER;
            // Keep pixel position unchanged
          } else if (x - 1 >= 0 && matrix.get(x - 1, y - 1) === true) {
            // Top neighbour pixel is set AND top-left pixel is set tpo.
            // -> construct rounded edge to top-left.
            var squareBoxNW = getSquareBox(x - 1, y - 1);
            addRoundCorner(pathData, west, squareBox.getNorthWestPoint(), squareBoxNW.getSouthPoint());
            borderDirection = BOTTOM_BORDER;
            position = { xIndex: x - 1, yIndex: y - 1 };
          } else {
            // Straight to top
            var squareBoxN = getSquareBox(x, y - 1);
            addStraightLine(pathData, squareBoxN.getWestPoint());
            position = { xIndex: x, yIndex: y - 1 };
            // Keep borderDirection: LEFT_BORDER
            // isPathComplete = true; // TODO
          }
        } else if (borderDirection === TOP_BORDER) {
          // North pixel is definitely empty.
          var north = squareBox.getNorthPoint();
          if (x + 1 >= matrix.xSegmentCount || matrix.get(x + 1, y) === false) {
            // Top border and right pixel is empty
            //  --> create rounded corner to right south
            addRoundCorner(pathData, north, squareBox.getNorthEastPoint(), squareBox.getEastPoint());
            borderDirection = RIGHT_BORDER;
            // Keep pixel position unchanged
          } else if (y - 1 >= 0 && matrix.get(x + 1, y - 1) === false) {
            // Top border and right pixel is set, and north-east pixel is clear.
            // -> linear path to right
            var squareBoxE = getSquareBox(x + 1, y);
            addStraightLine(pathData, squareBoxE.getNorthPoint());
            position = { xIndex: x + 1, yIndex: y };
            // Keep borderDirection TOP
          } else {
            // Last case: right neighbour is set and north-east pixel is set
            //-> construct a rounded corner to east-north.
            var squareBoxNE = getSquareBox(x + 1, y - 1);
            addRoundCorner(pathData, north, squareBox.getNorthEastPoint(), squareBoxNE.getWestPoint());
            borderDirection = LEFT_BORDER;
            position = { xIndex: x + 1, yIndex: y - 1 };
            // isPathComplete = true; // TODO!!!
          }
        } else if (borderDirection === RIGHT_BORDER) {
          // East pixel is definitely empty.
          var east = squareBox.getEastPoint();
          if (y + 1 >= matrix.ySegmentCount || matrix.get(x, y + 1) === false) {
            // South pixel is empty.
            // -> construct rounded corner to south-east
            addRoundCorner(pathData, east, squareBox.getSouthEastPoint(), squareBox.getSouthPoint());
            borderDirection = BOTTOM_BORDER;
            // Keep pixel position unchanged
          } else if (x + 1 < matrix.xSegmentCount && y + 1 < matrix.ySegmentCount && matrix.get(x + 1, y + 1) === true) {
            // South pixel is set AND right lower pixel is set, too.
            // -> construct round corner to south-east.
            var squareBoxSE = getSquareBox(x + 1, y + 1);
            addRoundCorner(pathData, east, squareBox.getSouthEastPoint(), squareBoxSE.getNorthPoint());
            borderDirection = TOP_BORDER;
            position = { xIndex: x + 1, yIndex: y + 1 };
          } else {
            // South pixel is set and south-east pixel is clear.
            // -> construct linear connection to south
            var squareBoxS = getSquareBox(x, y + 1);
            addStraightLine(pathData, squareBoxS.getEastPoint());
            position = { xIndex: x, yIndex: y + 1 };
            // Keep borderDirection RIGHT
          }
        } else if (borderDirection === BOTTOM_BORDER) {
          // Pre: south pixel is definitely empty
          var south = squareBox.getSouthPoint();
          if (x - 1 < 0 || matrix.get(x - 1, y) === false) {
            // Left pixel is empty
            // -> construct round corner to west-north
            addRoundCorner(pathData, south, squareBox.getSouthWestPoint(), squareBox.getWestPoint());
            borderDirection = LEFT_BORDER;
          } else if (x - 1 >= 0 && y + 1 < matrix.ySegmentCount && matrix.get(x - 1, y + 1) === true) {
            // Left pixel AND left lower pixel are set
            // -> construct rounded edge to south-west
            var squareBoxSW = getSquareBox(x - 1, y + 1);
            addRoundCorner(pathData, south, squareBox.getSouthWestPoint(), squareBoxSW.getEastPoint());
            borderDirection = RIGHT_BORDER;
            position = { xIndex: x - 1, yIndex: y + 1 };
          } else {
            // Left pixel is set AND south pixel is empty
            // -> construct linear edge to left neighbour.
            var squareBoxW = getSquareBox(x - 1, y);
            addStraightLine(pathData, squareBoxW.getSouthPoint());
            position = { xIndex: x - 1, yIndex: y };
            // Keep borderDirection BOTTOM
          }
        } else {
          console.warn(`[Error] Cannot construct full rounded path; 'borderDirection' has wrong value (${borderDirection}).`);
          isPathComplete = true;
        }

        // End condition reached?
        if (
          startingPosition.xIndex === position.xIndex &&
          startingPosition.yIndex === position.yIndex &&
          startingBorderDirection === borderDirection
        ) {
          pathData.push("Z");
          isPathComplete = true;
        }
      }
    };

    var constructPath = function (matrix, visitedMatrix, initialPosition) {
      var squareBox = getSquareBox(initialPosition.xIndex, initialPosition.yIndex);
      var west = squareBox.getWestPoint();
      var north = squareBox.getNorthPoint();
      var east = squareBox.getEastPoint();
      var south = squareBox.getSouthPoint();
      var northWest = squareBox.getNorthWestPoint();
      var northEast = squareBox.getNorthEastPoint();
      var southEast = squareBox.getSouthEastPoint();
      var southWest = squareBox.getSouthWestPoint();
      var pathData = [
        // Start point
        "M",
        west.x,
        west.y
      ];
      addRoundCorner(pathData, west, northWest, north);
      addRoundCorner(pathData, north, northEast, east);
      addRoundCorner(pathData, east, southEast, south);
      addRoundCorner(pathData, south, southWest, west);
      pathData.push("Z");

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
        // console.log("x", x);
        for (var y = 0; y < matrix.ySegmentCount; y++) {
          var value = matrix.get(x, y);
          var squareBox = getSquareBox(x, y);
          fill.square(
            { x: squareBox.min.x + squareSize / 2, y: squareBox.min.y + squareSize / 2 },
            squareBox.width,
            value ? "rgba(0,128,128,0.5)" : "rgba(0,128,128,0.2)"
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
      gui.add(config, "curveFactor").min(0.0).max(1.333).step(0.01).name("curveFactor").title("The roundness of the curves.")
        .onChange( function() { init(); pb.redraw() });
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
