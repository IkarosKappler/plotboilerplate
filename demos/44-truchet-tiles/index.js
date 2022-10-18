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

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // TODO: CubicBezierCurve already has a `reverse` method!!!!!!!!
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1 -> rename `revert` in Path!

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

    var randColor = function (i, alpha) {
      var color = WebColorsContrast[i % WebColorsContrast.length].clone();
      if (typeof alpha !== undefined) color.a = alpha;
      return color.cssRGBA();
    };

    var viewport = pb.viewport();

    // +---------------------------------------------------------------------------------
    // | A global config that's attached to the dat.gui control interface.
    // +-------------------------------
    var config = PlotBoilerplate.utils.safeMergeByKeys(
      {
        safeZonePct: 0.1,
        countH: 10,
        countV: 10,
        clearTilesOnRedraw: true,
        drawLinearConnections: false,
        drawTruchetRaster: false,
        closePattern: false
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
          const tile = makeTruchetSquare(tileBounds, i, j);
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
    // --- { point, controlPoint }
    // +++ { a, b }
    var getSquareConnectorLocation = function (tileBounds, connectorIndex) {
      switch (connectorIndex) {
        case 0:
          return {
            a: new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y),
            b: new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + tileBounds.height / 3)
          };
        case 1:
          return {
            a: new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y),
            b: new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + tileBounds.height / 3)
          };
        case 2:
          return {
            a: new Vertex(tileBounds.max.x, tileBounds.min.y + tileBounds.height / 3),
            b: new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + tileBounds.height / 3)
          };
        case 3:
          return {
            a: new Vertex(tileBounds.min.x + tileBounds.width, tileBounds.min.y + (tileBounds.height / 3) * 2),
            b: new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + (tileBounds.height / 3) * 2)
          };
        case 4:
          return {
            a: new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.max.y),
            b: new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + (tileBounds.height / 3) * 2)
          };
        case 5:
          return {
            a: new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.max.y),
            b: new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + (tileBounds.height / 3) * 2)
          };
        case 6:
          return {
            a: new Vertex(tileBounds.min.x, tileBounds.min.y + (tileBounds.height / 3) * 2),
            b: new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + (tileBounds.height / 3) * 2)
          };
        case 7:
          return {
            a: new Vertex(tileBounds.min.x, tileBounds.min.y + tileBounds.height / 3),
            b: new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + tileBounds.height / 3)
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
    var makeTruchetSquare = function (tileBounds, indexH, indexV) {
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
          var line = new Line(startVector.a, endVector.a);
          if (!canConnectLine(line, connections)) {
            // console.log("Cannot connect ", start, end);
            continue;
          }
          connections.push({
            line: line,
            // startVector: startVector,
            // endVector: endVector,
            curveSegment: new CubicBezierCurve(startVector.a, endVector.a, startVector.b, endVector.b),
            indices: [start, allowedConnections[start][j]]
          });
          isConnected[start] = true;
          isConnected[allowedConnections[start][j]] = true;
        }
      }

      // If on the border of the grid close connections in a linear manner
      if (config.closePattern) {
        var startVector, endVector;
        if (indexH === 0) {
          // startVector = getSquareConnectorLocation(tileBounds, 7);
          // endVector = getSquareConnectorLocation(tileBounds, 6);
          // connections.push({
          //   line: new Line(startVector, endVector),
          //   curveSegment: new CubicBezierCurve(
          //     startVector.a,
          //     endVector.a,
          //     startVector.a.clone().lerp(endVector.a, 0.3),
          //     endVector.a.clone().lerp(startVector.a, 0.3),
          //     indices[[7, 6]]
          //   )
          // });
          closeTileAt(tileBounds, connections, 6, 7);
        }
        if (indexH + 1 === config.countH) {
          // startVector = getSquareConnectorLocation(tileBounds, 2);
          // endVector = getSquareConnectorLocation(tileBounds, 3);
          // connections.push({
          //   line: new Line(startVector, endVector),
          //   curveSegment: new CubicBezierCurve(
          //     startVector.a,
          //     endVector.a,
          //     startVector.a.clone().lerp(endVector.a, 0.3),
          //     endVector.a.clone().lerp(startVector.a, 0.3),
          //     indices[[2, 3]]
          //   )
          // });
          closeTileAt(tileBounds, connections, 2, 3);
        }
        if (indexH === 0) {
          // startVector = getSquareConnectorLocation(tileBounds, 0);
          // endVector = getSquareConnectorLocation(tileBounds, 1);
          // connections.push({
          //   line: new Line(startVector, endVector),
          //   curveSegment: new CubicBezierCurve(
          //     startVector.a,
          //     endVector.a,
          //     startVector.a.clone().lerp(endVector.a, 0.3),
          //     endVector.a.clone().lerp(startVector.a, 0.3),
          //     indices[[0, 1]]
          //   )
          // });
          closeTileAt(tileBounds, connections, 0, 1);
        }
        if (indexH + 1 === config.countH) {
          // startVector = getSquareConnectorLocation(tileBounds, 5);
          // endVector = getSquareConnectorLocation(tileBounds, 4);
          // connections.push({
          //   line: new Line(startVector, endVector),
          //   curveSegment: new CubicBezierCurve(
          //     startVector.a,
          //     endVector.a,
          //     startVector.a.clone().lerp(endVector.a, 0.3),
          //     endVector.a.clone().lerp(startVector.a, 0.3),
          //     indices[(5, 4)]
          //   )
          // });
          closeTileAt(tileBounds, connections, 4, 5);
        }
      }

      return { bounds: tileBounds, connections: connections };
    };

    var closeTileAt = function (tileBounds, connections, squareConnectorIndexA, squareConnectorIndexB) {
      startVector = getSquareConnectorLocation(tileBounds, squareConnectorIndexA); //.addXY(5, 5);
      endVector = getSquareConnectorLocation(tileBounds, squareConnectorIndexB); // .addXY(5, 5);
      connections.push({
        line: new Line(startVector, endVector),
        curveSegment: new CubicBezierCurve(
          startVector.a,
          endVector.a,
          startVector.a.clone().lerp(endVector.a, 0.3),
          endVector.a.clone().lerp(startVector.a, 0.3),
          indices[(squareConnectorIndexA, squareConnectorIndexB)]
        )
      });
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
      var pathSegments = []; // Array<PathSegment>
      for (var tileIndex in tiles) {
        // console.log("tile", tile);
        var tile = tiles[tileIndex];
        if (config.drawTruchetRaster) {
          draw.rect(tile.bounds.min, tile.bounds.width, tile.bounds.height, "rgba(0,255,0,0.5)", 1);
        }
        for (var c in tile.connections) {
          var connection = tile.connections[c];
          if (config.drawLinearConnections) {
            draw.line(connection.line.a, connection.line.b, "rgba(192,192,192,0.1)", 3);
          }
          // console.log("connection", connection);
          draw.cubicBezier(
            connection.curveSegment.startPoint,
            connection.curveSegment.endPoint,
            connection.curveSegment.startControlPoint,
            connection.curveSegment.endControlPoint,
            "rgba(192,0,192,0.75)",
            2
          );
          fill.text("SP", connection.curveSegment.startPoint.x - 5, connection.curveSegment.startPoint.y - 1, {
            color: "rgba(128,128,128,0.5)"
          });
          fill.text("EP", connection.curveSegment.endPoint.x + 5, connection.curveSegment.endPoint.y + 1, {
            color: "rgba(128,0,128,0.5)"
          });
          pathSegments.push(connection.curveSegment);
          // if( i === 0 || i+1 ===) {

          // }
        }
      }

      // Find connected paths
      console.log("Path segments generated", pathSegments.length);
      var paths = detectPaths(pathSegments);
      console.log("paths found", paths.length);
      console.log("paths", paths);

      // Connect adjacent paths?
      // paths = detectPaths(paths);

      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        // draw.cubicBezierPath(path: Array<Vertex>, color: string, lineWidth?: number) {
        draw.cubicBezierPath(cubicBezierPath2VertexArray(path), randColor(i, 0.5), 2);
      }
    };

    var cubicBezierPath2VertexArray = function (path) {
      if (path.getSegmentCount() === 0) {
        return [];
      }
      var result = [];
      result.push(path.getSegmentAt(0).startPoint);
      for (var i = 0; i < path.getSegmentCount(); i++) {
        var curve = path.getSegmentAt(i);
        result.push(curve.startControlPoint, curve.endControlPoint, curve.endPoint);
      }
      return result;
    };

    // Add a mouse listener to track the mouse position.
    new MouseHandler(pb.eventCatcher).move(function (event) {
      var relPos = pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
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
      // prettier-ignore
      gui.add(config, 'drawLinearConnections').listen().onChange(function() { pb.redraw() }).name("drawLinearConnections").title("drawLinearConnections");
      // prettier-ignore
      gui.add(config, 'drawTruchetRaster').listen().onChange(function() { pb.redraw() }).name("drawTruchetRaster").title("drawTruchetRaster");
      // prettier-ignore
      gui.add(config, 'closePattern').listen().onChange(function() { computeTiles(); pb.redraw(); }).name("closePattern").title("closePattern");
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
