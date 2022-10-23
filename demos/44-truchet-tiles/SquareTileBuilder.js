/**
 * A configuration for square truchet tilings.
 *
 * @date    2022-10-23
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
  var SquareTileBuilder = function () {
    // this.bounds = bound;
    // this.config = config;
  };

  var makeTruchetSquare = function (tileBounds, config, indexH, indexV, closePattern) {
    var connections = []; // Array<{ line: Line, startVector, endVector, indices : [number,number] } >
    var isConnected = [false, false, false, false, false, false, false, false];
    var indices = [0, 1, 2, 3, 4, 5, 6, 7];
    arrayShuffle(indices);
    for (var i = 0; i < 8; i++) {
      var start = indices[i];
      if (isConnected[start]) {
        continue;
      }
      var startVector = SquareTileBuilder.getSquareConnectorLocation(tileBounds, start);
      arrayShuffle(SquareTileBuilder.allowedConnections[start]);
      // if (start === 0) {
      //   console.log("Shuffled", allowedConnections[start]);
      // }
      for (var j = 0; j < SquareTileBuilder.allowedConnections[start].length; j++) {
        var end = SquareTileBuilder.allowedConnections[start][j];
        if (isConnected[end]) {
          // console.log("isconnected", end);
          continue;
        }
        var endVector = SquareTileBuilder.getSquareConnectorLocation(tileBounds, end);
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
          indices: [start, SquareTileBuilder.allowedConnections[start][j]]
        });
        isConnected[start] = true;
        isConnected[SquareTileBuilder.allowedConnections[start][j]] = true;
      }
    }

    // If on the border of the grid close connections in a linear manner
    if (closePattern) {
      var startVector, endVector;
      if (indexH === 0) {
        closeTileAt(tileBounds, connections, 6, 7);
      }
      if (indexH + 1 === config.countH) {
        closeTileAt(tileBounds, connections, 2, 3);
      }
      if (indexV === 0) {
        closeTileAt(tileBounds, connections, 0, 1);
      }
      if (indexV + 1 === config.countV) {
        closeTileAt(tileBounds, connections, 4, 5);
      }
    }

    return { bounds: tileBounds, connections: connections };
  };

  _context.SquareTileBuilder = SquareTileBuilder;

  _context.SquareTileBuilder.computeTiles = function (bounds, config) {
    // if (config.clearTilesOnRedraw) {
    //   tiles = [];
    // }
    // var bounds = new Bounds(
    //   { x: viewport.min.x + viewport.width * config.safeZonePct, y: viewport.min.y + viewport.height * config.safeZonePct },
    //   {
    //     x: viewport.min.x + viewport.width * config.safeZonePct + viewport.width * (1 - 2 * config.safeZonePct),
    //     y: viewport.min.y + viewport.height * config.safeZonePct + viewport.height * (1 - 2 * config.safeZonePct)
    //   }
    // );

    var tiles = [];

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
        const tile = makeTruchetSquare(tileBounds, config, i, j, config.closePattern);
        tiles.push(tile);
      }
    }

    return tiles;
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

  // +---------------------------------------------------------------------------------
  // | Close a tile at the bounds of the whole pattern (no adjacent tile available).
  // | Solution: just use the inverse of the connecting inner vectors (flip them to the outside).
  // +-------------------------------
  var closeTileAt = function (tileBounds, connections, squareConnectorIndexA, squareConnectorIndexB) {
    var startVector = SquareTileBuilder.getSquareConnectorLocation(tileBounds, squareConnectorIndexA);
    var endVector = SquareTileBuilder.getSquareConnectorLocation(tileBounds, squareConnectorIndexB);
    startVector.inv();
    endVector.inv();

    connections.push({
      line: new Line(startVector, endVector),
      curveSegment: new CubicBezierCurve(startVector.a, endVector.a, startVector.b, endVector.b),
      indices: [squareConnectorIndexA, squareConnectorIndexB]
    });
  };

  // _context.SquareTileBuilder.sideCount = 4;
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
  _context.SquareTileBuilder.allowedConnections = {
    0: [1, 3, 5, 7],
    1: [0, 2, 4, 6],
    2: [1, 3, 5, 7],
    3: [0, 2, 4, 6],
    4: [1, 3, 5, 7],
    5: [0, 2, 4, 6],
    6: [1, 3, 5, 7],
    7: [0, 2, 4, 6]
  };

  // Get the sqare connector vector
  // @return Vector
  _context.SquareTileBuilder.getSquareConnectorLocation = function (tileBounds, connectorIndex) {
    switch (connectorIndex) {
      case 0:
        return new Vector(
          new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y),
          new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + tileBounds.height / 3)
        );
      case 1:
        return new Vector(
          new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y),
          new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + tileBounds.height / 3)
        );
      case 2:
        return new Vector(
          new Vertex(tileBounds.max.x, tileBounds.min.y + tileBounds.height / 3),
          new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + tileBounds.height / 3)
        );
      case 3:
        return new Vector(
          new Vertex(tileBounds.min.x + tileBounds.width, tileBounds.min.y + (tileBounds.height / 3) * 2),
          new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + (tileBounds.height / 3) * 2)
        );
      case 4:
        return new Vector(
          new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.max.y),
          new Vertex(tileBounds.min.x + (tileBounds.width / 3) * 2, tileBounds.min.y + (tileBounds.height / 3) * 2)
        );
      case 5:
        return new Vector(
          new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.max.y),
          new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + (tileBounds.height / 3) * 2)
        );
      case 6:
        return new Vector(
          new Vertex(tileBounds.min.x, tileBounds.min.y + (tileBounds.height / 3) * 2),
          new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + (tileBounds.height / 3) * 2)
        );
      case 7:
        return new Vector(
          new Vertex(tileBounds.min.x, tileBounds.min.y + tileBounds.height / 3),
          new Vertex(tileBounds.min.x + tileBounds.width / 3, tileBounds.min.y + tileBounds.height / 3)
        );
    }
  };
})(globalThis);
