/**
 * A configuration for square truchet tilings.
 *
 * @date    2022-10-23
 * @author  Ikaros Kappler
 * @version 1.0.0
 */

(function (_context) {
  // Connector indices:

  //       / \
  //      /   \
  //   1 *     * 2
  //    /       \
  // 0 *         * 3
  //  /           \
  // +----*---*----+
  //      5   4
  var allowedConnections = {
    0: [1, 3, 5],
    1: [0, 2, 4],
    2: [1, 3, 5],
    3: [0, 2, 4],
    4: [1, 3, 5],
    5: [0, 2, 4]
  };
  var connectorCount = 6;

  var TriangleTileBuilder = function () {
    // NOOP
  };

  _context.TriangleTileBuilder = TriangleTileBuilder;

  _context.TriangleTileBuilder.computeTiles = function (bounds, config) {
    var tiles = [];

    var tileSize = Bounds.fromDimension(bounds.width / config.countH, bounds.height / config.countV, bounds.min);
    // console.log("tileSize", tileSize);
    for (var i = 0; i < config.countH * 2; i++) {
      for (var j = 0; j < config.countV; j++) {
        var tileBounds = new Bounds(
          { x: bounds.min.x + (tileSize.width / 2) * i, y: bounds.min.y + tileSize.height * j },
          { x: bounds.min.x + (tileSize.width / 2) * i + tileSize.width, y: bounds.min.y + tileSize.height * (j + 1) }
        );
        // console.log("tileBounds", tileBounds);
        // draw.rect(tileBounds.min, tileBounds.width, tileBounds.height, "green", 1);
        const tile = makeTruchetTriangle(tileBounds, config, i, j, config.closePattern);
        tiles.push(tile);
      }
    }

    return tiles;
  };

  var makeTruchetTriangle = function (tileBounds, config, indexH, indexV, closePattern) {
    var outlineVertices =
      indexH % 2
        ? [
            new Vertex(tileBounds.min.x, tileBounds.min.y),
            new Vertex(tileBounds.max.x, tileBounds.min.y),
            new Vertex(tileBounds.min.x + tileBounds.width / 2, tileBounds.max.y)
          ]
        : [
            new Vertex(tileBounds.min.x + tileBounds.width / 2, tileBounds.min.y),
            new Vertex(tileBounds.max.x, tileBounds.max.y),
            new Vertex(tileBounds.min.x, tileBounds.max.y)
          ];
    var outlinePolygon = new Polygon(outlineVertices);
    var connections = []; // Array<{ line: Line, startVector, endVector, indices : [number,number] } >
    var isConnected = arrayFill(connectorCount, false); // [false, false, false, false, false];
    console.log("isConnected", isConnected);
    var indices = [0, 1, 2, 3, 4, 5]; // TODO: use array_fill here
    arrayShuffle(indices);
    for (var i = 0; i < connectorCount; i++) {
      var start = indices[i];
      if (isConnected[start]) {
        continue;
      }
      var startVector = getTriangleConnectorLocation(tileBounds, outlinePolygon, start, indexV);
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
        var endVector = getTriangleConnectorLocation(tileBounds, outlinePolygon, end, indexV);
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
    if (closePattern) {
      var startVector, endVector;
      // TODO!
      //   if (indexH === 0) {
      //     closeTileAt(tileBounds,outlinePolygon, connections, 6, 7);
      //   }
      //   if (indexH + 1 === config.countH) {
      //     closeTileAt(tileBounds,outlinePolygon, connections, 2, 3);
      //   }
      //   if (indexV === 0) {
      //     closeTileAt(tileBounds,outlinePolygon, connections, 0, 1);
      //   }
      //   if (indexV + 1 === config.countV) {
      //     closeTileAt(tileBounds,outlinePolygon, connections, 4, 5);
      //   }
    }

    // var outlineVertices =
    //   indexV % 2
    //     ? [
    //         new Vertex(tileBounds.min.x, tileBounds.min.y),
    //         new Vertex(tileBounds.max.x, tileBounds.min.y),
    //         new Vertex(tileBounds.min.x + tileBounds.width / 2, tileBounds.max.y)
    //       ]
    //     : [
    //         new Vertex(tileBounds.min.x + tileBounds.width / 2, tileBounds.min.y),
    //         new Vertex(tileBounds.max.x, tileBounds.max.y),
    //         new Vertex(tileBounds.min.x, tileBounds.max.y)
    //       ];
    console.log("outlineVertices", Vertex.utils.arrayToJSON(outlineVertices));
    return { bounds: tileBounds, connections: connections, outlinePolygon: outlinePolygon };
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
  var closeTileAt = function (tileBounds, outlinePolygon, connections, squareConnectorIndexA, squareConnectorIndexB) {
    var startVector = getTriangleConnectorLocation(tileBounds, outlinePolygon, squareConnectorIndexA);
    var endVector = getTriangleConnectorLocation(tileBounds, outlinePolygon, squareConnectorIndexB);
    startVector.inv();
    endVector.inv();

    connections.push({
      line: new Line(startVector, endVector),
      curveSegment: new CubicBezierCurve(startVector.a, endVector.a, startVector.b, endVector.b),
      indices: [squareConnectorIndexA, squareConnectorIndexB]
    });
  };

  // Get the sqare connector vector
  // @return Vector

  var getTriangleConnectorLocation = function (tileBounds, outlinePolygon, connectorIndex, indexV) {
    var vector = getBaseTriangleConnectorLocation(tileBounds, outlinePolygon, connectorIndex);
    if (indexV % 2) {
      vector.a.y = tileBounds.max.y - (vector.a.y - tileBounds.min.y);
      vector.b.y = tileBounds.max.y - (vector.b.y - tileBounds.min.y);
      vector.a.x += tileBounds.width / 2;
      vector.b.x += tileBounds.width / 2;
    }
    return vector;
  };
  var getBaseTriangleConnectorLocation = function (tileBounds, outlinePolygon, connectorIndex) {
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
    }
  };
})(globalThis);
