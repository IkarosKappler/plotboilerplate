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

    var _self = this;
    // Install mouse listener
    new MouseHandler(pb.eventCatcher)
      .drag(function (event) {})
      .move(function (event) {
        console.log("dr");

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
          console.log("Redraw");
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
          var closestLinePoint = _self.mouseOverLine.getClosestPoint(relPos);
          var clonsesLinePointPartner = closestLinePoint.clone();
          // _self.pb.add(new Vertex(relPos), false);
          console.log("_self.mouseOverIndex", _self.mouseOverIndex);
          _self.polygon.addVertexAt(closestLinePoint, _self.mouseOverIndex[1]);
          _self.polygon.addVertexAt(
            clonsesLinePointPartner,
            _self.mouseOverIndex[1] + 1 + (_self.polygon.vertices.length - 1) / 2
          );
          _self.pb.add(closestLinePoint);
          _self.pb.add(clonsesLinePointPartner);
          _self.mouseOverIndex = null;
          _self.mouseOverLine = null;
          _self.pb.redraw();
        }
      });
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
