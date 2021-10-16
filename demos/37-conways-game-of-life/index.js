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

const { getCombinedNodeFlags } = require("typescript");

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
        
        cellWidth: 32,
        cellHeight: 32,
        borderSize: 2,

        // mazeWidth: 60,
        // mazeHeight: 40,

        drawPathTraces: true,
        wallColor: "#880088",
        deadEndWallColor: "#b84800",
        traceColor: "#0088a8",
        lightningColor: "#ffffff",

        falloff: 1,

        reset: function () {
          config.animate = false;
          removeTraces();
          initQueue();
          visualizeSolution();
        },
        rebuildMaze: function () {
          rebuildBiotope();
        }
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Fetch the SVG node.
    // +-------------------------------
    var svgNode = document.getElementById("my-canvas");
    var canvasSize = null;
    // var squareSize = null;
    var tosvgDraw = null;
    var tosvgFill = null;
    var biotopeSize = { w : 0, h : 0 };

    // +---------------------------------------------------------------------------------
    // | Initialize the draw library for SVG rendering: width and height and style defs.
    // +-------------------------------
    var initSvgCanvas = function () {
      canvasSize = getAvailableContainerSpace(svgNode);
      tosvgDraw = new drawutilssvg(
        svgNode,
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        canvasSize,
        false, // fillShapes=false
        drawConfig // see file drawConfig.js
      );
      tosvgFill = tosvgDraw.copyInstance(true); // fillShapes=true
      // squareSize = {
      //   w: canvasSize.width / config.mazeWidth,
      //   h: canvasSize.height / config.mazeHeight
      // };
      // var innerSquareSize = {
      //   w: squareSize.w - config.borderSize,
      //   h: squareSize.h - config.borderSize
      // };
      biotopeSize.width = Math.floor( canvasSize.width / config.cellWidth );
      biotopeSize.height = Math.floor( canvasSize.height / config.cellHeight );
      // var styleDefs = makeCustomStyleDefs(config, innerSquareSize);
      // tosvgDraw.addCustomStyleDefs(styleDefs);
    };

    // Array<number[]>
    var biotope = [];

    // +---------------------------------------------------------------------------------
    // | This function rebuilds the maze and renders it onto the SVG canvas.
    // | The old SVG data is cleared.
    // +-------------------------------
    var rebuildBiotope = function () {
      config.animate = false;
      // Just remove all child nodes from the SVG an re-initialize everything from scratch.
      removeAllChildNodes(svgNode);
      // This initializes the maze structure and draws the walls on the SVG canvas.
      initBiotope();
     
      // TODO: initialize the creatures here
      // initCreatues();
    };

    // +---------------------------------------------------------------------------------
    // | Ths function computes the biotope and renders it.
    // +-------------------------------
    var initBiotope = function () {
      initSvgCanvas();
      tosvgDraw.beginDrawCycle();
      tosvgFill.beginDrawCycle();
      tosvgFill.curClassName = "background";
      tosvgFill.rect({ x: 0, y: 0 }, canvasSize.width, canvasSize.height, "#888888", 0);
      biotope = [];
      for (var j = 0; j < biotopeSize.height; j++) {
        biotope.push([]);
        for (var i = 0; i < biotopeSize.width; i++) {

          // Make square and add respective classes to visualize the borders.
          tosvgFill.curClassName = "cell"
          tosvgFill.curId = "cell-" + j + "-" + i;
          tosvgFill.rect(
            { x: i * config.cellWidth, y: j * config.cellHeight },
            config.cellWidth - config.borderSize,
            config.cellHeight - config.borderSize,
            "#ffffff",
            1
          );
        }
      }
      tosvgDraw.endDrawCycle();
      tosvgFill.endDrawCycle();
    };

    var initCreatures = function ( ){
      // var center = { x : Math.floor( biotopeSize.width/2 ) };
    }

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


    // +---------------------------------------------------------------------------------
    // | Visualize the algorithms (partial) solution inside the SVG.
    // | This just means that the rectangles are filled with different shades
    // | to indicate the current frontiers.
    // +-------------------------------
    var visualizeCreatures = function () {
      for (var j = 0; j < solutionMatrix.length; j++) {
        for (var i = 0; i < solutionMatrix[j].length; i++) {
          // var ratio = Math.max(0, solutionMatrix[j][i].step / stepNumber) * 0.5;
          var ratio =
            Math.max(0, Math.pow(solutionMatrix[j][i].step, config.falloff) / Math.pow(stepNumber, config.falloff)) * 0.5;
          var rectangle = document.getElementById("rect-" + j + "-" + i);
          rectangle.setAttribute("fill", "rgba(255,255,255," + ratio + ")");
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | If a shortest path (the final solution) was found after the the algorithm
    // | terminated then this function highlights that path by coloring the
    // | affetced rectangles with a bright color.
    // +-------------------------------
    // var visualizeTrace = function () {
    //   // Visualize solution
    //   var entry = terminationEntry;
    //   while (entry) {
    //     var i = entry.i;
    //     var j = entry.j;
    //     var rectangle = document.getElementById("rect-" + j + "-" + i);
    //     rectangle.setAttribute("fill", config.lightningColor);
    //     entry = solutionMatrix[j][i].predecessor;
    //   }
    // };

    // +---------------------------------------------------------------------------------
    // | Calculates the next step of the BFS: all rectangles on the current frontier
    // | checks for non-visited rectangles and marks them to use as the new frontier
    // | in the next iteration.
    // +-------------------------------
    var nextStep = function () {
      // Calculate next iteration of the breadth-first-algorithm
      stepNumber++;
      
      // TODO: evaluate
    };

    // +---------------------------------------------------------------------------------
    // | Visualize a single trace from one maze position to the next.
    // | The function adds new <line> elements to the SVG!
    // +-------------------------------
    // var makeTrace = function (fromJ, fromI, toJ, toI) {
    //   var fromRect = document.getElementById("rect-" + fromJ + "-" + fromI);
    //   var toRect = document.getElementById("rect-" + toJ + "-" + toI);
    //   var centerFrom = {
    //     x: parseFloat(fromRect.getAttribute("x")) + parseFloat(fromRect.getAttribute("width")) / 2,
    //     y: parseFloat(fromRect.getAttribute("y")) + parseFloat(fromRect.getAttribute("height")) / 2
    //   };
    //   var centerTo = {
    //     x: parseFloat(toRect.getAttribute("x")) + parseFloat(toRect.getAttribute("width")) / 2,
    //     y: parseFloat(toRect.getAttribute("y")) + parseFloat(toRect.getAttribute("height")) / 2
    //   };

    //   tosvgDraw.curClassName = "trace";
    //   // Note that outside draw cycles this will have no effect!
    //   // The elements are just stored inside the libraries internal buffer and would
    //   // become visible on the next draw cycle ... but ... there is none: once
    //   // the rectangles where drawn the draw cycle has ended.
    //   var lineNode = tosvgDraw.line(centerFrom, centerTo, config.traceColor, 1.0);
    //   svgNode.getElementsByTagName("g")[0].appendChild(lineNode);
    // };


    // +---------------------------------------------------------------------------------
    // | Removed the traces withour clearing the whole SVG.
    // +-------------------------------
    // var removeTraces = function () {
    //   removeChildNodesByClass(svgNode.getElementsByTagName("g")[0], "trace");
    // };

    // +---------------------------------------------------------------------------------
    // | This function is called on each frame draw.
    // +-------------------------------
    var renderLoop = function (_time) {
      if (!config.animate) {
        return;
      }
      // Animate here
      window.setTimeout(function () {
        nextStep();
        visualizeCreatures();
        window.requestAnimationFrame(renderLoop);
      }, config.animationDelay);
    };

    // +---------------------------------------------------------------------------------
    // | Starts the animation if it's not yet running.
    // +-------------------------------
    var startAnimation = function () {
      if (!config.animate) {
        return;
      }
      // removeTraces();
      // initializeCreatures();
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

    f0.add(config, "borderSize").min(0).max(10).step(1).title("borderSize").onChange(rebuildBiotope);
    f0.add(config, "cellWidth").min(2).max(100).title("cellWidth").onChange(rebuildBiotope);
    f0.add(config, "cellHeight").min(2).max(100).title("cellHeight").onChange(rebuildBiotope);

    f0.add(config, "drawPathTraces").listen().title("Draw path traces?");
    // f0.addColor(config, "wallColor").title("The wall color.").onChange(rebuildBiotope);
    // f0.addColor(config, "deadEndWallColor").title("The 'dead end' wall color.").onChange(rebuildBiotope);
    // f0.addColor(config, "traceColor").title("The trace color.").onChange(rebuildBiotope);
    // f0.addColor(config, "lightningColor").title("The lightning color.").onChange(visualizeTrace);

    f0.add(config, "falloff").min(1).max(10).step(0.25).title("falloff").onChange(visualizeCreatures);

    f0.add(config, "reset");
    f0.add(config, "rebuildMaze");

    f0.open();

    initBiotope();
    // printMazeMatrix(); // Used for debugging.
    initCreatures();
    visualizeCreatures();
    startAnimation();
  });
})(window);
