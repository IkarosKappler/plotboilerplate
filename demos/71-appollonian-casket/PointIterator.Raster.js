/**
 * An iterator to get n points inside a bounding box, aligned on a rectangular raster.
 *
 * @requires PointIterator
 *
 * @date   2026-05-22
 * @author Ikaros Kappler
 */

(function (_context) {
  _context.PointIterator.Raster = function (box, pointCount) {
    PointIterator.call(this, box, pointCount);
    var ratio = box.width / box.height;
    // var root = Math.sqrt(box.width * box.height);
    var root = Math.sqrt(pointCount);
    this.hCount = root * ratio;
    this.vCount = root / ratio;
    this.hSize = box.width / this.hCount;
    this.vSize = box.height / this.vCount;
    // console.log(
    //   "box.width",
    //   box.width,
    //   "box.height",
    //   box.height,
    //   "pointCount",
    //   pointCount,
    //   "ratio",
    //   ratio,
    //   "root",
    //   root,
    //   "this.hCount",
    //   this.hCount,
    //   "this.vCount",
    //   this.vCount,
    //   "this.hSize",
    //   this.hSize,
    //   "this.vSize",
    //   this.vSize
    // );
  };
  Object.assign(_context.PointIterator.Raster.prototype, _context.PointIterator.prototype);

  _context.PointIterator.Raster.prototype.next = function () {
    // console.log("Next", this.currentPointIndex);
    if (!this.hasNext()) {
      return (this.currentPoint = null);
    }

    this.currentPointIndex++;

    var y = Math.floor(this.currentPointIndex / this.hCount);
    var x = Math.floor(this.currentPointIndex % this.hCount);

    return (this.currentPoint = new Vertex(this.box.min.x + x * this.hSize, this.box.min.y + y * this.vSize));
  };
})(globalThis);
