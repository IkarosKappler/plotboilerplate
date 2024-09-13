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
        var lineAt = _self.locateMouseOverLine(event);
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
          var currentLineIndex = _self.mouseOverIndex[1];

          _self.extendPolygonSymmetrically(currentLineIndex, closestT);
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
   * @param {number} closestT
   */
  EditableCellPolygon.prototype.extendPolygonSymmetrically = function (currentLineIndex, closestT) {
    var closestLinePoint = this.mouseOverLine.vertAt(closestT);
    var oppositeLineIndex = this.getOppositePointIndex(currentLineIndex);
    // Reverse line!
    var oppositeLine = new Line(this.polygon.getVertexAt(oppositeLineIndex), this.polygon.getVertexAt(oppositeLineIndex - 1));
    var oppositePoint = oppositeLine.vertAt(closestT);
    // console.log("_self.mouseOverIndex", this.mouseOverIndex);
    // Add the larger index at first so we don't mess up local index order.
    if (currentLineIndex > oppositeLineIndex) {
      this.polygon.addVertexAt(closestLinePoint, currentLineIndex);
      this.polygon.addVertexAt(oppositePoint, oppositeLineIndex);
      this.pb.add(closestLinePoint);
      this.pb.add(oppositePoint);
      this.linkPointWithOpposite(oppositeLineIndex);
    } else {
      this.polygon.addVertexAt(oppositePoint, oppositeLineIndex);
      this.polygon.addVertexAt(closestLinePoint, currentLineIndex);
      this.pb.add(oppositePoint);
      this.pb.add(closestLinePoint);
      this.linkPointWithOpposite(currentLineIndex);
    }
  };

  EditableCellPolygon.prototype.linkPointWithOpposite = function (pointIndex) {
    var oppositePointIndex = this.getOppositePointIndex(pointIndex);
    var point = this.polygon.getVertexAt(pointIndex);
    var oppositePoint = this.polygon.getVertexAt(oppositePointIndex);
    (function (pointA, pointB) {
      pointA.listeners.addDragListener(function (event) {
        pointB.add(event.params.dragAmount);
      });
      pointB.listeners.addDragListener(function (event) {
        pointA.add(event.params.dragAmount);
      });
    })(point, oppositePoint);
  };

  EditableCellPolygon.prototype.getOppositePointIndex = function (pointIndex) {
    // This MUST be an integer (vertex count multiple of 2).
    return (pointIndex + Math.round(this.polygon.vertices.length / 2)) % this.polygon.vertices.length;
  };

  EditableCellPolygon.prototype.locateMouseOverLine = function (event) {
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
