/**
 * A script to demonstrate how to draw Hick's Hexagons.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2022-06-01
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) return;
    window.pbInitialized = true;

    // Fetch the GET params
    let GUP = gup();
    var isDarkmode = detectDarkMode(GUP);

    // All config params are optional.
    var pb = new PlotBoilerplate(
      PlotBoilerplate.utils.safeMergeByKeys(
        {
          canvas: document.getElementById("canvas"),
          fullSize: true,
          fitToParent: true,
          scaleX: 1.0,
          scaleY: 1.0,
          rasterGrid: true,
          drawGrid: true,
          drawOrigin: false,
          rasterAdjustFactor: 2.0,
          redrawOnResize: true,
          defaultCanvasWidth: 1024,
          defaultCanvasHeight: 768,
          canvasWidthFactor: 1.0,
          canvasHeightFactor: 1.0,
          cssScaleX: 1.0,
          cssScaleY: 1.0,
          cssUniformScale: true,
          autoAdjustOffset: true,
          offsetAdjustXPercent: 50,
          offsetAdjustYPercent: 50,
          backgroundColor: isDarkmode ? "#000000" : "#ffffff",
          enableMouse: true,
          enableKeys: true,
          enableTouch: true,

          enableSVGExport: false
        },
        GUP
      )
    );

    var HEX_RATIO = 1.1547005; // ratio of hexagon height to width

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        // dropCount: 10,
        // animate: true,
        // animationDelay: 50,
        // dropMaxRadius: 100,
        // innerCircleDistance: 25,
        // drawCircleIntersections: true,
        lineThickness: 2,
        startColor: "rgba(255,0,0,1)",
        endColor: "rgba(0,255,0,1)",
        hexWidth: 100,
        hexHeight: 100 * HEX_RATIO,
        heightOffset: -0.1
      },
      GUP
    );

    // +---------------------------------------------------------------------------------
    // | Create a random vertex inside the canvas viewport.
    // +-------------------------------
    var randomVertex = function () {
      return new Vertex(
        Math.random() * pb.canvasSize.width * 0.5 - (pb.canvasSize.width / 2) * 0.5,
        Math.random() * pb.canvasSize.height * 0.5 - (pb.canvasSize.height / 2) * 0.5
      );
    };

    var redraw = function () {
      var viewport = pb.viewport();
      pb.fill.rect(viewport.min, viewport.width, viewport.height, "orange");
      var leftOffset = viewport.min.x;
      var topOffset = viewport.min.y;
      var y = topOffset;
      var rowNumber = 0;
      while (y < viewport.max.y + config.hexWidth / 2) {
        var x = leftOffset + (rowNumber % 2 ? 0 : config.hexWidth / 2);
        var lineCoords = [];
        while (x < viewport.max.x + config.hexHeight / 2) {
          var primaryVerts = mkHexAt({ x: x, y: y }, 0.45);
          var secondaryVerts = mkHexAt({ x: x, y: y }, 0.68);
          var tertiaryVerts = mkHexAt({ x: x, y: y }, 1.0);
          // fillHexagon({ x: x, y: y });
          pb.fill.polyline(secondaryVerts, false, "black");
          pb.fill.polyline(primaryVerts, false, "rgb(192,0,0)");
          // pb.draw.polyline(tertiaryVerts, false, "black", config.hexWidth * 0.12);
          if (rowNumber % 2) {
            addHexLine(lineCoords, x, y);
          }
          pb.draw.diamondHandle({ x: x, y: y }, 5, "rgba(255,0,255,0.5)");
          x += config.hexWidth;
        }
        if (rowNumber % 8) {
          pb.draw.polyline(lineCoords, true, "black", config.lineThickness); // config.hexWidth * 0.012);
        }
        y += config.hexHeight * 0.75 + config.hexHeight * (rowNumber % 2 === 0 ? 0 : config.heightOffset);
        rowNumber++;
      }
    };

    var mkHexAt = function (position, scale) {
      return [
        // left upper
        { x: position.x - config.hexWidth * 0.5 * scale, y: position.y - config.hexHeight * 0.25 * scale },
        // upper
        { x: position.x, y: position.y - config.hexHeight * 0.5 * scale },
        // right upper
        { x: position.x + config.hexWidth * 0.5 * scale, y: position.y - config.hexHeight * 0.25 * scale },
        // right lower
        { x: position.x + config.hexWidth * 0.5 * scale, y: position.y + config.hexHeight * 0.25 * scale },
        // lower
        { x: position.x, y: position.y + config.hexHeight * 0.5 * scale },
        // left lower
        { x: position.x - config.hexWidth * 0.5 * scale, y: position.y + config.hexHeight * 0.25 * scale }
      ];
    };

    var addHexLine = function (lineCoords, x, y) {
      //
      var lerpValue = 0.25;
      var topHex = mkHexAt({ x: x, y: y }, 0.9);
      var bottomHex = mkHexAt(
        { x: x + config.hexWidth / 2, y: y + config.hexHeight * 0.75 + config.hexHeight * config.heightOffset },
        0.9
      );
      // lineCoords.push(new Vertex(topHex[4]).lerp(topHex[5], lerpValue));
      lineCoords.push(topHex[5], topHex[0], topHex[1], topHex[2], topHex[3]);
      // lineCoords.push(topHex[4]); // new Vertex(topHex[4]).lerp(topHex[3], lerpValue));
      lineCoords.push(bottomHex[0]);

      // Add bottom hex elements
      // lineCoords.push(new Vertex(bottomHex[1]).lerp(bottomHex[0], lerpValue));
      lineCoords.push(bottomHex[5], bottomHex[4], bottomHex[3], bottomHex[2]);
      // lineCoords.push(new Vertex(bottomHex[1]).lerp(bottomHex[2], lerpValue));
    };

    var fillHexagon = function (position) {
      var vertices = mkHexAt(position);
      pb.draw.polyline(vertices, false, "orange");
    };

    var drawHexagon = function (position) {
      var vertices = mkHexAt(position);
      pb.draw.polyline(vertices, false, "orange");
    };

    // Add a mouse listener to track the mouse position.-
    new MouseHandler(pb.eventCatcher).move(function (e) {
      var relPos = pb.transformMousePosition(e.params.pos.x, e.params.pos.y);
      stats.mouseXTop = relPos.x;
      stats.mouseYTop = relPos.y;
    });

    // +---------------------------------------------------------------------------------
    // | Add stats.
    // +-------------------------------
    var stats = {
      mouseXTop: 0,
      mouseYTop: 0
    };
    var uiStats = new UIStats(stats);
    stats = uiStats.proxy;
    uiStats.add("mouseXTop").precision(1);
    uiStats.add("mouseYTop").precision(1);

    var startColor = Color.parse(config.startColor);
    var endColor = Color.parse(config.endColor);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'hexWidth').listen().onChange(function() { pb.redraw() }).name("hexWidth").title("hexWidth");
      // prettier-ignore
      gui.add(config, 'heightOffset').listen().onChange(function() { pb.redraw() }).name("heightOffset").title("heightOffset");
      // prettier-ignore
      gui.add(config, 'lineThickness').listen().onChange(function() { pb.redraw() }).name("lineThickness").title("lineThickness");
      // // prettier-ignore
      // gui.add(config, 'lineThickness').listen().min(1).max(32).step(1).name("lineThickness").title("lineThickness");
      // // prettier-ignore
      // gui.add(config, 'innerCircleDistance').listen().min(1).max(32).step(1).name("innerCircleDistance").title("innerCircleDistance");
      // // prettier-ignore
      // gui.add(config, 'drawCircleIntersections').listen().name("drawCircleIntersections").title("drawCircleIntersections");
      // prettier-ignore
      gui.addColor(config, 'startColor').onChange( function() { startColor = Color.parse(config.startColor); } );
      // prettier-ignore
      gui.addColor(config, 'endColor').onChange( function() { endColor = Color.parse(config.endColor); } );
    }

    // pb.config.preDraw = drawSource;
    pb.config.postDraw = redraw;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
