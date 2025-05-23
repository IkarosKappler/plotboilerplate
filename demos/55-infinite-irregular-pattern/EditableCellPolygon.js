/**
 * This class handles any symmetrical polygon in square-based or in hex-bases space.
 *
 *
 * @author  Ikaros Kappler
 * @version 1.0.0
 * @date    2024-09-10
 */

(function (_context) {
  /**
   * The constructor.
   *
   * The passed polygon MUST be a square or rectangle.
   *
   * @param {PlotBoilerplate} pb
   * @param {Polygon} polygon
   * @param {Function} onPolygonChanged
   */
  var EditableCellPolygon = function (pb, polygon, onPolygonChanged) {
    // PlotBoilerplate
    this.pb = pb;
    // Line | null
    this.mouseOverLine = null;
    // [ number, number ]
    this.mouseOverIndex = null;
    // Line | null
    this.mouseOverOppositeLine = null;
    // [ number, number ]
    this.mouseOverOppositeIndex = null;
    // Polygon
    this.polygon = polygon;
    // Function: void
    this.onPolygonChanged = onPolygonChanged;
    // number
    this.polygonCardinality = polygon.vertices.length;
    // Vertex
    this.vertA = polygon.getVertexAt(0);
    // Vertex
    this.vertB = polygon.getVertexAt(1);
    // Vertex
    this.vertC = polygon.getVertexAt(2);
    // Vertex
    this.vertD = polygon.getVertexAt(3);
    // Following vertices are used on hexagons only.
    // Vertex | null
    this.vertE = this.polygonCardinality > 4 ? polygon.getVertexAt(4) : null;
    // Vertex | null
    this.vertF = this.polygonCardinality > 5 ? polygon.getVertexAt(5) : null;

    if (this.isHexagon()) {
      // Hexagon
      this.linePointIndices = [
        [0], // line 0
        [1], // line 1
        [2], // line 2
        [3], // line 3
        [4], // line 4
        [5] // line 5
      ];
    } else {
      // Square
      this.linePointIndices = [
        [0], // line 0
        [1], // line 1
        [2], // line 2
        [3] // line 3
      ];
    }

    var _self = this;
    // Install mouse listener
    new MouseHandler(pb.eventCatcher)
      .drag(function (event) {})
      .move(function (event) {
        // Detect line of hover ...
        var oldIndex = _self.mouseOverIndex;
        var lineAt = _self.locateMouseOverPolygonLine(event);
        if (_self.mouseOverOppositeIndex != null) {
          var pointIndex = _self.linePointIndices[_self.mouseOverOppositeIndex[0]][_self.mouseOverOppositeIndex[1]];
          _self.mouseOverOppositeLine = new Line(
            _self.polygon.getVertexAt(pointIndex),
            _self.polygon.getVertexAt(pointIndex + 1)
          );
        } else {
          _self.mouseOverOppositeLine = null;
        }

        _self.mouseOverLine = lineAt;
        // _self.oppositeMouseOverLine = _self.getOppositeMouseOverLine();
        if (
          oldIndex != _self.mouseOverIndex ||
          (oldIndex != null &&
            _self.mouseOverIndex != null &&
            (oldIndex[0] != _self.mouseOverIndex[0] || oldIndex[1] != _self.mouseOverIndex[1]))
        ) {
          _self.onPolygonChanged();
          _self.pb.redraw();
        }
      })
      // Event Type: XMouseEvent (an extension of the regular MouseEvent)
      .up(function (event) {
        if (!event.params.leftButton || event.params.wasDragged) {
          return;
        }
        // First param: the vertex to add
        // Second param: automatic redraw?
        var relPos = _self.pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
        if (_self.mouseOverLine) {
          // Find closest point on line and add
          var closestT = _self.mouseOverLine.getClosestT(relPos);
          var currentPolygonLineIndex = _self.mouseOverIndex[0];
          _self.extendPolygonSymmetrically(currentPolygonLineIndex, closestT);
          _self.mouseOverIndex = null;
          _self.mouseOverLine = null;
          _self.mouseOverOppositeIndex = null;
          _self.mouseOverOppositeLine = null;
          _self.onPolygonChanged();
          _self.pb.redraw();
        }
      });

    if (this.isHexagon()) {
      this._linkHexPolygonVertices();
    } else {
      this._linkSquarePolygonVertices();
    }
  };

  EditableCellPolygon.prototype.isHexagon = function () {
    return this.polygonCardinality === 6;
  };

  /**
   * Move all sub points of a given polygon line.
   */
  EditableCellPolygon.prototype._moveSublineVertices = function (lineIndex, xAmount, yAmount) {
    for (var i = 1; i < this.linePointIndices[lineIndex].length; i++) {
      this.polygon.getVertexAt(this.linePointIndices[lineIndex][i]).add({ x: xAmount, y: yAmount });
    }
  };

  /**
   * This internal helper function adds drag listeners to the essential
   * four corner vertices of the input SQUARE. If one is moved, the adjacent two edges
   * are moved as well (their sub vertices).
   *
   * This maintains an infinite tiling shape.
   */
  EditableCellPolygon.prototype._linkSquarePolygonVertices = function () {
    var _self = this;
    this.vertA.listeners.addDragListener(function (event) {
      _self.vertB.add({ x: event.params.dragAmount.x, y: 0 });
      _self.vertD.add({ x: 0, y: event.params.dragAmount.y });
      _self._moveSublineVertices(0, event.params.dragAmount.x, 0);
      _self._moveSublineVertices(3, 0, event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
    this.vertB.listeners.addDragListener(function (event) {
      _self.vertA.add({ x: event.params.dragAmount.x, y: 0 });
      _self.vertC.add({ x: 0, y: event.params.dragAmount.y });
      _self._moveSublineVertices(0, event.params.dragAmount.x, 0);
      _self._moveSublineVertices(1, 0, event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
    this.vertC.listeners.addDragListener(function (event) {
      _self.vertD.add({ x: event.params.dragAmount.x, y: 0 });
      _self.vertB.add({ x: 0, y: event.params.dragAmount.y });
      _self._moveSublineVertices(1, event.params.dragAmount.x, event.params.dragAmount.y);
      _self._moveSublineVertices(2, event.params.dragAmount.x, 0);
      _self._moveSublineVertices(3, event.params.dragAmount.x, 0);
      _self.onPolygonChanged();
    });
    this.vertD.listeners.addDragListener(function (event) {
      _self.vertC.add({ x: event.params.dragAmount.x, y: 0 });
      _self.vertA.add({ x: 0, y: event.params.dragAmount.y });
      _self._moveSublineVertices(2, event.params.dragAmount.x, 0);
      _self._moveSublineVertices(3, 0, event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
  };

  /**
   * This internal helper function adds drag listeners to the essential
   * four corner vertices of the input SQUARE. If one is moved, the adjacent two edges
   * are moved as well (their sub vertices).
   *
   * This maintains an infinite tiling shape.
   */
  EditableCellPolygon.prototype._linkHexPolygonVertices = function () {
    var _self = this;
    this.vertA.listeners.addDragListener(function (event) {
      _self.vertD.add({ x: -event.params.dragAmount.x, y: -event.params.dragAmount.y });
      _self._moveSublineVertices(0, event.params.dragAmount.x, event.params.dragAmount.y);
      _self._moveSublineVertices(2, -event.params.dragAmount.x, -event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
    this.vertB.listeners.addDragListener(function (event) {
      _self.vertE.add({ x: -event.params.dragAmount.x, y: -event.params.dragAmount.y });
      _self._moveSublineVertices(1, event.params.dragAmount.x, event.params.dragAmount.y);
      _self._moveSublineVertices(3, -event.params.dragAmount.x, -event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
    this.vertC.listeners.addDragListener(function (event) {
      _self.vertF.add({ x: -event.params.dragAmount.x, y: -event.params.dragAmount.y });
      _self._moveSublineVertices(2, event.params.dragAmount.x, event.params.dragAmount.y);
      _self._moveSublineVertices(4, -event.params.dragAmount.x, -event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
    this.vertD.listeners.addDragListener(function (event) {
      _self.vertA.add({ x: -event.params.dragAmount.x, y: -event.params.dragAmount.y });
      _self._moveSublineVertices(3, event.params.dragAmount.x, event.params.dragAmount.y);
      _self._moveSublineVertices(5, -event.params.dragAmount.x, -event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
    this.vertE.listeners.addDragListener(function (event) {
      _self.vertB.add({ x: -event.params.dragAmount.x, y: -event.params.dragAmount.y });
      _self._moveSublineVertices(4, event.params.dragAmount.x, event.params.dragAmount.y);
      _self._moveSublineVertices(0, -event.params.dragAmount.x, -event.params.dragAmount.y);
      _self.onPolygonChanged();
    });
    this.vertF.listeners.addDragListener(function (event) {
      _self.vertC.add({ x: -event.params.dragAmount.x, y: -event.params.dragAmount.y });
      _self._moveSublineVertices(5, event.params.dragAmount.x, event.params.dragAmount.y);
      _self._moveSublineVertices(1, -event.params.dragAmount.x, -event.params.dragAmount.y);
      _self.onPolygonChanged();
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
   * @param {number} currentPolygonLineIndex - The position (vertex index) where the polygon should be split.
   *   The index indicates the lower point index of the line to be split, means; [index, index+1].
   * @param {number} closestT - The position on the polygon line to add the new vertex. This must be a ratio in [0,1].
   */
  EditableCellPolygon.prototype.extendPolygonSymmetrically = function (currentPolygonLineIndex, closestT) {
    var squarePointIndex = this.locateSquareLinePointIndexByPolygonIndex(currentPolygonLineIndex);

    // console.log("currentPolygonLineIndex", currentPolygonLineIndex, "squarePointIndex", squarePointIndex);
    var closestLinePoint = this.mouseOverLine.vertAt(closestT);
    // [number, number]
    var oppositeSquarePointIndex = this.mouseOverOppositeIndex;
    var oppositePolygonLineIndex = this.linePointIndices[oppositeSquarePointIndex[0]][oppositeSquarePointIndex[1]];
    // Reverse line; on the other (symmetrical) side we want to count from the other end.
    var oppositeLine = new Line(
      this.polygon.getVertexAt(oppositePolygonLineIndex + 1),
      this.polygon.getVertexAt(oppositePolygonLineIndex)
    );
    // Find the respective click point on the other symmetrical side.
    var oppositePoint = oppositeLine.vertAt(closestT);
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
    // console.log("this.linePointIndices", this.linePointIndices);
  };

  /**
   * This method does the actual work and splits the polygon in a manner so it's still
   * a space filling tile after the operation.
   *
   * Each time a vertex is added a second vertex is added as well – on the symmetric 'other'
   * side of the polygon.
   *
   * @param {number} smallerPolygonLineIndex
   * @param {Vertex} smallerPolygonPoint
   * @param {[number,number]} smallerSquarePointIndex
   * @param {number} oppositePolygonLineIndex
   * @param {Vertex} oppositePolygonPoint
   * @param {[number,number]} oppositeSquarePointIndex
   */
  EditableCellPolygon.prototype.addVertexPairToPolygon = function (
    smallerPolygonLineIndex,
    smallerPolygonPoint,
    smallerSquarePointIndex,
    oppositePolygonLineIndex,
    oppositePolygonPoint,
    oppositeSquarePointIndex
  ) {
    this.polygon.addVertexAt(oppositePolygonPoint, oppositePolygonLineIndex + 1);
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
    this.linePointIndices[smallerSquarePointIndex[0]].splice(smallerSquarePointIndex[1] + 1, 0, newSmallerPointIndex);
    this.linePointIndices[oppositeSquarePointIndex[0]].splice(oppositeSquarePointIndex[1] + 1, 0, newOppositePointIndex);

    // Add vertices to visible canvas
    this.pb.add(oppositePolygonPoint);
    this.pb.add(smallerPolygonPoint);
    this.linkPointWithOpposite(oppositePolygonPoint, smallerPolygonPoint);
  };

  /**
   * This internal helper function links two vertices to be moved together. If the one
   * is dragged, then is other is dragged as well – and vice versa.
   * @param {Vertex} point
   * @param {Vertex} oppositePoint
   */
  EditableCellPolygon.prototype.linkPointWithOpposite = function (point, oppositePoint) {
    var _self = this;
    (function (pointA, pointB) {
      pointA.listeners.addDragListener(function (event) {
        pointB.add(event.params.dragAmount);
        _self.onPolygonChanged();
      });
      pointB.listeners.addDragListener(function (event) {
        pointA.add(event.params.dragAmount);
        _self.onPolygonChanged();
      });
    })(point, oppositePoint);
  };

  /**
   * This locates the opposite line-and-point index pair (array with two elements) for
   * any given point index on te polygon.
   *
   * @param {number} polygonPointIndex
   * @returns [number,number] - [squareLineIndex,squarePointIndex]
   */
  EditableCellPolygon.prototype.getOppositeSquarePointIndex = function (polygonPointIndex) {
    var n = this.polygonCardinality;
    var nHalf = Math.round(n / 2);
    // locate line that contains the point
    var squareLineIndex = this.getContainingPolygonLineIndex(polygonPointIndex);
    var oppositeSquareLineIndex = (squareLineIndex + nHalf) % n;
    var oppositeSquarePointIndex = this.linePointIndices[squareLineIndex].indexOf(polygonPointIndex);
    return [oppositeSquareLineIndex, this.linePointIndices[squareLineIndex].length - 1 - oppositeSquarePointIndex];
  };

  /**
   * Find one of the four square's line indices which contains the given point index.
   * @param {} pointIndex
   * @returns
   */
  EditableCellPolygon.prototype.getContainingPolygonLineIndex = function (pointIndex) {
    for (var i = 0; i < this.linePointIndices.length; i++) {
      if (this.linePointIndices[i].includes(pointIndex)) {
        return i;
      }
    }
    return -1;
  };

  /**
   * This helper function locates the line indes on the base square. Means, the returned
   * index is one of 0, 1, 2, or 3. (north, east, south, west).
   *
   * @param {number} polygonLineIndex
   * @returns {number} The line index on the square.
   */
  EditableCellPolygon.prototype.locateSquareLinePointIndexByPolygonIndex = function (polygonLineIndex) {
    var squareLineIndex = this.getContainingPolygonLineIndex(polygonLineIndex);
    var squarePointIndex = this.linePointIndices[squareLineIndex].indexOf(polygonLineIndex);
    return [squareLineIndex, squarePointIndex];
  };

  /**
   * Locates the line near to the given event's pointer location.
   *
   * Note that this method also modifies a class attributea (mouseOverIndex).
   *
   * @param {XMouseEvent} event
   * @returns
   */
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
      var newDist = line.pointDistance(transformedPosition);
      if (line.hasPoint(transformedPosition, false, 20) && newDist < lineDistance) {
        // Keep clear from corners
        var t = line.getClosestT(transformedPosition);
        if (t < 0.05 || t > 0.95) {
          continue;
        }
        lineDistance = newDist;
        lineIndex = [i, j];
        lineFound = true;
      }
    }
    if (lineFound) {
      this.mouseOverIndex = lineIndex;
      this.mouseOverOppositeIndex = this.getOppositeSquarePointIndex(this.mouseOverIndex[0]);
      line.a.set(this.polygon.vertices[lineIndex[0]]);
      line.b.set(this.polygon.vertices[lineIndex[1]]);

      return line;
    } else {
      this.mouseOverIndex = null;
      this.mouseOverOppositeIndex = null;
      return null;
    }
  };

  EditableCellPolygon.prototype.destroy = function () {
    // TODO: remove all listeners
  };

  _context.EditableCellPolygon = EditableCellPolygon;
})(globalThis);
