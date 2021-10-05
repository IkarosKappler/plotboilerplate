/**
 * A demo to render function graphs.
 *
 * @requires PlotBoilerplate
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
    // All config params are optional.
    // var pb = new PlotBoilerplate(
    // PlotBoilerplate.utils.safeMergeByKeys(
    //     { canvas                 : document.getElementById('my-canvas'),
    //       fullSize               : true,
    //       fitToParent            : true,
    //       scaleX                 : 1.0,
    //       scaleY                 : 1.0,
    //       rasterGrid             : true,
    //       drawOrigin             : false,
    //       rasterAdjustFactor     : 2.0,
    //       redrawOnResize         : false, // !!! true,
    //       defaultCanvasWidth     : 1024,
    //       defaultCanvasHeight    : 768,
    //       canvasWidthFactor      : 1.0,
    //       canvasHeightFactor     : 1.0,
    //       cssScaleX              : 1.0,
    //       cssScaleY              : 1.0,
    //       drawBezierHandleLines  : true,
    //       drawBezierHandlePoints : true,
    //       cssUniformScale        : true,
    //       autoAdjustOffset       : true,
    //       offsetAdjustXPercent   : 0,
    //       offsetAdjustYPercent   : 0,
    //       backgroundColor        : '#ffffff',
    //       enableMouse            : true,
    //       enableTouch            : true,
    //       enableKeys             : true,
    //       enableSVGExport        : false
    //     }, GUP
    // )
    // );

    // pb.config.postDraw = function() {
    // 	console.log("Post draw");

    // };

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        animate: true,
        phaseX: 0.0,
        scaleY: 25.0,
        stepSizeX: 2.0,
        lineWidth: 2.0,

        mazeWidth: 10,
        mazeHeight: 7
      },
      GUP
    );

    // Create fake SVG node
    // const svgNode : SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var svgNode = document.getElementById("my-canvas");
    // // var svgNode = document.getElementById('preview-svg');
    // // Draw everything to fake node.
    var canvasSize = getAvailableContainerSpace(svgNode);
    console.log(getAvailableContainerSpace(svgNode));
    var tosvgDraw = new drawutilssvg(
      svgNode,
      { x: 0, y: 0 }, // pb.draw.offset,
      { x: 1, y: 1 }, // pb.draw.scale,
      canvasSize, // pb.canvasSize,
      false, // fillShapes=false
      {} // pb.drawConfig
    );
    var tosvgFill = tosvgDraw.copyInstance(true); // fillShapes=true

    var squareSize = {
      w: canvasSize.width / config.mazeWidth,
      h: canvasSize.height / config.mazeHeight
    };
    var borderSize = 6;
    var innerSquareSize = {
      w: squareSize.w - borderSize,
      h: squareSize.h - borderSize
    };

    var styleDefs = new Map();
    // styleDefs.set("rect", "fill: black;");
    styleDefs.set("rect.background", "fill: #000000;");
    styleDefs.set("rect.b-none-none-none-none", "stroke: none;");
    styleDefs.set(
      "rect.b-top-none-none-none",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h * 2 + innerSquareSize.w};`
    );
    styleDefs.set(
      "rect.b-top-none-bottom-none",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h},${innerSquareSize.w},${innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-top-none-none-left",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h + innerSquareSize.w},${innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-top-none-bottom-left",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w},${innerSquareSize.h},${innerSquareSize.w + innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-top-right-none-none",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w + innerSquareSize.h},${innerSquareSize.h + innerSquareSize.w};`
    );
    styleDefs.set(
      "rect.b-top-right-bottom-none",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w * 2 + innerSquareSize.h},${innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-top-right-none-left",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w + innerSquareSize.h},${innerSquareSize.w},${innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-top-right-bottom-left",
      `stroke: purple; stroke-dasharray: ${innerSquareSize.w * 2 + innerSquareSize.h * 2};`
    );
    styleDefs.set(
      "rect.b-none-right-none-none",
      `stroke: purple; stroke-dasharray: 0,${innerSquareSize.w},${innerSquareSize.h},${innerSquareSize.w + innerSquareSize.w};`
    );
    styleDefs.set(
      "rect.b-none-right-bottom-none",
      `stroke: purple; stroke-dasharray: 0,${innerSquareSize.w},${innerSquareSize.h + innerSquareSize.w},${innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-none-right-none-left",
      `stroke: purple; stroke-dasharray: 0,${innerSquareSize.w},${innerSquareSize.h},${innerSquareSize.w},${innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-none-right-bottom-left",
      `stroke: orange; stroke-dasharray: 0,${innerSquareSize.w},${innerSquareSize.h + innerSquareSize.w + innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-none-none-bottom-left",
      `stroke: purple; stroke-dasharray: 0,${innerSquareSize.w + innerSquareSize.h},${innerSquareSize.h + innerSquareSize.w};`
    );
    styleDefs.set(
      "rect.b-none-none-none-left",
      `stroke: green; stroke-dasharray: 0,${innerSquareSize.w * 2 + innerSquareSize.h},${innerSquareSize.h};`
    );
    styleDefs.set(
      "rect.b-none-none-bottom-none",
      `stroke: purple; stroke-dasharray: 0,${innerSquareSize.w + innerSquareSize.h},${innerSquareSize.w},${innerSquareSize.h};`
    );
    styleDefs.set("line", `stroke: blue; stroke-color: blue;`);
    tosvgDraw.addCustomStyleDefs(styleDefs);

    var BORDER_NONE = 0;
    var BORDER_LEFT = 1;
    var BORDER_RIGHT = 2;
    var BORDER_BOTTOM = 4;
    var BORDER_TOP = 8;

    // Array<number[]>
    var mazeMatrix = [];

    var initMaze = function () {
      //   var squareSize = {
      //     w: canvasSize.width / config.mazeWidth,
      //     h: canvasSize.height / config.mazeHeight
      //   };
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
          if (i == 0 || Math.random() > 0.66) {
            borders |= BORDER_LEFT;
          }
          if (i + 1 == config.mazeWidth || (i - 1 >= 0 && mazeMatrix[j][i - 1] & BORDER_RIGHT)) {
            borders |= BORDER_RIGHT;
          }
          if (Math.random() > 0.75) {
            borders |= BORDER_BOTTOM;
          }
          if (j - 1 >= 0 && mazeMatrix[j - 1][i] & BORDER_BOTTOM) {
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
            squareSize.w - borderSize,
            squareSize.h - borderSize,
            "#000000",
            1
          );
        }
      }
      tosvgDraw.endDrawCycle();
      tosvgFill.endDrawCycle();
    };

    var time = 0;

    // Array<number[]>
    // 0:              current positions
    // larger numbers: older positions
    var solutionBuffer = [];
    var solutionMatrix = [];
    var initSolutionMatrix = function () {
      //   console.log("mazeMatrix", mazeMatrix);
      solutionMatrix = [];
      for (var j = 0; j < mazeMatrix.length; j++) {
        // console.log("xyxy", i, mazeMatrix[i].length);
        solutionMatrix.push([]);
        for (var i = 0; i < mazeMatrix[j].length; i++) {
          solutionMatrix[j].push(j === 0 ? 0 : Number.POSITIVE_INFINITY);
          if (j == 0) {
            solutionBuffer.push({ i: i, j: j });
          }
        }
      }
    };

    var visualizeSolution = function () {
      console.log("Visualize", solutionMatrix);
      var drawStepsBeyond = 10;
      for (var j = 0; j < solutionMatrix.length; j++) {
        for (var i = 0; i < solutionMatrix[j].length; i++) {
          var ratio = Math.max(0, (drawStepsBeyond - solutionMatrix[j][i]) / drawStepsBeyond);
          ratio *= 0.25;
          if (i == 0) {
            console.log("ratio", ratio);
          }
          var rectangle = document.getElementById("rect-" + j + "-" + i);
          rectangle.setAttribute("fill", "rgba(255,255,255," + ratio + ")");
        }
      }
    };

    var currentLine = 0;
    var nextStep = function () {
      // Calculate next iteration of the breadth-first-algorithm
      var newSolutionBuffer = [];

      for (var k = 0; k < solutionBuffer.length; k++) {
        // Find ways that are not blocked
        var tuple = solutionBuffer[k];
        var i = tuple.i;
        var j = tuple.j;
        // Increase the old matrix entry
        solutionMatrix[j][i] += 1;
        var leftOrRight = false;
        if (i - 1 >= 0 && !(mazeMatrix[j][i] & BORDER_LEFT) && !visited(j, i - 1)) {
          // Mark the next reachable entry
          solutionMatrix[j][i - 1] = 0;
          newSolutionBuffer.push({ i: i - 1, j: j });
          leftOrRight = true;
          makeArrow(j, i, j, i - 1);
        }
        if (i + 1 < mazeMatrix[j].length && !(mazeMatrix[j][i] & BORDER_RIGHT) && !visited(j, i + 1)) {
          // Mark the next reachable entry
          solutionMatrix[j][i + 1] = 0;
          newSolutionBuffer.push({ i: i + 1, j: j });
          leftOrRight = true;
          makeArrow(j, i, j, i + 1);
        }
        if (!leftOrRight && j + 1 < mazeMatrix.length && !(mazeMatrix[j][i] & BORDER_BOTTOM) && !visited(j + 1, i)) {
          // Mark the next reachable entry
          solutionMatrix[j + 1][i] = 0;
          newSolutionBuffer.push({ i: i, j: j + 1 });
          makeArrow(j, i, j + 1, i);
        }
      }
      solutionBuffer = newSolutionBuffer;
    };

    var makeArrow = function (fromJ, fromI, toJ, toI) {
      var node = document.createElementNS("http://www.w3.org/2000/svg", "line");
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
      node.setAttribute("x1", centerFrom.x);
      node.setAttribute("y1", centerFrom.y);
      node.setAttribute("x2", centerTo.x);
      node.setAttribute("y2", centerTo.y);

      svgNode.getElementsByTagName("g")[0].appendChild(node);
    };

    var visited = function (j, i) {
      return solutionMatrix[j][i] !== Number.POSITIVE_INFINITY;
    };

    var renderLoop = function (_time) {
      if (!config.animate) {
        time = 0;
        return;
      }
      time = _time;
      // Animate here
      // ...

      //   pb.redraw();
      window.setTimeout(function () {
        console.log("renderLoop");
        nextStep();
        visualizeSolution();
        window.requestAnimationFrame(renderLoop);
      }, 1000);
    };

    var startAnimation = function () {
      renderLoop();
    };

    // +---------------------------------------------------------------------------------
    // | Install a mouse handler to display current pointer position.
    // +-------------------------------
    // new MouseHandler(pb.eventCatcher,'drawsvg-demo')
    // 	.move( function(e) {
    // 		// Display the mouse position
    // 		var relPos = pb.transformMousePosition( e.params.pos.x, e.params.pos.y );
    // 		stats.mouseX = relPos.x;
    // 		stats.mouseY = relPos.y;
    // } );

    var stats = {
      mouseX: 0,
      mouseY: 0
    };
    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    // {
    // 	var gui = pb.createGUI();
    // 	var f0 = gui.addFolder('Points');

    // 	f0.add(config, 'stepSizeX').min(0.25).max(12).step(0.25).title('Value step size on the x axis.').onChange( function() { pb.redraw(); } );
    // 	f0.add(config, 'scaleY').min(0.25).max(200.0).step(0.25).title('Vertical scale.').onChange( function() { pb.redraw(); } );
    // 	f0.add(config, 'lineWidth').min(1).max(20).title('The line with to use.').onChange( function() { pb.redraw(); } );
    // 	f0.add(config, 'animate').title('Toggle phase animation on/off.').onChange( startAnimation );

    // 	f0.open();

    // 	// Add stats
    // 	var uiStats = new UIStats( stats );
    // 	stats = uiStats.proxy;
    // 	uiStats.add( 'mouseX' );
    // 	uiStats.add( 'mouseY' );
    // }

    initMaze();
    initSolutionMatrix();
    visualizeSolution();
    startAnimation();

    // // Will stop after first draw if config.animate==false
    // if( config.animate ) {
    // 	startAnimation();
    // } else {
    // 	pb.redraw();
    // }
  });
})(window);
