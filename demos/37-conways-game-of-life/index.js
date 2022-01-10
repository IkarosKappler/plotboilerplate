/**
 * A demo to visualize 'Conway's Game Of Life'.
 *
 * @requires getAvailableContainerSpace
 * @requires drawutilssvg
 * @requires gup
 * @requires Biotope
 * @requires dat.gui
 *
 * @projectname Plotboilerplate.js
 * @author      Ikaros Kappler
 * @date        2021-10-31
 * @modified    2022-01-10 Adding the f-pentomino by default if nothing else is specified.
 * @version     1.0.1
 **/

(function (_context) {
  "use strict";

  // Fetch the GET params
  var GUP = gup();
  globalThis.isDarkMode = detectDarkMode(GUP);

  window.addEventListener("load", function () {
    // THIS DEMO WORKS A BIT DIFFERENT THAN THE OTHERS.
    // IT DOES NOT USE AN EXPLICIT INSTANCE OF PLOTBOILERPLATE
    // BUT RATHER SOME SUB MODULES FOR SVG DRAWING.

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        guiDoubleSize: false,

        animate: true,
        animationDelay: 150,

        cellWidth: 32,
        cellHeight: 32,
        marginSize: 2,
        traceFalloff: 10, // Draw n steps behind being alive
        traceAlpha: 0.3,
        drawTraces: true,

        randomizationThreshold: 0.5,

        directPaintMode: true,

        // According to the prop name from PlotBoilerplate
        backgroundColor: GUP["backgroundColor"] || (globalThis.isDarkMode ? "rgb(0,0,0)" : "rgb(255,255,255)"),
        lifeColor: GUP["lifeColor"] || (globalThis.isDarkMode ? "rgb(162,0,253)" : "rgb(162,0,253)"),
        traceColor: GUP["traceColor"] || "rgb(0,167,185)",
        borderColor: GUP["borderColor"] || (globalThis.isDarkMode ? "rgb(32,32,32)" : "rgb(192,192,192)"),
        presetColor: GUP["presetColor"] || "rgb(255,0,255)",

        turnLeft: function () {
          turnCurrentPresetLeft();
        },
        turnRight: function () {
          turnCurrentPresetRight();
        },
        preset_glider: function () {
          currentPreset = CONWAY_PRESETS["glider"];
          visualizeCreatures();
        },
        preset_lightweightGlider: function () {
          currentPreset = CONWAY_PRESETS["lightweight_glider"];
          visualizeCreatures();
        },
        preset_middleweightGlider: function () {
          currentPreset = CONWAY_PRESETS["middleweight_glider"];
          visualizeCreatures();
        },
        preset_heavyweightGlider: function () {
          currentPreset = CONWAY_PRESETS["heavyweight_glider"];
          visualizeCreatures();
        },
        preset_gliderSpawner: function () {
          currentPreset = CONWAY_PRESETS["glider_spawner"];
          visualizeCreatures();
        },
        preset_pulsar: function () {
          currentPreset = CONWAY_PRESETS["pulsar"];
          visualizeCreatures();
        },
        preset_pentaDecathlon: function () {
          currentPreset = CONWAY_PRESETS["penta_decathlon"];
          visualizeCreatures();
        },

        clear: function () {
          rebuildBiotope(false);
          visualizeCreatures();
        },
        randomize: function () {
          rebuildBiotope(true);
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
    var tosvgDraw = null;
    var tosvgFill = null;
    var biotopeSize = { width: 0, height: 0 }; // Dimension

    // Prepare a preset for placing by mouse/touch
    var currentPreset = null;
    var currentPresetPosition = { j: 0, i: 0 };

    var biome = new Biotope();

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
    };

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
    };

    // +---------------------------------------------------------------------------------
    // | Ths function computes the biotope and renders it.
    // +-------------------------------
    var initBiotope = function (randomizeBiome) {
      initSvgCanvas();
      tosvgDraw.beginDrawCycle();
      tosvgFill.beginDrawCycle();
      tosvgFill.curClassName = "background";
      tosvgFill.curId = "background";
      tosvgFill.rect({ x: 0, y: 0 }, canvasSize.width, canvasSize.height, config.backgroundColor, 0);
      biome = new Biotope(biotopeSize.height, biotopeSize.width, function (_j, _i) {
        // Make square and add respective classes to visualize the borders.
        tosvgFill.curClassName = "cell";
        tosvgFill.curId = "cell-" + _j + "-" + _i;
        tosvgFill.rect(
          { x: _i * config.cellWidth, y: _j * config.cellHeight },
          config.cellWidth - config.marginSize,
          config.cellHeight - config.marginSize,
          "#ffffff",
          1
        );

        if (randomizeBiome) {
          return { isAlive: Math.random() < config.randomizationThreshold, lastAliveStep: Number.NEGATIVE_INFINITY };
        } else {
          return { isAlive: false, lastAliveStep: Number.NEGATIVE_INFINITY };
        }
      });
      tosvgDraw.endDrawCycle();
      tosvgFill.endDrawCycle();
    };

    var addCurrentPreset = function () {
      if (!currentPreset) {
        return;
      }
      for (var j = 0; j < currentPreset.length; j++) {
        for (var i = 0; i < currentPreset[j].length; i++) {
          biome.setCellAlive(
            biome.relPos(currentPresetPosition.j + j, currentPresetPosition.i + i),
            Boolean(currentPreset[j][i])
          );
        }
      }
    };

    // +---------------------------------------------------------------------------------
    // | Visualize the algorithms (partial) solution inside the SVG.
    // | This just means that the rectangles are filled with different shades
    // | to indicate the current frontiers.
    // +-------------------------------
    var visualizeCreatures = function () {
      var relCurrentPresetPosition = biome.relPos(currentPresetPosition.j, currentPresetPosition.i);
      var backgroundColor = Color.parse(config.backgroundColor);
      var lifeColor = Color.parse(config.lifeColor);
      var traceColor = Color.parse(config.traceColor);
      // var borderColor = Color.parse(config.borderColor);
      var presetColor = Color.parse(config.presetColor);
      var presetColorAlive = Color.makeRGB(presetColor.r * 128, presetColor.g * 128, presetColor.b * 128);
      for (var j = 0; j < biome.length; j++) {
        for (var i = 0; i < biome[j].length; i++) {
          // Fetch the SVG rectangle
          var rectangle = document.getElementById("cell-" + j + "-" + i);
          rectangle.setAttribute("stroke", config.borderColor);
          rectangle.setAttribute("stroke-width", 0.5);
          // Visualize preset, if there currently is one
          // Checl if the current position is inside the selected preset
          if (
            currentPreset &&
            j >= relCurrentPresetPosition.j &&
            j < relCurrentPresetPosition.j + currentPreset.length &&
            i >= relCurrentPresetPosition.i &&
            i < relCurrentPresetPosition.i + currentPreset[0].length &&
            currentPreset[j - relCurrentPresetPosition.j][i - relCurrentPresetPosition.i] !== 0
          ) {
            rectangle.setAttribute("fill", biome[j][i].isAlive ? presetColorAlive.cssRGBA() : presetColor.cssRGBA());
          } else {
            if (biome[j][i].isAlive) {
              rectangle.setAttribute("fill", lifeColor.cssRGB());
            } else {
              var diff = biome.stepNumber - biome[j][i].lastAliveStep;
              var alpha = diff <= config.traceFalloff ? diff / config.traceFalloff : 1.0;
              if (config.drawTraces && alpha < 0.9) {
                var cellColor = traceColor.clone().fadeout(config.traceAlpha + (1 - config.traceAlpha) * alpha);
                rectangle.setAttribute("fill", cellColor.cssRGBA());
              } else {
                rectangle.setAttribute("fill", backgroundColor.cssRGB());
              }
            }
          }
        }
      }
      // Set the background rect's color to change the 'border' color
      document.getElementById("background").setAttribute("fill", config.backgroundColor);
    };

    // +---------------------------------------------------------------------------------
    // | Calculates the next step of the BFS: all rectangles on the current frontier
    // | checks for non-visited rectangles and marks them to use as the new frontier
    // | in the next iteration.
    // +-------------------------------
    var nextStep = function () {
      // Calculate next iteration of the game
      biome = biome.createNextCycle();
    };

    // +---------------------------------------------------------------------------------
    // | Turn the currently selected preset one 90 degree turn to the left and re-renders
    // | the scene.
    // +-------------------------------
    var turnCurrentPresetLeft = function () {
      if (currentPreset) {
        currentPreset = turnMatrixLeft(currentPreset);
        visualizeCreatures();
      }
    };

    // +---------------------------------------------------------------------------------
    // | Turn the currently selected preset one 90 degree turn to the right and re-renders
    // | the scene.
    // +-------------------------------
    var turnCurrentPresetRight = function () {
      if (currentPreset) {
        // Dirty hack, I know ;)
        currentPreset = turnMatrixLeft(turnMatrixLeft(turnMatrixLeft(currentPreset)));
        visualizeCreatures();
      }
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
    // | Add mouse/touch interaction on click.
    // +-------------------------------
    svgNode.addEventListener("click", function (event) {
      var bounds = svgNode.getBoundingClientRect();
      var pixelPosition = { x: event.offsetX - bounds.left, y: event.offsetY - bounds.top };
      var j = Math.floor(pixelPosition.y / config.cellHeight);
      var i = Math.floor(pixelPosition.x / config.cellWidth);
      if (j >= 0 && i >= 0 && j < biome.length && i < biome[j].length) {
        if (config.directPaintMode) {
          biome.setCellAlive({ j: j, i: i }, !biome[j][i].isAlive);
        } else {
          currentPresetPosition.j = biome.absRow(j);
          currentPresetPosition.i = biome.absCol(i);
          addCurrentPreset();
          currentPreset = null;
          currentPresetPosition.j = 0;
          currentPresetPosition.i = 0;
        }
        visualizeCreatures();
      }
    });

    // +---------------------------------------------------------------------------------
    // | Add mouse/touch interaction on move.
    // +-------------------------------
    svgNode.addEventListener("mousemove", function (event) {
      var bounds = svgNode.getBoundingClientRect();
      var pixelPosition = { x: event.offsetX - bounds.left, y: event.offsetY - bounds.top };
      var j = Math.floor(pixelPosition.y / config.cellHeight);
      var i = Math.floor(pixelPosition.x / config.cellWidth);
      if (j >= 0 && i >= 0 && j < biome.length && i < biome[j].length) {
        var jAbs = biome.absRow(j);
        var iAbs = biome.absCol(i);
        if (currentPreset && currentPresetPosition && (currentPresetPosition.j !== j || currentPresetPosition.i !== i)) {
          currentPresetPosition.j = jAbs;
          currentPresetPosition.i = iAbs;
          visualizeCreatures();
        }
      }
    });

    // +---------------------------------------------------------------------------------
    // | Turn current preset on left/right arrow key press.
    // +-------------------------------
    window.addEventListener("keydown", function (event) {
      switch (event.key) {
        case "ArrowLeft":
          // Left pressed
          turnCurrentPresetLeft();
          break;
        case "ArrowRight":
          // Right pressed
          turnCurrentPresetRight();
          break;
      }
    });

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    var gui = new dat.gui.GUI();
    gui.remember(config);
    var toggleGuiSize = function () {
      gui.domElement.style["transform-origin"] = "100% 0%";
      if (config.guiDoubleSize) {
        gui.domElement.style["transform"] = "scale(2.0)";
      } else {
        gui.domElement.style["transform"] = "scale(1.0)";
      }
    };
    if (isMobileDevice()) {
      config.guiDoubleSize = true;
      toggleGuiSize();
    }
    gui.add(config, "guiDoubleSize").title("Double size GUI?").onChange(toggleGuiSize);

    var f0 = gui.addFolder("Biome");
    f0.open();

    f0.add(config, "animate").title("Toggle animation on/off.").onChange(startAnimation);
    f0.add(config, "animationDelay").min(10).max(1000).title("The delay in milliseconds between frames.");
    f0.add(config, "drawTraces").title("Draw traces?");
    f0.add(config, "traceAlpha").min(0.0).max(1.0).title("The all over alpha base value for traces.");
    f0.add(config, "traceFalloff").min(1).max(32).title("How many steps into the past should life be visible?");

    // prettier-ignore
    f0.add(config, "marginSize").min(0).max(10).step(1).title("marginSize").onChange(function () {
        rebuildBiotope(false);
        visualizeCreatures();
      });
    // prettier-ignore
    f0.add(config, "cellWidth").min(2).max(100).title("cellWidth").onChange(function () {
        rebuildBiotope(false);
        visualizeCreatures();
      });
    // prettier-ignore
    f0.add(config, "cellHeight").min(2).max(100).title("cellHeight")
      .onChange(function () {
        rebuildBiotope(false);
        visualizeCreatures();
      });

    // prettier-ignore
    f0.add(config, "randomizationThreshold").min(0.0).max(1.0).title("The probabily that a new cell is alive.");
    f0.add(config, "clear");
    f0.add(config, "randomize");
    f0.add(config, "nextStep");

    var f1 = gui.addFolder("Biomes & Creatures");
    f1.add(config, "directPaintMode").title("Paint directly without any presets.");
    f1.add(config, "turnLeft").name("&#x21ba;").title("Left turn current preset.");
    f1.add(config, "turnRight").name("&#x21bb;").title("Right turn current preset.");
    f1.add(config, "preset_glider");
    f1.add(config, "preset_lightweightGlider");
    f1.add(config, "preset_middleweightGlider");
    f1.add(config, "preset_heavyweightGlider");
    f1.add(config, "preset_gliderSpawner");
    f1.add(config, "preset_pulsar");
    f1.add(config, "preset_pentaDecathlon");
    f1.open();

    var f2 = gui.addFolder("Colors");
    f2.addColor(config, "backgroundColor").title("The general background color.").onChange(visualizeCreatures);
    f2.addColor(config, "lifeColor").title("The color of living cells").onChange(visualizeCreatures);
    f2.addColor(config, "traceColor").title("The color of traces.").onChange(visualizeCreatures);
    f2.addColor(config, "borderColor").title("The color of borders.").onChange(visualizeCreatures);

    initBiotope();

    // Check if there is a preset specified to load.
    if (GUP["preset"]) {
      var presetName = GUP["preset"];
      if (CONWAY_PRESETS.hasOwnProperty(presetName)) {
        currentPreset = CONWAY_PRESETS[presetName];
        currentPresetPosition.j = GUP["j"] ? biome.absRow(parseInt(GUP["j"])) : currentPresetPosition.j;
        currentPresetPosition.i = GUP["i"] ? biome.absCol(parseInt(GUP["i"])) : currentPresetPosition.i;
        addCurrentPreset();
        currentPresetPosition.j = 0;
        currentPresetPosition.i = 0;
        currentPreset = null;
      }
    } else {
      console.log(biotopeSize);
      currentPreset = CONWAY_PRESETS["f_pentomino"];
      currentPresetPosition.j = GUP["j"] ? biome.absRow(parseInt(GUP["j"])) : 0;
      currentPresetPosition.i = GUP["i"] ? biome.absCol(parseInt(GUP["i"])) : 0;
      addCurrentPreset();
      currentPresetPosition.j = 0;
      currentPresetPosition.i = 0;
      currentPreset = null;
    }

    visualizeCreatures();
    startAnimation();
  });
})(window);
