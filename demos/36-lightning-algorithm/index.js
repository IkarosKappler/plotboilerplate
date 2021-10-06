/**
 * A demo to visualize the 'lightning algorithm' as depicted in Numberphile's
 * and Matt Henderson's video:
 * https://www.youtube.com/watch?v=akZ8JJ4gGLs
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 * @requires draw
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-10-04
 * @version     1.0.0
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  let GUP = gup();

  window.addEventListener("load", function () {
    // THIS DEMO WORKS A BIT DIFFERENT THAN THE OTHERS.
    // IT DOES NOT USE AN EXPLICIT INSTANCE OF PLOTBOILERPLATE
    // BUT RATHER SOME SUB MODULES FOR SVG DRAWING.

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        animate: true,
        animationDelay: 150,
        startPointDensity: 100.0, // percent

        verticalWallPropability: 0.33,
        horizontalWallPropability: 0.55,

        borderSize: 2,

        mazeWidth: 60,
        mazeHeight: 40,

        drawPathTraces: true,
        wallColor: "#880088",
        deadEndWallColor: "#b84800",
        traceColor: "#0088a8",

        reset: function () {
          config.animate = false;
          removeTraces();
          initQueue();
        },
        rebuildMaze: function () {
          rebuildMaze();
        }
      },
      GUP
    );

    // Fetch the SVG node
    var svgNode = document.getElementById("my-canvas");
    var canvasSize = null; // getAvailableContainerSpace(svgNode);
    var squareSize = null;
    var tosvgDraw = null;
    var tosvgFill = null;

    var initSvgCanvas = function () {
      canvasSize = getAvailableContainerSpace(svgNode);
      // console.log(getAvailableContainerSpace(svgNode));
      tosvgDraw = new drawutilssvg(
        svgNode,
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        canvasSize,
        false, // fillShapes=false
        drawConfig // see file drawConfig.js
      );
      tosvgFill = tosvgDraw.copyInstance(true); // fillShapes=true
      squareSize = {
        w: canvasSize.width / config.mazeWidth,
        h: canvasSize.height / config.mazeHeight
      };

      // var borderSize = 6;
      var innerSquareSize = {
        w: squareSize.w - config.borderSize,
        h: squareSize.h - config.borderSize
      };

      var styleDefs = makeCustomStyleDefs(config, innerSquareSize);
      tosvgDraw.addCustomStyleDefs(styleDefs);
    };

    // Some constants to define the borders.
    var BORDER_NONE = 0;
    var BORDER_LEFT = 1;
    var BORDER_RIGHT = 2;
    var BORDER_BOTTOM = 4;
    var BORDER_TOP = 8;

    // Array<number[]>
    var mazeMatrix = [];

    var rebuildMaze = function () {
      config.animate = false;
      // Just remove all child nodes from the SVG an re-initialize everything from scratch.
      removeAllChildNodes(svgNode);
      // This initializes the maze structure and draws the walls on the SVG canvas.
      initMaze();
      // This initializes the algorithm's queue.
      initQueue();
    };

    var initMaze = function () {
      initSvgCanvas();
      tosvgDraw.beginDrawCycle();
      tosvgFill.beginDrawCycle();
      tosvgFill.curClassName = "background";
      tosvgFill.rect({ x: 0, y: 0 }, canvasSize.width, canvasSize.height, "#888888", 0);
      mazeMatrix = [];
      //   for (var i = 0; i < config.mazeWidth; i++) {
      for (var j = 0; j < config.mazeHeight; j++) {
        mazeMatrix.push([]);
        // for (var j = 0; j < config.mazeHeight; j++) {
        for (var i = 0; i < config.mazeWidth; i++) {
          // Define the square's borders
          var borders = BORDER_NONE;
          if (i == 0 || (i - 1 >= 0 && mazeMatrix[j][i - 1] & BORDER_RIGHT)) {
            borders |= BORDER_LEFT;
          }
          if (i + 1 == config.mazeWidth || Math.random() < config.verticalWallPropability) {
            //} 0.66) {
            borders |= BORDER_RIGHT;
          }
          if (j + 1 >= config.mazeHeight || Math.random() < config.horizontalWallPropability) {
            borders |= BORDER_BOTTOM;
          }
          if (j === 0 || (j - 1 >= 0 && mazeMatrix[j - 1][i] & BORDER_BOTTOM)) {
            borders |= BORDER_TOP;
          }

          mazeMatrix[j].push(borders);

          // Make square and add respective classes to visualize the borders.
          tosvgFill.curClassName =
            "b" +
            (borders & BORDER_TOP ? "-top" : "-none") +
            (borders & BORDER_RIGHT ? "-right" : "-none") +
            (borders & BORDER_BOTTOM ? "-bottom" : "-none") +
            (borders & BORDER_LEFT ? "-left" : "-none");
          tosvgFill.curId = "rect-" + j + "-" + i;
          tosvgFill.rect(
            { x: i * squareSize.w, y: j * squareSize.h },
            squareSize.w - config.borderSize,
            squareSize.h - config.borderSize,
            "#000000",
            1
          );
        }
      }
      tosvgDraw.endDrawCycle();
      tosvgFill.endDrawCycle();
    };

    // interface MazeEntry {
    //  i: number;
    //  j: number;
    // }

    // Array<MazeEntry>
    var queue = [];
    // Array<Array<{ step: number, predecessor: undefined | MazeEntry }>>
    var solutionMatrix = [];
    // number
    var stepNumber = 1;
    // MazeEntry
    var terminationEntry = null;
    var initQueue = function () {
      //   console.log("mazeMatrix", mazeMatrix);
      solutionMatrix = [];
      queue = [];
      stepNumber = 1;
      terminationEntry = null;
      for (var j = 0; j < mazeMatrix.length; j++) {
        // console.log("xyxy", i, mazeMatrix[i].length);
        solutionMatrix.push([]);
        for (var i = 0; i < mazeMatrix[j].length; i++) {
          var isStartingPoint = j === 0 && Math.random() * 100 < config.startPointDensity;
          solutionMatrix[j].push({ step: isStartingPoint ? stepNumber : 0 }); // 0); // j === 0 ? 1 : 0);
          if (isStartingPoint) {
            queue.push({ i: i, j: j });
          }
        }
      }
    };

    var visualizeSolution = function () {
      for (var j = 0; j < solutionMatrix.length; j++) {
        for (var i = 0; i < solutionMatrix[j].length; i++) {
          var ratio = Math.max(0, solutionMatrix[j][i].step / stepNumber) * 0.5;
          var rectangle = document.getElementById("rect-" + j + "-" + i);
          rectangle.setAttribute("fill", "rgba(255,255,255," + ratio + ")");
        }
      }
    };

    var visualizeTrace = function () {
      // Visualize solution
      while (terminationEntry) {
        var i = terminationEntry.i;
        var j = terminationEntry.j;

        var ratio = 1.0;
        var rectangle = document.getElementById("rect-" + j + "-" + i);
        rectangle.setAttribute("fill", "rgba(255,255,255," + ratio + ")");

        terminationEntry = solutionMatrix[j][i].predecessor;
      }
    };

    var nextStep = function () {
      // Calculate next iteration of the breadth-first-algorithm
      stepNumber++;
      var newSolutionBuffer = [];

      for (var k = 0; k < queue.length; k++) {
        // Find ways that are not blocked
        var tuple = queue[k];
        var i = tuple.i;
        var j = tuple.j;
        var leftOrRight = false;
        if (j - 1 >= 0 && !(mazeMatrix[j][i] & BORDER_TOP) && !visited(j - 1, i)) {
          // Mark the next reachable entry to the top
          solutionMatrix[j - 1][i].step = stepNumber;
          solutionMatrix[j - 1][i].predecessor = { j: j, i: i };
          newSolutionBuffer.push({ i: i, j: j - 1 });
          config.drawPathTraces && makeTrace(j, i, j - 1, i);
        }
        if (i - 1 >= 0 && !(mazeMatrix[j][i] & BORDER_LEFT) && !visited(j, i - 1)) {
          // Mark the next reachable entry
          solutionMatrix[j][i - 1].step = stepNumber;
          solutionMatrix[j][i - 1].predecessor = { j: j, i: i };
          newSolutionBuffer.push({ i: i - 1, j: j });
          leftOrRight = true;
          config.drawPathTraces && makeTrace(j, i, j, i - 1);
        }
        if (i + 1 < mazeMatrix[j].length && !(mazeMatrix[j][i] & BORDER_RIGHT) && !visited(j, i + 1)) {
          // Mark the next reachable entry
          solutionMatrix[j][i + 1].step = stepNumber;
          solutionMatrix[j][i + 1].predecessor = { j: j, i: i };
          newSolutionBuffer.push({ i: i + 1, j: j });
          leftOrRight = true;
          config.drawPathTraces && makeTrace(j, i, j, i + 1);
        }
        if (j + 1 < mazeMatrix.length && !(mazeMatrix[j][i] & BORDER_BOTTOM) && !visited(j + 1, i)) {
          // Mark the next reachable entry
          solutionMatrix[j + 1][i].step = stepNumber;
          solutionMatrix[j + 1][i].predecessor = { j: j, i: i };
          newSolutionBuffer.push({ i: i, j: j + 1 });
          config.drawPathTraces && makeTrace(j, i, j + 1, i);
        }

        if (j + 1 >= mazeMatrix.length) {
          // This will terminate the search algorithm
          terminationEntry = { j: j, i: i };
        }
      }
      queue = newSolutionBuffer;
    };

    var makeTrace = function (fromJ, fromI, toJ, toI) {
      var fromRect = document.getElementById("rect-" + fromJ + "-" + fromI);
      var toRect = document.getElementById("rect-" + toJ + "-" + toI);
      var centerFrom = {
        x: parseFloat(fromRect.getAttribute("x")) + parseFloat(fromRect.getAttribute("width")) / 2,
        y: parseFloat(fromRect.getAttribute("y")) + parseFloat(fromRect.getAttribute("height")) / 2
      };
      var centerTo = {
        x: parseFloat(toRect.getAttribute("x")) + parseFloat(toRect.getAttribute("width")) / 2,
        y: parseFloat(toRect.getAttribute("y")) + parseFloat(toRect.getAttribute("height")) / 2
      };

      tosvgDraw.curClassName = "trace";
      // Note that outside draw cycles this will have no effect!
      var lineNode = tosvgDraw.line(centerFrom, centerTo, config.traceColor, 1.0);
      svgNode.getElementsByTagName("g")[0].appendChild(lineNode);
    };

    var visited = function (j, i) {
      return solutionMatrix[j][i].step !== 0;
    };

    var removeTraces = function () {
      removeChildNodesByClass(svgNode.getElementsByTagName("g")[0], "trace");
    };

    var renderLoop = function (_time) {
      if (!config.animate) {
        return;
      }
      // Animate here
      if (terminationEntry) {
        visualizeTrace();
      } else if (queue.length === 0) {
        // If the queue ran empty then there exists no path in the maze!
        console.log("There exists no solution in the maze!");
      } else {
        window.setTimeout(function () {
          nextStep();
          visualizeSolution();
          window.requestAnimationFrame(renderLoop);
        }, config.animationDelay);
      }
    };

    var startAnimation = function () {
      if (!config.animate) {
        return;
      }
      initQueue();
      renderLoop();
    };

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = new dat.gui.GUI();
    gui.remember(config);
    var f0 = gui.addFolder("Lightning algorithm");

    f0.add(config, "animate").listen().title("Toggle animation on/off.").onChange(startAnimation);
    f0.add(config, "animationDelay").min(10).max(1000).title("The delay in milliseconds between frames.");
    f0.add(config, "startPointDensity").min(1).max(100).title("The propability that a point in the first row is a start point.");

    f0.add(config, "horizontalWallPropability").min(0.0).max(1.0).title("horizontalWallPropability").onChange(rebuildMaze);
    f0.add(config, "verticalWallPropability").min(0.0).max(1.0).title("verticalWallPropability").onChange(rebuildMaze);

    f0.add(config, "borderSize").min(0).max(10).step(1).title("borderSize").onChange(rebuildMaze);
    f0.add(config, "mazeWidth").min(2).max(100).title("mazeWidth").onChange(rebuildMaze);
    f0.add(config, "mazeHeight").min(2).max(100).title("mazeHeight").onChange(rebuildMaze);

    f0.add(config, "drawPathTraces").listen().title("Draw path traces?"); // onChange(startAnimation);
    f0.addColor(config, "wallColor").title("The wall color.").onChange(rebuildMaze);
    f0.addColor(config, "deadEndWallColor").title("The 'dead end' wall color.").onChange(rebuildMaze);
    f0.addColor(config, "traceColor").title("The trace color.").onChange(rebuildMaze);

    f0.add(config, "reset");
    f0.add(config, "rebuildMaze");

    rebuildMaze;
    f0.open();

    initMaze();
    // printMazeMatrix();
    initQueue();
    visualizeSolution();
    startAnimation();
  });
})(window);
