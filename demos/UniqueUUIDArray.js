/**
 * An array that cannot contain duplicates.
 */

(function (_context) {
  _context.UniqueUUIDArray = function () {
    // some other properties and methods
  };

  UniqueUUIDArray.prototype = new Array();
  UniqueUUIDArray.prototype.addUnique = function (elementWidthUUID) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] === elementWidthUUID || this[i].uid == elementWidthUUID.uid) {
        return false;
      }
    }
    this.push(elementWidthUUID);
    return true;
  };
})(globalThis);
