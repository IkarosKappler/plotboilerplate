/**
 * A simple listener/handler to detect mouse clicks on shapes (Bounds or Polygons).
 *
 * @author  Ikaros Kappler
 * @date    2025-10-18
 * @version 1.0.0
 */

(function (_context) {
  var ShapeMouseHandler = function (pb) {
    this.pb = pb;
    this.mouseHandler = new MouseHandler(pb.eventCatcher);
    this.mouseHandler.click(this.__handleClick);
    this.shapes = [];
    this.listeners = [];
  };

  ShapeMouseHandler.prototype.addShape = function (bounds) {
    this.shapes.push(bounds);
  };

  ShapeMouseHandler.prototype.destroy = function () {
    // TODO
  };

  ShapeMouseHandler.prototype.addClickListener = function (listener) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i] === listener) {
        return false;
      }
    }
    this.listeners.push(listener);
    return true;
  };

  ShapeMouseHandler.prototype.removeClickListener = function (listener) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i] === listener) {
        this.listeners.splice(i, 1);
        return true;
      }
    }
    return false;
  };

  ShapeMouseHandler.prototype.__handleClick = function (event) {
    var relPos = this.pb.transformMousePosition(event.params.pos.x, event.params.pos.y);
    // Check all shapes if they contain the click position.
    var result = this.shapes.filter(function (bounds) {
      return bounds.containsVert(relPos);
    });
    if (result.length === 0) {
      return;
    }
    this.__fireEvent(result);
  };

  ShapeMouseHandler.prototype.__fireEvent = function (results) {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i](results);
    }
  };

  _context.ShapeMouseHandler = ShapeMouseHandler;
})(globalThis);
