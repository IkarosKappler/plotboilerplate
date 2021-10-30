/**
 * A demo to visualize 'Conway's Game Of Life'.
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

        cellWidth: 32,
        cellHeight: 32,
        borderSize: 2,

        // randomizeBiome: false,
        randomizationThreshold: 0.7,

        preset_glider: function () {
          addGliderAt(0, 0);
          visualizeCreatures();
        },

        clear: function () {
          rebuildBiotope(false);
          // if (!config.randomizeBiome) {
          //   initCreatures();
          // }
          visualizeCreatures();
        },
        randomize: function () {
          rebuildBiotope(true);
          // if (!config.randomizeBiome) {
          //   initCreatures();
          // }
          visualizeCreatures();
        },
        nextStep: function () {
          nextStep();
          visualizeCreatures();
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
    var biotopeSize = { width: 0, height: 0 }; // Dimension

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
      biotopeSize.width = Math.floor(canvasSize.width / config.cellWidth);
      biotopeSize.height = Math.floor(canvasSize.height / config.cellHeight);
      // var styleDefs = makeCustomStyleDefs(config, innerSquareSize);
      // tosvgDraw.addCustomStyleDefs(styleDefs);
    };

    // Array<boolean[]>
    var biome = [];
    var stepNumber = 0;

    // +---------------------------------------------------------------------------------
    // | This function rebuilds the maze and renders it onto the SVG canvas.
    // | The old SVG data is cleared.
    // +-------------------------------
    var rebuildBiotope = function (randomizeBiome) {
      config.animate = false;
      // Just remove all child nodes from the SVG an re-initialize everything from scratch.
      removeAllChildNodes(svgNode);
      // This initializes the maze structure and draws the walls on the SVG canvas.
      initBiotope(randomizeBiome);

      // TODO: initialize the creatures here
      // initCreatues();
    };

    // +---------------------------------------------------------------------------------
    // | Ths function computes the biotope and renders it.
    // +-------------------------------
    var initBiotope = function (randomizeBiome) {
      initSvgCanvas();
      tosvgDraw.beginDrawCycle();
      tosvgFill.beginDrawCycle();
      tosvgFill.curClassName = "background";
      tosvgFill.rect({ x: 0, y: 0 }, canvasSize.width, canvasSize.height, "#888888", 0);
      biome = [];
      for (var j = 0; j < biotopeSize.height; j++) {
        var row = [];
        biome.push(row);
        for (var i = 0; i < biotopeSize.width; i++) {
          // Make square and add respective classes to visualize the borders.
          tosvgFill.curClassName = "cell";
          tosvgFill.curId = "cell-" + j + "-" + i;
          tosvgFill.rect(
            { x: i * config.cellWidth, y: j * config.cellHeight },
            config.cellWidth - config.borderSize,
            config.cellHeight - config.borderSize,
            "#ffffff",
            1
          );

          // Init with random pattern?
          if (randomizeBiome) {
            row.push(Math.random() < config.randomizationThreshold);
          } else {
            row.push(false);
          }
        }
      }
      tosvgDraw.endDrawCycle();
      tosvgFill.endDrawCycle();
    };

    // +---------------------------------------------------------------------------------
    // | This function rebuilds the maze and renders it onto the SVG canvas.
    // | The old SVG data is cleared.
    // +-------------------------------
    var setCellAlive = function (position, alive) {
      // console.log("setCellAlive", position);
      if (position.i >= 0 && position.j >= 0 && position.j < biome.length && position.i < biome[position.j].length) {
        biome[position.j][position.i] = alive;
      }
    };
    var relCol = function (i) {
      return i + Math.floor(biotopeSize.width / 2);
    };
    var relRow = function (j) {
      return j + Math.floor(biotopeSize.height / 2);
    };
    var relPos = function (j, i) {
      return { j: relRow(j), i: relCol(i) };
    };
    var addGliderAt = function (j, i) {
      setCellAlive(relPos(j, i + 1), true);
      setCellAlive(relPos(j + 1, i + 2), true);
      setCellAlive(relPos(j + 2, i), true);
      setCellAlive(relPos(j + 2, i + 1), true);
      setCellAlive(relPos(j + 2, i + 2), true);
      console.log("biome", biome);
    };

    // +---------------------------------------------------------------------------------
    // | Visualize the algorithms (partial) solution inside the SVG.
    // | This just means that the rectangles are filled with different shades
    // | to indicate the current frontiers.
    // +-------------------------------
    var visualizeCreatures = function () {
      for (var j = 0; j < biome.length; j++) {
        for (var i = 0; i < biome[j].length; i++) {
          // var ratio = Math.max(0, solutionMatrix[j][i].step / stepNumber) * 0.5;
          var rectangle = document.getElementById("cell-" + j + "-" + i);
          if (biome[j][i]) {
            rectangle.setAttribute("fill", "rgba(0,0,0,1.0)");
          } else {
            rectangle.setAttribute("fill", "rgba(255,255,255,1.0)");
          }
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Calculates the next step of the BFS: all rectangles on the current frontier
    // | checks for non-visited rectangles and marks them to use as the new frontier
    // | in the next iteration.
    // +-------------------------------
    var nextStep = function () {
      // Calculate next iteration of the game
      stepNumber++;

      var newBiotope = [];
      for (var j = 0; j < biome.length; j++) {
        var row = []; // TODO: check if new Array(n) is better here (we know the size)
        newBiotope.push(row);
        for (var i = 0; i < biome[j].length; i++) {
          var isAlive = biome[j][i];
          var neighbourCount = getNumberOfLivingNeighbours(j, i);
          if (isAlive) {
            // console.log("Cell j=" + j + " i=" + i + " is alive and has " + neighbourCount + " neighbours");
            if (neighbourCount < 2) {
              // Die of under-population
              row.push(false);
            } else if (neighbourCount == 2 || neighbourCount == 3) {
              // Keep on living
              row.push(true);
            } else if (neighbourCount > 3) {
              // Die of under-population
              row.push(false);
            } else {
              row.push(false);
            }
          } else {
            if (neighbourCount === 3) {
              // Dead cell becomes alive dues to 3 living neighboures
              row.push(true);
            } else {
              // Dead cell stays dead due to under- or over-poulation
              row.push(false);
            }
          }
        }
      } // END for
      biome = newBiotope;
    };

    var getNumberOfLivingNeighbours = function (j, i) {
      var count = 0;
      if (j - 1 >= 0 && biome[j - 1][i]) {
        count++;
      }
      if (j + 1 < biome.length && biome[j + 1][i]) {
        count++;
      }
      if (i - 1 >= 0 && biome[j][i - 1]) {
        count++;
      }
      if (i + 1 < biome[j].length && biome[j][i + 1]) {
        count++;
      }
      // Also look at diagoal neighbours
      if (j - 1 >= 0 && i - 1 >= 0 && biome[j - 1][i - 1]) {
        count++;
      }
      if (j + 1 < biome.length && i - 1 >= 0 && biome[j + 1][i - 1]) {
        count++;
      }
      if (j + 1 < biome.length && i + 1 < biome[j].length && biome[j + 1][i + 1]) {
        count++;
      }
      if (j - 1 >= 0 && i + 1 < biome[j].length && biome[j - 1][i + 1]) {
        count++;
      }
      return count;
    };

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
      renderLoop();
    };

    // +---------------------------------------------------------------------------------
    // | Add mouse interaction
    // +-------------------------------
    svgNode.addEventListener("click", function (event) {
      var bounds = svgNode.getBoundingClientRect();
      var pixelPosition = { x: event.offsetX - bounds.left, y: event.offsetY - bounds.top };
      var j = Math.floor(pixelPosition.y / config.cellHeight);
      var i = Math.floor(pixelPosition.x / config.cellWidth);
      // console.log(pixelPosition, j, i);
      if (j >= 0 && i >= 0 && j < biome.length && i < biome[j].length) {
        setCellAlive({ j: j, i: i }, !biome[j][i]);
        visualizeCreatures();
      }
    });

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = new dat.gui.GUI();
    gui.remember(config);
    var f0 = gui.addFolder("Lightning algorithm");

    f0.add(config, "animate").listen().title("Toggle animation on/off.").onChange(startAnimation);
    f0.add(config, "animationDelay").min(10).max(1000).title("The delay in milliseconds between frames.");

    // prettier-ignore
    f0.add(config, "borderSize").min(0).max(10).step(1).title("borderSize").onChange(function () {
        rebuildBiotope(false);
      });
    // prettier-ignore
    f0.add(config, "cellWidth").min(2).max(100).title("cellWidth").onChange(function () {
        rebuildBiotope(false);
      });
    // prettier-ignore
    f0.add(config, "cellHeight").min(2).max(100).title("cellHeight")
      .onChange(function () {
        rebuildBiotope(false);
      });

    // prettier-ignore
    f0.add(config, "randomizationThreshold").min(2).max(100).title("The probabily that a new cell is alive.");

    var f1 = gui.addFolder("Biomes");
    f1.add(config, "preset_glider");
    f1.open();

    f0.add(config, "clear");
    f0.add(config, "randomize");
    f0.add(config, "nextStep");

    f0.open();

    initBiotope();
    visualizeCreatures();
    startAnimation();
  });
})(window);
