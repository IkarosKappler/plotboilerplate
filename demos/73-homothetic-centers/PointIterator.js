/**
 * An iterator to get n points inside a bounding box.
 *
 * @abstract
 * @date   2026-05-22
 * @author Ikaros Kappler
 */

(function (_context) {
  _context.PointIterator = function (box, pointCount) {
    this.box = box;
    this.pointCount = pointCount;
    this.currentPointIndex = 0;
    this.currentPoint = null;
  };

  _context.PointIterator.prototype.hasNext = function () {
    return this.currentPointIndex < this.pointCount;
  };

  _context.PointIterator.prototype.next = function () {
    throw "This is an abstract class, please implement the `next()` method in your own subclass.";
  };
})(globalThis);
