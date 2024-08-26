/**
 * A script to demonstrate how to draw Hick's Hexagons.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires lil-gui
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
        lineThickness: 12,
        innerColor: "rgb(192,0,0)",
        lineColor: "rgb(218,164,0)",
        hexWidth: 100,
        hexHeight: 100 * HEX_RATIO,
        hexDistort: 0.0,
        innerScale: 0.39,
        heightOffset: -0.25
      },
      GUP
    );

    var redraw = function () {
      var viewport = pb.viewport();
      var leftOffset = viewport.min.x;
      var topOffset = viewport.min.y;
      var y = topOffset;
      var rowNumber = 0;
      while (y < viewport.max.y + config.hexWidth / 2) {
        var x = leftOffset + (rowNumber % 2 ? 0 : config.hexWidth / 2);
        var lineCoords = [];
        while (x < viewport.max.x + config.hexHeight / 2) {
          var primaryVerts = mkHexAt({ x: x - config.hexWidth / 2, y: y }, config.innerScale);
          pb.fill.polyline(primaryVerts, false, config.innerColor);
          if (rowNumber % 2 === 0) {
            addHexLine(lineCoords, x, y);
          }
          x += config.hexWidth;
        }
        if ((rowNumber + 1) % 8) {
          pb.draw.polyline(lineCoords, true, config.lineColor, config.lineThickness);
        }
        y += config.hexHeight * 0.75 + config.hexHeight * (rowNumber % 2 === 1 ? 0 : config.heightOffset);
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
      var hexScale = (config.hexWidth - 2 * config.lineThickness) / config.hexWidth;
      var topHex = mkHexAt({ x: x - config.hexWidth / 2, y: y }, hexScale);
      var bottomHex = mkHexAt(
        { x: x, y: y + config.hexHeight * 0.75 + config.hexHeight * config.heightOffset },
        hexScale // 0.9
      );
      lineCoords.push(topHex[5], topHex[0], topHex[1], topHex[2], topHex[3]);
      lineCoords.push(bottomHex[0]);

      // Add bottom hex elements
      lineCoords.push(bottomHex[5], bottomHex[4], bottomHex[3], bottomHex[2]);
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

    var innerColor = Color.parse(config.startColor);
    var lineColor = Color.parse(config.endColor);

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'hexWidth').min(10).max(160).step(1).listen().onChange(function() { config.hexHeight = config.hexWidth * (HEX_RATIO+config.hexDistort); pb.redraw() }).name("hexWidth").title("hexWidth");
      // prettier-ignore
      gui.add(config, 'heightOffset').min(-1.0).max(1.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("heightOffset").title("heightOffset");
      // prettier-ignore
      gui.add(config, 'lineThickness').listen().onChange(function() { pb.redraw() }).name("lineThickness").title("lineThickness");
      // prettier-ignore
      gui.add(config, 'hexDistort').min(-1).max(1).step(0.01).listen().onChange(function() { config.hexHeight = config.hexWidth * (HEX_RATIO+config.hexDistort); pb.redraw() }).name("hexDistort").title("hexDistort");
      // prettier-ignore
      gui.add(config, 'innerScale').min(0.0).max(1.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("innerScale").title("innerScale");

      // prettier-ignore
      gui.addColor(pb.config, 'backgroundColor').onChange( function() { pb.redraw(); } );
      // prettier-ignore
      gui.addColor(config, 'innerColor').onChange( function() { innerColor = Color.parse(config.innerColor); pb.redraw(); } );
      // prettier-ignore
      gui.addColor(config, 'lineColor').onChange( function() { lineColor = Color.parse(config.lineColor); pb.redraw(); } );
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
