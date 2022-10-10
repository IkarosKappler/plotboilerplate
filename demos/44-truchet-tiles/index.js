/**
 * A script to demonstrate how to make truchet tiles.
 *
 * @requires PlotBoilerplate
 * @requires MouseHandler
 * @requires gup
 * @requires dat.gui
 *
 *
 * @author   Ikaros Kappler
 * @date     2022-10-09
 * @version  1.0.0
 **/

(function (_context) {
  "use strict";

  window.initializePB = function () {
    if (window.pbInitialized) {
      return;
    }
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

    var viewport = pb.viewport();

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        safeZonePct: 0.1,
        countH: 10,
        countV: 10,
        clearTilesOnRedraw: true
      },
      GUP
    );

    var tiles = [];

    var computeTiles = function () {
      if (config.clearTilesOnRedraw) {
        tiles = [];
      }
      var bounds = new Bounds(
        { x: viewport.min.x + viewport.width * config.safeZonePct, y: viewport.min.y + viewport.height * config.safeZonePct },
        {
          x: viewport.min.x + viewport.width * config.safeZonePct + viewport.width * (1 - 2 * config.safeZonePct),
          y: viewport.min.y + viewport.height * config.safeZonePct + viewport.height * (1 - 2 * config.safeZonePct)
        }
      );
      // draw.rect(bounds.min, bounds.width, bounds.height, "orange", 1);
      var tileSize = Bounds.fromDimension(bounds.width / config.countH, bounds.height / config.countV, bounds.min);
      // console.log("tileSize", tileSize);
      for (var i = 0; i < config.countH; i++) {
        for (var j = 0; j < config.countV; j++) {
          var tileBounds = new Bounds(
            { x: bounds.min.x + tileSize.width * i, y: bounds.min.y + tileSize.height * j },
            { x: bounds.min.x + tileSize.width * (i + 1), y: bounds.min.y + tileSize.height * (j + 1) }
          );
          // console.log("tileBounds", tileBounds);
          // draw.rect(tileBounds.min, tileBounds.width, tileBounds.height, "green", 1);
          const tile = makeTruchetSquare(tileBounds);
          tiles.push(tile);
        }
      }
    };

    var doLinesIntersect = function (lineA, lineB) {
      var intersection = lineA.intersection(lineB);
      if (!intersection) {
        return false;
      }
      // TODO: check if only one condition is enough here
      return lineA.hasPoint(intersection, true) && lineB.hasPoint(intersection, true);
    };

    // Line
    // Array<{ line : Line, ... }>
    var canConnectLine = function (line, connections) {
      for (var i = 0; i < connections.length; i++) {
        if (doLinesIntersect(line, connections[i].line)) {
          return false;
        }
      }
      return true;
    };

    // Get the sqare connector vector
    // { point, controlPoint }
    var getSquareConnectorLocation = function (tileBounds, connectorIndex) {
      switch (connectorIndex) {
        case 0:
          return {
            point: { x: tileBounds.min.x + tileBounds.width / 3, y: tileBounds.min.y },
            controlPoint: {
              x: tileBounds.min.x + tileBounds.width / 3,
              y: tileBounds.min.y + tileBounds.height / 3
            }
          };
        case 1:
          return {
            point: { x: tileBounds.min.x + (tileBounds.width / 3) * 2, y: tileBounds.min.y },
            controlPoint: {
              x: tileBounds.min.x + (tileBounds.width / 3) * 2,
              y: tileBounds.min.y + tileBounds.height / 3
            }
          };
        case 2:
          return {
            point: { x: tileBounds.max.x, y: tileBounds.min.y + tileBounds.height / 3 },
            controlPoint: { x: tileBounds.min.x + (tileBounds.width / 3) * 2, y: tileBounds.min.y + tileBounds.height / 3 }
          };
        case 3:
          return {
            point: { x: tileBounds.min.x + tileBounds.width, y: tileBounds.min.y + (tileBounds.height / 3) * 2 },
            controlPoint: { x: tileBounds.min.x + (tileBounds.width / 3) * 2, y: tileBounds.min.y + (tileBounds.height / 3) * 2 }
          };
        case 4:
          return {
            point: { x: tileBounds.min.x + (tileBounds.width / 3) * 2, y: tileBounds.max.y },
            controlPoint: { x: tileBounds.min.x + (tileBounds.width / 3) * 2, y: tileBounds.min.y + (tileBounds.height / 3) * 2 }
          };
        case 5:
          return {
            point: { x: tileBounds.min.x + tileBounds.width / 3, y: tileBounds.max.y },
            controlPoint: {
              x: tileBounds.min.x + tileBounds.width / 3,
              y: tileBounds.min.y + (tileBounds.height / 3) * 2
            }
          };
        case 6:
          return {
            point: { x: tileBounds.min.x, y: tileBounds.min.y + (tileBounds.height / 3) * 2 },
            controlPoint: {
              x: tileBounds.min.x + tileBounds.width / 3,
              y: tileBounds.min.y + (tileBounds.height / 3) * 2
            }
          };
        case 7:
          return {
            point: { x: tileBounds.min.x, y: tileBounds.min.y + tileBounds.height / 3 },
            controlPoint: { x: tileBounds.min.x + tileBounds.width / 3, y: tileBounds.min.y + tileBounds.height / 3 }
          };
      }
    };

    // Connector indices:
    //         0    1
    //    +----*----*----+
    //    |              |
    //  7 *              * 2
    //    |              |
    //  6 *              * 3
    //    |              |
    //    +----*----*----+
    //         5    4
    var allowedConnections = {
      0: [1, 3, 5, 7],
      1: [0, 2, 4, 6],
      2: [1, 3, 5, 7],
      3: [0, 2, 4, 6],
      4: [1, 3, 5, 7],
      5: [0, 2, 4, 6],
      6: [1, 3, 5, 7],
      7: [0, 2, 4, 6]
    };
    var makeTruchetSquare = function (tileBounds) {
      var connections = []; // Array<{ line: Line, startVector, endVector, indices : [number,number] } >
      var isConnected = [false, false, false, false, false, false, false, false];
      var indices = [0, 1, 2, 3, 4, 5, 6, 7];
      arrayShuffle(indices);
      for (var i = 0; i < 8; i++) {
        var start = indices[i];
        if (isConnected[start]) {
          continue;
        }
        var startVector = getSquareConnectorLocation(tileBounds, start);
        arrayShuffle(allowedConnections[start]);
        // if (start === 0) {
        //   console.log("Shuffled", allowedConnections[start]);
        // }
        for (var j = 0; j < allowedConnections[start].length; j++) {
          var end = allowedConnections[start][j];
          if (isConnected[end]) {
            // console.log("isconnected", end);
            continue;
          }
          var endVector = getSquareConnectorLocation(tileBounds, end);
          var line = new Line(startVector.point, endVector.point);
          if (!canConnectLine(line, connections)) {
            // console.log("Cannot connect ", start, end);
            continue;
          }
          connections.push({
            line: line,
            startVector: startVector,
            endVector: endVector,
            indices: [start, allowedConnections[start][j]]
          });
          isConnected[start] = true;
          isConnected[allowedConnections[start][j]] = true;
        }
      }
      return { bounds: tileBounds, connections: connections };
    };

    // +---------------------------------------------------------------------------------
    // | Draw our custom stuff after everything else in the scene was drawn.
    // +-------------------------------
    var redraw = function (draw, fill) {
      // // var viewport = pb.viewport();
      // // console.log("viewport", viewport);
      var bounds = new Bounds(
        { x: viewport.min.x + viewport.width * config.safeZonePct, y: viewport.min.y + viewport.height * config.safeZonePct },
        {
          x: viewport.min.x + viewport.width * config.safeZonePct + viewport.width * (1 - 2 * config.safeZonePct),
          y: viewport.min.y + viewport.height * config.safeZonePct + viewport.height * (1 - 2 * config.safeZonePct)
        }
      );
      draw.rect(bounds.min, bounds.width, bounds.height, "orange", 1);
      // var tileSize = Bounds.fromDimension(bounds.width / config.countH, bounds.height / config.countV, bounds.min);
      // // console.log("tileSize", tileSize);
      // for (var i = 0; i < config.countH; i++) {
      //   for (var j = 0; j < config.countV; j++) {
      //     var tileBounds = new Bounds(
      //       { x: bounds.min.x + tileSize.width * i, y: bounds.min.y + tileSize.height * j },
      //       { x: bounds.min.x + tileSize.width * (i + 1), y: bounds.min.y + tileSize.height * (j + 1) }
      //     );
      //     // console.log("tileBounds", tileBounds);
      //     draw.rect(tileBounds.min, tileBounds.width, tileBounds.height, "green", 1);
      //     drawTruchetSquare(draw, fill, tileBounds);
      //   }
      // }
      for (var tileIndex in tiles) {
        // console.log("tile", tile);
        var tile = tiles[tileIndex];
        draw.rect(tile.bounds.min, tile.bounds.width, tile.bounds.height, "rgba(0,255,0,0.5)", 1);
        for (var c in tile.connections) {
          var connection = tile.connections[c];
          draw.line(connection.line.a, connection.line.b, "rgba(192,192,192,0.1)", 3);
          // console.log("connection", connection);
          draw.cubicBezier(
            connection.startVector.point,
            connection.endVector.point,
            connection.startVector.controlPoint,
            connection.endVector.controlPoint,
            "rgba(192,0,192,0.75)",
            2
          );
        }
      }
    };

    // Add a mouse listener to track the mouse position.
    new MouseHandler(pb.eventCatcher).move(function (event) {
      var relPos = pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
      stats.mouseXTop = relPos.x;
      stats.mouseYTop = relPos.y;
      // mousePosition.set(relPos);
      // pb.redraw();
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

    // +---------------------------------------------------------------------------------
    // | Initialize dat.gui
    // +-------------------------------
    {
      var gui = pb.createGUI();
      // prettier-ignore
      gui.add(config, 'safeZonePct').min(0.5).max(1.0).step(0.01).listen().onChange(function() { pb.redraw() }).name("safeZonePct").title("safeZonePct");
      // prettier-ignore
      gui.add(config, 'countH').min(1).max(100).step(1).listen().onChange(function() { computeTiles(); pb.redraw() }).name("countH").title("countH");
      // prettier-ignore
      gui.add(config, 'countV').min(1).max(100).step(1).listen().onChange(function() { computeTiles(); pb.redraw() }).name("countV").title("countV");
      // prettier-ignore
      gui.add(config, 'clearTilesOnRedraw').listen().onChange(function() { pb.redraw() }).name("clearTilesOnRedraw").title("clearTilesOnRedraw");
    }

    computeTiles();
    pb.config.postDraw = redraw;
    pb.redraw();
    pb.canvas.focus();
  };

  if (!window.pbPreventAutoLoad) {
    window.addEventListener("load", window.initializePB);
  }
})(window);
