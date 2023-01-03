/**
 * Some Truchet helper utils.
 *
 * @author  Ikaros Kappler
 * @date    2022-11-06
 * @version 1.0.0
 */

(function (_context) {
  _context.TruchetUtils = {
    // Just checks if two line segmentss do intersect within their bounds.
    doLinesIntersect: function (lineA, lineB) {
      var intersection = lineA.intersection(lineB);
      if (!intersection) {
        return false;
      }
      // TODO: check if only one condition is enough here
      return lineA.hasPoint(intersection, true) && lineB.hasPoint(intersection, true);
    },

    // Line
    // Array<{ line : Line, ... }>
    canConnectLine: function (line, connections) {
      for (var i = 0; i < connections.length; i++) {
        if (TruchetUtils.doLinesIntersect(line, connections[i].line)) {
          return false;
        }
      }
      return true;
    },

    getOrthoConnectorLocation: function (outlinePolygon, sideConnectorCount, connectorIndexA) {
      var sideIndex = Math.floor(connectorIndexA / sideConnectorCount);
      var sideConnectorIndex = connectorIndexA - sideConnectorCount * sideIndex;
      var sideConnectorRatio = (sideConnectorIndex + 1) / (sideConnectorCount + 1);
      var sideLine = new Line(
        outlinePolygon.vertices[sideIndex],
        outlinePolygon.vertices[(sideIndex + 1) % outlinePolygon.vertices.length]
      );
      var connectorStartPoint = sideLine.vertAt(sideConnectorRatio);
      var connectorEndPoint = sideLine.vertAt(sideConnectorRatio + 1 / (sideConnectorCount + 1));
      var parallelVector = new Vector(connectorStartPoint, connectorEndPoint);
      return parallelVector.getOrthogonal();
    },

    getOrthoConnectorLocationNonUniform: function (outlinePolygon, sideConnectorCount, sideIndex, sideConnectorIndex) {
      // console.log(
      //   "outlinePolygon",
      //   outlinePolygon,
      //   "sideConnectorCount",
      //   sideConnectorCount,
      //   "sideIndex",
      //   sideIndex,
      //   "sideConnectorIndex",
      //   sideConnectorIndex
      // );
      // var sideIndex = Math.floor(connectorIndexA / sideConnectorCount);
      // var sideConnectorIndex = connectorIndexA - sideConnectorCount * sideIndex;
      var sideConnectorRatio = (sideConnectorIndex + 1) / (sideConnectorCount + 1);
      var sideLine = new Line(
        outlinePolygon.vertices[sideIndex],
        outlinePolygon.vertices[(sideIndex + 1) % outlinePolygon.vertices.length]
      );
      // console.log(
      //   "sideConnectorIndex",
      //   sideConnectorIndex,
      //   "sideConnectorCount",
      //   sideConnectorCount,
      //   "sideConnectorRatio",
      //   sideConnectorRatio,
      //   "sideConnectorRatio + 1 / (sideConnectorCount + 1)",
      //   sideConnectorRatio + 1 / (sideConnectorCount + 1)
      // );
      var connectorStartPoint = sideLine.vertAt(sideConnectorRatio);
      var connectorEndPoint = sideLine.vertAt(sideConnectorRatio + 1 / (sideConnectorCount + 1));
      var parallelVector = new Vector(connectorStartPoint, connectorEndPoint);
      return parallelVector.getOrthogonal();
    }
  };
})(globalThis);
