/**
 * @date 2024-09-10
 */

(function (_context) {
  var EditableCellPolygon = function (pb, polygon, options) {
    this.pb = pb;
    // Line | null
    this.mouseOverLine = null;
    // [ number, number ]
    this.mouseOverIndex = null;
    this.polygon = polygon;

    this.linePointIndices = [
      [0], // line 0
      [1], // line 1
      [2], // line 2
      [3] // line 3
    ];

    // // Link all initial vertices with their opposite
    // for (var i = 0; i < this.polygon.vertices.length / 2; i++) {
    //   this.linkPointWithOpposite(i);
    // }

    var _self = this;
    // Install mouse listener
    new MouseHandler(pb.eventCatcher)
      .drag(function (event) {})
      .move(function (event) {
        // console.log("dr");

        // Detect line of hover ...
        var oldIndex = _self.mouseOverIndex;
        var lineAt = _self.locateMouseOverPolygonLine(event);
        _self.mouseOverLine = lineAt;
        if (
          oldIndex != _self.mouseOverIndex ||
          (oldIndex != null &&
            _self.mouseOverIndex != null &&
            (oldIndex[0] != _self.mouseOverIndex[0] || oldIndex[1] != _self.mouseOverIndex[1]))
        ) {
          // console.log("Redraw");
          _self.pb.redraw();
        }
      })
      // Event Type: XMouseEvent (an extension of the regular MouseEvent)
      .up(function (event) {
        console.log("event.offsetX", event.offsetX);
        console.log("Clicked", event.params);
        if (!event.params.leftButton || event.params.wasDragged) {
          return;
        }
        // First param: the vertex to add
        // Second param: automatic redraw?
        var relPos = _self.pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
        // _self.pb.add(new Vertex(relPos), false);
        if (_self.mouseOverLine) {
          // Find closest point on line and add
          var closestT = _self.mouseOverLine.getClosestT(relPos);
          var currentPolygonLineIndex = _self.mouseOverIndex[0];

          _self.extendPolygonSymmetrically(currentPolygonLineIndex, closestT);
          _self.mouseOverIndex = null;
          _self.mouseOverLine = null;
          _self.pb.redraw();
        }
      });
  };

  /**
   * Assuming the polygon has 2n vertices it can always be symmetrically extened by adding two points:
   *  - one at some arbitrary polygon line.
   *  - ona at the line of the 'opposite' side of the polygon.
   *
   * This maintains the invariant of 2(n+1) vertices and if those points are linked by their relative
   * positions inside the line, then the polygon always stays a plane filling one.
   *
   * @param {number} closestT - The position on the polygon line to add the new vertex.
   */
  EditableCellPolygon.prototype.extendPolygonSymmetrically = function (currentPolygonLineIndex, closestT) {
    var squarePointIndex = this.locateSquareLinePointIndexByPolygonIndex(currentPolygonLineIndex);

    console.log("currentPolygonLineIndex", currentPolygonLineIndex, "squarePointIndex", squarePointIndex);
    var closestLinePoint = this.mouseOverLine.vertAt(closestT);
    var oppositeSquarePointIndex = this.getOppositeSquarePointIndex(currentPolygonLineIndex);
    var oppositePolygonLineIndex = this.linePointIndices[oppositeSquarePointIndex[0]][oppositeSquarePointIndex[1]];
    // Reverse line!
    var oppositeLine = new Line(
      this.polygon.getVertexAt(oppositePolygonLineIndex + 1),
      this.polygon.getVertexAt(oppositePolygonLineIndex)
    );
    console.log(
      "currentPolygonLineIndex",
      currentPolygonLineIndex,
      "oppositeSquarePointIndex",
      oppositeSquarePointIndex,
      "oppositePolygonLineIndex",
      oppositePolygonLineIndex
    );
    var oppositePoint = oppositeLine.vertAt(closestT);
    // console.log("_self.mouseOverIndex", this.mouseOverIndex);
    // Add the larger index at first so we don't mess up local index order.
    if (currentPolygonLineIndex < oppositePolygonLineIndex) {
      this.addVertexPairToPolygon(
        currentPolygonLineIndex,
        closestLinePoint,
        squarePointIndex,
        oppositePolygonLineIndex,
        oppositePoint,
        oppositeSquarePointIndex
      );
    } else {
      this.addVertexPairToPolygon(
        oppositePolygonLineIndex,
        oppositePoint,
        oppositeSquarePointIndex,
        currentPolygonLineIndex,
        closestLinePoint,
        squarePointIndex
      );
    }
    console.log("this.linePointIndices", this.linePointIndices);
  };

  EditableCellPolygon.prototype.addVertexPairToPolygon = function (
    smallerPolygonLineIndex,
    smallerPolygonPoint,
    squarePointIndex,
    oppositePolygonLineIndex,
    oppositePolygonPoint,
    oppositeSquarePointIndex
  ) {
    this.polygon.addVertexAt(oppositePolygonPoint, oppositePolygonLineIndex + 1);
    // this.polygon.addVertexAt(oppositePolygonPoint, oppositePolygonLineIndex + 1);
    this.polygon.addVertexAt(smallerPolygonPoint, smallerPolygonLineIndex + 1);
    var newSmallerPointIndex = smallerPolygonLineIndex + 1;
    var newOppositePointIndex = oppositePolygonLineIndex + 2;
    // Update current map
    for (var i = 0; i < this.linePointIndices.length; i++) {
      for (var j = 0; j < this.linePointIndices[i].length; j++) {
        if (this.linePointIndices[i][j] >= newSmallerPointIndex) {
          this.linePointIndices[i][j]++;
        }
        if (this.linePointIndices[i][j] >= newOppositePointIndex) {
          this.linePointIndices[i][j]++;
        }
      }
    }
    // Also add to index map
    this.linePointIndices[squarePointIndex[0]].splice(squarePointIndex[1] + 1, 0, newSmallerPointIndex);
    this.linePointIndices[oppositeSquarePointIndex[0]].splice(oppositeSquarePointIndex[1] + 1, 0, newOppositePointIndex);

    // Add vertices to visible canvas
    this.pb.add(oppositePolygonPoint);
    this.pb.add(smallerPolygonPoint);
    // this.linkPointWithOpposite(newSmallerPointIndex, newOppositePointIndex);
    this.linkPointWithOpposite(oppositePolygonPoint, smallerPolygonPoint);
  };

  // EditableCellPolygon.prototype.linkPointWithOpposite = function (pointIndex, oppositePointIndex) {
  EditableCellPolygon.prototype.linkPointWithOpposite = function (point, oppositePoint) {
    // console.log("[linkPointWithOpposite] pointIndex", pointIndex, "oppositePointIndex", oppositePointIndex);
    // var point = this.polygon.getVertexAt(pointIndex);
    // var oppositePoint = this.polygon.getVertexAt(oppositePointIndex);
    (function (pointA, pointB) {
      pointA.listeners.addDragListener(function (event) {
        pointB.add(event.params.dragAmount);
        console.log("pointA moved");
      });
      pointB.listeners.addDragListener(function (event) {
        pointA.add(event.params.dragAmount);
        console.log("pointB moved");
      });
    })(point, oppositePoint);
  };

  EditableCellPolygon.prototype.getOppositePointIndex = function (pointIndex) {
    // This MUST be an integer (vertex count multiple of 2).
    return (pointIndex + Math.round(this.polygon.vertices.length / 2)) % this.polygon.vertices.length;
  };

  /**
   *
   * @param {*} pointIndex
   * @returns [number,number] - [squareLineIndex,squarePointIndex]
   */
  EditableCellPolygon.prototype.getOppositeSquarePointIndex = function (pointIndex) {
    // This MUST be an integer (vertex count multiple of 2).
    // return (pointIndex + Math.round(this.polygon.vertices.length / 2)) % this.polygon.vertices.length;
    // A) locate line that contains the point
    var squareLineIndex = this.getContainingSquareIndex(pointIndex);
    var oppositeSquareLineIndex = (squareLineIndex + 2) % 4;
    var oppositeSquarePointIndex = this.linePointIndices[squareLineIndex].indexOf(pointIndex);
    // return [oppositeSquareLineIndex, oppositeSquarePointIndex];
    return [oppositeSquareLineIndex, this.linePointIndices[squareLineIndex].length - 1 - oppositeSquarePointIndex];
  };

  /**
   * Find one of the four square's line indices which contains the given point index.
   * @param {} pointIndex
   * @returns
   */
  EditableCellPolygon.prototype.getContainingSquareIndex = function (pointIndex) {
    for (var i = 0; i < this.linePointIndices.length; i++) {
      if (this.linePointIndices[i].includes(pointIndex)) {
        return i;
      }
    }
    return -1;
  };

  EditableCellPolygon.prototype.locateSquareLinePointIndexByPolygonIndex = function (polygonLineIndex) {
    var squareLineIndex = this.getContainingSquareIndex(polygonLineIndex);
    var squarePointIndex = this.linePointIndices[squareLineIndex].indexOf(polygonLineIndex);
    return [squareLineIndex, squarePointIndex];
  };

  EditableCellPolygon.prototype.locateMouseOverPolygonLine = function (event) {
    var transformedPosition = this.pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
    var line = new Line(new Vertex(), new Vertex());
    var lineDistance = Number.MAX_VALUE;
    var lineIndex = null; // [ number, number ]
    var lineFound = false;
    for (var i = 0; i + 1 < this.polygon.vertices.length || (!this.polygon.isOpen && i < this.polygon.vertices.length); i++) {
      var j = (i + 1) % this.polygon.vertices.length;
      line.a.set(this.polygon.vertices[i]);
      line.b.set(this.polygon.vertices[j]);
      // if (newDist < 5 && newDist < lineDistance) {
      var newDist = line.pointDistance(transformedPosition);
      if (line.hasPoint(transformedPosition, false, 20) && newDist < lineDistance) {
        // Keep clear from corners
        var t = line.getClosestT(transformedPosition);
        if (t < 0.05 || t > 0.95) {
          continue;
        }
        // this.mouseOverLine = line;
        lineDistance = newDist;
        lineIndex = [i, j];
        lineFound = true;
      }
    }
    if (lineFound) {
      this.mouseOverIndex = lineIndex;
      line.a.set(this.polygon.vertices[lineIndex[0]]);
      line.b.set(this.polygon.vertices[lineIndex[1]]);

      return line;
    } else {
      this.mouseOverIndex = null;
      return null;
    }
  };

  _context.EditableCellPolygon = EditableCellPolygon;
})(globalThis);
