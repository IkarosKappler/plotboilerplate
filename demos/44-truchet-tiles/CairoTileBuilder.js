/**
 * A configuration for Cairo truchet tilings.
 *
 * @date    2022-11-06
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
  // Connector indices (here with variant D, (vertical and secondary)):
  //       a   0   1   b
  //        +--*---*--+
  //       /           \
  //    9 *             * 2
  //     /               \
  //  8 *                 * 3
  //   /                   \
  // e ~                   ~ c
  //    ~                 ~
  //    7 *             * 4
  //        ~         ~
  //        6 *     * 5
  //            ~  ~
  //             +
  //             d
  // Four cases
  //   - Pointy edge left: A
  //   - Pointy edge right; B
  //   - Pointy edge up: C
  //   - Pointy edge down: D
  var allowedConnections = {
    0: [1, 3, 5, 7, 9],
    1: [0, 2, 4, 6, 8],
    2: [1, 3, 5, 7, 9],
    3: [0, 2, 4, 6, 8],
    4: [1, 3, 5, 7, 9],
    5: [0, 2, 4, 6, 8],
    6: [1, 3, 5, 7, 9],
    7: [0, 2, 4, 6, 8],
    8: [1, 3, 5, 7, 9],
    9: [0, 2, 4, 6, 8]
  };
  var CONNECTOR_COUNT = 10;
  var SIDE_CONNECTOR_COUNT = 2;

  var getCairoOutline = function (tileBounds, isVerticalSplit, isPrimary) {
    // A simple construction of Cairo tiles.
    // Consult the Wikipedia page for mathematical details
    //    https://en.wikipedia.org/wiki/Cairo_pentagonal_tiling
    var sqrt3m1 = Math.sqrt(3) - 1;
    var h_sqrt3m1_d2 = (tileBounds.height * sqrt3m1) / 3.0;
    var w_sqrt3m1_d2 = (tileBounds.width * sqrt3m1) / 3.0;

    if (isVerticalSplit) {
      if (isPrimary) {
        // Case C (pointy edge up)
        return new Polygon([
          new Vertex(tileBounds.min).addXY(tileBounds.width - w_sqrt3m1_d2, tileBounds.height / 2),
          new Vertex(tileBounds.min).addXY(w_sqrt3m1_d2, tileBounds.height / 2),
          new Vertex(tileBounds.min),
          new Vertex(tileBounds.min).addXY(tileBounds.width / 2, -h_sqrt3m1_d2),
          new Vertex(tileBounds.min).addX(tileBounds.width)
        ]);
      } else {
        // Case D (pointy edge down)
        return new Polygon([
          new Vertex(tileBounds.min).addXY(w_sqrt3m1_d2, tileBounds.height / 2),
          new Vertex(tileBounds.min).addXY(tileBounds.width - w_sqrt3m1_d2, tileBounds.height / 2),
          new Vertex(tileBounds.max),
          new Vertex(tileBounds.min).addXY(tileBounds.width / 2, tileBounds.height + h_sqrt3m1_d2),
          new Vertex(tileBounds.min).addY(tileBounds.height)
        ]);
      }
    } else {
      if (isPrimary) {
        // Case A (pointy edge left)
        return new Polygon([
          new Vertex(tileBounds.min).addXY(tileBounds.width / 2, h_sqrt3m1_d2),
          new Vertex(tileBounds.max).addXY(-tileBounds.width / 2, -h_sqrt3m1_d2),
          new Vertex(tileBounds.min).addY(tileBounds.height),
          new Vertex(tileBounds.min).addXY(-w_sqrt3m1_d2, tileBounds.height / 2),
          new Vertex(tileBounds.min)
        ]);
      } else {
        // Case B (pointy edge right)
        return new Polygon([
          new Vertex(tileBounds.min).addXY(tileBounds.width / 2, tileBounds.height - h_sqrt3m1_d2),
          new Vertex(tileBounds.min).addXY(tileBounds.width / 2, h_sqrt3m1_d2),
          new Vertex(tileBounds.min).addX(tileBounds.width),
          new Vertex(tileBounds.min).addXY(tileBounds.width + w_sqrt3m1_d2, tileBounds.height / 2),
          new Vertex(tileBounds.max)
        ]);
      }
    }
  };

  // This function determines if the connecting path is a long one. The relation
  // should be symmetrical (if a connection from 0 to 3 is long, then the connection
  // fropm 3 to 0 should be long, too).
  //
  // Long connections a draw as a longer arc, short connections are drawn as a shorter arc.
  var isLongConnection = function (indexA, indexB) {
    var discreteDistance = Math.abs(indexA - indexB) % (CONNECTOR_COUNT - 1);
    return discreteDistance > 1;
  };

  var CairoTileBuilder = function () {
    // NOOP
  };
  CairoTileBuilder.LONG_PATH_FACTOR = 1.333;
  CairoTileBuilder.SHORT_PATH_FACTOR = 0.666;

  _context.CairoTileBuilder = CairoTileBuilder;

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
  _context.CairoTileBuilder.computeTiles = function (bounds, config) {
    var tiles = [];
    var tileSize = Bounds.fromDimension(bounds.width / config.countH, bounds.height / config.countV, bounds.min);
    // Use an uderlying rectangular pattern to create the Cairo tiles.
    for (var i = 0; i < config.countH; i++) {
      for (var j = 0; j < config.countV; j++) {
        var tileBounds = new Bounds(
          { x: bounds.min.x + tileSize.width * i, y: bounds.min.y + tileSize.height * j },
          { x: bounds.min.x + tileSize.width * (i + 1), y: bounds.min.y + tileSize.height * (j + 1) }
        );
        const primaryTile = makeTruchetCairo(tileBounds, config, i, j, true);
        tiles.push(primaryTile);
        const secondaryTile = makeTruchetCairo(tileBounds, config, i, j, false);
        tiles.push(secondaryTile);
      }
    }
    return tiles;
  };

  /**
   * Construct the next Truchet Cairo tile withing the given tile bounds.
   *
   * @param {Bounds} tileBounds - The bounding box for the new tile.
   * @param {number} config.countV - The vertical pattern size (measured in tile count).
   * @param {number} config.countH - The horizontal pattern size (measured in tile count).
   **/
  var makeTruchetCairo = function (tileBounds, config, indexH, indexV, isPrimary) {
    var isVerticalSplit = (indexH % 2 === 0 && indexV % 2 !== 0) || (indexH % 2 !== 0 && indexV % 2 === 0);
    var outlinePolygon = getCairoOutline(tileBounds, isVerticalSplit, isPrimary);
    // console.log("outlinePolygon.vertices.length", outlinePolygon.vertices.length);
    var connections = []; // Array<{ line: Line, curveSegment: CubicBezierCurve, indices : [number,number] } >
    // var isConnected = [false, false, false, false, false, false, false, false, false, false];
    var isConnected = arrayFill(CONNECTOR_COUNT, false);
    var indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // TODO: use array_fill here?
    arrayShuffle(indices);
    for (var i = 0; i < CONNECTOR_COUNT; i++) {
      var start = indices[i];
      if (isConnected[start]) {
        continue;
      }
      arrayShuffle(allowedConnections[start]);
      for (var j = 0; j < allowedConnections[start].length; j++) {
        var end = allowedConnections[start][j];
        var startVector = getCairoConnectorLocation(outlinePolygon, SIDE_CONNECTOR_COUNT, start, end, config);
        if (isConnected[end]) {
          // Elements are already connected
          continue;
        }
        var endVector = getCairoConnectorLocation(outlinePolygon, SIDE_CONNECTOR_COUNT, end, start, config);
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
        // Leftmost borders
        if (isVerticalSplit) {
          if (isPrimary) {
            // Variant C
            closeTileAt(outlinePolygon, connections, 2, 3, config);
          } else {
            // Variant D
            closeTileAt(outlinePolygon, connections, 8, 9, config);
          }
        } else {
          if (isPrimary) {
            // Variant A
            closeTileAt(outlinePolygon, connections, 4, 5, config);
            closeTileAt(outlinePolygon, connections, 6, 7, config);
          } else {
            // Variant B (no need to close anything here)
          }
        }
      }
      if (indexH + 1 === config.countH) {
        // Rightmose borders
        if (isVerticalSplit) {
          if (isPrimary) {
            // Variant C
            closeTileAt(outlinePolygon, connections, 8, 9, config);
          } else {
            // Variant D
            closeTileAt(outlinePolygon, connections, 2, 3, config);
          }
        } else {
          if (isPrimary) {
            // Variant A (no need to close anything here)
          } else {
            // Variant B (no need to close anything here)
            closeTileAt(outlinePolygon, connections, 4, 5, config);
            closeTileAt(outlinePolygon, connections, 6, 7, config);
          }
        }
      }
      if (indexV === 0) {
        // Uppermost borders
        if (isVerticalSplit) {
          if (isPrimary) {
            // Variant C
            closeTileAt(outlinePolygon, connections, 4, 5, config);
            closeTileAt(outlinePolygon, connections, 6, 7, config);
          } else {
            // Variant D (no need to close anything here)
          }
        } else {
          if (isPrimary) {
            // Variant A
            // closeTileAt(outlinePolygon, connections, 4, 5, config);
            closeTileAt(outlinePolygon, connections, 8, 9, config);
          } else {
            // Variant B (no need to close anything here)
            closeTileAt(outlinePolygon, connections, 2, 3, config);
          }
        }
      }
      if (indexV + 1 === config.countV) {
        // Lowermost borders
        if (isVerticalSplit) {
          if (isPrimary) {
            // Variant C (no need to close anything here)
          } else {
            // Variant D (no need to close anything here)
            closeTileAt(outlinePolygon, connections, 4, 5, config);
            closeTileAt(outlinePolygon, connections, 6, 7, config);
          }
        } else {
          if (isPrimary) {
            // Variant A
            // closeTileAt(outlinePolygon, connections, 4, 5, config);
            closeTileAt(outlinePolygon, connections, 2, 3, config);
          } else {
            // Variant B
            closeTileAt(outlinePolygon, connections, 8, 9, config);
          }
        }
      }
    }

    return { bounds: tileBounds, connections: connections, outlinePolygon: outlinePolygon };
  };

  // +---------------------------------------------------------------------------------
  // | Close a tile at the bounds of the whole pattern (no adjacent tile available).
  // | Solution: just use the inverse of the connecting inner vectors (flip them to the outside).
  // +-------------------------------
  var closeTileAt = function (outlinePolygon, connections, cairoConnectorIndexA, cairoConnectorIndexB, config) {
    var startVector = getCairoConnectorLocation(
      outlinePolygon,
      SIDE_CONNECTOR_COUNT,
      cairoConnectorIndexA,
      cairoConnectorIndexB,
      config
    );
    var endVector = getCairoConnectorLocation(
      outlinePolygon,
      SIDE_CONNECTOR_COUNT,
      cairoConnectorIndexB,
      cairoConnectorIndexA,
      config
    );
    startVector.inv();
    endVector.inv();

    connections.push({
      line: new Line(startVector, endVector),
      curveSegment: new CubicBezierCurve(startVector.a, endVector.a, startVector.b, endVector.b),
      indices: [cairoConnectorIndexA, cairoConnectorIndexB]
    });
  };

  // Get the square connector vector
  // @return Vector
  var getCairoConnectorLocation = function (outlinePolygon, sideConnectorCount, connectorIndexA, connectorIndexB, config) {
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
