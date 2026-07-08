/**
 * An iterator to get n random points inside a bounding box.
 *
 * @requires PointIterator
 *
 * @date   2026-05-22
 * @author Ikaros Kappler
 */

(function (_context) {
  _context.PointIterator.Random = function (box, pointCount) {
    PointIterator.call(this, box, pointCount);
  };
  Object.assign(_context.PointIterator.Random.prototype, _context.PointIterator.prototype);

  _context.PointIterator.Random.prototype.next = function () {
    // console.log("Next", this.currentPointIndex);
    if (!this.hasNext()) {
      return (this.currentPoint = null);
    }

    this.currentPointIndex++;
    return (this.currentPoint = this.box.randomPoint(0, 0));
  };
})(globalThis);
