/**
 * A configuration for square truchet tilings.
 *
 * @date    2022-10-23
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
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
  var CONNECTOR_COUNT = 8;
  var SIDE_CONNECTOR_COUNT = 2;

  // This function determines if the connecting path is a long one. The relation
  // should be symmetrical (if a connection from 0 to 3 is long, then the connection
  // fropm 3 to 0 should be long, too).
  //
  // Long connections a draw as a longer arc, short connections are drawn as a shorter arc.
  var isLongConnection = function (indexA, indexB) {
    return (
      (indexA === 0 && (indexB === 3 || indexB === 5)) ||
      (indexA === 1 && (indexB === 4 || indexB === 6)) ||
      (indexA === 2 && (indexB === 5 || indexB === 7)) ||
      (indexA === 3 && (indexB === 0 || indexB === 6)) ||
      (indexA === 4 && (indexB === 1 || indexB === 7)) ||
      (indexA === 5 && (indexB === 0 || indexB === 2)) ||
      (indexA === 6 && (indexB === 1 || indexB === 3)) ||
      (indexA === 7 && (indexB === 2 || indexB === 4))
    );
  };

  var SquareTileBuilder = function () {
    // NOOP
  };
  SquareTileBuilder.LONG_PATH_FACTOR = 1.0;
  SquareTileBuilder.SHORT_PATH_FACTOR = 0.555;

  _context.SquareTileBuilder = SquareTileBuilder;

  /**
   * Construct a plane-filling (inside the given plane bounds) pattern of trinagular tiles.
   *
   * @param {Bounds} bounds - The plane bounds to build the pattern within.
   * @param {number} config.countV - The vertical pattern size (measured in tile count).
   * @param {number} config.countH - The horizontal pattern size (measured in tile count).
   * @param {boolean} config.closePattern - Pass `true` if the pattern should be closed at its borders.
   * @param {number} config.longConnectionFactor - The Beziér bending factor to use for long connections.
   * @param {number} config.shortConnectionFactor - The Beziér bending factor to use for short connections.
   **/
  _context.SquareTileBuilder.computeTiles = function (bounds, config) {
    var tiles = [];

    var tileSize = Bounds.fromDimension(bounds.width / config.countH, bounds.height / config.countV, bounds.min);
    for (var i = 0; i < config.countH; i++) {
      for (var j = 0; j < config.countV; j++) {
        var tileBounds = new Bounds(
          { x: bounds.min.x + tileSize.width * i, y: bounds.min.y + tileSize.height * j },
          { x: bounds.min.x + tileSize.width * (i + 1), y: bounds.min.y + tileSize.height * (j + 1) }
        );
        const tile = makeTruchetSquare(tileBounds, config, i, j);
        tiles.push(tile);
      }
    }

    return tiles;
  };

  /**
   * Construct the next Truchet square withing the given tile bounds.
   *
   * @param {Bounds} tileBounds - The bounding box for the new tile.
   * @param {number} config.countV - The vertical pattern size (measured in tile count).
   * @param {number} config.countH - The horizontal pattern size (measured in tile count).
   **/
  var makeTruchetSquare = function (tileBounds, config, indexH, indexV) {
    var outlinePolygon = tileBounds.toPolygon();
    var connections = []; // Array<{ line: Line, curveSegment: CubicBezierCurve, indices : [number,number] } >
    var isConnected = arrayFill(CONNECTOR_COUNT, false); // [false, false, false, false, false, false, false, false];
    var indices = [0, 1, 2, 3, 4, 5, 6, 7]; // TODO: use array_fill here?
    arrayShuffle(indices);
    for (var i = 0; i < CONNECTOR_COUNT; i++) {
      var start = indices[i];
      if (isConnected[start]) {
        continue;
      }
      arrayShuffle(allowedConnections[start]);
      for (var j = 0; j < allowedConnections[start].length; j++) {
        var end = allowedConnections[start][j];
        var startVector = getSquareConnectorLocation(outlinePolygon, SIDE_CONNECTOR_COUNT, start, end, config);
        if (isConnected[end]) {
          // Elements are already connected
          continue;
        }
        var endVector = getSquareConnectorLocation(outlinePolygon, SIDE_CONNECTOR_COUNT, end, start, config);
        var line = new Line(startVector.a, endVector.a);
        if (!TruchetUtils.canConnectLine(line, connections)) {
          // Elements cannot be connected (would intersect with existing connection)
          continue;
        }
        connections.push({
          line: line,
          curveSegment: new CubicBezierCurve(startVector.a, endVector.a, startVector.b, endVector.b),
          indices: [start, end]
        });
        isConnected[start] = true;
        isConnected[end] = true;
      }
    }

    // If on the border of the grid close connections in a linear manner
    if (config.closePattern) {
      if (indexH === 0) {
        closeTileAt(outlinePolygon, connections, 6, 7, config);
      }
      if (indexH + 1 === config.countH) {
        closeTileAt(outlinePolygon, connections, 2, 3, config);
      }
      if (indexV === 0) {
        closeTileAt(outlinePolygon, connections, 0, 1, config);
      }
      if (indexV + 1 === config.countV) {
        closeTileAt(outlinePolygon, connections, 4, 5, config);
      }
    }

    // return { bounds: tileBounds, connections: connections, outlinePolygon: outlinePolygon };
    // Prepate re-builder for connections
    var tile = {
      bounds: tileBounds,
      connections: connections,
      outlinePolygon: outlinePolygon
    };
    var rebuildConnections = function () {
      var newTile = makeTruchetSquare(tileBounds, config, indexH, indexV);
      tile.connections = newTile.connections;
    };
    tile.rebuildConnections = rebuildConnections;
    return tile;
  };

  // +---------------------------------------------------------------------------------
  // | Close a tile at the bounds of the whole pattern (no adjacent tile available).
  // | Solution: just use the inverse of the connecting inner vectors (flip them to the outside).
  // +-------------------------------
  var closeTileAt = function (outlinePolygon, connections, squareConnectorIndexA, squareConnectorIndexB, config) {
    var startVector = getSquareConnectorLocation(
      outlinePolygon,
      SIDE_CONNECTOR_COUNT,
      squareConnectorIndexA,
      squareConnectorIndexB,
      config
    );
    var endVector = getSquareConnectorLocation(
      outlinePolygon,
      SIDE_CONNECTOR_COUNT,
      squareConnectorIndexB,
      squareConnectorIndexA,
      config
    );
    startVector.inv();
    endVector.inv();

    connections.push({
      line: new Line(startVector, endVector),
      curveSegment: new CubicBezierCurve(startVector.a, endVector.a, startVector.b, endVector.b),
      indices: [squareConnectorIndexA, squareConnectorIndexB]
    });
  };

  // Get the square connector vector
  // @return Vector
  var getSquareConnectorLocation = function (outlinePolygon, sideConnectorCount, connectorIndexA, connectorIndexB, config) {
    // Just get the normal connector and apply a pattern-specific scale factor.
    var parallelVector = TruchetUtils.getOrthoConnectorLocation(
      outlinePolygon,
      sideConnectorCount,
      connectorIndexA,
      connectorIndexB
    );
    var isLong = isLongConnection(connectorIndexA, connectorIndexB);
    // return parallelVector.scale(isLong ? 1.0 : 0.555);
    return parallelVector.scale(isLong ? config.longConnectionFactor : config.shortConnectionFactor);
  };
})(globalThis);
