/**
 * A configuration for square truchet tilings.
 *
 * @date    2022-10-23
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
  // Connector indices:
  //
  // Case A:
  //        +
  //       / \
  //      /   \
  //   1 *     * 2
  //    /       \
  // 0 *         * 3
  //  /           \
  // +----*---*----+
  //      5   4
  //
  // Case B:
  //      2   3
  // +----*---*----+
  //  \           /
  // 1 *         * 4
  //    \       /
  //   0 *     * 5
  //      \   /
  //       \ /
  //        +

  var allowedConnections = {
    0: [1, 3, 5],
    1: [0, 2, 4],
    2: [1, 3, 5],
    3: [0, 2, 4],
    4: [1, 3, 5],
    5: [0, 2, 4]
  };
  var CONNECTOR_COUNT = 6;
  var SIDE_CONNECTOR_COUNT = 2;

  // This function determines if the connecting path is a long one. The relation
  // should be symmetrical (if a connection from 0 to 3 is long, then the connection
  // fropm 3 to 0 should be long, too).
  //
  // Long connections a draw as a longer arc, short connections are drawn as a shorter arc.
  var isLongConnection = function (indexA, indexB) {
    return (
      (indexA === 0 && indexB === 3) ||
      (indexA === 1 && indexB === 4) ||
      (indexA === 2 && indexB === 5) ||
      (indexA === 3 && indexB === 0) ||
      (indexA === 4 && indexB === 1) ||
      (indexA === 5 && indexB === 2)
    );
  };

  var TriangleTileBuilder = function () {
    // NOOP
  };
  TriangleTileBuilder.LONG_PATH_FACTOR = 0.75;
  TriangleTileBuilder.SHORT_PATH_FACTOR = 0.4;

  _context.TriangleTileBuilder = TriangleTileBuilder;

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
  _context.TriangleTileBuilder.computeTiles = function (bounds, config) {
    var tiles = [];
    var tileSize = Bounds.fromDimension(bounds.width / config.countH, bounds.height / config.countV, bounds.min);
    for (var i = 0; i < config.countH * 2; i++) {
      for (var j = 0; j < config.countV; j++) {
        var tileBounds = new Bounds(
          { x: bounds.min.x + (tileSize.width / 2) * i, y: bounds.min.y + tileSize.height * j },
          { x: bounds.min.x + (tileSize.width / 2) * i + tileSize.width, y: bounds.min.y + tileSize.height * (j + 1) }
        );
        const tile = makeTruchetTriangle(tileBounds, config, i, j);
        tiles.push(tile);
      }
    }
    return tiles;
  };

  /**
   * Construct the next Truchet triangle withing the given tile bounds.
   *
   * @param {Bounds} tileBounds - The bounding box for the new tile.
   * @param {number} config.countV - The vertical pattern size (measured in tile count).
   * @param {number} config.countH - The horizontal pattern size (measured in tile count).
   **/
  var makeTruchetTriangle = function (tileBounds, config, indexH, indexV) {
    var isSpikeDown = (indexH % 2 && !(indexV % 2)) || (!(indexH % 2) && indexV % 2);
    var outlineVertices = isSpikeDown
      ? [
          new Vertex(tileBounds.min.x + tileBounds.width / 2, tileBounds.max.y),
          new Vertex(tileBounds.min.x, tileBounds.min.y),
          new Vertex(tileBounds.max.x, tileBounds.min.y)
        ]
      : [
          new Vertex(tileBounds.min.x, tileBounds.max.y),
          new Vertex(tileBounds.min.x + tileBounds.width / 2, tileBounds.min.y),
          new Vertex(tileBounds.max.x, tileBounds.max.y)
        ];
    var outlinePolygon = new Polygon(outlineVertices);
    var connections = []; // Array<{ line: Line, startVector, endVector, indices : [number,number] } >
    var isConnected = arrayFill(CONNECTOR_COUNT, false); // [false, false, false, false, false];
    var indices = [0, 1, 2, 3, 4, 5]; // Use something like array_fill here?
    arrayShuffle(indices);
    for (var i = 0; i < CONNECTOR_COUNT; i++) {
      var start = indices[i];
      if (isConnected[start]) {
        continue;
      }
      arrayShuffle(allowedConnections[start]);
      for (var j = 0; j < allowedConnections[start].length; j++) {
        var end = allowedConnections[start][j];
        var startVector = getTriangleConnectorLocation(outlinePolygon, SIDE_CONNECTOR_COUNT, start, end, config);
        if (isConnected[end]) {
          continue;
        }
        var endVector = getTriangleConnectorLocation(outlinePolygon, SIDE_CONNECTOR_COUNT, end, start, config);
        var line = new Line(startVector.a, endVector.a);
        if (!TruchetUtils.canConnectLine(line, connections)) {
          continue;
        }
        connections.push({
          line: line,
          curveSegment: new CubicBezierCurve(startVector.a, endVector.a, startVector.b, endVector.b),
          indices: [start, allowedConnections[start][j]]
        });
        isConnected[start] = true;
        isConnected[allowedConnections[start][j]] = true;
      }
    }

    // If on the border of the grid close connections in a linear manner
    if (config.closePattern) {
      if (indexV === 0) {
        if (isSpikeDown) closeTileAt(tileBounds, outlinePolygon, connections, 2, 3, config);
      }
      if (indexV + 1 === config.countV) {
        if (!isSpikeDown) closeTileAt(tileBounds, outlinePolygon, connections, 4, 5, config);
      }
      if (indexH === 0) {
        // In both cases: spikeDown and not spikeDown
        closeTileAt(tileBounds, outlinePolygon, connections, 0, 1, config);
      }
      if (indexH + 1 === config.countH * 2) {
        if (isSpikeDown) closeTileAt(tileBounds, outlinePolygon, connections, 4, 5, config);
        else closeTileAt(tileBounds, outlinePolygon, connections, 2, 3, config);
      }
    }

    return { bounds: tileBounds, connections: connections, outlinePolygon: outlinePolygon };
  };

  // +---------------------------------------------------------------------------------
  // | Close a tile at the bounds of the whole pattern (no adjacent tile available).
  // | Solution: just use the inverse of the connecting inner vectors (flip them to the outside).
  // +-------------------------------
  var closeTileAt = function (tileBounds, outlinePolygon, connections, squareConnectorIndexA, squareConnectorIndexB, config) {
    var startVector = getTriangleConnectorLocation(
      outlinePolygon,
      SIDE_CONNECTOR_COUNT,
      squareConnectorIndexA,
      squareConnectorIndexB,
      config
    );
    var endVector = getTriangleConnectorLocation(
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

  // Get the triangulare connector vector
  // @return Vector
  var getTriangleConnectorLocation = function (outlinePolygon, sideConnectorCount, connectorIndexA, connectorIndexB, config) {
    // Just get the normal connector and apply a pattern-specific scale factor.
    var parallelVector = TruchetUtils.getOrthoConnectorLocation(
      outlinePolygon,
      sideConnectorCount,
      connectorIndexA,
      connectorIndexB
    );
    var isLong = isLongConnection(connectorIndexA, connectorIndexB);
    // return parallelVector.scale(isLong ? 0.75 : 0.4);
    return parallelVector.scale(isLong ? config.longConnectionFactor : config.shortConnectionFactor);
  };
})(globalThis);
