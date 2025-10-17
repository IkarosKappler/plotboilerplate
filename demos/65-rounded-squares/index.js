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

    var modal = new Modal();

    var exampleInputString = `
X..........XXXXX
...........X.X.X
...........XX.XX
.......X...X.X.X
...XX.X....XXXXX
.....XX.........
......X.........
.XXX..X...X.X...
.X.X..XXX..X....
.XXX..X...X.X...
......X.........
.....XX.........
......X.........
....XX.X........
X..............X
`;

    var makeBooleanMatrixFromString = function (str, width, height) {
      var matrix = new DataGrid2dArrayMatrix(width, height, false);
      var lines = str.trim().split("\n");
      for (var y = 0; y < lines.length; y++) {
        for (var x = 0; x < lines[y].length; x++) {
          if (y < height && x < width && lines[y].charAt(x) === "X") {
            matrix.set(x, y, true);
          }
        }
      }
      return matrix;
    };

    var matrix = null;
    var paths = null;

    // Create a config: we want to have control about the arrow head size in this demo
    var config = {
      // animate: params.getBoolean("animate", true),
      matrixWidth: 16,
      matrixHeight: 16,
      curveFactor: 0.666,
      squareSize: 20,
      gapSize: 2,
      drawMatrixSquares: true,
      drawActiveMatrixPixels: true,
      drawOrigin: false,
      changeInput: function () {
        insertMatrixString();
      }
    };

    // var squareSize = 20;
    // var gapSize = 2;
    var origin;

    var init = function () {
      matrix = makeBooleanMatrixFromString(exampleInputString, config.matrixWidth, config.matrixHeight);
      origin = {
        x: (-(config.squareSize + config.gapSize) * matrix.xSegmentCount - config.gapSize) / 2,
        y: (-(config.squareSize + config.gapSize) * matrix.ySegmentCount - config.gapSize) / 2
      };
      paths = [];
      findPaths(matrix);
    };

    var findPaths = function (matrix) {
      paths = pixelCornersToRoundPaths(matrix, {
        squareSize: config.squareSize,
        gapSize: config.gapSize,
        origin: origin,
        curveFactor: config.curveFactor
      });
    };

    var preDraw = function (draw, fill) {
      contentList.drawHighlighted(draw, fill);
      if (config.drawOrigin) {
        draw.crosshair(origin, config.squareSize / 2, "grey", 1);
      }
      for (var x = 0; x < matrix.xSegmentCount; x++) {
        // console.log("x", x);
        for (var y = 0; y < matrix.ySegmentCount; y++) {
          var value = matrix.get(x, y);
          var squareBox = getSquareBox(x, y);
          if (config.drawMatrixSquares && !(config.drawActiveMatrixPixels && value)) {
            fill.square(
              { x: squareBox.min.x + config.squareSize / 2, y: squareBox.min.y + config.squareSize / 2 },
              squareBox.width,
              "rgba(0,128,128,0.2)"
            );
          }
          if (config.drawActiveMatrixPixels && value) {
            fill.square(
              { x: squareBox.min.x + config.squareSize / 2, y: squareBox.min.y + config.squareSize / 2 },
              squareBox.width,
              "rgba(0,128,128,0.5)"
            );
          }
        }
      }
    }; // END preDraw

    var postDraw = function (draw, fill) {
      contentList.drawHighlighted(draw, fill);
      for (var i = 0; i < paths.length; i++) {
        var pathData = paths[i];
        draw.path(pathData, "red", 1);
      }
    }; // END postDraw

    var getSquareBox = function (x, y) {
      return new Bounds(
        {
          x: origin.x + x * (config.squareSize + config.gapSize),
          y: origin.y + y * (config.squareSize + config.gapSize)
        },
        {
          x: origin.x + x * (config.squareSize + config.gapSize) + config.squareSize,
          y: origin.y + y * (config.squareSize + config.gapSize) + config.squareSize
        }
      );
    };

    // +---------------------------------------------------------------------------------
    // | This is the callback to use when the user wants to insert
    // | path data into the dialog (modal).
    // +-------------------------------
    var insertMatrixString = function () {
      var textarea = document.createElement("textarea");
      textarea.style.width = "100%";
      textarea.style.height = "50vh";
      textarea.innerHTML = exampleInputString;
      modal.setTitle("Insert Path data (the 'd' string)");
      modal.setFooter("");
      modal.setActions([
        Modal.ACTION_CANCEL,
        {
          label: "Load data",
          action: function () {
            // loadPathData(textarea.value);
            exampleInputString = textarea.value;
            init();
            modal.close();
            pb.redraw();
          }
        }
      ]);
      modal.setBody(textarea);
      modal.open();
    };
    // insertMatrixString();

    // +---------------------------------------------------------------------------------
    // | Create a GUI.
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      // gui.add(config, "animate").name("animate").title("Animate the ray?")
      //   .onChange( function() { toggleAnimation(); });
      // prettier-ignore
      gui.add(config, "matrixWidth").min(1).max(100).step(1).name("matrixWidth").title("The width of the pixel matrix.")
        .onChange( function() { init(); pb.redraw() });
      // prettier-ignore
      gui.add(config, "matrixHeight").min(1).max(100).step(1).name("matrixHeight").title("TThe height of the pixel matrix.")
      .onChange( function() { init(); pb.redraw() });
      // prettier-ignore
      gui.add(config, "curveFactor").min(-0.5).max(1.666).step(0.01).name("curveFactor").title("The roundness of the curves.")
        .onChange( function() { init(); pb.redraw() });
      // prettier-ignore
      gui.add(config, "drawOrigin").name("drawOrigin").title("Draw the origin?")
        .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "drawMatrixSquares").name("drawMatrixSquares").title("Draw all matrix squares?")
        .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "drawActiveMatrixPixels").name("drawActiveMatrixPixels").title("Draw active matrix squares?")
        .onChange( function() { pb.redraw(); });
      // prettier-ignore
      gui.add(config, "changeInput").title("Define your own pattern.");
    }
    pb.config.preDraw = preDraw;
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
