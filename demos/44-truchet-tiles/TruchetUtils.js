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

    getOrthoConnectorLocation: function (outlinePolygon, sideConnectorCount, connectorIndexA, connectorIndexB) {
      // Each side has 2 connectors
      // var SIDE_CONNECTOR_COUNT = 2;
      var sideIndex = Math.floor(connectorIndexA / sideConnectorCount);
      var sideConnectorIndex = connectorIndexA - sideConnectorCount * sideIndex;
      var sideConnectorRatio = (sideConnectorIndex + 1) / (sideConnectorCount + 1);
      var sideLine = new Line(
        outlinePolygon.vertices[sideIndex],
        outlinePolygon.vertices[(sideIndex + 1) % outlinePolygon.vertices.length]
      );
      var connectorStartPoint = sideLine.vertAt(sideConnectorRatio);
      // var connectorEndPoint = connectorStartPoint.clone(); // TODO!
      var connectorEndPoint = sideLine.vertAt(sideConnectorRatio + 1 / (sideConnectorCount + 1));
      var parallelVector = new Vector(connectorStartPoint, connectorEndPoint);
      // var isLong = isLongConnection(connectorIndexA, connectorIndexB);
      // console.log("isLong? ", connectorIndexA, connectorIndexB, isLong);
      return parallelVector.getOrthogonal(); //.scale(isLong ? 1.0 : 0.555);
    }
  };
})(globalThis);
